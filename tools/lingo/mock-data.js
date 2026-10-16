// Lingo 雅思轻学 - 高保真内置数据源与知识库
window.LINGO_MOCK = {
  // 预设用户资料与目标
  user: {
    nickname: "Yup",
    avatar: "lingo/assets/shot-home.png",
    targetBand: 6.5,
    currentLevel: "大学英语四级",
    interestedDomains: ["ai", "tech", "business", "psychology"],
    dailyMinutes: 15,
    dailyWordTarget: 20,
    defaultReadingDifficulty: "standard",
    streakDays: 3,
    todayProgress: {
      learnedWords: 7,
      learnedMinutes: 10,
      watchCompleted: 2,
      watchTotal: 6,
      readCompleted: 1,
      readTotal: 5,
      guessCompleted: 4,
      guessTotal: 20
    }
  },

  // 20 大雅思高频刊物元数据
  publications: [
    { id: "economist", name: "The Economist", zh: "经济学人", icon: "fas fa-chart-line", domain: "business", desc: "全球政经深度透视，雅思学术类阅读最核心真题题源" },
    { id: "bbc", name: "BBC News", zh: "英国广播公司", icon: "fas fa-broadcast-tower", domain: "society", desc: "纯正英音英式表达，社会与文化话题高频考点" },
    { id: "nature", name: "Nature", zh: "自然杂志", icon: "fas fa-dna", domain: "nature", desc: "顶尖自然科学论文与综述，雅思 Passage 3 科学类首选" },
    { id: "natgeo", name: "National Geographic", zh: "国家地理", icon: "fas fa-globe-americas", domain: "travel", desc: "生物多样性、地理变迁与人文探索，常考动物生态" },
    { id: "guardian", name: "The Guardian", zh: "卫报", icon: "fas fa-newspaper", domain: "society", desc: "英伦深度专栏与社论，丰富多样的议论文替换词库" },
    { id: "sciam", name: "Scientific American", zh: "科学美国人", icon: "fas fa-atom", domain: "nature", desc: "前沿科学通俗解读，雅思科普说明文范本" },
    { id: "ft", name: "Financial Times", zh: "金融时报", icon: "fas fa-pound-sign", domain: "business", desc: "跨国商业、宏观金融与管理战略深度报道" },
    { id: "atlantic", name: "The Atlantic", zh: "大西洋月刊", icon: "fas fa-feather-alt", domain: "society", desc: "思想文化长文，雅思学术论证与思辨句型宝库" },
    { id: "newyorker", name: "The New Yorker", zh: "纽约客", icon: "fas fa-book-open", domain: "psychology", desc: "都市人文、心理观察与叙事性非虚构写作" },
    { id: "time", name: "TIME", zh: "时代周刊", icon: "fas fa-clock", domain: "society", desc: "全球风云与时代议题，精炼论述与高频政论词汇" },
    { id: "newscientist", name: "New Scientist", zh: "新科学家", icon: "fas fa-flask", domain: "tech", desc: "科技前沿与未来趋势，考频极高的环境与AI题材" },
    { id: "wsj", name: "The Wall Street Journal", zh: "华尔街日报", icon: "fas fa-building", domain: "business", desc: "企业管理、市场动向与全球贸易权威刊物" },
    { id: "smithsonian", name: "Smithsonian Magazine", zh: "史密森尼杂志", icon: "fas fa-landmark", domain: "society", desc: "历史考古、博物学与人类文明演进" },
    { id: "nytimes", name: "The New York Times", zh: "纽约时报", icon: "fas fa-pen-fancy", domain: "society", desc: "国际时事与特写报道，社论词汇极其丰富" },
    { id: "psychtoday", name: "Psychology Today", zh: "今日心理学", icon: "fas fa-brain", domain: "psychology", desc: "行为心理、认知科学与情绪机制，常考心理真题" },
    { id: "hbr", name: "Harvard Business Review", zh: "哈佛商业评论", icon: "fas fa-graduation-cap", domain: "business", desc: "组织行为学、决策逻辑与职场沟通精选" },
    { id: "mittech", name: "MIT Tech Review", zh: "麻省理工科技评论", icon: "fas fa-robot", domain: "ai", desc: "人工智能、半导体与前沿工程应用权威分析" },
    { id: "wired", name: "WIRED", zh: "连线", icon: "fas fa-microchip", domain: "tech", desc: "数字浪潮、赛博文化与技术伦理深度反思" },
    { id: "spectator", name: "The Spectator", zh: "旁观者", icon: "fas fa-glasses", domain: "society", desc: "英国老牌周刊，犀利的思辨立场与高级修辞" },
    { id: "discovery", name: "Discovery", zh: "探索发现", icon: "fas fa-compass", domain: "nature", desc: "地球未解之谜与野外生存，生动的说明文语境" }
  ],

  // 刷一刷：6 个短视频数据源（抽象短剧、生活 vlog、科普趣味）
  videos: [
    {
      id: "v_01",
      genre: "vlog",
      genreTag: "Vlog",
      genreColor: "#22c55e",
      title: "咖啡依赖者的自白与晨间仪式",
      poster: "lingo/assets/vlog-clean.png",
      videoUrl: "", // 纯CSS/Canvas动效+多媒体拟真
      author: "@Yup_LifeDiary",
      currentStepText: "2 / 6",
      subtitleEn: "My daily routine? Coffee first. Drank a double espresso, but why am I still in fatigue?",
      subtitleZh: "我的日常习惯？先喝咖啡。喝了双倍浓缩，怎么还是满脸困意？",
      humorousLine: "喝了咖啡，怎么还是困？",
      bgGradient: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
      words: [
        {
          id: "vw_01_1",
          word: "routine",
          phonetic: "/ruːˈtiːn/",
          pos: "n. / adj.",
          band: "6.0",
          stars: 5,
          meaningZh: "日常习惯，常规；例行的",
          collocation: "daily routine (日常习惯), disrupt the routine (打破常规)",
          quote: "剑桥雅思 13 Test 1: Establishing a predictable bedtime routine promotes cognitive restoration.",
          endingSummary: "主角结语：雅思口语 Part 1 问到作息时，别只说 'habit' 啦，用 'daily routine' 考官眼睛立马亮起来！"
        },
        {
          id: "vw_01_2",
          word: "fatigue",
          phonetic: "/fəˈtiːɡ/",
          pos: "n. / v.",
          band: "7.0",
          stars: 5,
          meaningZh: "极度疲乏，心力交瘁；使疲劳",
          collocation: "chronic fatigue (慢性疲劳), combat fatigue (克服疲乏)",
          quote: "剑桥雅思 15 Test 2: Symptoms often encompass cognitive fatigue and sensory overload.",
          endingSummary: "主角结语：大作文里想写累成狗？丢掉 'very tired'，换上 'suffer from mental fatigue' 直接冲上 7 分档！"
        },
        {
          id: "vw_01_3",
          word: "stimulant",
          phonetic: "/ˈstɪmjələnt/",
          pos: "n. / adj.",
          band: "7.5",
          stars: 4,
          meaningZh: "刺激物，兴奋剂；有兴奋作用的",
          collocation: "mild stimulant (温和刺激物), sensory stimulant (感官刺激)",
          quote: "剑桥雅思 16 Test 4: Caffeine serves as a mild stimulant that temporarily suppresses drowsiness.",
          endingSummary: "主角结语：医疗与健康类大作文常见词，咖啡因在学术上统称为 'a central nervous system stimulant'。"
        }
      ],
      quickQuiz: {
        question: "在学术写作中，表达'工作后身心极度疲惫'，最得体的雅思高分替换词是？",
        options: [
          "A. fatigue",
          "B. sleepiness",
          "C. weakness",
          "D. boredom"
        ],
        answer: 0,
        tip: "fatigue 常搭配 mental/physical，是雅思阅读和写作极高频的 7 分表达！"
      }
    },
    {
      id: "v_02",
      genre: "skit",
      genreTag: "抽象短剧",
      genreColor: "#ec4899",
      title: "拖延症终结者：明天的自己不是神仙",
      poster: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      videoUrl: "",
      author: "@荒诞脑洞研究所",
      currentStepText: "3 / 6",
      subtitleEn: "I tend to procrastinate, trapped in an inevitable dilemma until midnight strikes.",
      subtitleZh: "我习惯性拖延，陷在不可避免的两难困境里，直到午夜钟声敲响。",
      humorousLine: "拖到最后 10 分钟，人类的潜能堪比造火箭。",
      bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)",
      words: [
        {
          id: "vw_02_1",
          word: "procrastinate",
          phonetic: "/prəˈkræstɪneɪt/",
          pos: "v.",
          band: "7.0",
          stars: 5,
          meaningZh: "拖延，耽搁",
          collocation: "chronic procrastinator (重度拖延症患者), procrastinate on tasks",
          quote: "剑桥雅思 14 Test 3: Students often procrastinate when confronted with ambiguously formulated assignments.",
          endingSummary: "主角结语：词根 pro(向前) + cras(明天)，把事全扔给明天的自己，这就是 procrastinate 的终极奥义！"
        },
        {
          id: "vw_02_2",
          word: "inevitable",
          phonetic: "/ɪnˈevɪtəbl/",
          pos: "adj.",
          band: "6.5",
          stars: 5,
          meaningZh: "不可避免的，必然发生的",
          collocation: "an inevitable consequence (必然的结果), inevitable trend (必然趋势)",
          quote: "剑桥雅思 12 Test 2: Climate mitigation requires coping with inevitable meteorological disruptions.",
          endingSummary: "主角结语：写作中论证'某现象不可逆转'时，用 'It is inevitable that...' 是最经典的得分句型。"
        },
        {
          id: "vw_02_3",
          word: "dilemma",
          phonetic: "/daɪˈlemə/",
          pos: "n.",
          band: "7.0",
          stars: 4,
          meaningZh: "进退两难的困境",
          collocation: "face a moral dilemma (面临道德两难), escape the dilemma (摆脱困境)",
          quote: "剑桥雅思 11 Test 4: Policymakers found themselves in an acute dilemma between economic growth and environmental stewardship.",
          endingSummary: "主角结语：两个选择都头疼的时候才叫 dilemma，比单一的 'problem' 含义精准深刻太多！"
        }
      ],
      quickQuiz: {
        question: "短剧中形容'面对两个艰难抉择无法取舍的窘境'用哪个词？",
        options: [
          "A. hazard",
          "B. dilemma",
          "C. obstacle",
          "D. paradox"
        ],
        answer: 1,
        tip: "dilemma 指两难困境，通常包含两个针锋相对且难以兼顾的抉择！"
      }
    },
    {
      id: "v_03",
      genre: "science",
      genreTag: "科普视频",
      genreColor: "#3b82f6",
      title: "大脑为何擅长用隐喻做梦？",
      poster: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
      videoUrl: "",
      author: "@神经漫步Science",
      currentStepText: "4 / 6",
      subtitleEn: "During REM sleep, cognitive consolidation weaves obscure metaphors from daily stimuli.",
      subtitleZh: "在快速眼动睡眠期，认知巩固机制将白天的外界刺激编织成晦涩的隐喻。",
      humorousLine: "梦见自己考试没带笔？其实是大脑在做压力演练。",
      bgGradient: "linear-gradient(135deg, #042f2e 0%, #115e59 50%, #022c22 100%)",
      words: [
        {
          id: "vw_03_1",
          word: "cognitive",
          phonetic: "/ˈkɒɡnətɪv/",
          pos: "adj.",
          band: "7.0",
          stars: 5,
          meaningZh: "认知的，感知的",
          collocation: "cognitive load (认知负荷), cognitive ability (认知能力)",
          quote: "剑桥雅思 10 Test 3: Excessive digital notifications exacerbate cognitive distraction in adolescent learners.",
          endingSummary: "主角结语：教育、心理、儿童成长类阅读几乎每套必有 'cognitive'，一定要滚瓜烂熟！"
        },
        {
          id: "vw_03_2",
          word: "metaphor",
          phonetic: "/ˈmetəfər/",
          pos: "n.",
          band: "7.5",
          stars: 4,
          meaningZh: "隐喻，暗喻；象征",
          collocation: "visual metaphor (视觉隐喻), a metaphor for modern alienation (现代异化的象征)",
          quote: "剑桥雅思 15 Test 4: The author employs the clockwork mechanism as a metaphor for urban regimentation.",
          endingSummary: "主角结语：雅思文学与艺术类阅读的杀手词，注意与明喻 (simile) 区分开来哦！"
        },
        {
          id: "vw_03_3",
          word: "consolidation",
          phonetic: "/kənˌsɒlɪˈdeɪʃn/",
          pos: "n.",
          band: "8.0",
          stars: 4,
          meaningZh: "巩固，强化；合并",
          collocation: "memory consolidation (记忆巩固), fiscal consolidation (财政整顿)",
          quote: "剑桥雅思 17 Test 2: Slow-wave sleep is indispensable for the consolidation of declarative knowledge.",
          endingSummary: "主角结语：动词是 consolidate，在科技类阅读常用来指把零散信息'夯实巩固'在大脑神经回路里。"
        }
      ],
      quickQuiz: {
        question: "'Memory consolidation' 在雅思生物/心理学科普文中最准确的翻译是？",
        options: [
          "A. 记忆减退",
          "B. 记忆巩固",
          "C. 记忆模糊",
          "D. 记忆提取"
        ],
        answer: 1,
        tip: "consolidation 意为巩固、夯实，在神经科学指短期记忆转化为长期记忆的生物学过程。"
      }
    },
    {
      id: "v_04",
      genre: "vlog",
      genreTag: "Vlog",
      genreColor: "#22c55e",
      title: "雨天 Citywalk：在喧嚣中寻找独处",
      poster: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
      videoUrl: "",
      author: "@城市漫步者_Lin",
      currentStepText: "5 / 6",
      subtitleEn: "Embracing solitude in this bustling metropolis brings unexpected serendipity.",
      subtitleZh: "在这座繁华喧嚣的都市中拥抱独处，往往会带来意想不到的惊喜与机缘。",
      humorousLine: "下雨天不撑伞，叫漫步；雨下太大了，叫狼狈落汤鸡。",
      bgGradient: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)",
      words: [
        {
          id: "vw_04_1",
          word: "solitude",
          phonetic: "/ˈsɒlətjuːd/",
          pos: "n.",
          band: "7.0",
          stars: 4,
          meaningZh: "独处，清静（积极享受的孤独）",
          collocation: "cherish solitude (享受独处), live in solitude",
          quote: "剑桥雅思 16 Test 1: Creative thinkers consistently designate structured solitude as their wellspring of originality.",
          endingSummary: "主角结语：loneliness 是难过寂寞，而 solitude 是高质量的高雅独处，口语用出来逼格拉满！"
        },
        {
          id: "vw_04_2",
          word: "bustling",
          phonetic: "/ˈbʌslɪŋ/",
          pos: "adj.",
          band: "6.5",
          stars: 5,
          meaningZh: "繁华喧闹的，生机勃勃的",
          collocation: "a bustling commercial hub (繁华商业中心), bustling streets",
          quote: "剑桥雅思 12 Test 3: The market evolved from a tranquil bazaar into a bustling regional terminal.",
          endingSummary: "主角结语：口语 Part 2 描述你家乡或旅行地时，万能画面感形容词！"
        },
        {
          id: "vw_04_3",
          word: "serendipity",
          phonetic: "/ˌserənˈdɪpəti/",
          pos: "n.",
          band: "8.0",
          stars: 3,
          meaningZh: "意外之喜，机缘巧合（碰巧发现美好事物的运气）",
          collocation: "a moment of serendipity (机缘巧合的时刻)",
          quote: "剑桥雅思 14 Test 4: Scientific breakthroughs are seldom linear; they hinge on acute serendipity.",
          endingSummary: "主角结语：英语中最浪漫的单词之一，雅思大作文写科学发现离不开偶然性时，堪称绝杀！"
        }
      ],
      quickQuiz: {
        question: "哪一个词代表'积极沉淀内心的独处'，而非消极痛苦的寂寞？",
        options: [
          "A. isolation",
          "B. solitude",
          "C. loneliness",
          "D. emptiness"
        ],
        answer: 1,
        tip: "solitude 指内省平和的清静独处，带有主动而充实的享受色彩。"
      }
    },
    {
      id: "v_05",
      genre: "skit",
      genreTag: "抽象短剧",
      genreColor: "#ec4899",
      title: "打工人的午餐提案：用务实逻辑破局",
      poster: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      videoUrl: "",
      author: "@办公室奇妙物语",
      currentStepText: "6 / 6",
      subtitleEn: "A persuasive argument requires pragmatic feasibility rather than speculative hype.",
      subtitleZh: "一份有说服力的论证需要务实的可行性，而不是空中楼阁的投机炒作。",
      humorousLine: "老板问我有什么构想，我说构想就是准点下班。",
      bgGradient: "linear-gradient(135deg, #451a03 0%, #78350f 50%, #1c1917 100%)",
      words: [
        {
          id: "vw_05_1",
          word: "persuasive",
          phonetic: "/pəˈsweɪsɪv/",
          pos: "adj.",
          band: "6.5",
          stars: 5,
          meaningZh: "有说服力的，令人信服的",
          collocation: "persuasive evidence (强有力的证据), highly persuasive",
          quote: "剑桥雅思 13 Test 4: The proponent failed to substantiate claims with empirically persuasive statistics.",
          endingSummary: "主角结语：写作 Task 2 评分标准里的 key word，你的观点要 clear 且 persuasive。"
        },
        {
          id: "vw_05_2",
          word: "pragmatic",
          phonetic: "/præɡˈmætɪk/",
          pos: "adj.",
          band: "7.5",
          stars: 5,
          meaningZh: "务实的，讲求实效的",
          collocation: "a pragmatic approach (务实的方法), pragmatic solution",
          quote: "剑桥雅思 17 Test 3: Urban planners opted for pragmatic retrofitting rather than extravagant demolition.",
          endingSummary: "主角结语：学术界最喜欢务实的解决方案 (pragmatic solution)，比 realistic 高级一个段位！"
        },
        {
          id: "vw_05_3",
          word: "feasibility",
          phonetic: "/ˌfiːzəˈbɪləti/",
          pos: "n.",
          band: "7.5",
          stars: 4,
          meaningZh: "可行性，实施可能性",
          collocation: "feasibility study (可行性报告), economic feasibility",
          quote: "剑桥雅思 11 Test 2: The feasibility of transitioning to 100% renewable grid storage remains contentious.",
          endingSummary: "主角结语：任何政府决策题、环保题，只要讨论某项方案能不能落地，都可以用 feasibility！"
        }
      ],
      quickQuiz: {
        question: "在商业计划或学术论文中，'feasibility study' 的标准学术含义是？",
        options: [
          "A. 盈利分析",
          "B. 可行性研究报告",
          "C. 市场满意度调查",
          "D. 风险对冲方案"
        ],
        answer: 1,
        tip: "feasibility study 是雅思图表题与社科类阅读中讨论项目是否可实施的必备词组。"
      }
    },
    {
      id: "v_06",
      genre: "science",
      genreTag: "科普视频",
      genreColor: "#3b82f6",
      title: "心流机制：如何进入无我专注态？",
      poster: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      videoUrl: "",
      author: "@认知实验室",
      currentStepText: "1 / 6",
      subtitleEn: "Reaching an optimum equilibrium between task challenge and personal competence unlocks intrinsic flow.",
      subtitleZh: "在任务挑战与个人能力之间达成最佳平衡，方能解锁内在驱动的心流状态。",
      humorousLine: "学雅思学到忘记吃晚饭？恭喜你，已经入道心流。",
      bgGradient: "linear-gradient(135deg, #172554 0%, #1e3a8a 50%, #030712 100%)",
      words: [
        {
          id: "vw_06_1",
          word: "optimum",
          phonetic: "/ˈɒptɪməm/",
          pos: "adj. / n.",
          band: "7.0",
          stars: 4,
          meaningZh: "最佳的，最适宜的；最适条件",
          collocation: "optimum conditions (最佳状态), optimum performance",
          quote: "剑桥雅思 15 Test 1: Plants attain optimum photosynthetic efficiency under modulated LED wavelengths.",
          endingSummary: "主角结语：比 'best' 专业很多倍的学术词，用来修饰温度、配比、工作效率无懈可击！"
        },
        {
          id: "vw_06_2",
          word: "equilibrium",
          phonetic: "/ˌiːkwɪˈlɪbriəm/",
          pos: "n.",
          band: "7.5",
          stars: 5,
          meaningZh: "平衡状态，身心平静",
          collocation: "maintain equilibrium (维持平衡), psychological equilibrium",
          quote: "剑桥雅思 16 Test 3: Ecosystems rely on predators to sustain the trophic equilibrium.",
          endingSummary: "主角结语：物理平衡、生态平衡、心理平衡通通都能用，雅思大阅读超高频概念！"
        },
        {
          id: "vw_06_3",
          word: "intrinsic",
          phonetic: "/ɪnˈtrɪnzɪk/",
          pos: "adj.",
          band: "7.5",
          stars: 5,
          meaningZh: "内在的，本质的，固有的",
          collocation: "intrinsic motivation (内生动力), intrinsic value",
          quote: "剑桥雅思 12 Test 1: Children exhibit stronger perseverance when guided by intrinsic curiosity.",
          endingSummary: "主角结语：教育类必考！内在动机是 intrinsic motivation，外在奖励是 extrinsic reward。"
        }
      ],
      quickQuiz: {
        question: "在教育心理学中，'来自于自身热爱而非外部金钱奖赏的动力'称为？",
        options: [
          "A. extrinsic incentive",
          "B. intrinsic motivation",
          "C. compulsory duty",
          "D. spontaneous impulse"
        ],
        answer: 1,
        tip: "intrinsic 指本质内在的，intrinsic motivation 是雅思大作文关于学习热情的黄金词汇！"
      }
    }
  ],

  // 看一看：外刊深度分级文章库
  articles: [
    {
      id: "art_01",
      title: "Generative AI and the Future of Intellectual Autonomy",
      titleZh: "生成式人工智能与人类智识自主性的未来",
      publicationId: "economist",
      publicationName: "The Economist",
      domain: "ai",
      domainLabel: "AI 智能",
      date: "2026-10-15",
      readMinutes: 6,
      targetBand: 7.0,
      cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80",
      summary: "当机器不仅能生成流畅代码与分析图表，更能模拟人类复杂推理，知识工作者究竟是在释放潜能还是退化智识？",
      difficultyLevels: {
        easy: {
          band: "5.5 - 6.0",
          paragraphs: [
            "Today, AI tools can write essays and draw pictures very fast. Many workers use them every day to save time.",
            "However, teachers and scientists worry that if people rely too much on software, they might stop thinking deeply by themselves."
          ]
        },
        standard: {
          band: "6.5 - 7.0",
          paragraphs: [
            "In contemporary corporate landscapes, the rapid integration of [[autonomous|w_01]] algorithms is catalyzing a monumental [[paradigm|w_02]] shift across intellectual sectors.",
            "While corporate executives celebrate unprecedented efficiency gains, neuroscientists raise alarming caveats regarding whether outsourcing critical synthesis could trigger cognitive [[deterioration|w_03]] over generations."
          ]
        },
        ielts: {
          band: "7.5 - 8.0",
          paragraphs: [
            "Far from acting merely as benign computational utilities, contemporary neural networks are fundamentally reshaping the epistemological foundations of knowledge labor. The deployment of [[autonomous|w_01]] decision-support architectures demands a radical reconceptualization of our philosophical [[paradigm|w_02]].",
            "Critics contend that uncritical reliance on predictive heuristics risks precipitating subtle cognitive [[deterioration|w_03]], wherein human faculties of discernment and [[empirical|w_04]] inquiry become chronically subordinated to algorithmic predetermination."
          ]
        },
        challenge: {
          band: "8.5+",
          paragraphs: [
            "The burgeoning ubiquity of self-reinforcing generative architectures confronts humanity with an ontological dilemma: does the wholesale delegation of cognitive synthesis augur an era of unprecedented intellectual emancipation, or does it herald the inexorable atrophy of organic discernment?",
            "To arrest this incipient intellectual [[deterioration|w_03]], scholars advocate for stringent [[empirical|w_04]] benchmarking that re-elevates human epistemological agency above synthetic stochastic extrapolation."
          ]
        }
      },
      annotations: {
        w_01: {
          word: "autonomous",
          phonetic: "/ɔːˈtɒnəməs/",
          band: "7.0",
          stars: 5,
          meaningZh: "自主的，自治的，独立运行的",
          synonyms: "independent, self-governing, self-directed",
          ieltsContext: "常考科技与交通话题，如 autonomous driving（自动驾驶），autonomous systems（自主决策系统）。"
        },
        w_02: {
          word: "paradigm",
          phonetic: "/ˈpærədaɪm/",
          band: "7.5",
          stars: 5,
          meaningZh: "范式，典范，认知框架",
          synonyms: "archetype, theoretical model, conceptual framework",
          ieltsContext: "剑桥真题常客：paradigm shift（范式转移/根本变革），学术议论文高级加分表达。"
        },
        w_03: {
          word: "deterioration",
          phonetic: "/dɪˌtɪəriəˈreɪʃn/",
          band: "7.0",
          stars: 5,
          meaningZh: "恶化，堕落，退化",
          synonyms: "degeneration, decline, degradation",
          ieltsContext: "替代 'getting worse'，如 environmental deterioration（环境恶化），cognitive deterioration（认知退化）。"
        },
        w_04: {
          word: "empirical",
          phonetic: "/ɪmˈpɪrɪkl/",
          band: "8.0",
          stars: 4,
          meaningZh: "实证的，基于经验实验的",
          synonyms: "evidence-based, experimental, factual",
          ieltsContext: "剑雅科学与社科类阅读的核心词，与 theoretical（理论上的）构成反义对比。"
        }
      },
      syntaxBreakdowns: [
        {
          sentence: "While corporate executives celebrate unprecedented efficiency gains, neuroscientists raise alarming caveats regarding whether outsourcing critical synthesis could trigger cognitive deterioration over generations.",
          structure: "While 让步状语从句 + 主句 + regarding 介词引导的 whether 宾语从句",
          analysis: "主干是 'neuroscientists raise caveats'（科学家提出警示）。前半句用 while 形成商界狂欢与学界担忧的鲜明对照，符合雅思 7+ 作文双边论证结构。"
        }
      ]
    },
    {
      id: "art_02",
      title: "The Architecture of Urban Resilience in a Changing Climate",
      titleZh: "气候变迁背景下的海绵城市与空间韧性建构",
      publicationId: "nature",
      publicationName: "Nature",
      domain: "nature",
      domainLabel: "自然科学",
      date: "2026-10-14",
      readMinutes: 7,
      targetBand: 7.5,
      cover: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=700&q=80",
      summary: "全球极端气候加剧，传统钢筋混凝土防洪工程已近极限。现代城市规划正在转向吸纳自然律动的生态韧性系统。",
      difficultyLevels: {
        easy: {
          band: "5.5 - 6.0",
          paragraphs: [
            "Heavy rain and hot weather are causing big problems for modern cities. Old drainage pipes cannot hold all the flood water.",
            "New eco-friendly parks are being built to absorb rainwater like giant sponges."
          ]
        },
        standard: {
          band: "6.5 - 7.0",
          paragraphs: [
            "Metropolitan regions worldwide are experiencing escalating vulnerability to extreme meteorological anomalies. Rigid concrete infrastructure frequently fails to [[mitigate|w_11]] catastrophic inundations.",
            "Urban hydrologists emphasize the imperative of ecological [[restoration|w_12]], designing sponge-like bioswales that absorb precipitation dynamically while preserving biodiversity."
          ]
        },
        ielts: {
          band: "7.5 - 8.0",
          paragraphs: [
            "The compounding impacts of global climatic volatility have laid bare the inherent fragility of conventional civil engineering. Monolithic seawalls and subterranean storm sewers struggle to [[mitigate|w_11]] unprecedented storm surges.",
            "Contemporary municipal authorities must prioritize ecological [[restoration|w_12]] through permeable urban fabrics, reconciling hydrodynamic unpredictability with sustainable civic habitability."
          ]
        },
        challenge: {
          band: "8.5+",
          paragraphs: [
            "Confronted by anthropogenically magnified hydrological cataclysms, the obsolete orthodoxy of rigid defense has succumbed to adaptive systemic resilience.",
            "By synthesizing hydrodynamic modeling with indigenous landscape architecture, municipal architects orchestrate strategic [[restoration|w_12]], establishing socio-ecological homeostasis amid perennial climactic disequilibrium."
          ]
        }
      },
      annotations: {
        w_11: {
          word: "mitigate",
          phonetic: "/ˈmɪtɪɡeɪt/",
          band: "7.0",
          stars: 5,
          meaningZh: "缓解，减轻，缓和",
          synonyms: "alleviate, attenuate, diminish",
          ieltsContext: "环保题绝对王者词汇：mitigate the effects of climate change（缓解气候变化影响）。"
        },
        w_12: {
          word: "restoration",
          phonetic: "/ˌrestəˈreɪʃn/",
          band: "6.5",
          stars: 5,
          meaningZh: "恢复，复原，重建",
          synonyms: "rehabilitation, renewal, reconstruction",
          ieltsContext: "ecological restoration（生态修复），建筑与古迹修复也广泛使用。"
        }
      },
      syntaxBreakdowns: [
        {
          sentence: "Monolithic seawalls and subterranean storm sewers struggle to mitigate unprecedented storm surges.",
          structure: "并列主语 + 动词 struggle to do + 极值宾语",
          analysis: "monolithic（庞大僵硬的）与 subterranean（地下的）词汇极其精准，生动勾勒出传统硬质工程在面对巨浪时的无力感。"
        }
      ]
    },
    {
      id: "art_03",
      title: "The Neurobiology of Consumer Impulse in the Digital Age",
      titleZh: "数字时代消费者冲动消费的神经生物学密码",
      publicationId: "psychtoday",
      publicationName: "Psychology Today",
      domain: "psychology",
      domainLabel: "心理学",
      date: "2026-10-12",
      readMinutes: 5,
      targetBand: 6.5,
      cover: "https://images.unsplash.com/photo-1558435186-d31d126391fa?auto=format&fit=crop&w=700&q=80",
      summary: "短视频带货与一键付款算法，是如何精准绕过人类大脑的前额叶理性防线，释放瞬时多巴胺诱导结账的？",
      difficultyLevels: {
        easy: {
          band: "5.5 - 6.0",
          paragraphs: [
            "Shopping online is easier than ever. One click can buy clothes or games immediately.",
            "Scientists say that bright phone screens and countdown discounts make our brains feel excited and buy things we do not really need."
          ]
        },
        standard: {
          band: "6.5 - 7.0",
          paragraphs: [
            "Digital storefronts leverage frictionless payment mechanisms to trigger transient dopamine spikes, prompting impulsive purchasing before rational reflection occurs.",
            "Marketing psychology reveals that artificial scarcity heuristics induce consumer anxiety, weakening the self-regulatory capacity of the prefrontal cortex."
          ]
        },
        ielts: {
          band: "7.5 - 8.0",
          paragraphs: [
            "E-commerce platforms have perfected neuro-marketing architectures, weaponizing frictionless transactions to circumvent rational deliberation. Algorithmic notifications induce acute urgency, cultivating subconscious consumer dependency.",
            "Empirical behavioral studies confirm that sustained algorithmic nudging impairs cognitive restraint, rendering consumers uniquely susceptible to exploitative commercial stratagems."
          ]
        },
        challenge: {
          band: "8.5+",
          paragraphs: [
            "By subjugating dopaminergic reward pathways to micro-targeted transactional triggers, hyper-optimized digital conduits bypass cerebral volition with chilling efficiency.",
            "The ensuing erosion of consumer autonomy signifies a watershed juncture in neuro-capitalism, necessitating legislative safeguards against predatory neuro-manipulation."
          ]
        }
      },
      annotations: {
        w_21: {
          word: "impulsive",
          phonetic: "/ɪmˈpʌlsɪv/",
          band: "6.5",
          stars: 4,
          meaningZh: "冲动的，凭一时兴起的",
          synonyms: "spontaneous, hasty, precipitate",
          ieltsContext: "雅思关于消费主义和青少年行为题目高频词汇：impulsive buying behavior。"
        }
      },
      syntaxBreakdowns: []
    }
  ],

  // 猜一猜：图像记忆单词（20 题库精选题库 · 选出所有符合它的图）
  guessPuzzles: [
    {
        "id": "gp_01",
        "word": "restrain",
        "phonetic": "/rɪˈstreɪn/",
        "pos": "v.",
        "meaningZh": "克制，抑制，约束；阻止",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_restrain_1.png",
                "caption": "主人抱住想扑蛋糕的猫咪",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_restrain_2.png",
                "caption": "男生在沙发上安静熟睡放松",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_restrain_3.png",
                "caption": "同伴拉住男生阻止他坐下",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_restrain_4.png",
                "caption": "操场跑道全速冲刺竞速",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】前缀 re-(往回) + strain(拉紧) = 往回拉紧缰绳 -> 抑制、阻止。图1抱着猫不让扑蛋糕、图3拉住同伴不让踩陷阱，都生动演绎了 restrain 的真实语境！",
        "ieltsQuote": "剑桥雅思 14 Test 2: The regulatory committee must act decisively to restrain speculative financial trading."
    },
    {
        "id": "gp_02",
        "word": "procrastinate",
        "phonetic": "/prəˈkræstɪneɪt/",
        "pos": "v.",
        "meaningZh": "拖延，耽搁",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                "caption": "闹钟连按五次稍后提醒",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
                "caption": "书堆成山却在转笔摸鱼",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
                "caption": "高效专注在键盘前敲代码",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
                "caption": "死线前10分钟通宵狂赶作业",
                "isCorrect": true
            }
        ],
        "correctIndices": [
            0,
            1,
            3
        ],
        "mnemonic": "【词根记忆】pro-(向后) + crastinus(明天的)。永远把手头最艰巨的任务留给明天的自己，这就是典型的 procrastinate！",
        "ieltsQuote": "剑桥雅思 12 Test 4: Students who habitually procrastinate report significantly higher levels of academic anxiety."
    },
    {
        "id": "gp_03",
        "word": "solitude",
        "phonetic": "/ˈsɒlətjuːd/",
        "pos": "n.",
        "meaningZh": "独处，独居；清幽寂静",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
                "caption": "面朝空旷静谧的大海独自静思",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
                "caption": "一人在暖黄壁灯下的书房安心阅读",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
                "caption": "摇滚音乐节万人狂欢合唱",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&q=80",
                "caption": "火车站候车大厅人潮拥挤",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            1
        ],
        "mnemonic": "【情境区分】区别于孤单(loneliness)，solitude 是一种内心富足充盈的主动独处享受：我自清欢，与己为伴。",
        "ieltsQuote": "剑桥雅思 16 Test 1: Solitude affords reflective minds the cognitive space required for deep creative synthesis."
    },
    {
        "id": "gp_04",
        "word": "dilemma",
        "phonetic": "/daɪˈlemə/",
        "pos": "n.",
        "meaningZh": "两难困境，左右为难的境地",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
                "caption": "站在十字路口前两难止步",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80",
                "caption": "跑车在通畅直道全速疾驰",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80",
                "caption": "欢度生日派对吹灭蜡烛",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80",
                "caption": "经典电车难题向左还是向右",
                "isCorrect": true
            }
        ],
        "correctIndices": [
            0,
            3
        ],
        "mnemonic": "【词根拆解】di-(两个) + lemma(命题)。面对两个针锋相对且难以兼顾的抉择，这就是 dilemma！",
        "ieltsQuote": "剑桥雅思 11 Test 3: Policymakers are trapped in a moral dilemma between economic growth and environmental stewardship."
    },
    {
        "id": "gp_05",
        "word": "bustling",
        "phonetic": "/ˈbʌslɪŋ/",
        "pos": "adj.",
        "meaningZh": "熙熙攘攘的，喧闹繁忙的",
        "band": "6.5",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=80",
                "caption": "涩谷十字路口如潮的人流",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
                "caption": "热气蒸腾人声鼎沸的夜市小吃街",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
                "caption": "金融街早高峰疾步穿梭的白领",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80",
                "caption": "空无一人的深山云雾山脊",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            1,
            2
        ],
        "mnemonic": "【生活联想】bus(忙碌) + tling -> 车水马龙、熙熙攘攘的街市景象，雅思口语描述家乡都市高分词！",
        "ieltsQuote": "剑桥雅思 13 Test 1: The historic quarter transformed into a bustling tourist hub with vibrant artisanal stalls."
    },
    {
        "id": "gp_06",
        "word": "mitigate",
        "phonetic": "/ˈmɪtɪɡeɪt/",
        "pos": "v.",
        "meaningZh": "缓解，减轻，缓和",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80",
                "caption": "遮阳棚洒水系统给旱田降温",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
                "caption": "森林深处蔓延的熊熊烈火",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80",
                "caption": "戴上降噪耳机抵挡窗外噪音",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
                "caption": "狂风暴雨拔起大树阻塞交通",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【词根拆解】miti-(柔和) + gate(使成为) -> 使痛苦、损害或严重性减轻变柔和。",
        "ieltsQuote": "剑桥雅思 17 Test 3: Renewable energy investments are crucial to mitigate carbon emissions."
    },
    {
        "id": "gp_07",
        "word": "fragile",
        "phonetic": "/ˈfrædʒaɪl/",
        "pos": "adj.",
        "meaningZh": "易碎的，脆弱的",
        "band": "6.5",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
                "caption": "薄如蝉翼的水晶高脚杯",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
                "caption": "树梢轻晃即将破壳的细脆鸟蛋",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=400&q=80",
                "caption": "坚硬无比的花岗岩金字塔石阶",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=400&q=80",
                "caption": "防暴特种作业装甲重型卡车",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            1
        ],
        "mnemonic": "【词根记忆】frag-(碎) + ile(易于...的) -> 易碎脆弱。不仅指玻璃，雅思常考脆弱生态(fragile ecosystem)。",
        "ieltsQuote": "剑桥雅思 15 Test 1: The Arctic ecosystem is remarkably fragile in the face of warming ocean currents."
    },
    {
        "id": "gp_08",
        "word": "cognitive",
        "phonetic": "/ˈkɒɡnətɪv/",
        "pos": "adj.",
        "meaningZh": "认知的，感知的",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&q=80",
                "caption": "脑电波监测与神经回路模型",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
                "caption": "猫猫在纸盒子里翻滚打盹",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
                "caption": "复杂的逻辑思维导图与分析记录",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
                "caption": "喝奶茶自拍上传社交平台",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【词根拆解】cogn-(认知、了解) + itive -> 关于心智知觉与脑力推理思考过程的。",
        "ieltsQuote": "剑桥雅思 10 Test 3: Excessive digital notifications exacerbate cognitive distraction in adolescent learners."
    },
    {
        "id": "gp_09",
        "word": "nostalgia",
        "phonetic": "/nɒˈstældʒə/",
        "pos": "n.",
        "meaningZh": "怀旧，怀念往昔",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
                "caption": "翻看泛黄胶卷黑白家庭老相册",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80",
                "caption": "老式黑胶唱片机流淌复古老歌",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
                "caption": "赛博朋克霓虹灯未来科幻场景",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80",
                "caption": "无人驾驶高空物流无人机",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            1
        ],
        "mnemonic": "【词根拆解】nost-(回家、旧时) + algia(伤感) -> 对旧时美好岁月的温情怀恋与回味。",
        "ieltsQuote": "剑桥雅思 18 Test 2: Vintage vinyl revival is fueled by a pervasive sense of generational nostalgia."
    },
    {
        "id": "gp_10",
        "word": "resilient",
        "phonetic": "/rɪˈzɪliənt/",
        "pos": "adj.",
        "meaningZh": "有弹性的；适应力强的，能迅速恢复的",
        "band": "7.5",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=400&q=80",
                "caption": "砖石缝隙中倔强破土盛放的雏菊",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
                "caption": "摔在瓷砖上一击即碎的花瓶",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
                "caption": "狂风暴雨后依然傲立不屈的深根竹林",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
                "caption": "烈日暴晒下脆弱易碎的枯叶",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【词根拆解】re-(回) + sili-(弹跳) + ent -> 遭遇重压依然能弹回原状 -> 坚韧不拔、抗逆力强。",
        "ieltsQuote": "剑桥雅思 14 Test 4: Communities with robust social capital prove far more resilient during economic shocks."
    },
    {
        "id": "gp_11",
        "word": "monotonous",
        "phonetic": "/məˈnɒtənəs/",
        "pos": "adj.",
        "meaningZh": "单调乏味的，毫无变化的",
        "band": "6.5",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                "caption": "日复一日打卡重复贴封条的流水线",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
                "caption": "无休止重复复制粘贴相同表格数据",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
                "caption": "五光十色的魔术烟火杂技表演",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
                "caption": "探索神秘海底未知的珊瑚礁群",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            1
        ],
        "mnemonic": "【词根拆解】mono-(单一) + ton-(调子) + ous -> 永远只有一个调调 -> 单调乏味的。",
        "ieltsQuote": "剑桥雅思 12 Test 2: Employees subjected to monotonous tasks showed significantly reduced attention spans."
    },
    {
        "id": "gp_12",
        "word": "fluctuate",
        "phonetic": "/ˈflʌktʃueɪt/",
        "pos": "v.",
        "meaningZh": "波动，起伏不定",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
                "caption": "股票行情K线剧烈大涨大跌",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=400&q=80",
                "caption": "水平仪上纹丝不动的完美水平基准线",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
                "caption": "没有一丝涟漪的绝对镜面湖水",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
                "caption": "狂暴大海潮汐剧烈升降的大浪",
                "isCorrect": true
            }
        ],
        "correctIndices": [
            0,
            3
        ],
        "mnemonic": "【小作文必备词】flu-(流动) + ctuate -> 像水流波涛一样起伏跌宕 -> 波动。小作文描述趋势王牌词！",
        "ieltsQuote": "雅思写作 Task 1: The price of petroleum fluctuated wildly between January and August."
    },
    {
        "id": "gp_13",
        "word": "lucrative",
        "phonetic": "/ˈluːkrətɪv/",
        "pos": "adj.",
        "meaningZh": "利润丰厚的，赚钱的",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80",
                "caption": "初创科技公司成功上市获得百倍回报",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
                "caption": "常年亏损濒临破产甩卖的实体店",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
                "caption": "签下价值十亿美元的高额跨国独家合同",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                "caption": "向慈善孤儿院免费捐赠过冬棉衣",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【词根记忆】lucr-(钱财、利润) + ative -> 能带来大笔财富回报的 -> 利润极其丰厚。",
        "ieltsQuote": "剑桥雅思 13 Test 3: The extraction of rare earth elements has evolved into a lucrative international industry."
    },
    {
        "id": "gp_14",
        "word": "vulnerable",
        "phonetic": "/ˈvʌlnərəbl/",
        "pos": "adj.",
        "meaningZh": "易受伤害的，脆弱易受损的",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
                "caption": "失去母兽庇护在冰天雪地瑟瑟发抖的幼崽",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80",
                "caption": "低洼沿海毫无防波堤保护的木质渔村",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=400&q=80",
                "caption": "地下深处万无一失的防核掩体工事",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=400&q=80",
                "caption": "装甲全封闭防弹警用护卫队",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            1
        ],
        "mnemonic": "【词根拆解】vulner-(创伤) + able -> 容易遭受物理或心理重创的。大作文环境弱势群体常客！",
        "ieltsQuote": "剑桥雅思 16 Test 2: Low-income coastal populations are disproportionately vulnerable to rising sea levels."
    },
    {
        "id": "gp_15",
        "word": "ambiguous",
        "phonetic": "/æmˈbɪɡjuəs/",
        "pos": "adj.",
        "meaningZh": "模棱两可的，含糊不清的",
        "band": "7.5",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
                "caption": "指路牌同时指向互相矛盾的两个方向",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
                "caption": "严谨精确到小数点后六位的科学公式",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
                "caption": "合同条款含混其词存在双重解释漏洞",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=400&q=80",
                "caption": "黑白分明毫无争议的终点裁判录像",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【词根拆解】ambi-(两个方向、周围) + ag-(驱动) -> 怎么解读都能说得通 -> 模棱两可。",
        "ieltsQuote": "剑桥雅思 15 Test 3: The survey generated ambiguous findings regarding consumer preferences."
    },
    {
        "id": "gp_16",
        "word": "spontaneous",
        "phonetic": "/spɒnˈteɪniəs/",
        "pos": "adj.",
        "meaningZh": "自发的，非强迫的；心血来潮的",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
                "caption": "街头艺人即兴演奏引来全场路人围圈起舞",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
                "caption": "说走就走毫无旅行攻略的自驾探索",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
                "caption": "严格按分钟执行的军训排队步操",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
                "caption": "提前半年反复推敲修改的婚礼策划流程表",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            1
        ],
        "mnemonic": "【生活情境】不是经过精心规划编排的，而是源自内心天然冲动或即兴激发的 -> 自发、随兴。",
        "ieltsQuote": "剑桥雅思 17 Test 4: The musical performance concluded with a spontaneous standing ovation."
    },
    {
        "id": "gp_17",
        "word": "tedious",
        "phonetic": "/ˈtiːdiəs/",
        "pos": "adj.",
        "meaningZh": "冗长乏味的，令人厌烦的",
        "band": "6.5",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
                "caption": "逐行手动核对上万张发票税号数字",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80",
                "caption": "在游乐场体验惊险过山车放声大笑",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                "caption": "在办事窗口排长队等待盖几十个章",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
                "caption": "品尝全球米其林星级特色甜点",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【情感记忆】ted-(令人厌烦) + ious -> 过程极其冗长、没有任何乐趣的折磨差事。",
        "ieltsQuote": "剑桥雅思 10 Test 1: Sorting through centuries of archival documents proved to be a tedious undertaking."
    },
    {
        "id": "gp_18",
        "word": "perseverance",
        "phonetic": "/ˌpɜːsɪˈvɪərəns/",
        "pos": "n.",
        "meaningZh": "毅力，坚持不懈，百折不挠",
        "band": "7.5",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
                "caption": "马拉松选手双腿抽筋依然咬牙冲向终点",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80",
                "caption": "遇到一点难题就立刻放弃退出游戏",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                "caption": "通宵刷短视频直到天亮",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=400&q=80",
                "caption": "科学家历经数万次实验失败最终攻克难关",
                "isCorrect": true
            }
        ],
        "correctIndices": [
            0,
            3
        ],
        "mnemonic": "【词根拆解】per-(始终、贯彻) + severe(严酷) + ance -> 面对严酷逆境始终贯彻到底 -> 坚毅不拔。",
        "ieltsQuote": "剑桥雅思 14 Test 1: Scientific breakthroughs demand exceptional intellectual brilliance alongside relentless perseverance."
    },
    {
        "id": "gp_19",
        "word": "metaphor",
        "phonetic": "/ˈmetəfər/",
        "pos": "n.",
        "meaningZh": "隐喻，暗喻；象征",
        "band": "7.5",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&q=80",
                "caption": "时钟齿轮与枯萎花朵隐喻时光飞逝",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
                "caption": "书籍作为灯塔隐喻知识照亮迷茫黑夜",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
                "caption": "用直尺实测桌子的精准厘米长度",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80",
                "caption": "汽车仪表盘显示时速80公里",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            1
        ],
        "mnemonic": "【修辞手法】meta-(转变、超越) + phor-(带来) -> 不带 like/as 而直接将两件事物互为寄托借代 -> 隐喻。",
        "ieltsQuote": "剑桥雅思 15 Test 4: The author employs the clockwork mechanism as a metaphor for urban regimentation."
    },
    {
        "id": "gp_20",
        "word": "inevitable",
        "phonetic": "/ɪnˈevɪtəbl/",
        "pos": "adj.",
        "meaningZh": "不可避免的，必然发生的",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
                "caption": "深秋树叶凋零化作春泥的大自然铁律",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=400&q=80",
                "caption": "买彩票喜中千万头奖的极偶然小概率事件",
                "isCorrect": false
            },
            {
                "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
                "caption": "太阳自东方升起西方落下的客观必然",
                "isCorrect": true
            },
            {
                "url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
                "caption": "掷骰子连续五次掷出六点幸运奇迹",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【词根拆解】in-(不) + evit-(避开) + able -> 怎么躲也躲不过的 -> 必然发生、不可阻挡。",
        "ieltsQuote": "剑桥雅思 16 Test 3: Structural automation has rendered certain repetitive vocations virtually inevitable to phase out."
    }
],

  // 生词本初始化数据
  vocabulary: [
    {
      id: "v_saved_1",
      word: "routine",
      phonetic: "/ruːˈtiːn/",
      pos: "n.",
      meaningZh: "日常习惯，常规程序",
      band: "6.0",
      source: "刷一刷 · 咖啡依赖者",
      addedAt: "2026-10-16 09:41",
      mastery: 1
    },
    {
      id: "v_saved_2",
      word: "fatigue",
      phonetic: "/fəˈtiːɡ/",
      pos: "n.",
      meaningZh: "极度疲倦，疲劳",
      band: "7.0",
      source: "刷一刷 · 咖啡依赖者",
      addedAt: "2026-10-16 09:42",
      mastery: 2
    },
    {
      id: "v_saved_3",
      word: "autonomous",
      phonetic: "/ɔːˈtɒnəməs/",
      pos: "adj.",
      meaningZh: "自主的，自治的，独立运行的",
      band: "7.5",
      source: "看一看 · The Economist",
      addedAt: "2026-10-16 10:15",
      mastery: 1
    }
  ]
};
