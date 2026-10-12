# 唐梨模型路线修订验证（2026-10-09）

> 当前状态：用户于 2026-10-09 选择先不做 Live2D，改用精美静态立绘＋轻量动效。本文保留此前试验记录，不再作为当前生产待办。当前方案见 docs/warm-signal-static-art-plan.md。


旧方案结论：格式检查可通过，美术检查失败；用户反馈人物不像人，最终状态 rejected-art-quality。停止默认打包，保留源文件分析。旧方案从未作为正式 Cubism 模型验收。

本次修改仅限模型工作坊和文档，没有改动游戏运行时、玩家存档和聊天配置。

- 原画预览成功载入 1024×1536 PNG，SVG 保持等比；默认显示完整原画，无独立眼嘴替换。
- 桌面实际点击「放大脸部」「对比旧方案」，检查默认原画与失败方案五官/比例区别。分界滑块键盘 End 实际到 100%，再恢复原画。
- 手机 390×844 视口：实际文档宽 375（扣除滚动条），scrollWidth 同为 375，角色容器 343 宽，未横向溢出。
- 页面脚本语法检查通过；素材清单 JSON 可解析，旧 16 层的状态为 rejected-art-quality。
- 预览证据：warm-signal-screenshots/tangli-original-quality.png。
- See-through 独立环境已安装；Xet TLS 错误切换任务级普通 HTTPS 后完成真实 v2 试跑，会话 80891 实际退出 0，15:55:56 生成 24 层、1280 方形 RGB 8-bit PSD。两个 LayerDiff 30 步阶段与 Marigold 4 步均实际完成。具体进程、来源、时间、补丁与下载方式见 warm-signal-model-implementation.md；仍未导出/验证正式 Cubism 动作。
- v2 原画版本选择与下载地址在桌面实际切换一致；手机宽度 390 时文档宽/scrollWidth 均为 375，无横向溢出。临时手机视口已还原。预览证据：warm-signal-screenshots/tangli-neutral-v2-preview.png。该图是完整原画检查，不能作为拆层或绑定成功的证据。
- review.html 已接入三份真实 PSD：原始层序、层序修订 v1、遮挡修订 v2。实测版本切换后的失败/精修原因和下载文件对应各自版本；实测脸部放大及独立 eyelash-r 层。最新候选明确标记 needs-art-refinement，没有伪装成正式绑定模型。
- 24 层 PSD 实际使用栅格 Alpha 遮罩，导入器正确应用遮罩后再输出 PNG。三版逐层 PNG 原位叠回与 PSD 合成图的白底最大通道差均为 2/255、超过 3 的像素均为 0，输入 hash 全部匹配。层序修订保持 RGB/遮罩/坐标等一致；遮挡修订只改变 bottomwear 指定遮罩区域，全部 RGB 与坐标一致。这些是结构与转换验证，不是动作审美验收。
- 新检查页手机 390×844 实测曾因 SHA256 不换行导致 scrollWidth=479；修复后 clientWidth/scrollWidth 均为 375，临时视口已还原。新的真实脸部对照证据：warm-signal-screenshots/tangli-seethrough-face-v2.png。
- 当前可见缺口：腰部两侧隐藏补绘、颈部接缝、胸前卷发归属，以及完整闭眼/口腔/转头绑定。PSD2Live 原作者源码已实际编译成功，尚不能据此宣称已完成模型。

制作方案、调研来源、分阶段验收及实际使用的 imagegen 提示词见 ../tools/warm-signal/models/tangli/production-plan.md。
