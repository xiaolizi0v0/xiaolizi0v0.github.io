# 心动来信 · 原创美术记录

使用内置 image_gen.imagegen 生成，不使用 API/CLI。PNG 原图和网页压缩 JPG 均保存到 tools/warm-signal/assets/。

## 城市背景

文件：city.png / .jpg

提示词：

Use case: stylized-concept. Asset type: original playable romance game homepage background, portrait 1024x1536. Paint a richly detailed warm inviting anime visual novel city street in spring, exquisite hand-painted 2D Japanese animation background art. Shanghai-inspired quiet neighborhood with ivory European cafe buildings, distant glass skyscrapers, arching pink cherry blossom trees, cobblestone street winding toward a small clocktower, morning sunlight, charming flower shop on right, outdoor cafe on left with striped cream awning, bicycles, brass streetlamp, petals in air. Soft blush, cream, sage, powder blue and warm gold palette, delicate watercolor atmosphere, sophisticated architectural detail, luminous highlights, full bleed. Central street remains visually spacious for game navigation overlays, no characters, no user interface, absolutely no text, no logos, no watermark. An original independent artwork, not from an existing game. Save final generated image for use as a project asset.

## 五角色卡面图集

文件：portraits.png / .jpg

提示词：

Use case: stylized-concept. Asset type: original romance visual novel character portrait sprite atlas, landscape image 2560x1024 with EXACTLY FIVE equally wide portrait panels side by side, each covers precisely one fifth of total width, no gutters. All five are charming adult WOMEN aged 24-27, refined high quality warm anime illustration, expressive eyes and delicate hand painted shading, modest stylish everyday clothes, facing viewer, framed from head to waist with full heads and some margin at top, centered in own panel. Panel 1: 24 year old botanical researcher, long chestnut brown hair with wispy bangs, warm hazel eyes, ivory blouse and sage cardigan, gentle smile, soft sunlit greenhouse background. Panel 2: 27 year old architect, dark indigo long hair, elegant serious face, pale blue blouse and navy vest, subtle smile, architectural studio background. Panel 3: 25 year old musician, honey blonde shoulder length hair, coral ribbon, peach sweater, cheerful playful smile, cafe music room background. Panel 4: 26 year old journalist, dark auburn shoulder length bob, dusty rose blouse, smart confident expression, sunlit bookstore background. Panel 5: 24 year old pastry chef, dark brown tied hair with pale bow, cream apron over light rose knit top, kind smile, charming bakery background. Five clearly distinct faces, cohesive delicate romantic illustration style, luminous cream and peach palette, no childlike proportions, no sexualized outfits, no words, no labels, no dividing lines, no typography, no logos. An original independent artwork. Precision of equal width five portrait columns is essential for cropping in a real browser game.

## 唐梨直播立绘

文件：tang-li.png / .jpg

提示词：

Use case: stylized-concept. Asset type: portrait original character artwork for a romance game live streaming screen, 1024x1536. A charming adult Chinese woman named Tang Li aged 24 with long softly wavy midnight-brown hair, amber eyes, small apricot-colored hair clip, wearing a modest ivory knit sweater with coral accents, warm friendly animated expression, seated behind a wooden desk addressing the viewer, hands visible gesturing naturally. Cozy apartment studio with balcony flowers and sunlit city view, professional microphone on arm at left, little camera on shelf, postcards, warm string lights, lilac flowers and steaming tea. Framed head to waist, girl occupies center with face in upper middle third, leave darkened room at bottom for a game's live chat overlay. Delicate exquisite warm anime visual novel illustration, romantic clean line work, painterly luminous shading, consistent style with creamy springtime romance portraits, sophisticated soft peach and sage colors. No UI, absolutely no text or logos, no watermarks, no sexualization, visibly adult. This is a completely original character, not any existing streamer.

原卡册复用肖像的问题已改为按卡牌编号取独立卡面，96 张卡共六组 4×4 图集。完整卡面提示词与路径见 `warm-signal-card-art-prompts.md`；角色基础肖像仍用于头像和人物资料。动态演出继续待扩充。

## v0.3 宠物房间及透明图集

以下三次使用内置 imagegen，PNG 原件保留于 `tools/warm-signal/assets/`。网页使用背景 JPG 和透明 WebP；压缩保留构图与透明通道，未进行语义编辑。珍藏家具复用基础图集，装扮由代码 SVG 叠加。

### pet-room.png / pet-room.jpg

原始输出：`C:/Users/xiaolizi0v0/.codex/generated_images/01a11c44-2a61-72b0-af27-3ac60a66f2c7/exec-e42c85a5-9e31-4704-b4b8-8e9d24ed3825.png`。复制到 `tools/warm-signal/assets/pet-room.png`，1024×1536。

完整提示词：

Use case: illustration-story. Asset type: background for a warm anime romance game pet room. Create one original polished softly painted interior background, portrait 1024x1536. Empty cozy sunlit room corner with cream walls, large window looking onto pale pink blossoms, honey oak floor, sheer curtain on right, a low cabinet and a plant only near the far wall. Warm natural afternoon light, serene detailed hand-painted otome-game background quality, watercolor-like soft edges with careful architectural perspective. Composition: camera facing room at a slight elevated angle, lower 55 percent is unobstructed wood floor with plenty of space where separate pet and furniture sprites will be placed. Window and botanical detail in upper 40 percent. No animals, no humans, no pet furniture, no text, no UI, no logos, no watermark. Maintain ivory, caramel, sage and dusty rose palette coherent with the existing game 心动来信.

### pets-atlas.png / pets-atlas.webp

原始输出：`C:/Users/xiaolizi0v0/.codex/generated_images/01a11c44-2a61-72b0-af27-3ac60a66f2c7/exec-e97ecc9c-3f7b-41be-8b1b-d54da995e161.png`。复制到 `tools/warm-signal/assets/pets-atlas.png`，1536×1024、RGBA。

完整提示词：

Use case: stylized-concept. Asset type: transparent pet character sprite atlas for a warm anime romance game. Create exactly SIX cute full-body pet sprites, one per cell, in a precisely spaced 3 columns x 2 rows atlas on genuinely transparent background. Canvas 1536x1024; equal cell boundaries at x=512,1024 and y=512. Each sprite fully contained in its cell with generous 55px blank margins, no animal crosses a cell boundary. Top row from left: small orange tabby kitten with white muzzle and white paws, round cream-colored long-haired kitten, gentle blue-gray short-haired cat. Bottom row from left: short-legged caramel-and-white corgi puppy, fluffy light golden retriever puppy, fluffy white Japanese spitz puppy. Each facing the viewer at slight three-quarter angle, seated happy attentive pose, fluffy soft fur and bright expressive eyes, adorable but anatomically coherent. Same scale and lighting across all six. Painterly high quality anime game illustration with warm soft outlines, ivory/caramel/sage mood. No collars, no clothes, no environment, no text, no labels, no visible grid lines, no logos, no watermark. True alpha transparency; tiny soft contact shadows are allowed beneath paws, nothing else.

### pet-furniture-atlas.png / pet-furniture-atlas.webp

原始输出：`C:/Users/xiaolizi0v0/.codex/generated_images/01a11c44-2a61-72b0-af27-3ac60a66f2c7/exec-190793ae-ba08-4a20-b820-c55ec82332bb.png`。复制到 `tools/warm-signal/assets/pet-furniture-atlas.png`，1536×1024、RGBA。

完整提示词：

Use case: stylized-concept. Asset type: transparent furniture sprite atlas for a warm anime romance pet-care game. Create exactly SIX isolated pet furniture objects in an equal 3 columns x 2 rows atlas, 1536x1024 canvas, equal cell boundaries x=512,1024 and y=512. Every object completely contained in its cell, with at least 60px empty margins. Top row left to right: round cream plush pet bed with dusty-rose piping; a pair of sage ceramic pet food and water bowls on a small beige mat; a short ivory rope scratching tree with wood platform. Bottom row left to right: caramel wicker cat tunnel with round openings; three pastel soft pet toy balls gathered as one object; low mint padded cushion with a small cream blanket. Furniture viewed from a slightly elevated front three-quarter angle, coherent scale and perspective. Detailed soft painterly anime-game quality, cozy ivory, honey oak, sage, dusty-rose palette. Genuinely transparent background with small contact shadow under each object only. No animal, no human, no room background, no lettering, no visible grid lines, no brand, no watermark.

