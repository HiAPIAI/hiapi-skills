# HiAPI Skills

Official HiAPI skill directory for AI Agents.

**HiAPI Skills • Install • API Key • [HiAPI](https://www.hiapi.ai/en)**

[Get API Key](https://www.hiapi.ai/en/dashboard/api-keys) · [Pricing](https://www.hiapi.ai/en/pricing) · [Docs](https://docs.hiapi.ai) · [GPT Image 2 Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) · [AI Video Prompts](https://github.com/HiAPIAI/awesome-ai-video-prompts) · [Remote MCP Guide](https://docs.hiapi.ai/for-ai/) · [简体中文](README.zh-CN.md)

> **HiAPI Matrix:** 🎨 [Image Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) · 🎬 [Video Prompts](https://github.com/HiAPIAI/awesome-ai-video-prompts) · 🛠️ **Agent Skills (you are here)** · 🤖 [Remote MCP](https://docs.hiapi.ai/for-ai/) · 📖 [API Docs](https://docs.hiapi.ai)

---

> AI Agent? Start with [llms-install.md](llms-install.md). It tells your agent which skill to install, how to set `HIAPI_API_KEY`, and what to do when a key, balance, quota, or model request fails.

---

## What Is This?

This is the official directory of HiAPI skills for OpenClaw, Claude Code, Codex, OpenCode, Cursor-style agent workflows, and other tools that can read local skills. It helps you choose the right HiAPI entry point before installing a specific skill.

HiAPI is an AI API platform built for developers: one API, all AI models. These skills package common image and video generation workflows so an AI Agent can call a focused model without guessing endpoints or parameters.

Use this repository when you want to choose a HiAPI skill. Install the individual skill repository when you are ready to generate images or videos.

---

## Public Entry Map

| Entry | Link | Use it when... |
| --- | --- | --- |
| Image Prompt Gallery | [awesome-gpt-image-2-prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) | You want output-backed GPT Image 2 recipes before generating images. |
| Video Prompt Gallery | [awesome-ai-video-prompts](https://github.com/HiAPIAI/awesome-ai-video-prompts) | You want rights-aware Seedance 2.0 and 2.5 recipe metadata before generating. |
| Agent Skills | [hiapi-skills](https://github.com/HiAPIAI/hiapi-skills) | You want to browse available HiAPI skills and choose one focused workflow. |
| Remote MCP | `https://mcp.hiapi.ai/mcp` | Your client supports remote MCP and can pass `Authorization: Bearer <HIAPI_API_KEY>`. |
| Async Tasks API | [docs.hiapi.ai/api-reference](https://docs.hiapi.ai/api-reference/) | You are building a backend service that needs `POST /v1/tasks`, polling, signed callbacks, and task history. |
| API Cookbook | [docs.hiapi.ai](https://docs.hiapi.ai) | You want direct API request shapes, model parameters, and integration guides. |

These entry points solve different jobs:

- **Prompt Galleries** — output-backed recipes for creators and developers who want a working starting point before calling an API.
- **Agent Skills** — installable single-model workflows for agents that need a stable model-specific tool, plus a prompt-only director that turns briefs into runnable video prompts.
- **Remote MCP** — a hosted MCP endpoint for clients that can pass a HiAPI API key in request headers.
- **Async Tasks API** — the durable `/v1/tasks` contract for product integrations, queues, polling, signed callbacks, and task history.
- **API Cookbook** — docs and examples for direct API integration.

---

## Available Skills

| Skill | Best For | Model | Repository |
| --- | --- | --- | --- |
| GPT Image 2 | Posters, illustrations, social graphics, product visuals, cover images | `gpt-image-2` | [hiapi-gpt-image-2-skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill) |
| Seedream 5.0 Pro | In-image text & signage, brush calligraphy posters, photoreal portraits, reference-based edits & composites | `seedream-5.0-pro` | [hiapi-seedream-5-0-pro-skill](https://github.com/HiAPIAI/hiapi-seedream-5-0-pro-skill) |
| Seedance 2.5 Video | Up to 30s text/image/reference video, native audio, paid-task recovery, QC | `seedance-2.5/*` | [hiapi-seedance-2-5-video-skill](https://github.com/HiAPIAI/hiapi-seedance-2-5-video-skill) |
| Seedance 2.0 Video | Text-to-video, image-to-video, cinematic clips, product videos, storyboards | `seedance-2.0` | [hiapi-seedance-2-0-video-skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill) |
| HappyHorse 1.0 Video | Lightweight text-to-video drafts, short social clips, ad concepts | `happyhorse-1-0` | [hiapi-happyhorse-1-0-video-skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill) |
| Video Prompt Generator | Direct briefs, links, and topics into scene-by-scene Seedance/HappyHorse prompts before generating | — (prompt-only) | [hiapi-video-prompt-generator-skill](https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill) |
| Realistic Video Prompting | Phone, DV, VHS, Super 8, GoPro, CCTV, documentary, anti-AI preflight, and model-agnostic handoff | — (prompt layer for any video model) | [realistic-video-prompting](https://github.com/HiAPIAI/realistic-video-prompting) |

---

## Choose an Entry

| I want to... | Open |
| --- | --- |
| Find a tested image prompt and output example | [Awesome GPT Image 2 Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) |
| Find a video prompt and source-backed example | [Awesome AI Video Prompts](https://github.com/HiAPIAI/awesome-ai-video-prompts) |
| Generate images from text | [GPT Image 2 Skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill) |
| Produce up to 30s Seedance 2.5 video from text, frames, or multimodal references | [Seedance 2.5 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-5-video-skill) |
| Generate or animate videos with a stronger video workflow | [Seedance 2.0 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill) |
| Quickly generate short text-to-video clips | [HappyHorse 1.0 Video Skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill) |
| Turn a one-line brief or link into a scene-by-scene video prompt before generating | [Video Prompt Generator Skill](https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill) |
| Make a phone/DV/VHS/documentary prompt less AI-looking, then route it to any selected video model | [Realistic Video Prompting](https://github.com/HiAPIAI/realistic-video-prompting) |
| Install the realistic prompt and Seedance skills together | [HiAPI Realistic Video Workflow](https://github.com/HiAPIAI/hiapi-realistic-video-workflow) |
| Let an agent access more HiAPI models from chat | [HiAPI Remote MCP Guide](https://docs.hiapi.ai/for-ai/) |
| Build a server-side integration with webhooks and task history | [Async Tasks API](https://docs.hiapi.ai/api-reference/) |

Skills are best when you want a stable, focused workflow. Remote MCP is better when you want a chat agent to discover and call multiple HiAPI tools. The MCP endpoint is `https://mcp.hiapi.ai/mcp`.

For application code, use the direct `/v1/tasks` API: submit with `POST https://api.hiapi.ai/v1/tasks`, poll `GET https://api.hiapi.ai/v1/tasks/{taskId}`, or register `callback.url` to receive terminal-state webhooks signed by `X-HiAPI-Timestamp` and `X-HiAPI-Signature`.

---

## MCP vs Skill

Both routes use the same HiAPI account and the same `HIAPI_API_KEY`. Pick by how your agent runs and how stable you want the workflow.

| Dimension | Single-Model Skill | Remote MCP |
| --- | --- | --- |
| What it is | A local skill folder loaded by your agent (Codex, Claude Code, OpenClaw, …) | A hosted MCP endpoint at `https://mcp.hiapi.ai/mcp` |
| Install path | `git clone` or `openclaw skills add` into the agent's skills directory | Add one JSON block to the agent's MCP config — no clone required |
| Network | Direct HTTPS to `api.hiapi.ai` from the user's machine | Agent → `mcp.hiapi.ai` (hosted MCP) → `api.hiapi.ai` |
| Best for | Stable, focused, single-model workflows — image-only or video-only | Chat agents that need to discover and call multiple HiAPI tools in one session |
| Model surface | One model family per generation skill (`gpt-image-2`, `seedance-2.5/*`, `seedance-2.0`, `happyhorse-1-0`), plus prompt-only skills | All MCP-exposed tools: `generate_image`, `generate_video`, `list_models`, … |
| Updates | You pull from the repo when there's a new version | Hosted — capabilities update server-side |
| Required client support | Any agent that can read a local skills folder | Client must support remote MCP URLs and custom headers (`Authorization: Bearer …`) |
| Image upload | Local file paths supported by the skill scripts | Upload via URL — local-file upload is being expanded |
| Use it when | The model and use case are fixed and you want zero configuration drift | You don't know in advance which tool the agent will need |

If both fit, install a single-model skill first — it has the smallest moving parts. Add Remote MCP later when you need a wider tool surface in chat.

## Skills vs Remote MCP vs /v1/tasks

| Route | Choose it when | Primary interface |
| --- | --- | --- |
| Skills | The user asked for one known model or a repeatable local workflow. | Local skill scripts plus `HIAPI_API_KEY` |
| Remote MCP | The user wants an agent to discover models and tools in chat. | `https://mcp.hiapi.ai/mcp` |
| Direct `/v1/tasks` | You are building product code, queues, automations, or server-side callbacks. | `POST /v1/tasks`, `GET /v1/tasks/{taskId}`, `GET /v1/tasks` |

The async task lifecycle is `queued` -> `handling` -> `archiving` -> `success` or `fail`. Successful tasks return `output[]` assets with `url`, `type`, and `expireAt`. Failed tasks return `error.code`, including `INVALID_REQUEST`, `MODEL_UNAVAILABLE`, `TASK_FAILED`, `TASK_TIMEOUT`, and `STORAGE_UNAVAILABLE`.

---

## Install One Skill

Pick the repository for the workflow you need. Prompt-only skills do not require an API key.

### One Command (Recommended)

```bash
# GPT Image 2
npx -y github:HiAPIAI/hiapi-gpt-image-2-skill -y

# Seedance 2.5 Video
npx -y github:HiAPIAI/hiapi-seedance-2-5-video-skill -y

# Seedance 2.0 Video
npx -y github:HiAPIAI/hiapi-seedance-2-0-video-skill -y

# HappyHorse 1.0 Video
npx -y github:HiAPIAI/hiapi-happyhorse-1-0-video-skill -y

# Video Prompt Generator (prompt-only, no API key needed)
npx -y github:HiAPIAI/hiapi-video-prompt-generator-skill -y

# Realistic Video Prompting (prompt-only by default)
npx -y github:HiAPIAI/realistic-video-prompting -y

# Optional Seedance shortcut: installs Realistic Video Prompting + Seedance 2.0
npx -y github:HiAPIAI/hiapi-realistic-video-workflow -y
```

Each installer auto-detects Codex (`~/.codex/skills`) and Claude Code (`~/.claude/skills`). Pass `--codex`, `--claude`, `--target=/path`, or set `AGENT_SKILLS_DIR` to override. Requires Node 18+ and `git` on PATH.

### OpenClaw

```bash
# GPT Image 2
openclaw skills add https://github.com/HiAPIAI/hiapi-gpt-image-2-skill

# Seedance 2.5 Video
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-5-video-skill

# Seedance 2.0 Video
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill

# HappyHorse 1.0 Video
openclaw skills add https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill

# Video Prompt Generator
openclaw skills add https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill

# Realistic Video Prompting
openclaw skills add https://github.com/HiAPIAI/realistic-video-prompting
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

Restart Codex after installing skills.

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

### Any Agent With A Skills Folder

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

## Get API Key

1. Open [HiAPI API Keys](https://www.hiapi.ai/en/dashboard/api-keys).
2. Create or sign in to your HiAPI account.
3. Create or copy an API key.
4. Set it in the terminal where your agent runs:

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

Each skill includes a `scripts/check-config.mjs` helper so your agent can verify the key and network path before generation.

---

## Agent Prompt

Copy this to your AI Agent:

```text
Use HiAPI skills for image and video generation.

If I ask for an image, install or use:
https://github.com/HiAPIAI/hiapi-gpt-image-2-skill

If I ask for a stronger video workflow or image-to-video, install or use:
https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill

If I ask for a quick text-to-video clip, install or use:
https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill

Use HIAPI_API_KEY for authentication. If the key is missing, invalid, rate-limited, or the account has insufficient balance, show the user the next step and link to HiAPI.
```

## Prompt Gallery Workflow

Use [awesome-gpt-image-2-prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts) when the user needs inspiration, style references, or a prompt starting point. Each case includes a result image, source attribution, aspect ratio, and a HiAPI Draw link. After the user chooses a case, use the relevant skill or direct API request to generate a new result with their own subject, product, text, or scene.

---

## Machine-Readable Index

This repository includes [skills.json](skills.json), a machine-readable index of the current HiAPI skill repositories, model pages, install commands, and intended use cases.

---

## Troubleshooting

| Problem | Next Step |
| --- | --- |
| Missing `HIAPI_API_KEY` | Create or copy a key at [HiAPI API Keys](https://www.hiapi.ai/en/dashboard/api-keys), then export `HIAPI_API_KEY`. |
| Invalid key or unauthorized request | Check the key or create a new one at [HiAPI API Keys](https://www.hiapi.ai/en/dashboard/api-keys). |
| Insufficient balance, quota, or payment status | Check your account in the [HiAPI Dashboard](https://www.hiapi.ai/en/dashboard) and review [Pricing](https://www.hiapi.ai/en/pricing). |
| Rate limited | Wait and retry, or reduce concurrent generations. |
| Unsure which model to use | Start with the table above, or follow the [HiAPI Remote MCP Guide](https://docs.hiapi.ai/for-ai/) so your agent can inspect available tools. |

---

## Related HiAPI Repositories

- [HiAPI GPT Image 2 Skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill)
- [HiAPI Seedance 2.0 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill)
- [HiAPI HappyHorse 1.0 Video Skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill)
- [Awesome GPT Image 2 Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts)
- [Awesome AI Video Prompts](https://github.com/HiAPIAI/awesome-ai-video-prompts)

---

## License

MIT

---

[HiAPI](https://www.hiapi.ai/en) — One API, all AI models.
