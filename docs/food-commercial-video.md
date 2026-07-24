# HiAPI Food Commercial Video Skill

Repository: https://github.com/HiAPIAI/hiapi-food-commercial-video-skill

Skill directory: `hiapi-food-commercial-video`

Current release: `0.1.0`

Use this skill for short, single-shot coffee, beverage, food, packaged-product, restaurant, and ecommerce commercials through HiAPI.

## Fixed Model Routes

- Text only: `kling-3.0-omni/text-to-video`, integer duration 3-15 seconds.
- One hero image: `kling-3.0-omni/image-to-video`, integer duration 3-15 seconds.
- 1-9 reference images: `seedance-2.0-fast`, integer duration 4-15 seconds.

The skill keeps one primary action, one camera movement, plausible food physics, truthful package appearance, and a continuous shot.

## Spend Protection

The required order is offline `--preview`, configuration `--check`, live-price `--dry-run`, then explicit approval of the estimate, budget, and request hash before `--spend`.

The default client estimate limit is `$0.50`. It is not a server-enforced final charge cap.

## Best For

- Coffee pours and cafe drinks
- Beverage splashes and chilled product shots
- Food macro texture and doneness shots
- Packaged-product hero videos
- Restaurant atmosphere spots
- Ecommerce food promos

## Install

```bash
npx -y github:HiAPIAI/hiapi-food-commercial-video-skill -y
```

OpenClaw:

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-food-commercial-video-skill
```

## Links

- Kling 3.0 Omni model page (English): https://www.hiapi.ai/en/models/kling-3-0-omni
- Kling 3.0 Omni model page (Chinese): https://www.hiapi.ai/zh/models/kling-3-0-omni
- Seedance 2.0 Fast model page (English): https://www.hiapi.ai/en/models/seedance-2-0-fast
- Seedance 2.0 Fast model page (Chinese): https://www.hiapi.ai/zh/models/seedance-2-0-fast
- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys
- Pricing (English): https://www.hiapi.ai/en/pricing
- Pricing (Chinese): https://www.hiapi.ai/zh/pricing
- API docs: https://docs.hiapi.ai
