# 劫速街区 3D / Velocity Heist

独立静态网页游戏，入口 `../VelocityHeist.html`，工具页 id 9。不会覆盖《裂潮》或《回路暴走》的游戏和存档。需要 HTTP 服务和支持 WebGL2 / import maps 的现代浏览器。

完整策划：`../../docs/velocity-heist-design.md`。验证记录：`../../docs/velocity-heist-validation.md`。

## 内容

- 三辆 Blender 原创车模，24 张独立布局赛道、三种街区环境、三个首领机制。
- 七车实时竞速：六站锦标赛及无尽巡游；前 3 晋级，决赛前 2 且领先首领。
- 尾流连接后交换**即时车速**，不交换位置；玩家铺下的加速轨真实加速 AI。
- 漂移蓄电和热管理，氮气、护盾、维修；24 种改件、6 条高阶配方。
- 站间车库、合约、三种路线，五项永久研究、八项成就、种子重赛与独立存档。
- 手机摇杆、多指按住漂移/刹车，键盘、自动油门、全屏与高/低画质；原创 WebAudio 引擎、音效和节拍。

## 模型与渲染

`models/velocity-garage.blend`：可编辑 Blender 5.2.2 LTS 场景，三个车系的独立车身、玻璃、车轮、尾翼、灯组和涂装材质；73 / 74 / 78 个对象。

`models/build-cars.py`：可重复生成模型、GLB、清单和车库预览。仅在新建后台进程执行，不改动当前打开的 Blender 场景：

```powershell
blender --background --factory-startup --python tools/velocity-heist/models/build-cars.py
```

`render3d.js`：真实 PerspectiveCamera、三维赛道与建筑、模型材质、滚动车轮、灯光阴影、追车/高视角镜头、路轨与警戒面。静态几何按材质合并，建筑和窗灯用实例渲染，轮胎痕与粒子有固定上限，换站释放临时资源。

`vendor/`：官方 Three.js 0.186.1 及 GLTFLoader 的本地依赖，MIT 许可证随附。无需运行时 CDN。

驾驶规则以闭合赛道的连续纵向进度和横向惯性表示，是街机驾驶模型；三维世界由这些规则同步驱动。封闭赛道保持在同一地面高度。

## 验证

```powershell
node tools/velocity-heist/tests.cjs
```

`simulate.cjs` 的长局控制器只调用实际转向、漂移、技能、商店、改件和路线 API，不注入生命、速度、研究等级或名次。`simulation-results.json` 保存种子、构筑、完整赛事和 24 张地图的晋级记录。

存档键：`velocity-heist-profile-v1` 与 `velocity-heist-run-v1`。训练不覆盖正式赛事，结果按唯一赛事 id 结算一次。隐藏页面会暂停，存储失败时保留本页内存进度。
