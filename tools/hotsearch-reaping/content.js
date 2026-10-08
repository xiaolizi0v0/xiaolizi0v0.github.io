(function(r,f){const d=f();if(typeof module==='object'&&module.exports)module.exports=d;else r.HotContent=d;})(globalThis,()=>({
  heroes:[{id:'bell',name:'铃',role:'清屏巡灯人',attack:1,hp:150,speed:135,color:'#5b9c83',desc:'均衡清场，查证波覆盖更广。'},{id:'ink',name:'砚',role:'破盾拆章者',attack:1.2,hp:125,speed:128,color:'#bc8a62',desc:'火力更强，直接攻击也能削弱断章护盾。'},{id:'leaf',name:'禾',role:'降温守望者',attack:.9,hp:180,speed:130,color:'#8fa164',desc:'生命更高，持续回复，适合无人巡航。'}],
  maps:[{name:'晴芽广场',color:'#c7dcb9',chapter:'先听见彼此',boss:'复读绒团',rule:'复读怪会分裂，不能只在原地等它靠近。',art:'sprout'},{name:'蜜湾电台',color:'#b4dadd',chapter:'找到扩音源',boss:'扩音鲸影',rule:'扩音怪会刷出新的噪声，清源优先更有效。',art:'bay'},{name:'陶风书巷',color:'#e2c0a1',chapter:'把上下文补回来',boss:'断章甲魁',rule:'断章护盾会抵挡伤害，查证能立刻破盾。',art:'clay'},{name:'绒雨花园',color:'#bdcdb0',chapter:'给讨论一点空间',boss:'情绪苞主',rule:'压力上涨更快，降温与范围清场很重要。',art:'rain'},{name:'晚霞剧场',color:'#e6c0cc',chapter:'别让回声盖过声音',boss:'热度花冠',rule:'复读与扩音共同出现，固定武器组合决定效率。',art:'sunset'},{name:'星眠讯塔',color:'#c0c7e1',chapter:'今夜可以安静一些',boss:'星夜风暴',rule:'三类噪声同时出现，首领会释放密集弹幕。',art:'stars'}],
  weapons:[
    {id:'paper',name:'事实纸刃',icon:'▱',unlock:0,cost:30,desc:'自动追瞄；进阶后连续发出三枚穿透纸刃。',cd:.4,damage:13},
    {id:'bell',name:'清屏铃波',icon:'◉',unlock:0,cost:35,desc:'周期环形冲击，清理近身噪声与敌方弹丸。',cd:2.1,damage:18},
    {id:'orbit',name:'守护书签',icon:'✧',unlock:2,cost:55,desc:'书签绕身旋转，持续切开近身敌群。',cd:.8,damage:11},
    {id:'context',name:'上下文扇',icon:'▤',unlock:5,cost:65,desc:'扇形纸页削弱护盾，进阶后穿透更多目标。',cd:.9,damage:15},
    {id:'beam',name:'来源光束',icon:'╱',unlock:8,cost:80,desc:'射线贯穿整条路径，适合清理扩音源。',cd:1.4,damage:30},
    {id:'frost',name:'降温墨池',icon:'❄',unlock:12,cost:85,desc:'在敌群中留下持续伤害与减速区域。',cd:2.5,damage:9},
    {id:'return',name:'回旋引文',icon:'↶',unlock:18,cost:100,desc:'往返的纸环穿过多个目标。',cd:1.1,damage:20},
    {id:'petal',name:'花瓣辟噪',icon:'❋',unlock:24,cost:120,desc:'向周围发出密集花瓣，覆盖多个方向。',cd:1.6,damage:17}
  ],
  upgrades:[
    {id:'attack',name:'表达力度',desc:'所有武器伤害 +8% / 级',cost:55,max:10,unlock:0},
    {id:'hp',name:'清晰心境',desc:'最大清晰度 +18 / 级',cost:50,max:10,unlock:0},
    {id:'speed',name:'轻步巡航',desc:'移动速度 +5% / 级',cost:65,max:6,unlock:2},
    {id:'range',name:'覆盖范围',desc:'范围攻击半径 +6% / 级',cost:70,max:8,unlock:4},
    {id:'haste',name:'清屏节拍',desc:'武器冷却 -4% / 级',cost:80,max:8,unlock:6},
    {id:'magnet',name:'上下文吸收',desc:'拾取距离 +12 / 级',cost:60,max:8,unlock:8},
    {id:'focus',name:'证据整理',desc:'查证资源获取 +10% / 级',cost:75,max:6,unlock:10},
    {id:'armor',name:'讨论边界',desc:'受伤减少 4% / 级',cost:90,max:8,unlock:12},
    {id:'regen',name:'片刻休息',desc:'每秒恢复0.2清晰度 / 级',cost:85,max:8,unlock:15},
    {id:'cooling',name:'压力疏导',desc:'压力额外衰减0.1 / 秒 / 级',cost:95,max:6,unlock:18},
    {id:'income',name:'巡航积累',desc:'结算收益 +8% / 级',cost:95,max:8,unlock:24},
    {id:'skill',name:'置顶共鸣',desc:'主动技能伤害 +12% / 级',cost:110,max:8,unlock:30}
  ],
  enemyKinds:{noise:{name:'刷屏团',label:'刷屏',hp:17,speed:49,r:12,damage:8,color:'#b4b1ca'},repeat:{name:'复读怪',label:'复读',hp:26,speed:46,r:14,damage:9,color:'#c0a3c4'},source:{name:'扩音怪',label:'扩音',hp:65,speed:22,r:19,damage:10,color:'#c28b83'},shield:{name:'断章怪',label:'断章',hp:48,speed:41,r:17,damage:11,color:'#ba9b78'},rush:{name:'情绪团',label:'上头',hp:22,speed:95,r:13,damage:9,color:'#d69c80'},speaker:{name:'带节奏号',label:'节奏',hp:40,speed:32,r:15,damage:9,color:'#9daac2'}},
  policies:[{id:'near',name:'近身清屏',desc:'优先击退最靠近的噪声。'},{id:'source',name:'优先清源',desc:'优先打扩音怪，减少后续增殖。'},{id:'shield',name:'优先破盾',desc:'优先清理断章怪，查证更频繁。'}],
  stories:[
    ['广场太吵了','潮讯广场曾经只响着铃声和邻里的问候。一天，复制的气泡盖住了所有声音。铃带着事实纸刃走进广场，发现这些气泡并没有新的内容，它们只是不停重复。她开始清理噪声，给仍想认真说话的人留下一点空间。'],
    ['第一片安静','复读绒团散去，草地上落下细小的上下文碎片。铃把它们收好，没有宣布谁赢了争论。她只把潮灯重新点亮，让大家可以听见一句完整的话。居民送她一只风铃：等广场再次变吵，它会轻轻提醒她。'],
    ['电台的回声','蜜湾的扩音设备不断重复同一个声音。砚走近设备，发现清理面前的气泡还不够，新的噪声总会从后面涌出来。他和铃改变了攻击优先级，先找到真正的扩音源。海风终于穿过了电台的窗。'],
    ['声音不必更大','扩音鲸影变成蓝色的光点。居民调低了电台音量，却没有关闭电台。新的节目为不同的人留了不同的时间。砚记下这次战斗：更多的攻击不总能解决问题，找到源头，有时比追着每一个气泡跑更重要。'],
    ['缺掉的一页','陶风书巷出现了坚硬的断章护盾。那些被剪开的片段听起来毫不相干。铃收集上下文，展开查证波。护盾退去，许多看似冲突的句子重新接在一起。她没有替居民选答案，只把丢掉的一页放回了桌上。'],
    ['完整地读完','断章甲魁散成温暖的石子。居民在巷口放了一张小桌，上面写着来源和日期。砚把自己的工具靠在墙边，坐下来慢慢读完最后一页。有些分歧仍在，但它们终于不必靠缺失的内容来维持。'],
    ['情绪也会累','绒雨花园的噪声压力不断上涨。禾没有催促所有人立刻冷静，而是在广场上留下一片降温墨池。追赶的气泡慢了下来，守望者有时间捡起上下文。她知道休息不能代替查证，但它可以让查证有机会发生。'],
    ['雨声回来','情绪苞主退去，花园重新听得见雨水落在叶上的声音。禾留下几个空椅子，让居民可以坐一会儿，也可以继续说话。铃把这段经历收进档案：清屏的目的，是让更多声音能被听见。'],
    ['追着热度跑','晚霞剧场的复读和扩音互相助长。一个气泡刚被清掉，新的就顶了上来。铃、砚与禾调整固定武器组合，轮流照看不同方向。热度并不是敌人，但无休止的复制会占满每个人的注意力。'],
    ['留住不同的声音','热度花冠落下时，剧场里没有一片统一的掌声。有人喜欢这场演出，有人仍有疑问。守望者没有清掉这些分歧。他们只收起了刷屏气泡，让每个人能完整地说完自己的那一句。'],
    ['最后一场风暴','星眠讯塔把所有噪声汇在一起：复读、扩音、断章与情绪。守望者不再依赖单一工具。她们看清源头、保留上下文、适时降温，再用置顶共鸣扫开最拥挤的地方。夜空一点点露了出来。'],
    ['回来仍有光','最后的风暴散去，群岛没有变成永远安静的地方。讨论还会继续，新的热搜仍会出现。铃把工具放回工坊，交给能够自动巡航的潮灯。她可以去休息，也可以明天回来。这里会继续为认真说话的人留着光。']
  ],
  trainingTitles:['广场里的复读泡泡','电台的扩音回声','被剪掉的上下文','花园里的情绪旋风','剧场里的热度追逐','讯塔的清屏之夜'],
  achievements:[{id:'first',name:'第一次清屏',key:'kills',goal:100,reward:80},{id:'thousand',name:'留出讨论空间',key:'kills',goal:1000,reward:150},{id:'tenk',name:'清屏守望者',key:'kills',goal:10000,reward:600},{id:'burst',name:'一瞬清场',key:'burst',goal:20,reward:120},{id:'combo',name:'连续表达',key:'combo',goal:80,reward:200},{id:'source',name:'找到源头',key:'sources',goal:50,reward:150},{id:'shield',name:'上下文回来',key:'shields',goal:50,reward:150},{id:'verify',name:'查证习惯',key:'verifies',goal:30,reward:150},{id:'cool',name:'稍微降温',key:'cools',goal:30,reward:150},{id:'pin',name:'清晰置顶',key:'pins',goal:20,reward:180},{id:'win',name:'广场归来',key:'wins',goal:1,reward:100},{id:'six',name:'第一章归档',key:'highest',goal:6,reward:180},{id:'eighteen',name:'走过半程',key:'highest',goal:18,reward:400},{id:'all',name:'今夜可以休息',key:'highest',goal:36,reward:1000},{id:'endless',name:'风暴巡航',key:'endless',goal:10,reward:400},{id:'study',name:'工坊常客',key:'studies',goal:30,reward:200}]
}));
