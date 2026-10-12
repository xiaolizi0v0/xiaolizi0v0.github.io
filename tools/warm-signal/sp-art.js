(function(root){'use strict';
const node=typeof module!=='undefined'&&module.exports,D=node?require('./content.js'):root.WarmData,SP=node?require('./sp.js'):root.WarmSP;
const sheets=['lin-zhi','gu-qinghe','xu-zhixia','su-wan','jiang-yue','tang-li'].map(n=>({file:'sp-'+n+'-v1.webp',width:1448,height:1086}));
function artDescriptor(id,display,variant){if(!SP.isSP(id)||![2,4].includes(display)||![0,1].includes(variant))return null;const c=D.cards[id],a=sheets[c.p],col=(display===4?2:0)+variant,row=id>=90?1:0;return{file:a.file,key:c.skinKey+'-sp-'+display+'-'+variant,x:col*362+2,y:row*543+2,width:358,height:539,atlasWidth:a.width,atlasHeight:a.height,display,variant};}
function descriptor(g,id,display,variant){const r=SP.record(g,id);if(!r)return null;display=display??r.display;if(display>r.stage)return null;variant=variant??r.variants[display===2?0:1];return artDescriptor(id,display,variant);}
function render(id,a,esc){if(!a)return '';return `<div class="card-illustration" data-art-key="${a.key}" role="img" aria-label="${esc(D.characters[D.cards[id].p].name+' · '+D.cards[id].name+' · SP'+a.display+'阶'+(a.variant?'B':'A')+'卡面')}"><svg class="card-image" viewBox="${a.x} ${a.y} ${a.width} ${a.height}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="warm-signal/assets/${a.file}" width="${a.atlasWidth}" height="${a.atlasHeight}"/></svg></div>`;}
function markup(g,id,esc,display,variant){return render(id,descriptor(g,id,display,variant),esc);}
// Read-only presentation of another player's published art; never grants ownership or stages.
function sharedMarkup(id,display,variant,esc){return render(id,artDescriptor(id,display,variant),esc);}
const api={sheets,descriptor,markup,sharedMarkup};if(node)module.exports=api;else root.WarmSPArt=api;
})(typeof window==='undefined'?globalThis:window);
