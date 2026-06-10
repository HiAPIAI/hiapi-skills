# HiAPI Skills

HiAPI 官方 AI Agent 技能目录。

**HiAPI Skills • 安装 • API Key • [HiAPI](https://www.hiapi.ai/zh)**

[获取 API Key](https://www.hiapi.ai/zh/dashboard/api-keys) · [查看价格](https://www.hiapi.ai/zh/pricing) · [HiAPI 文档](https://docs.hiapi.ai) · [GPT Image 2 提示词集](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) · [Seedance 2.0 提示词集](https://github.com/HiAPIAI/awesome-seedance-2-0-prompts) · [Remote MCP 指南](https://docs.hiapi.ai/zh/for-ai/) · [English](README.md)

> **HiAPI Matrix:** 🎨 [Image Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) · 🎬 [Video Prompts](https://github.com/HiAPIAI/awesome-seedance-2-0-prompts) · 🛠️ **Agent Skills (you are here)** · 🤖 [Remote MCP](https://docs.hiapi.ai/for-ai/) · 📖 [API Docs](https://docs.hiapi.ai)

---

> AI Agent? 直接看 [llms-install.md](llms-install.md)。它会告诉你的 Agent 该安装哪个 skill、如何设置 `HIAPI_API_KEY`，以及 Key、余额、限流或模型请求失败时应该怎么提示用户。

---

## 这是什么？

这是 HiAPI 官方 AI Agent 技能目录，适用于 OpenClaw、Claude Code、Codex、OpenCode、Cursor 类 Agent 工作流，以及其他可以读取本地 skill 的工具。它帮助你先选对 HiAPI 入口，再安装具体的单模型 skill。

HiAPI 是为开发者打造的 AI API 平台：一个 API，所有 AI 模型。这些 skill 把常用的图像和视频生成工作流封装好，让 AI Agent 不需要猜接口和参数，就能调用一个明确的模型完成任务。

当你想选择 HiAPI skill 时，先看这个仓库。准备开始生成图片或视频时，再安装对应的单模型 skill 仓库。

---

## 公开入口地图

| 入口 | 链接 | 什么时候用 |
| --- | --- | --- |
| 图像 Prompt Gallery | [awesome-gpt-image-2-prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) | 想先看 GPT Image 2 真实效果图和创意配方，再生成图片。 |
| 视频 Prompt Gallery | [awesome-seedance-2-0-prompts](https://github.com/HiAPIAI/awesome-seedance-2-0-prompts) | 想先看 Seedance 2.0 真实视频配方，再做文生视频或图生视频。 |
| Agent Skills | [hiapi-skills](https://github.com/HiAPIAI/hiapi-skills) | 想浏览可用的 HiAPI skills，并选择一个明确的单模型工作流。 |
| Remote MCP | `https://mcp.hiapi.ai/mcp` | 客户端支持远程 MCP，并能传 `Authorization: Bearer <HIAPI_API_KEY>`。 |
| 异步任务 API | [docs.hiapi.ai/api-reference](https://docs.hiapi.ai/zh/api-reference/) | 正在构建后端服务，需要 `POST /v1/tasks`、轮询、签名回调和任务历史。 |
| API Cookbook | [docs.hiapi.ai](https://docs.hiapi.ai) | 想直接复制 API 请求形态、模型参数和接入指南。 |

这些入口各自解决不同问题：

- **Prompt Galleries** — 已经验证过的提示词配方，先看真实案例和效果，再调用 API。
- **Agent Skills** — 给 Agent 用的单模型工作流，外加一个纯提示词的 Video Prompt Generator skill，把简报变成可直接生成的视频提示词。
- **Remote MCP** — 托管的 MCP 端点，客户端用请求头携带 HiAPI API Key 即可调用 HiAPI 工具。
- **异步任务 API** — 产品级服务端集成的 `/v1/tasks` 稳定契约，覆盖队列、轮询、签名回调和任务历史。
- **API Cookbook** — API 直调示例和模型参数说明。

---

## 可用技能

| 技能 | 适合场景 | 模型 | 仓库 |
| --- | --- | --- | --- |
| GPT Image 2 | 海报、插画、社媒图、产品图、封面图 | `gpt-image-2` | [hiapi-gpt-image-2-skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill) |
| Seedance 2.0 Video | 文生视频、图生视频、电影感片段、产品视频、分镜 | `seedance-2-0` | [hiapi-seedance-2-0-video-skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill) |
| HappyHorse 1.0 Video | 轻量文生视频草稿、短视频、广告概念 | `happyhorse-1-0` | [hiapi-happyhorse-1-0-video-skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill) |
| Video Prompt Generator | 把简报、链接、调研主题写成分镜级的 Seedance/HappyHorse 提示词，生成前用 | —（纯提示词，不调模型） | [hiapi-video-prompt-generator-skill](https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill) |

---

## 先选哪个入口？

| 我想要... | 打开 |
| --- | --- |
| 先找一个有真实效果图的图像提示词参考 | [Awesome GPT Image 2 Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) |
| 先找一个有真实效果的视频提示词参考 | [Awesome Seedance 2.0 Prompts](https://github.com/HiAPIAI/awesome-seedance-2-0-prompts) |
| 根据文字生成图片 | [GPT Image 2 Skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill) |
| 生成视频，或让图片动起来 | [Seedance 2.0 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill) |
| 快速生成一段短视频 | [HappyHorse 1.0 Video Skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill) |
| 把一句话简报或链接变成分镜级视频提示词再生成 | [Video Prompt Generator Skill](https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill) |
| 让 Agent 在聊天里访问更多 HiAPI 模型 | [HiAPI Remote MCP 指南](https://docs.hiapi.ai/zh/for-ai/) |
| 构建带 Webhook 和任务历史的服务端集成 | [异步任务 API](https://docs.hiapi.ai/zh/api-reference/) |

如果你要一个稳定、明确、单模型的工作流，用 skill 更合适。如果你希望聊天 Agent 能发现和调用更多 HiAPI 工具，用 Remote MCP 更合适。MCP 端点是 `https://mcp.hiapi.ai/mcp`。

如果是在写应用代码，直接调用 `/v1/tasks`：用 `POST https://api.hiapi.ai/v1/tasks` 提交任务，用 `GET https://api.hiapi.ai/v1/tasks/{taskId}` 查询状态，或注册 `callback.url` 接收带 `X-HiAPI-Timestamp` 和 `X-HiAPI-Signature` 的终态回调。

---

## MCP vs Skill

两种入口用的是同一个 HiAPI 账号、同一把 `HIAPI_API_KEY`。区别在于"Agent 怎么跑"和"你想要多稳的工作流"。

| 维度 | 单模型 Skill | Remote MCP |
| --- | --- | --- |
| 是什么 | 本地 skill 目录，被 Agent 加载（Codex、Claude Code、OpenClaw 等） | 托管 MCP 端点：`https://mcp.hiapi.ai/mcp` |
| 安装方式 | `git clone` 或 `openclaw skills add` 到 Agent 的 skills 目录 | 在 Agent 的 MCP 配置里加一段 JSON，不用 clone |
| 网络路径 | 用户本机 → `api.hiapi.ai` 直连 | Agent → `mcp.hiapi.ai`（托管 MCP）→ `api.hiapi.ai` |
| 适合 | 稳定、聚焦、单一模型的工作流——只生图，或只生视频 | 聊天 Agent 在一次会话里需要发现并调用多个 HiAPI 工具 |
| 模型范围 | 一个 skill 对应一个模型（`gpt-image-2`、`seedance-2-0`、`happyhorse-1-0`） | 暴露的所有 MCP 工具：`generate_image`、`generate_video`、`list_models` 等 |
| 更新方式 | 仓库有新版本时你自己 pull | 托管模式，能力服务端更新 |
| 客户端要求 | 任意能读取本地 skills 目录的 Agent | 客户端必须支持远程 MCP URL 和自定义 header（`Authorization: Bearer …`） |
| 图片上传 | skill 脚本支持本地文件路径 | URL 上传——本地文件上传正在扩展中 |
| 什么时候选它 | 模型和用途固定，要零配置漂移 | 事先不知道 Agent 会用哪个工具 |

如果两个都合适，先装单模型 skill——运动部件最少。等需要在聊天里覆盖更多工具时再加 Remote MCP。

## Skills、Remote MCP 与 /v1/tasks

| 路线 | 什么时候选 | 主要接口 |
| --- | --- | --- |
| Skills | 用户明确要用某个模型，或需要稳定的本地工作流。 | 本地 skill 脚本 + `HIAPI_API_KEY` |
| Remote MCP | 用户希望 Agent 在聊天里发现模型和工具。 | `https://mcp.hiapi.ai/mcp` |
| 直接 `/v1/tasks` | 正在构建产品代码、队列、自动化或服务端回调。 | `POST /v1/tasks`、`GET /v1/tasks/{taskId}`、`GET /v1/tasks` |

异步任务状态流转为 `queued` -> `handling` -> `archiving` -> `success` 或 `fail`。成功任务返回包含 `url`、`type`、`expireAt` 的 `output[]` 产物；失败任务返回 `error.code`，包括 `INVALID_REQUEST`、`MODEL_UNAVAILABLE`、`TASK_FAILED`、`TASK_TIMEOUT` 和 `STORAGE_UNAVAILABLE`。

---

## 安装一个 Skill

选择你需要的模型仓库即可。只有当你希望 Agent 同时具备三个能力时，才需要把三个 skill 都装上。

### 一行命令（推荐）

```bash
# GPT Image 2
npx -y github:HiAPIAI/hiapi-gpt-image-2-skill -y

# Seedance 2.0 Video
npx -y github:HiAPIAI/hiapi-seedance-2-0-video-skill -y

# HappyHorse 1.0 Video
npx -y github:HiAPIAI/hiapi-happyhorse-1-0-video-skill -y

# Video Prompt Generator（纯提示词，不需要 API Key）
npx -y github:HiAPIAI/hiapi-video-prompt-generator-skill -y
```

每个安装脚本会自动检测 Codex（`~/.codex/skills`）和 Claude Code（`~/.claude/skills`）。需要指定就传 `--codex`、`--claude`、`--target=/path`，或设置 `AGENT_SKILLS_DIR` 环境变量。要求 Node 18+ 和系统 `git`。

### OpenClaw

```bash
# GPT Image 2
openclaw skills add https://github.com/HiAPIAI/hiapi-gpt-image-2-skill

# Seedance 2.0 Video
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill

# HappyHorse 1.0 Video
openclaw skills add https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill

# Video Prompt Generator
openclaw skills add https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill
```

### Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"

rm -rf "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-gpt-image-2"
git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-gpt-image-2"

rm -rf "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video"
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video"

rm -rf "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-happyhorse-1-0-video"
git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-happyhorse-1-0-video"

rm -rf "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-video-prompt-generator"
git clone https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill.git "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-video-prompt-generator"
```

安装后重启 Codex。

### Claude Code

```bash
mkdir -p "$HOME/.claude/skills"

rm -rf "$HOME/.claude/skills/hiapi-gpt-image-2"
git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git "$HOME/.claude/skills/hiapi-gpt-image-2"

rm -rf "$HOME/.claude/skills/hiapi-seedance-2-0-video"
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git "$HOME/.claude/skills/hiapi-seedance-2-0-video"

rm -rf "$HOME/.claude/skills/hiapi-happyhorse-1-0-video"
git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git "$HOME/.claude/skills/hiapi-happyhorse-1-0-video"

rm -rf "$HOME/.claude/skills/hiapi-video-prompt-generator"
git clone https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill.git "$HOME/.claude/skills/hiapi-video-prompt-generator"
```

### 任意支持技能目录的 Agent

```bash
export AGENT_SKILLS_DIR="/path/to/your/agent/skills"
mkdir -p "$AGENT_SKILLS_DIR"

rm -rf "$AGENT_SKILLS_DIR/hiapi-gpt-image-2"
git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git "$AGENT_SKILLS_DIR/hiapi-gpt-image-2"

rm -rf "$AGENT_SKILLS_DIR/hiapi-seedance-2-0-video"
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git "$AGENT_SKILLS_DIR/hiapi-seedance-2-0-video"

rm -rf "$AGENT_SKILLS_DIR/hiapi-happyhorse-1-0-video"
git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git "$AGENT_SKILLS_DIR/hiapi-happyhorse-1-0-video"

rm -rf "$AGENT_SKILLS_DIR/hiapi-video-prompt-generator"
git clone https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill.git "$AGENT_SKILLS_DIR/hiapi-video-prompt-generator"
```

---

## 获取 API Key

1. 打开 [HiAPI API Keys](https://www.hiapi.ai/zh/dashboard/api-keys)。
2. 登录或注册 HiAPI 账号。
3. 创建或复制 API Key。
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

## Prompt Gallery 工作流

当用户需要灵感、风格参考或提示词起点时，先看 [awesome-gpt-image-2-prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts)。每个案例都有结果图、来源署名、画面比例和 HiAPI Draw 链接。用户选中案例后，再用对应 skill 或直接 API 请求，把人物、产品、文案、场景替换成自己的内容来生成。

---

## 机器可读索引

本仓库包含 [skills.json](skills.json)，里面记录了当前 HiAPI skill 仓库、模型页、安装命令和适用场景，方便 Agent 或脚本读取。

---

## 常见问题

| 问题 | 下一步 |
| --- | --- |
| 缺少 `HIAPI_API_KEY` | 到 [HiAPI API Keys](https://www.hiapi.ai/zh/dashboard/api-keys) 创建或复制 Key，然后设置 `HIAPI_API_KEY`。 |
| Key 无效或鉴权失败 | 检查 Key，或到 [HiAPI API Keys](https://www.hiapi.ai/zh/dashboard/api-keys) 重新创建。 |
| 余额、额度或支付状态不足 | 到 [HiAPI Dashboard](https://www.hiapi.ai/zh/dashboard) 检查账号状态，并查看 [价格页](https://www.hiapi.ai/zh/pricing)。 |
| 请求被限流 | 稍后重试，或减少并发生成请求。 |
| 不确定该用哪个模型 | 先看上面的选择表，或查看 [HiAPI Remote MCP 指南](https://docs.hiapi.ai/zh/for-ai/)，让 Agent 查看可用工具。 |

---

## 相关 HiAPI 仓库

- [HiAPI GPT Image 2 Skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill)
- [HiAPI Seedance 2.0 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill)
- [HiAPI HappyHorse 1.0 Video Skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill)
- [Awesome GPT Image 2 Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts)
- [Awesome Seedance 2.0 Prompts](https://github.com/HiAPIAI/awesome-seedance-2-0-prompts)

---

## 许可证

MIT

---

[HiAPI](https://www.hiapi.ai/zh) — 一个 API，所有 AI 模型。
