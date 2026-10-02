(function(root,factory){const core=typeof module==='object'&&module.exports?require('./commissions.js'):root.NSCore;const a=factory(core);if(typeof module==='object'&&module.exports)module.exports=a;else root.NSSave=a})(typeof window==='undefined'?globalThis:window,C=>{
'use strict';const KEY='neon-seasons-profile-v1',BACKUP=KEY+'-backup',SETTINGS=KEY+'-settings';
class Store{
 constructor(storage,clock=()=>Date.now(),onError=()=>{}){this.storage=storage;this.clock=clock;this.onError=onError;this.memory=null;this.failed=false;this.settings={sound:true,music:true,motion:true,vibrate:true};try{const s=JSON.parse(storage.getItem(SETTINGS)||'null');if(s&&typeof s==='object')for(const k of Object.keys(this.settings))if(typeof s[k]==='boolean')this.settings[k]=s[k]}catch{this.fail()}}
 fail(){if(!this.failed){this.failed=true;this.onError()}}
 load(){for(const key of [KEY,BACKUP])try{const raw=JSON.parse(this.storage.getItem(key)||'null'),g=C.Game.restore(raw,{clock:this.clock});if(g){if(raw.version===1&&!this.storage.getItem(KEY+'-before-v2'))this.storage.setItem(KEY+'-before-v2',JSON.stringify(raw));if(key===BACKUP)g.emit('backupRestore');return g}}catch{this.fail()}return this.memory?C.Game.restore(this.memory,{clock:this.clock}):null}
 save(g){const data=g.serialize();this.memory=data;try{const old=this.storage.getItem(KEY);if(old&&C.Game.restore(JSON.parse(old),{clock:this.clock}))this.storage.setItem(BACKUP,old);this.storage.setItem(KEY,JSON.stringify(data));this.storage.setItem(SETTINGS,JSON.stringify(this.settings));return true}catch{this.fail();return false}}
 export(g){return JSON.stringify({game:'neon-seasons',savedAt:this.clock(),state:g.serialize()},null,2)}
 inspectImport(text){try{const data=JSON.parse(text);return data.game==='neon-seasons'?C.Game.restore(data.state,{clock:this.clock}):null}catch{return null}}
}
return{Store,keys:{KEY,BACKUP,SETTINGS}};
});
