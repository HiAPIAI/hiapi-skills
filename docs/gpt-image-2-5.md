# HiAPI GPT Image 2.5 Skill

技能状态：`release`。仓库为 https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill，已提供公开安装；下方 API schema 与公开价格页已核实。

本条目对应 6 个可调用模型 ID，分两条路线（技能版本 0.2.0）：

- **模式路线（默认）**：`gpt-image-2.5-flare/text-to-image`、`gpt-image-2.5-flare/image-to-image`、`gpt-image-2.5-sunburst/text-to-image`、`gpt-image-2.5-sunburst/image-to-image`。不指定 `--model` 时，CLI 按是否传参考图自动选文生图或图生图；`--family` 默认 `flare`。按 `resolution`（1K/2K/4K）计价。
- **质量档（需明确指定）**：`gpt-image-2.5-flare`、`gpt-image-2.5-sunburst`，按 `quality` 计价。

一次任务生成一张图片。

## 安装

```bash
npx skills add HiAPIAI/hiapi-gpt-image-2-5-skill --skill hiapi-gpt-image-2-5
```

## 线上 API 契约

```text
POST https://api.hiapi.ai/v1/tasks
```

请求顶层使用目标模型 ID 和 `input` 对象。默认模式路线示例：

```json
{
  "model": "gpt-image-2.5-flare/text-to-image",
  "input": {
    "prompt": "A quiet alpine lake at sunrise",
    "aspect_ratio": "auto",
    "resolution": "1K"
  }
}
```

模式路线 `input` 支持：

- `prompt`：必填，1–20,000 字符。
- `image_urls`：图生图必填、文生图禁止；1–16 张 JPEG/PNG/WebP，公开可直接下载的 HTTP(S) URL 或 data URI。
- `aspect_ratio`：`auto`（默认）、`1:1`、`3:2`、`2:3`、`4:3`、`3:4`、`16:9`、`9:16`、`21:9`、`27:16`、`16:27`、`9:8`、`8:9`。
- `resolution`：`1K`（默认）、`2K`、`4K`。
- `background`：可选 `transparent`、`opaque`、`auto`，仅 `resolution=1K` 时允许；透明返回带 alpha 的 PNG。

质量档路线把顶层 `model` 写成 `gpt-image-2.5-flare` 或 `gpt-image-2.5-sunburst`，`input` 支持 `prompt`（≤ 32,000 字符）、可选 `image_urls`（1–16）、`aspect_ratio`（比例或像素尺寸）、`quality`（`low`、`medium`、`high`、`xhigh`、`max`、`auto`）、`background` 与 `output_format`（`png`、`jpeg`、`webp`）。

任务创建前执行本地参数校验；一次调用只创建一个任务。不要为重试重复创建不确定的付费任务，应先恢复或查询已有任务。成功结果为 `type=image` 的 URL；可通过 `GET /v1/tasks/{taskId}` 查询 `queued`、`handling`、`archiving`、`success`、`fail` 状态。

完整的 skill 级 API 与输出说明见仓库中的 [`references/api.md`](https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill/blob/main/references/api.md)、[`references/output.md`](https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill/blob/main/references/output.md)；升级规则见 [`references/upgrade-policy.md`](https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill/blob/main/references/upgrade-policy.md)。

## 鉴权与链接

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

- API Key（English）：https://www.hiapi.ai/en/dashboard/api-keys
- API Key（中文）：https://www.hiapi.ai/zh/dashboard/api-keys
- Pricing（公开价格页）：https://www.hiapi.ai/en/pricing
- API docs：https://docs.hiapi.ai
- Prompt gallery：https://github.com/HiAPIAI/awesome-gpt-image-2-prompts

当前文档记录已发布目录与已核实的线上请求形态；价格与生产可用性仍需按各自证据单独验收。
