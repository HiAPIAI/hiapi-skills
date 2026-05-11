# HiAPI Skills

HiAPI 官方 AI Agent 技能目录。

**HiAPI Skills • 安装 • API Key • [HiAPI](https://www.hiapi.ai/zh)**

[免费获取 API Key](https://www.hiapi.ai/zh/register) · [查看价格](https://www.hiapi.ai/zh/pricing) · [HiAPI 文档](https://docs.hiapi.ai) · [Remote MCP 指南](https://docs.hiapi.ai/zh/for-ai/) · [English](README.md)

---

> AI Agent? 直接看 [llms-install.md](llms-install.md)。它会告诉你的 Agent 该安装哪个 skill、如何设置 `HIAPI_API_KEY`，以及 Key、余额、限流或模型请求失败时应该怎么提示用户。

---

## 这是什么？

这是 HiAPI 官方 AI Agent 技能目录，适用于 OpenClaw、Claude Code、Codex、OpenCode、Cursor 类 Agent 工作流，以及其他可以读取本地 skill 的工具。

HiAPI 是为开发者打造的 AI API 平台：一个 API，所有 AI 模型。这些 skill 把常用的图像和视频生成工作流封装好，让 AI Agent 不需要猜接口和参数，就能调用一个明确的模型完成任务。

当你想选择 HiAPI skill 时，先看这个仓库。准备开始生成图片或视频时，再安装对应的单模型 skill 仓库。

---

## 可用技能

| 技能 | 适合场景 | 模型 | 仓库 |
| --- | --- | --- | --- |
| GPT Image 2 | 海报、插画、社媒图、产品图、封面图 | `gpt-image-2` | [hiapi-gpt-image-2-skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill) |
| Seedance 2.0 Video | 文生视频、图生视频、电影感片段、产品视频、分镜 | `seedance-2-0` | [hiapi-seedance-2-0-video-skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill) |
| HappyHorse 1.0 Video | 轻量文生视频草稿、短视频、广告概念 | `happyhorse-1-0` | [hiapi-happyhorse-1-0-video-skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill) |

---

## 我该安装哪个？

| 我想要... | 安装 |
| --- | --- |
| 根据文字生成图片 | [GPT Image 2 Skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill) |
| 生成视频，或让图片动起来 | [Seedance 2.0 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill) |
| 快速生成一段短视频 | [HappyHorse 1.0 Video Skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill) |
| 让 Agent 在聊天里访问更多 HiAPI 模型 | [HiAPI Remote MCP 指南](https://docs.hiapi.ai/zh/for-ai/) |

如果你要一个稳定、明确、单模型的工作流，用 skill 更合适。如果你希望聊天 Agent 能发现和调用更多 HiAPI 工具，用 Remote MCP 更合适。MCP 端点是 `https://mcp.hiapi.ai/mcp`。

---

## 快速安装

### OpenClaw

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-gpt-image-2-skill
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
openclaw skills add https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill
```

### Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"

git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git /tmp/hiapi-gpt-image-2-skill
cp -R /tmp/hiapi-gpt-image-2-skill "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-gpt-image-2"

git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git /tmp/hiapi-seedance-2-0-video-skill
cp -R /tmp/hiapi-seedance-2-0-video-skill "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video"

git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git /tmp/hiapi-happyhorse-1-0-video-skill
cp -R /tmp/hiapi-happyhorse-1-0-video-skill "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-happyhorse-1-0-video"
```

复制后重启 Codex。

### Claude Code

```bash
mkdir -p "$HOME/.claude/skills"

git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git /tmp/hiapi-gpt-image-2-skill
cp -R /tmp/hiapi-gpt-image-2-skill "$HOME/.claude/skills/hiapi-gpt-image-2"

git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git /tmp/hiapi-seedance-2-0-video-skill
cp -R /tmp/hiapi-seedance-2-0-video-skill "$HOME/.claude/skills/hiapi-seedance-2-0-video"

git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git /tmp/hiapi-happyhorse-1-0-video-skill
cp -R /tmp/hiapi-happyhorse-1-0-video-skill "$HOME/.claude/skills/hiapi-happyhorse-1-0-video"
```

### 任意支持技能目录的 Agent

```bash
export AGENT_SKILLS_DIR="/path/to/your/agent/skills"
mkdir -p "$AGENT_SKILLS_DIR"

git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git "$AGENT_SKILLS_DIR/hiapi-gpt-image-2"
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git "$AGENT_SKILLS_DIR/hiapi-seedance-2-0-video"
git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git "$AGENT_SKILLS_DIR/hiapi-happyhorse-1-0-video"
```

---

## 获取 API Key

1. 打开 [HiAPI 注册页](https://www.hiapi.ai/zh/register)。
2. 登录或注册 HiAPI 账号。
3. 创建 API Key。
4. 在运行 Agent 的终端设置：

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

每个单模型 skill 都包含 `scripts/check-config.mjs`，Agent 可以先检查 Key 和网络，再开始生成。

---

## 给 Agent 的提示词

复制给你的 AI Agent：

```text
使用 HiAPI skills 完成图像和视频生成。

如果我要生成图片，安装或使用：
https://github.com/HiAPIAI/hiapi-gpt-image-2-skill

如果我要更完整的视频工作流，或要图生视频，安装或使用：
https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill

如果我要快速生成一段文生视频短片，安装或使用：
https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill

使用 HIAPI_API_KEY 鉴权。如果 Key 缺失、无效、被限流，或账号余额不足，请明确告诉用户下一步，并链接到 HiAPI。
```

---

## 机器可读索引

本仓库包含 [skills.json](skills.json)，里面记录了当前 HiAPI skill 仓库、模型页、安装命令和适用场景，方便 Agent 或脚本读取。

---

## 常见问题

| 问题 | 下一步 |
| --- | --- |
| 缺少 `HIAPI_API_KEY` | 到 [HiAPI 注册页](https://www.hiapi.ai/zh/register) 创建或复制 Key，然后设置 `HIAPI_API_KEY`。 |
| Key 无效或鉴权失败 | 检查 Key，或到 [HiAPI 注册页](https://www.hiapi.ai/zh/register) 重新创建。 |
| 余额、额度或支付状态不足 | 到 [HiAPI Dashboard](https://www.hiapi.ai/zh/dashboard) 检查账号状态，并查看 [价格页](https://www.hiapi.ai/zh/pricing)。 |
| 请求被限流 | 稍后重试，或减少并发生成请求。 |
| 不确定该用哪个模型 | 先看上面的选择表，或查看 [HiAPI Remote MCP 指南](https://docs.hiapi.ai/zh/for-ai/)，让 Agent 查看可用工具。 |

---

## 相关 HiAPI 仓库

- [HiAPI GPT Image 2 Skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill)
- [HiAPI Seedance 2.0 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill)
- [HiAPI HappyHorse 1.0 Video Skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill)
- [Awesome GPT Image 2 Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts)

---

## 许可证

MIT

---

[HiAPI](https://www.hiapi.ai/zh) — 一个 API，所有 AI 模型。
