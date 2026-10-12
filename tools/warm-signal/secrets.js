(function(root){'use strict';
const node=typeof module!=='undefined'&&module.exports,D=node?require('./content.js'):root.WarmData,C=node?require('./secret-content.js'):root.WarmSecretContent,stories=C.build(D),MAX=1e14;
const int=(v,a=0,b=MAX)=>Number.isSafeInteger(v)&&v>=a&&v<=b,plain=v=>v&&typeof v==='object'&&!Array.isArray(v),story=id=>int(id,0,11)?stories[id]:null;
const fresh=()=>({version:1,sand:18,records:{},serial:0,next:1,session:null});
function migrate(s){s.secrets??=fresh();}
const record=(g,id)=>g.s.secrets.records[id]||null,eligible=(g,id)=>!!story(id)&&(!!record(g,id)||story(id).cards.some(c=>g.own(c)));
function current(q){const ch=story(q.story).chapters[q.chapter];return q.point===null?ch:ch.points[q.point];}
function explored(r){return [0,1,2].every(n=>r.seen.includes(n));}
function valid(v){if(v===undefined)return true;if(!plain(v)||v.version!==1||!int(v.sand)||!int(v.serial)||!int(v.next,1)||!plain(v.records))return false;
 for(const [k,r] of Object.entries(v.records)){const x=story(Number(k));if(!x||String(x.id)!==k||!plain(r)||!int(r.unlocked,1,3)||!int(r.read,0,r.unlocked)||r.unlocked>r.read+1||!int(r.last)||!Array.isArray(r.seen)||new Set(r.seen).size!==r.seen.length||!r.seen.every(n=>int(n,0,4))||x.kind==='read'&&r.seen.length||r.seen.length&&r.unlocked<2||x.kind==='explore'&&r.read>=2&&!explored(r))return false;}
 const q=v.session;if(q===null)return true;if(!plain(q)||!int(q.id,1)||q.id!==v.next-1||!story(q.story)||!v.records[q.story]||!int(q.chapter,0,v.records[q.story].unlocked-1)||q.chapter>v.records[q.story].read||!int(q.line))return false;
 const ch=story(q.story).chapters[q.chapter];if(ch.type==='read')return q.point===null&&q.line<ch.text.length;
 return q.point===null?q.line===0:int(q.point,0,ch.points.length-1)&&q.line<ch.points[q.point].text.length;
}
function trainingAmount(id,kind,stars){if(!stories.some(x=>x.cards.includes(id)))return 0;return kind==='star'?stars:kind==='evolve'?(D.cards[id].rarity==='SSR'?10:6):0;}
function room(v){return v.serial<MAX&&v.next<MAX;}
function finish(g){const v=g.s.secrets,q=v.session,x=story(q.story),r=v.records[q.story],first=q.chapter===2&&r.read<3;if(first&&(g.s.gems+30>MAX||v.sand+3>MAX))return g.fail('奖励数量已达上限');if(v.serial>=MAX)return g.fail('阅读记录已达上限');r.read=Math.max(r.read,q.chapter+1);r.last=g.now();v.session=null;v.serial++;if(first){g.reward({gems:30});v.sand+=3;}return{ok:true,finished:true,first,story:x.id,chapter:q.chapter,reward:first?{gems:30,sand:3}:null};}
function install(Game){
 Game.prototype.secretOpen=function(id,ch=0){const x=story(id),v=this.s.secrets;if(!x||!int(ch,0,2)||!eligible(this,id))return this.fail('拥有指定羁绊后可开启这段传闻');if(v.session)return v.session.story===id&&v.session.chapter===ch?{ok:true,resumed:true}:this.fail('还有一段传闻正在阅读');if(!room(v))return this.fail('阅读记录已达上限');let r=record(this,id);if(!r){if(ch!==0)return this.fail('请先开启第一节');r=v.records[id]={unlocked:1,read:0,seen:[],last:0};}if(ch>=r.unlocked||ch>r.read)return this.fail('先读完并解锁前面的章节');v.session={id:v.next++,story:id,chapter:ch,line:0,point:null};v.serial++;return{ok:true};};
 Game.prototype.secretUnlock=function(id,ch,serial){const x=story(id),v=this.s.secrets,r=record(this,id);if(!x||!r||!int(ch,1,2)||ch!==r.unlocked||r.read<ch||serial!==v.serial||v.serial>=MAX)return this.fail('章节或解锁条件已变化');const cost=x.chapters[ch].cost;if(v.sand<cost)return this.fail('溯时沙漏不足');v.sand-=cost;r.unlocked++;v.serial++;return{ok:true,cost};};
 Game.prototype.secretPoint=function(id,point){const v=this.s.secrets,q=v.session;if(!q||q.id!==id||current(q).type!=='explore'||q.point!==null||!int(point,0,4))return this.fail('当前探索已变化');q.point=point;q.line=0;return{ok:true};};
 Game.prototype.secretNext=function(id){const v=this.s.secrets,q=v.session;if(!q||q.id!==id)return this.fail('阅读已经结束或切换');const ch=current(q);if(!ch.text)return this.fail('请先查看场景中的物件');if(q.line<ch.text.length-1){q.line++;return{ok:true,finished:false};}if(q.point!==null){const r=v.records[q.story],first=!r.seen.includes(q.point);if(first)r.seen.push(q.point);q.point=null;q.line=0;return{ok:true,pointFinished:true,first};}return finish(this);};
 Game.prototype.secretFinish=function(id){const q=this.s.secrets.session;if(!q||q.id!==id||q.point!==null||current(q).type!=='explore'||!explored(record(this,q.story)))return this.fail('读完三件物品的片段后可完成探索；思绪可以继续收藏');return finish(this);};
 Game.prototype.secretPointBack=function(id){const q=this.s.secrets.session;if(!q||q.id!==id||q.point===null)return this.fail('当前不在探索片段中');q.point=null;q.line=0;return{ok:true};};
 Game.prototype.secretSkip=function(id){const q=this.s.secrets.session;if(!q||q.id!==id||q.point!==null||current(q).type!=='read'||record(this,q.story).read<=q.chapter)return this.fail('只能跳过已读的正文章节');return finish(this);};
 Game.prototype.secretEnd=function(id){const v=this.s.secrets;if(!v.session||v.session.id!==id||v.serial>=MAX)return this.fail('阅读已变化');v.session=null;v.serial++;return{ok:true};};
 Game.prototype.secretBuy=function(n){const v=this.s.secrets;if(![1,5].includes(n)||v.sand+n>MAX)return this.fail('无效兑换或数量已达上限');if(!this.pay({gems:n*15}))return this.fail('钻石不足');v.sand+=n;return{ok:true};};
 const upgrade=Game.prototype.upgrade;Game.prototype.upgrade=function(id,kind){const c=this.own(id),amount=c?trainingAmount(c.id,kind,c.stars):0;if(this.s.secrets.sand+amount>MAX)return this.fail('溯时沙漏已达上限');const r=upgrade.call(this,id,kind);if(r.ok&&amount){this.s.secrets.sand+=amount;r.sand=amount;}return r;};
}
const api={stories,story,current,record,eligible,explored,trainingAmount,fresh,migrate,valid,install};if(node)module.exports=api;else root.WarmSecrets=api;
})(typeof window==='undefined'?globalThis:window);
