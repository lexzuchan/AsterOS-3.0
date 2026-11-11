const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {createProtection,upgradeURL,dangerousDownload}=require('../protection');
const protection=createProtection(path.join(__dirname,'../filters'));
test('bundled lists load and block ad and tracking requests',()=>{
  assert.equal(protection.info.ready,true);
  for(const url of ['https://googleads.g.doubleclick.net/pagead/ads','https://www.google-analytics.com/analytics.js']) assert.equal(protection.shouldBlock({url,resourceType:'script',referrer:'https://example.com/'}),true,url);
  assert.equal(protection.shouldBlock({url:'https://example.com/app.js',resourceType:'script',referrer:'https://example.com/'}),false);
  assert.equal(protection.shouldBlock({url:'https://googleads.g.doubleclick.net/',resourceType:'mainFrame'}),false);
});
test('request interceptor cancels matched requests and counts only blocks',()=>{
  const handlers={};const profile={webRequest:{onBeforeRequest:(_filter,fn)=>handlers.request=fn,onBeforeSendHeaders:fn=>handlers.headers=fn},setPermissionRequestHandler:fn=>handlers.permission=fn,setPermissionCheckHandler:fn=>handlers.check=fn,setDevicePermissionHandler:fn=>handlers.device=fn};
  protection.attach(profile);const before=protection.info.blocked;
  handlers.request({url:'https://www.google-analytics.com/analytics.js',resourceType:'script',referrer:'https://example.com'},result=>assert.equal(result.cancel,true));
  handlers.request({url:'https://example.com/app.js',resourceType:'script'},result=>assert.equal(result.cancel,false));
  assert.equal(protection.info.blocked,before+1);
  handlers.headers({requestHeaders:{Accept:'*/*'}},result=>{assert.equal(result.requestHeaders['Sec-GPC'],'1');assert.equal(result.requestHeaders.Accept,'*/*');});
  handlers.permission(null,'media',allowed=>assert.equal(allowed,false));assert.equal(handlers.check(),false);assert.equal(handlers.device(),false);
});
test('public HTTP is upgraded without breaking local development',()=>{
  assert.equal(upgradeURL('http://example.com/path?q=1'),'https://example.com/path?q=1');
  for(const url of ['http://localhost:3000/','http://127.0.0.1:8000/','http://[::1]:8080/','https://example.com/'])assert.equal(upgradeURL(url),url);
});
test('executable and script downloads are blocked regardless of letter case',()=>{
  for(const name of ['setup.EXE','update.msi','photo.jpg.exe','script.ps1','document.pdf.lnk','plugin.dll','script.Js','setup.exe. ','payload.cmd...'])assert.equal(dangerousDownload(name),true,name);
  for(const name of ['picture.png','report.pdf','source.zip'])assert.equal(dangerousDownload(name),false,name);
});
test('filter load failure is visible and does not claim protection',()=>{
  const original=console.error;console.error=()=>{};
  try{const failed=createProtection(path.join(__dirname,'missing'));assert.equal(failed.info.ready,false);assert.ok(failed.info.error);assert.equal(failed.shouldBlock({url:'https://example.com'}),false);}finally{console.error=original;}
});
