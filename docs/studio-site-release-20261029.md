# 晴川拾光工作室网站发布记录

日期：2026-10-29。用户指定使用现有 GitHub Pages 仓库与域名提供前端服务；没有创建 Sites 托管项目，也没有替换原个人博客首页。

## 页面与接入

| 页面 | 正式地址 | TapREP 监测链接 |
| --- | --- | --- |
| 工作室主页 | https://xiaolizi0v0.github.io/studio/ | 每张作品卡片使用对应游戏的链接 |
| 汽车质检模拟器 | https://xiaolizi0v0.github.io/studio/games/car-inspection/ | https://tap.cn/peq4uw17 |
| 重生之我的印刷术等级1000 | https://xiaolizi0v0.github.io/studio/games/printing/ | https://tap.cn/DXuWVipo |
| 心动来信 | https://xiaolizi0v0.github.io/studio/games/warm-signal/ | https://tap.cn/UshZi8Xk |

代表作来自浏览器实际读取的[工作室厂商页](https://www.taptap.cn/developer/493296)及三款详情页。监测链接通过平台“官网品牌挂件 → 游戏详情页”生成并复制，分别核对了最终 app ID 与 REP 来源参数。没有将普通详情链接冒充监测链接。

## 设计与文件

工作室首页参考用户给定聚光灯活动页的黑黄、聚光灯与大标题氛围，使用自己的构图与原游戏素材。三个游戏官网分别保留工业像素、宋风纸墨和温馨恋爱视觉，不改游戏代码与数值。

源码位于 `studio/`；`content/games.json` 管理信息及监测链接，`build.py` 生成静态页面，`assets/site.css` 与 `site.js` 提供布局和交互。素材来自用户提供的两个 D 盘游戏工程以及现有心动来信工程。视频分别清楚标识“实机片段”和“宣传片”，默认不自动播放。

原个人博客导航新增“晴川拾光工作室”。没有修改同时存在的 `tools/lingo/mock-data.js` 等无关变更。

## 验证

- 本地静态资源与页面路径全部解析通过；生成页面、JS 语法与 Git diff 检查通过。
- 桌面 1265px 与手机可用宽度 320 / 375px 检查，四页没有横向溢出。
- 作品筛选正确隐藏非当前分类并更新计数；手机菜单展开和导航后关闭正常。
- 截图灯箱打开、切换和关闭正常；视频原生控件可触发播放，文件为 H.264，带音轨的视频为 AAC。
- 原画与角色立绘保持比例；主视觉、画廊、无外部服务的站点运行没有读取游戏存档。
- 独立游戏官网浏览器日志未观察到错误。REP 短链接均确认落到对应游戏。

## 发布状态

准备完成，等待本次 GitHub Pages 部署验证与三条品牌挂件资源提交；不将页面代码就绪等同于平台审核通过。最终状态在下方补记。
