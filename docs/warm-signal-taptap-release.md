# 心动来信 · TapTap 发行记录

更新：2026-10-14。首次提审后根据用户提供的官方物料文档撤回并补齐素材，最新状态以文末补充记录为准。档期为审核通过后立即上线。

## 应用与资料

- 开发者主体：晴川拾光工作室，developer_id `493296`。
- 应用：《心动来信》，app_id `975366`，simulation，移动端 H5。
- 草稿修订 / 审核单：`1075281`；版本名 `V-20261014`。
- 用户已明确同意签署《创意工坊内容授权协议》，官方返回 `signed`；不保存实名资料或凭据。
- 简介、开发者的话、工作室名及宣传语已保存，说明原创角色、AI 美术、原创合成配音、模拟充值，以及 AI 聊天的可选外部服务。
- Android 与 iOS 均为“提供游玩”。已绑定原创信封图标。
- 用户四张原图保留；发布副本按主页 → 许愿树 → 朋友圈 → AI 聊天顺序，等比补边为720×1280。再补一张实际羁绊组合操作图，共五张；没有拉伸、重画或改字。
- 初次 CLI 将宣传图/实机视频标为 suggested，用户提供的官方文档实际要求必填。现已按文档补齐横版宣传图、配套方图、规范截图与实际玩法视频；不可因 CLI 初次预检通过就称素材完整。

[开发者后台](https://developer.taptap.cn/v3/493296/app/975366/store/update)。CLI 使用官方授权，凭据只由 CLI 管理，没有写入项目。

## 实际提审包

路径：`artifacts/taptap/20261014-safe-area/warm-signal-taptap-h5.zip`。

- ZIP 294,437,705 字节；SHA256 `f2fd74368836c7189f6fcb8f7015a20eb9cc8fd4796985c3450ddd82c0a925c6`。
- 单个 `game/` 根目录，入口 `game/index.html`，竖屏。
- 5481 份文件、5187 份预制配音；发行副本为单声道 24kHz / 48kbps MP3，保留所有配音和原画，原项目音频未修改。
- 官方 H5VersionId `301842`、H5PackageId `85790`，已替换旧包 `301488` 并绑定 main。
- 官方 ZIP 检查 violations / warnings 均为空。
- 包含本次摄像头、刘海、灵动岛与手势条安全区适配；普通浏览器默认不添加猜测留白。
- 未包含浏览器存档、API Key、模型权重、Live2D/3D 实验、原始 WAV、生成脚本和未引用的 PNG 原稿。

构建命令：

```powershell
python tools/package-warm-signal-taptap.py --voice-bitrate 48k --output artifacts/taptap/20261014-safe-area
```

构建器不覆盖已有发行文件；复建应选择新目录。初版 ZIP 因超过官方 300MB 限制而没有上传，随后仅压缩发行副本的语音。

## 验证和试玩

- 单独端口与正式存档隔离，检查首页、许愿树、弹窗和聊天的安全区边界；10 项逻辑检查通过。
- 摄像头为浏览器模拟预览，尚未完成真实 TapTap 手机摄像头及键盘验证。兼容选项见 `docs/warm-signal-safe-area.md`。
- 不测试模拟充值；不改玩家正式存档、不测试真实付款。
- 手机自测二维码：`artifacts/taptap/20261014-safe-area/taptap-test-qr.png`，指向已上传的新包；它是测试入口，不代表正式上线。
- 发布过程 JSON、校验清单和原始截图位于忽略版本控制的 `artifacts/taptap/` 中。

## 美术、配音、音乐

图标由内置 imagegen 新生成，源文件 `tools/warm-signal/assets/taptap-icon-v1.png`，完整提示词见 `docs/warm-signal-taptap-icon-prompt.md`。六位成年女主、男主、旁白和剧情配角使用 13 条原创 Qwen3-TTS 合成声线，手机播放预制 MP3，不依赖实时 TTS 模型。三首 Scott Buckley 音乐按 CC BY 4.0 使用，署名随包保留在 `game/warm-signal/assets/music/CREDITS.md`。

采用 H5 保留现有 HTML/CSS/JavaScript 玩法与 2D 美术。本次不属于 Maker/Spark Lua 原生项目发布；没有初始化 Lua 项目或安装 MCP 配置。游戏资料提审成功也不等于已正式上线或获得商店推荐，最终以 TapTap 审核状态为准。

发布工具：官方 `@taptap/cli@2026.10.12`。

## 官方物料文档补齐

2026-10-14：用户指出宣传图为空，并提供官方[游戏物料要求](https://developer.taptap.cn/docs/store/release/publish/material/)。已撤回原审核回到同一草稿1075281，补齐并读回确认四个字段：

- banner_4：1920×1080，JPG，小于4MB，仅游戏名，主要角色及标题避开中心4:3裁剪线。
- square_promo_image：1440×1440，JPG，小于4MB，匹配横版同一场景和三位角色。
- screenshots：5张720×1280、同一比例的真实界面，原4张等比输出另补核心制作玩法。
- gameplay_demo_video：videoId5965571，540×960，H.264，40.77秒，展示实际专家选择、羁绊配置、能力筛选和三星拍摄结果；无额外配音字幕或商业化内容。

新素材源文件与完整生成提示词见`docs/warm-signal-taptap-materials.md`。视频为浏览器实际画面采集和停顿剪辑，不冒充手机真机测试；未测试模拟充值。原游戏包仍绑定301842，包含安全区适配。

最新结果：素材四个字段已读回确认；复核快照ready，preaudit_passed=true，blockers/warnings均为空。补齐素材后重新提交已被接受，最终查询为reviewing（审核中），尚未正式上线。审核单1075281，版本V-20261014。
