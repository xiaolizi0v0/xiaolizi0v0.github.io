# 静态立绘与轻量动效策划

2026-10-09，用户明确选择「先不做 Live2D，改用精美静态立绘＋轻量动效」，随后补充保留眨眼压缩和嘴部拉伸。这项决定取代当前模型拆层、补绘、绑定和正式导出的生产计划；历史试验文件保留，不再作为当前交付任务。

## 画面与素材

六位成年女性继续各保留两套服装。完整立绘作为显示与轻量效果的基础，保持等比；既有图集采用独立裁切框，避免相邻角色混入。唐梨日常、居家两套采用独立 1024×1536 RGBA 原画及 WebP，脸部与发型保持一致，服装分别为奶油红结开衫与粉色居家针织衫。其他五人沿用已制作的两套精细透明插画，单格 418×627；不把图集单格宣称为高清独立原画。

资源：`tools/warm-signal/assets/tangli-{daily,home}-still-v1.{png,webp}`。日常来自已验收完整原画 tangli-neutral-v2；居家使用内置 imagegen 参考日常原画生成，原始 PNG 保留，WebP 只做格式压缩。居家生成源为 exec-046b370d-8179-439c-8f0b-ce0b4a31d138.png。提示词见本文末尾。

## 动效

- 入场：0.7 秒淡入。
- 呼吸氛围：6 秒循环，仅整张图向上移动 1.5 像素并等比放大至 1.003，不做身体扭转和发丝变形。
- 轻触、牵手：原有台词和互动规则保留，短暂浮起一个心形。
- 靠近：整体等比缩放；换装及场景切换不改变购买/拥有数据。
- 眨眼：按用户补充要求保留眼部局部压缩，约每 4.7 秒一次。
- 说话：流式回复期间及设备朗读时，嘴部做小幅局部拉伸；设备朗读同时显示「朗读中」。这属于轻量图像效果，没有分层眼皮或口腔。
- 天气、灯光、音乐及计时继续沿用。隐藏页面暂停舞台动画；游戏关闭动画或系统启用减少动态效果时，停止上述循环和装饰动效。

character-art.js 管理完整立绘和整体动效；character-rig.js 仅恢复用户需要的眨眼压缩/嘴部拉伸，不启用视线、转头、发丝及身体网格动作。轻量 WebGL 效果不可用或动画关闭时，显示原始 SVG 静态立绘。此实现不需要拆层、模型权重或正式 Cubism 绑定。AI 设置和聊天历史、角色、装扮、资源、计时及奖励规则不迁移、不重置。

## 验收

自动检查 12 套服装的真实图片文件、原始 PNG 尺寸、RGBA、裁切范围、区域唯一性；原有游戏、公司、卡面、陪伴和 AI 测试一起运行。浏览器核对六人换装预览、唐梨两套高清立绘、角色面部完整显示、交互/聊天入口、手机和短屏布局、减少动画与刷新恢复。实际结果记录在 warm-signal-validation.md；不以静态图片校验冒充功能验收。

本次只调整陪伴视觉方案，整款游戏的完整内容与原作全部历史玩法目标仍在进行中。

## 居家立绘完整提示词

Use case: edit an existing original adult romance game character into a matching alternate outfit, production transparent portrait asset. Edit target is Tang Li neutral v2 reference. Preserve her EXACT recognizable adult 24-year-old face, warm brown eyes, chestnut long naturally wavy hair, pink flower hairclips on image right, daisy earrings, delicate necklace, facial proportions, warm soft painterly semi-realistic anime finish. Keep a natural slight smile, anatomical shoulders, hands, fingers, upright relaxed standing pose, front view, looking gently toward viewer. One woman only, head to mid-thigh, centered in a portrait 1024x1536 canvas with entire hair and both hands inside frame and a little top and side margin. Change outfit to her cozy home variant: soft blush pink cable-knit cardigan worn normally on both shoulders, small satin ribbon bow over a cream modest camisole, blue floral skirt with delicate lace hem. Keep both arms relaxed at her sides, natural elegant hands. Render exceptionally fine eyes and facial shading, consistent scale and framing with reference, warm cream blush palette, professional premium romance game standing illustration. Genuine transparent background with clean alpha, no room, no colored gradient or opaque shadow plane, no text/UI, no collage, no parts splitting, no motion deformation. This is a standalone polished static full character illustration.


## 本轮验证补充

唐梨五官按 1024×1536 原画测量并换算到虚拟网格；眼部压缩和嘴部拉伸都改为紧凑范围，去掉影响鼻子、脸颊和下巴的长尾。眼部范围横向 ±13、纵向 ±9，嘴部横向 ±14、纵向 ±6.5（418×627 虚拟单位），边缘平滑回归原图。嘴部增加密集网格，避免粗网格牵动周围脸部。居家脸部已在浏览器定格检查，证据见 tangli-local-blink.png / tangli-local-mouth.png；这是轻量纹理变形，未补独立眼皮或口腔素材。完整五套测试 76 项通过，其余角色的几何检查通过，但尚未逐一进行所有服装的定格审美验收。
