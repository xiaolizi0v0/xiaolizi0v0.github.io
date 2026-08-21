#!/usr/bin/env bash
# 影视剧观影时间胶囊 - 本地代理 (macOS / Linux)
# 双击或运行本脚本：只启动本地代理服务

cd "$(dirname "$0")"

# 检查 Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "错误: 未检测到 Node.js，请先安装 https://nodejs.org"
  read -r -p "按回车退出..."
  exit 1
fi

echo "正在启动本地代理 (127.0.0.1:25100) ..."
echo "请保持本窗口开着，关闭即停止代理。"
echo "代理地址：http://127.0.0.1:25100"
echo ""
node local-proxy.js
