# HiAPI Game Asset Studio

Repository: https://github.com/HiAPIAI/hiapi-game-asset-studio-skill

Skill name: `hiapi-game-assets`

Use this skill when the user wants assets for a game: characters and poses, enemies, items, tilesets, UI icons,
parallax backgrounds, a title logo, music loops, voice lines and a trailer, all in one art style, and a small playable
prototype that proves they work together.

## Pipeline

```text
game idea
  -> plan.json (anchor key art first; every other image references it)
  -> GPT Image 2.5 images (transparent sprites), background removal
  -> MiniMax Music loops, Qwen Audio voice lines, Seedance trailer
  -> sheets sliced into game-ready PNGs, review gallery
  -> playable HTML prototype
```

## Install

```bash
npx -y github:HiAPIAI/hiapi-game-asset-studio-skill -y
```

Use `--codex`, `--claude`, or `--target=/path/to/skills` when a specific destination is required.

- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
