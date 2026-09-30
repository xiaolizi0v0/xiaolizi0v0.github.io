(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.CIRCUIT_DATA=data})(typeof window!=='undefined'?window:globalThis,()=>({
  version:1,
  heroes:[
    {id:'edge',name:'锋线',alias:'THE CUTTER',color:'#c1ff35',mark:'刃',hp:140,speed:255,edge:1.35,capture:8,echo:.65,group:'geometry',desc:'边缘伤害 +35%。用接缝切进敌群，再用闭环抹平整片战场。'},
    {id:'prism',name:'折光',alias:'THE HIJACKER',color:'#47e6f2',mark:'光',hp:120,speed:270,edge:1,capture:14,echo:.65,group:'capture',desc:'捕弹容量 +6。主动把敌人弹幕织进轨迹，收线时原数返还。'},
    {id:'echo',name:'幽帧',alias:'THE REPLAY',color:'#aa55ff',mark:'帧',hp:130,speed:250,edge:1,capture:8,echo:1,group:'echo',desc:'回声伤害更高。用真实旧回路引诱敌群，让过去的自己再次收割。'}
  ],
  maps:[
    {name:'地铁断层',tag:'FAULTLINE / 01',color:'#c1ff35',boss:'断线者 · 裁决',type:'cutter',scale:1,desc:'穿过废弃站台，用刀线封住涌入的追迹者。首领会烧断你的轨迹。'},
    {name:'电弧中庭',tag:'PRISM ATRIUM / 02',color:'#b353ff',boss:'棱镜核心',type:'prism',scale:1.22,desc:'敌人的弹幕也是你的弹药。射手密集出现，夺弹构筑在这里大放异彩。'},
    {name:'失真天台',tag:'AFTERIMAGE / 03',color:'#47e6f2',boss:'秒针暴君',type:'clock',scale:1.45,desc:'延时爆破与召唤者占据天台。提前留好旧回路，再把敌群引回来。'}
  ],
  difficulties:[{name:'普通',scale:1,reward:1},{name:'过载',scale:1.4,reward:1.5},{name:'崩坏',scale:1.85,reward:2.2}],
  upgrades:[
    {id:'edge',name:'宽刃边界',glyph:'╱',group:'geometry',max:4,desc:'轨迹判定宽度 +5，边缘清算伤害 +12%。'},
    {id:'area',name:'面积奖赏',glyph:'△',group:'geometry',max:4,desc:'闭环面积的伤害奖励提高 20%。'},
    {id:'power',name:'剪切增幅',glyph:'✂',group:'geometry',max:5,desc:'回路、回声与返还弹伤害 +12%。'},
    {id:'seam',name:'接缝暴击',glyph:'⋔',group:'geometry',max:3,desc:'最后一条接缝伤害 +25%，接缝命中额外返还线能。'},
    {id:'spool',name:'延长线卷',glyph:'∞',group:'geometry',max:4,desc:'可用轨迹长度 +250，储存点数同步增加。'},
    {id:'capacity',name:'弹幕仓库',glyph:'▣',group:'capture',max:4,desc:'储存弹幕容量 +4，捕弹同时回复额外线能。'},
    {id:'reflect',name:'夺弹弹头',glyph:'↗',group:'capture',max:4,desc:'返还弹伤害 +20%，返还弹穿透 +1。'},
    {id:'charge',name:'超载换能',glyph:'ϟ',group:'capture',max:4,desc:'捕弹和击杀获得的超载能量 +25%。'},
    {id:'harvest',name:'生命抽帧',glyph:'♥',group:'capture',max:3,desc:'每截获 4 发弹丸恢复 2 生命，清算击杀额外回复线能。'},
    {id:'echo',name:'重放增幅',glyph:'◷',group:'echo',max:4,desc:'回声伤害倍率 +18%。'},
    {id:'memory',name:'短时记忆',glyph:'↻',group:'echo',max:4,desc:'回声冷却缩短 13%，回声返还 3 线能。'},
    {id:'lure',name:'旧影诱饵',glyph:'◎',group:'echo',max:3,desc:'旧回路中心会吸引附近敌人，持续时间提高。'},
    {id:'freeze',name:'停帧回路',glyph:'❄',group:'echo',max:3,desc:'回声命中冻结敌人 0.5 秒，首领持续时间较短。'},
    {id:'dash',name:'无缝闪避',glyph:'»',group:'motion',max:3,desc:'闪避冷却缩短 12%，无敌时间延长 0.05 秒。'},
    {id:'rewind',name:'倒带回收',glyph:'≪',group:'motion',max:3,desc:'倒带冷却缩短 15%，回到起点额外回复 6 线能。'},
    {id:'hp',name:'活性装甲',glyph:'✚',group:'motion',max:5,desc:'最大生命 +22，并立即恢复 22 生命。'},
    {id:'energy',name:'线能循环',glyph:'⊕',group:'motion',max:4,desc:'线能回复速度 +1.5 / 秒，收线消耗减少 1。'},
    {id:'magnet',name:'资料磁吸',glyph:'◇',group:'motion',max:4,desc:'资料拾取半径 +60，经验获取 +6%。'},
    {id:'double',name:'镜像剪辑',glyph:'⋈',group:'geometry',max:1,requires:{area:2,spool:2},desc:'收线后，把回路绕中心旋转 180°，再清算一次。'},
    {id:'bloom',name:'常驻裂域',glyph:'✹',group:'geometry',max:1,requires:{power:2,edge:2},desc:'闭环留下 3 秒的裂域，每 0.6 秒清算圈内敌人。'},
    {id:'storm',name:'弹幕暴政',glyph:'≋',group:'capture',max:1,requires:{capacity:2,charge:2},desc:'截获一发返还两发，返还弹自动追踪最近目标。'},
    {id:'prism',name:'三相折射',glyph:'⋇',group:'capture',max:1,requires:{reflect:2,seam:2},desc:'返还弹命中后分裂成两条清算射线，最多传导两次。'},
    {id:'repeat',name:'双重曝光',glyph:'▥',group:'echo',max:1,requires:{echo:2,memory:2},desc:'调用回声后 0.8 秒，自动在同一位置再次重放。'},
    {id:'temporal',name:'逆时剪辑',glyph:'◴',group:'echo',max:1,requires:{rewind:2,lure:2},desc:'倒带时立即把回收的真实轨迹封成一次免费回声。'}
  ],
  groups:{geometry:'几何剪切',capture:'弹幕夺取',echo:'时间回声',motion:'机动续航'},
  meta:[
    {id:'power',name:'刃口校准',glyph:'╱',max:6,cost:90,desc:'每级所有回路伤害 +4%'},
    {id:'hp',name:'剪辑义体',glyph:'✚',max:6,cost:70,desc:'每级最大生命 +8'},
    {id:'spool',name:'线卷扩容',glyph:'∞',max:5,cost:80,desc:'每级初始轨迹长度 +90'},
    {id:'pickup',name:'资料接收',glyph:'◇',max:5,cost:65,desc:'每级拾取半径 +25'},
    {id:'energy',name:'回收回路',glyph:'⊕',max:5,cost:85,desc:'每级线能回复 +0.4 / 秒'}
  ],
  events:[
    {id:'rush',name:'借一段未来',glyph:'»',benefit:'立刻获得 2 次协议选择',cost:'接下来两波敌人移动速度 +30%'},
    {id:'blood',name:'用血写底稿',glyph:'♥',benefit:'本局回声伤害额外 +35%',cost:'立即失去 25% 最大生命，最多损失到 1 生命'},
    {id:'battery',name:'临时供电',glyph:'ϟ',benefit:'线能回复永久 +3 / 秒',cost:'接下来两波敌人伤害 +30%'},
    {id:'repair',name:'安全剪辑',glyph:'✚',benefit:'恢复全部生命，治疗次数 +1',cost:'本局结算货币减少 12%'},
    {id:'archive',name:'放大旧影',glyph:'◷',benefit:'每次回声额外返还 12 线能',cost:'本局敌人生命 +12%'},
    {id:'refuse',name:'保持原稿',glyph:'—',benefit:'不接受修改，获得 25 补给币',cost:'无代价'}
  ],
  achievements:[
    {id:'first',name:'第一刀回路',stat:'kills',target:100,reward:90,desc:'累计清算 100 个敌人'},
    {id:'capture',name:'敌人的弹药',stat:'captures',target:50,reward:100,desc:'累计截获 50 发弹幕'},
    {id:'weave',name:'职业剪辑师',stat:'seals',target:30,reward:100,desc:'累计完成 30 次有效收线'},
    {id:'burst',name:'一刀清场',stat:'burst',target:15,reward:150,desc:'一次清算击杀 15 个敌人'},
    {id:'win',name:'封锁解除',stat:'wins',target:1,reward:150,desc:'完成一次八波行动'},
    {id:'maps',name:'城市重写',stat:'maps',target:3,reward:300,desc:'完成三个不同地图'},
    {id:'advanced',name:'规则编辑者',stat:'advanced',target:5,reward:180,desc:'累计取得 5 个高阶协议'},
    {id:'endless',name:'无休止剪辑',stat:'endless',target:16,reward:220,desc:'无尽抵达第 16 波'}
  ]
}));
