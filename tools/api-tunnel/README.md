# API 内网穿透

默认将 `http://10.21.1.45:26199/v1` 通过 Cloudflare Quick Tunnel 暴露为临时 HTTPS 地址。
双击同目录下的 `start.bat` 即可启动并显示公网地址；双击 `stop.bat` 停止。BAT 和对应的 PS1 文件需保留在同一目录。

在能够访问该内网服务的 Windows 电脑上运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\api-tunnel\start.ps1
```

首次运行会从 Cloudflare 官方 GitHub 下载 cloudflared。脚本检查内网 TCP 连接，后台启动隧道，等待 Cloudflare 确认连接，再打印公网 API base URL。业务接口是否正常仍需单独验证。

输出例如 `https://example.trycloudflare.com/v1`，可作为客户端 `base_url`。原服务的 API Key 仍按原方式放在 `Authorization: Bearer ...` 中。
完整 URL 存在 `.runtime/public-api-url.txt`，连接日志存在 `.runtime/tunnel.log`。

```powershell
# 验证模型接口；如果服务要求认证，加上 -H "Authorization: Bearer YOUR_API_KEY"
$apiBase = (Get-Content .\tools\api-tunnel\.runtime\public-api-url.txt -Raw).Trim()
curl.exe "$apiBase/models"

# 停止后台隧道
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\api-tunnel\stop.ps1

# 指向其他服务
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\api-tunnel\start.ps1 -ApiUrl http://192.168.1.10:8000/v1
```

公网请求 `/v1/models` 会转发至内网 `/v1/models`，路径不重复。隧道连接的是整个端口，原服务的其他路径也可被访问；脚本不额外添加鉴权。

Cloudflare Quick Tunnel 不需要账号或域名，重启后域名会变化，电脑关机或进程停止后地址失效。它不支持 SSE，调用大模型时使用 `stream=false`。固定地址或流式调用需要配置正式 Cloudflare Tunnel，或通过自己的公网服务器部署 frp。

官方说明：https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/
