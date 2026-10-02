(function(root,factory){const d=factory();if(typeof module==='object'&&module.exports)module.exports=d;else root.VELOCITY_DATA=d})(typeof window==='undefined'?globalThis:window,()=>({
version:1,
cars:[
 {id:'needle',name:'穿针',alias:'NEEDLE / 01',color:'#c1ff35',hp:125,speed:292,grip:1,lock:.85,drift:1,armour:1,group:'draft',desc:'尾流连接速度更快。跟入、拉出、换速，把对手的优势变成你的下一次超车。'},
 {id:'iron',name:'铁壳',alias:'IRONCLAD / 02',color:'#aa55ff',hp:175,speed:280,grip:.95,lock:1,drift:1,armour:.75,group:'survive',desc:'车体更耐撞，碰撞损伤降低 25%，撞车后损速更小。用重量守住路线，再铺一条自己的加速轨。'},
 {id:'crosswind',name:'侧风',alias:'CROSSWIND / 03',color:'#47e6f2',hp:135,speed:287,grip:1.18,lock:1,drift:1.35,armour:1,group:'drift',desc:'抓地更好，漂移集气与电量收益提高 35%。热量也是资源，连续出弯建立速度优势。'}
],
cities:[
 {name:'高架断层',tag:'SKYLINE / 01',color:'#c1ff35',boss:'换道王',bossType:'block',width:140,rain:false,shape:.12,desc:'废弃高架与危险捷径。换道王会预告并封住一段车道。'},
 {name:'磁轨港口',tag:'MAGNET DOCK / 02',color:'#aa55ff',boss:'磁轨女王',bossType:'rail',width:136,rain:false,shape:.22,desc:'磁轨交错的港区，所有人都能吃到路轨。小心替对手铺好了超车路线。'},
 {name:'雨夜环城',tag:'RAIN CIRCUIT / 03',color:'#47e6f2',boss:'税速者',bossType:'tax',width:145,rain:true,shape:.17,desc:'湿滑弯道和高速收费区。看清预警，选择减速还是护盾硬闯。'}
],
difficulties:[{name:'街头',ai:0,damage:1,reward:1},{name:'追缉',ai:20,damage:1.25,reward:1.5},{name:'红线',ai:38,damage:1.5,reward:2.2}],
routes:[
 {id:'fast',name:'极速捷径',glyph:'↗',length:.84,width:-20,curve:1,hazards:4,desc:'赛道更短、更窄，障碍更多；完赛额外获得 40 维修币。'},
 {id:'tech',name:'技术路线',glyph:'≈',length:1.06,width:-5,curve:1.6,hazards:2,desc:'弯道更明显，漂移收益 +20%；下站开始获得一次漂移组改件选择。'},
 {id:'safe',name:'安全维修线',glyph:'✚',length:1.02,width:10,curve:.8,hazards:-2,desc:'赛道更宽、障碍更少；入站恢复 30% 车体，完赛奖励较少。'}
],
groups:{draft:'尾流换速',rail:'路轨控制',drift:'漂移热管理',survive:'赛车续航'},
upgrades:[
 {id:'antenna',name:'尾流天线',glyph:'⌁',group:'draft',max:4,desc:'尾流捕捉距离 +35，建立连接所需时间减少 0.14 秒。'},
 {id:'clutch',name:'劫速离合',glyph:'⇄',group:'draft',max:4,desc:'换速冷却减少 0.6 秒；交换后获得短暂加速牵引。'},
 {id:'bank',name:'能量托管',glyph:'▣',group:'draft',max:4,desc:'每次换速额外获得 8 电量，连接期间蓄电更快。'},
 {id:'motor',name:'高压电机',glyph:'ϟ',group:'draft',max:4,desc:'基础最高车速 +12；进入喷射状态时同样生效。'},
 {id:'torque',name:'起步扭矩',glyph:'»',group:'draft',max:4,desc:'纵向加速提高 12%，撞击后的速度更快恢复。'},
 {id:'length',name:'路轨卷轴',glyph:'═',group:'rail',max:4,desc:'共享路轨长度 +75，存在时间 +2 秒。'},
 {id:'width',name:'宽幅磁场',glyph:'▱',group:'rail',max:3,desc:'路轨宽度 +14，铺轨电量消耗减少 3。'},
 {id:'payout',name:'过路抽成',glyph:'◇',group:'rail',max:3,desc:'每辆对手使用你的路轨时，获得额外 8 维修币。'},
 {id:'launch',name:'弹射轨面',glyph:'↥',group:'rail',max:4,desc:'共享路轨提供的加速提高 18。对手同样能使用。'},
 {id:'tires',name:'侧向抓地',glyph:'◎',group:'drift',max:4,desc:'抓地 +0.14，改善弯道损速与横向惯性。'},
 {id:'cooling',name:'液冷循环',glyph:'❄',group:'drift',max:4,desc:'热量散去速度额外 +3 / 秒。'},
 {id:'reclaim',name:'漂移回收',glyph:'↻',group:'drift',max:3,desc:'漂移电量收益 +25%，集气效率 +12%。技术路线继续叠加。'},
 {id:'magnet',name:'货箱接收',glyph:'⬡',group:'drift',max:3,desc:'拾取横向范围 +20，资料获取 +10%。'},
 {id:'combo',name:'连续甩尾',glyph:'≈',group:'drift',max:4,desc:'每积累 45 漂移距离额外获得 3 资料与 3 维修币。'},
 {id:'armour',name:'活性车壳',glyph:'✚',group:'survive',max:4,desc:'最大车体 +22，立即修复 22，损伤降低 8%。'},
 {id:'supply',name:'护盾继电',glyph:'⬢',group:'survive',max:3,desc:'护盾冷却减少 1.5 秒，护盾持续时间 +0.4 秒。'},
 {id:'repair',name:'维修储备',glyph:'⚒',group:'survive',max:3,desc:'维修次数 +1（上限 5），立即修复 20 车体。'},
 {id:'regen',name:'自愈底盘',glyph:'♥',group:'survive',max:3,desc:'连续 8 秒无损驾驶后，每秒恢复 1.5 车体。'},
 {id:'relay',name:'连锁劫速',glyph:'⇉',group:'draft',max:1,requires:{antenna:2,clutch:2},desc:'换速后获得 1.2 秒护盾；接下来 3 秒新连接只需 0.35 秒。'},
 {id:'private',name:'私有快线',glyph:'▰',group:'rail',max:1,requires:{width:2,length:2},desc:'自己使用路轨的加速额外 +50%，并获得短暂护盾；对手仍可使用基础加速。'},
 {id:'toll',name:'路权税务',glyph:'¤',group:'rail',max:1,requires:{payout:2,bank:2},desc:'对手使用你的路轨时额外为你提供 15 电量和 12 维修币。'},
 {id:'coldFire',name:'冷焰引擎',glyph:'♨',group:'drift',max:1,requires:{cooling:2,reclaim:2},desc:'热量高于 55 时，氮气延长至 3.2 秒并降低 12 热量。仍消耗一管氮气。'},
 {id:'slingshot',name:'出弯弹弓',glyph:'↯',group:'drift',max:1,requires:{tires:2,motor:2},desc:'结束一段超过 25 距离的漂移，获得 1.4 秒喷射和 8 电量。'},
 {id:'phoenix',name:'不死底盘',glyph:'✹',group:'survive',max:1,requires:{armour:2,regen:2},desc:'本局第一次致命撞击改为恢复 35% 车体，并获得 4 秒护盾。'}
],
events:[
 {id:'rush',name:'借一场未来',glyph:'»',gain:'立刻选择 2 个改件',cost:'未来两站对手最高车速 +12'},
 {id:'leak',name:'拆掉限速器',glyph:'ϟ',gain:'本局基础最高车速 +18',cost:'立即损失 25% 最大车体，至少剩 1'},
 {id:'cool',name:'冷却旁路',glyph:'❄',gain:'本局散热额外 +4 / 秒',cost:'电量自然恢复速度 -1.5 / 秒'},
 {id:'repair',name:'停站保养',glyph:'✚',gain:'恢复全部车体并增加 1 次维修',cost:'本局结算碎片减少 15%'},
 {id:'rail',name:'路轨赞助',glyph:'═',gain:'铺轨电量消耗 -10',cost:'所有共享路轨也为对手额外加速 20'},
 {id:'refuse',name:'原厂继续',glyph:'—',gain:'获得 25 维修币',cost:'无额外代价'}
],
meta:[{id:'motor',name:'电机研发',max:5,cost:100,desc:'每级基础车速 +3'},{id:'body',name:'车体研发',max:5,cost:85,desc:'每级最大车体 +8'},{id:'battery',name:'电池研发',max:5,cost:80,desc:'每级自然蓄电 +0.3 / 秒'},{id:'grip',name:'轮胎研发',max:5,cost:90,desc:'每级抓地 +0.025'},{id:'cargo',name:'物流研发',max:5,cost:70,desc:'每级完赛维修币 +8'}],
achievements:[{id:'swap',name:'速度归我',stat:'swaps',target:20,reward:100},{id:'drift',name:'侧着冲线',stat:'drift',target:3000,reward:130},{id:'rail',name:'共享街区',stat:'otherRails',target:20,reward:150},{id:'overtake',name:'逆袭车手',stat:'overtakes',target:50,reward:120},{id:'win',name:'封王街头',stat:'wins',target:1,reward:180},{id:'advanced',name:'改件艺术',stat:'advanced',target:6,reward:180},{id:'cities',name:'城市巡游',stat:'cities',target:3,reward:250},{id:'endless',name:'永不收车',stat:'endless',target:10,reward:200}]
}));
