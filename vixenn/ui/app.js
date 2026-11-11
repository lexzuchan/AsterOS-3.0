const $=id=>document.getElementById(id);
const api=window.vixenn;
let current;
const act=(name,value)=>api.action(name,value).catch(console.error);
function element(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
function render(state){
  current=state;
  const tab=state.tabs.find(t=>t.id===state.active);
  document.documentElement.style.setProperty('--accent',({violet:'#a479ff',crimson:'#ff6286',cyan:'#66dedb'})[state.accent]);
  $('tabs').replaceChildren(...state.tabs.map(t=>{const item=element('div',undefined,'tab'+(t.id===state.active?' active':''));const label=element('button',(t.loading?'Loading · ':'')+t.title,'tab-label');label.title=t.title;label.onclick=()=>act('select',t.id);const close=element('button',undefined,'tab-close');setIcon(close,'close');close.title='Close tab';close.setAttribute('aria-label','Close '+t.title);close.onclick=()=>act('close',t.id);item.append(label,close);return item;}));
  if(document.activeElement!==$('address'))$('address').value=tab?.url||'';
  $('back').disabled=!state.canBack;$('forward').disabled=!state.canForward;
  setIcon($('reload'),tab?.loading?'close':'reload');$('reload').dataset.action=tab?.loading?'stop':'reload';
  $('star').classList.toggle('saved',state.bookmarks.some(b=>b.url===tab?.url));
  setIcon($('protocol'),tab?.url?.startsWith('https:')?'lock':tab?.url?'warning':'globe');
  $('protocol').title=tab?.url?.startsWith('https:')?'HTTPS connection — encryption does not guarantee a trustworthy site':'Connection information';
  const protection=state.protection;
  $('protection-status').textContent=protection?.ready?'Ad & tracker blocking active':'Ad blocking unavailable';
  $('protection-detail').textContent=protection?.ready?'EasyList + EasyPrivacy · network filtering':protection?.error||'Filters are not loaded';
  $('blocked-count').textContent=(protection?.blocked||0).toLocaleString();
  $('tab-count').textContent=String(state.tabs.length).padStart(2,'0');
  $('home').hidden=!!tab?.url||!!state.panel;$('panel').hidden=!state.panel;
  $('status').textContent=tab?.error?'PAGE ERROR · '+tab.error:tab?.loading?'CONNECTING…':tab?.url?'READY':'READY TO EXPLORE';
  document.querySelectorAll('aside [data-panel]').forEach(b=>b.classList.toggle('selected',b.dataset.panel===state.panel));
  if(state.panel)renderPanel(state);
}
function renderPanel(s){
  $('panel-title').textContent=s.panel[0].toUpperCase()+s.panel.slice(1);
  const body=$('panel-body');body.replaceChildren();
  if(s.panel==='protection'){
    const p=s.protection||{};
    const summary=element('div',undefined,'protection-summary');const icon=element('span');setIcon(icon,'shield');const text=element('div');text.append(element('h3',p.ready?'A quieter web. A stronger boundary.':'Ad blocking unavailable'),element('p',p.ready?'Ads and trackers are filtered before matching requests reach the network.':p.error||'Filter engine is not ready.'));summary.append(icon,text);body.append(summary);
    const stats=element('div',undefined,'privacy-grid');for(const [value,label] of [[p.blocked||0,'Ad / tracker requests blocked this session'],[p.blockedDownloads||0,'Executable / script downloads stopped']]){const card=element('div',undefined,'privacy-stat');card.append(element('strong',String(value)),element('small',label));stats.append(card);}body.append(stats);
    for(const [iconName,title,detail] of [['shield','Bundled filter lists',`EasyList + EasyPrivacy. Snapshot versions: ${p.version||'unavailable'}. Network filtering only; some ads and empty spaces may remain.`],['lock','HTTPS navigation','Public HTTP destinations are upgraded to HTTPS. Invalid certificates are rejected. Localhost remains available over HTTP; there is no automatic public HTTP fallback.'],['layers','Isolated website processes','Sandboxing and context isolation enabled. Websites have no Node.js access or privileged app bridge.'],['sliders','Private permissions by default','Camera, microphone, location, notifications, and device permissions are denied. Global Privacy Control (Sec-GPC: 1) is sent; site compliance varies.'],['download','Guarded downloads','Executable and script extensions are blocked. Other downloads ask where to save. Files are never opened automatically.']]){const row=element('div',undefined,'protection-item');const icon=element('span');setIcon(icon,iconName);const copy=element('div');copy.append(element('strong',title),element('p',detail));row.append(icon,copy);body.append(row);}
    body.append(element('p','These protections reduce risk; they do not guarantee safety. There is no phishing reputation service, antivirus scanning, or automatic browser / filter updater yet. Archives can contain dangerous files. Keep Vixenn and its filter snapshots updated.','protection-note'));return;
  }
  if(s.panel==='settings'){
    const appearance=element('div',undefined,'setting');appearance.append(element('h3','Make it yours'),element('p','Choose your accent. Your preferences are saved on this device.'));
    for(const name of ['violet','crimson','cyan']){const b=element('button',name.toUpperCase()+(s.accent===name?' ✓':''));b.onclick=()=>act('accent',name);appearance.append(b);}body.append(appearance);
    const privacy=element('div',undefined,'setting');privacy.append(element('h3','Your browsing data'),element('p','Bookmarks and up to 500 history entries are stored locally. Website cookies use a persistent local profile.'));
    const clear=element('button','Clear browsing history');clear.onclick=()=>act('clearHistory');privacy.append(clear);body.append(privacy);
    const protection=element('div',undefined,'setting');protection.append(element('h3','Protection center'),element('p','Review filtering, HTTPS navigation, blocked requests, and download protection.'));const open=element('button','View protection');open.onclick=()=>act('panel','protection');protection.append(open);body.append(protection);
    const about=element('div',undefined,'setting');about.append(element('h3','Vixenn / 0.2.0'),element('p','An independent desktop browser powered by Chromium and Blink. Ctrl+L address · Ctrl+T new tab · Ctrl+W close · Ctrl+Tab switch · Ctrl+D bookmark · F11 fullscreen.'),element('p','Early development build. Chrome extensions, password management, automatic updates, and DRM streaming are not implemented. Site permissions such as camera, microphone, and location are currently blocked.'));body.append(about);return;
  }
  const items=s[s.panel]||[];
  if(!items.length){body.append(element('p',({bookmarks:'Your next favorite place is waiting. Press ☆ on a website to save it.',history:'A fresh start. Your visited pages will appear here.',downloads:'Downloads will appear here when you save a file.'})[s.panel],'empty'));return;}
  for(const item of items){const row=element('div',undefined,'row');const b=element(s.panel==='downloads'?'div':'button');b.append(element('strong',item.title||item.name||item.url),element('small',s.panel==='downloads'?item.status+' · '+Math.round(item.received/1024)+' KB':item.url));if(s.panel!=='downloads')b.onclick=()=>act('navigate',item.url);row.append(b);body.append(row);}
}
document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.action)act(b.dataset.action);if(b.dataset.panel)act('panel',b.dataset.panel);if(b.dataset.url)act('navigate',b.dataset.url);});
$('address-form').onsubmit=event=>{event.preventDefault();act('navigate',$('address').value);$('address').blur();};
$('search-form').onsubmit=event=>{event.preventDefault();act('navigate',$('search').value);};
$('panel-close').onclick=()=>act('panel',null);
$('address').onfocus=()=> $('address').select();
$('date').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'}).toUpperCase();
api.onState(render);api.onFocusAddress(()=>{$('address').focus();$('address').select();});
act('ready').then(render);
