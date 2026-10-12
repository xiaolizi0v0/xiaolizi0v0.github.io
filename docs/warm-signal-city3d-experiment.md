# 晴川三维角色试验

## 已停止：全面改用 2D

2026-10-12，用户决定“不要 3D 模型，全部都是 2D”。三维建模与接入工作停止；原预览入口自动转到 [2D 角色画册](../tools/warm-signal/city-art-preview.html)。历史 GLB、建模脚本及试验文件保留备查，不被当前游戏加载。正式街区已由 Canvas 2D 替换，详见 [全 2D 制作说明](warm-signal-2d-plan.md)。

以下为停止前的历史试验记录，原有待制作三维模型/绑定动画的计划不再执行。

## 历史试验：2026-10-12 toon-v4：小眼造型与闭合网格

[预览入口](../tools/warm-signal/models/city3d/preview.html)默认载入小眼睛试作，可切换上一版大眼造型，并分别查看左右侧。正式游戏仍使用既有 2.5D 图集，本轮没有替换正式角色或更改正式存档，没有进行模拟充值测试。

### 当前结果与限制

本轮实际查看并引用用户提供的 Q 版参考图，确认上一版眼睛过大、头发细碎且材质偏亮。先制作了小眼平面造型 v3，再以旧三维造型为体积约束，只调整脸部绘制与表面风格，生成当前正面 v4。小眼睛与哑光方向更接近参考，但模型仍未达到完整游戏角色美术要求。

- 当前项目 GLB：`tools/warm-signal/models/city3d/tangli-toon-prototype-v4.glb`，4580848 字节，**24000 个三角面**；原网格 11996 顶点，带 UV 接缝导出后 20234 顶点。
- `simplify-geometry.py` 从封闭体素网格去除极小连通碎块，使用 20 次 Taubin 平滑与保拓扑减面。最终 Blender 网格 boundary/non-manifold 边均为 0；导出 GLB 经 UV 接缝合并后也实际验证 watertight=true、windingConsistent=true。原型没有骨骼或动作。
- 身体仍使用正背投影烘焙的 2048×2048 贴图；五官与相机使用独立 UV 直接读取 1024×1536 原图，避免再经过身体图集重采样。两个 PNG 均内嵌在 GLB 中，无外部资源依赖。704 面为脸部、327 面为相机、22969 面为身体材质。
- `analyze-face.py` 只读取原图、导出脸部区域的 JSON 元数据；`paint-toon-mesh.py` 只调整网格材质与 UV，不改写设计 PNG。源图 SHA256 验证未改变。
- 运行 `node tools/warm-signal/models/city3d/inspect-prototype.cjs tangli-toon-prototype-v4 city3d-toon-v4`，验证 GLB/BIN 长度、材质实际使用的 UV 集、PNG 尺寸、源图哈希、面数与 HTML 引用，errors=[]。
- 浏览器实际显示小眼模型与 24000 面，切到旧版显示 23993 面，再恢复新版；左右视角可用。白模状态下切换两个模型后恢复彩色，材质正确恢复。390×844、320×844 均无横向溢出，人物头发与鞋底完整；console error/warn 为空，临时视口已复原。
- 证据目录：`docs/warm-signal-screenshots/city3d-toon-v4/`。包含六角度实际渲染、普通窗口/手机/窄屏截图、GLB 检查、导出后拓扑、布局与侧面着色对齐检查。当前独立 Blender 工程位于 `C:/Users/xiaolizi0v0/.codex/warm-signal-model-runtime/city3d-runs/tangli-toon-hybrid-v1/character-review.blend`。

**仍不可以接入正式角色。** 侧面头发与外套仍串色，发饰附近有残影，裙摆和腿的交界不干净，整体需要修形、材质分区与绑定动作。闭合只证明拓扑的一项检查通过，不能证明形体或美术质量达到参考。其他角色三维化、骑行、设施动作与场景精修也未完成，整体目标保持进行中。

下一阶段优先修整或重建干净的脸部、裙摆和衣物形体，并把头发/衣服/皮肤分为清晰材质区，再绑定；不继续将独立生成、几何未对齐的四视图直接叠加到网格。只有多角度都无明显串色、拉伸、重影和穿插，且动作验证通过后才接入游戏。

### 未通过的试验及改变下一步的证据

1. 小眼平面图 v3 的独立四视图，风格较接近参考，但单图建模后形体起伏较多；四个独立设计图与网格轮廓不一致，投影产生重复发饰、五官和材质碎片。试验 GLB `tangli-reference-prototype-v1.glb` 保留用于复查，未通过质量检查，不在当前预览选项或游戏中使用。
2. 用实际白模侧面作编辑底图，要求只上色；输出仍改变手臂、裙摆与比例。与白模归一画布后的 silhouette IoU 仅 **0.7983**，下半身 **0.7330**，因此没有用作贴图。这一结论只针对这次实际编辑，不声称所有图像模型均无法对齐。
3. 纯分区顶点色减少纹理重影，但分区边界粗糙、细节损失，仍未达到要求；该试验保存在 runtime 的 `tangli-toon-solid-v1/`。当前保留独立脸部 UV 的改进，身体仍为已说明局限的正背烘焙。

### 本轮图像产物、模式与完整提示词

均为内置 image_gen 编辑，transparent_background=true；保留生成原件，未使用 CLI、PS 或脚本修改源 PNG。用户风格参考为 `C:/Users/XIAOLI~1/AppData/Local/Temp/codex-clipboard-c661b051-f8f2-4bd2-9267-4015c9fa9652.png`。当前正式试作消费的是正面 v4 与此前背面 v2，v3 四图仅作造型研究。

|用途|项目文件|生成原件文件名（同一 generated_images 线程目录）|
|---|---|---|
|小眼平面正面研究|`tools/warm-signal/models/city3d/tangli-toon-source-v3.png`|`exec-11e2a279-4a2a-49ee-b2df-efa380e507fb.png`|
|平面背面研究|`tools/warm-signal/models/city3d/tangli-toon-back-v3.png`|`exec-3d009c03-fa5a-4153-8afc-1127b0bad2a1.png`|
|平面左侧研究|`tools/warm-signal/models/city3d/tangli-toon-left-v3.png`|`exec-0292a1fd-e036-4dc8-ac4a-45a2ae6abfce.png`|
|平面右侧研究|`tools/warm-signal/models/city3d/tangli-toon-right-v3.png`|`exec-df37850e-52e5-414d-a07a-1067fd7240d5.png`|
|当前小眼三维造型输入|`tools/warm-signal/models/city3d/tangli-toon-source-v4.png`|`exec-6db65690-42d9-44c3-b2c5-684a52facb63.png`|
|未采用的侧面上色试验|仅保留生成原件，未作项目贴图|`exec-670af644-659e-4c8a-9573-eb15bf0816be.png`|

以上原件的绝对目录：`C:/Users/xiaolizi0v0/.codex/generated_images/01a11c44-2a61-72b0-af27-3ac60a66f2c7/`。当前 v4 引用顺序为旧正面 v2（编辑目标）、小眼平面 v3（脸部画法）、用户参考（整体风格）；v3 正面引用用户参考与旧正面 v2；v3 三个转面引用 v3 正面与用户参考；侧面上色引用 runtime 中 `tangli-compact-clay-v3/left.png` 与 v4 正面。

#### 小眼平面研究

```text
Use case: style-transfer. Image 1 is the USER'S CHIBI MOBILE GAME STYLE REFERENCE. Image 2 is the edit target, original Tang Li character identity. Redesign Image 2 to match Image 1's soft simple anime mobile-game avatar aesthetic. Do not copy the two reference characters, clothes, hats or background.
CRITICAL STYLE CHANGE: replace the enormous sparkling glass doll eyes with SMALL SIMPLE chestnut-brown anime eyes, each eye only about 10 to 12 percent of the full head width, like the female reference. Tiny oval dark brown irises, one restrained highlight, delicate lashes, very small mouth and nose. Calm friendly expression. Matte flat painted skin with soft peach cheeks. Hair is smooth broad stylized solid clumps with shallow grooves, not thousands of fine hair strands. Low-contrast warm pastel colors and soft cel shading. Not a glossy resin collectible, not a Pixar baby, not a photorealistic toy, no giant gemstone eyes. Match the reference face design, chunky proportions, simple game materials and clean silhouettes.
Preserve Tang Li's original recognizable design: adult female photographer represented as a compact approximately 2.2-head-tall chibi avatar, chestnut wavy LOW SIDE PONYTAIL on her anatomical left (image right from front), peach flower hairclip on image right, caramel short coat over ivory blouse, dark muted teal pleated skirt, cream socks, brown Mary Jane shoes, small brown camera hanging on neck strap. Simplify flower to one clean flower and camera to a readable little lens. No lace or microdetails, no floating wisps or fine finger geometry. Oversized head, tiny compact torso, short legs, rounded shoes and simple mitten hands, no long fashion-doll proportions.
ONE single FRONT ORTHOGRAPHIC full body view. Upright relaxed symmetrical A-pose, arms 25 degrees away from torso, both mitten hands separate from skirt, both feet spaced slightly and all soles visible. Camera at chest height, minimal perspective. Soft neutral even studio illumination. Entire figure centered inside portrait canvas with 10 percent transparent clearance on every side. Genuine transparent alpha background, no environment, no ground, no shadow, no text or duplicates.
```

#### back 视图研究

```text
Use case: identity-preserve. Input 1 is the edit target and exact character identity/style, original adult photographer Tang Li represented as a chibi; input 2 is only the user's mobile game style reference. Produce one coherent rotated model-reference view of the exact character in input 1. Preserve its small simple brown oval eyes, tiny mouth, matte painted skin, broad smooth chestnut hair clumps, peach flower clip and low side ponytail on her anatomical LEFT, caramel short coat, ivory blouse, dark muted teal skirt, cream socks, brown Mary Janes and compact camera on brown neck strap. Same compact approximately 2.2-head body proportions and relaxed low A-pose. No fine hair, no lace, no glass eyes, no glitter or glossy resin. Soft low-contrast cel shading matching target and reference. Whole body from hair top to soles centered in portrait with 10% transparent clearance. True orthographic view, upright head/body, no tilt or perspective, soft neutral even illumination. Genuine transparent alpha background, no floor, shadows, scenery, labels, grids, duplicates or text. Exactly one BACK VIEW, turned 180 degrees from the target. Only the back of head and clothes, absolutely no face, eyes, eyebrows or mouth. Ponytail and partially occluded flower clip are at IMAGE LEFT in this rear view. Jacket back plain with a central seam, camera strap at rear neck but camera itself hidden on front. Both hands separated from skirt, complete heels and soles.
```

#### left 视图研究

```text
Use case: identity-preserve. Input 1 is the edit target and exact character identity/style, original adult photographer Tang Li represented as a chibi; input 2 is only the user's mobile game style reference. Produce one coherent rotated model-reference view of the exact character in input 1. Preserve its small simple brown oval eyes, tiny mouth, matte painted skin, broad smooth chestnut hair clumps, peach flower clip and low side ponytail on her anatomical LEFT, caramel short coat, ivory blouse, dark muted teal skirt, cream socks, brown Mary Janes and compact camera on brown neck strap. Same compact approximately 2.2-head body proportions and relaxed low A-pose. No fine hair, no lace, no glass eyes, no glitter or glossy resin. Soft low-contrast cel shading matching target and reference. Whole body from hair top to soles centered in portrait with 10% transparent clearance. True orthographic view, upright head/body, no tilt or perspective, soft neutral even illumination. Genuine transparent alpha background, no floor, shadows, scenery, labels, grids, duplicates or text. Exactly one strict LEFT SIDE PROFILE of the character's anatomical LEFT side, turned 90 degrees. Her face and small nose point to IMAGE LEFT. The peach flower clip and full low side ponytail are on the visible near side. The compact camera protrudes in front of her chest on IMAGE LEFT; ponytail hangs behind shoulder on IMAGE RIGHT. One near-side arm/hand visible, far arm may be occluded, same relaxed A-pose viewed from side. Near and far shoes overlap naturally in profile. No three-quarter view, no front view.
```

#### right 视图研究

```text
Use case: identity-preserve. Input 1 is the edit target and exact character identity/style, original adult photographer Tang Li represented as a chibi; input 2 is only the user's mobile game style reference. Produce one coherent rotated model-reference view of the exact character in input 1. Preserve its small simple brown oval eyes, tiny mouth, matte painted skin, broad smooth chestnut hair clumps, peach flower clip and low side ponytail on her anatomical LEFT, caramel short coat, ivory blouse, dark muted teal skirt, cream socks, brown Mary Janes and compact camera on brown neck strap. Same compact approximately 2.2-head body proportions and relaxed low A-pose. No fine hair, no lace, no glass eyes, no glitter or glossy resin. Soft low-contrast cel shading matching target and reference. Whole body from hair top to soles centered in portrait with 10% transparent clearance. True orthographic view, upright head/body, no tilt or perspective, soft neutral even illumination. Genuine transparent alpha background, no floor, shadows, scenery, labels, grids, duplicates or text. Exactly one strict RIGHT SIDE PROFILE of the character's anatomical RIGHT side, turned 90 degrees. Her face and small nose point to IMAGE RIGHT. Flower clip and side ponytail are on the far side, mostly occluded; only the back edge of the ponytail may be visible on IMAGE LEFT. Camera protrudes in front of chest on IMAGE RIGHT. One near-side arm/hand visible, far arm may be occluded, same relaxed A-pose viewed from side. Near and far shoes overlap naturally in profile. No three-quarter view, no front view.
```

#### 当前三维小眼正面 v4

```text
Use case: precise-object-edit / style-transfer. Image 1 is the EDIT TARGET, a three-dimensional character render of original Tang Li. Image 2 is ONLY the desired SMALL EYE FACE PAINTING reference. Image 3 is ONLY the user's mobile game art-style reference.
Change ONLY the face painting and surface finish of Image 1. Keep the entire 3D geometry, head/body proportions, chunky hairstyle, face silhouette, pose, clothes, camera, framing, view angle, object placement and dimensional shaded volume of IMAGE 1 unchanged. This must remain a clearly THREE-DIMENSIONAL TOON MOBILE GAME MODEL render, with rounded sculpted volumes and gentle directional shading; do not turn it into a flat 2D illustration or sticker.
Replace Image 1's enormous sparkling glass-doll eyes with the SMALL SIMPLE BROWN OVAL EYES of Image 2: each eye roughly 10 percent of head width, no crystal iris, no huge black eyelashes, no glossy eyeball bulges, no recessed eye sockets. The facial surface is smooth continuous gently curved skin with PAINTED ON small eyes, tiny eyebrows and tiny mouth. Face feels relaxed and friendly like Image 3. Matte skin, very soft cheek blush. Broad matte chestnut hair clumps, low-contrast cream/caramel/teal clothing. No glitter, no glass or resin gloss, no dense fine hair texture. Preserve original flower clip, low side ponytail, neck-strap camera and all clothing exactly.
Single FRONT ORTHOGRAPHIC complete head-to-shoe-solves figure, identical relaxed low A-pose and neutral studio illumination as Image 1. Whole figure inside portrait frame with clear transparent margins all sides, no cropping. Genuine transparent alpha background. No environment, ground, shadow, text, duplicates or props beyond the target's camera.
```

#### 未采用的几何约束侧面上色

```text
Use case: precise-object-edit. IMAGE 1 is the exact EDIT TARGET: an orthographic LEFT PROFILE clay rendering of an actual 3D mesh. IMAGE 2 is ONLY the character's color/material identity reference.
COLOR/TEXTURE IMAGE 1 ONLY. Lock Image 1's exact geometry, silhouette, proportions, pose, head position, hairstyle shape, flower location, camera location, arm and hand positions, skirt edge, leg/shoe shape, orthographic viewing direction, framing and transparent empty margins. Every silhouette point and part must remain in the same relative pixel coordinate as Image 1. Do not reshape, enlarge, re-pose, turn or redraw the model. Do not reveal parts hidden in the clay view. Do not change to three-quarter view. Keep the character occupying exactly the same fraction of canvas as Image 1.
Paint the clay with Image 2's warm matte mobile-game colors: chestnut-brown hair and low side ponytail, peach flower clip, smooth peach skin with one small painted brown oval eye visible in profile, tiny eyebrow and tiny mouth, camel short jacket, ivory blouse and cuffs, dark muted teal skirt, cream socks, brown Mary Jane shoe and brown/silver compact camera. Face looks to IMAGE LEFT. Ponytail is the bulky rear shoulder volume on IMAGE RIGHT; that ENTIRE ponytail volume is brown HAIR, not a sleeve or coat. Preserve the clay-defined camera and near arm. Keep the exact solid 3D volumes and soft shaded studio finish, no glossy resin or glitter, no large eye.
Return ONLY the colored version of Image 1, same portrait aspect ratio 2:3, full body and exact same layout. Genuine transparent alpha background. No text, no extra figure, no scenery, no ground or shadow. This image will be projected back onto the exact mesh; geometry and pixel alignment are critical.
```

## 历史：compact-2



## 2026-10-12 compact-2：可旋转的三维试作

入口：[独立造型预览](../tools/warm-signal/models/city3d/preview.html)。正式游戏角色未被本试作替换；现有 2.5D 同行装仍保留。

- 唐梨新正/背造型图改为约两头身、大头短腿、圆润发束。内置 image_gen 编辑，两个 1024×1536 RGBA 文件复制到项目；源图没有用脚本修改。
- 新输入实际生成 234744 顶点、470222 面的未贴图网格，耗时 65.42 秒。voxel 体积封闭后中间网格 watertight=true；后续减面后的最终网格仍有 15 条 boundary/non-manifold 边，不能称最终模型已经封闭。
- `close-geometry.py` 处理三维体素；`prepare-character-v3.py` 在独立 Blender 工程中重采样、减面，按表面朝向与射线遮挡混合正背投影和侧面基础色，再以 EMIT 烘焙到独立 UV。不是 Hunyuan 纹理模型，也没有改写设计图 PNG。
- 项目最终 GLB：`tools/warm-signal/models/city3d/tangli-compact-prototype-v2.glb`，2518272 字节，**23993 个三角面**；导出后含 UV 接缝的顶点 18850，Blender 原网格顶点 12008。内嵌一张 2048×2048 PNG 贴图，无外部资源、骨骼或动画。
- `inspect-prototype.cjs` 验证 GLB/BIN 边界、实际面数、UV 范围、内嵌 PNG、HTML 引用及设计图 SHA256，errors=[]。报告写入 `docs/warm-signal-screenshots/city3d-compact-v2/glb-inspection.json`。
- 浏览器实际载入 GLB 并旋转查看正/侧/背，切换白模；390×844 检查无横向溢出、模型完整显示，console error/warn 为空；桌面与手机截图已保存，临时视口已复原。没有操作正式存档或充值功能。

**质量仍未达接入标准。** 裙摆破碎与硬切材质斑块有明显改善；仍有侧面发饰残影、头发与外套的颜色串位、脸缘投影不准、小开口及无绑定动作。只能作为真实三维试作审阅，不能把设计图效果说成模型已经实现，也未达到用户参考的完整游戏美术质量。后续需要更准确的多视图贴图与人工修形，再绑定动作；骑行、游乐设施与场景美术也待继续。

当前试作记录：`C:/Users/xiaolizi0v0/.codex/warm-signal-model-runtime/city3d-runs/tangli-compact-material-v4/`；包含实际四角度渲染、烘焙纹理、Blender 工程和报告。四角度 PNG/报告亦保存在 `docs/warm-signal-screenshots/city3d-compact-v2/`。此前的整面投影与硬切材质失败版本留在 runtime 中，未接入游戏。

### 当前造型图与提示词

均使用内置 image_gen 编辑，transparent_background=true。正面引用旧 `tangli-toon-source-v1.png`；背面引用已查看的新正面图。输出保留原件，项目路径如下：

- 正面：`tools/warm-signal/models/city3d/tangli-toon-source-v2.png`；原件 `C:/Users/xiaolizi0v0/.codex/generated_images/01a11c44-2a61-72b0-af27-3ac60a66f2c7/exec-ca05d492-216e-44de-80d8-ea95082b4041.png`。
- 背面：`tools/warm-signal/models/city3d/tangli-toon-back-v2.png`；原件 `C:/Users/xiaolizi0v0/.codex/generated_images/01a11c44-2a61-72b0-af27-3ac60a66f2c7/exec-743272f8-8920-4109-8c8e-2bab59a3d59e.png`。

正面最终提示词：

```text
Use case: identity-preserve. Reference is the original adult Tang Li (age24) photographer design. Redesign the single full-body character into a premium mobile romance game SUPER DEFORMED TOON 3D avatar, with EXACTLY 2.1 HEADS TOTAL HEIGHT. Her oversized head including hair occupies 48% of full height; her entire neck-to-shoes body occupies only52%. Squat compact torso, very short legs, big rounded shoes, tiny mittenlike hands with one thumb. NOT a tall fashion doll. Preserve chestnut low side ponytail, peach blossom hairclip, amber eyes, caramel short coat, ivory blouse, dark muted teal skirt, cream socks, brown Mary Janes, compact neck-strap camera. She is adult portrayed as chibi.
This is a 3D modeling input render: smooth solid rounded geometry with broad chunky hair locks, simple clean cel-shaded painted anime face, soft matte colors. Eliminate all floating fine hair strands, wisps, tiny thin curls, lacy hems and microdetails. The ponytail is a full solid lobed volume, connected to head, with three or four large sculpted waves and no holes or ribbon-thin strands. Coat has few clear seams, skirt has broad shallow pleats, camera simple defined lens. No lineart around every hair. Reference target is soft pastel high-end chibi videogame character with refined face painting, not wooden/block/clay primitive doll, not photorealistic resin toy.
One single FRONT ORTHOGRAPHIC full-body view, in symmetrical relaxed A pose, arms25degrees from torso, hands separated from clothing, feet apart. Kindly small smile, looking straight ahead. Head and body un-tilted. Soft neutral even studio illumination, no hard shadows. Entire head-to-complete-shoe-soles figure only75% of portrait height leaving generous transparent gutters all sides. Transparent alpha background, no ground, pedestal, text, duplicates or scenery.
```

背面最终提示词：

```text
Use case: identity-preserve. Edit target: supplied full-body Tang Li front-view toon 3D character render. Create exactly ONE REAR VIEW of this exact same character, a 180-degree turn in place, as a matching model reference. Preserve exactly the compact roughly 2-head-tall proportions, enormous round head and tiny body, chestnut hair formed in broad solid wavy sculpted clumps, low side ponytail tied with a small braided band, caramel short jacket, teal pleated skirt, ivory ruffle socks and brown Mary Jane shoes. The peach flower clip is on her anatomical left so is at IMAGE LEFT from behind, and mostly occluded by hair. The ponytail is at IMAGE LEFT in rear view. Back of the jacket has plain tailored seams, no buttons. Show the brown camera strap at the back of neck; camera itself hangs on front and cannot be seen through body. Both arms in the same relaxed low A-pose as supplied front reference, both mitten hands separated from skirt, both short legs and entire shoes visible. BACK OF HEAD ONLY, no eyes, no face, no mouth, no face on the back. Match exact original height, silhouette scale, illumination and premium warm matte anime mobile-game 3D rendering. Orthographic view at chest height, no perspective distortion. Single figure filling 83% portrait height centered with transparent margins all sides. Genuine transparent alpha background. No text, no grid, no extra figures, no ground shadow, no environment. This is a coherent rear model view of the supplied identity, not a different person.
```

## 历史：首次三维试验



2026-10-12。独立于游戏已接入的 2.5D 素材与已暂缓的 Live2D 工作。目的为缩小用户参考图中精细 Q 版三维人物与旧几何角色之间的差距。

## 实际产物

唐梨独立透明造型图：`tools/warm-signal/models/city3d/tangli-toon-source-v1.png`，内置 image_gen 编辑原唐梨 atlas，保持职业相机、花朵发饰、栗色侧马尾、驼色外套与青绿色裙子。该 PNG 是三维建模输入，不是三维模型。

已在本机 RTX 5060 Ti 16GB 实际生成 `shape.glb`，299696 顶点、602114 三角面，耗时 63.65 秒。权重已下载完成。运行产物保存在 `C:/Users/xiaolizi0v0/.codex/warm-signal-model-runtime/city3d-runs/tangli-geometry-v3/`，包括 GLB、独立 Blender 文件及四个角度的实际渲染。正/侧/背渲染及报告另复制到 `docs/warm-signal-screenshots/city3d-geometry-v3/`。

**质量结论：尚不可接入游戏。** 正面轮廓、裙褶和相机可辨认；侧面与背面头发存在孔洞和噪声，手指粘连，尚无贴图、骨骼或动画，网格非 watertight，60 万面也过高。生成成功只证明本机管线可运行，不能称为达到参考画风。游戏角色未被这个试验网格替换。

下一阶段需修整头发实体形体与手指、重拓扑与减面、UV 与颜色贴图、绑定和走路/骑行/乘坐动画；通过正侧背与游戏光照检查后才接入。现有 2.5D 不冒充任意视角三维人物。

## 可复现环境

- 官方代码 [Tencent-Hunyuan/Hunyuan3D-2](https://github.com/Tencent-Hunyuan/Hunyuan3D-2)，固定提交 `f8db63096c8282cb27354314d896feba5ba6ff8a`。
- 官方权重 [tencent/Hunyuan3D-2mini](https://huggingface.co/tencent/Hunyuan3D-2mini)，固定 revision `f90a0f7df7d5e6f71109cf333f6a95a0ae3194a6`，`hunyuan3d-dit-v2-mini-turbo/model.fp16.safetensors`，3822584202 字节。下载脚本保留 LICENSE、NOTICE 和配置。
- 独立 venv `C:/Users/xiaolizi0v0/.codex/warm-signal-model-runtime/hunyuan-venv/`，复用本机 PyTorch `2.9.0.dev20250905+cu129`；安装 diffusers 0.35.1、transformers 4.57.1、HF hub 0.36.2 等。没有修改旧 Live2D 环境。
- seed 42，5 steps，guidance 0，octree 256，MC 提面，CPU offload。官方 offload helper 缺少 components 和执行 device 更新，在项目 runner 中补齐；前两次失败报告保留，第三次成功。
- `download-shape.py` 下载固定版本到项目外 runtime；`run-shape.py` 使用本地离线权重，不覆盖已有输出，记录输入 SHA256、参数、面数与错误；`render-shape.py` 通过独立无界面 Blender 工程渲染，不改变用户打开的工程。

没有进行模拟充值测试。未下载 2.1 的大模型或额外纹理模型，未称已完成完整三维角色。

## 造型输入提示词

原图保留于 `C:/Users/xiaolizi0v0/.codex/generated_images/01a11c44-2a61-72b0-af27-3ac60a66f2c7/exec-9b31837e-62c9-40d6-828e-f38d9b8f0954.png`。引用 `tools/warm-signal/assets/city-tang-li-atlas-v1.png`，透明背景，内置 image_gen 编辑。

```text
Use case: identity-preserve. Edit target: supplied original Tang Li chibi character atlas. Produce ONE single full-body premium TOON 3D GAME CHARACTER rendering of the same woman, not a sprite sheet. Preserve her chestnut wavy low ponytail, peach flower clip, amber eyes, face identity, caramel short jacket, ivory blouse, muted teal pleated skirt, cream socks, brown Mary Jane shoes and compact neck-strap camera. She is an adult original photographer age 24 rendered as a cute 2.3-head tall chibi game avatar.
Style should resemble a polished high-end mobile romance game chibi MODEL, gently rounded sculpted volume and soft anime/toon skin shading, fine eye painting, small nose and mouth, dimensional layered fringe/ponytail clumps, refined cloth folds, seams and buttons. Clean light pastel cream/caramel/teal palette. NOT clay or wooden toy, not hard block primitive shapes, not a realistic human or photorealistic doll, not flat 2D line art.
Model sheet input for real 3D mesh creation: single front view camera at chest height with minimal perspective; upright symmetrical relaxed A-pose, arms angled 25 degrees away from torso, hands fully separated from skirt; legs separated slightly, both complete shoes visible. Natural gentle smile and eyes looking forward. Render one centered full figure using 83% of portrait height with wide transparent margin on every side, including above hair and below soles. Soft even studio light; no strong cast shadows, scenery, pedestal, text, duplicate figures or background. Genuine transparent alpha background. Every part of the silhouette must be completely inside the image.
```
