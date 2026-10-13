# 晴川背景音乐

2026-10-13，版本 `20261013-bgm-1`。

## 选曲与来源

使用作曲家 Scott Buckley 自己的 Creative Commons 音乐库，三首均按 CC BY 4.0 署名使用。作者允许满足署名要求的商业使用；游戏音乐面板和分发文件均包含作者、曲名、来源及授权链接。

| 曲目 | 场景适配 | 时长 | 来源 |
|---|---|---|---|
| Childhood | 主页、街区、公司及其他日常 | 2:17 | [作者曲目页](https://www.scottbuckley.com.au/library/childhood/) |
| Elementary | 主线阅读、约会、手机、传闻与心动约期 | 2:17 | [作者曲目页](https://www.scottbuckley.com.au/library/elementary/) |
| Reverie | 在你身边、睡眠陪伴、温馨小屋 | 3:44 | [作者曲目页](https://www.scottbuckley.com.au/library/reverie/) · [作者对曲风的说明](https://www.patreon.com/musicbyscottbuckley/posts/new-library-35326900) |

选曲依据作者对钢琴、弦乐、亲密与梦幻氛围的描述，以及当前游戏的温暖主题。原始 MP3 下载后直接保存在 `tools/warm-signal/assets/music/`；没有剪辑或重新编码，游戏只调整播放音量、淡入淡出及完整循环。素材署名见 [CREDITS.md](../tools/warm-signal/assets/music/CREDITS.md)，精确下载地址、字节数、SHA-256 和授权地址见 [sources.json](../tools/warm-signal/assets/music/sources.json)。

## 游戏操作

主页「♫ 音乐」和设置「背景音乐」可打开音乐面板。默认随场景切换、音量28%；首次真实点击或键盘操作后开始播放。未发生用户操作时不下载或播放音乐。手动选曲会关闭随场景切换，可随时重新开启。

支持播放/暂停、0～100%音量、三首选曲、淡入淡出和完整循环。设置单独保存在本设备，不改变游戏进度与资源。切到后台立即暂停，返回后继续，手动暂停不会因页面跳转而恢复。设备朗读时降低音乐音量，朗读结束后恢复。

陪伴页三段原有短旋律接入同一个音乐播放器：保留原有音乐选择与解锁进度，试听显示真实曲名/作者。试听临时覆盖全局曲目，离开后恢复场景或手动选择；不会同时启动两个音乐播放器。陪伴页手动「停止音乐」会暂停背景音乐。

## 验证

- 三个原始文件合计约19.9MB；FFprobe确认均为44.1kHz立体声MP3，完整FFmpeg解码无错误，SHA-256与下载记录一致。
- 九项音频控制逻辑测试通过，覆盖首次操作限制、不重启同一曲目、场景/手动切换、设备偏好、后台/手动暂停、陪伴临时曲目恢复、异步播放竞态、失败重试及淡出时拖动音量。
- 独立浏览器检查实际播放三首音乐，确认解码就绪、播放时间推进、循环、音量滑块50%、自动约会/陪伴切换、暂停与跳转后保持暂停、恢复及320×568布局。
- 正式主页成功加载并播放Childhood：只有一个音乐元素、readyState=4、播放时间推进；打开音乐面板前后玩家钱包文本相同，控制台无错误或警告。
- 320×568 音乐弹窗操作栏 y=484～529，可见且无页面横向溢出；390×844 正式音乐面板保存截图。
- 本次只运行指定背景音乐测试，没有运行模拟充值或全量游戏测试。实际语音朗读压低、手机系统后台策略与陪伴页完整消费流程未做本次浏览器操作，按代码分支及已有系统保留。

证据：`docs/warm-signal-screenshots/bgm-v1/` 中 `audio-check.json`、`browser-check.json`、`formal-integration.json`、`static-check.json`、`mobile-320.png`、`formal-music-panel.png`。独立音乐检查页为 `tools/WarmSignalMusicReview.html`，不读取正式游戏存档或正式设备音乐偏好。
