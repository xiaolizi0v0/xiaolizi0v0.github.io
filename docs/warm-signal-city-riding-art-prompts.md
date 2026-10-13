# 晴川二维骑行素材与提示词

2026-10-12 至 2026-10-13。使用内置 image_gen 生成和定向编辑，未使用外部 CLI。参考项目既有男主/唐梨日常与同行装透明图，保持角色身份、服装和二维插画风格。

当前启用的原始透明 PNG 保存路径：

- tools/warm-signal/assets/city-ride-shen-yu-v1.png：男主单人，三套服装、左右朝向，6 帧。
- tools/warm-signal/assets/city-ride-tang-li-boy-v2.png：男主骑手/唐梨后座，三套服装、左右朝向，6 帧。
- tools/warm-signal/assets/city-ride-tang-li-girl-v3.png：唐梨骑手/男主后座，三套服装、左右朝向，6 帧。

源 PNG 均为 1024×1536 RGBA，复制后未改写像素。inspect-city-riding.py 只读取 alpha 连通主体，输出 city-riding-frames.js 的 18 个源矩形；不按名义等分格裁剪，避免头发/轮胎越过行界时串图。初版朝向和间距不合格的版本未接入渲染，原生成文件保留在生成目录。

以下为完整提示词：

## 男主单人骑行

```text
Use case: identity-preserve. Asset type: new transparent 2D bicycle-riding sprite atlas for the original cozy romance game Warm Signal.
Input images: Image 1 is Shen Yu's daily design and style reference. Image 2 is the SAME adult male's cream and rose outfit reference. Preserve his face, brown tousled hair, warm brown eyes and soft finely painted anime chibi style. Create a NEW sprite sheet, do not reproduce the reference standing poses.
Layout: exactly TWO columns and THREE rows of equal cells, six complete disconnected compositions on true transparent alpha. Each cell one full adult male correctly RIDING a bicycle, all hair and both wheels inside the middle 80% of each cell, generous clear gutters and margins. Same character and bicycle size in all six cells.
Columns: left column bicycle travels to the LEFT, right column travels to the RIGHT. Near side view, face turned slightly toward viewer to retain identity.
Rows: row1 DAILY ivory textured cardigan over white tee, taupe trousers, ivory sneakers. Row2 CREAM crewneck sweatshirt with tiny ochre W chest embroidery, same taupe trousers and sneakers, NO cardigan. Row3 ROSE dusty pink sweatshirt with tiny ivory heart on chest, same trousers and sneakers, NO cardigan.
Pose/contact: buttocks visibly on saddle, hips bent, knees bent naturally, one sneaker on a pedal and other on opposite pedal, BOTH hands holding handlebars, elbows softly bent. No standing on wheels. Anatomically coherent 2D chibi limbs, no spare hands or feet. Warm small relaxed smile.
Bicycle: the SAME elegant dusty-rose step-through city bicycle in every cell, cream tires, brown saddle, subtly longer rear luggage rack and small front basket. Full wheels remain circular, clear thin wheel spokes, coherent fork and handlebar.
Style: premium warm 2D anime game illustration matching reference, fine linework, soft cel/gouache shading, matte finish. No 3D, no photorealism.
Constraints: ONLY one male and one bicycle per cell, no female, no backdrop, no floor, no shadows outside silhouette, no text labels/borders, no logo or watermark. Genuine alpha transparency. Preserve original heads and outfit colors; keep full complete bike inside every cell.
```

## 男主载唐梨

```text
Use case: identity-preserve. Asset type: a NEW genuine-transparent 2D tandem city-bicycle riding sprite sheet for Warm Signal.
Input images 1-2: the same adult male Shen Yu in daily ivory cardigan and cream/rose sweaters. Input images 3-4: the same adult photographer Tang Li in daily caramel jacket and cream/rose sweaters. These are identity, outfit and painterly chibi style references ONLY. Do NOT reproduce standing poses or their background.
Layout: exactly TWO columns by THREE rows, six isolated complete TWO-PERSON bicycle scenes, no overlap, equal cells, generous transparent gutters. Each cell must contain BOTH original characters and ONE complete bicycle with every hair, shoe, wheel inside the cell. Same bike and head size across all cells.
Columns: col1 travelling LEFT; col2 travelling RIGHT. Almost side view with faces turned slightly toward viewer, smiling softly.
Action in ALL cells: Shen Yu is the FRONT RIDER, visibly seated on the saddle, both hands on handlebars, bent knees with sneakers on pedals. Tang Li is the REAR PASSENGER, visibly seated on a padded rear luggage rack BEHIND Shen Yu, both knees together and two feet hanging safely on the near side away from spokes, one hand lightly holding rear grab rail or male jacket hem. Her skirt drapes naturally over seated knees. Show two distinct torsos and four coherent arms, no fused limbs. BOTH heads readable, passenger slightly offset so no face obscured. Tang Li has long chestnut loose side braid with cream flower clip and camera on neck.
Row1 DAILY: male ivory knit cardigan white tee taupe trousers ivory sneakers; female caramel jacket ivory blouse teal knee skirt cream socks brown Mary Janes, camera.
Row2 CREAM: BOTH cream sweatshirt with tiny ochre W chest embroidery, male taupe trousers/ivory sneakers, female teal skirt/cream socks/brown shoes/camera. NO jackets/cardigans.
Row3 ROSE: BOTH dusty-rose sweatshirt with tiny ivory heart chest motif, same trousers/skirt/footwear/camera. NO jackets/cardigans.
Vehicle: one elegant muted dusty-rose step-through bicycle, cream tires, brown saddle, front wicker basket, clearly visible two circular wheels, long padded rear passenger rack ABOVE rear wheel. No second bicycle. Driver bottom contacts saddle, passenger bottom contacts rear cushion, neither standing on wheels or floating.
Style: match fine warm 2D anime chibi illustration in references; same adult identities, approximately 2.5-head proportions, warm brown fine outlines, matte soft cel/gouache shading, no 3D or photorealism.
Constraints: genuine fully transparent alpha background, no scenery, no glow/floor/shadows/backdrop, no text labels, borders or watermarks. Never crop either wheel or hair. Each complete scene kept within central 84% of its cell.
```

## 唐梨载男主

```text
Use case: identity-preserve. Asset type: NEW genuine-transparent 2D couple bicycle riding sprite atlas for Warm Signal.
Images 1-2 reference adult male Shen Yu's identity and three outfits; images 3-4 reference adult photographer Tang Li's identity and three outfits. Preserve their faces, hair, proportions and soft finely painted chibi art. Create a NEW riding sheet.
Layout exactly TWO columns by THREE rows, six separate full bicycle scenes in equal cells, on fully transparent alpha. All hair, shoes, two wheels and bicycle frames complete with blank gutters, no overlap or crop. Left column travels LEFT, right column travels RIGHT; near side view, faces slightly turned toward camera. Uniform head size, wheel size and scale across all cells.
Action ALL cells: FEMALE Tang Li is the FRONT RIDER. She is seated on the brown saddle, torso leaning slightly to handlebars, BOTH hands holding handlebars, skirt draped safely across bent knees and camera resting on her chest; her brown Mary Jane shoes on pedals. MALE Shen Yu sits behind her on the padded rear rack, BOTH legs bent and hanging together on the near side away from wheels, one hand holding the rear grab rail or her shoulder lightly. They are physically separate, both faces readable, correct bent limbs and seat contact. The male MUST NOT drive; Tang Li's hands must be the ones holding handlebars.
Row1 DAILY: female caramel jacket over ivory blouse, teal knee-length skirt, cream socks, brown Mary Jane shoes, long chestnut loose side braid, cream flower hairclip, black vintage camera. Male ivory textured cardigan over white tee, taupe trousers, ivory sneakers, tousled brown hair.
Row2 CREAM: BOTH cream crewneck sweaters with tiny ochre W chest embroidery, no cardigan or jackets. Female same teal skirt/socks/shoes/camera/hairclip, male same trousers/sneakers.
Row3 ROSE: BOTH dusty-rose sweaters with tiny ivory heart chest motif, no cardigan or jackets. Preserve same other clothes and accessories.
Vehicle: one consistent elegant muted dusty-rose step-through city bicycle with cream tires, wicker front basket and clearly long padded passenger rear rack above rear wheel. Saddle between handlebar and rear cushion, no extra bike or wheels. Each composition two adult characters/one bicycle, no standing or floating.
Style: warm premium soft 2D anime game illustration, 2.5-head tall chibi adults, fine brown lines, matte gentle cel/gouache shading, no 3D/clay/photo.
Constraints: genuinely transparent background, no glow or floor or cast shadows, no scenery, no lettering, borders, labels, watermark or logo. Correct roles in BOTH left and right columns. Full bike kept inside each cell.
```

## 唐梨骑手右侧朝向修正

```text
Use case: precise-object-edit. Edit THIS six-cell transparent bicycle atlas only. Keep the TWO columns and THREE rows, all original faces, clothing, props, full bikes, exact art style and true transparency.
Mandatory correction to RIGHT COLUMN ONLY: each of its three complete bicycle scenes must travel toward the RIGHT EDGE of the image. The FRONT basket, handlebars and FRONT wheel must be on the RIGHT side of each right-column cell. Female Tang Li is the FRONT rider on the RIGHT half of the bicycle, both her hands on handlebars at the RIGHT. Male Shen Yu is the rear passenger on the LEFT half of the bicycle, sitting above the LEFT/rear wheel. This is the opposite arrangement of the left column.
LEFT COLUMN must remain unchanged: front basket at LEFT, female front rider on LEFT, male passenger on RIGHT.
In corrected RIGHT column, BOTH characters have their warm brown eyes naturally OPEN and a gentle small smile, matching left column. Do not keep squeezed closed eyes.
Maintain row1 daily ivory cardigan/caramel jacket, row2 matching cream W sweatshirts, row3 matching dusty-rose heart sweatshirts. Female camera, teal skirt, braid and flower clip remain. Do not change head sizes, bike scale, anatomical bent seated poses, or rear-passenger roles. No extra limbs, no crop, no background, no lettering or watermark. Full bicycle with both wheels inside every cell.
```

## 男主骑手图集间距修正

```text
Use case: precise-object-edit. Fix ONLY sprite layout spacing in this six-scene bicycle atlas, preserving the characters, exact three outfit rows, role male driving/female passenger, left/right bicycle directions and warm 2D art.
The six existing scenes are crowded across row boundaries. Create an airy exact 2-column x 3-row sheet on TRUE TRANSPARENT alpha, portrait canvas. Scale each COMPLETE bike-and-two-people scene down uniformly to about 75% of its present size inside its OWN cell; do not crop or deform. Place each scene at center of its equal cell. Leave a very clear transparent gutter of at least 50 pixels between the full bounding boxes of adjacent rows and columns, and at least 35 pixels at outside edges.
Every character hair, both wheel rims, all baskets, shoes and bike parts must be FULLY inside the SAME cell. No neighboring head can touch or overlap another cell's wheel. Every scene should be surrounded by a wide ring of empty transparent pixels.
Do not change identity, clothes, colors, poses, bicycle geometry, rows, columns or which person drives. Both faces with naturally open warm eyes. Keep reference style and correct seated anatomy. No backdrop, shadows, glow, panels, labels or text.
```

## 唐梨骑手图集间距修正

```text
Use case: precise-object-edit. Fix ONLY spacing and framing of this six-scene transparent bicycle atlas. Keep all six existing character designs, three outfit rows, female driving/male rear passenger, and two opposite directions unchanged.
Exact two columns by three rows. Scale EACH COMPLETE pair-and-bike uniformly DOWN inside its own equal cell. Target each full silhouette maximum 78% of cell width AND height. Re-center each entire scene; leave wide blank transparent gutters between all rows and columns, and especially at the outer RIGHT edge. The rightmost FRONT wheel is currently cut at the image edge: redraw its complete circular tire/rim/spokes within its cell with at least 35px clear transparent margin.
LEFT column basket/front wheel/female driver at LEFT and male rear passenger at RIGHT. RIGHT column basket/front wheel/female driver at RIGHT and male rear passenger at LEFT. Keep both characters' warm brown eyes OPEN, exact faces, hairclip/braid/camera, correct naturally bent seated limbs, full bicycles and same soft 2D illustration technique.
Row1 daily ivory cardigan and caramel jacket. Row2 both cream W sweaters. Row3 both rose heart sweaters. No clothes changes, no role swap, no extra limbs. Do not crop any hair/wheel/shoe, no overlap between cells. Genuine fully transparent alpha, no scenery, floor, glow, shadows, text, panels, labels or watermark.
```
