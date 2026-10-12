# 秋日寄笺家具资产

使用内置 `image_gen`，没有使用CLI、外部生成API或原作图片。编辑目标是本项目已有原创家具图集，生成新造型的第二套收藏。第一次图集间距偏小，第二次通过内置工具扩大间隔；生产使用v2。原始生成记录留在Codex生成目录。

最终项目文件：

- `tools/warm-signal/assets/cottage-furniture-autumn-v2.png`，1086×1448，RGBA透明原图。
- `tools/warm-signal/assets/cottage-furniture-autumn-v2.webp`，同尺寸透明网页版本。
- 十二个独立裁片坐标在`cottage-art.js`的`autumnRects`中；SVG仅裁片并保持比例，没有重新绘制家具。

## 第一版提示词

Use case: precise-object-edit. Project-bound game transparent furniture sprite atlas, original romantic cozy male-protagonist game Warm Signal. Input image is the edit target and positional/layout reference. Create a sibling SECOND furnishing collection called Autumn Correspondence, warm sophisticated storybook painted anime game assets. Maintain exactly twelve isolated complete objects in the same three columns by four rows and ordering as the reference, including generous clear transparent gutters. Preserve object orientations and relative sizes, all objects fully within own cells, top left lighting, floor contact, no broad shadow outside objects. No text, numbers, logos, humans, fake checkerboard or backdrop. Design each object substantially differently from original, not a hue filter: row1 curved walnut two-seat sofa with ochre plaid throw and leaf-shaped cream cushions; oval walnut coffee table with ceramic pumpkin tea set and handwritten letters without readable text; round rust/sage woven braided rug with small leaf medallions. Row2 terracotta pot of slender golden ginkgo indoor tree; walnut writing desk with curved trestle legs, parchment envelopes, brass lamp and padded stool; arched tall walnut bookcase with collected books, tiny autumn wreath, dried flowers. Row3 warm ivory upright piano with walnut trim and deep sage velvet bench; hexagonal walnut chess table with delicate bronze legs and chess board; pale clay pot of cream chrysanthemums. Row4 curved walnut reading armchair upholstered sage with ochre bolster; stepped narrow walnut flower stand with golden foliage; autumn leaf embroidered ochre square cushion with sage piping. Cohesive natural warm cream, walnut, muted sage and burnt ochre palette, warm elegant detailing, delicate brush texture, polished cozy 2D game illustration. Fully transparent RGBA background, no scene or borders. All twelve are distinct usable sprites.

输入：`cottage-furniture-v1.png`，本项目原创旧家具图集；透明背景开启。

## 间距修订提示词

Precise production sprite atlas edit. Keep exactly all twelve existing original Autumn Correspondence furniture designs, same order, same rendering, colors, orientation. Fix only packing: uniformly reduce each individual object to 78% of its current size, center each complete isolated object in its own equally spaced cell in a STRICT THREE COLUMN FOUR ROW rectangular grid, with generous fully transparent gutters on ALL sides, each cell approximately 362px wide by362px tall. The twelve objects must NOT touch, overlap, approach adjacent cells, or be cut off. Especially separate ginkgo/piano, desk/chess table, chess table/flower stand, shelf/chrysanthemums. Preserve complete furniture shapes and true transparent background. No labels/text/borders/background. Same overall1086x1448 portraitatlas.

输入：第一版秋日家具图集；透明背景开启。输出并非数学等距格，实际按各物件连通主体边界分别测量并留边，避免固定格裁切截断。只做PNG复制与同尺寸WebP编码，没有用Python改画图像。

## 验收范围

实际查看两版图集；v2十二主体分离，透明通道有效，裁片各保留完整主体。PNG与WebP保留1086×1448和alpha。游戏中查看钢琴与棋桌的独立样式、批量选择与完整房间；十二件裁片与六房间避障由测试覆盖。当前六人共享这套原创造型，但持有权、装备及保底独立；没有宣称已拥有原作全部不同角色的历史家具图。
