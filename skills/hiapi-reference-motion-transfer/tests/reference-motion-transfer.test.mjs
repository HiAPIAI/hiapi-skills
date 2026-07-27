import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { promisify } from "node:util";

import {
  MODEL,
  POLL_TIMEOUT_MS,
  REVIEW_CHECKLIST,
  SKILL_VERSION,
  buildHttpErrorMessage,
  buildVideoPayload,
  checkSkillUpdate,
  compareVersions,
  extractTaskId,
  extractTaskFailureSummary,
  extractVideoUrl,
  generateVideo,
  isTerminalFailureStatus,
  isTransientNetworkError,
  normalizeMediaOptions,
  normalizeRatio,
  normalizeResolution,
  normalizeSeconds,
  normalizeStorage,
  normalizeTimeoutMinutes,
  parseArgs,
  requestJson,
  resumeVideoTask,
  useCurlTransport,
  resolveConfig,
  saveVideoOutput,
} from "../scripts/lib/seedance-2-video.mjs";
import {
  buildTransferPrompt,
  normalizeTransferMode,
  prepareReplacementInputs,
  prepareTransferOptions,
  resolveTransferMode,
} from "../scripts/lib/motion-transfer.mjs";
import { fileToDataUri } from "../scripts/lib/media-files.mjs";

const execFileAsync = promisify(execFile);

test("runtime model and version match the canonical API id and package version", () => {
  const packageJson = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.equal(MODEL, "seedance-2.0");
  assert.equal(SKILL_VERSION, packageJson.version);
  assert.equal(SKILL_VERSION, "0.2.0");
});

test("skill onboarding requires clarification, secure key setup, and explicit paid approval", () => {
  const skill = readFileSync(new URL("../SKILL.md", import.meta.url), "utf8");
  assert.match(skill, /token.*API key.*preflightToken/is);
  assert.match(skill, /Never infer `--subject-image-clean`/i);
  assert.match(skill, /preflightToken.*is not user consent/is);
  assert.match(skill, /no API task was created and no credits were spent/i);
  assert.match(skill, /references\/api\.md/);
  assert.match(skill, /references\/output\.md/);
});

test("builds focused motion, camera, rhythm, and balanced transfer prompts", () => {
  for (const mode of ["motion", "camera", "rhythm", "balanced"]) {
    const prompt = buildTransferPrompt({
      prompt: "A new subject performs in a white studio",
      mode,
      referenceVideoUrls: ["asset://video-1"],
    });
    assert.match(prompt, /A new subject performs in a white studio/);
    assert.match(prompt, /Video 1/);
  }
  assert.match(
    buildTransferPrompt({
      prompt: "A product ad",
      mode: "camera",
      referenceVideoUrls: ["asset://v1", "asset://v2"],
    }),
    /Videos 2-2 only as secondary references/,
  );
});

test("requires reference video input and validates transfer modes", () => {
  assert.equal(normalizeTransferMode(), "balanced");
  assert.equal(normalizeTransferMode("CAMERA"), "camera");
  assert.throws(() => normalizeTransferMode("identity"), /Unsupported transfer mode/);
  assert.throws(() => buildTransferPrompt({ prompt: "A new scene" }), /reference-video-url/);
  assert.throws(
    () => buildTransferPrompt({ referenceVideoUrls: ["asset://v1"] }),
    /prompt describing the new subject and scene/,
  );
});

test("replacement images default to strict replace and inherit Video 1", () => {
  assert.equal(resolveTransferMode(undefined, 1), "replace");
  assert.equal(resolveTransferMode(undefined, 0), "balanced");

  const options = prepareTransferOptions({
    prompt: "Move the subject to a new snowy mountain scene",
    replacementSubject: "white snow leopard",
    replacementImageUrls: ["asset://snow-leopard"],
    replacementImageMetadata: [{ path: "snow-leopard.png", width: 662, height: 397, hasAlpha: true }],
    referenceVideoUrls: ["asset://video-1"],
    referenceVideoDurations: [8.06],
    referenceVideoMetadata: [{ duration: 8.06, width: 240, height: 426, aspectRatio: "9:16" }],
  });

  assert.equal(options.mode, "replace");
  assert.equal(options.ratio, "9:16");
  assert.equal(options.seconds, "8");
  assert.match(options.prompt, /Replace only the primary performer or main subject in Video 1/i);
  assert.match(options.prompt, /Preserve Video 1 as the source timeline/i);
  assert.match(options.prompt, /Ignore the image background, pose, camera angle, lighting, and scenery/i);
  assert.doesNotMatch(options.prompt, /snowy mountain/i);
  assert.match(options.preflightWarnings.join("\n"), /ignored --prompt/i);
});

test("strict replace rejects competing or ambiguous inputs before submission", () => {
  const base = {
    mode: "replace",
    replacementSubject: "white snow leopard",
    replacementImageUrls: ["asset://subject"],
    subjectImageClean: true,
    referenceVideoUrls: ["asset://video-1"],
    referenceVideoDurations: [8],
    ratio: "9:16",
  };

  assert.throws(
    () => prepareTransferOptions({ ...base, replacementImageUrls: [] }),
    /requires --replacement-image/i,
  );
  assert.throws(
    () => prepareTransferOptions({ ...base, replacementSubject: "" }),
    /requires --replacement-subject/i,
  );
  assert.throws(
    () => prepareTransferOptions({
      ...base,
      referenceVideoUrls: ["asset://video-1", "asset://video-2"],
      referenceVideoDurations: [4, 4],
    }),
    /exactly one primary reference video/i,
  );
  assert.throws(
    () => prepareTransferOptions({ ...base, referenceImageUrls: ["asset://scene"] }),
    /accepts only replacement-subject images/i,
  );
  assert.throws(
    () => prepareTransferOptions({ ...base, referenceAudioUrls: ["asset://audio"] }),
    /does not accept separate reference audio/i,
  );
  assert.throws(
    () => prepareTransferOptions({
      ...base,
      subjectImageClean: false,
      replacementImageMetadata: [{ hasAlpha: false }],
    }),
    /transparent replacement image.*multiple views.*subject-image-clean/i,
  );
  assert.throws(
    () => prepareTransferOptions({ ...base, ratio: undefined }),
    /Provide its explicit fixed --ratio/i,
  );
  assert.throws(
    () => prepareTransferOptions({
      ...base,
      ratio: "16:9",
      referenceVideoMetadata: [{ duration: 8.06, width: 240, height: 426, aspectRatio: "9:16" }],
    }),
    /must preserve Video 1's 9:16 aspect ratio/i,
  );
  assert.throws(
    () => prepareTransferOptions({ ...base, seconds: "4" }),
    /must preserve Video 1's timing with --seconds 8/i,
  );
});

test("strict replace clamps short source timing and warns about uninspectable remote images", () => {
  const options = prepareTransferOptions({
    mode: "replace",
    replacementSubject: "white snow leopard",
    replacementImageUrls: ["asset://front", "asset://side"],
    referenceVideoUrls: ["asset://video-1"],
    referenceVideoDurations: [2.4],
    referenceVideoMetadata: [{ duration: 2.4, width: 240, height: 426, aspectRatio: "9:16" }],
  });
  assert.equal(options.seconds, "4");
  assert.match(options.preflightWarnings.join("\n"), /at least 4 seconds/i);
  assert.match(options.preflightWarnings.join("\n"), /remote replacement images could not be inspected/i);
});

test("puts replacement images first and writes a strict replacement contract", () => {
  const options = prepareReplacementInputs({
    replacementImageUrls: ["asset://snow-leopard-front", "asset://snow-leopard-side"],
    referenceImageUrls: ["asset://scene"],
  });
  assert.deepEqual(options.referenceImageUrls, [
    "asset://snow-leopard-front",
    "asset://snow-leopard-side",
    "asset://scene",
  ]);
  assert.equal(options.replacementImageCount, 2);

  const prompt = buildTransferPrompt({
    prompt: "A white snow leopard performs parkour in the plaza",
    mode: "motion",
    referenceVideoUrls: ["asset://video-1"],
    replacementImageCount: 2,
    replacementSubject: "a white snow leopard",
  });
  assert.match(prompt, /Image 1 through Image 2 defines a white snow leopard/);
  assert.match(prompt, /source performer must not appear in any frame/i);
  assert.match(prompt, /physically plausible locomotion/i);
});

test("parseArgs reads the transfer mode", () => {
  assert.deepEqual(parseArgs(["--prompt", "p", "--mode", "motion"]), {
    prompt: "p",
    mode: "motion",
  });
});

test("parseArgs reads local media and dry-run options", () => {
  assert.deepEqual(
    parseArgs([
      "--prompt", "p",
      "--reference-video-file", "motion.mp4",
      "--reference-video-duration", "5",
      "--dry-run",
    ]),
    {
      prompt: "p",
      referenceVideoFiles: ["motion.mp4"],
      referenceVideoDurations: ["5"],
      dryRun: true,
    },
  );
});

test("parseArgs reads replacement subject images", () => {
  assert.deepEqual(
    parseArgs([
      "--prompt", "p",
      "--replacement-image-file", "snow-leopard.jpg",
      "--replacement-image-url", "asset://side-view",
      "--replacement-subject", "white snow leopard",
      "--subject-image-clean",
    ]),
    {
      prompt: "p",
      replacementImageFiles: ["snow-leopard.jpg"],
      replacementImageUrls: ["asset://side-view"],
      replacementSubject: "white snow leopard",
      subjectImageClean: true,
    },
  );
});

test("parseArgs reads the strict preflight confirmation token", () => {
  assert.deepEqual(parseArgs(["--confirm-preflight", "abc123"]), { confirmPreflight: "abc123" });
});

test("complete CLI dry-run keeps replacement Image 1 bound to reference Video 1", async () => {
  const script = fileURLToPath(new URL("../scripts/hiapi-reference-motion-transfer.mjs", import.meta.url));
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  const replacementDataUri = "data:image/png;base64,aGVsbG8=";
  const { stdout } = await execFileAsync(process.execPath, [
    script,
    "--replacement-subject", "white snow leopard",
    "--replacement-image-url", replacementDataUri,
    "--subject-image-clean",
    "--reference-video-url", "asset://motion-video",
    "--reference-video-duration", "8",
    "--ratio", "9:16",
    "--dry-run",
  ], { cwd });
  const result = JSON.parse(stdout);

  assert.equal(result.transferMode, "replace");
  assert.equal(result.preflightToken.length, 64);
  assert.equal(result.payload.input.reference_image_urls[0].kind, "inline-media");
  assert.equal(result.payload.input.reference_image_urls[0].mimeType, "image/png");
  assert.equal(result.payload.input.reference_image_urls[0].bytes, 5);
  assert.equal(result.payload.input.reference_image_urls[0].sha256.length, 64);
  assert.doesNotMatch(stdout, /aGVsbG8=/);
  assert.deepEqual(result.payload.input.reference_video_urls, ["asset://motion-video"]);
  assert.equal(result.payload.input.aspect_ratio, "9:16");
  assert.equal("first_frame_url" in result.payload.input, false);
  assert.match(result.payload.input.prompt, /Image 1/);
  assert.match(result.payload.input.prompt, /Video 1/);
});

test("strict replace refuses a paid path without the reviewed preflight token", async () => {
  const script = fileURLToPath(new URL("../scripts/hiapi-reference-motion-transfer.mjs", import.meta.url));
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  await assert.rejects(
    () => execFileAsync(process.execPath, [
      script,
      "--replacement-subject", "white snow leopard",
      "--replacement-image-url", "asset://snow-leopard",
      "--subject-image-clean",
      "--reference-video-url", "asset://motion-video",
      "--reference-video-duration", "8",
      "--ratio", "9:16",
    ], { cwd, env: { ...process.env, HIAPI_API_KEY: "" } }),
    (error) => {
      assert.match(String(error.stderr), /matching --confirm-preflight token/i);
      assert.match(String(error.stderr), /wait for explicit paid-generation approval/i);
      assert.match(String(error.stderr), /No task was created/i);
      return true;
    },
  );
});

test("rejects unsupported local media types before reading them", async () => {
  await assert.rejects(
    () => fileToDataUri(new URL("../.env.example", import.meta.url)),
    /Unsupported local media type/,
  );
});

test("converts a supported local media file to a data URI", async () => {
  const uri = await fileToDataUri(new URL("./fixtures/sample.mp4", import.meta.url));
  assert.match(uri, /^data:video\/mp4;base64,/);
});

test("uses a long default poll window and recognizes all terminal failure states", () => {
  assert.equal(POLL_TIMEOUT_MS, 120 * 60 * 1000);
  for (const status of ["fail", "failed", "error", "cancelled", "canceled"]) {
    assert.equal(isTerminalFailureStatus(status), true, status);
  }
  assert.equal(isTerminalFailureStatus("handling"), false);
});

test("builds the HiAPI video payload for Seedance 2.0 text-to-video", () => {
  assert.deepEqual(
    buildVideoPayload({
      prompt: "A cinematic ocean cliff shot at golden hour",
      seconds: "5",
      resolution: "720p",
      ratio: "16:9",
    }),
    {
      model: "seedance-2.0",
      input: {
        prompt: "A cinematic ocean cliff shot at golden hour",
        duration: 5,
        resolution: "720p",
        aspect_ratio: "16:9",
      },
    },
  );
});

test("omits storage by default and adds persistent only when requested", () => {
  // Default: no top-level storage field (temp is the implicit API default).
  assert.equal("storage" in buildVideoPayload({ prompt: "p" }), false);
  assert.equal("storage" in buildVideoPayload({ prompt: "p", storage: "temp" }), false);

  // Persistent surfaces as a top-level field, never inside input.
  const persistent = buildVideoPayload({ prompt: "p", storage: "persistent" });
  assert.equal(persistent.storage, "persistent");
  assert.equal("storage" in persistent.input, false);

  // Case-insensitive; invalid values rejected with cost guidance.
  assert.equal(buildVideoPayload({ prompt: "p", storage: "Persistent" }).storage, "persistent");
  assert.throws(() => normalizeStorage("forever"), /Unsupported storage/);
  assert.throws(() => buildVideoPayload({ prompt: "p", storage: "forever" }), /Unsupported storage/);

  // undefined (flag omitted) falls back to temp; empty string / null are explicit
  // invalid input and must throw rather than silently coercing to "temp".
  assert.equal(normalizeStorage(undefined), "temp");
  assert.equal("storage" in buildVideoPayload({ prompt: "p", storage: undefined }), false);
  assert.throws(() => normalizeStorage(""), /Unsupported storage/);
  assert.throws(() => normalizeStorage(null), /Unsupported storage/);
  assert.throws(() => buildVideoPayload({ prompt: "p", storage: "" }), /Unsupported storage/);
  assert.throws(() => buildVideoPayload({ prompt: "p", storage: "  " }), /Unsupported storage/);
});

test("parseArgs reads --storage", () => {
  assert.equal(parseArgs(["--prompt", "p", "--storage", "persistent"]).storage, "persistent");
  assert.equal("storage" in parseArgs(["--prompt", "p"]), false);
});

test("normalizes and parses the configurable polling timeout", () => {
  assert.equal(normalizeTimeoutMinutes(), 120);
  assert.equal(normalizeTimeoutMinutes("60"), 60);
  assert.deepEqual(
    parseArgs(["--prompt", "p", "--timeout-minutes", "45"]),
    { prompt: "p", timeoutMinutes: 45 },
  );
  assert.throws(() => normalizeTimeoutMinutes("0"), /Unsupported timeout/);
  assert.throws(() => normalizeTimeoutMinutes("121"), /Unsupported timeout/);
  assert.throws(() => parseArgs(["--prompt", "p", "--timeout-minutes", "1.5"]), /Unsupported timeout/);
});

test("builds a 4k payload and normalizes uppercase 4K", () => {
  const payload = buildVideoPayload({
    prompt: "A cinematic ocean cliff shot at golden hour",
    resolution: "4K",
  });
  assert.equal(payload.input.resolution, "4k");
});

test("adds input_reference only when an image is provided", () => {
  const payload = buildVideoPayload({
    prompt: "Make this product photo move with soft studio lighting",
    inputReference: "https://example.com/product.png",
  });

  assert.equal(payload.model, "seedance-2.0");
  assert.equal(payload.input.duration, 5);
  assert.equal(payload.input.resolution, "720p");
  assert.equal(payload.input.aspect_ratio, "16:9");
  assert.equal(payload.input.first_frame_url, "https://example.com/product.png");
  assert.equal("generate_audio" in payload.input, false);
});

test("supports first and last frame image-to-video mode", () => {
  const payload = buildVideoPayload({
    prompt: "Move from the first frame to the final product hero shot",
    firstFrameUrl: "asset://first",
    lastFrameUrl: "asset://last",
    resolution: "1080p",
    ratio: "adaptive",
  });

  assert.equal(payload.input.first_frame_url, "asset://first");
  assert.equal(payload.input.last_frame_url, "asset://last");
  assert.equal(payload.input.resolution, "1080p");
  assert.equal(payload.input.aspect_ratio, "adaptive");
});

test("supports multimodal reference mode with validation durations", () => {
  const payload = buildVideoPayload({
    prompt: "Use the product images, motion reference, and audio reference to create a commercial",
    referenceImageUrls: ["asset://image-1", "asset://image-2"],
    referenceVideoUrls: ["asset://video-1", "asset://video-2"],
    referenceVideoDurations: [6, 7],
    referenceAudioUrls: ["asset://audio-1"],
    referenceAudioDurations: [10],
    returnLastFrame: true,
    webSearch: true,
    nsfwChecker: true,
  });

  assert.deepEqual(payload.input.reference_image_urls, ["asset://image-1", "asset://image-2"]);
  assert.deepEqual(payload.input.reference_video_urls, ["asset://video-1", "asset://video-2"]);
  assert.deepEqual(payload.input.reference_audio_urls, ["asset://audio-1"]);
  assert.equal(payload.input.return_last_frame, true);
  assert.equal(payload.input.web_search, true);
  assert.equal(payload.input.nsfw_checker, true);
});

test("keeps base64 data URIs intact in multimodal reference lists", () => {
  const imageOne = "data:image/jpeg;base64,ZmFrZS1pbWFnZS0x";
  const imageTwo = "data:image/jpeg;base64,ZmFrZS1pbWFnZS0y";
  const audio = "data:audio/mpeg;base64,ZmFrZS1hdWRpbw==";
  const payload = buildVideoPayload({
    prompt: "Use the local references without splitting their base64 payloads",
    referenceImageUrls: [imageOne, imageTwo],
    referenceAudioUrls: [audio],
    referenceAudioDurations: [15],
    generateAudio: true,
  });

  assert.deepEqual(payload.input.reference_image_urls, [imageOne, imageTwo]);
  assert.deepEqual(payload.input.reference_audio_urls, [audio]);
  assert.equal(payload.input.generate_audio, true);
});

test("rejects mutually exclusive Seedance media modes", () => {
  assert.throws(
    () => buildVideoPayload({
      prompt: "Invalid mix",
      firstFrameUrl: "asset://first",
      referenceImageUrls: ["asset://ref"],
    }),
    /mutually exclusive/i,
  );
  assert.throws(
    () => buildVideoPayload({
      prompt: "Last only",
      lastFrameUrl: "asset://last",
    }),
    /requires a first frame/i,
  );
});

test("validates Seedance reference material limits", () => {
  assert.throws(
    () => normalizeMediaOptions({
      referenceImageUrls: Array.from({ length: 10 }, (_, index) => `asset://image-${index}`),
    }),
    /at most 9 images/i,
  );
  assert.throws(
    () => normalizeMediaOptions({
      referenceVideoUrls: ["asset://v1", "asset://v2", "asset://v3", "asset://v4"],
      referenceVideoDurations: [3, 3, 3, 3],
    }),
    /at most 3 reference videos/i,
  );
  assert.throws(
    () => normalizeMediaOptions({
      referenceAudioUrls: ["asset://a1", "asset://a2", "asset://a3", "asset://a4"],
      referenceAudioDurations: [3, 3, 3, 3],
    }),
    /at most 3 reference audio/i,
  );
});

test("validates Seedance reference video and audio durations", () => {
  assert.throws(
    () => normalizeMediaOptions({
      referenceVideoUrls: ["asset://v1"],
    }),
    /reference-video-duration/i,
  );
  assert.throws(
    () => normalizeMediaOptions({
      referenceVideoUrls: ["asset://v1"],
      referenceVideoDurations: [1],
    }),
    /must be 2-15 seconds/i,
  );
  assert.throws(
    () => normalizeMediaOptions({
      referenceAudioUrls: ["asset://a1", "asset://a2"],
      referenceAudioDurations: [8, 8],
    }),
    /total duration must not exceed 15 seconds/i,
  );
});

test("validates duration, resolution, and ratio before sending a request", () => {
  assert.equal(normalizeSeconds("4"), "4");
  assert.equal(normalizeSeconds(15), "15");
  assert.throws(() => normalizeSeconds("3"), /Unsupported duration/);
  assert.throws(() => normalizeSeconds("16"), /Unsupported duration/);

  assert.equal(normalizeResolution("480p"), "480p");
  assert.equal(normalizeResolution("720P"), "720p");
  assert.equal(normalizeResolution("1080P"), "1080p");
  assert.equal(normalizeResolution("4k"), "4k");
  assert.equal(normalizeResolution("4K"), "4k");
  assert.throws(() => normalizeResolution("2k"), /Unsupported resolution/);
  assert.throws(() => normalizeResolution("2160p"), /Unsupported resolution/);

  assert.equal(normalizeRatio("9:16"), "9:16");
  assert.equal(normalizeRatio("adaptive"), "adaptive");
  assert.throws(() => normalizeRatio("2:1"), /Unsupported ratio/);
});

test("parses repeatable multimodal reference arguments", () => {
  assert.deepEqual(
    parseArgs([
      "--prompt", "Use refs",
      "--reference-image-url", "asset://i1,asset://i2",
      "--reference-video-url", "asset://v1",
      "--reference-video-duration", "6",
      "--reference-audio-url", "asset://a1",
      "--reference-audio-duration", "4",
      "--return-last-frame",
      "--web-search",
      "--nsfw-checker",
    ]),
    {
      prompt: "Use refs",
      referenceImageUrls: ["asset://i1,asset://i2"],
      referenceVideoUrls: ["asset://v1"],
      referenceVideoDurations: ["6"],
      referenceAudioUrls: ["asset://a1"],
      referenceAudioDurations: ["4"],
      returnLastFrame: true,
      webSearch: true,
      nsfwChecker: true,
    },
  );
});

test("supports generate_audio tri-state: omitted by default, explicit true/false", () => {
  const omitted = buildVideoPayload({
    prompt: "A coffee shop scene with natural background sound",
  });
  assert.equal("generate_audio" in omitted.input, false);

  const enabled = buildVideoPayload({
    prompt: "A coffee shop scene with natural background sound",
    generateAudio: true,
  });
  assert.equal(enabled.input.generate_audio, true);

  const disabled = buildVideoPayload({
    prompt: "A silent product rotation",
    generateAudio: false,
  });
  assert.equal(disabled.input.generate_audio, false);
});

test("supports seed for reproducible generation and validates its range", () => {
  const payload = buildVideoPayload({
    prompt: "A repeatable shot",
    seed: "12345",
  });
  assert.equal(payload.input.seed, 12345);

  const omitted = buildVideoPayload({ prompt: "Random shot" });
  assert.equal("seed" in omitted.input, false);

  assert.throws(() => buildVideoPayload({ prompt: "Bad seed", seed: "-1" }), /Unsupported seed/);
  assert.throws(() => buildVideoPayload({ prompt: "Bad seed", seed: "2147483648" }), /Unsupported seed/);
  assert.throws(() => buildVideoPayload({ prompt: "Bad seed", seed: "1.5" }), /Unsupported seed/);
});

test("parses audio flags and seed from CLI arguments", () => {
  assert.deepEqual(parseArgs(["--prompt", "p", "--seed", "42"]), { prompt: "p", seed: "42" });
  assert.deepEqual(parseArgs(["--prompt", "p", "--generate-audio"]), { prompt: "p", generateAudio: true });
  assert.deepEqual(parseArgs(["--prompt", "p", "--no-audio"]), { prompt: "p", generateAudio: false });
  assert.deepEqual(parseArgs(["--prompt", "p", "--no-generate-audio"]), { prompt: "p", generateAudio: false });
  assert.deepEqual(parseArgs(["--prompt", "p"]), { prompt: "p" });
});

test("extracts task ids and video URLs from common HiAPI response shapes", () => {
  assert.equal(extractTaskId({ data: { taskId: "tk-hiapi-123" } }), "tk-hiapi-123");
  assert.equal(extractTaskId({ id: "video_task_123" }), "video_task_123");
  assert.equal(extractTaskId({ task_id: "task_456" }), "task_456");

  assert.equal(
    extractVideoUrl({ data: { output: [{ type: "video", url: "https://cdn.example.com/out.mp4" }] } }),
    "https://cdn.example.com/out.mp4",
  );
  assert.equal(
    extractVideoUrl({
      data: {
        output: [
          { type: "image", url: "https://cdn.example.com/last-frame.png" },
          { type: "video", url: "https://cdn.example.com/out.mp4" },
        ],
      },
    }),
    "https://cdn.example.com/out.mp4",
  );
  assert.equal(
    extractVideoUrl({
      output: [
        "https://cdn.example.com/last-frame.png",
        "https://cdn.example.com/out.webm?download=1",
      ],
    }),
    "https://cdn.example.com/out.webm?download=1",
  );
  assert.equal(
    extractVideoUrl({ metadata: { url: "https://cdn.example.com/meta.mp4" } }),
    "https://cdn.example.com/meta.mp4",
  );
});

test("generated and resumed videos remain unreviewed until human visual acceptance", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    if (calls === 1) {
      return new Response(JSON.stringify({ data: { taskId: "task-created" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify({
      data: {
        taskId: calls === 2 ? "task-created" : "task-resumed",
        status: "success",
        output: [{ type: "video", url: "https://cdn.example.com/generated.mp4" }],
      },
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  const config = { apiKey: "test-key", baseUrl: "https://api.example.test" };
  try {
    const generated = await generateVideo({
      prompt: "reference-driven request",
      save: false,
      pollIntervalMs: 0,
      timeoutMs: 1000,
    }, config);
    const resumed = await resumeVideoTask("task-resumed", {
      save: false,
      pollIntervalMs: 0,
      timeoutMs: 1000,
    }, config);

    for (const result of [generated, resumed]) {
      assert.equal(result.generationStatus, "success");
      assert.equal(result.semanticStatus, "generated_unreviewed");
      assert.equal(result.reviewRequired, true);
      assert.deepEqual(result.reviewChecklist, REVIEW_CHECKLIST);
      assert.match(result.reviewChecklist.join("\n"), /source performer.*absent/i);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("extracts task failure reason from failed task detail instead of outer success message", () => {
  assert.equal(
    extractTaskFailureSummary({
      code: 200,
      message: "success",
      data: {
        status: "fail",
        taskId: "tk-hiapi-failed",
        error: {
          code: "TASK_FAILED",
          message: "task failed",
        },
      },
    }),
    "TASK_FAILED: task failed",
  );
});

test("resolveConfig requires HIAPI_API_KEY and normalizes base URL", () => {
  assert.throws(
    () => resolveConfig({}),
    (error) => {
      assert.match(error.message, /No task was created/i);
      assert.match(error.message, /https:\/\/www\.hiapi\.ai\/en\/dashboard\/api-keys/);
      assert.match(error.message, /current shell.*persistent OS environment.*IDE\/CI secret store/i);
      assert.match(error.message, /never paste it into chat/i);
      assert.match(error.message, /node scripts\/check-config\.mjs/);
      assert.match(error.message, /references\/api\.md/);
      return true;
    },
  );

  assert.deepEqual(
    resolveConfig({
      HIAPI_API_KEY: "test-key",
      HIAPI_BASE_URL: "https://api.hiapi.ai/",
    }),
    {
      apiKey: "test-key",
      baseUrl: "https://api.hiapi.ai",
    },
  );
});

test("check-config never prints the key and rejects whitespace-only configuration", async () => {
  const script = fileURLToPath(new URL("../scripts/check-config.mjs", import.meta.url));
  const sentinel = "sentinel-key-must-not-appear";
  const configured = await execFileAsync(process.execPath, [script], {
    env: {
      ...process.env,
      HIAPI_API_KEY: sentinel,
      HIAPI_BASE_URL: "https://api.example.test",
    },
  });

  assert.match(configured.stdout, /available to this process.*presence only.*not authenticated/i);
  assert.doesNotMatch(`${configured.stdout}\n${configured.stderr}`, new RegExp(sentinel));

  await assert.rejects(
    () => execFileAsync(process.execPath, [script], {
      env: { ...process.env, HIAPI_API_KEY: "   " },
    }),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /No task was created/i);
      assert.match(error.stderr, /https:\/\/www\.hiapi\.ai\/en\/dashboard\/api-keys/);
      assert.match(error.stderr, /references\/api\.md/);
      assert.doesNotMatch(error.stderr, new RegExp(sentinel));
      return true;
    },
  );
});

test("buildHttpErrorMessage gives next actions for key, balance, image, rate, and task failures", () => {
  assert.match(
    buildHttpErrorMessage(401, { error: { message: "Invalid API key" } }),
    /create a new one: https:\/\/www\.hiapi\.ai\/en\/dashboard\/api-keys/,
  );
  assert.match(
    buildHttpErrorMessage(402, { error: { message: "insufficient balance" } }),
    /balance or credits may be insufficient/i,
  );
  assert.match(
    buildHttpErrorMessage(403, { error: { message: "token quota is not enough" } }),
    /balance or credits may be insufficient/i,
  );
  assert.match(
    buildHttpErrorMessage(400, { error: { message: "input_reference is invalid" } }),
    /media mode, reference counts, and reference audio\/video durations/i,
  );
  assert.match(
    buildHttpErrorMessage(429, { error: { message: "Too many requests" } }),
    /wait and retry/i,
  );
  assert.match(
    buildHttpErrorMessage(500, { error: { message: "task failed" } }),
    /try a clearer prompt or a different image/i,
  );
});

test("requestJson preserves explicit HTTP rejection metadata", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(
    JSON.stringify({ message: "moderation service unavailable" }),
    { status: 503, headers: { "content-type": "application/json" } },
  );

  try {
    await assert.rejects(
      () => requestJson("https://api.example.test/v1/tasks", { method: "POST" }),
      (error) => {
        assert.equal(error.httpStatus, 503);
        assert.deepEqual(error.httpResponse, { message: "moderation service unavailable" });
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("enables curl transport only when explicitly requested", () => {
  assert.equal(useCurlTransport({}), false);
  assert.equal(useCurlTransport({ HIAPI_USE_CURL: "1" }), true);
  assert.equal(useCurlTransport({ HIAPI_USE_CURL: "true" }), true);
  assert.equal(useCurlTransport({ HIAPI_USE_CURL: "0" }), false);
});

test("recognizes transient proxy and TLS failures without treating API errors as transient", () => {
  assert.equal(isTransientNetworkError(new Error("curl failed: SSL/TLS handshake failed")), true);
  assert.equal(isTransientNetworkError(new Error("fetch failed")), true);
  assert.equal(isTransientNetworkError(new Error("HTTP 401: invalid key")), false);
});

test("parseArgs reads an existing task id for resume", () => {
  assert.deepEqual(parseArgs(["--resume-task-id", "task-123"]), { resumeTaskId: "task-123" });
});

test("returns null when remote video download fails", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("fetch failed");
  };

  try {
    assert.equal(await saveVideoOutput("https://cdn.example.com/out.mp4"), null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("compares semver-like skill versions", () => {
  assert.equal(compareVersions("0.1.0", "0.1.0"), 0);
  assert.equal(compareVersions("0.2.0", "0.1.9"), 1);
  assert.equal(compareVersions("0.1.0", "0.2.0"), -1);
});

test("reports soft and required skill updates from the manifest", async () => {
  const manifest = {
    skills: [{
      id: "hiapi-reference-motion-transfer",
      version: "0.3.0",
      updatePolicy: {
        latestVersion: "0.3.0",
        minimumVersion: "0.2.0",
        updateCommand: "npx -y github:HiAPIAI/hiapi-skills -- hiapi-reference-motion-transfer -y",
        notice: "New version available.",
        requiredNotice: "Update required.",
      },
    }],
  };
  const fetchImpl = async () => new Response(JSON.stringify(manifest), { status: 200 });

  const required = await checkSkillUpdate({ currentVersion: "0.1.0", fetchImpl });
  assert.equal(required.status, "required");
  assert.match(required.message, /Update required/);
  assert.match(required.message, /Update now: npx -y github:HiAPIAI\/hiapi-skills -- hiapi-reference-motion-transfer -y/);

  const available = await checkSkillUpdate({ currentVersion: "0.2.0", fetchImpl });
  assert.equal(available.status, "available");
  assert.match(available.message, /New version available/);
});
