# 公司经营扩充策划 · v0.4

2026-10-09。先研究新版公司结构，后因用户指出卡面拉伸与皮肤重复，将独立卡面修正提高到当前优先级。

## 第一方参考与已查看图片

实际打开[官方 2025 公司升级说明](https://evol.papegames.cn/news/786)，并放大查看[公司布局长图](https://assets.papegames.com/nikkiweb/papegame/evolcn/material/t1devma-/2b1449a65699db12c1cbb4f3b2388289-sz_3012787.jpg)：大楼剖面、不同宽度房间、空间占用、装修保存和家具采购。参考只作结构分析；素材、角色项目、台词和数值为原创。

## 已接入经营规则与界面

运营资金与金币分开。最多八层，每层四格；办公、培训、茶水、剪辑、摄影、休息六种房间，占一或两格，位置必须不重叠。声誉提高解锁楼层上限。房间升级消耗资金与装潢图纸，送家具并提升制作属性。新建办公/培训/剪辑房间附书桌，摄影棚附摄影机，休息室附沙发，茶水间使用背景中的固定台面；附带家具加入全局持有库。

五名原有专家成为有专长和精力的员工。入驻办公房间，占用独立席位；工作消耗精力，任务计时 45～90 秒，房间级别及参与人数缩短时间。增效券减 30 秒；提神饮品恢复 40 精力；空闲或任务完成后每分钟恢复精力，茶水/休息室加快恢复。进行中的员工不能移走，同一房间不能叠加工作，领取后才能重新派工。

工作收益运营资金与声誉，限定家具概率 8%，第 100 次必得；重复家具转换资金 250。房间装修保存时一次购买尚未持有的家具，资金不足不改变布局；重复摆放不能重复刷声誉。18 件家具，基础六件、晴光六件、限定六件；已拥有的家具可用于多个房间。

每位女生的公司专属项目四步：采访、核查、剪辑、拍摄。按顺序完成，期间可邀请女生来访；每步反馈包含原创台词和单次分支好感。全部完成免费发放对应公司 ER、钻石 200、运营资金 1200、图纸 3、增效券 2、心愿 5。新增 ER 编号 84～89，剧情约会首次钻石 60、心愿 3。

城市新闻每次调查额外获得两枚调查勋章，用于图纸/券/饮品。声誉二级解锁每日简报；声誉阶段与五项建设成就均只领一次。旧房间、家具、公司属性及未完成的旧版合作计时保持兼容。

十项公司自动测试覆盖迁移、占用/交易、工作续存/单次领取、离线恢复、完整四步项目和 ER、家具保底、勋章/简报、坏存档拒绝、旧版剪辑/茶水编号映射、约会分支导出/重读/旧存档兼容。连同其他游戏与卡面测试，共 55 项通过。

## 页面与操作

- 大楼：暖色楼层剖面、角色来访、声誉牌；六种房间目录，选择后点击空格建设。调整布局时直接拖动空闲房间，松手验证占位并保存；工作中不能移动。
- 工作：日常制作目录、对应专长与精力、可选房间、任务倒计时、进度、增效与查收。工作记录保留最近 30 次；完成但未查收仍占用员工与房间。
- 项目：六位女生独立的四步轨道，当前步骤的房间选择、反馈与首次分支好感、免费 ER 奖励、来访及五段原创专属约会。卡册中未持有的公司 ER 可跳到对应项目，持有卡详情可直接打开约会。
- 员工：五位专家的专长、精力、入驻位置与饮品；工作结束查收后才可调动。座位容量与房间升级关联。
- 采购：调查勋章兑换补给，18 件家具目录；限定家具仅工作掉落。基础、晴光、限定分别采用色调变体，家具模型目前各系列共用六种基础造型。
- 声誉：下一级进度、每日简报、声誉阶段及公司成就；已领取按钮禁用，奖励状态入档。
- 课程：保留原有四维课程、专家培训、街区影像短合作。这里使用金币，显示当前金币与课程费用，和运营资金区分。
- 装修：房间独立预览，家具点击加入、拖动、镜像、收起；最大 12 件，保存前显示新购物件总价，取消或切换页签放弃本次草稿。

房间和家具 SVG 均等比显示。家具图集生成后实际对象不是等宽排列，按人工查看的独立边界裁切，排除邻物混入；没有对图片做宽高拉伸。角色卡面继续使用各自独立的 96 幅插画。

穿模反馈后的渲染修正：内容区、房间及画布各自隔离层级，家具深度仅在所在房间生效，房间标签和员工徽章覆盖在画布上，底栏采用不透明背景；图集 SVG 使用显式裁切框，避免等比 `meet` 的留白区域显示邻近家具。短屏房间滚到导航下方时，导航区域仍完全干净，装修坐标与镜像保持。

## 实际验收与保留差距

真实浏览器完成：扩建二楼，建设剪辑室/摄影棚/茶水间，安排四名员工，唐梨四步专属制作全部完成；消耗六张增效券后仍等待真实剩余计时，中途刷新后查收正常。ER 89 加入收藏，钻石 3310 → 3570、心愿 57 → 65；卡牌 11 → 12，原唐梨 R 仍 LV.2，金币保持 32942。重新阅读约会，钻石不变。

办公区购入沙发与绿植，保存一次资金 840；绿植拖动到 x=80.3834808259587%、y=88.58407079646018%，镜像为 true，刷新后读回一致。茶水间从第一层第 3 格拖至第 4 格，刷新仍为第 4 格。办公区升至 LV.2，资金 −1000、图纸 −2，四维各 +5；摄影棚添摄影机，茶水间收起额外书桌。实际领取每日简报、LV.2 声誉礼物及三间房建设成就，按钮禁用与补给数量一致。

320×568 六个主经营页签文档宽 305，不超过可用视口；底栏 y=490～568。另查看课程、装修及 390×844 实际布局。1440×900 时游戏容器宽 520，导航 y=820～900，无横向溢出；浏览器 error/warn 日志为空。截图位于 `warm-signal-screenshots/company-{building-mobile,building-desktop,decor-mobile,er-reward-mobile}.jpg`。

这一版公司经营可从建设走到专属 ER 与约会，但未覆盖原作全部公司活动和完整专属剧情体量，也没有联网协作、动态员工动作或真人排行。整款游戏的“所有玩法完美复刻”目标仍未达成。

## 原创素材与内置 imagegen 提示词

PNG 与压缩网页版本已保存：`tools/warm-signal/assets/company-rooms.png` / `.jpg`，`company-furniture.png` / `.webp`。

房间完整提示词：

Use case: stylized-concept. Asset type: original warm anime mobile romance game office-room background atlas. Create exactly SIX empty office interiors in an exact 3 columns by 2 rows grid, canvas 1536x1024, cells 512x512, boundaries x512/1024 and y512. Each square is a self-contained dollhouse cutaway room seen from the front with a slightly elevated camera: back wall, window detail, wood floor in lower 45%, no front wall, no ceiling, architectural lines align horizontally across every cell, no room crosses a cell boundary. Top row left: ivory office with two large windows and pale blue sky; middle: sage training room with blank pinboard and sunlit window; right: blush tea room with fixed small kitchen counter along the back wall. Bottom row left: lilac editing room with subtle acoustic panels; middle: apricot photo studio with pale backdrop roll against back wall; right: cream lounge with curtains and spring blossoms outside. No movable furniture, no desks, no sofas, no people, no animals. Detailed soft painterly anime game illustration, warm cream/caramel/sage/pink palette, coherent natural soft afternoon light, cozy workplace atmosphere. No UI, no labels, no text, no logos, no watermark, no visible grid borders.

家具完整提示词：

Use case: stylized-concept. Asset type: transparent furniture sprite atlas for an original warm anime office management romance game. Exactly SIX isolated furniture objects in an equal 3 columns x 2 rows atlas, canvas1536x1024, cell boundaries x512/1024 y512, every object fully inside its own square cell, generous 65px clear padding. Top row left to right: honey oak writing desk with small laptop, papers and office chair as one object; soft dusty rose two-seat sofa with cream cushions; tall leafy potted monstera in a sage ceramic pot. Bottom row left to right: warm ivory standing floor lamp with wood leg; low oak bookshelf filled with pastel books and a framed blank photo; compact professional video camera on a black tripod. View from slightly elevated front three-quarter angle, coherent camera across all objects, compatible with a dollhouse cutaway office seen from the front. Soft polished painterly anime illustration, natural warm light, cream oak sage blush palette, fine edges and believable details. Genuinely transparent background and tiny contact shadows only. No people, no room backgrounds, no text, no logos, no labels, no grid lines, no watermark.
