# 主线背景出图记录

2026-10-10，使用内置 `image_gen.imagegen`，非CLI/API。新生成原创背景，没有使用原作图片作为游戏素材。

最终文件：`tools/warm-signal/assets/main-story-scenes-v1.png`（1536×1024原图）、`main-story-scenes-v1.webp`（质量88的网页编码）。2×2等大四格：工作室晨光、温室、春日街角、夜间试映室。网页以SVG viewBox切片并 `xMidYMid slice` 等比裁切，没有对背景或人物做横纵拉伸。

生成提示词：

```text
Use case: illustration-story. Asset: original background atlas for a warm Chinese urban romance visual novel with an adult male filmmaker protagonist, no people. Create a single precisely aligned 2 by 2 grid, four equal rectangular panels, with no gutters, frames, borders, labels, text, logos, UI or watermark. Detailed high-end hand-painted anime environment art with subtle realistic light, cozy cream, peach and sage palette, consistent gentle spring atmosphere, immaculate perspective. Top left: small old film editing studio at morning, wooden desk with vintage camcorder and blank tape boxes, large window with gauzy curtains, bookshelves and tiny plants; an inviting empty area in center foreground. Top right: glass-roof neighborhood greenhouse, morning sun through leaves, long wooden plant bench, white flowering tree sapling in clay pot, watering can, empty walkway center. Bottom left: quiet Chinese city neighborhood lane in spring afternoon, pastel shopfronts, cherry blossom petals, small bakery and steps, no legible signs, empty central walkway. Bottom right: same small film studio arranged for an intimate evening screening, blank white projection screen, two small wooden stools and folding chairs, warm table lamp, tea cups, soft blue dusk outside. All four have full compositions suited to center portrait cropping on a mobile screen; keep meaningful scenery centered. No humans, no humanoids, no photographic or 3d rendering. The atlas should be landscape 3:2 if possible.
```

生成结果已实际查看：四格构图及分界准确、无人像/界面/文字，工作室和夜间试映室设备一致，色调与已有角色插画相容。PNG只复制进入项目，原生成文件保留；Pillow仅作WebP格式编码，没有重画或改图。
