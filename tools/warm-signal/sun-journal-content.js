(function(root){'use strict';
const slugs=['lin-zhi','gu-qinghe','xu-zhixia','su-wan','jiang-yue','tang-li'];
const names=['叶间晨光','窗下新城','晴日和弦','书页向阳','刚好的暖意','收藏此刻'];
const scenes=['晨光温室','日照绘图室','晴日琴房','向阳书屋','暖香烘焙间','晴光露台'];
const phones=[
 ['新叶的方向','薄荷又长出两片新叶，正朝着门口。','我把观察日志移到另一边，给你空出一张椅子。','明早一起浇水吧。你来了，才算完整的晴天。'],
 ['模型里的空位','新的建筑模型做好了，屋顶可以掀开。','里面有一张没写进图纸的小桌，两把椅子。','等你忙完，我们来讨论窗帘的颜色。'],
 ['晴天的休止符','琴房的窗帘洗好了，阳光可以照到琴键。','今天没有排练安排，我却想在这里多坐一会儿。','来听我弹一段吧，剩下的休止符我们一起过。'],
 ['没有截止日的书签','书店老板送了我一枚素色书签。','我没有写新闻题目，只写了见你的日期。','下午的采访结束了。窗边那杯茶，想等你一起喝。'],
 ['慢一点的早餐','今天第一炉面包烤得刚刚好。','我留了两只杯子，没着急把第二只收起来。','你不用赶路。等你坐下来，我再泡一壶热茶。'],
 ['不上传的照片','今天出门只带了小相机，没有开直播。','露台的花刚好开到栏杆外，我想请你一起入镜。','这一张不上传。原片和这个下午，都只留给我们。']
];
const offers=[
 {id:11,name:'暖光手札 · 特权',kind:'sun-pass',price:45,base:0,bonus:0,reward:{},note:'仅本赛季生效 · 解锁特权奖励轨道，100级领取当期ER与陪伴背景'},
 {id:12,name:'暖光手札 · 典藏',kind:'sun-deluxe',price:88,base:0,bonus:0,reward:{tickets:20},note:'仅本赛季生效 · 特权轨道、立即提升20级、凝光碎片10、许愿券20、暖光称号与头像框；每季两档仅选一档'},
 {id:13,name:'暖光银钥',kind:'sun-silver',price:45,base:0,bonus:0,reward:{},note:'永久保留 · 用于打开本赛季50级领取的往期甄选匣，获得所选往期ER与陪伴背景'},
 {id:14,name:'暖光金钥',kind:'sun-gold',price:88,base:0,bonus:0,reward:{},note:'永久保留 · 用于往期甄选匣，获得所选往期ER、背景及对应暖光称号与头像框'}
];
const tasks=[{name:'完成20次拍摄',target:20,route:'main'},{name:'许愿3次',target:3,route:'wish'}];
const shop=[{name:'日光星石',price:160,limit:8,kind:'stone',note:'回忆星尘5；若有未拥有的基础R，随机获得其中一张，否则心愿1'},
 {name:'SR羁绊自选匣',price:600,limit:1,kind:'sr',note:'基础SR六选一，已拥有时按正常重复规则结算'},
 {name:'居家时光服装匣',price:900,limit:1,kind:'outfit',note:'为一位女生解锁居家服，已经解锁的不能重复选择'},
 {name:'许愿券',price:180,limit:5,kind:'ticket',note:'许愿券1'},
 {name:'陪伴时光券',price:120,limit:5,kind:'meet',note:'时光券5'}];
function reward(level,paid,p){const r={sun:paid&&level>100?40:20};if(paid){if(level<=100){r.coins=1200;if(level<=88&&level%2===0)r.energy=20;if(level%4===0&&level<=96)r.wish=1;if(level%20===0)r.tickets=1;if(level%10===0){r.gems=50;r.glow=1;}if(level===100){r.chapters=1;r.memory=1;r.card=132+p;r.scene=4+p;}}}else{r.coins=300;r.stones=20;if(level%5===0&&level<=65)r.energy=20;if(level%10===0&&level<=60)r.gems=50;if(level%20===0){r.tickets=1;r.glow=1;}if(level%25===0){r.wish=2;r.trialStones=20;}if(level%10===0)r.flowers=1;if(level===50)r.box=1;if(level===100)r.chapters=1;}return r;}
function art(p){return{file:'sun-journal-'+slugs[p]+'-v1.webp',x:0,y:0,width:1024,height:1536,atlasWidth:1024,atlasHeight:1536};}
function background(p){return{file:'sun-journal-scenes-v1.webp',x:p%3*418+2,y:Math.floor(p/3)*627+2,width:414,height:623,atlasWidth:1254,atlasHeight:1254};}
const api={slugs,names,scenes,phones,phone:p=>phones[p],offers,tasks,shop,reward,art,background};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmSunJournalContent=api;
})(typeof window==='undefined'?globalThis:window);
