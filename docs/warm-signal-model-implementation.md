# 唐梨模型制作实际进展

> 当前状态：用户于 2026-10-09 选择先不做 Live2D，改用精美静态立绘＋轻量动效。本文保留此前试验记录，不再作为当前生产待办。当前方案见 docs/warm-signal-static-art-plan.md。


更新：2026-10-09。本轮继续落实无 Photoshop 的制作路线；正式 Live2D 尚未完成。

## 已落地

1. 独立源码目录：C:/Users/xiaolizi0v0/.codex/warm-signal-model-runtime/see-through，原作者上游提交 df019de5129d6c4b406587a14c3501669441a783。
2. 独立 venv：seethrough-venv，启用 system-site-packages 复用已有 CUDA PyTorch；新安装依赖仅写入该 venv，没有卸载/覆盖系统环境。
3. 依赖导入及原作者 inference_psd.py --help 实际运行成功。当前 Python 3.13.7（上游说明基于 3.12）；差异保留记录，尚不能仅据此声称推理成功。
4. 安装 diffusers 0.37.0、accelerate 1.13.0、transformers 5.0.0、huggingface-hub 1.7.2、scikit-learn 1.7.2、pycocotools 2.0.11、psd-tools 1.14.2；PSD 合成依赖 scikit-image 0.25.2 与 aggdraw 1.4.1 也已安装成功。
5. 本地加载修订：from_pretrained 直接使用 bfloat16，减少先加载 float32 再转换的内存峰值，计算精度仍为上游预期 bfloat16。补丁保存于 tools/warm-signal/models/tangli/seethrough-bf16-loading.patch。
6. 以初版 Tang Li 完整原画启动真实试跑：seed 42，1280 方形推理画布，depth 768，30 步，group offload，左右部件拆分，保存 PSD。运行时关闭 HF 隐式 token 使用，公开模型匿名下载到独立缓存。
7. 正面中性原画 v2：用内置 imagegen 基于初版整张人物编辑，头部正直、双臂分开；1024×1536 RGBA，保持暖棕眼睛、栗色卷发、花夹、奶油针织衫与蓝色花裙。实际提示词见 tools/warm-signal/models/tangli/tangli-neutral-v2-prompt.md。
8. 预览页加入 v2/v1 原画选择，默认 v2；实测切换后图像与下载地址一致，无横向溢出。对比旧拼接时使用对应 v1 基准，避免把不同姿势错误登记为拆层差异。
9. 新增 run-seethrough.ps1：独立版本目录、来源 hash/上游提交/本地补丁、日志、退出状态及环境还原。新增 import-seethrough.py：将实际 PSD 转换为网页可检查的 PNG/清单，保留原坐标与顺序，正确应用栅格透明遮罩，拒绝空 PSD、画布不一致、未处理组/矢量遮罩/裁切/混合方式与覆盖旧试验。现已完成真实 24 层 PSD 的导入和逐层叠回检查。

## 试跑标识

- 输入 SHA256：ad9adb187163bad7f9060f97c9e2058bcf00abcc2a44fbe4129dbb672bb89156。
- LayerDiff3D 元数据提交：4477e6ce529bc6a141732e1a55a4932176db3b89；公开模型最大的单个权重 8142919672 字节。
- Depth 元数据提交：4f4ffc46050b6feb764b628859968a26e76e6b6a。
- 初次试跑会话 73501，14:28:15 启动，Python 进程 134028。主 UNet（8142919672 字节）于 14:57:33、VAE（167335590 字节）于 15:02:47 下载完成，另有 TransparentVAE 已完成。Xet 日志随后记录 73 次 tls handshake eof、2 次 IncompleteMessage；普通 HTTPS 对两个文本编码器权重的 HEAD 检查均返回 200。核验进程命令行后，仅停止该试跑，会话实际退出码 1；没有删除已下载缓存。这是依据具体传输错误切换方式，不是因为观察超时推断任务停止。
- 后续试跑会话 80891，15:26:35 启动，以正面中性 v2 为输入，SHA256 89a3618f026d00586bf72be6fd5c6f83231a020be2da52aaa6f4a36e69665120。实际推理 Python 166668，使用 run-seethrough.ps1 -DownloadTransport http；仅该任务设置 HF_HUB_DISABLE_XET=1。15:55:56 实际结束，退出码 0，run.json 为 inference-finished-awaiting-art-review；GPU/进程已释放。首次整体试跑含补齐权重约 29 分 22 秒，不能作为纯推理耗时。
- 下载脚本没有显式配置 HTTP/HTTPS/ALL_PROXY；早期 urllib.request.getproxies() 返回空字典，后续只有 localhost 等 NO_PROXY 排除规则。继续检查系统路由后，Find-NetRoute 对官方下载连接地址实际选择 Mihomo 虚拟网卡，说明流量由系统代理接管；是否走远端节点取决于 Mihomo 分流规则。没有修改用户的代理或路由配置。
- 当前输出目录：C:/Users/xiaolizi0v0/.codex/warm-signal-model-runtime/seethrough-output/tangli-neutral-v2-s42-1280-http；包含 run.json、source-changes.patch 和持续追加的 inference.log。初次 trial 尚未创建推理输出目录，记录保留在本文件与原进程 Xet 日志。

## 验收边界

现已实际产出 24 层、1280×1280、RGB 8-bit 的分层 PSD（14162194 字节），但尚未通过完整美术与动作验收，没有新的 .moc3 或绑定动画。先对照原画修正层序、隐藏补绘与接缝，再进入绑定；不能以文件生成成功替代人物审美与动作检查。

## 实际生成阶段更新

- 文本编码器两个权重已分别在 15:28:04、15:31:53 完整落盘，LayerDiff 管线实际加载成功。首轮躯干部件 30 步约 5 分 5 秒，第二轮五官 30 步约 4 分 37 秒，均实际完成；已生成 1280 方形画布的前后发、上衣、手臂、头部以及五官原始部件。
- 实际检查 PNG 的 Alpha：head/topwear/handwear/front hair/back hair 的有效区域各不相同、背景透明，tail/wings 全透明；不能把 PNG 的隐藏 RGB 预览误判成实色背景。部件保留整体坐标，没有重新按包围盒拉伸眼睛。
- Marigold 深度模型预取会话 90619（实际 Python 135992）已退出 0，下载固定提交 4f4ffc46050b6feb764b628859968a26e76e6b6a 至同一缓存，总文件约 3.28 GB，没有重复启动 GPU 推理。主推理复用该缓存完成深度 4 步，约 11 秒，然后成功导出 PSD。
- 新增 review.html：按实际 PSD 清单同坐标对照原画/合成图，支持当前层独显、隐藏、脸部/图层放大、原画透明叠加及三版本切换，已接入真实输出。桌面实际验证脸部对照、独立睫毛层和失败/精修版本切换；手机曾因长 SHA256 文本溢出，已修复换行，390 视口下 clientWidth/scrollWidth 均为 375，临时视口已还原。
- 导入器拒绝未完成/失败运行、非 8-bit RGB、矢量遮罩/裁切/非普通混合和输入 hash 不一致的情况。实际输出的 24 层均带栅格遮罩，不能直接 topil 丢失它；已用单层合成正确应用遮罩/透明度，并记录 rasterMaskApplied。原始输入与方形推理参考分别记录 hash，原始 PNG 保留。实际负面测试在创建目录前拒绝 running 记录。三份真实候选的 PNG 按原坐标重叠后，与各自 PSD 合成图在白底上的最大通道误差均为 2/255、超过 3 的像素均为 0，原始输入 hash 均匹配；这证明格式转换，不证明审美。
- 已克隆 PSD2Live 原作者源码（https://github.com/tsunehimatoi/psd2live），提交 aaee47d6af4e81afd0de9743e7f2ed0ece8af58f，GPL-3.0 工具代码留在独立运行目录。拆层结束释放内存后，用本机 JDK 21、独立 Gradle 9.6.1 缓存、3GB 构建堆与两 worker 实际完成 classes，BUILD SUCCESSFUL，约 6 分 59 秒。初次 Java AF_UNIX 本地通信失败，任务级 jdk.net.unixdomain.tmpdir/java.io.tmpdir 指向完整绝对临时路径后通过；未修改系统 JDK、网络或防火墙。CLI/导出仍须实测，不能以编译成功替代绑定验收。See-through 的 -l/-r 后缀兼容该分类器；全圈睫毛和近闭口素材仍须精修。

## 真实 PSD 的修订与当前缺口

- seethrough-neutral-v2-s42：原始深度排序让腿/上衣遮住裙子、项链被遮，标记 rejected-art-quality，原始结果完整保留。
- seethrough-neutral-v2-order-v1：order-seethrough.py 只更改层序。重新读 PSD，24 层 RGB、栅格遮罩、坐标、透明度与可见性逐项一致；但底裙的隐藏补绘伸到胸前，单改层序仍不合格，也标记 rejected-art-quality。
- seethrough-neutral-v2-garment-v2：constrain-garment.py 仅约束 bottomwear 在画布 y=706 以上的遮罩，其余遮罩、全部 RGB/坐标/层序核验未变。706 来自原始蓝裙腰在中心区域连续五行蓝色像素的起点，与人工对照一致。该版消除了胸前大块错误遮挡，状态 needs-art-refinement；腰部两侧还有灰色补绘及接缝、颈部边缘/颜色不连贯、胸前卷发归入后发，不能接入游戏冒充完成模型。
- 浏览器脸部并排显示五官比旧独立拼接方案自然，但新方案依然改变部分发丝/肤色，未取得用户最终美术确认。实际截图：docs/warm-signal-screenshots/tangli-seethrough-face-v2.png。入口 preview.html 已提供「实际拆层检查」。尚未验证闭眼、开口、转头或任何正式 SDK 动作。

参考：[See-through 原作者仓库](https://github.com/shitagaki-lab/see-through)、[Hugging Face 任务下载环境变量](https://huggingface.co/docs/huggingface_hub/en/package_reference/environment_variables)。总体制作方案与更完整的方法比较见 tools/warm-signal/models/tangli/production-plan.md。
