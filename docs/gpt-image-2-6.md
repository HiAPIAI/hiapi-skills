# HiAPI GPT Image 2.6 Skill

技能状态：`release`。仓库为 https://github.com/HiAPIAI/hiapi-gpt-image-2-6-skill，已提供公开安装。下方契约按 2026-11-06 的公开 schema 与价格接口核实；价格以定价页为准。

本条目对应 4 个可调用模型 ID，由家族（Flare / Sunburst）与模式（文生图 / 图生图）组合而成：

- `gpt-image-2.6-flare/text-to-image`（默认）
- `gpt-image-2.6-flare/image-to-image`
- `gpt-image-2.6-sunburst/text-to-image`
- `gpt-image-2.6-sunburst/image-to-image`

与 2.5 不同，2.6 不再区分模式路线和 `@pro` 路线：同一个模型同时接受 `quality` 和 `resolution`，五档质量（`low`、`medium`、`high`、`xhigh`、`max`，默认 `high`）与三档分辨率（`1K`、`2K`、`4K`，默认 `1K`）可以自由组合。一次任务产出一张图片，或一个 GIF 动图。

## 安装

```bash
npx -y github:HiAPIAI/hiapi-gpt-image-2-6-skill -y
```

安装器自动探测 Codex（`~/.codex/skills`）和 Claude Code（`~/.claude/skills`）；用 `--codex`、`--claude`、`--target=/path` 或 `AGENT_SKILLS_DIR` 指定位置。也可以用官方 Skills CLI：

```bash
npx skills add HiAPIAI/hiapi-gpt-image-2-6-skill --skill hiapi-gpt-image-2-6
```

## 能力

- **文生图**：`text-to-image` 模型默认输出 PNG，可改用 JPEG / WebP，并支持 **SVG** 和 **GIF**；这两种格式只有文生图模型接受。
- **图生图**：1–16 张参考图，支持 **mask** 局部重绘和 **markup** 圈注改图，二者互斥。
- **画幅**：`auto`（默认）加 15 种比例，共 16 种：`1:1`、`3:2`、`2:3`、`4:3`、`3:4`、`5:4`、`4:5`、`16:9`、`9:16`、`2:1`、`1:2`、`21:9`、`9:21`、`3:1`、`1:3`。
- **提示词**：1–32,000 字符。
- **其它参数**：`complexity`（`low` / `medium` / `high`，默认 `high`）、`moderation`（`auto` / `low`，默认 `low`）、`output_compression`（0–100，只用于 jpeg / webp）、`background`（`transparent` 需要 png 或 webp）。

## 示例

### 文生图

```bash
node scripts/hiapi-gpt-image-2-6.mjs "A quiet alpine lake at sunrise" \
  --quality high --resolution 2K --aspect-ratio 16:9
```

对应请求：

```json
{
  "model": "gpt-image-2.6-flare/text-to-image",
  "input": {
    "prompt": "A quiet alpine lake at sunrise",
    "quality": "high",
    "resolution": "2K",
    "aspect_ratio": "16:9"
  }
}
```

### SVG

```bash
node scripts/hiapi-gpt-image-2-6.mjs "minimal lighthouse logo, two colors" \
  --svg --quality low --resolution 1K
```

`--svg` 把 `output_format` 设为 `svg`，产物按 `.svg` 保存并检查是否有 `<svg` 文本；SVG 生成较慢，技能会等待更久。

### GIF

```bash
node scripts/hiapi-gpt-image-2-6.mjs "a cat blinking, simple flat colors" \
  --gif --frame-size 512x512 --frame-count 9 --frame-duration-ms 200
```

GIF 规则：

- `frame_size` 两边都必须是 16 的倍数，省略或 `auto` 为 `512x512`；比例名称（如 `1:1`）不接受，用 `frame_size` 决定画幅。
- `frame_count` 为 2–16，默认 9；`frame_duration_ms` 至少 20，默认 200。
- `aspect_ratio` 只能不传或 `auto`。传了其它比例时，技能会自动换算成 `frame_size` 并说明换算结果。
- 帧会被拼成一张 sheet，超出服务端上限时在提交阶段被拒且不扣费，技能只提示、不拦。

### 图生图与局部改图

```bash
node scripts/hiapi-gpt-image-2-6.mjs "replace the mug with a glass" \
  --image ./photo.png --mask ./mask.png --quality high --resolution 2K
```

- `--image` 可以重复 1–16 次；本地文件会先经 `POST /v1/uploads` 换成 URL，`--dry-run` 只做本地检查、不上传。
- `mask_url` 是与第一张原图同尺寸的 RGBA PNG，透明像素标记要改的区域。
- `markup_url` 是透明 PNG 圈注，只作为位置提示，不会出现在结果里。
- `mask_url` 与 `markup_url` 互斥，同时传会被本地拒绝。

## 估价与成本上限

```bash
node scripts/hiapi-gpt-image-2-6.mjs "a poster" --dry-run --estimate --max-cost 0.10
```

`--estimate` 按质量、分辨率、输出格式和参考图张数估价，并读取当前活动；`--max-cost` 设上限，估价超过上限就不下单。估价接口不可用时：设了 `--max-cost` 就拦住，没设就照常下单。

价格：low 1K 起 $0.023，以定价页为准：https://hiapi.ai/en/pricing

## 自动更新

技能默认开启签名的自动更新：

1. 每次运行读一次版本策略（先中央目录 `skills.json`，失败再读技能仓库的 `update-policy.json`，单个超时 4 秒）。读不到就照常生成，并标注版本未核实。
2. 同一大版本（1.x）内有新版、且技能目录可写、不是 git 仓库、不在 CI 时，自动更新：下载 `release/manifest.json` 与 `.sig`，先验证 Ed25519 签名，再逐个文件校验 sha256，全部通过才原子替换，失败则回滚并退回手动安装提示。
3. 本次运行继续用已加载的旧代码，新版下次运行生效。
4. 低于 `minimumVersion` 的硬升级会先尝试自动更新，更新不了才拦新的付费任务；dry-run 与任务恢复照常可用。

关闭方式：

```bash
export HIAPI_SKILL_AUTO_UPDATE=off   # 或每次加 --no-auto-update
```

手动检查与更新：`--update`；只看版本：`--version`。

## 从 2.5 迁移

2.5 的写法在 2.6 技能里照样能跑，技能会自动映射并说明：

| 2.5 写法 | 2.6 等价 |
| --- | --- |
| `--model gpt-image-2.5-flare/text-to-image` | `gpt-image-2.6-flare/text-to-image` |
| `--model gpt-image-2.5-sunburst/image-to-image` | `gpt-image-2.6-sunburst/image-to-image` |
| `--route pro` + `--quality high` | 直接用 2.6 模型 + `--quality`（2.6 无 `@pro`） |
| `--resolution 2K` | 不变 |
| 20,000 字符上限 | 放宽到 32,000 字符 |

完整对照见技能仓库的 `MIGRATION.md`。

## 线上 API 契约

```text
POST https://api.hiapi.ai/v1/tasks
```

Top-level 用目标模型 ID 和 `input` 对象；任务状态为 `queued`、`handling`、`archiving`、`success`、`fail`，用 `GET /v1/tasks/{taskId}` 查询。技能在本地先做参数校验，并立即打印 task ID；可用 `--resume-task-id` 恢复已创建的任务，不要为不确定的付费任务重复创建。

## 鉴权与链接

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

- API Key（English）：https://www.hiapi.ai/en/dashboard/api-keys
- API Key（中文）：https://www.hiapi.ai/zh/dashboard/api-keys
- 模型页：https://hiapi.ai/en/models/gpt-image-2.6-flare-text-to-image ；中文：https://hiapi.ai/zh/models/gpt-image-2.6-flare-text-to-image
- Sunburst 模型页：https://hiapi.ai/en/models/gpt-image-2.6-sunburst-text-to-image ；中文：https://hiapi.ai/zh/models/gpt-image-2.6-sunburst-text-to-image
- Pricing（公开价格页）：https://hiapi.ai/en/pricing
- API docs：https://www.hiapi.ai/docs
- Prompt gallery：https://github.com/HiAPIAI/awesome-gpt-image-2-prompts
- 兼容性与改动记录：https://github.com/HiAPIAI/hiapi-gpt-image-2-6-skill/blob/main/MIGRATION.md

本页记录已发布目录与已核实的线上请求形态；价格与生产可用性按各自证据单独验收。