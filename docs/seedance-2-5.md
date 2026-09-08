# HiAPI Seedance 2.5 Video Skill

Repository: https://github.com/HiAPIAI/hiapi-seedance-2-5-video-skill

API models:

- `seedance-2.5/text-to-video`
- `seedance-2.5/image-to-video`
- `seedance-2.5/reference-to-video`

Skill directory: `hiapi-seedance-2-5-video`

Current release: `1.2.0`.

Use this skill for Seedance 2.5 video planning and production through HiAPI, including cost-aware dry runs, text/image/reference mode selection, paid-task idempotency, interrupted-task recovery, download, and quality control.

## Current Contract

- 4-30 second output; reference mode also accepts -1 for automatic output.
- Text/image: 720p or 1080p; default 720p.
- Reference: 480p, 720p, or 1080p; default 480p.
- MP4 or MOV.
- Up to 30 reference images.
- Up to 10 reference videos and 10 audio clips; each media type totals at most 30 seconds.

## Upgrade Policy

- New paid tasks require the latest verified release. The minimum supported version is 1.2.0.
- Automatic R2V estimates are ranges and include reference-video plus output-video duration.
- Existing task recovery remains available during a hard upgrade.
- The runtime checks this directory and falls back to the skill repository's `update-policy.json`.
- Versions older than 1.2.0 are blocked during normal online checks because they reject -1 and underestimate reference-video charges. New 1.2.0 creation also stops if version checks are unavailable or disabled; preflight and recovery remain usable. This does not revoke old copies that bypass checks or restrict direct API calls.

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
