(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SunnyContent=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const islands=[
    {id:'sprout',name:'晴芽岛',subtitle:'让失序的光重新相遇',color:'#a8d6ad',hazard:'平稳潮汐',rule:'供能沿金色路径流动，拆掉中继会使下游停机。',boss:'团绒雾王'},
    {id:'bay',name:'蜜湾岛',subtitle:'两道潮流，一段航路',color:'#91d4df',hazard:'双潮冲击',rule:'雾核独立攻击更强；蓝色盾叶可以保护守望者。',boss:'双潮鲸影'},
    {id:'clay',name:'陶风岛',subtitle:'拆开坚硬的旧日外壳',color:'#e9b18a',hazard:'岩甲覆盖',rule:'甲片保护相邻部件。先拆甲，再接管被保护的炮瓣。',boss:'赤陶甲魁'},
    {id:'rain',name:'绒雨岛',subtitle:'修复也需要正确的方向',color:'#b7cfa1',hazard:'再生绒雨',rule:'有供能的敌方修复苞会让已拆掉的普通部件再生。',boss:'绒雨苞主'},
    {id:'sunset',name:'晚霞岛',subtitle:'把夺回的光留在身边',color:'#e8adc0',hazard:'雾潮覆写',rule:'雾核周期夺回一个接管部件；潮铃与稳固器可以减慢覆写。',boss:'霞光覆潮'},
    {id:'stars',name:'星眠岛',subtitle:'今夜，每盏灯都能休息',color:'#a5afdf',hazard:'明暗潮汐',rule:'供能每十秒改变强度。保留多条来源，让反用火力更稳定。',boss:'星眠回航者'}
  ];
  const kinds={
    core:{name:'雾核',icon:'◆',hp:160,demand:0,slot:0,desc:'击破即可获胜，不能接管；仍会独立攻击。',ally:'胜利目标'},
    source:{name:'能量芽',icon:'✦',hp:60,demand:0,slot:2,desc:'通过连接提供能量。拆掉会使下游停机。',ally:'仅给可达的蓝色部件供能'},
    relay:{name:'中继环',icon:'↗',hp:38,demand:0,slot:1,desc:'把能量传到下游，拆掉会断路。',ally:'保留原来的连接路径'},
    gun:{name:'炮瓣',icon:'✹',hp:46,demand:3,slot:1,desc:'消耗能量，向守望者发射雾弹。',ally:'沿用能源攻击敌体'},
    shield:{name:'盾叶',icon:'⬡',hp:52,demand:2,slot:1,desc:'有供能时保护雾核，减轻其受伤。',ally:'为守望者提供减伤'},
    repair:{name:'修复苞',icon:'✿',hp:42,demand:3,slot:1,desc:'持续修复敌方受损部件。',ally:'持续治疗守望者'},
    armor:{name:'甲片',icon:'▰',hp:58,demand:0,slot:1,desc:'无需供能，保护相邻敌方部件。',ally:'增加守望者减伤'},
    pulse:{name:'潮铃',icon:'◉',hp:54,demand:3,slot:2,desc:'周期夺回一个相邻的接管部件。',ally:'压制雾核，延缓敌体进攻'},
    bud:{name:'孢芽',icon:'❋',hp:45,demand:3,slot:1,desc:'产生小雾团并连续攻击。',ally:'用相同能量额外反击'}
  };
  // Directed, authored body layouts. Core is node 0; no hidden bonus by policy.
  const layouts=[
    {name:'单枝雾团',nodes:[['core',210,144],['source',83,97],['relay',87,229],['gun',82,343],['shield',222,286]],edges:[[1,2],[2,3],[2,4],[4,0]]},
    {name:'双潮雾体',nodes:[['core',210,133],['source',80,93],['source',340,93],['relay',85,218],['relay',335,218],['gun',83,343],['gun',337,343],['shield',210,277]],edges:[[1,3],[3,5],[3,7],[2,4],[4,6],[4,7],[7,0]]},
    {name:'护甲苞团',nodes:[['core',210,139],['source',74,87],['relay',82,239],['gun',210,358],['repair',340,273],['shield',211,260],['armor',337,138]],edges:[[1,2],[2,3],[2,5],[1,4],[5,0],[6,4],[6,0]]},
    {name:'交织分枝',nodes:[['core',210,144],['source',77,86],['source',342,86],['relay',85,221],['relay',337,223],['gun',87,354],['repair',336,354],['shield',210,285]],edges:[[1,3],[2,4],[3,4],[4,3],[3,5],[4,6],[3,7],[7,0]]},
    {name:'孢芽雾兽',nodes:[['core',210,130],['source',80,86],['relay',93,233],['bud',81,355],['gun',338,348],['shield',215,278],['source',340,89]],edges:[[1,2],[2,3],[2,5],[6,4],[6,5],[5,0]]},
    {name:'覆写潮铃',nodes:[['core',210,133],['source',72,89],['relay',77,230],['gun',76,351],['shield',211,276],['pulse',341,245],['source',342,86]],edges:[[1,2],[2,3],[2,4],[6,5],[5,3],[5,4],[4,0]]},
    {name:'三源绒冠',nodes:[['core',210,139],['source',72,90],['source',343,87],['relay',80,227],['relay',341,221],['gun',76,353],['gun',341,354],['shield',210,275],['repair',214,359],['armor',212,61]],edges:[[1,3],[2,4],[3,5],[4,6],[3,7],[4,7],[4,8],[7,0],[9,0],[9,7]]},
    {name:'潮环领主',nodes:[['core',210,146],['source',74,80],['source',346,80],['relay',82,211],['relay',340,211],['gun',72,350],['shield',210,260],['pulse',345,347],['repair',212,360],['armor',210,59]],edges:[[1,3],[2,4],[3,4],[4,3],[3,5],[4,7],[4,8],[3,6],[4,6],[6,0],[9,0],[9,6]]}
  ];
  const heroes=[
    {id:'bell',name:'铃',role:'巡灯守望者',icon:'🔔',attack:1,health:1,interval:1,heal:0,desc:'稳定攻击，适合观察供能与部件取舍。'},
    {id:'ink',name:'砚',role:'潮石拆解者',icon:'🪨',attack:1.22,health:.82,interval:1.12,heal:0,desc:'单次伤害高、生命较少，适合迅速拆除保护层。'},
    {id:'leaf',name:'禾',role:'航路修复师',icon:'🌿',attack:.83,health:1.12,interval:1,heal:.6,desc:'持续回复，适合反用与长时间作战。'}
  ];
  const policies=[
    {id:'balanced',name:'均衡',icon:'◈',desc:'先处理威胁与护盾，有容量时接管炮瓣和修复苞。',order:['shield','gun','repair','pulse','armor','core','source','relay','bud'],capture:['gun','repair','shield']},
    {id:'sever',name:'断能',icon:'✂',desc:'先拆供能来源，让敌体停机；接管的火力也可能断电。',order:['source','relay','repair','shield','pulse','gun','armor','bud','core'],capture:[]},
    {id:'commandeer',name:'夺炮',icon:'✦',desc:'保留红色供能，优先接管火力再击破雾核。',order:['gun','bud','shield','repair','armor','pulse','core','relay','source'],capture:['gun','bud','shield','repair']},
    {id:'shelter',name:'护航',icon:'⬡',desc:'先接管治疗与护盾，保证续航后处理核心。',order:['repair','shield','pulse','gun','armor','core','source','relay','bud'],capture:['repair','shield','pulse','gun']},
    {id:'breach',name:'破甲',icon:'◆',desc:'优先拆甲片、护盾和修复苞，快速暴露雾核。',order:['armor','shield','repair','core','pulse','gun','bud','relay','source'],capture:[]}
  ];
  const research=[
    {id:'attack',name:'潮刃打磨',desc:'普攻伤害每级 +12%',base:30,max:12,unlock:0},
    {id:'vitality',name:'守望体魄',desc:'生命每级 +15%',base:28,max:12,unlock:0},
    {id:'haste',name:'轻步节拍',desc:'普攻速度每级 +5%',base:45,max:8,unlock:3},
    {id:'capacity',name:'共鸣扩容',desc:'接管容量每级 +1',base:110,max:4,unlock:5},
    {id:'amplify',name:'反用增幅',desc:'接管炮瓣伤害每级 +12%',base:65,max:8,unlock:8},
    {id:'recovery',name:'暖光修复',desc:'治疗效率每级 +10%',base:55,max:8,unlock:12},
    {id:'shielding',name:'叶盾调谐',desc:'接管盾叶额外减伤每级 +2%',base:70,max:6,unlock:16},
    {id:'source',name:'蓝芽聚能',desc:'蓝色来源供能每级 +8%',base:60,max:8,unlock:20},
    {id:'focus',name:'共鸣稳固',desc:'接管后的部件生命每级 +3%',base:75,max:6,unlock:24},
    {id:'intercept',name:'雾核拦截',desc:'独立核心攻击伤害每级 -4%',base:80,max:6,unlock:28},
    {id:'recycling',name:'潮晶回收',desc:'交战收益每级 +8%',base:70,max:8,unlock:32},
    {id:'damping',name:'潮铃抑制',desc:'蓝色潮铃的压制时间每级 +0.2秒',base:95,max:6,unlock:36}
  ];
  const modules=[
    {id:'lens',name:'暖光棱镜',cost:8,unlock:2,icon:'🔶',desc:'普攻 +10%，反用火力 +20%'},
    {id:'buckler',name:'绒叶护符',cost:7,unlock:4,icon:'🍃',desc:'生命 +20%'},
    {id:'wire',name:'蓝潮导线',cost:9,unlock:8,icon:'〰',desc:'蓝色来源供能 +30%'},
    {id:'metronome',name:'轻响风铃',cost:10,unlock:12,icon:'🎐',desc:'普攻速度 +12%'},
    {id:'prism',name:'宽频铃芯',cost:12,unlock:16,icon:'💠',desc:'容量 +1，生命 -10%'},
    {id:'tonic',name:'晨露瓶',cost:11,unlock:20,icon:'🫙',desc:'治疗效率 +45%'},
    {id:'clamp',name:'定潮夹',cost:14,unlock:28,icon:'🧷',desc:'核心覆写间隔延长8秒'},
    {id:'recycler',name:'拾光袋',cost:14,unlock:32,icon:'👜',desc:'交战收益 +25%，普攻 -5%'}
  ];
  const chapters=[
    ['第一次听见','铃在潮灯旁听见了陌生的回响。雾团上的炮瓣向她发射光弹，连接它的能量芽却仍按旧日的节奏闪烁。她没有急着拆掉所有东西，而是试着把铃声送进一片炮瓣。光改变了方向。她终于明白，失序的力量，也能重新找到帮助别人的路。'],
    ['一盏灯的距离','团绒雾王散开时，许多小光点落在草地上。铃把它们送回潮灯，却没有把自己的名字刻在灯座上。居民们轮流照料它，记录哪条连接需要休息。第一座岛重新亮起。她向下一片海湾望去，远处有两道潮流，一明一暗。'],
    ['两条潮流','蜜湾的渡船停在岸边。砚指着雾兽两侧的能量芽说：拆掉一边，未必能让另一边停下。铃接管了一片炮瓣，金色光线仍从敌体穿过。她要在借用这股力量和关闭危险之间作选择。海水轻轻拍岸，没有催促她立刻回答。'],
    ['回到航路','双潮鲸影的最后一片盾叶退去了红色。失去攻击的光点像浮标一样排向海面，渡船重新出发。砚收起工具，留下了供居民查看的连接图。他们并没有恢复原来的每一条线路，只保留了彼此需要的那些。下一座岛，风里带着暖陶的气味。'],
    ['坚硬的外壳','陶风岛的雾晶披上了厚甲。铃的攻击一次次被相邻甲片挡住，砚绕着它看了一圈：也许我们该先问，是什么在保护它。甲片碎开，后面的炮瓣终于露出微弱的光。战斗的进展不再只取决于力气，也取决于她是否看懂了这些联系。'],
    ['旧路的新颜色','赤陶甲魁倒下后，厚重的雾壳变成圆润的小石子。居民把它们铺成通向山谷的路，不要求石子回到旧日的位置。夕阳落在墙上，陶色比任何时候都暖。铃坐了一会儿，再次检查自己的共鸣容量，决定带什么一起走，也决定让什么休息。'],
    ['不停的修复','绒雨落在蘑菇伞上。禾发现，每当一个部件被拆掉，修复苞就把它重新叫回来。它不是坏，它只是从未学会停止。铃把修复苞的光接过来，温暖开始落在她的手上。雨中最重要的选择，是让哪一种状态继续存在。'],
    ['听见雨声','绒雨苞主终于安静下来。没有新的雾弹遮住天空，只有雨水从叶尖滑落。禾把留住的修复光送到潮灯里，却给它加上了休息的间隔。铃没有得到一个永远不会坏的世界。她得到的是一个能慢慢照料、也能停下来喘口气的地方。'],
    ['夺回又失去','晚霞里，已经变蓝的炮瓣忽然被雾潮夺回。铃没有责怪它，只观察潮铃再次响起的时间。容量有限，她无法同时保护所有光点。她和伙伴决定留下最需要的几片，拆开其余危险的连接。夕阳下，取舍第一次变得这样清楚。'],
    ['不同的光','霞光覆潮退去时，居民送来颜色各异的灯罩。没有人要求所有光都一样亮。守望者留下的连接也不同：有的保护，有的修复，有的只是安静地让能量经过。铃看着它们，发现合作不需要变成同一种声音。星夜已经在最后一座岛上等她。'],
    ['最后的明暗','星眠岛的能源在明暗之间缓缓改变。最后的雾兽收集了所有遗失的线路，也放大了所有人的担忧。铃没有寻找一条永远正确的路线。她保留多个来源，让需要的光在暗潮中仍有去处。伙伴们各自照看一部分，她终于不必独自盯着每一个瞬间。'],
    ['今夜可以休息','星眠回航者散成星点。群岛的潮灯接过了彼此的光，哪一座稍暗，另一座就轻轻补上。铃把共鸣铃放在窗边，听见最后一声很轻的响。冒险没有抹去所有变化，却留下了应对变化的办法。今夜，守望者可以休息；明天回来，灯还会亮着。']
  ];
  const achievements=[
    {id:'first',name:'第一盏灯',key:'wins',goal:1,reward:2},
    {id:'ten',name:'熟悉的航路',key:'wins',goal:10,reward:3},
    {id:'hundred',name:'守望日记',key:'wins',goal:100,reward:6},
    {id:'capture1',name:'光改变方向',key:'captures',goal:1,reward:2},
    {id:'capture50',name:'共鸣合奏',key:'captures',goal:50,reward:4},
    {id:'capture300',name:'借来的光',key:'captures',goal:300,reward:7},
    {id:'destroy100',name:'拆开旧结',key:'destroyed',goal:100,reward:4},
    {id:'destroy1000',name:'轻盈的外壳',key:'destroyed',goal:1000,reward:8},
    {id:'island1',name:'晴芽归来',key:'highest',goal:8,reward:4},
    {id:'island3',name:'山谷的颜色',key:'highest',goal:24,reward:7},
    {id:'complete',name:'今夜可以休息',key:'highest',goal:48,reward:12},
    {id:'study10',name:'暖光研究者',key:'studies',goal:10,reward:3},
    {id:'study40',name:'复杂而清楚',key:'studies',goal:40,reward:6},
    {id:'challenge1',name:'取舍的证明',key:'challenges',goal:1,reward:4},
    {id:'challenge6',name:'六种答案',key:'challenges',goal:6,reward:10},
    {id:'offline',name:'回来仍有光',key:'offlineSeconds',goal:3600,reward:4}
  ];
  const trials=[
    {id:0,name:'留下火力',layout:1,desc:'接管至少两片部件再获胜。',rule:'capture',goal:2},
    {id:1,name:'让它停机',layout:3,desc:'不接管，拆掉至少一个能源后获胜。',rule:'sever',goal:1},
    {id:2,name:'借一片叶盾',layout:2,desc:'接管盾叶或修复苞后获胜。',rule:'shelter',goal:1},
    {id:3,name:'有限的共鸣',layout:4,desc:'容量只有两格，选择值得留下的火力。',rule:'limited',goal:0},
    {id:4,name:'安静的潮铃',layout:5,desc:'拆除或接管潮铃，抵御覆写。',rule:'pulse',goal:1},
    {id:5,name:'完整的取舍',layout:7,desc:'同时完成接管与拆解，再击破雾核。',rule:'mixed',goal:1}
  ];
  const stages=Array.from({length:48},(_,id)=>({id,island:Math.floor(id/8),local:id%8,layout:id%8,name:id%8===7?islands[Math.floor(id/8)].boss:layouts[id%8].name,boss:id%8===7,reward:22+id*9,shards:3+Math.floor(id/8)}));
  return {islands,kinds,layouts,heroes,policies,research,modules,chapters,achievements,trials,stages};
});
