# HiAPI Animation Forge

Repository: https://github.com/HiAPIAI/hiapi-2d-to-3d-video-skill

Skill name: `hiapi-2d-to-3d-video`

Use this skill for asset-first 2D-to-3D planning, source-locked reconstruction, Blender-ready scene preparation, and gated generative rendering. It deliberately does not treat a successful video-model output as frame-exact 3D reconstruction.

## Pipeline

```text
authorized 2D source
  -> source and asset analysis
  -> multiview / geometry candidates
  -> rig, materials, motion, and camera solve
  -> deterministic Blender preview
  -> optional generative render
  -> source-lock QC
```

## Install

```bash
npx -y github:HiAPIAI/hiapi-2d-to-3d-video-skill -y
```

Use `--codex`, `--claude`, or `--target=/path/to/skills` when a specific destination is required.

Planning and Blender preview do not require a HiAPI key. If the user authorizes a HiAPI render:

- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
