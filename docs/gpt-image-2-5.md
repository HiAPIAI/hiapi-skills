# HiAPI GPT Image 2.5 Skill

技能状态：`release`。仓库为 https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill，已提供公开安装；下方 API schema 与公开价格页已核实。

本条目对应 6 个可调用模型 ID，分两条路线（技能版本 0.4.0）：

- **模式路线（默认）**：`gpt-image-2.5-flare/text-to-image`、`gpt-image-2.5-flare/image-to-image`、`gpt-image-2.5-sunburst/text-to-image`、`gpt-image-2.5-sunburst/image-to-image`。不指定 `--model` 时，CLI 按是否传参考图自动选文生图或图生图；`--family` 默认 `flare`。按 `resolution`（1K/2K/4K）计价。
- **Pro（`--route pro`）**：`gpt-image-2.5-flare@pro`、`gpt-image-2.5-sunburst@pro`，按 `quality` × `framing` × `resolution` 计价；`framing` 由服务端按 `aspect_ratio` 计算，客户端不得发送。

不要直接请求裸 ID `gpt-image-2.5-flare` / `gpt-image-2.5-sunburst`，技能会在本地拒绝。

一次任务生成一张图片。

六个模型 ID 的提示词上限已统一为 20,000 字符（2026-10-13 起放宽，2026-10-23 核验）。CLI 先去除首尾空白，再按 JavaScript `string.length` 计算 UTF-16 码元；常用汉字计 1、补充平面 emoji 计 2。文生图另有 o200k token 内部上限，超限返回 `PROMPT_TOO_LONG`；图生图没有该上限。0.4.0 为软更新：`latestVersion` 为 `0.4.0`，`minimumVersion` 保持 `0.3.1`。0.4.0 跟随生产的 `@pro` 新契约（2026-11-19 核验）：`aspect_ratio` 改为 15 种比例或 `WxH` 像素的 pattern、去掉 `auto`；`quality` 收敛为 5 值（`low`/`medium`/`high`/`xhigh`/`max`，默认 `medium`，去掉 `auto`）；`@pro` 新增 `resolution`（`1K`/`2K`/`4K`，默认 `1K`）；`framing` 为服务端计算字段，请求里带上会返回 400；计价改为 `{framing, quality, resolution}` 三键 45 格。0.3.3 把免 key 的公开价格与模型元数据改从 `https://api.hiapi.ai` 读取。

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

Pro 路线把顶层 `model` 写成 `gpt-image-2.5-flare@pro` 或 `gpt-image-2.5-sunburst@pro`，`input` 支持：

- `prompt`：必填，1–20,000 字符。
- `image_urls`：可选，1–16 张公开 HTTP(S) URL；文生图省略该字段。
- `aspect_ratio`：15 种比例之一（`1:1`、`3:2`、`2:3`、`4:3`、`3:4`、`5:4`、`4:5`、`16:9`、`9:16`、`2:1`、`1:2`、`21:9`、`9:21`、`3:1`、`1:3`），或精确 `WxH` 像素（每边为 16 的倍数、16–3840，总像素 655,360–8,294,400，长边不超过短边 3 倍）。默认 `1:1`，不接受 `auto`。
- `resolution`：`1K`（默认）、`2K`、`4K`；比例按该档的像素预算出图，`WxH` 则按总像素归档。
- `quality`：`low`、`medium`（默认）、`high`、`xhigh`、`max`；不接受 `auto`。
- `background`：`auto`（默认）、`transparent`、`opaque`；与 `resolution` 无关，透明需要 `output_format` 为 `png` 或 `webp`。
- `output_format`：`png`、`jpeg`、`webp`（默认）。

`framing`（`square`/`standard`/`panorama`，默认 `standard`）只为实现计价规则而声明在 schema 里，由服务端按 `aspect_ratio` 计算（长边 ÷ 短边 < 1.3 方幅、1.3–2 标准幅、> 2 长幅），schema 标了 `visible: false` 和 `x-hiapi-server-computed: true`；请求携带会返回 HTTP 400。

任务创建前执行本地参数校验；一次调用只创建一个任务。不要为重试重复创建不确定的付费任务，应先恢复或查询已有任务。成功结果为 `type=image` 的 URL；可通过 `GET /v1/tasks/{taskId}` 查询 `queued`、`handling`、`archiving`、`success`、`fail` 状态。

完整的 skill 级 API 与输出说明见仓库中的 [`references/api.md`](https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill/blob/main/references/api.md)、[`references/output.md`](https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill/blob/main/references/output.md)；升级规则见 [`references/upgrade-policy.md`](https://github.com/HiAPIAI/hiapi-gpt-image-2-5-skill/blob/main/references/upgrade-policy.md)。

## 鉴权与链接

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

- API Key（English）：https://www.hiapi.ai/en/dashboard/api-keys?utm_source=github&utm_medium=readme&utm_campaign=hiapi-skills
- API Key（中文）：https://www.hiapi.ai/zh/dashboard/api-keys?utm_source=github&utm_medium=readme&utm_campaign=hiapi-skills
- Pricing（公开价格页）：https://www.hiapi.ai/en/pricing?utm_source=github&utm_medium=readme&utm_campaign=hiapi-skills
- API docs：https://www.hiapi.ai/docs?utm_source=github&utm_medium=readme&utm_campaign=hiapi-skills
- Prompt gallery：https://github.com/HiAPIAI/awesome-gpt-image-2-prompts

当前文档记录已发布目录与已核实的线上请求形态；价格与生产可用性仍需按各自证据单独验收。
