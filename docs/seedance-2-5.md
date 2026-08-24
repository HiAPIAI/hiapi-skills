# HiAPI Seedance 2.5 Video Skill

Repository: https://github.com/HiAPIAI/hiapi-seedance-2-5-video-skill

API models:

- `seedance-2.5/text-to-video`
- `seedance-2.5/image-to-video`
- `seedance-2.5/reference-to-video`

Skill directory: `hiapi-seedance-2-5-video`

Current release: `1.1.0`.

Use this skill for Seedance 2.5 video planning and production through HiAPI, including cost-aware dry runs, text/image/reference mode selection, paid-task idempotency, interrupted-task recovery, download, and quality control.

## Current Contract

- 4-30 second output.
- Text/image: 720p or 1080p; default 720p.
- Reference: 480p, 720p, or 1080p; default 480p.
- MP4 or MOV.
- Up to 30 reference images.
- Up to 10 reference videos and 10 audio clips; each media type totals at most 30 seconds.

## Upgrade Policy

- Soft upgrades notify and continue.
- Hard upgrades block only incompatible or unsafe new paid tasks.
- Existing task recovery remains available during a hard upgrade.
- The runtime checks this directory and falls back to the skill repository's `update-policy.json`.
- Versions older than 1.1.0 are hard-blocked for new paid tasks because their resolution validation no longer matches the live contract.

## Install

```bash
npx -y github:HiAPIAI/hiapi-seedance-2-5-video-skill -y
```

## Links

- English model docs: https://docs.hiapi.ai/models/video/seedance-2-5/
- Chinese model docs: https://docs.hiapi.ai/zh/models/video/seedance-2-5/
- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
- Prompt gallery: https://github.com/HiAPIAI/awesome-seedance-2-5-prompts
