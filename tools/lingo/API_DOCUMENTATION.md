# Lingo 雅思伴学 API 接口规范文档

版本：`v1.0.0`  
基准地址（Base URL）：`http://127.0.0.1:8080/api/v1`（可在 `tools/lingo/config.json` 中配置修改）  
数据交互格式：`application/json; charset=utf-8`  
认证机制：`Authorization: Bearer <token>`（可选，本地开发或访客体验模式可免认证）

---

## 1. 规范约定与通用响应结构

所有 HTTP 接口成功或业务失败均返回标准 JSON 结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1729053220000
}
```

### 通用状态码（Status Codes）
| 状态码 | 含义说明 |
| :--- | :--- |
| `200` | 请求成功 |
| `400` | 客户端参数错误（缺少必填字段或数据校验不通过） |
| `401` | 未授权或令牌已过期 |
| `404` | 请求资源不存在（如视频、文章或生词不存在） |
| `429` | 请求频次超限（AI 测评或发音分析接口限制） |
| `500` | 服务端内部异常 |

---

## 2. 用户与学习目标设置 API

### 2.1 获取用户学习配置与目标
- **请求方式**：`GET`
- **路径**：`/user/profile`
- **响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "usr_9527",
    "nickname": "Yup",
    "avatar": "lingo/assets/avatar.png",
    "targetBand": 6.5,
    "currentLevel": "大学英语四级",
    "interestedDomains": ["ai", "tech", "business", "psychology"],
    "dailyMinutes": 15,
    "dailyWordTarget": 20,
    "defaultReadingDifficulty": "standard",
    "streakDays": 3,
    "createdAt": "2026-10-16T08:00:00Z"
  }
}
```

### 2.2 更新/保存用户 3 步初始化目标（Onboarding）
- **请求方式**：`POST`
- **路径**：`/user/goals`
- **请求体（JSON）**：
```json
{
  "targetBand": 6.5,
  "currentLevel": "大学英语四级",
  "interestedDomains": ["ai", "tech", "psychology", "travel"],
  "dailyMinutes": 15,
  "dailyWordTarget": 20,
  "defaultReadingDifficulty": "standard"
}
```
- **字段校验**：
  - `targetBand`：浮点数，范围 `5.0` ~ `9.0`，步长 `0.5`
  - `currentLevel`：枚举，如 `大学英语四级`、`大学英语六级`、`雅思 5.5`、`雅思 6.5`
  - `interestedDomains`：数组，支持 `ai`、`tech`、`business`、`psychology`、`travel`、`society`、`nature`
  - `dailyMinutes`：整数，如 `15`、`30`、`45`、`60`
  - `dailyWordTarget`：整数，范围 `10` ~ `100`
  - `defaultReadingDifficulty`：`easy` | `standard` | `ielts` | `challenge`
- **响应示例**：
```json
{
  "code": 200,
  "message": "学习目标更新成功",
  "data": {
    "updatedAt": "2026-10-16T12:30:00Z",
    "goals": {
      "targetBand": 6.5,
      "dailyMinutes": 15,
      "dailyWordTarget": 20
    }
  }
}
```

---

## 3. 「刷一刷」短视频流 API（Watch Feed）

### 3.1 获取今日推荐短视频列表
- **请求方式**：`GET`
- **路径**：`/feed/videos`
- **查询参数**：
  - `category`（可选）：`vlog` | `skit`（抽象短剧）| `science`（科普趣味）
  - `targetBand`（可选）：默认按用户配置，如 `6.5`
  - `limit`（可选）：默认 `6`
- **响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 6,
    "currentIndex": 1,
    "videos": [
      {
        "id": "vid_01",
        "title": "咖啡依赖者的自白与晨间仪式",
        "category": "vlog",
        "categoryLabel": "Vlog",
        "coverUrl": "lingo/assets/shot-vlog.png",
        "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-down-a-cozy-street-34533-large.mp4",
        "durationSeconds": 45,
        "author": "Yup & Lingo Studio",
        "subtitles": [
          {
            "startMs": 0,
            "endMs": 2800,
            "en": "My daily routine? Coffee first.",
            "zh": "我的日常习惯？先喝咖啡。"
          },
          {
            "startMs": 2800,
            "endMs": 5600,
            "en": "Drank a double espresso, but why am I still in fatigue?",
            "zh": "喝了双倍浓缩，怎么还是满脸困意？"
          },
          {
            "startMs": 5600,
            "endMs": 9200,
            "en": "Caffeine acts as a stimulant to block adenosine receptors.",
            "zh": "咖啡因作为兴奋剂，会阻断腺苷受体以延缓疲倦。"
          }
        ],
        "words": [
          {
            "id": "w_01",
            "word": "routine",
            "phonetic": "/ruːˈtiːn/",
            "pos": "n. / adj.",
            "meaningZh": "日常习惯，常规程序；例行的",
            "band": 6.0,
            "examFrequency": 5,
            "collocation": "daily routine, break the routine",
            "actorEndingSummary": "主角结语：雅思口语 Part 1 常考日常作息话题，记住 'daily routine' 远比单一使用 'habit' 更具学术与生活感！"
          },
          {
            "id": "w_02",
            "word": "fatigue",
            "phonetic": "/fəˈtiːɡ/",
            "pos": "n.",
            "meaningZh": "极度疲倦，筋疲力尽",
            "band": 7.0,
            "examFrequency": 4,
            "collocation": "chronic fatigue, mental fatigue",
            "actorEndingSummary": "主角结语：写作中替代 'tiredness' 的 7 分神词，常搭配 chronic（慢性的）或 mental（心理的）使用。"
          },
          {
            "id": "w_03",
            "word": "stimulant",
            "phonetic": "/ˈstɪmjələnt/",
            "pos": "n.",
            "meaningZh": "兴奋剂，刺激物",
            "band": 7.5,
            "examFrequency": 4,
            "collocation": "act as a stimulant to...",
            "actorEndingSummary": "主角结语：大作文常考科技与医疗话题，咖啡、能量饮料都可以被归为 'mild stimulant'（温和刺激物）。"
          }
        ],
        "quiz": {
          "question": "Which word best replaces 'extreme tiredness' in academic writing?",
          "options": ["A. fatigue", "B. routine", "C. stimulant", "D. recreation"],
          "answerIndex": 0,
          "explanation": "fatigue 是雅思阅读和写作中形容身体或精神极度疲倦的高级词汇。"
        }
      }
    ]
  }
}
```

### 3.2 提交发音跟读（AI 评测）
- **请求方式**：`POST`
- **路径**：`/ai/speech-evaluate`
- **请求体（FormData 或 JSON）**：
```json
{
  "targetWord": "fatigue",
  "targetSentence": "Drank a double espresso, but why am I still in fatigue?",
  "audioBase64": "data:audio/wav;base64,UklGRi...",
  "durationMs": 3200
}
```
- **响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "overallScore": 88,
    "accuracy": 92,
    "fluency": 85,
    "stressScore": 87,
    "phonemesFeedback": [
      { "phoneme": "/fə/", "status": "accurate" },
      { "phoneme": "/ˈtiːɡ/", "status": "accurate" }
    ],
    "suggestion": "发音饱满，第二音节重音准确！"
  }
}
```

---

## 4. 「看一看」20 大高频外刊精读 API（Read Articles）

### 4.1 获取精选刊物列表与文章
- **请求方式**：`GET`
- **路径**：`/reading/articles`
- **查询参数**：
  - `domains`（可选）：逗号分隔，如 `ai,tech,business`
  - `difficulty`（可选）：`easy` | `standard` | `ielts` | `challenge`
  - `publication`（可选）：`economist` | `bbc` | `nature` 等
- **支持的 20 个高频外刊清单**：
  1. `The Economist`（经济学人）
  2. `BBC News`（英国广播公司）
  3. `Nature`（自然杂志）
  4. `National Geographic`（国家地理）
  5. `The Guardian`（卫报）
  6. `Scientific American`（科学美国人）
  7. `Financial Times`（英国金融时报）
  8. `The Atlantic`（大西洋月刊）
  9. `The New Yorker`（纽约客）
  10. `TIME`（时代周刊）
  11. `New Scientist`（新科学家）
  12. `The Wall Street Journal`（华尔街日报）
  13. `Smithsonian Magazine`（史密森尼杂志）
  14. `The New York Times`（纽约时报）
  15. `Psychology Today`（今日心理学）
  16. `Harvard Business Review`（哈佛商业评论）
  17. `MIT Technology Review`（麻省理工科技评论）
  18. `WIRED`（连线）
  19. `The Spectator`（旁观者）
  20. `Discovery`（探索发现）
- **响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 5,
    "articles": [
      {
        "id": "art_101",
        "title": "How Artificial Intelligence is Reshaping Cognitive Work",
        "publication": "MIT Technology Review",
        "domain": "ai",
        "readMinutes": 6,
        "difficulty": "standard",
        "targetBand": 6.5,
        "summary": "AI 工具不再仅仅是自动化生产力的辅助品，它正在深层改变人类知识工作者的思维结构与创造边界。",
        "keywords": ["cognitive", "paradigm", "prevalent", "autonomous"],
        "coverUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
}
```

### 4.2 获取文章详情与考频词/长难句分词数据
- **请求方式**：`GET`
- **路径**：`/reading/articles/:id`
- **响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "art_101",
    "title": "How Artificial Intelligence is Reshaping Cognitive Work",
    "publication": "MIT Technology Review",
    "publishDate": "2026-10-15",
    "difficulty": "standard",
    "contentParagraphs": [
      "In the modern workspace, the integration of [[autonomous|w_101]] systems is sparking a profound [[paradigm|w_102]] shift.",
      "Researchers argue that rather than rendering humans obsolete, AI fosters [[cognitive|w_103]] equilibrium when utilized properly."
    ],
    "annotations": {
      "w_101": {
        "word": "autonomous",
        "phonetic": "/ɔːˈtɒnəməs/",
        "meaningZh": "自治的，自主的，自动运行的",
        "band": 7.5,
        "examStars": 5,
        "replacement": "independent, self-governing",
        "ieltsQuote": "Cambridge 15 Test 3: ...the development of autonomous vehicles."
      },
      "w_102": {
        "word": "paradigm",
        "phonetic": "/ˈpærədaɪm/",
        "meaningZh": "范式，典范，认知框架",
        "band": 8.0,
        "examStars": 5,
        "replacement": "model, framework, pattern",
        "ieltsQuote": "Cambridge 14 Test 2: A new paradigm has emerged in environmental studies."
      }
    },
    "syntaxHints": [
      {
        "sentenceIndex": 1,
        "structure": "主谓分隔宾语从句",
        "breakdown": "Researchers argue [that rather than doing A (状语插入), AI fosters cognitive equilibrium (主干宾语)]"
      }
    ]
  }
}
```

---

## 5. 「猜一猜」图像记忆单词 API（Guess & Visual Puzzles）

### 5.1 获取今日 20 组四宫格猜词题库
- **请求方式**：`GET`
- **路径**：`/guess/daily`
- **响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "date": "2026-10-16",
    "totalPuzzles": 20,
    "puzzles": [
      {
        "id": "gz_01",
        "themeHint": "形容面对堆积如山的事情却忍不住打开手机的行为",
        "images": [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
        ],
        "imageLabels": [
          "闹钟响了三次还起不来",
          "桌面文档堆到后天",
          "熟人聚会还在偷偷刷短视频",
          "Deadline 倒计时还剩下 2 小时"
        ],
        "letterClues": "P _ _ C _ _ S T _ N _ T _",
        "options": ["Procrastinate", "Ponder", "Precede", "Persevere"],
        "correctWord": "Procrastinate",
        "phonetic": "/prəˈkræstɪneɪt/",
        "meaningZh": "v. 拖延，耽搁",
        "mnemonic": "词根记忆：pro (向前) + cras (明日) + tinate -> 永远推到明天再做！",
        "band": 7.0
      }
    ]
  }
}
```

### 5.2 验证猜词答案
- **请求方式**：`POST`
- **路径**：`/guess/verify`
- **请求体（JSON）**：
```json
{
  "puzzleId": "gz_01",
  "selectedWord": "Procrastinate",
  "timeSpentSeconds": 6
}
```
- **响应示例**：
```json
{
  "code": 200,
  "message": "回答正确",
  "data": {
    "isCorrect": true,
    "pointsAwarded": 10,
    "currentStreak": 4,
    "word": "Procrastinate",
    "autoSavedToVocab": false
  }
}
```

---

## 6. 生词本与每日统计 API（Vocabulary & Stats）

### 6.1 获取生词本列表
- **请求方式**：`GET`
- **路径**：`/vocab/list`
- **响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 12,
    "unreviewedCount": 3,
    "list": [
      {
        "id": "w_01",
        "word": "routine",
        "phonetic": "/ruːˈtiːn/",
        "meaningZh": "日常习惯，常规程序",
        "source": "刷一刷 · 咖啡依赖者",
        "addedAt": "2026-10-16T09:41:00Z",
        "reviewStage": 1
      }
    ]
  }
}
```

### 6.2 加入生词本
- **请求方式**：`POST`
- **路径**：`/vocab/add`
- **请求体（JSON）**：
```json
{
  "word": "stimulant",
  "phonetic": "/ˈstɪmjələnt/",
  "meaningZh": "兴奋剂，刺激物",
  "band": 7.5,
  "source": "刷一刷 · 视频01"
}
```

### 6.3 获取今日学习时长与进度统计
- **请求方式**：`GET`
- **路径**：`/stats/today`
- **响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "date": "2026-10-16",
    "learnedWords": 6,
    "targetWords": 20,
    "learnedMinutes": 8,
    "targetMinutes": 15,
    "threeModules": {
      "watchCompleted": 2,
      "watchTotal": 6,
      "readCompleted": 1,
      "readTotal": 5,
      "guessCompleted": 3,
      "guessTotal": 20
    }
  }
}
```

---

## 7. cURL 示例与联调指引

```bash
# 1. 查询用户学习档案
curl -X GET "http://127.0.0.1:8080/api/v1/user/profile" \
  -H "Content-Type: application/json"

# 2. 提交更新学习目标
curl -X POST "http://127.0.0.1:8080/api/v1/user/goals" \
  -H "Content-Type: application/json" \
  -d '{"targetBand": 7.0, "currentLevel": "大学英语六级", "dailyMinutes": 30, "dailyWordTarget": 25}'

# 3. 拉取今日外刊分级文章
curl -X GET "http://127.0.0.1:8080/api/v1/reading/articles?domains=ai,tech&difficulty=standard" \
  -H "Content-Type: application/json"
```

> **注意**：前端应用通过 `tools/lingo/config.json` 获取 `apiBaseUrl`。如果后端暂未启动，前端将自动无缝开启 Mock 模式，不影响任何页面功能与操作体验。
