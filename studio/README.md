# 晴川拾光工作室官网

GitHub Pages 静态站点，无构建依赖、无后端服务，页面和视频资源均由本仓库提供。

## 页面

- 工作室首页：<https://xiaolizi0v0.github.io/studio/>
- 汽车质检模拟器：<https://xiaolizi0v0.github.io/studio/games/car-inspection/>
- 重生之我的印刷术等级1000：<https://xiaolizi0v0.github.io/studio/games/printing/>
- 心动来信：<https://xiaolizi0v0.github.io/studio/games/warm-signal/>

工作室列表和文案已通过浏览器核对[工作室 TapTap 页面](https://www.taptap.cn/developer/493296)及各游戏详情页。三款游戏的测试状态和可用平台以 TapTap 实际页面为准；页面没有编造评分、玩家数量或编辑推荐。

## 更新方式

编辑 `content/games.json` 中的文案、资源名称及监测链接，随后在仓库根目录运行：

```powershell
python studio/build.py
```

生成 `index.html` 和三个 `games/*/index.html`。样式与交互位于 `assets/site.css`、`assets/site.js`。静态 HTML 中直接写入跳转链接，停用 JavaScript 时仍可导航和前往 TapTap；JavaScript 增强类型筛选、手机菜单、截图灯箱和键盘操作。视频默认不自动播放、不预加载完整内容。

## TapREP 官网品牌挂件

根据[官方说明](https://rep.taptap.cn/docs/taprep-brand)，在官网提供明确的 TapTap 下载入口，并使用平台生成的真实监测链接。没有伪造监测参数，也没有用普通详情链接冒充监测链接。

| 游戏 | TapTap app ID | 平台生成的官网监测链接 |
| --- | --- | --- |
| 汽车质检模拟器 | 1003719 | https://tap.cn/peq4uw17 |
| 重生之我的印刷术等级1000 | 978248 | https://tap.cn/DXuWVipo |
| 心动来信 | 975366 | https://tap.cn/UshZi8Xk |

以上三个短链接已通过真实跳转核对，分别落到相应 app ID，并带 TapTap REP 来源参数。首页的游戏卡片和独立官网的主要下载入口统一使用对应游戏的监测链接；论坛与厂商主页仍是正常导航链接。

平台“生成链接”和“提交资源审核”是不同步骤。资源审核状态见本次发布记录 `docs/studio-site-release-20261029.md`；页面接入不代表奖励、推荐或审核通过。不修改游戏内广告、充值、登录、存档和数值。

## 设计与素材

- 工作室首页参考用户指定的[2026 聚光灯活动页](https://www.taptap.cn/poster/NIKiDS1YShdA?utm_content=aid2126)的黑黄配色、醒目标题和聚光灯氛围，使用自己的排版、工作室标志和游戏素材。
- 汽车质检官网采用原游戏的像素工业、终检工位与纸质证件视觉，素材来自用户提供的汽车质检工程。
- 印刷术官网采用原游戏的宋风山水、宣纸、朱砂及角色美术，素材来自用户提供的印刷术工程。
- 心动来信官网采用现有原创宣传图、角色与实机画面，保留温暖奶油色及柔玫瑰色。
- `assets/sources.json` 保存素材来源记录。没有复制他人活动页的图画，也没有将宣传视频标成实机录像。

## 本地预览

```powershell
python -m http.server 8793 --bind 127.0.0.1
```

打开 `http://127.0.0.1:8793/studio/`。移动端验证包含 320 / 375 px 可用宽度、菜单展开关闭、类型筛选、截图前后切换、视频控件和无横向溢出。页面尊重系统减少动态效果偏好，包含安全区留白、跳到正文、可见键盘焦点和原生弹窗 Escape 关闭。
