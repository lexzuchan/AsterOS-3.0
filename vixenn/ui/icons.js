// Original geometric icons, rendered only from static trusted paths.
const iconPaths={
vixenn:'<path d="m3 3 6 5 3 8 3-8 6-5-4 15-5 3-5-3Z"/><path d="m9 8 3 2 3-2M12 16v5"/>',
plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',square:'<rect x="5" y="5" width="14" height="14" rx="2"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',
left:'<path d="m10 5-7 7 7 7M3 12h18"/>',right:'<path d="m14 5 7 7-7 7M3 12h18"/>',arrowUpRight:'<path d="M6 18 18 6M6 6h12v12"/>',
reload:'<path d="M20 10a8 8 0 1 0-1 8M20 4v6h-6"/>',home:'<path d="m3 10 9-7 9 7v10H3ZM9 20v-7h6v7"/>',
globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',bookmark:'<path d="M6 3h12v18l-6-4-6 4Z"/>',history:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v6l4 2"/>',
download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',shield:'<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z"/><path d="m8 12 3 3 5-6"/>',sliders:'<path d="M4 7h6m6 0h4M4 17h2m6 0h8"/><circle cx="13" cy="7" r="3"/><circle cx="9" cy="17" r="3"/>',
grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h7v7h-7Z"/>',search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
play:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z"/>',chat:'<path d="M4 4h16v12H9l-5 4Z"/><path d="M8 9h8M8 12h5"/>',book:'<path d="M12 5v16M3 3c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 3-2-3-5-4-9-3Z"/>',layers:'<path d="m12 2 10 6-10 6L2 8ZM2 12l10 6 10-6M2 16l10 6 10-6"/>',warning:'<path d="m12 3 10 18H2ZM12 9v5M12 17h.01"/>'};
function setIcon(node,name){if(!node)return;node.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(iconPaths[name]||iconPaths.globe)+'</svg>';}
document.querySelectorAll('[data-icon]').forEach(node=>{setIcon(node,node.dataset.icon);if(node.tagName==='BUTTON'&&!node.getAttribute('aria-label'))node.setAttribute('aria-label',node.title||node.dataset.icon);});
