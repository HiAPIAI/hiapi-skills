# HiAPI Video Prompt Generator Skill

Repository: https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill

Type: prompt-only (no model API call)

Use this skill when the user has a one-line brief, a product link, a GitHub repo, or a research topic, and needs a directed, scene-by-scene video prompt before generating. The output is built to paste directly into `hiapi-seedance-2-0-video-skill` or `hiapi-happyhorse-1-0-video-skill`.

## Best For

- Directing one-line briefs into runnable video prompts
- Turning links or research topics into scene-by-scene plans
- Producing prompts that Seedance 2.0 or HappyHorse 1.0 can render directly
- Preparing strong prompts before generation

## Related Public Entries

- Skills directory: https://github.com/HiAPIAI/hiapi-skills
- Remote MCP: https://mcp.hiapi.ai/mcp
- API docs: https://docs.hiapi.ai
- Seedance 2.0 video skill (renderer): https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
- HappyHorse 1.0 video skill (renderer): https://github.com/HiAPIAI/hiapi-happyhorse-1-0-video-skill

## Install

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill
```

Manual install:

```bash
git clone https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill.git
```

## Links

- Repository: https://github.com/HiAPIAI/hiapi-video-prompt-generator-skill
- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys

Note: The director itself does not call any HiAPI endpoint. The `HIAPI_API_KEY` is only required by the downstream render skill that will run the generated prompt.
