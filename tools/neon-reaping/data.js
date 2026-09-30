/* Original game data. No network requests or external assets. */
window.RIFT_DATA = {
  version: 1,
  heroes: [
    { id: 'blade', name: '零刃', mark: '刃', color: '#c1ff35', cost: 0, style: '近战 / 三段连斩', hp: 140, damage: 27, speed: 280, interval: .37, skillCd: 8, note: '三段连斩击退敌人；回旋刃贯穿人群；超载发动全屏斩。' },
    { id: 'spark', name: '火花', mark: '焰', color: '#ff459a', cost: 350, style: '远程 / 穿透双枪', hp: 112, damage: 20, speed: 310, interval: .28, skillCd: 9, note: '双枪穿透射击；技能释放扇形弹幕；超载召唤轨道轰击。' },
    { id: 'frost', name: '霜棘', mark: '霜', color: '#47e6f2', cost: 550, style: '法术 / 冰霜控制', hp: 125, damage: 32, speed: 260, interval: .55, skillCd: 10, note: '冰球命中后爆炸；冻结脉冲控场；超载覆盖冰晶风暴。' }
  ],
  chapters: [
    {name:'废线街区', sub:'DEADLINE DISTRICT', color:'#c1ff35', boss:'暴走 · 裂颚', bossType:'charger', quota:18, scale:1, tip:'霓虹残骸里，冲锋者正在集结。躲开红色预警，击破裂颚。'},
    {name:'电弧工厂', sub:'ARC FOUNDRY', color:'#b353ff', boss:'禁卫 · 电弧核心', bossType:'gunner', quota:23, scale:1.32, tip:'弹幕与重甲覆盖生产线。利用二段跳越过弹道，用闪避穿过围攻。'},
    {name:'裂隙天台', sub:'RIFT ROOFTOPS', color:'#47e6f2', boss:'终局 · 裂隙女王', bossType:'summoner', quota:27, scale:1.65, tip:'高空感染进入终局。优先击破召唤物，觉醒武器，迎战双阶段女王。'},
    {name:'无尽暴走', sub:'ENDLESS RIOT', color:'#ff459a', boss:'循环首领', bossType:'charger', quota:24, scale:1.25, tip:'每六波轮换街区与首领，敌人持续强化。挑战你的最高波次。'}
  ],
  difficulties:[{name:'普通', scale:1, reward:1},{name:'困难',scale:1.4,reward:1.6},{name:'极限',scale:1.85,reward:2.3}],
  upgrades:[
    {id:'bladeOrbit',name:'环刃',glyph:'◌',max:4,desc:'刀刃围绕角色旋转，持续切割近身敌人。',weapon:true,pair:'range',evo:'裂空轮舞',evoDesc:'双环刀刃，范围扩大并造成双倍伤害。'},
    {id:'lightning',name:'落雷',glyph:'ϟ',max:4,desc:'定时雷击附近敌人，高等级增加雷击数量。',weapon:true,pair:'crit',evo:'天罚连锁',evoDesc:'雷击连续传导，命中最多 8 个敌人。'},
    {id:'fire',name:'烈焰场',glyph:'♨',max:4,desc:'脚下持续生成火圈，灼烧靠近的敌人。',weapon:true,pair:'damage',evo:'炼狱领域',evoDesc:'火焰范围翻倍，持续削减敌人生命。'},
    {id:'drone',name:'无人机',glyph:'⌁',max:4,desc:'悬浮无人机自动锁敌射击。',weapon:true,pair:'speed',evo:'蜂群指令',evoDesc:'无人机连射三枚追踪弹。'},
    {id:'ice',name:'冰刺',glyph:'❄',max:4,desc:'定时向两侧发射穿透冰刺并减速敌人。',weapon:true,pair:'haste',evo:'永冻棱镜',evoDesc:'冰刺冻结目标，并额外向斜上方发射。'},
    {id:'pulse',name:'震荡波',glyph:'◎',max:4,desc:'周期释放冲击波，将近身敌人击退。',weapon:true,pair:'hp',evo:'引力坍缩',evoDesc:'扩大范围并引爆多次震荡。'},
    {id:'damage',name:'锋利增幅',glyph:'╱',max:5,desc:'所有伤害 +15%。'},
    {id:'haste',name:'神经加速',glyph:'»',max:5,desc:'普攻与自动武器冷却缩短 8%。'},
    {id:'crit',name:'弱点洞察',glyph:'◇',max:5,desc:'暴击率 +8%，暴击造成双倍伤害。'},
    {id:'hp',name:'合金骨架',glyph:'✚',max:5,desc:'生命上限 +25，并立即恢复 25 生命。'},
    {id:'speed',name:'疾走协议',glyph:'↗',max:4,desc:'移动速度 +10%，闪避冷却缩短。'},
    {id:'range',name:'空间延展',glyph:'↔',max:4,desc:'近战、范围武器与拾取范围 +15%。'},
    {id:'magnet',name:'磁力收集',glyph:'⊕',max:4,desc:'掉落物吸引距离 +90。'},
    {id:'xp',name:'经验芯片',glyph:'▣',max:4,desc:'经验获取量 +18%。'},
    {id:'armor',name:'装甲镀层',glyph:'⬡',max:5,desc:'受到的伤害减少 10%，上限 50%。'},
    {id:'leech',name:'生命虹吸',glyph:'♥',max:3,desc:'每 8 次击杀恢复 3 生命。'},
    {id:'regen',name:'自愈纳米',glyph:'✣',max:4,desc:'每秒自动恢复 0.6 生命。'},
    {id:'shield',name:'相位护盾',glyph:'◈',max:3,desc:'每 12 秒获得抵挡一次伤害的护盾。'},
    {id:'multi',name:'分裂弹道',glyph:'⋔',max:3,desc:'远程普攻额外发射一枚弹道；零刃额外连斩。'},
    {id:'skill',name:'技能循环',glyph:'↻',max:4,desc:'专属技能冷却缩短 13%。'},
    {id:'charge',name:'能量转换',glyph:'✦',max:4,desc:'击杀获得的超载能量 +25%。'},
    {id:'knock',name:'破阵冲击',glyph:'➤',max:3,desc:'击退力度 +25%，对精英与首领伤害 +10%。'},
    {id:'gold',name:'战利品协议',glyph:'◊',max:4,desc:'击杀获得补给币 +25%，结算货币 +10%。'},
    {id:'dash',name:'闪击残像',glyph:'≋',max:3,desc:'闪避穿过敌人造成伤害，闪避无敌时间延长。'}
  ],
  meta:[
    {id:'power',name:'武器校准',glyph:'╱',desc:'每级基础伤害 +5%',max:8,cost:70},
    {id:'vital',name:'身体改造',glyph:'✚',desc:'每级生命上限 +12',max:8,cost:60},
    {id:'learn',name:'数据记忆',glyph:'▣',desc:'每级经验获取 +5%',max:6,cost:80},
    {id:'supply',name:'补给许可',glyph:'◇',desc:'每级开局补给币 +15',max:6,cost:60},
    {id:'fortune',name:'幸运回路',glyph:'✦',desc:'每级基础暴击率 +2%',max:6,cost:90}
  ],
  achievements:[
    {id:'first',name:'第一道裂痕',desc:'累计击杀 100 个敌人',stat:'kills',target:100,reward:80},
    {id:'hunter',name:'街区清道夫',desc:'累计击杀 1000 个敌人',stat:'kills',target:1000,reward:200},
    {id:'combo',name:'不许停下',desc:'达到 50 连击',stat:'combo',target:50,reward:120},
    {id:'clear',name:'突破封锁',desc:'首次完成章节',stat:'wins',target:1,reward:150},
    {id:'queen',name:'裂隙终结者',desc:'完成第三章',stat:'chapter',target:3,reward:350},
    {id:'evolve',name:'进化失控',desc:'累计觉醒 3 次武器',stat:'evolutions',target:3,reward:180},
    {id:'endless',name:'暴走不息',desc:'无尽模式达到第 12 波',stat:'endless',target:12,reward:220},
    {id:'veteran',name:'再次出发',desc:'完成 10 次行动结算',stat:'runs',target:10,reward:160}
  ]
};
