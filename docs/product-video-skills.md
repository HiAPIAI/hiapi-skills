# HiAPI Product Video Skills

Repository: https://github.com/HiAPIAI/hiapi-product-video-skills

Status: `release-candidate`

This repository is an adapter collection, not one root-level Skill. Choose one product-video adapter instead of presenting the collection as a single model workflow.

## Available Adapters

| Adapter | Use it for |
| --- | --- |
| `ugc-ad` | Source-grounded UGC ads with claims and talent-consent checks |
| `fashion-lookbook` | Lookbooks, outfit transitions, and fashion showcase videos |
| `food-commercial` | Food macro shots, beverage visuals, and product-hero commercials |
| `product-spokesperson` | Authorized spokesperson, talking-head, and dialogue videos |

## Install One Adapter

```bash
npx -y github:HiAPIAI/hiapi-product-video-skills -y --adapter <adapter>
```

The collection remains labeled `release-candidate` until its own public release gate passes.

- API key (English): https://www.hiapi.ai/en/dashboard/api-keys
- API key (Chinese): https://www.hiapi.ai/zh/dashboard/api-keys

