# 唐梨 Live2D 制作方案（2026-10-09）

> 当前状态：用户于 2026-10-09 选择先不做 Live2D，改用精美静态立绘＋轻量动效。本文保留此前试验记录，不再作为当前生产待办。当前方案见 docs/warm-signal-static-art-plan.md。


用户反馈：旧方案人物不像人；要求找到更好的模型制造方法，并保留“不用 Photoshop、由我们制作素材”的约束。

本机落实更新：See-through 真实试跑已成功结束，产出 24 层 RGB 8-bit PSD。原始深度层序与只改层序的版本未通过美术检查；另已制作约束裙腰遮挡的 v2，仍有腰部/颈部接缝和前发归属问题，明确标记待精修。review.html 可查看三个版本、逐层原位对照与下载实际 PSD，preview.html 已提供入口。PSD2Live 原作者源码已本机编译成功，尚未完成正式绑定与 SDK 动作验收。详细实际进展见 `../../../../docs/warm-signal-model-implementation.md`；下方“初始交付”保留为早期阶段记录。

## 本次结论

推荐先试 **See-through 辅助拆层 → 原画保真检查与细拆补绘 → Cubism 正式绑定、修形与导出**。这是待实际验证的生产路线，不是已经成功生成的成品。旧 16 部件独立生图方案未通过用户美术检查，停止用于生产。不能用“PSD 能打开”或文件格式测试通过替代人物质量验收。

## 问题原因与原画基准

旧方案把脸底、眼白、虹膜、睫毛和嘴分别重新生成，再通过部件包围盒缩放对齐。五官比例、鼻子细节、肤色、眼睑边界与画风没有保持同一张原画；完整眼部压缩还把眨眼变成线条。减少动作幅度只能掩盖部分问题，不能修复身份变化。

使用 tangli-master-v1.png（1024×1536 RGBA）作为长相参考。当前原画头部有倾斜，双手靠在一起、卷发交叉和细蕾丝较多；后续正面绑定原画应先修成身体正直、眼睛水平、双臂略离身体、发束边界清楚的中性姿势，保持唐梨脸型、栗色卷发、花夹与暖棕眼睛。当前原画本身也尚未取得最终美术验收。

预览默认等比显示整张原画，支持脸部放大、透明格与原画/旧方案分界对照。旧 PSD 和 PNG 留作失败分析，没有接入游戏；页面没有冒充新的 Live2D 动作或 .moc3。

## 方法比较与实际可用性

| 方法 | 已核实能力 | 本项目判断 |
|---|---|---|
| 同一原画精确拆层 + Cubism | 官方要求按部件分层，并有半自动面部变形器/Angle XY 功能；该功能适用于正面脸 | 质量目标的主路线，生成之后仍须修形 |
| See-through | 原作者开源代码可把单张动漫角色图拆为带遮挡补全的语义图层并导出 PSD；不负责完成绑定 | 最值得先测试的自动拆层辅助，不能承诺保留所有原画细节 |
| ComfyUI-See-through | 有浏览器 PSD 导出、左右拆分、前后发分割与低显存选项 | 无 PS 可视化工作流候选；尚未在这台机器安装或执行 |
| Bunraku | 项目页展示拆层及参数形变；所检查的 GitHub 仓库只有 readme，没有可运行推理实现/权重 | 作为研究方向，暂不作为可部署生产方案 |
| PSD2Live / image2live2d | 都提供自动绑定或导出能力；最新 PSD2Live 原作者源码有模型/网格/编辑/导出实现，原始素材分层仍决定质量 | PSD2Live 已克隆固定提交并实际编译通过；生成、动作及官方 SDK 仍待验证。image2live2d 未运行 |
| Krita | 官方文档说明可读写 PSD 的栅格层等结构 | 不用 PS 的手动精修工具候选，最终 PSD 仍须按 Cubism 要求校验 |

来源：
- [See-through 原作者仓库](https://github.com/shitagaki-lab/see-through)
- [ComfyUI-See-through](https://github.com/jtydhr88/ComfyUI-See-through)
- [Cubism 半自动面部动作](https://docs.live2d.com/en/cubism-editor-manual/face-auto-edit/)
- [Cubism 素材拆分](https://docs.live2d.com/en/cubism-editor-manual/divide-the-material/)
- [Cubism PSD 导入规范](https://docs.live2d.com/en/cubism-editor-manual/reimport-psd/)
- [Krita PSD 支持](https://docs.krita.org/en/general_concepts/file_formats/file_psd.html)
- [Bunraku 项目页](https://bunraku-live2d.github.io/)与[当前代码仓库](https://github.com/SparcAI-Inc/Bunraku)
- [PSD2Live 原作者源码与当前说明](https://github.com/tsunehimatoi/psd2live)；早期调研曾读取其 [旧分叉说明](https://github.com/LeonaDavinci/psdtolive2d)
- [image2live2d 当前状态](https://github.com/Wzhang3912/image2live2d)

## 本机可行性核查

初次调研时实际读取 NVIDIA 驱动：RTX 5060 Ti，16311 MiB 显存，当时空闲 12864 MiB；Python 已有 PyTorch 2.9.0.dev20250905+cu129，CUDA 12.9，可识别 GPU。C 盘当时空闲约 910 GiB。初次尚无 diffusers/gradio，后续已在独立 venv 安装 CLI 所需 diffusers 等依赖，未安装 gradio 或 ComfyUI。硬件符合 See-through README 所述 1280 分辨率约 12–16GB 范围，但不等于拆层推理已成功。

建议独立环境试跑固定种子、1280 分辨率；保留原图、输出图层、绘制顺序及重建 PNG。显存不足先 group offload，仍需评估眼睛、花夹、耳饰和针织细节损失。优先完整精度；不能为了文件生成成功牺牲人物质量。不要改变现有游戏或聊天环境的依赖。

## 制作与验收关卡

1. **中性原画**：正面五官自然、躯干正直；不重新设计长相。先做唐梨一个角色，稳定后再扩展六人。
2. **拆层**：所有图层保持同一画布坐标，不依据独立包围盒任意拉伸部件。左右上/下眼睑、眼白、瞳孔、眉毛、鼻子、上下嘴唇、口腔、耳朵/耳饰、前/侧/后发、颈部、躯干、袖子及手按动作需求细拆；语义层不能直接代替动作层。
3. **遮挡补绘**：补画头发后面的额头、眼皮、肩颈以及交叠衣物/发束；可见五官尽量保留源图内容。自动拆层输出如改变脸部，需要回到原图调整，不接受“相似即可”。任何原图像素回填都必须有正确的遮挡归属与边缘检查，不能全图复制到每层造成重复。
4. **静止保真**：原画和默认姿态并排、叠加、脸部放大检查。重点看眼距、睫毛、鼻子、唇形、脸型、色彩与首饰。文件格式与几何检查只证明结构，不证明好看。
5. **绑定**：Cubism 先搭层级/网格、眼白裁切/瞳孔、眼睑曲线、口腔遮挡；再用半自动功能生成正面脸的 XY 初始形变并逐项修形。头发独立物理，呼吸不能拉动五官。官方 External API 主要用于参数等交互，本次未把它当成自动建模接口。
6. **动作审美**：中性、完整闭眼、半闭眼、开口、微笑、左右/俯仰/倾斜、组合九宫格及连续动作逐帧检查。眼睛不压成细长虫状，鼻子不消失，嘴角不漂移，不露洞、不穿模。以可用小幅范围为首版目标，不能先声称 ±30° 全部合格。
7. **导出验证**：实际在 Cubism 导出 .moc3/.model3.json/贴图、表情与动作，使用目标 Web SDK 渲染进行脸部检查和手机实机性能验证；再接入聊天嘴型和表情。当前没有这一步的产物。

## 初始交付与边界（环境部署之前）

- 已替换 preview.html：原画基准 + 旧方案对照，不再默认展示独立五官拼接。
- 已把 tangli-material-manifest.json 的旧素材状态改为 rejected-art-quality；打包脚本默认拒绝重新生产旧方案。
- PNG 原画、旧部件与失败 PSD 保留可追溯；独立 PSD 解析验证曾证实 RGB/8bit/sRGB/16 层及顺序正确，但用户美术检查失败，最终状态为拒绝。
- 尚未安装或运行 See-through、ComfyUI 或 Cubism，尚无新的 .moc3。没有将试验页面接入游戏。

## 已使用的内置 imagegen 提示词

以下为先前工具调用原文；原画和透明提取保留，第三次独立部件生成失败，不再沿用。没有把 See-through 描述成已执行的 imagegen 调用。


### 完整原画

Use case: stylized-concept. Asset type: original layered character production master for a warm romantic game, to be separated and rigged in Live2D Cubism.
Input image is only an identity and art-style reference: use ONLY the adult woman in the RIGHTMOST COLUMN, Tang Li, age 24, with chestnut long wavy hair, amber brown eyes and little pink flower hair pins. Do not include either of the other two women.
Create ONE complete original front-facing character, upright standing relaxed, waist-up to upper thighs, no furniture, no seated pose. Head vertical, nearly symmetrical eyes, gentle friendly small closed-mouth smile, both hands comfortably low near her waist well away from face. Hair, crown, shoulders, arms and silhouette entirely within canvas with generous transparent margins. Warm detailed Japanese romance game illustration matching her established identity, delicate line art and clean soft shading. Outfit: cream knit cardigan over a simple light peach blouse with a small red ribbon at collar, blue skirt; modest casual daytime clothes. This is a model-production painting, not a card composition. Avoid loose flyaway hair crossing eyes; brows, eyelids and mouth clearly visible, readable face, no extreme foreshortening.
1024 by 1536 portrait composition. Genuinely transparent background. No checkerboard painted in, no background, no text, no labels, no borders, no shadow around cutout, no other person.

### 透明提取

Use case: background-extraction. Edit target: the attached original Tang Li model production painting. Remove ALL brown/black gradient background behind the woman, including between strands and around her silhouette. Output a clean truly transparent RGBA character cutout. Preserve her exact face, hair, flowers, clothing, hands, pose, size and placement. Her skin and clothes must be fully opaque; transparent only outside the character and natural gaps. No painted checkerboard, no ambient backdrop, no glow, no drop shadow. Transparent background, same 1024x1536 portrait canvas.

### 旧部件图集（拒绝）

Use case: precise-object-edit. Asset type: Live2D Cubism material separation sheet, NOT a character poster. Input image is the exact original adult character Tang Li identity/style/outfit reference. Produce 16 fully isolated RGBA material pieces on genuinely transparent background in a precise 4-column by 4-row square atlas with equal square cells, generous transparent gutters. Each piece fully inside its own cell and not touching another. NO words, no cell borders, no full assembled characters, no face thumbnail repeated in every cell.
Read cells left-to-right top-to-bottom:
1: the complete torso, neck, cream cardigan, peach blouse, low hands and blue skirt ONLY, no head/face/hair; extend upper neck behind where head attaches and reconstruct cloth hidden by hair.
2: long wavy chestnut BACK HAIR ONLY, as a complete dense silhouette behind head and shoulders, filling previously hidden areas, no face or clothes.
3: bald face/head with ears ONLY, same identity, warm pale skin, nose and subtle cheek blush; skin smoothly filled where eyes, brows and mouth were. Absolutely NO eyes, lashes, eyebrows, mouth, hair or neck.
4: crown/top FRONT HAIR and swept bangs ONLY, with two pink flower clips; no face, eyes or back hair. Head-hair shape can be hollow under lower edge.
5: left front wavy HAIR LOCK ONLY.
6: right front wavy HAIR LOCK ONLY.
7: image-left almond EYE WHITE ONLY, soft ivory, transparent outside almond.
8: image-right almond EYE WHITE ONLY.
9: image-left amber brown IRIS, pupil and highlight ONLY, isolated oval.
10: image-right amber brown IRIS, pupil and highlight ONLY.
11: image-left upper/lower LASHES and eyelid line ONLY, no skin, no eye white or iris.
12: image-right upper/lower LASHES and eyelid line ONLY.
13: image-left EYEBROW ONLY, chestnut brow hairs.
14: image-right EYEBROW ONLY.
15: open MOUTH INTERIOR ONLY, small warm dark mouth cavity, a little tooth band, no face or outer lips.
16: CLOSED soft peach-red LIPS ONLY, gentle smile, transparent outside lips, no face.
For all material pieces, preserve matching original painting colors, lighting and meticulous anime romance illustration detail. Parts should be painted completely including occluded area suitable for deformation. Enlarge facial pieces in their cells for clear texture detail; each isolated piece will be individually rescaled in Photoshop. The atlas is not an exploded person silhouette, it's sixteen separate clean materials. Flat transparent background without cast shadows or gradient. Prefer 2048x2048 square high resolution. No labels or text.

