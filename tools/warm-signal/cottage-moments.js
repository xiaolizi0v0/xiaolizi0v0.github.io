(function(root){'use strict';const node=typeof module!=='undefined'&&module.exports;
const kinds=[
 {key:'photo',name:'把今天拍下来',furniture:0,actions:['选好取景','一起看镜头','按下快门','收进相册'],lines:['把相机架在茶几上，再把窗帘拉开一点。','她靠近了半步，留出刚好能站下两个人的位置。','快门轻响。窗边的光，和笑意一起留在了照片里。','不必等特别的日子。和你一起的今天，就值得收藏。']},
 {key:'piano',name:'四手的小小合奏',furniture:6,actions:['翻开琴谱','弹出前半句','接上后半句','收录合奏'],lines:['琴谱上夹着一片薄薄的书签。她把琴凳让出一半。','你先弹出几个音，她放慢速度，等你跟上。','两个声部终于遇在同一拍，窗外的风也安静了。','最后一个音慢慢散去，她没有急着收回手。']},
 {key:'chess',name:'窗边的一盘棋',furniture:7,actions:['摆好棋盘','落下你的棋子','等她回应','收录棋局'],lines:['棋盘摆在两人之间，茶杯刚好留在不会碰倒的地方。','你想了一会儿，把第一颗棋子放在靠近中间的位置。','她接着落下一颗，笑着说这一盘可以慢慢下。','没有急着分出输赢。再下一盘，也就多一个留下的理由。']},
 {key:'pillow',name:'软绵绵的挑战',furniture:11,actions:['拿好软枕','轻轻抛过去','接住她的回球','收录这一刻'],lines:['她从靠椅上拿起软枕，先提醒你别碰倒窗边的花。','你把枕头轻轻抛过去，她笑着伸手接住。','软枕沿着短短的弧线回到你手边，没有碰到家具。','两个人都笑得停不下来，最后一起把枕头摆回原位。']}
];
const endings=[
 ['林栀在照片背面写下日期，还画了一片只有你看得懂的小叶子。','林栀说，这段旋律很适合留给不用赶路的下午。','林栀把你落的那一颗圈在便签上，说下次从这里继续。','林栀把散开的发丝别回耳后，约好下一轮也要温柔一点。'],
 ['顾清禾认真比了比取景线，最后却最喜欢那张没摆好姿势的。','顾清禾把错拍记成小小的星号，说它也算这次合奏的签名。','顾清禾指着棋盘说，每次落子都像给房子添一扇新窗。','顾清禾抱着软枕笑，说今天的计划里可以多留一点空白。'],
 ['许知夏看着照片上的你，说今天的笑容比舞台灯光更亮。','许知夏把速度放慢了一半，说两个人听见彼此比弹快更重要。','许知夏在等你想好下一步时，轻轻哼着刚练过的旋律。','许知夏数着节拍接住软枕，连笑声都落在熟悉的拍子上。'],
 ['苏晚把照片放进手账，旁边只写了两个字：回家。','苏晚说，先把这一句弹好，晚饭后再学下一句。','苏晚替你续上温茶，让这盘棋有足够慢的时间。','苏晚把软枕拍松摆好，说玩累了就来尝刚煮好的汤。'],
 ['江月想把照片夹进食谱，让下一次做点心时也能看见你。','江月说这段像烤箱叮的一声，听见就知道有好事在等。','江月把棋子排整齐，问你下次要不要带两块小饼干来。','江月笑着护住旁边的花，说软枕和今天都要轻拿轻放。'],
 ['唐梨没有开直播，只把这一张留进你们自己的相册。','唐梨想录下最后那几个音，说它们很适合做私藏的片尾。','唐梨把手机翻扣在桌上，说这一局只看你，不看弹幕。','唐梨笑着说，这一段不用剪辑，留在心里就已经很好看。']
];
const byKey=Object.fromEntries(kinds.map(k=>[k.key,k])),fresh=()=>({next:1,active:null,album:[]}),int=(n,min=0,max=1e14)=>Number.isSafeInteger(n)&&n>=min&&n<=max,key=(p,k)=>p+':'+k;
function valid(m,v){if(m===undefined)return true;if(!m||typeof m!=='object'||!int(m.next,1)||!Array.isArray(m.album)||m.album.length>24)return false;
 const entry=a=>a&&int(a.p,0,5)&&Object.hasOwn(byKey,a.kind)&&int(a.at)&&int(a.frame,0,1)&&(a.kind==='photo'||a.frame===0)&&v.homes[a.p].owned.includes(byKey[a.kind].furniture);
 if(!m.album.every(entry)||new Set(m.album.map(a=>key(a.p,a.kind))).size!==m.album.length)return false;
 const q=m.active;return q===null||!!(q&&int(q.id,1,m.next-1)&&int(q.p,0,5)&&Object.hasOwn(byKey,q.kind)&&int(q.step,0,3)&&int(q.frame,0,1)&&(q.kind==='photo'||q.frame===0)&&v.homes[q.p].owned.includes(byKey[q.kind].furniture));}
function install(Game){const ready=g=>{g.refresh();g.s.cottage.moments??=fresh();return g.s.main>=90&&g.s.cottage.serial<1e14;},available=(g,p,k)=>{const h=g.s.cottage.homes[p],f=byKey[k]?.furniture;return h&&h.owned.includes(f)&&!h.hidden.includes(f)&&!g.s.cottage.themes?.homes[p].styles[f]&&h.blocked<=g.now();};
 Game.prototype.cottageMomentStart=function(kind,frame=0){const v=this.s.cottage;if(!ready(this)||!Object.hasOwn(byKey,kind)||!int(frame,0,1)||kind!=='photo'&&frame!==0||v.moments.active||v.moments.next>=1e14||!available(this,v.p,kind))return this.fail('请先摆放对应家具，或继续已暂存的互动');v.moments.active={id:v.moments.next++,p:v.p,kind,step:0,frame};v.serial++;return{ok:true};};
 Game.prototype.cottageMomentNext=function(id,step){const v=this.s.cottage;if(!ready(this))return this.fail('小屋尚未开放');const m=v.moments,q=m.active;if(!q||q.id!==id||q.step!==step||q.p!==v.p||!available(this,q.p,q.kind))return this.fail('互动进度已变化，或请先摆回对应家具');let finished=false;if(q.step===3){const i=m.album.findIndex(a=>a.p===q.p&&a.kind===q.kind),a={p:q.p,kind:q.kind,at:this.now(),frame:q.frame};if(i<0)m.album.push(a);else m.album[i]=a;m.active=null;finished=true;}else q.step++;v.serial++;return{ok:true,finished};};
 Game.prototype.cottageMomentCancel=function(id){const v=this.s.cottage;if(!ready(this)||!v.moments.active||v.moments.active.id!==id)return this.fail('这段互动已经结束');v.moments.active=null;v.serial++;return{ok:true};};
}
const api={kinds,byKey,endings,fresh,valid,install};if(node)module.exports=api;else root.WarmCottageMoments=api;
})(typeof window==='undefined'?globalThis:window);
