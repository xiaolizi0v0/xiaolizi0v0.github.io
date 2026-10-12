# 晴川 Q 版角色美术重制

> 当前方向（2026-10-12）：所有正式表现改为 2D。14 张透明图集、168 帧由 Canvas 2D 按原比例绘制，骑行及设施也不再使用旧三维人物。专用坐姿/踩踏/乘坐帧仍待补齐，场景还需继续精修。本次没有新增生成图片。以下历史提示词与验证保留，三维计划已停止。详见 [全 2D 制作说明](warm-signal-2d-plan.md)。


## 历史记录：20261012-city-outfit-1 补充

男主及六位女生各新增一张 4×4 真透明 PNG，前八帧为奶油 W 衫，后八帧为玫瑰爱心衫。每套保留五个动作和三个朝向，合计 112 帧；日常装束另有 56 帧，共 168 帧。普通探索、拍照和照片重开共用完整主体比例和落脚锚点；按实际 PNG 尺寸读取 UV，不硬编码 1536×1024。更换角色/服装会异步加载所需两张图，加载时保留当前角色，离开页面后不再挂载素材。骑行和游乐设施仍为旧三维角色，未声称完成统一。

生成方式：内置 image_gen，透明背景，引用各角色已检查过的原图；生成原文件保留，项目 PNG 未经 Python 图像编辑。Tang Li、Jiang Yue、Su Wan、Xu Zhixia 的换装 sheet 经内置 image_gen 再生成以改善边界和主体分离。inspect-city-art.py 只读 alpha，要求每张换装图有 16 个独立主体。

共同提示词：

```text
Use case: identity-preserve. Edit target: the supplied eight-pose original chibi character atlas. Create a matching 16-pose WARDROBE variant atlas, preserving precisely this same character's face, hairstyle, head/body ratio, eye color, original skirt or trousers, shoes and accessories. Keep the same delicate warm anime linework and premium soft cel shading. Replace only the upper clothing with the two following casual matching tops; remove the original jacket/cardigan/blouse entirely, no outer coat layered over the new shirt.
Outfit A: warm ivory crew-neck long-sleeved cotton sweatshirt, fine cuffs and seams, very small gold W emblem on chest.
Outfit B: soft dusty rose-pink crew-neck long-sleeved sweatshirt, same fitted shape, tiny cream heart emblem on chest.
Keep original hairstyle and hair ornament identical. Camera can hang over the new shirt if this character has one. Both outfits must visibly differ from the original outfit and from each other.
Create EXACTLY sixteen separate complete head-to-shoes figures, evenly spaced on a FOUR COLUMN by FOUR ROW sheet. All figures same size; use tall portrait overall canvas, enough gap between every figure so no hair, hand or foot touches the next character or sheet edge. Genuine transparent alpha background, no painted backdrop, no ground shadow, no labels or lettering except the specified tiny shirt emblems.
Row1 Outfit A: neutral front; waving front; finger-heart front; hand on cheek front.
Row2 Outfit A: arms open front; full rear view no face; standing three-quarter left; standing three-quarter right.
Row3 Outfit B: neutral front; waving front; finger-heart front; hand on cheek front.
Row4 Outfit B: arms open front; full rear view no face; standing three-quarter left; standing three-quarter right.
Warm friendly expressions, fine cloth folds. These are poses of ONE SAME character. Do not change the lower garment, shoes, identity or art style. Do not merge figures into a pair; keep all sixteen silhouettes clearly separate and fully inside the transparent sheet.
```

|角色|最终项目文件|原始生成文件|
|---|---|---|
|shen-yu|tools/warm-signal/assets/city-shen-yu-outfits-v1.png|C:\Users\xiaolizi0v0\.codex\generated_images\01a11c44-2a61-72b0-af27-3ac60a66f2c7\exec-340e4759-63ed-40b6-b07e-bc2e4f6bf6eb.png|
|lin-zhi|tools/warm-signal/assets/city-lin-zhi-outfits-v1.png|C:\Users\xiaolizi0v0\.codex\generated_images\01a11c44-2a61-72b0-af27-3ac60a66f2c7\exec-8edf092e-14b2-4809-b09e-d3ada570c136.png|
|gu-qinghe|tools/warm-signal/assets/city-gu-qinghe-outfits-v1.png|C:\Users\xiaolizi0v0\.codex\generated_images\01a11c44-2a61-72b0-af27-3ac60a66f2c7\exec-905b40d4-b589-4b39-b464-b1efcc0ed970.png|
|xu-zhixia|tools/warm-signal/assets/city-xu-zhixia-outfits-v1.png|C:\Users\xiaolizi0v0\.codex\generated_images\01a11c44-2a61-72b0-af27-3ac60a66f2c7\exec-b7d34685-42a9-46d7-b31c-140e298b0101.png|
|su-wan|tools/warm-signal/assets/city-su-wan-outfits-v1.png|C:\Users\xiaolizi0v0\.codex\generated_images\01a11c44-2a61-72b0-af27-3ac60a66f2c7\exec-f308bace-63a1-4c83-86d6-17983c13fde8.png|
|jiang-yue|tools/warm-signal/assets/city-jiang-yue-outfits-v1.png|C:\Users\xiaolizi0v0\.codex\generated_images\01a11c44-2a61-72b0-af27-3ac60a66f2c7\exec-242c51ca-a48f-4afe-89b4-ca20bd4ae922.png|
|tang-li|tools/warm-signal/assets/city-tang-li-outfits-v1.png|C:\Users\xiaolizi0v0\.codex\generated_images\01a11c44-2a61-72b0-af27-3ac60a66f2c7\exec-47569de1-5d47-4aed-ba73-a76516ea7932.png|

修正提示词（唐梨）：

```text
Use case: identity-preserve. Edit target: the supplied eight-pose original chibi character atlas. Create a matching 16-pose WARDROBE variant atlas, preserving precisely this same character's face, hairstyle, head/body ratio, eye color, original skirt or trousers, shoes and accessories. Keep the same delicate warm anime linework and premium soft cel shading. Replace only the upper clothing with the two following casual matching tops; remove the original jacket/cardigan/blouse entirely, no outer coat layered over the new shirt.
Outfit A: warm ivory crew-neck long-sleeved cotton sweatshirt, fine cuffs and seams, very small gold W emblem on chest.
Outfit B: soft dusty rose-pink crew-neck long-sleeved sweatshirt, same fitted shape, tiny cream heart emblem on chest.
Keep original hairstyle and hair ornament identical. Camera can hang over the new shirt if this character has one. Both outfits must visibly differ from the original outfit and from each other.
Create EXACTLY sixteen separate complete head-to-shoes figures, evenly spaced on a FOUR COLUMN by FOUR ROW sheet. All figures same size; use tall portrait overall canvas, enough gap between every figure so no hair, hand or foot touches the next character or sheet edge. Genuine transparent alpha background, no painted backdrop, no ground shadow, no labels or lettering except the specified tiny shirt emblems.
Row1 Outfit A: neutral front; waving front; finger-heart front; hand on cheek front.
Row2 Outfit A: arms open front; full rear view no face; standing three-quarter left; standing three-quarter right.
Row3 Outfit B: neutral front; waving front; finger-heart front; hand on cheek front.
Row4 Outfit B: arms open front; full rear view no face; standing three-quarter left; standing three-quarter right.
Warm friendly expressions, fine cloth folds. These are poses of ONE SAME character. Do not change the lower garment, shoes, identity or art style. Do not merge figures into a pair; keep all sixteen silhouettes clearly separate and fully inside the transparent sheet.
CRITICAL REPAIR for Tang Li (adult age24): generate precisely 16 separately isolated sprites 4 columns x4 rows, each avatar occupies at most 80% of cell width and 86% cell height, at least 16px transparent gutter all four sides of EVERY cell INCLUDING the bottom edge of the entire image. Never crop shoe soles. Wide open arms must remain fully inside their own cell, no touching next avatar. Match this existing Tang Li identity/outfit sheet faithfully but use spacious smaller whole figures. Two outfits: first eight ivory W sweatshirt, last eight dusty rose heart sweatshirt; teal skirt, brown Mary Janes, peach blossom hairclip, chestnut low side ponytail, camera necklace.
```

修正提示词（其余三位，保留各自引用图片身份）：

```text
Use case: identity-preserve. Edit target: the supplied eight-pose original chibi character atlas. Create a matching 16-pose WARDROBE variant atlas, preserving precisely this same character's face, hairstyle, head/body ratio, eye color, original skirt or trousers, shoes and accessories. Keep the same delicate warm anime linework and premium soft cel shading. Replace only the upper clothing with the two following casual matching tops; remove the original jacket/cardigan/blouse entirely, no outer coat layered over the new shirt.
Outfit A: warm ivory crew-neck long-sleeved cotton sweatshirt, fine cuffs and seams, very small gold W emblem on chest.
Outfit B: soft dusty rose-pink crew-neck long-sleeved sweatshirt, same fitted shape, tiny cream heart emblem on chest.
Keep original hairstyle and hair ornament identical. Camera can hang over the new shirt if this character has one. Both outfits must visibly differ from the original outfit and from each other.
Create EXACTLY sixteen separate complete head-to-shoes figures, evenly spaced on a FOUR COLUMN by FOUR ROW sheet. All figures same size; use tall portrait overall canvas, enough gap between every figure so no hair, hand or foot touches the next character or sheet edge. Genuine transparent alpha background, no painted backdrop, no ground shadow, no labels or lettering except the specified tiny shirt emblems.
Row1 Outfit A: neutral front; waving front; finger-heart front; hand on cheek front.
Row2 Outfit A: arms open front; full rear view no face; standing three-quarter left; standing three-quarter right.
Row3 Outfit B: neutral front; waving front; finger-heart front; hand on cheek front.
Row4 Outfit B: arms open front; full rear view no face; standing three-quarter left; standing three-quarter right.
Warm friendly expressions, fine cloth folds. These are poses of ONE SAME character. Do not change the lower garment, shoes, identity or art style. Do not merge figures into a pair; keep all sixteen silhouettes clearly separate and fully inside the transparent sheet.
Repair this exact adult character's 16-frame wardrobe sheet, preserve identity/hair/accessories/outfits/poses perfectly. IMPORTANT spacious grid 4x4: shrink EACH whole character to 80% of cell width and 82% of cell height, 20px minimum transparent gutters on all four sides of EVERY cell, INCLUDING under shoes in final row. Top/bottom/sides of whole canvas must have generous transparent space. Wide open hands stay inside cell. Absolutely complete soles/shoes, no edge cropping, no characters touching. Two identical pose sequences: cream W sweatshirt first8; dusty pink heart sweatshirt last8.
```

## 20261012-city-art-3 历史记录

日期：2026-10-12。版本：20261012-city-art-3。使用内置 image_gen；没有使用 CLI/API 生图。七张图片均复制到项目 assets，原始生成文件保留。每张 PNG 1536×1024、RGBA，保留生成的透明通道；不对角色进行重绘、拉伸或抠图处理。

## 美术目标与当前范围

用户提供的第一张图是精细 Q 版角色参考，第二张是本项目旧的积木式几何人物。主要差距为头身比例、头发形体与发丝、眼睛和脸部、衣料细节、服装层次及颜色。重制使用原创身份与服装，统一细线、柔和赛璐珞层次、奶油与暖棕基调；六位女生保留不同发型、职业道具和服装颜色。

当前接入为 **2.5D 图片角色＋三维场景**，并非原作完整的实时三维角色模型。普通步行、日常装束的拍照及街区 NPC 使用新素材；男主与女生分别拥有自然、挥手、比心、托腮、展开双臂五个动作，以及背面、左侧、右侧三个朝向。移动采用朝向切图与轻微上下移动，不冒充骨骼走路动画。摄影动作直接切完整图片，不压缩脸或拉伸嘴部。主界面既有静态人物及局部表情方案不受此处影响；Live2D 仍按用户要求暂缓。

## 素材边界与接入

生成图的 nominal 4×2 网格并非像素精确，因此不能盲目按等分网格裁切。inspect-city-art.py 只读取 alpha 连通区域，输出 city-art-frames.js 的 56 组 UV 边界、头部中心与落脚锚点；PNG 原文件不变。每张图检查到 8 个主体。Three.js 使用完整主体的实际宽高比例选取 UV，避免串到下一张头发或截断鞋底。角色落脚位置抬至路面上方，保留独立地面接触阴影，透明区域允许看到场景。纹理不受场景曝光变成一片褐色。

## 尚未完成

骑行、游乐设施乘坐姿势以及两套街区换装还没有对应的精修图，所以继续使用原有三维表现，不能声称所有状态已统一画风。背景仍是简化三维街区，其形体、贴图与照明精度也低于参考。后续若要求参考图那样任意转动、平滑走路与换装，需要依据这套角色设计单独制作三维模型、骨骼、走路/乘坐动画与服装网格；八个方向/动作图片不能替代这项工作。

## 验证

七张透明 PNG 的尺寸与通道、56 个 UV 范围检查；四个 HTML 的新脚本顺序/文件引用与语法检查；浏览器独立内存页检查普通街区、唐梨双人近景、独立动作和实际 PNG 导出。此次没有操作正式游戏存档，也没有进行模拟充值测试。实际截图和导出位于 warm-signal-screenshots/city-art-*。

## 提示词与项目文件

### shen-yu

项目文件：tools/warm-signal/assets/city-shen-yu-atlas-v1.png

```text
Use case: stylized-concept. Asset type: production transparent sprite atlas for an original cozy romance game, ONE adult male protagonist Shen Yu age 27, in eight consistent poses.
Create a polished premium anime chibi character, exactly 2.5 heads tall, comparable in quality to the user's first attached game screenshot: fine sculpted wisps of dark brown hair, luminous pale peach skin, expressive dark hazel anime eyes with tiny highlights, subtle blush, small natural mouth, readable separated hands, detailed cream cable-knit cardigan over white T-shirt, tailored warm taupe trousers, ivory low-top shoes. Original identity and clothes, no borrowed game character. Warm delicate pastel cel shading with soft dimensional modelling, clean fine outlines and crisp fabric seams/buttons. Avoid potato/clay toy proportions, huge featureless brown helmets, block hands, cylindrical bodies, photorealism.
Layout MUST be a perfectly regular FOUR COLUMN by TWO ROW sprite sheet, eight identical portrait cells, on genuine transparent alpha background. No labels, borders, shadows, scenery, text, watermarks or contact sheets decorations. Each cell has exactly one complete head-to-shoes figure, same apparent size, same baseline at 94% of cell height, head at 6% of cell height, horizontally centered; keep all parts inside the middle 84% width of each cell.
Reading order: row1 col1 front neutral arms relaxed; row1 col2 front waving with right hand raised; row1 col3 front small finger-heart near chest; row1 col4 front thoughtful hand on cheek; row2 col1 front both arms cheerfully open; row2 col2 full rear view standing (back of head and cardigan, no face visible); row2 col3 three-quarter left facing standing; row2 col4 three-quarter right facing standing. Consistent identity, clothing and anatomy in every cell. Pixel-clean silhouette and actual transparent background. Make these look like premium game-ready anime chibi sprites, not a concept sketch.
```

### tang-li

项目文件：tools/warm-signal/assets/city-tang-li-atlas-v1.png

```text
Use case: stylized-concept. Asset type: production transparent sprite atlas for an original cozy romance game, ONE adult female photographer Tang Li age 24 in eight consistent poses. Match the beautiful male chibi sprite atlas just generated in this conversation, especially clean fine lines, warm dimensional cel shading, clothing detail and 2.5-head proportions.
Subject: adorable original premium anime chibi woman, warm chestnut long wavy hair with loose low ponytail and gently side parted fringe, small peach flower hairclip on her left temple, bright amber brown eyes, pale peach skin and subtle blush, tiny smiling mouth. Warm caramel short jacket with fine cuffs/buttons over ivory blouse, muted teal pleated knee-length skirt, cream socks and small brown Mary Jane shoes, compact vintage silver-and-brown camera hanging on a thin neck strap at chest. Delicate pastel game art, finely sculpted hair strands, premium polished anime doll-like proportions as the user's game screenshot. Avoid clay/plastic potatoes, block limbs, huge featureless brown helmet hair, toddler/baby anatomy, photorealism.
Layout MUST be a perfectly regular FOUR COLUMN by TWO ROW sprite sheet, eight identical portrait cells, genuine TRANSPARENT alpha background with absolutely no painted backdrop or glow. Each cell exactly one complete head-to-shoes figure, same size, same baseline at 94% of cell height, hair top at 6%, horizontally centered; all parts inside middle 84% of each cell. No ground shadow, labels, text, borders, scenery or watermarks.
Reading order: row1 col1 front neutral arms relaxed; row1 col2 front waving with right hand raised; row1 col3 front small finger-heart near chest; row1 col4 front thoughtful hand on cheek; row2 col1 front both arms cheerfully open; row2 col2 full rear view standing (back of ponytail/jacket/skirt, no face visible); row2 col3 three-quarter left facing standing; row2 col4 three-quarter right facing standing. Keep same face, hair, camera, jacket and skirt in all cells. Clean separated silhouettes ready for game sprite UV atlas use.
```

### lin-zhi

项目文件：tools/warm-signal/assets/city-lin-zhi-atlas-v1.png

```text
Use case: stylized-concept. Asset type: production transparent sprite atlas for an original cozy romance game. Match the two premium anime chibi atlases just generated (cream cardigan male and caramel jacket photographer female), same fine clean linework, warm soft dimensional cel shading, large luminous eyes, subtle blush and exactly 2.5-head tall proportions. This is ONE original adult female character, eight consistent full-body poses, never multiple identities.
Layout MUST be a perfectly regular FOUR COLUMN by TWO ROW sheet, eight identical portrait cells, genuine TRANSPARENT alpha, absolutely no backdrop/glow. Each cell one complete head-to-shoes figure, same apparent size and baseline at 94% cell height, hair top 6%, centered; all body parts inside middle 84% cell width.
Reading order: row1 col1 front neutral relaxed; col2 front right hand waving; col3 front finger-heart near chest; col4 front hand on cheek; row2 col1 front both arms cheerfully open; col2 full rear view standing no face; col3 three-quarter left standing; col4 three-quarter right standing.
No text, borders, ground shadows, scenery or watermark. Avoid clay/wooden potato toys, block hands, cylindrical bodies, featureless hair helmets, baby anatomy or photorealism. Crisp polished game-ready detail and consistent face/clothes/prop in every cell. Subject: Lin Zhi age 24, warm botanical florist. Long dark chestnut wavy hair, small sage leaf barrette, amber brown eyes, cream sailor collar blouse under soft sage green short cardigan with fine knit cuffs, ivory A-line skirt, brown ankle boots and cream socks, tiny leaf motif brooch and small leaf-shaped shoulder pouch. Gentle thoughtful smile.
```

### gu-qinghe

项目文件：tools/warm-signal/assets/city-gu-qinghe-atlas-v1.png

```text
Use case: stylized-concept. Asset type: production transparent sprite atlas for an original cozy romance game. Match the two premium anime chibi atlases just generated (cream cardigan male and caramel jacket photographer female), same fine clean linework, warm soft dimensional cel shading, large luminous eyes, subtle blush and exactly 2.5-head tall proportions. This is ONE original adult female character, eight consistent full-body poses, never multiple identities.
Layout MUST be a perfectly regular FOUR COLUMN by TWO ROW sheet, eight identical portrait cells, genuine TRANSPARENT alpha, absolutely no backdrop/glow. Each cell one complete head-to-shoes figure, same apparent size and baseline at 94% cell height, hair top 6%, centered; all body parts inside middle 84% cell width.
Reading order: row1 col1 front neutral relaxed; col2 front right hand waving; col3 front finger-heart near chest; col4 front hand on cheek; row2 col1 front both arms cheerfully open; col2 full rear view standing no face; col3 three-quarter left standing; col4 three-quarter right standing.
No text, borders, ground shadows, scenery or watermark. Avoid clay/wooden potato toys, block hands, cylindrical bodies, featureless hair helmets, baby anatomy or photorealism. Crisp polished game-ready detail and consistent face/clothes/prop in every cell. Subject: Gu Qinghe age 27, calm sophisticated architect. Long straight charcoal black hair with side fringe tucked behind one ear, slate gray blue eyes, tailored light slate blue-gray blazer with white blouse and subtle ribbon collar, charcoal pleated knee skirt, ivory socks and charcoal loafers, small tan notebook tucked in a slim crossbody bag. Gentle confident smile.
```

### xu-zhixia

项目文件：tools/warm-signal/assets/city-xu-zhixia-atlas-v1.png

```text
Use case: stylized-concept. Asset type: production transparent sprite atlas for an original cozy romance game. Match the two premium anime chibi atlases just generated (cream cardigan male and caramel jacket photographer female), same fine clean linework, warm soft dimensional cel shading, large luminous eyes, subtle blush and exactly 2.5-head tall proportions. This is ONE original adult female character, eight consistent full-body poses, never multiple identities.
Layout MUST be a perfectly regular FOUR COLUMN by TWO ROW sheet, eight identical portrait cells, genuine TRANSPARENT alpha, absolutely no backdrop/glow. Each cell one complete head-to-shoes figure, same apparent size and baseline at 94% cell height, hair top 6%, centered; all body parts inside middle 84% cell width.
Reading order: row1 col1 front neutral relaxed; col2 front right hand waving; col3 front finger-heart near chest; col4 front hand on cheek; row2 col1 front both arms cheerfully open; col2 full rear view standing no face; col3 three-quarter left standing; col4 three-quarter right standing.
No text, borders, ground shadows, scenery or watermark. Avoid clay/wooden potato toys, block hands, cylindrical bodies, featureless hair helmets, baby anatomy or photorealism. Crisp polished game-ready detail and consistent face/clothes/prop in every cell. Subject: Xu Zhixia age 25, sunny musician. Chestnut high ponytail with a small warm ochre ribbon, soft side-swept bangs, lively warm brown eyes, caramel varsity-style light jacket over ivory shirt with little music-note brooch, cinnamon plaid pleated skirt, cream socks and ochre lace-up ankle shoes, small brown shoulder bag. Bright natural smile.
```

### su-wan

项目文件：tools/warm-signal/assets/city-su-wan-atlas-v1.png

```text
Use case: stylized-concept. Asset type: production transparent sprite atlas for an original cozy romance game. Match the two premium anime chibi atlases just generated (cream cardigan male and caramel jacket photographer female), same fine clean linework, warm soft dimensional cel shading, large luminous eyes, subtle blush and exactly 2.5-head tall proportions. This is ONE original adult female character, eight consistent full-body poses, never multiple identities.
Layout MUST be a perfectly regular FOUR COLUMN by TWO ROW sheet, eight identical portrait cells, genuine TRANSPARENT alpha, absolutely no backdrop/glow. Each cell one complete head-to-shoes figure, same apparent size and baseline at 94% cell height, hair top 6%, centered; all body parts inside middle 84% cell width.
Reading order: row1 col1 front neutral relaxed; col2 front right hand waving; col3 front finger-heart near chest; col4 front hand on cheek; row2 col1 front both arms cheerfully open; col2 full rear view standing no face; col3 three-quarter left standing; col4 three-quarter right standing.
No text, borders, ground shadows, scenery or watermark. Avoid clay/wooden potato toys, block hands, cylindrical bodies, featureless hair helmets, baby anatomy or photorealism. Crisp polished game-ready detail and consistent face/clothes/prop in every cell. Subject: Su Wan age 26, elegant journalist. Short auburn wavy bob just below jaw, side fringe, small gold hairclip, reddish brown eyes, dusty rose tailored blouse with neat collar, cocoa brown high-waisted A-line knee skirt, cream socks and cocoa loafers, small rectangular brown leather shoulder satchel with miniature notebook visible. Warm assured smile.
```

### jiang-yue

项目文件：tools/warm-signal/assets/city-jiang-yue-atlas-v1.png

```text
Use case: stylized-concept. Asset type: production transparent sprite atlas for an original cozy romance game. Match the two premium anime chibi atlases just generated (cream cardigan male and caramel jacket photographer female), same fine clean linework, warm soft dimensional cel shading, large luminous eyes, subtle blush and exactly 2.5-head tall proportions. This is ONE original adult female character, eight consistent full-body poses, never multiple identities.
Layout MUST be a perfectly regular FOUR COLUMN by TWO ROW sheet, eight identical portrait cells, genuine TRANSPARENT alpha, absolutely no backdrop/glow. Each cell one complete head-to-shoes figure, same apparent size and baseline at 94% cell height, hair top 6%, centered; all body parts inside middle 84% cell width.
Reading order: row1 col1 front neutral relaxed; col2 front right hand waving; col3 front finger-heart near chest; col4 front hand on cheek; row2 col1 front both arms cheerfully open; col2 full rear view standing no face; col3 three-quarter left standing; col4 three-quarter right standing.
No text, borders, ground shadows, scenery or watermark. Avoid clay/wooden potato toys, block hands, cylindrical bodies, featureless hair helmets, baby anatomy or photorealism. Crisp polished game-ready detail and consistent face/clothes/prop in every cell. Subject: Jiang Yue age 24, warm baker. Dark chocolate hair in two loose low buns with wispy bangs and cream ribbons, deep honey brown eyes, cream puff-sleeve blouse under soft oatmeal cardigan, cocoa-beige gingham A-line knee skirt, cream socks and caramel Mary Jane shoes, tiny wheat-shaped gold brooch and small bread-shaped tan crossbody purse. Sweet natural smile.
```

