# HiAPI Hand-Painted Animation

Repository: https://github.com/HiAPIAI/hiapi-hand-painted-animation-skill

Skill name: `hiapi-hand-painted-animation`

Use this skill when the user wants a hand-painted animated short about anything: a story, an explainer, an animated
ad or opening, or a song with its lyrics acted on screen. Every film comes out in one look: watercolour brush, ink lines
that boil from frame to frame, paper grain, flat 2D, characters that act, motion on one beat.

## Pipeline

```text
idea
  -> brief and storyboard (shown to the user)
  -> optional: lyrics and a sung song through HiAPI, beat and lyric timing
  -> painted scenes, built and checked one at a time
  -> rendered MP4 with optional subtitles and an end card
```

## Install

```bash
npx -y github:HiAPIAI/hiapi-hand-painted-animation-skill -y
```

Use `--codex`, `--claude`, or `--target=/path/to/skills` when a specific destination is required.
Needs Node 18+, ffmpeg, uv, git and Google Chrome or Chromium.

The animation renders locally and needs no HiAPI key. Lyrics and songs are HiAPI calls:

- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
