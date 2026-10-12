(function(root){
'use strict';
const C=typeof module!=='undefined'&&module.exports?require('./storefront.js'):root.WarmStorefront;
const Sun=typeof module!=='undefined'&&module.exports?require('./sun-journal.js'):root.WarmSunJournal;
const products=[...[6,30,68,128,328,648].map((price,id)=>({id,name:price*10+'钻石',kind:'diamond',price,base:price*10,bonus:[0,30,80,180,580,1600][id],reward:{}})),...C.offers,...Sun.C.offers];
const milestones=[{amount:68,reward:{tickets:5}},{amount:128,reward:{dust:30}},{amount:388,reward:{tickets:15}}];
const fresh=()=>({version:3,nextId:1,purchases:products.map(()=>0),total:0,firstGift:null,claims:[],pending:null,history:[]});
const int=(v,max=1e14)=>Number.isSafeInteger(v)&&v>=0&&v<=max;
const method=v=>['balance','wechat','alipay'].includes(v);
function quote(s,id){const p=products[id];if(!p)return null;const first=p.kind==='diamond'&&s.purchases[id]===0,bonus=first?p.base:p.bonus;return{...p,first,bonus,gems:p.base+bonus,rewards:{gems:p.base+bonus,...p.reward}};}
function valid(s){
 if(s===undefined)return true;
 if(!s||![1,2,3].includes(s.version)||!int(s.nextId,1e9)||s.nextId<1||!Array.isArray(s.purchases)||s.purchases.length!==(s.version===1?6:s.version===2?11:products.length)||!s.purchases.every(n=>int(n,1e9))||!int(s.total)||s.total!==s.purchases.reduce((sum,n,i)=>sum+n*products[i].price,0))return false;
 if(s.firstGift!==null&&(!Number.isInteger(s.firstGift)||s.firstGift<0||s.firstGift>5||!s.total))return false;
 if(!Array.isArray(s.claims)||new Set(s.claims).size!==s.claims.length||!s.claims.every(i=>Number.isInteger(i)&&milestones[i]&&s.total>=milestones[i].amount))return false;
 const order=q=>q&&Number.isSafeInteger(q.id)&&q.id>0&&q.id<s.nextId&&Number.isInteger(q.product)&&products[q.product]&&q.product<s.purchases.length&&int(q.at)&&method(q.method);
 if(s.pending!==null&&(!order(s.pending)||s.pending.id!==s.nextId-1||!['confirm','pay'].includes(s.pending.phase)||s.pending.product>=6&&!int(s.pending.cycle)||s.pending.product>=11&&!int(s.pending.season)))return false;
 if(!Array.isArray(s.history)||s.history.length>50||!s.history.every((h,i)=>order(h)&&(!i||h.id<s.history[i-1].id)&&(!s.pending||h.id<s.pending.id)&&int(h.finished)&&h.finished>=h.at&&['paid','cancelled'].includes(h.status)&&typeof h.first==='boolean'&&int(h.gems)&&h.price===products[h.product].price&&(h.status==='cancelled'?h.gems===0&&!h.first:h.gems===products[h.product].base+(h.first?products[h.product].base:products[h.product].bonus)&&(!h.first||h.product<6)&&s.purchases[h.product]>0&&(h.product<6||h.rewards&&Object.keys(h.rewards).length===Object.keys(products[h.product].reward).length+1&&Object.entries({gems:h.gems,...products[h.product].reward}).every(([k,n])=>h.rewards[k]===n)))))return false;
 if(s.purchases.reduce((sum,n)=>sum+n,0)>s.nextId-1||s.history.filter(h=>h.status==='paid').reduce((sum,h)=>sum+h.price,0)>s.total)return false;
 for(let i=0;i<s.purchases.length;i++)if(s.history.filter(h=>h.status==='paid'&&h.product===i).length>s.purchases[i]||s.history.filter(h=>h.status==='paid'&&h.product===i&&h.first).length>1)return false;
 return true;
}
function migrate(s){s.recharge??=fresh();if(s.recharge.version===1){s.recharge.version=2;s.recharge.purchases.push(...products.slice(6,11).map(()=>0));}if(s.recharge.version===2){s.recharge.version=3;s.recharge.purchases.push(...products.slice(11).map(()=>0));}}
function install(Game){
 Game.prototype.rechargeBegin=function(product){this.refresh();const s=this.s.recharge;if(!Number.isInteger(product)||!products[product])return this.fail('请选择充值档位');if(s.pending)return this.fail('请先完成或取消当前订单');const allowed=C.canBuy(this,product);const sunlight=Sun.canBuy(this,product);if(!sunlight.ok)return sunlight;if(!allowed.ok)return allowed;if(s.nextId>=1e9)return this.fail('模拟订单数量已达上限');const q=s.pending={id:s.nextId++,product,at:this.now(),method:'balance',phase:'confirm',cycle:C.day(this.now()),...(product>=11?{season:Sun.season(this.now())}:{})};return{ok:true,order:{...q},quote:quote(s,product)};};
 Game.prototype.rechargeConfirm=function(id,payMethod){const q=this.s.recharge.pending;if(!q||q.id!==id||q.phase!=='confirm')return this.fail('订单已变更，请重新打开');if(!method(payMethod))return this.fail('请选择模拟支付方式');q.method=payMethod;q.phase='pay';return{ok:true};};
 Game.prototype.rechargeBack=function(id){const q=this.s.recharge.pending;if(!q||q.id!==id||q.phase!=='pay')return this.fail('订单已变更');q.phase='confirm';return{ok:true};};
 Game.prototype.rechargeCancel=function(id){const s=this.s.recharge,q=s.pending;if(!q||q.id!==id)return this.fail('订单已结束');s.history.unshift({...q,status:'cancelled',finished:Math.max(q.at,this.now()),price:products[q.product].price,gems:0,first:false});s.history=s.history.slice(0,50);s.pending=null;return{ok:true};};
 Game.prototype.rechargePay=function(id,pin){this.refresh();const s=this.s.recharge,q=s.pending;if(!q||q.id!==id||q.phase!=='pay')return this.fail('订单已结束或尚未确认');if(typeof pin!=='string'||!/^\d{4}$/.test(pin))return this.fail('请输入任意4位数字');const allowed=C.canBuy(this,q.product,q.cycle);const sunlight=Sun.canBuy(this,q.product,q.season);if(!sunlight.ok)return sunlight;if(!allowed.ok)return allowed;const p=quote(s,q.product);if(!C.canReward(this,p.rewards))return this.fail('资源数量已达上限');s.purchases[q.product]++;s.total+=p.price;this.reward(p.rewards);C.grant(this,q.product);Sun.grant(this,q.product);const receipt={...q,status:'paid',finished:Math.max(q.at,this.now()),price:p.price,gems:p.gems,first:p.first,rewards:{...p.rewards}};s.history.unshift(receipt);s.history=s.history.slice(0,50);s.pending=null;return{ok:true,receipt:{...receipt},base:p.base,bonus:p.bonus,reward:p.rewards,kind:p.kind};};
 Game.prototype.rechargeFirstGift=function(person){const s=this.s.recharge;if(!s.total)return this.fail('完成任意一次模拟充值后领取');if(s.firstGift!==null)return this.fail('首充礼已经领取');if(!Number.isInteger(person)||person<0||person>5)return this.fail('请选择一位女生');s.firstGift=person;const id=person*12+4,isNew=this.addCard(id);this.reward({coins:3000,tickets:3});return{ok:true,id,isNew,reward:{coins:3000,tickets:3}};};
 Game.prototype.rechargeMilestone=function(id){const s=this.s.recharge,m=milestones[id];if(!Number.isInteger(id)||!m||s.total<m.amount)return this.fail('尚未达到累计充值档位');if(s.claims.includes(id))return this.fail('回馈已经领取');s.claims.push(id);this.reward(m.reward);return{ok:true,reward:m.reward};};
}
const api={products,milestones,fresh,valid,migrate,quote,install};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmRecharge=api;
})(typeof window==='undefined'?globalThis:window);
