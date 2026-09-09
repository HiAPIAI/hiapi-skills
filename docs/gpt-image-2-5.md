# HiAPI GPT Image 2.5 Skill

技能状态：`release`。仓库为 https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill，已提供公开安装；下方 API schema 与公开价格页已核实。

本条目对应两个可调用模型 ID：`gpt-image-2.5-flare` 与 `gpt-image-2.5-sunburst`。一次任务生成一张图片。

## 安装

```bash
npx skills add HiAPIAI/hiapi-gpt-image-2-5-skill --skill hiapi-gpt-image-2-5
```

## 线上 API 契约

```text
POST https://api.hiapi.ai/v1/tasks
```

请求顶层使用目标模型 ID 和 `input` 对象：

```json
{
  "model": "gpt-image-2.5-flare",
  "input": {
    "prompt": "A quiet alpine lake at sunrise",
    "aspect_ratio": "1:1",
    "quality": "medium",
    "background": "auto",
    "output_format": "webp"
  }
}
```

使用 `gpt-image-2.5-sunburst` 时只替换顶层 `model` 值。`input` 支持：

- `image_urls`：可选，1–16 个输入图片 URL；不传时为文生图。
- `quality`：`low`、`medium`、`high`、`xhigh`、`max` 或 `auto`。
- `output_format`：`png`、`jpeg` 或 `webp`。

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
