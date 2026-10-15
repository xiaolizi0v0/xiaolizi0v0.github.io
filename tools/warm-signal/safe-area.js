/* Device-only layout preferences; never read or change the player's game save. */
(function(root){
 'use strict';
 const modes=['auto','camera','island','off'],key='warm-signal-screen-fit-v1';
 function fallback({mode='auto',platform='',ua='',width=0,height=0,screenWidth=0,screenHeight=0,keyboard=false}){
  if(mode==='off')return {top:0,right:0,bottom:0,left:0};
  const manual=mode==='camera'||mode==='island';
  const mobile=/Android|iPhone|iPad|iPod/i.test(ua);
  const embedded=platform==='taptap'||/TapTap/i.test(ua);
  // A host that already insets its WebView must not receive a second guessed inset.
  const full=width>0&&height>0&&Math.abs(width-screenWidth)<8&&Math.abs(height-screenHeight)<8;
  if(!manual&&!(mobile&&embedded&&full))return {top:0,right:0,bottom:0,left:0};
  const island=mode==='island'||(mode==='auto'&&/iPhone|iPad|iPod/i.test(ua));
  const top=island?59:44,bottom=keyboard?0:(island?34:24);
  return width>height?{top:0,right:top,bottom:keyboard?0:21,left:top}:{top,right:0,bottom,left:0};
 }
 if(typeof module==='object'&&module.exports){module.exports={fallback};return;}
 const doc=root.document,html=doc.documentElement;
 let mode='auto';try{const saved=root.localStorage.getItem(key);if(modes.includes(saved))mode=saved;}catch(_){}
 function sync(){
  const vv=root.visualViewport;
  const keyboard=!!vv&&root.innerHeight-vv.height>120&&/^(INPUT|TEXTAREA)$/.test(doc.activeElement?.tagName||'');
  const f=fallback({mode,platform:html.dataset.platform,ua:root.navigator.userAgent,width:root.innerWidth,height:root.innerHeight,screenWidth:root.screen.width,screenHeight:root.screen.height,keyboard});
  html.dataset.screenFit=mode;html.dataset.screenKeyboard=keyboard?'open':'closed';
  for(const side of ['top','right','bottom','left'])html.style.setProperty('--ws-fallback-'+side,f[side]+'px');
 }
 function settings(){return `<div class="panel"><h3>屏幕适配</h3><div class="settings-row"><label for="screen-fit">摄像头与手势条避让</label><select id="screen-fit" class="soft small">${[['auto','自动适配'],['camera','挖孔 / 刘海屏'],['island','大刘海 / 灵动岛'],['off','无额外留白']].map(([v,t])=>`<option value="${v}"${mode===v?' selected':''}>${t}</option>`).join('')}</select></div><p class="muted">自动读取手机安全区。若顶部按钮仍被摄像头遮住，可手动选择屏幕类型；已经留出安全区的设备可选“无额外留白”。仅保存在这台设备，不影响游戏进度。</p></div>`;}
 doc.addEventListener('change',e=>{if(e.target.id!=='screen-fit'||!modes.includes(e.target.value))return;mode=e.target.value;try{root.localStorage.setItem(key,mode);}catch(_){}sync();});
 for(const event of ['resize','orientationchange','pageshow'])root.addEventListener(event,sync);
 root.visualViewport?.addEventListener('resize',sync);
 doc.addEventListener('focusin',sync);doc.addEventListener('focusout',()=>root.setTimeout(sync,100));
 root.WarmSafeArea={settings};sync();
})(typeof window==='object'?window:globalThis);
