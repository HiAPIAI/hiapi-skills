# HiAPI Seedance 2.0 Video Skill

Repository: https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill

API model: `seedance-2.0`

Skill directory: `hiapi-seedance-2-0-video`

Current release: `0.1.8`. Version `0.1.7` documented the canonical API model but still shipped an older runtime model and version; update before creating new tasks.

Use this skill when the user wants text-to-video generation or image-to-video animation through HiAPI.

The CLI defaults to a 120-minute polling window and accepts `--timeout-minutes <1-120>` for a shorter local wait. Timing out does not cancel the remote task.

## Best For

- Cinematic clips
- Image animation
- Product videos
- Social video concepts
- Visual storyboards

## Related Public Entries

- Skills directory: https://github.com/HiAPIAI/hiapi-skills
- Remote MCP: https://mcp.hiapi.ai/mcp
- API docs: https://docs.hiapi.ai
- GPT Image 2 prompt gallery for still-image starting points: https://github.com/HiAPIAI/awesome-gpt-image-2-prompts

## Install

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
```

Manual install:

```bash
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git
```

## Links

- English model page: https://www.hiapi.ai/en/models/seedance-2-0
- Chinese model page: https://www.hiapi.ai/zh/models/seedance-2-0
- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
