# HiAPI Brand Kit

Repository: https://github.com/HiAPIAI/hiapi-brand-kit-skill

Skill name: `hiapi-brand-kit`

Use this skill when the user wants a brand identity: a logo, colours, type, voice, mockups of the logo in the real
world (storefront, packaging, merch, social) and a one-page brand guidelines site. The agent draws the logo as SVG;
GPT Image 2.5 on HiAPI only places that exact logo into mockups, so the mark and spelling never drift.

## Pipeline

```text
business idea
  -> brief and brand.json (story, audience, personality, colours, fonts, voice)
  -> SVG logo system (mark, primary, stacked), rendered to PNG
  -> mockups through HiAPI, each made from the rendered logo
  -> brand-book.html
```

## Install

```bash
npx -y github:HiAPIAI/hiapi-brand-kit-skill -y
```

Use `--codex`, `--claude`, or `--target=/path/to/skills` when a specific destination is required.

- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
