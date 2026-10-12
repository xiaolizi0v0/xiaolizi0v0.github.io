(function(root){
'use strict';
const characters=[
 {name:'林栀',age:24,job:'植物研究员',color:'#83a68b',place:'花见温室',quote:'等花开的时候，也想等到你。',special:1},
 {name:'顾清禾',age:27,job:'建筑设计师',color:'#829bbc',place:'旧城钟楼',quote:'想和你一起，给明天留一扇窗。',special:0},
 {name:'许知夏',age:25,job:'独立音乐人',color:'#d4a366',place:'落日天台',quote:'下一首歌，要不要只唱给你听？',special:3},
 {name:'苏晚',age:26,job:'城市记者',color:'#bc8797',place:'街角书店',quote:'那么多故事里，最想听的是你的。',special:2},
 {name:'江月',age:24,job:'甜点师',color:'#c59a83',place:'月见烘焙',quote:'不赶时间的话，陪我吃完这块蛋糕吧。',special:1},
 {name:'唐梨',age:24,job:'生活摄影主播',color:'#c893a7',place:'梨的直播间',quote:'镜头那边有很多人，但我知道，你一直在。',special:3}
];
const attrs=['决策力','创造力','亲和力','行动力'];
const tiers=['R','R','R','R','SR','SR','SR','SSR','SSR','SP','UR','ER'];
const cardNames=[['第一枝花','晨间问候','温室来信','春日散步','雨后花园','向光而生','掌心温度','花开之时','与你同春','微光永恒','四季有你','屋檐听雨'],['城市素描','蓝色图纸','认真侧脸','窗边晨光','晚风有信','一起回家','未寄情书','夜色温柔','在你身旁','一城一梦','心有归处','落日窗台'],['哼唱日常','耳机另一端','夏日橘子','午后节拍','不期而遇','小小舞台','灯火和弦','只为你唱','夏夜星河','心跳回声','永恒乐章','旧唱片'],['今日头条','书页之间','街角偶遇','雨中采访','镜头以外','晚安来信','没有署名','真实心意','与你共读','时光注脚','世界的答案','风中的信'],['草莓心事','一杯热可可','烤箱清晨','甜甜日常','月光奶油','留给你的','温暖手心','甜蜜约定','刚好的温度','月亮与海','漫长的喜欢','冬日围炉']];
cardNames.push(['初次开播','午后镜头','轻声晚安','粉色耳机','弹幕心事','我的助播','镜头之外','只看着你','一同发光','星光连线','心跳直播','下播以后']);
const rankValue={R:90,SR:145,SSR:220,SP:260,UR:300,ER:195};
const cards=characters.flatMap((c,p)=>tiers.map((rarity,n)=>({id:p*12+n,p,rarity,name:cardNames[p][n],base:attrs.map((_,a)=>rankValue[rarity]+(a===c.special?75:0)+(n*17+a*11)%40),fragmentNeed:rarity==='R'?15:rarity==='SR'?30:60})));
const chapters=[
 {name:'春天的第一封信',desc:'一卷旧母带，把六段不同的生活带回同一条街。',p:0,lines:[['旁白','你推开拾光映像的门。桌上只有一架旧摄像机，和一封没有落款的信。'],['我','“把晴川拍下来。哪怕只是一个普通人的一天。”父亲留下的话，还贴在监视器旁。'],['林栀','你就是新来的制作人吧？我是林栀。楼下的绿植，终于有人记得浇水了。'],['我','抱歉，刚刚忙着整理旧片子。我想拍一部关于这条街的纪录片。'],['林栀','那从温室开始吧。那里有一株去年没有开花的树，今年终于发芽了。'],['旁白','她递来一枝小小的白花。你第一次觉得，这间旧工作室也可以有一个新的春天。']]},
 {name:'给明天留一扇窗',desc:'旧钟楼即将修缮，而它藏着一段无人讲过的故事。',p:1,lines:[['顾清禾','安全帽戴好。这里每一块砖，都比我们的年纪大。'],['我','你画的修缮方案，保留了楼顶那扇旧窗。为什么？'],['顾清禾','小时候，母亲在那扇窗后等我下课。不能为了让城市漂亮，就把人的记忆擦掉。'],['旁白','风把图纸吹散，你蹲下来，和她一起把落在地上的未来收好。'],['我','那就一起把它拍下来，让更多人知道这扇窗的故事。'],['顾清禾','好。但我希望片尾，有你自己的名字。不是只做别人的影子。']]},
 {name:'听见夏天的回声',desc:'天台上的一首歌，竟与母带里的旋律完全相同。',p:2,lines:[['许知夏','嘘，先别说话。刚才这阵风，把最后一句歌词带过来了。'],['我','这段旋律……我在父亲的旧母带里听过。'],['许知夏','真的？这是邻居奶奶教我的。她说，那是一个没有完成的约定。'],['旁白','她把一只耳机放进你掌心。两个陌生的故事，第一次有了相同的声音。'],['我','可以用这首歌做纪录片的主题曲吗？我们一起把约定完成。'],['许知夏','当然。但副歌要你来写。不许躲在摄影机后面哦。']]},
 {name:'故事之外的你',desc:'一篇旧报道里，出现了失踪母带的拍摄日期。',p:3,lines:[['苏晚','你在找十年前的街区影像？看看这份报纸，先别谢我。'],['我','父亲那天也在钟楼。可这盘片子为什么没有上映？'],['苏晚','报道不是把线索拼起来就结束。有时候，你得先坐下来听一个人说话。'],['旁白','她带你去见守钟人。老人说，当年的片子是送给整条街的一份生日礼物。'],['我','我以为他留下的是一个失败的项目。原来，是一份还没送出去的礼物。'],['苏晚','那就送出去吧。这次，别忘了让自己也走进画面。']]},
 {name:'月亮也会等你',desc:'一块不够完美的蛋糕，给了你继续剪辑的勇气。',p:4,lines:[['江月','都这么晚了，工作室还亮着灯。先把手上的活放下。'],['我','剪了一整天，却总觉得还不够好。我怕辜负大家。'],['江月','这是今天烤歪的一块蛋糕。卖不了，但味道还是好的。'],['旁白','她在桌边坐下，把蛋糕分成两半。窗外的月光落在没完成的时间线上。'],['我','如果我也只是做到了“味道还不错”呢？'],['江月','那我就坐在第一排，认真看完。你做的事情，不需要每一刻都完美。']]},
 {name:'明天也在这里',desc:'首映的灯亮起。属于你们的春天，这才刚刚开始。',p:0,lines:[['旁白','钟楼广场摆好了白色幕布。六个人把最后一排椅子留给了你。'],['林栀','温室里的树开花了。我把第一枝留给你，和第一次见面时一样。'],['顾清禾','旧窗修好了。片子上映以后，带你上去看看新的风景。'],['许知夏','别紧张，你写的副歌，比你自己以为的好听。'],['苏晚','今天的报道标题已经想好了：一条街，和一个终于走进镜头的人。'],['江月','首映结束还有蛋糕。这次烤得很好，不过你上次说喜欢的那一块，我也留着。'],['唐梨','摄影机已经架好了。这次我来拍，你也要出现在我们的合照里。'],['我','谢谢你们。下一部片子，还想和大家一起拍。'],['旁白','片尾出现你的名字。灯光亮起时，你知道，明天也有人在这里等你。']]}
];
const CampaignContent=typeof module!=='undefined'&&module.exports?require('./campaign-content.js'):root.WarmCampaignContent;
const {stages,elites}=CampaignContent.build(chapters),gates=CampaignContent.gates;
const experts=[{name:'唐小满',job:'纪录',attr:3},{name:'陆知远',job:'设计',attr:0},{name:'方听',job:'音乐',attr:1},{name:'许悦',job:'采访',attr:2},{name:'周序',job:'美食',attr:1}];
const dateTitles=['初次约定','雨中同行','只属于我们的夜晚'];
const dates=characters.map((c,p)=>dateTitles.map((title,n)=>({title,need:n*25,lines:[['旁白',`你按照约定来到${c.place}。${c.name}已经站在门口，身旁留着一个空位。`],[c.name,['今天终于不用隔着镜头看你了。走吧，我带你去一个喜欢的地方。','天气预报说会下雨。我带了伞，不过一把就够了。','本来准备了很多话，见到你之后，又觉得不用急着说完。'][n]],['我',['我也一直期待这一天。今天的时间，全都留给你。','那我们慢慢走。下雨的时候，这座城市好像也安静了一点。','我们还有很多个明天，可以慢慢说。'][n]],[c.name,`${c.quote}`],['旁白',['走过街角时，她回头确认你有没有跟上。你们之间，刚好是一朵花的距离。','雨落在伞沿。她往你身旁靠近了一点，你把伞又向她那边挪了一点。','路灯一盏盏亮起。回家的路没有变长，是你们都走得比平时慢了。'][n]]]})));
const dateBeats=[
 [['花开以前','林栀把温室里最靠窗的椅子搬过来，递给你一本压着落花的植物手册。','研究计划总有期限，但花不会按计划开。我想慢慢等，也想有人陪我等。'],['共撑一片春天','雨点敲着温室的玻璃。林栀拿起一盆刚发芽的薄荷，像拿起一个小小的秘密。','我以前只敢把喜欢写在观察日志里。今天，想试着直接说给你听。'],['夜里的第一朵花','为了看昙花，你们在温室坐到深夜。林栀把热茶放进你的掌心。','有些花只开一小会儿。如果那时候你在，就不会觉得可惜。']],
 [['一扇窗的距离','顾清禾把安全帽扣到你头上，带你走进刚刚修好的旧钟楼。','今天没有甲方，没有图纸，也不用讨论方案。只是想带你看看我喜欢的风景。'],['图纸以外','突来的雨让你们留在设计室。她把藏在图纸下的一张手绘明信片递给你。','每一个方案我都能解释清楚。唯独见到你的时候，没法完全照着计划来。'],['给你留的灯','公司大楼渐渐暗下来，顾清禾却把窗边那盏灯留着，等你剪完片子。','这盏灯没有写在设计说明里。它是我专门给你留的。']],
 [['耳机的另一端','许知夏把耳机的一边戴到你耳朵上，手机里响起还没发布的新歌。','你先听。不是因为你是制作人，是因为这首歌第一次想到的人就是你。'],['雨的节拍','雨把音乐会推迟了。许知夏拿起吉他，把檐下的滴答声写进节拍。','计划泡汤也没关系。观众只有一个的时候，我反而更想把这首歌唱好。'],['只唱给你听','夜里的天台只剩两把椅子。她调好琴弦，在副歌前望向你。','这一句歌词我改了很多次。现在想想，其实就是“明天也想见你”。']],
 [['书页里的留言','苏晚带来两杯咖啡，把一份没有发表的采访稿放在你面前。','今天换你来采访我吧。不过有些答案，我只对你一个人说。'],['未发表的心事','你们在书店躲雨。苏晚从架子上拿下一本旧书，夹页里藏着手写的便签。','我总在问别人发生了什么。只有你会问我，今天是不是有点累。'],['故事之外','稿件发出后，她关掉电脑，和你走向已经没什么人的钟楼广场。','我的报道会写很多人的名字。今天的手账，只想写你的。']],
 [['两人份的清晨','江月把面粉轻轻拍到你鼻尖，又赶忙用手帕擦掉，自己先笑起来。','不是招你来帮工的。只是觉得，一起等面包烤好也会很开心。'],['刚好的温度','雨天的烘焙店提前打烊。江月把两杯热可可放到靠窗的小桌上。','这杯我调了很多次。你不用说特别好喝，告诉我真正喜欢的甜度就好。'],['月见以后','你帮她关掉店里的灯。月光下，她从柜台后拿出一小块写着日期的蛋糕。','今天不是谁的生日。只是我们一起度过了很好的一个普通日子。']],
 [['下播后的空位','唐梨关掉补光灯，把“直播中”的牌子翻到背面。她给你拉开身旁的椅子。','刚才一直在看弹幕。现在不看了，我想认真看看镜头后面的你。'],['无人观看的片段','一场户外直播被雨打断。你们躲进咖啡店，她终于把手机放进包里。','有些时候，没人看也挺好。这样我就可以慢一点说，慢一点喜欢你。'],['镜头外的晚安','最后一条弹幕消失后，唐梨没有马上离开。她把耳机摘下来，轻声叫你的名字。','直播间有很多个晚安。这一个，只想送给你。']]
];
dateBeats.forEach((route,p)=>route.forEach(([title,scene,line],n)=>{dates[p][n].title=title;dates[p][n].lines[0]=['旁白',scene];dates[p][n].lines[1]=[characters[p].name,line];}));
const walkEvents=[['路边的小花快被踩到了','把它移到花坛','拍张照片记录'],['一只橘猫跟了过来','蹲下来陪它','给它留点饮水'],['她想起了小时候的事','认真听她说完','分享自己的回忆'],['街角传来熟悉的音乐','邀请她停一会儿','一起轻轻哼唱'],['落日把影子拉得很长','陪她慢慢走','说下次还来这里']];
const news=[{title:'消失的街角花店',clue:'门上贴着“搬到温室旁，周三重新开业”。',answers:['老板失踪了','花店迁址了','店铺永久关闭'],correct:1},{title:'钟楼为什么停止报时',clue:'修缮公示：钟机齿轮临时拆卸保养。',answers:['城市停电','例行保养','钟楼被废弃'],correct:1},{title:'天台上的神秘灯光',clue:'社区公告：周末公益音乐会正在试灯。',answers:['广告拍摄','节日烟火','音乐会准备'],correct:2}];
const tasks=[{id:'shoot',name:'完成 3 次拍摄',max:3,reward:{gems:40,coins:1000}},{id:'wish',name:'许愿 1 次',max:1,reward:{wish:3}},{id:'walk',name:'漫步 5 步',max:5,reward:{energy:20}},{id:'train',name:'培养羁绊 1 次',max:1,reward:{coins:1200}},{id:'news',name:'调查 1 条新闻',max:1,reward:{gems:25}},{id:'social',name:'与她互动 1 次',max:1,reward:{wish:2}},{id:'arena',name:'参与 1 次票房赛',max:1,reward:{coins:1500}}];
tasks.filter(t=>['wish','train'].includes(t.id)).forEach(t=>t.reward.promises=1);
const achievements=[{id:'main',name:'第一部作品',desc:'通过 6 个主线节点',max:6,reward:{gems:150}},{id:'collect',name:'温柔收藏家',desc:'收集 15 张不同羁绊',max:15,reward:{gems:300}},{id:'heart',name:'越来越近',desc:'任意角色好感达到 30',max:30,reward:{gems:200}},{id:'company',name:'拾光开张',desc:'公司升至 5 级',max:5,reward:{coins:8000}}];

// Pet-league ERs keep the first release's card IDs intact.
characters.forEach((c,p)=>['一起养成的晴天','雨天也有毛球陪'].forEach((name,series)=>cards.push({id:72+p*2+series,p,rarity:'ER',name,base:attrs.map((_,a)=>205+(a===c.special?80:0)+series*15),fragmentNeed:60,source:series?'pet-history':'pet-season',petSeries:series})));

characters.forEach((c,p)=>cards.push({id:84+p,p,rarity:'ER',name:['叶隙中的光','向着明天的窗','城市的和弦','交稿后的晚风','留灯的小店','镜头之外的你'][p],base:attrs.map((_,a)=>225+(a===c.special?90:0)),fragmentNeed:60,source:'company-project'}));
characters.forEach((c,p)=>cards.push({id:90+p,p,rarity:'SP',name:['星穹花宴','极光之城','月弦流光','星夜注解','月冠甜梦','天台星映'][p],base:attrs.map((_,a)=>270+(a===c.special?75:0)+(p*13+a*11)%40),fragmentNeed:60,source:'skin-exchange'}));
const everydayNames=[['朝露日记','绿荫小憩'],['等一班春风','窗前构想'],['背着歌出门','唱片里的午后'],['书阶茶香','街角新讯'],['面粉晴天','系上好心情'],['沿河取景','剪辑间隙']];
characters.forEach((c,p)=>['N','NH'].forEach((rarity,n)=>cards.push({id:96+p*2+n,p,rarity,name:everydayNames[p][n],base:attrs.map((_,a)=>45+n*20+(a===c.special?35:0)+(p*7+a*3)%15),fragmentNeed:10+n*2,source:'wishing-coin'})));
cards.forEach(card=>{card.skin=card.id>=96?card.id-96:card.id<72?card.id%12:card.id<84?12+(card.id-72)%2:card.id<90?14:15;card.skinKey=card.id>=96?'everyday-'+card.skin:card.p+'-'+card.skin;});
const BirthdayContent=typeof module!=='undefined'&&module.exports?require('./birthday-content.js'):root.WarmBirthdayContent;
characters.forEach((c,p)=>{c.birthday=BirthdayContent.dates[p];['R','SR'].forEach((rarity,n)=>cards.push({id:108+p*2+n,p,rarity,name:BirthdayContent.cardNames[p][n],base:attrs.map((_,a)=>rankValue[rarity]+(a===c.special?75:0)+(p*13+a*7)%35),fragmentNeed:n?30:15,source:'birthday',skin:n,skinKey:'birthday-'+p+'-'+n}));});
const LabyrinthContent=typeof module!=='undefined'&&module.exports?require('./labyrinth-content.js'):root.WarmLabyrinthContent;
LabyrinthContent.volumes.forEach((v,volume)=>characters.forEach((c,p)=>{const rarity=v.rarities[p];cards.push({id:120+volume*6+p,p,rarity,name:v.names[p],base:attrs.map((_,a)=>rankValue[rarity]+(a===c.special?75:0)+(p*13+a*7+volume*11)%35),fragmentNeed:rarity==='SSR'?80:50,source:'memory-palace',memoryVolume:volume,skin:p,skinKey:volume?'memory-palace-'+volume+'-'+p:'memory-palace-'+p});}));
const SunJournalContent=typeof module!=='undefined'&&module.exports?require('./sun-journal-content.js'):root.WarmSunJournalContent;
characters.forEach((c,p)=>cards.push({id:132+p,p,rarity:'ER',name:SunJournalContent.names[p],base:attrs.map((_,a)=>rankValue.ER+30+(a===c.special?75:0)+(p*13+a*7)%35),fragmentNeed:60,source:'sun-journal',skin:0,skinKey:'sun-journal-'+p}));
const D={characters,attrs,cards,chapters,stages,elites,gates,experts,dates,walkEvents,news,tasks,achievements};
if(typeof module!=='undefined'&&module.exports)module.exports=D;else root.WarmData=D;
})(typeof window==='undefined'?globalThis:window);
