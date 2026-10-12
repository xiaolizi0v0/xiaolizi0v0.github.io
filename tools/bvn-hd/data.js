/**
 * 死神VS火影 HD：重制版 (Bleach vs Naruto HD Rebirth)
 * 核心游戏数据定义：角色配置、招式帧数据、判定框、援助、场景与音频配置
 */

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.BVN_DATA = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // 角色属性与招式表
  const CHARACTERS = [
    {
      id: 'ichigo',
      name: '黑崎一护',
      series: 'bleach',
      seriesName: '死神',
      title: '代理死神 / 卍解天锁斩月',
      avatarColor: '#f97316',
      accentColor: '#38bdf8',
      darkColor: '#0f172a',
      hp: 1000,
      speed: 5.8,
      dashSpeed: 14,
      jumpForce: 13.5,
      weight: 1.0,
      description: '高速突进型刀剑剑士。拥有出色的中远距离月牙天冲剑气与瞬步破空突进，卍解爆发力极强。',
      voiceQuote: '卍解！天锁斩月！',
      awakeningName: '虚化·天锁斩月',
      awakeningDesc: '假面具象化，灵压呈黑红双重爆炎，移速提升30%，攻击提升25%，普攻附加黑红月牙残焰。',
      moves: {
        attack1: {
          name: '斩月·横断',
          startup: 4, active: 4, recovery: 7,
          damage: 28, hitstun: 16, blockstun: 8,
          energyGain: 8, knockbackX: 3.5, knockbackY: 0,
          hitbox: { x: 30, y: -50, w: 65, h: 45 },
          sound: 'slash_light'
        },
        attack2: {
          name: '斩月·逆回旋',
          startup: 5, active: 4, recovery: 8,
          damage: 34, hitstun: 18, blockstun: 9,
          energyGain: 9, knockbackX: 4.5, knockbackY: -2,
          hitbox: { x: 35, y: -55, w: 75, h: 50 },
          sound: 'slash_medium'
        },
        attack3: {
          name: '斩月·挑空裂地',
          startup: 7, active: 5, recovery: 14,
          damage: 50, hitstun: 26, blockstun: 10,
          energyGain: 12, knockbackX: 5.5, knockbackY: -10,
          hitbox: { x: 40, y: -65, w: 85, h: 65 },
          sound: 'slash_heavy',
          knockup: true
        },
        jumpAttack: {
          name: '斩月·空裂斩',
          startup: 5, active: 6, recovery: 8,
          damage: 42, hitstun: 20, blockstun: 10,
          energyGain: 10, knockbackX: 4, knockbackY: 8,
          hitbox: { x: 25, y: -20, w: 70, h: 60 },
          sound: 'slash_heavy'
        },
        skill: {
          name: '月牙天冲',
          key: 'U',
          startup: 8, active: 10, recovery: 16,
          damage: 75, hitstun: 22, blockstun: 12,
          energyGain: 15, cost: 0,
          projectile: {
            speed: 13, life: 48, w: 50, h: 35,
            color: '#38bdf8', glow: '#0284c7', shape: 'crescent'
          },
          sound: 'getsuga',
          desc: '挥出高密度灵压月牙刀芒，远程贯穿压制对手。'
        },
        special: {
          name: '瞬步·回天斩',
          key: 'I',
          startup: 5, active: 8, recovery: 15,
          damage: 90, hitstun: 26, blockstun: 14,
          energyGain: 20, cost: 30,
          invincible: 6,
          dashRush: 16,
          hitbox: { x: 20, y: -60, w: 100, h: 60 },
          sound: 'dash_slash',
          desc: '极速瞬身突进，并在身后留下十字斩击，前段附带无敌帧。'
        },
        ultimate: {
          name: '卍解·月牙狂澜',
          key: 'O',
          startup: 15, active: 24, recovery: 28,
          damage: 260, hitstun: 40, blockstun: 20,
          energyCost: 100,
          isSuper: true,
          hits: 7,
          hitbox: { x: -30, y: -90, w: 260, h: 100 },
          sound: 'super_getsuga',
          desc: '黑红天锁月牙全屏极速斩击，触发超杀震撼特写与冲击定格！'
        }
      }
    },
    {
      id: 'naruto',
      name: '漩涡鸣人',
      series: 'naruto',
      seriesName: '火影忍者',
      title: '木叶七代目 / 九尾查克拉',
      avatarColor: '#f59e0b',
      accentColor: '#fbbf24',
      darkColor: '#451a03',
      hp: 1050,
      speed: 5.5,
      dashSpeed: 13.5,
      jumpForce: 13.8,
      weight: 1.05,
      description: '近战体术压制与连打型英雄。拥有多段影分身连击与威猛无比的螺旋丸，觉醒后拥有霸体九尾外衣。',
      voiceQuote: '我的忍道，就是说到做到！',
      awakeningName: '九尾妖狐之衣',
      awakeningDesc: '九尾查克拉外衣包裹全身，移速提升25%，攻击提升25%，获得初始3次霸体抗打断。',
      moves: {
        attack1: {
          name: '木叶体术·正拳',
          startup: 4, active: 4, recovery: 6,
          damage: 24, hitstun: 15, blockstun: 7,
          energyGain: 8, knockbackX: 3, knockbackY: 0,
          hitbox: { x: 25, y: -45, w: 55, h: 40 },
          sound: 'punch_light'
        },
        attack2: {
          name: '影分身·侧踢',
          startup: 5, active: 4, recovery: 7,
          damage: 30, hitstun: 17, blockstun: 8,
          energyGain: 9, knockbackX: 4, knockbackY: -1,
          hitbox: { x: 30, y: -50, w: 65, h: 45 },
          sound: 'punch_medium'
        },
        attack3: {
          name: '鸣人连弹·升龙',
          startup: 6, active: 6, recovery: 16,
          damage: 55, hitstun: 26, blockstun: 11,
          energyGain: 14, knockbackX: 4.8, knockbackY: -11,
          hitbox: { x: 35, y: -65, w: 75, h: 70 },
          sound: 'punch_heavy',
          knockup: true
        },
        jumpAttack: {
          name: '影分身·空中下砸',
          startup: 5, active: 6, recovery: 9,
          damage: 38, hitstun: 20, blockstun: 9,
          energyGain: 10, knockbackX: 3.5, knockbackY: 8,
          hitbox: { x: 20, y: -20, w: 65, h: 55 },
          sound: 'punch_heavy'
        },
        skill: {
          name: '螺旋丸',
          key: 'U',
          startup: 9, active: 16, recovery: 14,
          damage: 85, hitstun: 28, blockstun: 14,
          energyGain: 16, cost: 0,
          hits: 5,
          dashRush: 12,
          hitbox: { x: 35, y: -50, w: 75, h: 55 },
          sound: 'rasengan',
          desc: '手握高旋转查克拉螺旋丸突进，对敌人造成5段高频研磨击飞！'
        },
        special: {
          name: '多重影分身·手里剑阵',
          key: 'I',
          startup: 6, active: 8, recovery: 15,
          damage: 80, hitstun: 22, blockstun: 12,
          energyGain: 18, cost: 30,
          projectile: {
            speed: 14, life: 45, w: 35, h: 35, count: 3,
            color: '#38bdf8', glow: '#93c5fd', shape: 'shuriken'
          },
          sound: 'shuriken_storm',
          desc: '分身跃出投掷三枚破空巨型四方手里剑，封锁敌方空中与地面。'
        },
        ultimate: {
          name: '风遁·螺旋手里剑',
          key: 'O',
          startup: 16, active: 26, recovery: 30,
          damage: 270, hitstun: 42, blockstun: 22,
          energyCost: 100,
          isSuper: true,
          hits: 9,
          hitbox: { x: 10, y: -80, w: 240, h: 110 },
          sound: 'super_rasenshuriken',
          desc: '掷出撕裂大气的超高密度风遁风暴，微观查克拉风刃席卷全场！'
        }
      }
    },
    {
      id: 'sasuke',
      name: '宇智波佐助',
      series: 'naruto',
      seriesName: '火影忍者',
      title: '宇智波末裔 / 永恒万花筒',
      avatarColor: '#818cf8',
      accentColor: '#c084fc',
      darkColor: '#1e1b4b',
      hp: 980,
      speed: 6.0,
      dashSpeed: 15,
      jumpForce: 13.6,
      weight: 0.98,
      description: '极速突进与雷火双遁控场型刺客。草薙剑配合极速千鸟闪电突刺，奥义麒麟引动九天落雷。',
      voiceQuote: '这就是…宇智波的力量。',
      awakeningName: '咒印二阶·万花筒',
      awakeningDesc: '唤醒暗紫雷遁查克拉与咒印之翼，千鸟变为黑千鸟，移速提升30%，攻击提升25%。',
      moves: {
        attack1: {
          name: '草薙剑·瞬刺',
          startup: 3, active: 4, recovery: 6,
          damage: 26, hitstun: 15, blockstun: 7,
          energyGain: 8, knockbackX: 3.2, knockbackY: 0,
          hitbox: { x: 28, y: -48, w: 60, h: 40 },
          sound: 'slash_light'
        },
        attack2: {
          name: '写轮眼·回旋踢',
          startup: 4, active: 4, recovery: 7,
          damage: 32, hitstun: 17, blockstun: 8,
          energyGain: 9, knockbackX: 4.2, knockbackY: -1,
          hitbox: { x: 32, y: -52, w: 70, h: 45 },
          sound: 'punch_medium'
        },
        attack3: {
          name: '雷光拔刀斩',
          startup: 6, active: 5, recovery: 15,
          damage: 52, hitstun: 25, blockstun: 10,
          energyGain: 13, knockbackX: 5.5, knockbackY: -9,
          hitbox: { x: 38, y: -60, w: 80, h: 60 },
          sound: 'slash_heavy',
          knockup: true
        },
        jumpAttack: {
          name: '凤仙火·俯冲落刃',
          startup: 5, active: 6, recovery: 8,
          damage: 40, hitstun: 20, blockstun: 10,
          energyGain: 10, knockbackX: 4, knockbackY: 8,
          hitbox: { x: 25, y: -20, w: 65, h: 55 },
          sound: 'fire_slash'
        },
        skill: {
          name: '火遁·豪火球之术',
          key: 'U',
          startup: 8, active: 14, recovery: 16,
          damage: 78, hitstun: 24, blockstun: 12,
          energyGain: 15, cost: 0,
          projectile: {
            speed: 10, life: 55, w: 65, h: 65,
            color: '#f97316', glow: '#ef4444', shape: 'fireball'
          },
          sound: 'fireball',
          desc: '后撤步喷吐巨大的烈焰火球，压迫并持续灼烧对手。'
        },
        special: {
          name: '千鸟',
          key: 'I',
          startup: 5, active: 7, recovery: 14,
          damage: 92, hitstun: 28, blockstun: 15,
          energyGain: 20, cost: 30,
          invincible: 5,
          dashRush: 18,
          hitbox: { x: 30, y: -55, w: 90, h: 55 },
          sound: 'chidori',
          desc: '万鸟齐鸣般的电闪雷切，极速直线贯穿破防！'
        },
        ultimate: {
          name: '雷遁·奥义·麒麟',
          key: 'O',
          startup: 16, active: 26, recovery: 28,
          damage: 275, hitstun: 44, blockstun: 22,
          energyCost: 100,
          isSuper: true,
          hits: 8,
          hitbox: { x: -40, y: -120, w: 280, h: 140 },
          sound: 'super_kirin',
          desc: '引导天际积雨云，巨型雷兽麒麟伴随轰雷天崩地裂！'
        }
      }
    },
    {
      id: 'hitsugaya',
      name: '日番谷冬狮郎',
      series: 'bleach',
      seriesName: '死神',
      title: '十番队队长 / 大红莲冰轮丸',
      avatarColor: '#38bdf8',
      accentColor: '#a5f3fc',
      darkColor: '#082f49',
      hp: 960,
      speed: 5.7,
      dashSpeed: 14.2,
      jumpForce: 13.4,
      weight: 0.95,
      description: '冰系中程控场与高频冰封剑士。冰柱与龙霰架封锁走位，终极千年冰牢全屏绝冻。',
      voiceQuote: '霜天已经降临，端坐于霜天吧，冰轮丸！',
      awakeningName: '成熟期·大红莲冰轮丸',
      awakeningDesc: '寒冰羽翼完全展开，周身散发极寒灵子冻气，使近身敌人动作迟缓，攻击提升20%。',
      moves: {
        attack1: {
          name: '冰轮丸·霜斩',
          startup: 4, active: 4, recovery: 6,
          damage: 25, hitstun: 15, blockstun: 7,
          energyGain: 8, knockbackX: 3.2, knockbackY: 0,
          hitbox: { x: 26, y: -46, w: 60, h: 40 },
          sound: 'ice_slash'
        },
        attack2: {
          name: '冰轮丸·回旋霜华',
          startup: 4, active: 4, recovery: 7,
          damage: 30, hitstun: 17, blockstun: 8,
          energyGain: 9, knockbackX: 4.0, knockbackY: -1,
          hitbox: { x: 30, y: -50, w: 70, h: 45 },
          sound: 'ice_slash'
        },
        attack3: {
          name: '冰龙·升天破',
          startup: 6, active: 5, recovery: 15,
          damage: 50, hitstun: 26, blockstun: 10,
          energyGain: 13, knockbackX: 5.0, knockbackY: -10,
          hitbox: { x: 35, y: -62, w: 80, h: 65 },
          sound: 'ice_heavy',
          knockup: true
        },
        jumpAttack: {
          name: '霜鸟·空踏落冰',
          startup: 5, active: 6, recovery: 8,
          damage: 39, hitstun: 20, blockstun: 10,
          energyGain: 10, knockbackX: 3.8, knockbackY: 8,
          hitbox: { x: 24, y: -20, w: 65, h: 55 },
          sound: 'ice_heavy'
        },
        skill: {
          name: '群鸟冰柱',
          key: 'U',
          startup: 8, active: 16, recovery: 15,
          damage: 72, hitstun: 25, blockstun: 13,
          energyGain: 16, cost: 0,
          projectile: {
            speed: 11, life: 50, w: 45, h: 50,
            color: '#a5f3fc', glow: '#38bdf8', shape: 'ice_shard'
          },
          sound: 'ice_shards',
          desc: '挥出冰鸟群掠过地面，升起尖锐冰柱封锁战场。'
        },
        special: {
          name: '龙霰架',
          key: 'I',
          startup: 5, active: 8, recovery: 16,
          damage: 88, hitstun: 28, blockstun: 15,
          energyGain: 20, cost: 30,
          invincible: 5,
          dashRush: 15,
          hitbox: { x: 30, y: -55, w: 90, h: 55 },
          sound: 'ryusenka',
          desc: '破空拔刀刺穿敌人，随之在目标身后爆发极寒十字冰块封冻！'
        },
        ultimate: {
          name: '卍解·千年冰牢',
          key: 'O',
          startup: 16, active: 25, recovery: 28,
          damage: 265, hitstun: 42, blockstun: 22,
          energyCost: 100,
          isSuper: true,
          hits: 8,
          hitbox: { x: -35, y: -100, w: 270, h: 120 },
          sound: 'super_ice_prison',
          desc: '数百根通天寒冰巨柱将敌人彻底封印入万年玄冰，随后粉碎结晶！'
        }
      }
    }
  ];

  // 经典援助角色配置 (Assists)
  const ASSISTS = [
    {
      id: 'rukia',
      name: '朽木露琪亚',
      series: 'bleach',
      avatarColor: '#93c5fd',
      skillName: '次舞·白涟',
      cooldown: 18,
      sound: 'ice_breath',
      description: '召唤露琪亚喷射全屏极寒风雪白涟，冻结命中目标 1.8 秒，创造绝佳连招空隙。',
      effect: {
        type: 'freeze',
        damage: 45,
        duration: 1.8,
        rangeX: 240,
        rangeY: 80
      }
    },
    {
      id: 'itachi',
      name: '宇智波鼬',
      series: 'naruto',
      avatarColor: '#f43f5e',
      skillName: '乌鸦分身·天照',
      cooldown: 20,
      sound: 'amaterasu',
      description: '乌鸦群飞散遮挡视线，并在对手脚下点燃不灭黑炎，造成 3 秒持续高额百分比灼烧。',
      effect: {
        type: 'burn',
        damage: 80,
        duration: 3.0,
        ticks: 6,
        rangeX: 200,
        rangeY: 70
      }
    },
    {
      id: 'orihime',
      name: '井上织姬',
      series: 'bleach',
      avatarColor: '#fbbf24',
      skillName: '三天结盾·双天归盾',
      cooldown: 22,
      sound: 'shield_heal',
      description: '瞬现金色菱形灵子结界，瞬间为己方恢复 25% 生命值，并生成一层霸体护盾。',
      effect: {
        type: 'heal_shield',
        healAmount: 250,
        shieldHp: 120,
        duration: 5.0
      }
    },
    {
      id: 'shino',
      name: '油女志乃',
      series: 'naruto',
      avatarColor: '#34d399',
      skillName: '秘术·寄坏虫之术',
      cooldown: 19,
      sound: 'insects_buzz',
      description: '密集寄坏虫呼啸围困目标，封印敌人技能 3.5 秒并吸取 40 点查克拉灵压转移给玩家。',
      effect: {
        type: 'drain_silence',
        damage: 50,
        drainEnergy: 40,
        silenceDuration: 3.5,
        rangeX: 220,
        rangeY: 80
      }
    }
  ];

  // 经典对战舞台场景 (Stages)
  const STAGES = [
    {
      id: 'valley_of_end',
      name: '木叶·终末之谷',
      subtitle: 'Valley of the End',
      theme: 'naruto',
      bgGradient: ['#1e1b4b', '#312e81', '#4338ca', '#f97316', '#fbbf24'],
      skyColor: '#0f172a',
      waterColor: '#0284c7',
      cliffColor: '#334155',
      particleType: 'water_spray',
      description: '斑与柱间巨像相对而立，巨大瀑布飞流直下，宿命对决之地。'
    },
    {
      id: 'soukyoku_hill',
      name: '尸魂界·双殛之丘',
      subtitle: 'Soukyoku Hill',
      theme: 'bleach',
      bgGradient: ['#0f172a', '#1e293b', '#334155', '#475569', '#cbd5e1'],
      skyColor: '#0f172a',
      waterColor: '#38bdf8',
      cliffColor: '#1e293b',
      particleType: 'sakura_petals',
      description: '瀞灵廷最高处双殛行刑架，云海翻腾，灵子光尘升腾，樱花飞舞。'
    },
    {
      id: 'training_ground',
      name: '木叶·演习场',
      subtitle: 'Hidden Leaf Training Ground 44',
      theme: 'naruto',
      bgGradient: ['#064e3b', '#047857', '#059669', '#10b981', '#6ee7b7'],
      skyColor: '#022c22',
      waterColor: '#0ea5e9',
      cliffColor: '#134e4a',
      particleType: 'green_leaves',
      description: '第七班试炼之地，三根木桩见证羁绊成长，晨曦阳光透过林梢。'
    },
    {
      id: 'las_noches',
      name: '虚圈·虚夜宫穹顶',
      subtitle: 'Las Noches Canopy',
      theme: 'bleach',
      bgGradient: ['#030712', '#111827', '#1f2937', '#374151', '#4b5563'],
      skyColor: '#030712',
      waterColor: '#6b7280',
      cliffColor: '#1f2937',
      particleType: 'reishi_sparks',
      description: '惨白新月高悬，破败的石柱长廊，虚夜宫无限苍凉的灵压天顶。'
    }
  ];

  // AI 行为模式配置
  const AI_CONFIGS = {
    easy: {
      name: '新手模式',
      reactionDelay: 16,
      attackAggression: 0.35,
      blockChance: 0.25,
      substituteChance: 0.20,
      comboProficiency: 0.30,
      superUsageThreshold: 100,
      superChance: 0.40
    },
    normal: {
      name: '挑战模式',
      reactionDelay: 10,
      attackAggression: 0.60,
      blockChance: 0.55,
      substituteChance: 0.50,
      comboProficiency: 0.65,
      superUsageThreshold: 100,
      superChance: 0.70
    },
    hard: {
      name: '极限格斗',
      reactionDelay: 4,
      attackAggression: 0.85,
      blockChance: 0.80,
      substituteChance: 0.85,
      comboProficiency: 0.90,
      superUsageThreshold: 100,
      superChance: 0.95
    }
  };

  // 游戏模式配置
  const GAME_MODES = {
    arcade: {
      id: 'arcade',
      name: '街机模式',
      rounds: 4,
      desc: '挑战 4 轮死神与火影经典强敌，层层拔高难度，角逐 S 级格斗神评！'
    },
    versus: {
      id: 'versus',
      name: '自由对战',
      rounds: 1,
      desc: '自由选择 1v1 玩家角色、AI 对手、援助伙伴、地图场景与 AI 难度。'
    },
    training: {
      id: 'training',
      name: '修行道场',
      rounds: 1,
      desc: '无限生命与查克拉练习模式，可开启判定框显示、帧数分析与木桩行为设定。'
    }
  };

  return {
    CHARACTERS,
    ASSISTS,
    STAGES,
    AI_CONFIGS,
    GAME_MODES
  };
});
