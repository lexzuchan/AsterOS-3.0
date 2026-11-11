const fs = require('node:fs');
const path = require('node:path');
const { FiltersEngine, Request } = require('@ghostery/adblocker');
const types = {mainFrame:'main_frame',subFrame:'sub_frame',stylesheet:'stylesheet',script:'script',image:'image',font:'font',object:'object',xhr:'xmlhttprequest',ping:'ping',webSocket:'websocket',media:'media',other:'other'};
const riskyExtension = /\.(exe|msi|msix|appx|com|scr|bat|cmd|ps1|vbs|vbe|js|jse|wsf|wsh|hta|lnk|reg|iso|img|dll|cpl)\s*$/i;
function dangerousDownload(name) { return riskyExtension.test(String(name).replace(/[.\s]+$/g,'')); }
function isLocal(host) { return host==='localhost'||host.endsWith('.localhost')||host==='127.0.0.1'||host==='[::1]'; }
function upgradeURL(value) { try {const url=new URL(value);if(url.protocol==='http:'&&!isLocal(url.hostname)){url.protocol='https:';return url.href;}}catch{}return value; }
function createProtection(directory, changed = () => {}) {
  const info={enabled:true,ready:false,blocked:0,blockedDownloads:0,version:'',error:''};
  let engine;
  try {
    const lists=['easylist.txt','easyprivacy.txt'].map(name=>fs.readFileSync(path.join(directory,name),'utf8'));
    engine=FiltersEngine.parse(lists.join('\n'),{loadCosmeticFilters:false});
    info.version=lists.map(text=>text.match(/^! Version: (.+)$/m)?.[1]?.trim()||'unknown').join(' / ');
    info.ready=true;
  } catch(error) {info.error='Filter lists could not be loaded. Ad blocking is unavailable.';console.error(error);}
  function shouldBlock(details) {
    if(!info.enabled||!engine||details.resourceType==='mainFrame')return false;
    const sourceUrl=details.initiator||details.referrer||details.webContents?.getURL?.()||'';
    return engine.match(Request.fromRawDetails({url:details.url,sourceUrl,type:types[details.resourceType]||'other'})).match;
  }
  function attach(profile) {
    profile.webRequest.onBeforeRequest({urls:['http://*/*','https://*/*','ws://*/*','wss://*/*']},(details,callback)=>{
      try {if(shouldBlock(details)){info.blocked++;changed();return callback({cancel:true});}callback({cancel:false});}
      catch(error){console.error('Filter matching failed',error);callback({cancel:false});}
    });
    profile.webRequest.onBeforeSendHeaders((details,callback)=>{callback({requestHeaders:{...details.requestHeaders,'Sec-GPC':'1'}});});
    profile.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
    profile.setPermissionCheckHandler(()=>false);
    profile.setDevicePermissionHandler(()=>false);
  }
  return {info,attach,shouldBlock};
}
module.exports={createProtection,dangerousDownload,upgradeURL};
