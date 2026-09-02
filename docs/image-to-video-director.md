# Image-to-Video Director

Repository: https://github.com/HiAPIAI/hiapi-image-to-video-camera-motion-skill

Skill name: `image-to-video-director`

Use this model-agnostic skill to inspect an approved still, choose feasible camera movement, compile model-ready image-to-video prompts, and review motion failures. It does not claim that every image can support a large orbit or unseen-surface reconstruction.

## Best For

- Product and architecture image animation
- Portrait and environment motion planning
- Push-ins, arcs, tracking shots, pans, tilts, and macro glides
- Preserving subject identity and product geometry

## Install

Codex:

```bash
git clone https://github.com/HiAPIAI/hiapi-image-to-video-camera-motion-skill.git "${CODEX_HOME:-$HOME/.codex}/skills/image-to-video-director"
```

Claude Code:

```bash
git clone https://github.com/HiAPIAI/hiapi-image-to-video-camera-motion-skill.git "$HOME/.claude/skills/image-to-video-director"
```

The planning mode does not need a HiAPI key. If the user authorizes generation through HiAPI, create or copy a key here:

- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
