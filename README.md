# HiAPI Skills

Official AI Agent skills for HiAPI.

**HiAPI Skills • Install • API Key • [HiAPI](https://www.hiapi.ai/en)**

[Get API Key](https://www.hiapi.ai/en/register) · [Pricing](https://www.hiapi.ai/en/pricing) · [Docs](https://docs.hiapi.ai) · [Remote MCP Guide](https://docs.hiapi.ai/for-ai/) · [简体中文](README.zh-CN.md)

---

> AI Agent? Start with [llms-install.md](llms-install.md). It tells your agent which skill to install, how to set `HIAPI_API_KEY`, and what to do when a key, balance, quota, or model request fails.

---

## What Is This?

This is the official directory of HiAPI skills for OpenClaw, Claude Code, Codex, OpenCode, Cursor-style agent workflows, and other tools that can read local skills.

HiAPI is an AI API platform built for developers: one API, all AI models. These skills package common image and video generation workflows so an AI Agent can call a focused model without guessing endpoints or parameters.

Use this repository when you want to choose a HiAPI skill. Install the individual skill repository when you are ready to generate images or videos.

---

## Available Skills

| Skill | Best For | Model | Repository |
| --- | --- | --- | --- |
| GPT Image 2 | Posters, illustrations, social graphics, product visuals, cover images | `gpt-image-2` | [hiapi-gpt-image-2-skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill) |
| Seedance 2.0 Video | Text-to-video, image-to-video, cinematic clips, product videos, storyboards | `seedance-2-0` | [hiapi-seedance-2-0-video-skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill) |
| HappyHorse 1.0 Video | Lightweight text-to-video drafts, short social clips, ad concepts | `happyhorse-1-0` | [hiapi-happyhorse-1-0-video-skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill) |

---

## Which One Should I Install?

| I want to... | Install |
| --- | --- |
| Generate images from text | [GPT Image 2 Skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill) |
| Generate or animate videos with a stronger video workflow | [Seedance 2.0 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill) |
| Quickly generate short text-to-video clips | [HappyHorse 1.0 Video Skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill) |
| Let an agent access more HiAPI models from chat | [HiAPI Remote MCP Guide](https://docs.hiapi.ai/for-ai/) |

Skills are best when you want a stable, focused workflow. Remote MCP is better when you want a chat agent to discover and call multiple HiAPI tools. The MCP endpoint is `https://mcp.hiapi.ai/mcp`.

---

## Quick Install

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

Restart Codex after copying skills.

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

### Any Agent With A Skills Folder

```bash
export AGENT_SKILLS_DIR="/path/to/your/agent/skills"
mkdir -p "$AGENT_SKILLS_DIR"

git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git "$AGENT_SKILLS_DIR/hiapi-gpt-image-2"
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git "$AGENT_SKILLS_DIR/hiapi-seedance-2-0-video"
git clone https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill.git "$AGENT_SKILLS_DIR/hiapi-happyhorse-1-0-video"
```

---

## Get API Key

1. Open [HiAPI Register](https://www.hiapi.ai/en/register).
2. Create or sign in to your HiAPI account.
3. Create an API key.
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

---

## Machine-Readable Index

This repository includes [skills.json](skills.json), a machine-readable index of the current HiAPI skill repositories, model pages, install commands, and intended use cases.

---

## Troubleshooting

| Problem | Next Step |
| --- | --- |
| Missing `HIAPI_API_KEY` | Create or copy a key at [HiAPI Register](https://www.hiapi.ai/en/register), then export `HIAPI_API_KEY`. |
| Invalid key or unauthorized request | Check the key or create a new one at [HiAPI Register](https://www.hiapi.ai/en/register). |
| Insufficient balance, quota, or payment status | Check your account in the [HiAPI Dashboard](https://www.hiapi.ai/en/dashboard) and review [Pricing](https://www.hiapi.ai/en/pricing). |
| Rate limited | Wait and retry, or reduce concurrent generations. |
| Unsure which model to use | Start with the table above, or follow the [HiAPI Remote MCP Guide](https://docs.hiapi.ai/for-ai/) so your agent can inspect available tools. |

---

## Related HiAPI Repositories

- [HiAPI GPT Image 2 Skill](https://github.com/HiAPIAI/hiapi-gpt-image-2-skill)
- [HiAPI Seedance 2.0 Video Skill](https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill)
- [HiAPI HappyHorse 1.0 Video Skill](https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill)
- [Awesome GPT Image 2 Prompts](https://github.com/HiAPIAI/awesome-gpt-image-2-prompts)

---

## License

MIT

---

[HiAPI](https://www.hiapi.ai/en) — One API, all AI models.
