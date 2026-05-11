# HiAPI Skills Agent Install Guide

This file is for AI Agents. Use it when the user asks to install, choose, or use a HiAPI skill.

## Start Here

HiAPI has three public single-model skills:

| User intent | Skill repository | Local directory |
| --- | --- | --- |
| Generate images | https://github.com/HiAPIAI/hiapi-gpt-image-2-skill | `hiapi-gpt-image-2` |
| Generate video or animate an image | https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill | `hiapi-seedance-2-0-video` |
| Generate a quick text-to-video clip | https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill | `hiapi-happyhorse-1-0-video` |

Use Remote MCP when the user wants broader model discovery or chat-access to more HiAPI tools:

```text
https://mcp.hiapi.ai/mcp
```

## Authentication

All generation skills require:

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

If the user does not have a key:

- English: https://www.hiapi.ai/en/register
- Chinese: https://www.hiapi.ai/zh/register

Do not print or commit API keys.

## Install Into Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"

git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git /tmp/hiapi-gpt-image-2-skill
cp -R /tmp/hiapi-gpt-image-2-skill "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-gpt-image-2"

git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git /tmp/hiapi-seedance-2-0-video-skill
cp -R /tmp/hiapi-seedance-2-0-video-skill "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video"

git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git /tmp/hiapi-happyhorse-1-0-video-skill
cp -R /tmp/hiapi-happyhorse-1-0-video-skill "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-happyhorse-1-0-video"
```

Restart Codex after copying skills.

## Install Into Claude Code

```bash
mkdir -p "$HOME/.claude/skills"

git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git /tmp/hiapi-gpt-image-2-skill
cp -R /tmp/hiapi-gpt-image-2-skill "$HOME/.claude/skills/hiapi-gpt-image-2"

git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git /tmp/hiapi-seedance-2-0-video-skill
cp -R /tmp/hiapi-seedance-2-0-video-skill "$HOME/.claude/skills/hiapi-seedance-2-0-video"

git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git /tmp/hiapi-happyhorse-1-0-video-skill
cp -R /tmp/hiapi-happyhorse-1-0-video-skill "$HOME/.claude/skills/hiapi-happyhorse-1-0-video"
```

## OpenClaw

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-gpt-image-2-skill
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
openclaw skills add https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill
```

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
| Missing key | Set `HIAPI_API_KEY` first. Create one at https://www.hiapi.ai/en/register or https://www.hiapi.ai/zh/register. |
| Invalid key | HiAPI rejected the API key. Check it or create a new key in HiAPI. |
| Insufficient balance or quota | Your HiAPI balance or quota may be insufficient. Check https://www.hiapi.ai/en/dashboard or https://www.hiapi.ai/zh/dashboard. |
| Rate limit | The request was rate limited. Wait and retry, or reduce concurrent generations. |
| Unsupported parameter | Check the target skill README and `SKILL.md` for supported duration, size, aspect ratio, resolution, and input type. |
| Model mismatch | Use the single-model skill that matches the requested model, or use HiAPI Remote MCP for broader model access. |

## Public Index

Read `skills.json` for a machine-readable list of HiAPI skills, repositories, model pages, install commands, and use cases.
