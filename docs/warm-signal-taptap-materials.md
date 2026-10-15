# TapTap 宣传素材生成与导出

日期：2026-10-14。使用内置 imagegen；不是外部 API / CLI 生图。

最终横图：`tools/warm-signal/publishing/taptap-banner-v2.jpg`，1920×1080。最终方图：`tools/warm-signal/publishing/taptap-square-v1.jpg`，1440×1440。

参考图为本游戏 `city.jpg` 与 `companion-abc-v1.webp`；只引用顶排三位成年角色。生成后用 imagegen 调整构图，使游戏名及三张脸避开中心 4:3 裁剪线，并清理右下角生成杂点。FFmpeg 只做等比尺寸导出和 JPEG 编码。

## 主提示词

Use case: ads-marketing. Asset type: original TapTap mobile H5 game's required 16:9 landscape promotional illustration. Deliver a finished 1920 x 1080 (or larger exact 16:9) opaque image, not a UI screenshot.
Input image 1 is the game's existing painterly spring city scene: use the same recognizable cherry blossom street, cream historic facades, cafe flowers and warm daylight as setting and match the actual game's art quality.
Input image 2 is the game's actual character reference sheet. Use ONLY the three distinct ADULT women from the TOP ROW, one of each: Lin Zhi with long light brown wavy hair and sage green cardigan / ivory blouse, Gu Qinghe with long dark charcoal hair and pale blue blouse with dark tailored vest, Xu Zhixia with honey brown long hair and peach pink cardigan. The bottom row shows alternate outfits of the same women, not extra people. Preserve their faces, adult proportions, hair and everyday top-row clothes. Do not invent new characters or use duplicate faces.
Compose a cohesive painted scene of these three friends meeting beside a flower cafe on the cherry blossom street, waist-up or three-quarter framing with natural relaxed gestures, subtle smiles toward the viewer, consistent scene lighting and depth. Refined warm 2D romance illustration, not 3D, not photoreal, not a collage or panel montage. Ivory, sage, dusty rose and warm sunlight.
Place a tasteful, clearly legible game title “心动来信” in refined dark dusty rose Chinese calligraphy/serif, in clean breathable space near the center-left. EXACTLY these four Chinese characters are the only text anywhere. No English subtitle, no slogan, no credit, no artist signature, no icon, no buttons, no mobile device, no watermark.
For TapTap's possible centered 4:3 crop, keep the entire title and all three faces safely within the central 75 percent of the image width and away from edges. Background fills the entire canvas; detailed but soft behind the title. Title and character group balanced, premium intimate cozy mood, artwork closely matches the supplied game assets, no exaggerated glamour or upgraded misleading art style.

## 最终构图修订

Make one precise layout adaptation of this SAME finished 16:9 game promotional illustration. Preserve the exact three adult women, faces, hair, outfits, hand poses, painterly quality, cafe and lighting. Reposition and slightly scale DOWN the three-woman group so that ALL THREE COMPLETE HEADS AND FACES, including their cheeks and hair silhouettes, fit within the middle 70 percent of the canvas width: face centers roughly 46%, 63%, and 77% across, with no part of any face past x=85%. The rightmost peach-cardigan woman must move left significantly; her face must never be cut by a centered 4:3 crop (the safe region is x=12.5% to87.5%). Make the group sit comfortably with more cafe environment visible on the right edge. Keep the exact game title 心动来信 fully readable in the clean left-middle area, leftmost decorative stroke at x=18%, and no other text. Same single coherent painting, no collage, no UI, no extra characters. Landscape 16:9 output.

## 最终清理提示词

Remove ONLY the tiny pale signature / pseudo-text artifact along the bottom-right edge of this image (near x=90% and y=99%). Fill that tiny patch seamlessly with the surrounding softly blurred olive/rose cafe foreground. Do not change anything else: preserve the entire composition, all three adult women and their faces, the title 心动来信, cafe, colors, proportions and resolution. There must be absolutely no writing, artist signatures, watermarks or pseudo-text anywhere except the four-character game title. Same 16:9 landscape image.

## 配套方图提示词

Create the matching square 1:1 promotional cover from this landscape illustration for the same game. Keep the same three adult women, exact faces and sage green / blue vest / peach cardigan outfits, same cherry blossom cafe, lighting and warm 2D painted art. Recompose their group naturally into a square, waist-up, all three faces fully visible, elegant flowers and cafe table at the bottom. Put the exact four-character title 心动来信, clearly readable in dark dusty rose calligraphy, in breathable upper-left or upper-center space, within safe margins. Only the game title may appear: no subtitle or slogans, no icon, no UI, no collage. Same content and art quality as the landscape source. Opaque square output at least 1440x1440 if possible.

## 实机素材

`tools/warm-signal/publishing/taptap-gameplay-v1.mp4`：540×960、H.264、40.77 秒，无额外配音/字幕/水印。通过浏览器截图接口持续采集实际 H5 操作画面，压缩操作之间的停顿并编码成视频；不是 AI 视频，也不冒充手机真机录制。画面展示实际专家选择、羁绊搭配、属性筛选、推荐组合与三星制作结算。首帧即为核心玩法，全片没有充值、商城、抽卡演出或外部平台界面。完整采集时间与帧记录保存在发行 artifacts。

用户四张原图保留在原路径和初次上传记录中；上传副本等比缩放并以奶油色补边，统一为720×1280，不拉伸、不重画或改字。另补一张实际羁绊组合操作截图，共五张。

[官方物料要求](https://developer.taptap.cn/docs/store/release/publish/material/)明确要求宣传图、最低截图规格和试玩实机视频。初次 CLI 返回的 suggested 字段与该文档必填标记不同，本次按文档补齐；服务端内容审核结果仍以实际状态为准。

