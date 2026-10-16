// ==========================================================================
// Lingo 雅思轻学 - 核心应用逻辑与状态引擎
// ==========================================================================

(function() {
  'use strict';

  // 应用全局状态
  const state = {
    config: null,
    backendStatus: 'offline', // 'online' | 'offline'
    viewMode: 'phone', // 'phone' | 'desktop'
    currentView: 'dashboard', // 'step1' | 'step2' | 'step3' | 'dashboard' | 'watch' | 'read' | 'guess' | 'profile'
    hasCompletedOnboarding: false,
    
    // 用户配置与目标
    userGoals: {
      targetBand: 6.5,
      currentLevel: '大学英语四级',
      interestedDomains: ['ai', 'tech', 'psychology'],
      dailyMinutes: 15,
      dailyWordTarget: 20,
      defaultReadingDifficulty: 'standard',
      streakDays: 3,
      learnedWordsToday: 7,
      learnedMinutesToday: 10
    },

    // 刷一刷短视频流状态
    watch: {
      currentIndex: 0,
      subtitleMode: 'bilingual', // 'bilingual' | 'en' | 'none'
      isStarred: false,
      isRecording: false,
      sheetOpen: false
    },

    // 看一看外刊阅读状态
    read: {
      currentArticleIndex: 0,
      currentDifficulty: 'standard', // 'easy' | 'standard' | 'ielts' | 'challenge'
      selectedPubId: 'economist',
      activeAnnotation: null
    },

    // 猜一猜状态
    guess: {
      currentPuzzleIndex: 0,
      selectedIndices: [],
      hasAnswered: false,
      isCorrect: false,
      score: 40
    },

    // 生词本
    vocabulary: []
  };

  // ------------------------------------------------------------------------
  // 1. 初始化与配置加载
  // ------------------------------------------------------------------------
  async function initApp() {
    loadLocalUserData();
    setupEventListeners();
    await loadConfig();
    renderTimeAndGreeting();
    
    // 如果是第一次进入，展示引导流第 1 步；若已配置过，直接展示首页
    if (!state.hasCompletedOnboarding) {
      switchView('step1');
    } else {
      switchView('dashboard');
    }

    renderCurrentView();
    updateDashboardMetrics();
  }

  // 加载本地已存的用户目标数据
  function loadLocalUserData() {
    try {
      const saved = localStorage.getItem('lingo_user_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.userGoals) state.userGoals = Object.assign(state.userGoals, parsed.userGoals);
        if (parsed.hasCompletedOnboarding !== undefined) state.hasCompletedOnboarding = parsed.hasCompletedOnboarding;
        if (parsed.vocabulary) state.vocabulary = parsed.vocabulary;
      } else {
        // 初始注入内置生词
        if (window.LINGO_MOCK && window.LINGO_MOCK.vocabulary) {
          state.vocabulary = [...window.LINGO_MOCK.vocabulary];
        }
      }
    } catch (e) {
      console.warn('本地状态读取失败，采用预设数据', e);
    }
  }

  // 持久化存储
  function saveLocalUserData() {
    try {
      localStorage.setItem('lingo_user_state_v1', JSON.stringify({
        userGoals: state.userGoals,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        vocabulary: state.vocabulary
      }));
    } catch (e) {
      console.warn('本地状态保存失败', e);
    }
  }

  // 加载 config.json
  async function loadConfig() {
    try {
      const resp = await fetch('lingo/config.json');
      if (resp.ok) {
        state.config = await resp.json();
      } else {
        throw new Error('config.json 加载失败');
      }
    } catch (err) {
      console.warn('读取本地 config.json 失败，使用内置兜底配置', err);
      state.config = {
        apiBaseUrl: 'http://127.0.0.1:8080/api/v1',
        timeoutMs: 8000,
        useMockFallback: true
      };
    }

    // 检查是否有本地覆盖的 API 地址
    const localApi = localStorage.getItem('lingo_custom_api_url');
    if (localApi) {
      state.config.apiBaseUrl = localApi;
    }

    // 静默检测后端联通性
    await testBackendConnection(false);
  }

  // ------------------------------------------------------------------------
  // 2. 路由与视图切换系统
  // ------------------------------------------------------------------------
  function switchView(viewName) {
    state.currentView = viewName;
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
      panel.style.display = 'none';
    });

    const target = document.getElementById('view-' + viewName);
    if (target) {
      target.classList.add('active');
      target.style.display = 'flex';
    }

    // 同步视口背景色与置顶
    const viewport = document.querySelector('.app-main-viewport');
    if (viewport) {
      if (viewName === 'watch' || viewName.startsWith('step')) {
        viewport.style.backgroundColor = '#0c0c0e';
      } else {
        viewport.style.backgroundColor = 'var(--lingo-cream)';
      }
      viewport.scrollTop = 0;
    }
    if (target) target.scrollTop = 0;

    // 更新导航高亮状态
    updateNavStates();

    renderCurrentView();
  }

  function updateNavStates() {
    // 桌面端顶栏选项卡高亮
    document.querySelectorAll('.web-nav-btn').forEach(btn => {
      const tab = btn.dataset.tab;
      if (tab === state.currentView) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 移动端底部导航高亮
    document.querySelectorAll('.nav-tab-item').forEach(btn => {
      const tab = btn.dataset.tab;
      if (tab === state.currentView) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 引导页隐藏底部导航与顶栏菜单高亮；刷一刷专属黑底导航栏
    const bottomNav = document.getElementById('bottom-nav-bar');
    const topNavTabs = document.querySelector('.web-nav-tabs');
    if (bottomNav) {
      if (state.currentView.startsWith('step')) {
        bottomNav.style.display = 'none';
      } else {
        bottomNav.style.display = '';
        if (state.currentView === 'watch') {
          bottomNav.classList.add('theme-dark-nav');
          bottomNav.style.backgroundColor = '#000000';
          bottomNav.style.borderTopColor = 'rgba(255, 255, 255, 0.12)';
        } else {
          bottomNav.classList.remove('theme-dark-nav');
          bottomNav.style.backgroundColor = '';
          bottomNav.style.borderTopColor = '';
        }
      }
    }

    // 刷一刷视图锁死全页面滚动，杜绝上下滑动切视频时出现系统侧边滚动条
    if (state.currentView === 'watch') {
      document.body.classList.add('view-watch-active');
      document.documentElement.classList.add('view-watch-active');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('view-watch-active');
      document.documentElement.classList.remove('view-watch-active');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    if (topNavTabs) {
      if (state.currentView.startsWith('step')) {
        topNavTabs.style.visibility = 'hidden';
      } else {
        topNavTabs.style.visibility = 'visible';
      }
    }
  }

  // ------------------------------------------------------------------------
  // 3. 视图渲染调度器
  // ------------------------------------------------------------------------
  function renderCurrentView() {
    switch (state.currentView) {
      case 'step1':
        renderStep1();
        break;
      case 'step2':
        renderStep2();
        break;
      case 'step3':
        renderStep3();
        break;
      case 'dashboard':
        renderDashboard();
        break;
      case 'watch':
        renderWatch();
        break;
      case 'read':
        renderRead();
        break;
      case 'guess':
        renderGuess();
        break;
      case 'profile':
        renderProfile();
        break;
    }
  }

  // ------------------------------------------------------------------------
  // 4. 引导流程渲染 (Steps 1, 2, 3)
  // ------------------------------------------------------------------------
  function renderStep1() {
    const scoreVal = document.getElementById('score-val-display');
    const slider = document.getElementById('ielts-score-slider');
    if (scoreVal && slider) {
      scoreVal.textContent = state.userGoals.targetBand.toFixed(1);
      slider.value = state.userGoals.targetBand;
    }
  }

  function renderStep2() {
    // 渲染当前水平单选
    document.querySelectorAll('.level-pill').forEach(pill => {
      const lvl = pill.dataset.level;
      if (lvl === state.userGoals.currentLevel) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // 渲染感兴趣领域多选
    document.querySelectorAll('.domain-pill').forEach(pill => {
      const dom = pill.dataset.domain;
      if (state.userGoals.interestedDomains.includes(dom)) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function renderStep3() {
    // 时长单选
    document.querySelectorAll('.time-pill').forEach(pill => {
      const mins = parseInt(pill.dataset.mins, 10);
      if (mins === state.userGoals.dailyMinutes) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // 单词步进量
    const wordTargetEl = document.getElementById('word-target-val');
    if (wordTargetEl) {
      wordTargetEl.textContent = state.userGoals.dailyWordTarget;
    }

    // 难度单选
    document.querySelectorAll('.diff-pill').forEach(pill => {
      const diff = pill.dataset.diff;
      if (diff === state.userGoals.defaultReadingDifficulty) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. 首页仪表盘渲染 (Dashboard)
  // ------------------------------------------------------------------------
  function renderDashboard() {
    renderTimeAndGreeting();
    updateDashboardMetrics();
  }

  function renderTimeAndGreeting() {
    const greetingEl = document.getElementById('dash-greeting-text');
    const dateEl = document.getElementById('dash-date-text');
    const now = new Date();
    
    const hours = now.getHours();
    let greeting = '你好';
    if (hours < 6) greeting = '夜深了';
    else if (hours < 12) greeting = '早上好';
    else if (hours < 14) greeting = '中午好';
    else if (hours < 18) greeting = '下午好';
    else greeting = '晚上好';

    if (greetingEl) {
      greetingEl.textContent = `${greeting}，Yup`;
    }

    if (dateEl) {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      dateEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日 ${days[now.getDay()]}`;
    }

    // 手机顶部状态栏时钟
    const phoneClock = document.getElementById('status-time-clock');
    if (phoneClock) {
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(now.getMinutes()).padStart(2, '0');
      phoneClock.textContent = `${hStr}:${mStr}`;
    }
  }

  function updateDashboardMetrics() {
    const wordProgress = document.getElementById('today-word-progress');
    const timeProgress = document.getElementById('today-time-progress');
    const streakBadge = document.getElementById('dash-streak-badge');
    const vocabCount = document.getElementById('vocab-review-count');

    if (wordProgress) {
      wordProgress.textContent = `${state.userGoals.learnedWordsToday} / ${state.userGoals.dailyWordTarget} 词`;
    }
    if (timeProgress) {
      timeProgress.textContent = `${state.userGoals.learnedMinutesToday} / ${state.userGoals.dailyMinutes} 分钟`;
    }
    if (streakBadge) {
      streakBadge.innerHTML = `<i class="fas fa-fire"></i> ${state.userGoals.streakDays} 天`;
    }
    if (vocabCount) {
      vocabCount.textContent = `${state.vocabulary.length} 个已收藏`;
    }
  }

  // ------------------------------------------------------------------------
  // 6. 「刷一刷」短视频核心逻辑 (Watch Feed)
  // ------------------------------------------------------------------------
  function renderWatch() {
    const videos = window.LINGO_MOCK.videos;
    const cur = videos[state.watch.currentIndex];
    if (!cur) return;

    // 顶部信息
    const genrePill = document.getElementById('watch-genre-pill');
    const counterText = document.getElementById('watch-counter-text');
    if (genrePill) {
      genrePill.textContent = cur.genreTag;
      genrePill.style.borderColor = cur.genreColor;
    }
    if (counterText) {
      counterText.textContent = `${state.watch.currentIndex + 1} / ${videos.length}`;
    }

    // 顶部段标
    const segsContainer = document.getElementById('watch-seg-dots');
    if (segsContainer) {
      segsContainer.innerHTML = videos.map((v, i) => `
        <div class="hud-seg ${i === state.watch.currentIndex ? 'active' : ''}"></div>
      `).join('');
    }

    // 画面背景
    const backdrop = document.getElementById('watch-backdrop-img');
    if (backdrop) {
      backdrop.src = cur.poster;
    }

    // 字幕
    const subEn = document.getElementById('watch-sub-en');
    const subZh = document.getElementById('watch-sub-zh');
    const subHumor = document.getElementById('watch-sub-humor');

    if (subEn) subEn.textContent = cur.subtitleEn;
    if (subZh) subZh.textContent = cur.subtitleZh;
    if (subHumor) subHumor.textContent = cur.humorousLine;

    // 字幕模式应用
    if (state.watch.subtitleMode === 'none') {
      if (subEn) subEn.style.display = 'none';
      if (subZh) subZh.style.display = 'none';
      if (subHumor) subHumor.style.display = 'none';
    } else if (state.watch.subtitleMode === 'en') {
      if (subEn) subEn.style.display = 'block';
      if (subZh) subZh.style.display = 'none';
      if (subHumor) subHumor.style.display = 'none';
    } else {
      if (subEn) subEn.style.display = 'block';
      if (subZh) subZh.style.display = 'block';
      if (subHumor) subHumor.style.display = 'block';
    }

    // 单词速查胶囊文案
    const capsuleBtn = document.getElementById('watch-capsule-btn');
    if (capsuleBtn) {
      capsuleBtn.innerHTML = `<i class="fas fa-list-ul"></i> 本条单词 ${cur.words.length} · 快测`;
    }

    // 渲染底部抽屉里的单词卡片
    renderWatchSheet(cur);
  }

  function renderWatchSheet(cur) {
    const list = document.getElementById('sheet-words-content');
    const quizBox = document.getElementById('sheet-quiz-content');
    const endingText = document.getElementById('sheet-actor-speech');

    if (endingText && cur.words.length > 0) {
      endingText.textContent = cur.words[0].endingSummary;
    }

    if (list) {
      list.innerHTML = cur.words.map(w => `
        <div class="sheet-word-item">
          <div class="word-item-top">
            <div class="word-text-box">
              <span class="word-keyword">${w.word}</span>
              <span class="word-phonetic">${w.phonetic}</span>
              <span class="word-band-badge">Band ${w.band}</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="topbar-btn" style="padding: 4px 8px;" onclick="window.LingoApp.speakWord('${w.word}')">
                <i class="fas fa-volume-up"></i>
              </button>
              <button class="topbar-btn" style="padding: 4px 8px;" onclick="window.LingoApp.addWordToVocab('${w.word}', '${w.phonetic}', '${w.meaningZh}', '${w.band}')">
                <i class="far fa-bookmark"></i>
              </button>
            </div>
          </div>
          <div class="word-meaning-zh">${w.pos} ${w.meaningZh}</div>
          <div class="word-collocation">常考搭配：${w.collocation}</div>
          <div class="word-quote">${w.quote}</div>
        </div>
      `).join('');
    }

    if (quizBox && cur.quickQuiz) {
      quizBox.innerHTML = `
        <div class="quiz-question-title"><i class="fas fa-bolt" style="color: #f97316;"></i> 5秒随堂快测：${cur.quickQuiz.question}</div>
        <div class="quiz-options-group">
          ${cur.quickQuiz.options.map((opt, idx) => `
            <button class="quiz-opt-btn" onclick="window.LingoApp.answerWatchQuiz(${idx}, ${cur.quickQuiz.answer}, this)">${opt}</button>
          `).join('')}
        </div>
        <div id="quiz-result-tip" style="margin-top: 10px; font-size: 12px; color: #a1a1aa; display: none;">${cur.quickQuiz.tip}</div>
      `;
    }
  }

  // ------------------------------------------------------------------------
  // 7. 「看一看」20 大外刊分级精读逻辑 (Read Articles)
  // ------------------------------------------------------------------------
  function renderRead() {
    renderPublicationList();
    renderArticleContent();
  }

  function renderPublicationList() {
    const container = document.getElementById('read-pubs-scroll');
    if (!container) return;

    const pubs = window.LINGO_MOCK.publications;
    container.innerHTML = pubs.map(p => `
      <div class="pub-pill-card ${p.id === state.read.selectedPubId ? 'active' : ''}" onclick="window.LingoApp.selectPublication('${p.id}')">
        <i class="${p.icon}"></i>
        <span class="pub-name">${p.name}</span>
      </div>
    `).join('');
  }

  function renderArticleContent() {
    const articles = window.LINGO_MOCK.articles;
    let article = articles.find(a => a.publicationId === state.read.selectedPubId);
    if (!article) article = articles[0];

    const titleEl = document.getElementById('read-article-title');
    const titleZhEl = document.getElementById('read-article-title-zh');
    const pubTag = document.getElementById('read-pub-tag');
    const bodyEl = document.getElementById('read-article-body');
    const syntaxBox = document.getElementById('read-syntax-box');

    if (pubTag) pubTag.textContent = article.publicationName;
    if (titleEl) titleEl.textContent = article.title;
    if (titleZhEl) titleZhEl.textContent = article.titleZh;

    // 根据当前难度获取段落
    const diffData = article.difficultyLevels[state.read.currentDifficulty] || article.difficultyLevels.standard;
    if (bodyEl) {
      let html = '';
      diffData.paragraphs.forEach(para => {
        // 将 [[word|id]] 替换为可交互的高亮词
        const replaced = para.replace(/\[\[(.*?)\|(.*?)\]\]/g, (match, word, wid) => {
          return `<span class="ielts-highlight-word" onclick="window.LingoApp.showWordAnnotation('${wid}', this)">${word}</span>`;
        });
        html += `<p>${replaced}</p>`;
      });
      bodyEl.innerHTML = html;
    }

    // 难度按钮状态
    document.querySelectorAll('.diff-btn').forEach(btn => {
      if (btn.dataset.diff === state.read.currentDifficulty) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 语法解析卡
    if (syntaxBox) {
      if (article.syntaxBreakdowns && article.syntaxBreakdowns.length > 0) {
        const syn = article.syntaxBreakdowns[0];
        syntaxBox.innerHTML = `
          <div class="syntax-label"><i class="fas fa-project-diagram"></i> 雅思长难句精解：${syn.structure}</div>
          <div class="syntax-content">${syn.analysis}</div>
        `;
        syntaxBox.style.display = 'flex';
      } else {
        syntaxBox.style.display = 'none';
      }
    }
  }

  // ------------------------------------------------------------------------
  // 8. 「猜一猜」图像记忆单词 (根据图片选出所有符合它的图，支持多选)
  // ------------------------------------------------------------------------
  function renderGuess() {
    const puzzles = window.LINGO_MOCK.guessPuzzles;
    if (!puzzles || puzzles.length === 0) return;

    const cur = puzzles[state.guess.currentPuzzleIndex % puzzles.length];
    if (!cur) return;

    state.guess.selectedIndices = [];
    state.guess.hasAnswered = false;

    // 1. 顶部进度计数与 20 格分段进度条
    const counterEl = document.getElementById('guess-counter-pill');
    const segTrackEl = document.getElementById('guess-seg-track');
    const activeIdx = state.guess.currentPuzzleIndex % puzzles.length;

    if (counterEl) {
      counterEl.textContent = `${activeIdx + 1} / ${puzzles.length}`;
    }
    if (segTrackEl) {
      segTrackEl.innerHTML = Array.from({ length: puzzles.length }, (_, i) => {
        let cls = 'guess-seg-dash';
        if (i === activeIdx) cls += ' active';
        else if (i < activeIdx) cls += ' completed';
        return `<div class="${cls}"></div>`;
      }).join('');
    }

    // 2. 单词题干与发音
    const wordTitle = document.getElementById('guess-word-title');
    const speakerBtn = document.getElementById('guess-speaker-btn');
    const phoneticEl = document.getElementById('guess-phonetic-text');
    const instructionLine = document.getElementById('guess-instruction-line');

    if (wordTitle) wordTitle.textContent = cur.word;
    if (phoneticEl) phoneticEl.textContent = cur.phonetic || '';
    if (instructionLine) {
      instructionLine.innerHTML = `<span class="guess-phonetic-text" id="guess-phonetic-text">${cur.phonetic || ''}</span> · ${cur.instruction || '选出所有符合它的图（可多选）'}`;
    }
    if (speakerBtn) {
      speakerBtn.onclick = () => speakWord(cur.word);
    }

    // 3. 2x2 四宫格情境图片互动矩阵
    const photosBox = document.getElementById('guess-photos-box');
    if (photosBox) {
      photosBox.innerHTML = cur.images.map((img, i) => `
        <div class="guess-photo-card" data-idx="${i}" onclick="window.LingoApp.toggleGuessPhotoSelection(${i})">
          <img src="${img.url}" alt="${img.caption || '情境图'}">
          <div class="guess-card-check"><i class="fas fa-check"></i></div>
          <div class="guess-card-badge" id="guess-card-badge-${i}"></div>
        </div>
      `).join('');
    }

    // 4. 底部主确认操作按钮
    const confirmBtn = document.getElementById('guess-confirm-btn');
    if (confirmBtn) {
      confirmBtn.textContent = '确认（已选 0 张）';
      confirmBtn.disabled = true;
      confirmBtn.classList.remove('active');
      confirmBtn.onclick = () => confirmGuessAnswer();
    }

    // 5. 隐藏结果解析卡
    const feedbackCard = document.getElementById('guess-feedback-card');
    if (feedbackCard) feedbackCard.style.display = 'none';
  }

  function toggleGuessPhotoSelection(idx) {
    if (state.guess.hasAnswered) return;

    const list = state.guess.selectedIndices;
    const pos = list.indexOf(idx);
    if (pos > -1) {
      list.splice(pos, 1);
    } else {
      list.push(idx);
    }

    // 更新各卡片的选中高亮样式
    document.querySelectorAll('.guess-photo-card').forEach(card => {
      const cIdx = parseInt(card.dataset.idx, 10);
      if (list.includes(cIdx)) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // 更新确认按钮文字与激活状态
    const confirmBtn = document.getElementById('guess-confirm-btn');
    if (confirmBtn) {
      const count = list.length;
      confirmBtn.textContent = `确认（已选 ${count} 张）`;
      if (count > 0) {
        confirmBtn.disabled = false;
        confirmBtn.classList.add('active');
      } else {
        confirmBtn.disabled = true;
        confirmBtn.classList.remove('active');
      }
    }
  }

  function confirmGuessAnswer() {
    if (state.guess.hasAnswered || state.guess.selectedIndices.length === 0) return;
    state.guess.hasAnswered = true;

    const puzzles = window.LINGO_MOCK.guessPuzzles;
    const cur = puzzles[state.guess.currentPuzzleIndex % puzzles.length];
    if (!cur) return;

    // 自动读音
    speakWord(cur.word);

    const userSelected = state.guess.selectedIndices;
    const correctIndices = cur.correctIndices || [];

    // 判定全对：数量相同且每个选项都在正确答案中
    const isAllCorrect = userSelected.length === correctIndices.length &&
      correctIndices.every(idx => userSelected.includes(idx));

    // 更新各图片卡片状态反馈角标
    document.querySelectorAll('.guess-photo-card').forEach(card => {
      const idx = parseInt(card.dataset.idx, 10);
      const badge = document.getElementById(`guess-card-badge-${idx}`);
      const isSelected = userSelected.includes(idx);
      const isTarget = correctIndices.includes(idx);

      if (isTarget) {
        if (isSelected) {
          card.classList.add('is-correct');
          if (badge) {
            badge.textContent = '✓ 符合释义';
            badge.className = 'guess-card-badge correct';
          }
        } else {
          card.classList.add('is-missed');
          if (badge) {
            badge.textContent = '💡 也是符合的';
            badge.className = 'guess-card-badge missed';
          }
        }
      } else {
        if (isSelected) {
          card.classList.add('is-wrong');
          if (badge) {
            badge.textContent = '✕ 不符合';
            badge.className = 'guess-card-badge wrong';
          }
        }
      }
    });

    // 禁用确认按钮
    const confirmBtn = document.getElementById('guess-confirm-btn');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.classList.remove('active');
    }

    // 渲染并展示解析卡
    const feedbackCard = document.getElementById('guess-feedback-card');
    const statusBanner = document.getElementById('guess-status-banner');
    const meaningEl = document.getElementById('guess-meaning-zh');
    const mnemonicEl = document.getElementById('guess-mnemonic-text');
    const quoteEl = document.getElementById('guess-quote-text');
    const starBtn = document.getElementById('guess-star-word-btn');
    const nextBtn = document.getElementById('guess-next-puzzle-btn');

    if (statusBanner) {
      if (isAllCorrect) {
        statusBanner.className = 'feedback-status-banner success';
        statusBanner.innerHTML = '<i class="fas fa-check-circle"></i> 敏锐！全部正确匹配';
        showToast('🎉 太棒了！敏锐抓取词汇语义');
        state.userGoals.learnedWordsToday += 1;
        saveLocalUserData();
        updateDashboardMetrics();
      } else {
        statusBanner.className = 'feedback-status-banner partial';
        statusBanner.innerHTML = '<i class="fas fa-info-circle"></i> 差一点点，来看语义解析';
        showToast('别灰心，点击查看图文情境解析');
      }
    }

    if (meaningEl) {
      meaningEl.innerHTML = `<span style="font-size: 13px; color: #4f46e5; font-weight: 700; margin-right: 6px;">${cur.pos || ''}</span> ${cur.meaningZh}`;
    }
    if (mnemonicEl) {
      mnemonicEl.textContent = cur.mnemonic || '';
    }
    if (quoteEl) {
      quoteEl.textContent = cur.ieltsQuote || '';
    }

    if (starBtn) {
      const isAlreadyStarred = state.vocabulary.some(v => v.word.toLowerCase() === cur.word.toLowerCase());
      if (isAlreadyStarred) {
        starBtn.classList.add('starred');
        starBtn.innerHTML = '<i class="fas fa-star" style="color: #eab308;"></i> 已存生词本';
      } else {
        starBtn.classList.remove('starred');
        starBtn.innerHTML = '<i class="far fa-star"></i> 加入生词本';
      }
      starBtn.onclick = () => {
        addWordToVocab({
          word: cur.word,
          phonetic: cur.phonetic,
          pos: cur.pos,
          meaningZh: cur.meaningZh,
          band: cur.band,
          source: '猜一猜 · 图像记忆'
        });
        starBtn.classList.add('starred');
        starBtn.innerHTML = '<i class="fas fa-star" style="color: #eab308;"></i> 已存生词本';
      };
    }

    if (nextBtn) {
      const isLast = (state.guess.currentPuzzleIndex + 1) >= puzzles.length;
      nextBtn.innerHTML = isLast ? '重新从第 1 题开始 ➔' : `下一题 (${(state.guess.currentPuzzleIndex % puzzles.length) + 2}/${puzzles.length}) ➔`;
      nextBtn.onclick = () => nextGuessPuzzle();
    }

    if (feedbackCard) {
      feedbackCard.style.display = 'flex';
      setTimeout(() => {
        feedbackCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }

  function nextGuessPuzzle() {
    const puzzles = window.LINGO_MOCK.guessPuzzles;
    state.guess.currentPuzzleIndex = (state.guess.currentPuzzleIndex + 1) % puzzles.length;
    state.guess.selectedIndices = [];
    state.guess.hasAnswered = false;
    renderGuess();
  }

  // ------------------------------------------------------------------------
  // 9. 生词本与用户设置 (Profile & Vocab)
  // ------------------------------------------------------------------------
  function renderProfile() {
    const vocabListEl = document.getElementById('profile-vocab-list');
    const vocabTotalEl = document.getElementById('profile-vocab-total');

    if (vocabTotalEl) {
      vocabTotalEl.textContent = `${state.vocabulary.length} 词`;
    }

    if (vocabListEl) {
      if (state.vocabulary.length === 0) {
        vocabListEl.innerHTML = `
          <div style="padding: 30px; text-align: center; color: #a1a1aa; font-size: 13px;">
            <i class="far fa-folder-open" style="font-size: 28px; margin-bottom: 8px; display: block;"></i>
            生词本空空如也，快去刷一刷或看一看里收藏吧！
          </div>
        `;
      } else {
        vocabListEl.innerHTML = state.vocabulary.map((w, idx) => `
          <div class="setting-row-item">
            <div class="setting-left">
              <button class="topbar-btn" style="padding: 4px 8px;" onclick="window.LingoApp.speakWord('${w.word}')">
                <i class="fas fa-volume-up"></i>
              </button>
              <div>
                <div style="font-size: 15px; font-weight: 700;">${w.word} <span style="font-size: 12px; color: #9a3412;">Band ${w.band || '7.0'}</span></div>
                <div style="font-size: 12px; color: #71717a;">${w.meaningZh}</div>
              </div>
            </div>
            <button class="topbar-btn" style="padding: 4px 8px; color: #ef4444;" onclick="window.LingoApp.removeWordFromVocab(${idx})">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `).join('');
      }
    }
  }

  // ------------------------------------------------------------------------
  // 10. 事件监听绑定系统
  // ------------------------------------------------------------------------
  function setupEventListeners() {
    // 桌面端顶栏选项卡点击切换
    document.querySelectorAll('.web-nav-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        switchView(tab);
      });
    });

    // Step 1: 滑块交互
    const slider = document.getElementById('ielts-score-slider');
    const scoreVal = document.getElementById('score-val-display');
    if (slider && scoreVal) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        state.userGoals.targetBand = val;
        scoreVal.textContent = val.toFixed(1);
      });
    }

    // Step 1 -> Step 2
    const btnNext1 = document.getElementById('btn-step1-next');
    if (btnNext1) {
      btnNext1.addEventListener('click', () => switchView('step2'));
    }

    // Step 2: 当前水平单选
    document.querySelectorAll('.level-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.level-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        state.userGoals.currentLevel = this.dataset.level;
      });
    });

    // Step 2: 感兴趣领域多选
    document.querySelectorAll('.domain-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        const dom = this.dataset.domain;
        if (state.userGoals.interestedDomains.includes(dom)) {
          state.userGoals.interestedDomains = state.userGoals.interestedDomains.filter(d => d !== dom);
          this.classList.remove('active');
        } else {
          state.userGoals.interestedDomains.push(dom);
          this.classList.add('active');
        }
      });
    });

    // Step 2 -> Step 3
    const btnNext2 = document.getElementById('btn-step2-next');
    if (btnNext2) {
      btnNext2.addEventListener('click', () => switchView('step3'));
    }

    // Step 3: 时长单选
    document.querySelectorAll('.time-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        state.userGoals.dailyMinutes = parseInt(this.dataset.mins, 10);
      });
    });

    // Step 3: 单词量步进器
    const btnMinus = document.getElementById('btn-word-minus');
    const btnPlus = document.getElementById('btn-word-plus');
    const wordTargetEl = document.getElementById('word-target-val');
    if (btnMinus && btnPlus && wordTargetEl) {
      btnMinus.addEventListener('click', () => {
        if (state.userGoals.dailyWordTarget > 5) {
          state.userGoals.dailyWordTarget -= 5;
          wordTargetEl.textContent = state.userGoals.dailyWordTarget;
        }
      });
      btnPlus.addEventListener('click', () => {
        if (state.userGoals.dailyWordTarget < 80) {
          state.userGoals.dailyWordTarget += 5;
          wordTargetEl.textContent = state.userGoals.dailyWordTarget;
        }
      });
    }

    // Step 3: 难度单选
    document.querySelectorAll('.diff-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.diff-pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        state.userGoals.defaultReadingDifficulty = this.dataset.diff;
      });
    });

    // Step 3 -> 开始我的 Lingo
    const btnStart = document.getElementById('btn-start-lingo');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        state.hasCompletedOnboarding = true;
        saveLocalUserData();
        showToast('🎯 目标设定成功，开启今日 Lingo！');
        switchView('dashboard');
      });
    }

    // 上一步按钮
    const btnBackTo1 = document.getElementById('btn-back-to-step1');
    if (btnBackTo1) btnBackTo1.addEventListener('click', () => switchView('step1'));
    const btnBackTo2 = document.getElementById('btn-back-to-step2');
    if (btnBackTo2) btnBackTo2.addEventListener('click', () => switchView('step2'));

    // 首页核心功能入口卡片点击
    const entryWatch = document.getElementById('entry-card-watch');
    if (entryWatch) entryWatch.addEventListener('click', () => switchView('watch'));
    const entryRead = document.getElementById('entry-card-read');
    if (entryRead) entryRead.addEventListener('click', () => switchView('read'));
    const entryGuess = document.getElementById('entry-card-guess');
    if (entryGuess) entryGuess.addEventListener('click', () => switchView('guess'));
    const entryVocab = document.getElementById('entry-card-vocab');
    if (entryVocab) entryVocab.addEventListener('click', () => switchView('profile'));

    // 刷一刷：返回首页
    const watchBack = document.getElementById('watch-back-btn');
    if (watchBack) watchBack.addEventListener('click', () => switchView('dashboard'));

    // 刷一刷：底部胶囊打开单词抽屉
    const watchCapsule = document.getElementById('watch-capsule-btn');
    const sheetOverlay = document.getElementById('word-sheet-overlay');
    const sheetClose = document.getElementById('sheet-close-btn');
    if (watchCapsule && sheetOverlay) {
      watchCapsule.addEventListener('click', () => {
        sheetOverlay.classList.add('active');
      });
    }
    if (sheetClose && sheetOverlay) {
      sheetClose.addEventListener('click', () => {
        sheetOverlay.classList.remove('active');
      });
    }
    if (sheetOverlay) {
      sheetOverlay.addEventListener('click', (e) => {
        if (e.target === sheetOverlay) sheetOverlay.classList.remove('active');
      });
    }

    // 刷一刷：右侧按钮（跟读测评、收藏、字幕切换）
    const btnMic = document.getElementById('watch-mic-btn');
    if (btnMic) {
      btnMic.addEventListener('click', toggleSpeechShadowing);
    }

    const btnStar = document.getElementById('watch-star-btn');
    if (btnStar) {
      btnStar.addEventListener('click', () => {
        state.watch.isStarred = !state.watch.isStarred;
        btnStar.classList.toggle('starred', state.watch.isStarred);
        const cur = window.LINGO_MOCK.videos[state.watch.currentIndex];
        if (cur && cur.words) {
          cur.words.forEach(w => {
            addWordToVocab(w.word, w.phonetic, w.meaningZh, w.band, false);
          });
          showToast(state.watch.isStarred ? '⭐ 本视频考词已加入生词本' : '已取消收藏');
        }
      });
    }

    const btnSubtitle = document.getElementById('watch-sub-btn');
    if (btnSubtitle) {
      btnSubtitle.addEventListener('click', () => {
        if (state.watch.subtitleMode === 'bilingual') {
          state.watch.subtitleMode = 'en';
          showToast('🔤 已切换为：仅英文字幕');
        } else if (state.watch.subtitleMode === 'en') {
          state.watch.subtitleMode = 'none';
          showToast('🔤 已隐藏字幕');
        } else {
          state.watch.subtitleMode = 'bilingual';
          showToast('🔤 已切换为：中英双语字幕');
        }
        renderWatch();
      });
    }

    // ------------------------------------------------------------------------
    // 刷一刷：抖音风格上下滑动切视频 + 单击暂停/播放
    // ------------------------------------------------------------------------
    const stageBox = document.getElementById('watch-stage-box');
    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;
    let isTouchActive = false;

    if (stageBox) {
      // 触屏滑动监听 (手机端主要交互方式)
      stageBox.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') || e.target.closest('.word-sheet-overlay')) return;
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        isTouchActive = true;
      }, { passive: true });

      stageBox.addEventListener('touchmove', (e) => {
        if (!isTouchActive) return;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - touchStartY;
        const deltaX = e.touches[0].clientX - touchStartX;

        // 核心修复：一旦开始纵向手势，立即拦截浏览器原生网页滚动，杜绝侧边滚动条闪烁
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          if (e.cancelable) e.preventDefault();
        }

        // 跟手微动效 (仅限垂直拖动)
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) < 100) {
          stageBox.style.transform = `translateY(${deltaY * 0.3}px)`;
        }
      }, { passive: false });

      stageBox.addEventListener('touchend', (e) => {
        if (!isTouchActive) return;
        isTouchActive = false;
        stageBox.style.transform = '';

        const endY = e.changedTouches[0].clientY;
        const endX = e.changedTouches[0].clientX;
        const deltaY = touchStartY - endY; // 正数：向上滑动 -> 下一个视频
        const deltaX = Math.abs(touchStartX - endX);
        const duration = Date.now() - touchStartTime;

        if (Math.abs(deltaY) > 40 && Math.abs(deltaY) > deltaX) {
          if (deltaY > 0) {
            slideVideo('next');
          } else {
            slideVideo('prev');
          }
        } else if (Math.abs(deltaY) < 12 && deltaX < 12 && duration < 350) {
          toggleWatchPlayPause();
        }
      });

      stageBox.addEventListener('touchcancel', () => {
        isTouchActive = false;
        stageBox.style.transform = '';
      });

      // 桌面端鼠标上下拖拽切视频
      let mouseStartY = 0;
      let isMouseDown = false;
      stageBox.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('.word-sheet-overlay')) return;
        mouseStartY = e.clientY;
        isMouseDown = true;
      });

      stageBox.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        const mouseDelta = mouseStartY - e.clientY;
        if (Math.abs(mouseDelta) > 50) {
          if (mouseDelta > 0) {
            slideVideo('next');
          } else {
            slideVideo('prev');
          }
        } else if (Math.abs(mouseDelta) < 8) {
          toggleWatchPlayPause();
        }
      });

      // 滚轮滚滑上下切视频 (电脑触摸板/鼠标滚轮上下滑动)
      let wheelDebounce = false;
      stageBox.addEventListener('wheel', (e) => {
        if (e.target.closest('.word-sheet-overlay')) return;
        if (e.cancelable) e.preventDefault();
        if (wheelDebounce) return;
        if (Math.abs(e.deltaY) > 30) {
          wheelDebounce = true;
          if (e.deltaY > 0) {
            slideVideo('next');
          } else {
            slideVideo('prev');
          }
          setTimeout(() => { wheelDebounce = false; }, 450);
        }
      }, { passive: false });
    }

    // 底部导航栏点击
    document.querySelectorAll('.nav-tab-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        switchView(tab);
      });
    });

    // 键盘上下键切视频
    document.addEventListener('keydown', (e) => {
      if (state.currentView === 'watch') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          slideVideo('next');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          slideVideo('prev');
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 11. 刷一刷：抖音式纵向平滑切视频与播放状态
  // ------------------------------------------------------------------------
  let isVideoSliding = false;
  function slideVideo(direction) {
    if (isVideoSliding) return;
    const stage = document.getElementById('watch-stage-box');
    if (!stage) return;
    isVideoSliding = true;

    const total = window.LINGO_MOCK.videos.length;
    let nextIdx = state.watch.currentIndex;
    if (direction === 'next') {
      nextIdx = (state.watch.currentIndex + 1) % total;
    } else {
      nextIdx = (state.watch.currentIndex - 1 + total) % total;
    }

    // 隐藏滑动提示
    const hint = document.getElementById('watch-swipe-hint');
    if (hint) hint.style.display = 'none';

    // 垂直滑出动画
    const outOffset = direction === 'next' ? -50 : 50;
    stage.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.22s ease';
    stage.style.transform = `translateY(${outOffset}px)`;
    stage.style.opacity = '0.35';

    setTimeout(() => {
      state.watch.currentIndex = nextIdx;
      state.watch.isStarred = false;
      const btnStar = document.getElementById('watch-star-btn');
      if (btnStar) btnStar.classList.remove('starred');

      renderWatch();

      // 从对应方向滑入
      const inOffset = direction === 'next' ? 50 : -50;
      stage.style.transition = 'none';
      stage.style.transform = `translateY(${inOffset}px)`;
      stage.style.opacity = '0.35';

      // 强制重绘
      stage.offsetHeight;
      stage.style.transition = 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease';
      stage.style.transform = 'translateY(0)';
      stage.style.opacity = '1';

      setTimeout(() => {
        stage.style.transition = '';
        stage.style.transform = '';
        stage.style.opacity = '';
        isVideoSliding = false;
      }, 250);
    }, 220);
  }

  function toggleWatchPlayPause() {
    state.watch.isPlaying = !state.watch.isPlaying;
    const indicator = document.getElementById('watch-play-indicator');
    if (indicator) {
      indicator.innerHTML = state.watch.isPlaying ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
      indicator.classList.add('show');
      setTimeout(() => indicator.classList.remove('show'), 500);
    }
    showToast(state.watch.isPlaying ? '▶ 继续播放' : '⏸ 暂停播放');
  }

  // ------------------------------------------------------------------------
  // 11. 语音跟读测评与发音 (Web Speech API)
  // ------------------------------------------------------------------------
  function speakWord(word) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('当前浏览器暂不支持语音朗读');
    }
  }

  function toggleSpeechShadowing() {
    const btnMic = document.getElementById('watch-mic-btn');
    if (state.watch.isRecording) {
      state.watch.isRecording = false;
      if (btnMic) btnMic.classList.remove('recording');
      showToast('测评完成！发音流利度 92 分 (Band 7.5)');
      return;
    }

    state.watch.isRecording = true;
    if (btnMic) btnMic.classList.add('recording');
    showToast('🎙️ 请大声朗读屏幕上的高频短句...');

    // 模拟 3 秒后给出雅思口语评测分
    setTimeout(() => {
      if (state.watch.isRecording) {
        state.watch.isRecording = false;
        if (btnMic) btnMic.classList.remove('recording');
        showToast('🎯 AI 口语测评：语音语调纯正，重音准确！综合得分 90 (Band 7.0)');
      }
    }, 3200);
  }

  // ------------------------------------------------------------------------
  // 12. 答题与进度结算
  // ------------------------------------------------------------------------
  function answerWatchQuiz(selectedIdx, correctIdx, btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);
    const tip = document.getElementById('quiz-result-tip');
    if (tip) tip.style.display = 'block';

    if (selectedIdx === correctIdx) {
      btn.classList.add('correct');
      state.userGoals.learnedWordsToday += 1;
      saveLocalUserData();
      updateDashboardMetrics();
      showToast('🎉 回答正确！今日学习词数 +1');
    } else {
      btn.classList.add('wrong');
      const correctBtn = parent.children[correctIdx];
      if (correctBtn) correctBtn.classList.add('correct');
      showToast('别灰心，点击查看解析提示');
    }
  }

  function verifyGuessAnswer(selected, correct, btn) {
    if (state.guess.hasAnswered) return;
    state.guess.hasAnswered = true;

    const parent = btn.parentElement;
    parent.querySelectorAll('.guess-opt-btn').forEach(b => b.disabled = true);

    const mnemonicBox = document.getElementById('guess-mnemonic-box');
    const cur = window.LINGO_MOCK.guessPuzzles[state.guess.currentPuzzleIndex % window.LINGO_MOCK.guessPuzzles.length];

    if (selected === correct) {
      btn.classList.add('correct');
      speakWord(correct);
      state.userGoals.learnedWordsToday += 1;
      saveLocalUserData();
      updateDashboardMetrics();
      showToast('✨ 猜对啦！图像记忆法已解锁');
    } else {
      btn.classList.add('wrong');
      parent.querySelectorAll('.guess-opt-btn').forEach(b => {
        if (b.textContent === correct) b.classList.add('correct');
      });
      showToast('差一点点，看看图象联想记忆法吧！');
    }

    if (mnemonicBox && cur) {
      mnemonicBox.innerHTML = `
        <div class="mnemonic-header"><i class="fas fa-magic"></i> 熟人演绎 · 词根图象记忆</div>
        <div class="mnemonic-text">${cur.mnemonic}</div>
        <button class="btn-primary-white" style="height: 40px; font-size: 13px; margin-top: 8px;" onclick="window.LingoApp.nextGuessPuzzle()">
          下一题 ➔
        </button>
      `;
      mnemonicBox.style.display = 'flex';
    }
  }

  function nextGuessPuzzle() {
    state.guess.currentPuzzleIndex += 1;
    renderGuess();
  }

  // ------------------------------------------------------------------------
  // 13. 生词本存取
  // ------------------------------------------------------------------------
  function addWordToVocab(word, phonetic, meaningZh, band, notify = true) {
    const exists = state.vocabulary.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (!exists) {
      state.vocabulary.unshift({
        id: 'vocab_' + Date.now(),
        word,
        phonetic,
        meaningZh,
        band: band || '7.0',
        addedAt: new Date().toLocaleDateString()
      });
      saveLocalUserData();
      updateDashboardMetrics();
      if (notify) showToast(`已将 "${word}" 收入生词本`);
    } else if (notify) {
      showToast(`"${word}" 已在生词本中`);
    }
  }

  function removeWordFromVocab(idx) {
    const removed = state.vocabulary.splice(idx, 1);
    saveLocalUserData();
    renderProfile();
    updateDashboardMetrics();
    showToast(`已移出生词本`);
  }

  // ------------------------------------------------------------------------
  // 14. 刊物与难度切换
  // ------------------------------------------------------------------------
  function selectPublication(pubId) {
    state.read.selectedPubId = pubId;
    renderRead();
  }

  function setReadingDifficulty(diff) {
    state.read.currentDifficulty = diff;
    renderRead();
  }

  function showWordAnnotation(wordId, el) {
    const articles = window.LINGO_MOCK.articles;
    let article = articles.find(a => a.publicationId === state.read.selectedPubId) || articles[0];
    const anno = article.annotations[wordId];
    if (anno) {
      speakWord(anno.word);
      showToast(`📖 ${anno.word} [${anno.phonetic}]：${anno.meaningZh}`);
    }
  }

  // ------------------------------------------------------------------------
  // 15. 后端 API 配置与测试联通性
  // ------------------------------------------------------------------------
  async function testBackendConnection(showFeedback = true) {
    const statusPill = document.getElementById('backend-status-pill');
    const apiUrl = (state.config && state.config.apiBaseUrl) || 'http://127.0.0.1:8080/api/v1';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const resp = await fetch(`${apiUrl}/user/profile`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (resp.ok) {
        state.backendStatus = 'online';
        if (statusPill) {
          statusPill.innerHTML = '<span style="color: #22c55e;">● 联机成功 (云端实时)</span>';
        }
        if (showFeedback) showToast('🟢 后端服务连接成功！已加载云端数据');
        syncBackendData();
        return true;
      } else {
        throw new Error('服务返回异常');
      }
    } catch (e) {
      state.backendStatus = 'offline';
      if (statusPill) {
        statusPill.innerHTML = '<span style="color: #eab308;">● 本地Mock模式</span>';
      }
      if (showFeedback) showToast('🟡 未连接到远程后端，已自动无缝切换高保真本地驱动');
      return false;
    }
  }

  async function syncBackendData() {
    const apiUrl = (state.config && state.config.apiBaseUrl) || 'http://127.0.0.1:8080/api/v1';
    try {
      const [vRes, pRes, aRes, gRes] = await Promise.all([
        fetch(`${apiUrl}/feed/videos`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`${apiUrl}/reading/publications`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`${apiUrl}/reading/articles`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`${apiUrl}/guess/daily`).then(r => r.ok ? r.json() : null).catch(() => null)
      ]);
      if (vRes && vRes.data && vRes.data.videos && vRes.data.videos.length) {
        window.LINGO_MOCK.videos = vRes.data.videos;
      }
      if (pRes && pRes.data && pRes.data.length) {
        window.LINGO_MOCK.publications = pRes.data;
      }
      if (aRes && aRes.data && aRes.data.articles && aRes.data.articles.length) {
        window.LINGO_MOCK.articles = aRes.data.articles;
      }
      if (gRes && gRes.data && gRes.data.puzzles && gRes.data.puzzles.length) {
        window.LINGO_MOCK.guessPuzzles = gRes.data.puzzles;
      }
      if (state.currentView) {
        renderCurrentView();
      }
    } catch (e) {
      console.warn('Backend sync error:', e);
    }
  }

  function openConfigModal() {
    const modal = document.getElementById('config-modal-overlay');
    const input = document.getElementById('config-api-input');
    if (input && state.config) {
      input.value = state.config.apiBaseUrl;
    }
    if (modal) modal.classList.add('active');
  }

  function closeConfigModal() {
    const modal = document.getElementById('config-modal-overlay');
    if (modal) modal.classList.remove('active');
  }

  function saveConfigModal() {
    const input = document.getElementById('config-api-input');
    if (input && input.value.trim()) {
      state.config.apiBaseUrl = input.value.trim();
      localStorage.setItem('lingo_custom_api_url', state.config.apiBaseUrl);
      testBackendConnection(true);
      closeConfigModal();
    }
  }

  // ------------------------------------------------------------------------
  // 16. 轻量 Toast 提示组件
  // ------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('global-toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 暴露到 window 方便 HTML 内联事件调用
  window.LingoApp = {
    initApp,
    switchView,
    speakWord,
    addWordToVocab,
    removeWordFromVocab,
    answerWatchQuiz,
    verifyGuessAnswer,
    toggleGuessPhotoSelection,
    confirmGuessAnswer,
    nextGuessPuzzle,
    selectPublication,
    setReadingDifficulty,
    showWordAnnotation,
    openConfigModal,
    closeConfigModal,
    saveConfigModal,
    testBackendConnection,
    showToast
  };

  // 页面就绪后立即启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
