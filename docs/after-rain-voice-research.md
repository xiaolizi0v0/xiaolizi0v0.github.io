# 《心动在雨停之后》角色配音选型

当前 Edge TTS 是脚本计时与口型管线的占位音，不作为正式配音验收。段言和顾砚共用 Yunjian，予晴和沈乔共用 Xiaoyi，旁白、仲溪、林老师共用 Xiaoxiao；音高和语速变化没有解决角色辨识度，更没有形成戏剧表演。

## 已核验的候选来源

| 候选 | 官方能力/来源 | 与本项目的匹配 | 当前决定 |
| --- | --- | --- | --- |
| Qwen3-TTS 1.7B VoiceDesign + Base | [官方代码与流程](https://github.com/QwenLM/Qwen3-TTS)、[VoiceDesign 模型卡](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign)，Apache-2.0。支持中文描述设计音色，再用生成的参考音形成可复用克隆提示。 | 可分别设计青年、中年、老年角色，避免预设播音腔。角色参考录音为本项目原创合成音。 | 第一轮本地角色包与同台词对比；待试听，尚未宣布达到电影表演水准。 |
| Qwen3-TTS CustomVoice | 官方九种预设音色；中文原生包括 Vivian、Serena、Uncle_Fu、Dylan、Eric。1.7B 支持指令控制。 | 易用，但中文男性预设年龄、方言和四位男主不完全匹配，不宜再用少量预设分饰所有人。 | 保留技术备选，不作为九人最终选角。 |
| GPT-SoVITS 最新官方实现 | [RVC-Boss 官方仓库](https://github.com/RVC-Boss/GPT-SoVITS)，MIT 代码；当前文档已有 V5 / V2ProPlus。支持参考音与少量录音微调。 | 自有录音训练角色包是可行路径；基础模型不是已经选好的演员音色。 | 有合适的授权演员参考录音时可继续对比。 |
| AI-Hobbyist GPT-SoVITS V2 角色合集 | [发布者模型说明](https://huggingface.co/AI-Hobbyist/GPT-SoVits-V2-models/blob/main/README.md)，包括多个游戏角色；正文明确禁止商业用途和二次分发。 | 声线丰富，但不能直接用作计划商业发行的本游戏素材。 | 不下载接入正式游戏。 |
| shibing624 parrots 角色包 | [发布者模型说明](https://huggingface.co/shibing624/parrots-gpt-sovits-speaker/blob/main/README.md)，CC-BY-NC-4.0；含游戏角色/主播等。 | 更适合非商业研究。 | 不采用为正式选角。 |
| BigPancake01 GPT-SoVITS Mihoyo | [发布者模型说明](https://huggingface.co/BigPancake01/GPT-SoVITS_Mihoyo)，注明参考音和训练语音来自原神、星穹铁道。 | 仓库的 MIT 标签不能据此认定已有原作品配音的商业使用授权。 | 未核实原声音授权，暂不接入。 |
| CosyVoice3 | [官方仓库](https://github.com/QwenAudio/CosyVoice)、[官方调用示例](https://github.com/QwenAudio/CosyVoice/blob/main/example.py)。参考音与指令式语音生成方向值得对比。 | 可测试固定角色参考音下的情绪控制；需另外实际验证 Windows 环境和本机效果。 | Qwen 第一轮试听后决定是否引入第二引擎。 |
| Fish S2 Pro | [官方介绍与许可](https://fish.audio/zh-CN/s2/)，支持开放式情绪与副语言描述。模型使用 Research License，商业使用需单独授权。 | 表现力控制值得比较，尚无本项目授权/API配置。 | 不当作已可直接商用的本地角色包。 |

## 本项目角色包

`tools/after-rain/voice-casting.json` 定义九个独立声线。先生成每个角色的参考音，保存模型版本、生成种子、文本和声音描述；再用同一个参考音生成至少两条真实剧情台词，与旧 Edge TTS 同文试听。每个角色独立保存，不通过后期变调假装不同演员。

参考音必须干净，无背景音乐、无混响，不使用现成游戏角色台词或演员录音。正式批量配音前，先完成选角；不要把尚未试听的全部台词反复批量重做。

## 验收重点

1. 九个角色能仅凭听觉区分，年龄与身份相符，尤其区分四位成年男主与年轻女性/外婆。
2. 同角色跨台词音色稳定，称谓和中文人名不误读，不吞字、不多读、不循环。
3. 台词像在回应另一个人，重音与停顿符合意图；冲突、关心、玩笑和独白不能只有一种朗读语气。
4. 底噪、电音、削波和不自然拉长需要重录或重生成。自动测得非空 WAV、采样率和峰值只能证明文件有效，不能替代试听。
5. 正式音频确定后重做口型与场景节奏，旧占位音驱动的视频只保留为管线测试。

Qwen Base 的参考音复用有助于音色一致，但没有和 VoiceDesign 相同的 `instruct` 接口；不能承诺它单独提供精细的逐句情绪控制。第一轮必须比较实际结果，再决定情绪参考音、其他引擎或演员录音的后续方案。
