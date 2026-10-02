(function(root,factory){const node=typeof module==='object'&&module.exports,d=node?require('./content.js'):root.NSContent,a=node?require('./collection-content.js'):root.NSCollection;factory(d,a);if(node)module.exports=d})(typeof window==='undefined'?globalThis:window,(D,Collection)=>{
'use strict';if(D.referenceVersion)return;D.referenceVersion=2;
for(const [id,names] of Object.entries(Collection.tierNames)){const c=D.byChain[id];c.names.splice(3,9,...names);names.forEach((name,n)=>{const item=D.items[id+':'+(n+4)];item.name=name;item.lore=name+'。'+c.lore})}
D.activityStories=Collection.cards;D.activityStorySets=Collection.sets;
const add=(id,name,icon,names,color='#c1ff35',extra={})=>{const c={id,name,icon,names,color,lore:'留在老屋的日常，会继续长成一段新的故事。',...extra};D.byChain[id]=c;names.forEach((n,k)=>D.items[id+':'+(k+1)]={id:id+':'+(k+1),chain:id,level:k+1,name:n,icon,color,max:names.length,lore:c.lore});return c};
D.producerParts=[['维修箱卡扣','箱盖组件','工具箱外壳','工具箱总成'],['灌溉接头','温室喷头','花盆托架','温室框架'],['咖啡阀门','手柄滤杯','咖啡加热盘','咖啡机总成'],['唱针组件','唱臂组件','唱机转盘','唱机底座'],['船具绳扣','船具滑轮','船具锚座','船具收纳架'],['舞台接头','舞台夹具','灯光托架','舞台桁架'],['泳池篮搭扣','泳池篮织片','泳池篮提手','泳池篮框架'],['光能电池片','光能接线板','光能板组件','光能台支架'],['印刷机齿轮','印刷墨辊','印刷纸鼓','印刷机机架'],['灶台旋钮','灶台炉芯','灶台炉架','灶台总成'],['冲洗台镜头','冲洗胶片轴','冲洗台灯箱','冲洗台托架'],['信号触点','信号灯组','信号接线板','信号柜底座'],['钟芯发条','钟芯齿轮组','钟芯摆锤','钟芯箱外壳'],['陶作耐火砖','陶作转轮','陶作模具盘','陶作台炉体'],['观测镜片','观测镜筒接头','观测镜座','观测台三脚架'],['供电接线柱','供电电池组','供电控制板','供电箱外壳']];
D.producerChains=D.generators.map(g=>add('producer'+g.id,g.name,g.icon,[...D.producerParts[g.id],'入门'+g.name,'精制'+g.name,'珍藏'+g.name],D.seasons[g.season].color,{producer:g.id,season:g.season}));
D.extraChains=[add('partsbox','零件箱','box',['街区零件箱','珍藏零件箱'],'#bd9bff'),add('needle','针线盒','cloth',['针线片','小线盒','针线罐','针线收纳盒'],'#e7b9da'),add('cord','线绳','cloth',['一段线绳','绳结','编织绳','童年编绳'],'#d7af76'),add('petal','花瓣','flower',['小花瓣','花瓣簇','花瓣盘','花瓣瓶'],'#ffabc9'),add('perfume','香水','bottle',['花香香水'],'#91e5da'),add('toy','童年玩具','ring',['拉哨','小陀螺','纸风车','跳绳','童年游戏箱','六人的玩具架','旧日游乐盒','一起长大的礼物'],'#ffc579')];
D.paths=[['bloomlight','flower',6,'开花的回声','petal'],['message','shell',6,'海边留下的信','glass'],['ticket','vinyl',6,'再听一次的约定','paper'],['chime','rope',6,'海风的归路','cord'],['voice','book',6,'没有剪去的声音','paper'],['memory','photo',6,'每个人的合照','glass'],['warm','scarf',6,'留给夜班的温暖','cloth'],['key','clock',6,'00:04之后','gear']].map(([id,source,level,title,residue])=>({id,source,level,title,residue,count:4,delay:15000}));
D.homeTitles=['清理旧地板','打开朝东的窗','修复旧沙发','重开小厨房','整理窗边花台','铺好六人的桌','修好阁楼书架','推开四季的门'];
D.homeCosts=[180,240,320,400,480,560,680,800];
D.homeLines=[
 [{who:'qiao',text:'钥匙还在门框上。白禾说，这里一直有人替我留着灯。'},{who:'lu',text:'先整理地板吧。替邻居完成订单赚来的金币，足够让这里一点点亮起来。'}],
 [{who:'bai',text:'先让屋里有风。窗帘洗干净，就能再看见早上的光。'},{who:'qiao',text:'这张便条写了三次明天见。是不是有人，一直没有等到那个明天？'}],
 [{who:'lu',text:'垫子不是新的，线脚补得很结实。你坐的那一边，我一直没有拆。'},{who:'qiao',text:'那就一起坐吧。不必先把每个旧误会说清楚。'}],
 [{who:'bai',text:'今天完成六张订单，邻里就送来一份工作餐。先吃饱，再做剩下的事。'},{who:'qiao',text:'你的配方还是按人数写。我终于知道，为什么每次都多留一碗。'}],
 [{who:'chi',text:'花台修好了。花开以后会自己留下花瓣，只要旁边有地方放。'},{who:'qiao',text:'这颗种子没有标签。先留下它，等它告诉我们自己的名字。'}],
 [{who:'wen',text:'我把雨声录音带来了。六张椅子，这次不用空着一张。'},{who:'qiao',text:'桌角的日期是倒着写的。我好像在一张还没有用过的车票上见过它。'}],
 [{who:'deng',text:'电源恢复。旧录音没有未来标签，只有尚未播放的声音。'},{who:'qiao',text:'所以听起来像明天，只是因为我一直不愿意听完今天？'}],
 [{who:'bai',text:'把门推开。老屋会等你回来，另一边也有人在等。'},{who:'qiao',text:'门后的站台亮了。我会去看看，也会记得回家的路。'}]
];
D.decorThresholds=[200,400,600,1000,1600,2400];
D.projectCost=p=>120+p.area*45+p.part*70;
});
