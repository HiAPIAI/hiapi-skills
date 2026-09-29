# HiAPI GPT Image 2 Skill

Repository: https://github.com/HiAPIAI/hiapi-gpt-image-2-skill

Models: `gpt-image-2/text-to-image`, `gpt-image-2/image-to-image`

Current version: 0.5.0 (hard upgrade; older versions stop creating new tasks until updated).

Use this skill when the user wants GPT Image 2 text-to-image or image-to-image generation through HiAPI.

## Capabilities

- Default route: 16 aspect ratios at 1K/2K/4K with documented 2K/4K gaps, optional `background` at 1K, 1-16 image-to-image references.
- `--route beta`: text-to-image with an exact `--size` such as `1536x1024`.
- `--route ext`: every aspect ratio at 1K/2K/4K with `--quality low|medium|high`; image-to-image takes 1-6 references.
- Paid-task safety: `--dry-run` / `--estimate` create no task, every create sends an `Idempotency-Key`, and `--resume-task-id` recovers an existing task without creating a new one.

## Best For

- Posters
- Illustrations
- Social media graphics
- Product visuals
- Cover images

## Related Public Entries

- Prompt gallery: https://github.com/HiAPIAI/awesome-gpt-image-2-prompts
- Skills directory: https://github.com/HiAPIAI/hiapi-skills
- Remote MCP: https://mcp.hiapi.ai/mcp
- API docs: https://docs.hiapi.ai

## Install

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-gpt-image-2-skill
```

Manual install:

```bash
git clone https://github.com/HiAPIAI/hiapi-gpt-image-2-skill.git
```

## Links

- English model page: https://www.hiapi.ai/en/models/gpt-image-2
- Chinese model page: https://www.hiapi.ai/zh/models/gpt-image-2
- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
