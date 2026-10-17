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

  // 刷一刷：短视频数据源（抽象短剧、生活 vlog、科普趣味）
  videos: [
    {
        "id": "vid_20261017_01",
        "genre": "workplace",
        "genreTag": "职场实战",
        "genreColor": "#0ea5e9",
        "title": "《入职第一天：如何用 resemble 精准表达？》",
        "poster": "lingo/assets/vlog-clean.png",
        "videoUrl": "lingo/assets/videos/vid_20261017_01.mp4",
        "author": "@Yup_LifeDiary",
        "currentStepText": "1 / 2",
        "subtitleEn": "On my first day, I noticed this manager strongly resembles my college professor. She recognized my potential instantly and gave me great advice. It only took an hour to adjust completely to my new workplace!",
        "subtitleZh": "入职第一天，我发现这位主管长得特别像我的大学教授。她一眼就认出了我的潜力，还给了我很棒的建议。只用了一小时，我就彻底适应了全新的职场环境！",
        "humorousLine": "主管推了推眼镜：“别慌，我比你教授更通情达理。”",
        "bgGradient": "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
        "video_prompt": "A stylish young Asian female protagonist facing camera, 9:16 vertical smartphone format, clearly opening her mouth to speak the English dialogue lines with lively lip movements and natural expressions. Calm atmospheric lighting, photorealistic vlog style, no subtitles/watermark. 此视频只保留清晰的英文对白人声与微弱环境音，不需要喧闹背景音乐。【声音】年轻知性女性清晰纯正的英文口语发音、说话人声对白清晰突出、无大声背景音乐。",
        "words": [
            {
                "id": "vw_gen_1",
                "word": "resemble",
                "phonetic": "/ˈrɪˈzemb(ə)l/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "像，与……相似",
                "collocation": "essential collocation for resemble",
                "quote": "Cambridge IELTS sample for resemble.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 resemble 更显地道！"
            },
            {
                "id": "vw_gen_2",
                "word": "recognize",
                "phonetic": "/ˈrekəɡnaɪz/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "认出;识别；承认",
                "collocation": "essential collocation for recognize",
                "quote": "Cambridge IELTS sample for recognize.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 recognize 更显地道！"
            },
            {
                "id": "vw_gen_3",
                "word": "adjust",
                "phonetic": "/əˈdʒʌst/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "调整;使适合",
                "collocation": "essential collocation for adjust",
                "quote": "Cambridge IELTS sample for adjust.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 adjust 更显地道！"
            }
        ],
        "quickQuiz": {
            "question": "在本条情境中，雅思学术场景使用 'resemble' 的最佳语境是？",
            "options": [
                "A. 表达 像，与……相似",
                "B. 极端情绪宣泄，不宜用于学术",
                "C. 仅限于非正式口语缩写",
                "D. 完全无关的混淆选项"
            ],
            "answer": 0,
            "tip": "resemble 是雅思真题极高频考词，搭配准确即可显著提升 Lexical Resource 分数！"
        },
        "subtitles": [
            {
                "start": 0.0,
                "end": 4.5,
                "en": "On my first day, I noticed this manager strongly resembles my college professor.",
                "zh": "入职第一天，我发现这位主管长得特别像我的大学教授。"
            },
            {
                "start": 4.5,
                "end": 9.5,
                "en": "She recognized my potential instantly and gave me great advice.",
                "zh": "她一眼就认出了我的潜力，还给了我很棒的建议。"
            },
            {
                "start": 9.5,
                "end": 15.0,
                "en": "It only took an hour to adjust completely to my new workplace!",
                "zh": "只用了一小时，我就彻底适应了全新的职场环境！"
            }
        ]
    },
    {
        "id": "vid_20261017_02",
        "genre": "workplace",
        "genreTag": "职场破局",
        "genreColor": "#f59e0b",
        "title": "《提案被否，她用“根本方法”逆转会议室》",
        "poster": "lingo/assets/vlog-clean.png",
        "videoUrl": "lingo/assets/videos/vid_20261017_02.mp4",
        "author": "@Yup_LifeDiary",
        "currentStepText": "2 / 2",
        "subtitleEn": "My approach is simple: first fix the fundamental problem, then test the plan with real users before launch.",
        "subtitleZh": "我的策略很简单：先解决根本问题，再用真实用户测试方案，最后才上线。",
        "humorousLine": "老板听完愣了三秒：“就按你说的办，散会！”",
        "bgGradient": "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
        "video_prompt": "Cinematic 9:16 vertical smartphone shot for ComfyUI MiniMax H3, workplace skit. A beautiful young Asian female protagonist with elegant wavy hair and delicate features, wearing a smart blazer, stands alone in a modern glass meeting room, speaking directly to camera with lively lip movements and confident expressions. She gestures toward a whiteboard with a simple flowchart, no other people visible. Cinematic lighting, realistic texture, shallow depth of field, no subtitles, no watermark. 此视频只保留清晰的英文对白人声与微弱环境音，不需要喧闹背景音乐。【声音】年轻知性女性清晰纯正的英文口语发音、说话人声对白清晰突出、无大声背景音乐。",
        "words": [
            {
                "word": "approach",
                "phonetic": "/əˈprəʊtʃ/",
                "pos": "n.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "方法；途径；方式",
                "collocation": "a practical approach (实用的方法)",
                "endingSummary": "主角结语：口语中用 approach 替代 way/method，并加具体步骤，能显 Band 7 逻辑。"
            },
            {
                "word": "fundamental",
                "phonetic": "/ˌfʌndəˈmentl/",
                "pos": "adj.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "基本的；基础的；根本的",
                "collocation": "fundamental problem (根本问题)",
                "endingSummary": "主角结语：用 fundamental 描述根本问题或基础能力，比 basic 更学术、更高分。"
            }
        ],
        "quickQuiz": {
            "question": "视频中 fix the fundamental problem 最接近哪个意思？",
            "options": [
                "A. 解决根本问题",
                "B. 增加项目预算",
                "C. 更换团队成员",
                "D. 推迟上线时间"
            ],
            "answer": 0,
            "tip": "fundamental 作形容词表示“基础的、根本的”，与 problem 搭配强调核心问题，不是预算或人员调整。"
        },
        "subtitles": [
            {
                "start": 0.0,
                "end": 7.0,
                "en": "My approach is simple: first fix the fundamental problem,",
                "zh": "我的策略很简单：先解决根本问题，"
            },
            {
                "start": 7.0,
                "end": 15.0,
                "en": "then test the plan with real users before launch.",
                "zh": "再用真实用户测试方案，最后才上线。"
            }
        ]
    },
    {
        "id": "vid_20261017_03",
        "genre": "workplace",
        "genreTag": "职场实战",
        "genreColor": "#0ea5e9",
        "title": "《入职第一天：如何用 rely on 精准表达？》",
        "poster": "lingo/assets/vlog-clean.png",
        "videoUrl": "lingo/assets/videos/vid_20261017_03.mp4",
        "author": "@Yup_LifeDiary",
        "currentStepText": "3 / 6",
        "subtitleEn": "Our team cannot solely rely on domestic market trends. We took every strict measure to evaluate user feedback, because smart data is key to measuring real success!",
        "subtitleZh": "我们的团队不能仅仅依靠国内市场的发展趋势。我们采取了一切严密措施来评估用户反馈，因为智能数据才是衡量真正成功的关键！",
        "humorousLine": "凭感觉做决策？数据团队第一个不同意！",
        "bgGradient": "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
        "video_prompt": "A stylish young Asian female protagonist facing camera, 9:16 vertical smartphone format, clearly opening her mouth to speak the English dialogue lines with lively lip movements and natural expressions. Calm atmospheric lighting, photorealistic vlog style, no subtitles/watermark. 此视频只保留清晰的英文对白人声与微弱环境音，不需要喧闹背景音乐。【声音】年轻知性女性清晰纯正的英文口语发音、说话人声对白清晰突出、无大声背景音乐。",
        "words": [
            {
                "id": "vw_gen_1",
                "word": "rely on",
                "phonetic": "",
                "pos": "n.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "依靠;依赖",
                "collocation": "essential collocation for rely on",
                "quote": "Cambridge IELTS sample for rely on.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 rely on 更显地道！"
            },
            {
                "id": "vw_gen_2",
                "word": "domestic",
                "phonetic": "/dəˈmestɪk/",
                "pos": "adj.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "家庭的；国内的",
                "collocation": "essential collocation for domestic",
                "quote": "Cambridge IELTS sample for domestic.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 domestic 更显地道！"
            },
            {
                "id": "vw_gen_3",
                "word": "measure",
                "phonetic": "/ˈmeʒər/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "测量",
                "collocation": "essential collocation for measure",
                "quote": "Cambridge IELTS sample for measure.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 measure 更显地道！"
            }
        ],
        "quickQuiz": {
            "question": "在本条情境中，雅思学术场景使用 'rely on' 的最佳语境是？",
            "options": [
                "A. 表达 依靠;依赖",
                "B. 极端情绪宣泄，不宜用于学术",
                "C. 仅限于非正式口语缩写",
                "D. 完全无关的混淆选项"
            ],
            "answer": 0,
            "tip": "rely on 是雅思真题极高频考词，搭配准确即可显著提升 Lexical Resource 分数！"
        },
        "subtitles": [
            {
                "start": 0.0,
                "end": 5.0,
                "en": "Our team cannot solely rely on domestic market trends.",
                "zh": "我们的团队不能仅仅依靠国内市场的发展趋势。"
            },
            {
                "start": 5.0,
                "end": 10.0,
                "en": "We took every strict measure to evaluate user feedback,",
                "zh": "我们采取了一切严密措施来评估用户反馈，"
            },
            {
                "start": 10.0,
                "end": 15.0,
                "en": "because smart data is key to measuring real success!",
                "zh": "因为智能数据才是衡量真正成功的关键！"
            }
        ]
    },
    {
        "id": "vid_20261017_04",
        "genre": "skit",
        "genreTag": "职场脑洞",
        "genreColor": "#ec4899",
        "title": "给智能吉祥物造词，假笑惊呆评审",
        "poster": "lingo/assets/vlog-clean.png",
        "videoUrl": "lingo/assets/videos/vid_20261017_04.mp4",
        "author": "@Yup_LifeDiary",
        "currentStepText": "4 / 6",
        "subtitleEn": "I had to coin a brand new trait for our AI mascot, but its artificial grin really made the whole board nervous!",
        "subtitleZh": "我不得不为我们的智能吉祥物创造一个全新特质，但它的假笑让整个董事会心里发毛！",
        "humorousLine": "它一笑，全场温度瞬间下降五度。",
        "bgGradient": "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
        "video_prompt": "Cinematic 9:16 vertical smartphone format prompt for ComfyUI MiniMax H3, workplace comedy skit. A beautiful young Asian female protagonist with stylish wavy hair, elegant features, and a modern creative-office outfit stands in a bright product review room, facing a large screen showing an AI mascot with a fake grin. She speaks the English dialogue clearly with lively lip movements, expressive eyes, and a witty confident expression. Only one female character is present, no male character. Cinematic lighting, realistic texture, shallow depth of field, no subtitles, no watermark. 此视频只保留清晰的英文对白人声与微弱环境音，不需要喧闹背景音乐。【声音】年轻知性女性清晰纯正的英文口语发音、说话人声对白清晰突出、无大声背景音乐。",
        "words": [
            {
                "word": "trait",
                "phonetic": "/treɪt/",
                "pos": "n.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "特性；特征",
                "collocation": "personality trait (性格特征)",
                "endingSummary": "主角结语：口语里用 trait 描述人或产品的稳定特点，比 feature 更有观察感。"
            },
            {
                "word": "coin",
                "phonetic": "/kɔɪn/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "创造；生造（词、短语、说法）",
                "collocation": "coin a phrase (创造一个短语)",
                "endingSummary": "主角结语：用 coin a phrase/term 能体现词汇创造力，适合学术与职场话题。"
            },
            {
                "word": "artificial",
                "phonetic": "/ˌɑːtɪˈfɪʃl/",
                "pos": "adj.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "仿造的；人工的；不自然的",
                "collocation": "artificial smile (假笑)",
                "endingSummary": "主角结语：artificial 可说人工物，也可形容不自然表现，注意语境切换。"
            }
        ],
        "quickQuiz": {
            "question": "视频中，主角需要为智能吉祥物 coin 什么？",
            "options": [
                "A. a new trait",
                "B. a new logo",
                "C. a new slogan",
                "D. a new app"
            ],
            "answer": 0,
            "tip": "coin 在这里是动词“创造、生造”，常与 phrase、term、word 搭配；视频里她创造的是新 trait。"
        },
        "subtitles": [
            {
                "start": 0.0,
                "end": 7.0,
                "en": "I had to coin a brand new trait for our AI mascot,",
                "zh": "我不得不为我们的智能吉祥物创造一个全新特质，"
            },
            {
                "start": 7.0,
                "end": 15.0,
                "en": "but its artificial grin made the whole board nervous!",
                "zh": "但它的假笑让整个董事会心里发毛！"
            }
        ]
    },
    {
        "id": "vid_20261017_05",
        "genre": "workplace",
        "genreTag": "职场乌龙",
        "genreColor": "#8b5cf6",
        "title": "《会议室里的爆笑对话：你真的很像我前领导》",
        "poster": "lingo/assets/vlog-clean.png",
        "videoUrl": "lingo/assets/videos/vid_20261017_05.mp4",
        "author": "@Yup_LifeDiary",
        "currentStepText": "5 / 6",
        "subtitleEn": "A witty comment prompted an awkward laugh across the table. During our exchange, I said he resembles my former boss, but mutual trust underlies our great teamwork!",
        "subtitleZh": "会议室里一句幽默发言促成了一阵尴尬的笑声。在交流中我脱口而出说他像我前领导，不过彼此信任才是高效协作的基础！",
        "humorousLine": "领导：“那我俩到底谁比较帅？” 全场沉默了。",
        "bgGradient": "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
        "video_prompt": "A stylish young Asian female protagonist facing camera, 9:16 vertical smartphone format, clearly opening her mouth to speak the English dialogue lines with lively lip movements and natural expressions. Calm atmospheric lighting, photorealistic vlog style, no subtitles/watermark. 此视频只保留清晰的英文对白人声与微弱环境音，不需要喧闹背景音乐。【声音】年轻知性女性清晰纯正的英文口语发音、说话人声对白清晰突出、无大声背景音乐。",
        "words": [
            {
                "id": "vw_gen_1",
                "word": "prompt",
                "phonetic": "/prɑːmpt/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "促进;激起",
                "collocation": "essential collocation for prompt",
                "quote": "Cambridge IELTS sample for prompt.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 prompt 更显地道！"
            },
            {
                "id": "vw_gen_2",
                "word": "exchange",
                "phonetic": "/ɪksˈtʃeɪndʒ/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "交换",
                "collocation": "essential collocation for exchange",
                "quote": "Cambridge IELTS sample for exchange.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 exchange 更显地道！"
            },
            {
                "id": "vw_gen_3",
                "word": "underlie",
                "phonetic": "/ˌʌndərˈlaɪ/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "成为.….基础",
                "collocation": "essential collocation for underlie",
                "quote": "Cambridge IELTS sample for underlie.",
                "endingSummary": "主角结语：在雅思口语与大作文中使用 underlie 更显地道！"
            }
        ],
        "quickQuiz": {
            "question": "在本条情境中，雅思学术场景使用 'prompt' 的最佳语境是？",
            "options": [
                "A. 表达 促进;激起",
                "B. 极端情绪宣泄，不宜用于学术",
                "C. 仅限于非正式口语缩写",
                "D. 完全无关的混淆选项"
            ],
            "answer": 0,
            "tip": "prompt 是雅思真题极高频考词，搭配准确即可显著提升 Lexical Resource 分数！"
        },
        "subtitles": [
            {
                "start": 0.0,
                "end": 4.5,
                "en": "A witty comment prompted an awkward laugh across the table.",
                "zh": "会议室里一句幽默发言促成了一阵尴尬的笑声。"
            },
            {
                "start": 4.5,
                "end": 9.5,
                "en": "During our exchange, I said he resembles my former boss,",
                "zh": "在交流中我脱口而出说他像我前领导，"
            },
            {
                "start": 9.5,
                "end": 15.0,
                "en": "but mutual trust underlies our great teamwork!",
                "zh": "不过彼此信任才是高效协作的基础！"
            }
        ]
    },
    {
        "id": "vid_20261017_06",
        "genre": "workplace",
        "genreTag": "职场反转",
        "genreColor": "#10b981",
        "title": "《会议室里被质问“忽视邮件”，她一句话逆转》",
        "poster": "lingo/assets/vlog-clean.png",
        "videoUrl": "lingo/assets/videos/vid_20261017_06.mp4",
        "author": "@Yup_LifeDiary",
        "currentStepText": "6 / 6",
        "subtitleEn": "When my boss asked why I ignored her urgent email, I calmly explained that I resolved the client crisis first!",
        "subtitleZh": "当老板质问我为什么没理会她的紧急邮件时，我冷静解释，我已经第一时间解决了客户的危机！",
        "humorousLine": "老板放下了手里的咖啡：“干得漂亮，年终奖加倍。”",
        "bgGradient": "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
        "video_prompt": "Cinematic 9:16 vertical smartphone format prompt for ComfyUI MiniMax H3, workplace drama: a beautiful young Asian female protagonist with stylish elegant wavy hair, expressive eyes and delicate facial features, wearing a tailored modern blazer, standing alone in a bright glass meeting room, speaking directly to camera with natural vivid lip movements, calm confident expression, subtle hand gesture, cinematic soft office lighting, realistic texture, shallow depth of field, no subtitles, no watermark. 此视频只保留清晰的英文对白人声与微弱环境音，不需要喧闹背景音乐。【声音】年轻知性女性清晰纯正的英文口语发音、说话人声对白清晰突出、无大声背景音乐。",
        "words": [
            {
                "word": "ignore",
                "phonetic": "/ɪɡˈnɔːr/",
                "pos": "v.",
                "band": "7.0",
                "stars": 5,
                "meaningZh": "忽视；不顾",
                "collocation": "ignore an email (忽视邮件)",
                "endingSummary": "主角结语：口语中用 ignore 表达“故意不理”，再补 because 原因，逻辑更完整。"
            }
        ],
        "quickQuiz": {
            "question": "视频中老板质疑女主角“忽视邮件”，她给出的解释是什么？",
            "options": [
                "A. 她优先处理了客户危机",
                "B. 她没看到邮件",
                "C. 她故意不回复",
                "D. 她发错了对象"
            ],
            "answer": 0,
            "tip": "ignore 常接 email/warning/suggestion，表示故意不理睬；口语中可用 because 解释原因。"
        },
        "subtitles": [
            {
                "start": 0.0,
                "end": 7.0,
                "en": "When my boss asked why I ignored her urgent email,",
                "zh": "当老板质问我为什么没理会她的紧急邮件时，"
            },
            {
                "start": 7.0,
                "end": 15.0,
                "en": "I calmly explained that I resolved the client crisis first!",
                "zh": "我冷静解释，我已经第一时间解决了客户的危机！"
            }
        ]
    }
],

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
        "id": "gp_20261017_01",
        "word": "resemble",
        "phonetic": "/ˈrɪˈzemb(ə)l/",
        "pos": "v.",
        "meaningZh": "像，与……相似",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_resemble_1.png",
                "caption": "典型符合 resemble 的真实学习情境",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_resemble_2.png",
                "caption": "完全无关的对照干扰日常情境",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_resemble_3.png",
                "caption": "高分考点搭配应用情境",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_resemble_4.png",
                "caption": "含义相反或冲突的反义情境",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】掌握 resemble（像，与……相似）在真实语境中的搭配与考点。",
        "ieltsQuote": "Cambridge IELTS Academic Sample: Mastering resemble significantly enhances lexical resource."
    },
    {
        "id": "gp_20261017_02",
        "word": "recognize",
        "phonetic": "/ˈrekəɡnaɪz/",
        "pos": "v.",
        "meaningZh": "认出;识别；承认",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_recognize_1.png",
                "caption": "图1：年轻女性在咖啡馆里突然认出老朋友，微笑挥手。",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_recognize_2.png",
                "caption": "图2：年轻女性在书桌前记笔记学习，没有认出或识别的动作。",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_recognize_3.png",
                "caption": "图3：女医生在诊室里识别出熟悉的皮肤特征。",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_recognize_4.png",
                "caption": "图4：职业女性在会议讲台前做演讲，没有认出或识别的情境。",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】recognize 由 re-（再次）+ cogn-（知道）+ -ize 构成，核心含义是“再次知道”，因此常表示从记忆中认出某人或某物，也指识别出某种特征、模式或事实。图1中女性在咖啡馆里突然认出老朋友，属于典型的“认出”；图3中女医生从皮肤特征中识别出熟悉的病症，属于“识别”。图2只是学习记笔记，图4只是做演讲，都没有“从记忆中辨认或识别”的关键动作，因此不选。",
        "ieltsQuote": "The survey found that many people can recognize the early symptoms of stress before they become serious."
    },
    {
        "id": "gp_20261017_03",
        "word": "adjust",
        "phonetic": "/əˈdʒʌst/",
        "pos": "v.",
        "meaningZh": "调整;使适合",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_adjust_1.png",
                "caption": "图1：职业女性在办公室微调笔记本电脑支架高度",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_adjust_2.png",
                "caption": "图2：女性在家修理损坏的椅子腿",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_adjust_3.png",
                "caption": "图3：母亲在公园调整婴儿车遮阳篷和安全带",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_adjust_4.png",
                "caption": "图4：女性用刮水器清洁玻璃窗",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】adjust 由 ad-（朝向）与 just（合适、恰当）构成，核心含义是“使某物变得合适或恰当”，常见于微调设备、安排、习惯或身体状态。图1中职业女性微调电脑支架高度，图3中母亲调整婴儿车遮阳篷和安全带，都体现“调整到合适状态”；图2修理损坏椅子腿属于 repair，图4擦玻璃属于 clean，均不是 adjust。",
        "ieltsQuote": "It is important for students to adjust their study habits when they transition from high school to university."
    },
    {
        "id": "gp_20261017_04",
        "word": "approach",
        "phonetic": "/əˈproʊtʃ/",
        "pos": "n.",
        "meaningZh": "方法",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_approach_1.png",
                "caption": "职业女性用便签序列规划解决问题的步骤方法",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_approach_2.png",
                "caption": "女子走近玻璃入口，表示物理上的靠近而非方法",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_approach_3.png",
                "caption": "母女用空白卡片整理学习步骤，体现一种学习方法",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_approach_4.png",
                "caption": "职业女性走向电梯，表示接近某处而非方法",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】approach 作名词可表示“方法、策略”，词源含“靠近、处理”的意味，引申为面对问题时的处理方式。图1职业女性用便签序列规划步骤，图3母女用卡片整理学习法，均体现“方法”；图2女子走近入口、图4职业女性走向电梯，只是物理上的“接近”，不是本题词义，因此不选。",
        "ieltsQuote": "A practical approach to solving this problem would be to first identify the underlying causes before proposing solutions."
    },
    {
        "id": "gp_20261017_05",
        "word": "fundamental",
        "phonetic": "/ˌfʌndəˈmentl/",
        "pos": "adj.",
        "meaningZh": "基本的;基础的",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_fundamental_1.png",
                "caption": "稳固地基，代表“基础”。",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_fundamental_2.png",
                "caption": "学习基本功，代表“基本要素”。",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_fundamental_3.png",
                "caption": "金融资金，易混淆但不是“基础”。",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_fundamental_4.png",
                "caption": "额外装饰，表示“非基本/附加”。",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】词根与情境解析：fund- 有“底部、基础”之意，fundamental 表示“基本的、基础的”，强调事物最底层、最核心的部分。图1是建筑地基，图2是学习中的基本工具，都体现“基础、根本”；图3是资金/基金，容易因 fund 混淆，但不表示“基础”；图4是额外装饰和附加物品，强调“非基本、可有可无”，因此不选。",
        "ieltsQuote": "In IELTS Writing Task 2, a fundamental skill is to state a clear position and develop it with relevant examples."
    },
    {
        "id": "gp_20261017_06",
        "word": "rely on",
        "phonetic": "",
        "pos": "n.",
        "meaningZh": "依靠;依赖",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_rely on_1.png",
                "caption": "老人依靠拐杖在雨中稳步前行",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_rely on_2.png",
                "caption": "年轻人把拐杖放在一旁，独自站立",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_rely on_3.png",
                "caption": "登山者依靠安全绳攀爬岩壁",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_rely on_4.png",
                "caption": "办公室员工拒绝同事递来的帮助",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】rely on 表示“依靠、依赖”，强调需要借助人或物来获得支持、完成事情。图1老人依靠拐杖行走，图3登山者依靠安全绳攀登，都体现“借助外力或工具”；图2独自站立、图4拒绝帮助，则偏向“独立”或“不依赖”，与 rely on 不符。记忆：rely 有“信赖、指望”之意，on 指向所依靠的对象，如 rely on a cane / rely on a rope / rely on others。",
        "ieltsQuote": "Many students tend to rely on memorization rather than developing critical thinking skills."
    },
    {
        "id": "gp_20261017_07",
        "word": "domestic",
        "phonetic": "/dəˈmestɪk/",
        "pos": "adj.",
        "meaningZh": "家庭的；国内的",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_domestic_1.png",
                "caption": "典型符合 domestic 的真实学习情境",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_domestic_2.png",
                "caption": "完全无关的对照干扰日常情境",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_domestic_3.png",
                "caption": "高分考点搭配应用情境",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_domestic_4.png",
                "caption": "含义相反或冲突的反义情境",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】掌握 domestic（家庭的；国内的）在真实语境中的搭配与考点。",
        "ieltsQuote": "Cambridge IELTS Academic Sample: Mastering domestic significantly enhances lexical resource."
    },
    {
        "id": "gp_20261017_08",
        "word": "measure",
        "phonetic": "/ˈmeʒər/",
        "pos": "v.",
        "meaningZh": "测量",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_measure_1.png",
                "caption": "用卷尺测量桌面宽度",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_measure_2.png",
                "caption": "用手比划估算房间高度",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_measure_3.png",
                "caption": "用量杯测量液体容量",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_measure_4.png",
                "caption": "用放大镜观察叶片纹理",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】measure 的核心含义是“测量”，强调用工具、刻度或标准来量化长度、容量、重量、程度等。图1中卷尺拉直测量桌面宽度，图3中量杯通过刻度线测量液体容量，都体现“量化读数”的测量行为，因此正确。图2只是用手比划、目测估算高度，没有工具或刻度；图4是用放大镜观察叶片纹理，属于观察而非测量，因此不选。词根 meas- 与“量”相关，常见搭配有 measure length（测量长度）、measure volume（测量体积）、measure the impact（衡量影响）。",
        "ieltsQuote": "The researchers used a standardised scale to measure participants' levels of anxiety before and after the interview."
    },
    {
        "id": "gp_20261017_09",
        "word": "trait",
        "phonetic": "/treɪt/",
        "pos": "n.",
        "meaningZh": "特性;特征",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_trait_1.png",
                "caption": "指纹是每个人的独特生物特征",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_trait_2.png",
                "caption": "泥地上的脚印只留下痕迹",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_trait_3.png",
                "caption": "孩子继承了父母的遗传特征",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_trait_4.png",
                "caption": "火车在铁轨上行驶",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】trait 表示“特性、特征”，可记作“从一个人或事物身上稳定显露出来的特点”。图1指纹是独一无二的生物特征，符合 trait；图2泥地脚印只是“痕迹 trace”，不是 trait；图3孩子与父母五官相似，体现遗传特征或性格特征，符合 trait；图4火车 train 是交通工具，与 trait 拼写相近但意义不同，排除。",
        "ieltsQuote": "Cambridge IELTS sample: One of the defining traits of a good leader is the ability to listen to others."
    },
    {
        "id": "gp_20261017_10",
        "word": "coin",
        "phonetic": "/kɔɪn/",
        "pos": "v.",
        "meaningZh": "创造",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_coin_1.png",
                "caption": "典型符合 coin 的真实学习情境",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_coin_2.png",
                "caption": "完全无关的对照干扰日常情境",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_coin_3.png",
                "caption": "高分考点搭配应用情境",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_coin_4.png",
                "caption": "含义相反或冲突的反义情境",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】掌握 coin（创造）在真实语境中的搭配与考点。",
        "ieltsQuote": "Cambridge IELTS Academic Sample: Mastering coin significantly enhances lexical resource."
    },
    {
        "id": "gp_20261017_11",
        "word": "artificial",
        "phonetic": "/ˌɑːrtɪˈfɪʃ(ə)l/",
        "pos": "adj.",
        "meaningZh": "仿造的",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_artificial_1.png",
                "caption": "图1：一束精致的人造花，花瓣由丝绸制成，放在客厅茶几上。",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_artificial_2.png",
                "caption": "图2：一朵天然玫瑰，花瓣上有露珠，生长在花园中。",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_artificial_3.png",
                "caption": "图3：一块平整的人造草坪，草丝整齐，带有合成纤维质感。",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_artificial_4.png",
                "caption": "图4：一片自然生长的真实草坪，草叶高低不一，夹杂泥土和小花。",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】artificial 来自拉丁语 artifex（手工艺者），核心含义是“人工的、仿造的”。图1是丝绸假花，图3是合成纤维人造草坪，都强调非天然、人工仿制，因此符合；图2是天然玫瑰，图4是自然生长的真草坪，强调真实自然，因此不符合。记忆联想：art（艺术/手艺）+ -ificial（做出来）→ 像手艺做出来的仿制品。",
        "ieltsQuote": "The rapid growth of artificial intelligence has transformed many aspects of modern work and education."
    },
    {
        "id": "gp_20261017_12",
        "word": "prompt",
        "phonetic": "/prɑːmpt/",
        "pos": "v.",
        "meaningZh": "促进;激起",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_prompt_1.png",
                "caption": "老师提出开放性问题，激起学生积极思考和讨论",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_prompt_2.png",
                "caption": "医生提醒患者按时服药，表示提示或提醒",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_prompt_3.png",
                "caption": "政策与投资促进新能源项目发展",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_prompt_4.png",
                "caption": "经理看表催促会议开始，表示催促或立即",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】prompt 在本题中表示“促进、激起”，强调推动某事发生或激发某种反应。图1中老师提问激起学生讨论，图3中政策与投资促进新能源发展，均符合目标词义。图2是医生提醒患者服药，偏向“提示、提醒”；图4是经理看表催促会议开始，偏向“催促、立即”，都不是“促进、激起”，因此不选。记忆时可以把 prompt 理解为“向前推一把”：老师推一把思维，政策推一把发展。",
        "ieltsQuote": "A well-designed question can prompt students to think critically and express their opinions clearly."
    },
    {
        "id": "gp_20261017_13",
        "word": "exchange",
        "phonetic": "/ɪksˈtʃeɪndʒ/",
        "pos": "v.",
        "meaningZh": "交换",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_exchange_1.png",
                "caption": "两人在市集上互换手工陶罐与编织篮",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_exchange_2.png",
                "caption": "一人将礼物递给另一人，表达赠送而非互换",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_exchange_3.png",
                "caption": "两人在街头交换不同国家纸币",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_exchange_4.png",
                "caption": "博物馆展柜中陈列文物，观众观看，不是交换",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】exchange 的核心是“双方互换”：图1中两人互换物品，图3中两人互换纸币，都体现“你给一点，我给一点”的双向交换；图2是单向赠送，图4是单向展示，都没有“互换”关系。词根 ex- 表示“向外”，change 表示“改变、转换”，合起来就是“把东西、信息或货币从一方转到另一方”。常见搭配：exchange ideas 交换想法，exchange gifts 交换礼物，exchange currency 兑换货币，exchange information 交换信息。",
        "ieltsQuote": "Students often exchange notes before an exam to make sure they have covered all the key points."
    },
    {
        "id": "gp_20261017_14",
        "word": "underlie",
        "phonetic": "/ˌʌndərˈlaɪ/",
        "pos": "v.",
        "meaningZh": "成为.….基础",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_underlie_1.png",
                "caption": "图1：地下岩层托起整座桥梁，成为其稳固基础。",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_underlie_2.png",
                "caption": "图2：行人站在雨伞下避雨，只是处于下方位置。",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_underlie_3.png",
                "caption": "图3：根系在地下交织成网，成为大树生长的基础。",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_underlie_4.png",
                "caption": "图4：毯子覆盖在旧椅子上，只是遮盖表面。",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】underlie = under + lie，字面可理解为“躺在下面”，在雅思语境中常引申为“构成……的基础、是……的根本原因”。图1中地下岩层托起桥梁，图3中根系支撑大树，都体现“在底层成为基础”的核心含义；图2只是站在伞下，表示位置上的 under；图4只是用毯子覆盖椅子，表示遮盖 cover，均不符合 underlie。记忆要点：underlie 不是简单的“在下面”，而是“在下方支撑、成为基础”。",
        "ieltsQuote": "The report argues that the economic pressures underlie the decline in public trust, although the evidence remains inconclusive."
    },
    {
        "id": "gp_20261017_15",
        "word": "ignore",
        "phonetic": "/ɪɡˈnɔːr/",
        "pos": "v.",
        "meaningZh": "忽视;不顾",
        "band": "7.0",
        "instruction": "选出所有符合它的图（可多选）",
        "images": [
            {
                "url": "lingo/assets/guess_ignore_1.png",
                "caption": "典型符合 ignore 的真实学习情境",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_ignore_2.png",
                "caption": "完全无关的对照干扰日常情境",
                "isCorrect": false
            },
            {
                "url": "lingo/assets/guess_ignore_3.png",
                "caption": "高分考点搭配应用情境",
                "isCorrect": true
            },
            {
                "url": "lingo/assets/guess_ignore_4.png",
                "caption": "含义相反或冲突的反义情境",
                "isCorrect": false
            }
        ],
        "correctIndices": [
            0,
            2
        ],
        "mnemonic": "【四图情境解析】掌握 ignore（忽视;不顾）在真实语境中的搭配与考点。",
        "ieltsQuote": "Cambridge IELTS Academic Sample: Mastering ignore significantly enhances lexical resource."
    }
],

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
