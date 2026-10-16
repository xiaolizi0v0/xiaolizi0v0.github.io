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
      poster: "lingo/assets/shot-vlog.png",
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

  // 猜一猜：图像记忆单词（20 题库精选样例）
  guessPuzzles: [
    {
      id: "gp_01",
      clueZh: "形容把该做的事情拖到最后一刻的普遍人类行为",
      category: "雅思生活高频动词",
      images: [
        { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", caption: "早上 7 点闹钟连按五次稍后提醒" },
        { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80", caption: "书桌上堆积成山但就是不愿翻开" },
        { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80", caption: "熟人聚会时还在偷偷摸鱼刷猫猫视频" },
        { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80", caption: "距离截止时间仅剩 15 分钟开始狂敲键盘" }
      ],
      maskWord: "P _ _ C _ _ S T _ N _ T _",
      correctWord: "Procrastinate",
      phonetic: "/prəˈkræstɪneɪt/",
      pos: "v.",
      meaningZh: "拖延，耽搁",
      band: "7.0",
      mnemonic: "【四图联想记】前缀 pro-(向后推) + crastinus(明天的)。永远把手头最艰巨的试卷推给'明天的自己'，这就是典型的 procrastinate！",
      options: ["Procrastinate", "Ponder", "Precede", "Persevere"]
    },
    {
      id: "gp_02",
      clueZh: "指一个人在繁华世界中主动选择、心境平静的'高质量独处'",
      category: "雅思情感与生活方式",
      images: [
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", caption: "面朝空旷静谧的大海独自静思" },
        { url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80", caption: "一人在暖黄壁灯下的书房安心阅读" },
        { url: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80", caption: "清晨在雾气弥漫的深山竹林漫步" },
        { url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80", caption: "街角咖啡馆靠窗座位品味手冲" }
      ],
      maskWord: "S _ L _ T _ D _",
      correctWord: "Solitude",
      phonetic: "/ˈsɒlətjuːd/",
      pos: "n.",
      band: "7.0",
      mnemonic: "【四图联想记】区别于被动孤单的 loneliness，solitude 是一种内心富足的高级享受：我自清欢，与己为伴。",
      options: ["Solitude", "Isolation", "Desolation", "Alienation"]
    },
    {
      id: "gp_03",
      clueZh: "形容面对两个都极具挑战的抉择，左右为难的棘手困局",
      category: "雅思思辨高频名词",
      images: [
        { url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80", caption: "站在两条完全未知的十字路口前止步" },
        { url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80", caption: "高难度天平两端放着同样的砝码" },
        { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80", caption: "期末考试复习撞上心仪公司的实习面试" },
        { url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80", caption: "经典电车难题：扳动还是不扳动？" }
      ],
      maskWord: "D _ L _ M M _",
      correctWord: "Dilemma",
      phonetic: "/daɪˈlemə/",
      pos: "n.",
      band: "7.0",
      mnemonic: "【四图联想记】前缀 di-(二) + lemma(前提命题)。两个命题相互打架，怎么选都扎心，这就是两难困境 dilemma！",
      options: ["Dilemma", "Hazard", "Disaster", "Paradox"]
    },
    {
      id: "gp_04",
      clueZh: "形容大都市或市集车水马龙、熙熙攘攘的活力全开状态",
      category: "雅思地点环境描述词",
      images: [
        { url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=80", caption: "东京涩谷十字路口如潮的人流" },
        { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80", caption: "热气蒸腾、吆喝声此起彼伏的夜市摊位" },
        { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80", caption: "金融街早高峰疾步穿梭的白领人群" },
        { url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=400&q=80", caption: "火车站大厅大包小包赶春运的旅客" }
      ],
      maskWord: "B _ S T L _ N G",
      correctWord: "Bustling",
      phonetic: "/ˈbʌslɪŋ/",
      pos: "adj.",
      band: "6.5",
      mnemonic: "【四图联想记】bus(忙忙碌碌) + tling -> 人声鼎沸、车马川流不息的闹市，雅思口语描述家乡街景的无上法宝！",
      options: ["Bustling", "Barren", "Bleak", "Bizarre"]
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
