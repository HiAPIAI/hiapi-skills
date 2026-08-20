# Model-Agnostic Realistic Video Prompting

## Choose the route

| Request | Route |
| --- | --- |
| Ordinary video generation | Use the selected model Skill/API directly |
| Phone, DV, VHS, Super 8, GoPro, CCTV, documentary, found-footage, or anti-AI prompt only | `realistic-video-prompting` in `prompt-only` mode |
| Realistic generation with Veo, Kling, Runway, Sora, or another model | `realistic-video-prompting` preflight, generic handoff package, then the matching model executor |
| Realistic Seedance 2.0 generation | `realistic-video-prompting` preflight, then the explicit `hiapi-seedance-2-0-video` adapter |

The realistic prompt Skill is independently installable and does not depend on Seedance:

```bash
npx -y github:HiAPIAI/realistic-video-prompting -y
```

The former one-command bundle repository is archived. Install the two independent skills directly:

```bash
npx -y github:HiAPIAI/realistic-video-prompting -y
npx -y github:HiAPIAI/hiapi-seedance-2-0-video-skill -y
```

This is the replacement for the archived [`hiapi-realistic-video-workflow`](https://github.com/HiAPIAI/hiapi-realistic-video-workflow) installer. The old command remains available for existing automation, but it receives no further feature updates:

```bash
npx -y github:HiAPIAI/hiapi-realistic-video-workflow -y
```

## Safety contract

- `prompt-only` never calls a paid API.
- `review-and-render` waits for explicit generation approval.
- `direct-render` is used only when the current user request already authorizes generation.
- Render modes require an explicit executor; the workflow never infers Seedance.
- `external` returns a handoff package and does not create a task.
- Target-specific duration, ratio, media, audio, and output fields are validated by the matching executor's current schema.
- `4k` and persistent storage require cost awareness and are never silently selected.
- The Seedance adapter imports the installed Seedance payload validator rather than maintaining a second API client.

## Authentication

Prompt-only and generic handoff modes need no API key. The chosen generation executor owns its authentication. HiAPI Seedance rendering requires `HIAPI_API_KEY` in the agent environment.

- English API keys: https://www.hiapi.ai/en/dashboard/api-keys
- 中文 API Key：https://www.hiapi.ai/zh/dashboard/api-keys

Do not store keys in the skill repository or installer.

## Naming

- Display name: `Seedance 2.0`
- HiAPI API model id: `seedance-2.0`
- Agent Skill directory: `hiapi-seedance-2-0-video`
- Repository slug: `hiapi-seedance-2-0-video-skill`

The dots and hyphens belong to different layers and should not be globally replaced.
