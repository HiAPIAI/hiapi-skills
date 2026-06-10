# HiAPI Skills Agent Install Guide

This file is for AI Agents. Use it when the user asks to install, choose, or use a HiAPI skill.

This repository is a directory, not a skill package itself. Choose one skill repository below, then install that repository into the user's agent runtime.

## Start Here

HiAPI has four public entry points:

| User intent | Entry | Link |
| --- | --- | --- |
| Browse tested image prompts and output examples | Prompt Galleries | https://github.com/HiAPIAI/awesome-gpt-image-2-prompts |
| Choose a focused model workflow | Agent Skills | https://github.com/HiAPIAI/hiapi-skills |
| Let a compatible client discover HiAPI tools | Remote MCP | https://mcp.hiapi.ai/mcp |
| Build a backend integration with async jobs, polling, signed callbacks, and task history | Async Tasks API | https://docs.hiapi.ai/api-reference/ |
| Copy direct API examples and model parameters | API Cookbook | https://docs.hiapi.ai |

HiAPI has three single-model generation skills plus one prompt-only director skill:

| User intent | Skill repository | Local directory |
| --- | --- | --- |
| Generate images | https://github.com/HiAPIAI/hiapi-gpt-image-2-skill | `hiapi-gpt-image-2` |
| Generate video or animate an image | https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill | `hiapi-seedance-2-0-video` |
| Generate a quick text-to-video clip | https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill | `hiapi-happyhorse-1-0-video` |
| Turn a one-line brief, link, or topic into a scene-by-scene video prompt (no API call) | https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill | `hiapi-video-prompt-generator` |

Use Remote MCP when the user wants broader model discovery or chat-access to more HiAPI tools:

```text
https://mcp.hiapi.ai/mcp
```

Use the direct `/v1/tasks` API when the user is building product code or a backend service. The core flow is:

```text
POST https://api.hiapi.ai/v1/tasks
GET  https://api.hiapi.ai/v1/tasks/{taskId}
GET  https://api.hiapi.ai/v1/tasks
```

Request shape: `{ "model": "...", "input": { ... }, "callback": { "url": "https://...", "when": "final" } }`.

Task statuses: `queued`, `handling`, `archiving`, `success`, `fail`. Callback verification uses `X-HiAPI-Timestamp` and `X-HiAPI-Signature = hex(HMAC-SHA256(secret, timestamp + "." + rawBody))`. Error codes include `INVALID_REQUEST`, `MODEL_UNAVAILABLE`, `TASK_FAILED`, `TASK_TIMEOUT`, and `STORAGE_UNAVAILABLE`.

## Authentication

All generation skills require:

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

If the user does not have a key:

- English: https://www.hiapi.ai/en/dashboard/api-keys
- Chinese: https://www.hiapi.ai/zh/dashboard/api-keys

Do not print or commit API keys.

## Install Into Codex

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

## Install Into Claude Code

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

## OpenClaw

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-gpt-image-2-skill
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
openclaw skills add https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill
openclaw skills add https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill
```

The Video Prompt Generator skill is prompt-only — it does **not** call any HiAPI endpoint and does **not** need `HIAPI_API_KEY`. Use it before the render skills to turn a brief into a directed, scene-by-scene prompt; then pass the prompt to `hiapi-seedance-2-0-video-skill` or `hiapi-happyhorse-1-0-video-skill` for actual generation.

## After Install

For each installed skill:

1. Read its `SKILL.md`.
2. Run `npm test` in the skill repo when available.
3. Run `node scripts/check-config.mjs` after the user sets `HIAPI_API_KEY`.
4. For live testing, use the cheapest valid option for the target model.

## Error Handling

Use these user-facing messages:

| Condition | Message |
| --- | --- |
| Missing key | Set `HIAPI_API_KEY` first. Create or copy one at https://www.hiapi.ai/en/dashboard/api-keys or https://www.hiapi.ai/zh/dashboard/api-keys. |
| Invalid key | HiAPI rejected the API key. Check it or create a new key in HiAPI API Keys. |
| Insufficient balance or quota | Your HiAPI balance or quota may be insufficient. Check https://www.hiapi.ai/en/dashboard or https://www.hiapi.ai/zh/dashboard. |
| Rate limit | The request was rate limited. Wait and retry, or reduce concurrent generations. |
| Unsupported parameter | Check the target skill README and `SKILL.md` for supported duration, size, aspect ratio, resolution, and input type. |
| Model mismatch | Use the single-model skill that matches the requested model, or use HiAPI Remote MCP for broader model access. |
| Async task storage failure | If `/v1/tasks` returns `STORAGE_UNAVAILABLE`, retry the task and contact HiAPI support if it persists. |

## Public Index

Read `skills.json` for a machine-readable list of HiAPI skills, repositories, model pages, install commands, and use cases.

## Prompt Gallery Workflow

If the user asks for prompt ideas, style references, image examples, or a starting point before generation, read:

```text
https://github.com/HiAPIAI/awesome-gpt-image-2-prompts
```

Use it as an API-ready creative recipe source: choose a case by output image and category, preserve source attribution when showing it, then adapt the prompt and aspect ratio for the user's own subject. When the user is ready to generate, use `hiapi-gpt-image-2-skill` or a direct `POST https://api.hiapi.ai/v1/tasks` request.
