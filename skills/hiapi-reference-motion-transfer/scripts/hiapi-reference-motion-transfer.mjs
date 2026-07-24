#!/usr/bin/env node
import { createHash } from "node:crypto";
import { buildVideoPayload, generateVideo, parseArgs, resolveConfig, resumeVideoTask, usage as seedanceUsage, warnOrRequireSkillUpdate } from "./lib/seedance-2-video.mjs";
import { prepareTransferOptions } from "./lib/motion-transfer.mjs";
import { appendLocalMedia } from "./lib/media-files.mjs";

function usage() {
  return `HiAPI Reference Motion Transfer

Usage:
  node scripts/hiapi-reference-motion-transfer.mjs --replacement-subject "new subject" --replacement-image-file IMAGE --reference-video-file VIDEO [options]

Transfer options:
  --mode replace|motion|camera|rhythm|balanced
                                      Replacement images default to strict replace

${seedanceUsage().replace(/^Usage:\s*/i, "Seedance options:\n")}`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  if (options.resumeTaskId) {
    await warnOrRequireSkillUpdate();
    const result = await resumeVideoTask(options.resumeTaskId, options, resolveConfig());
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  await appendLocalMedia(options);
  const mediaWarningCount = printWarnings(options.preflightWarnings);
  Object.assign(options, prepareTransferOptions(options));
  printWarnings(options.preflightWarnings, mediaWarningCount);
  const payload = buildVideoPayload(options);
  const payloadSummary = summarizePayload(payload);
  const preflightToken = createPreflightToken(options.mode, payloadSummary);

  if (options.dryRun) {
    console.log(JSON.stringify({
      transferMode: options.mode,
      preflightToken,
      preflightWarnings: options.preflightWarnings,
      referenceVideoMetadata: options.referenceVideoMetadata,
      replacementImageMetadata: options.replacementImageMetadata,
      payload: payloadSummary,
    }, null, 2));
    return;
  }

  if (options.mode === "replace" && options.confirmPreflight !== preflightToken) {
    throw new Error(
      "Strict replace requires a matching --confirm-preflight token. Run the same command with --dry-run, show the media facts, warnings, ratio, duration, storage, resolution, and payload to the user, then wait for explicit paid-generation approval before rerunning with the printed token. No task was created.",
    );
  }

  await warnOrRequireSkillUpdate();

  const result = await generateVideo(options, resolveConfig());
  console.log(JSON.stringify({ transferMode: options.mode, ...result }, null, 2));
}

function summarizePayload(payload) {
  const input = { ...(payload.input || {}) };
  const summary = { ...payload, input };
  for (const field of ["first_frame_url", "last_frame_url"]) {
    if (typeof input[field] === "string") input[field] = summarizeDataUri(input[field]);
  }
  for (const field of ["reference_image_urls", "reference_video_urls", "reference_audio_urls"]) {
    if (Array.isArray(input[field])) input[field] = input[field].map(summarizeDataUri);
  }
  return summary;
}

function createPreflightToken(mode, payloadSummary) {
  return createHash("sha256")
    .update(JSON.stringify({ transferMode: mode, payload: payloadSummary }))
    .digest("hex");
}

function summarizeDataUri(value) {
  const match = /^data:([^;,]+);base64,(.*)$/is.exec(value);
  if (!match) return value;
  return {
    kind: "inline-media",
    mimeType: match[1],
    bytes: Buffer.byteLength(match[2], "base64"),
    sha256: createHash("sha256").update(match[2], "base64").digest("hex"),
  };
}

function printWarnings(warnings = [], start = 0) {
  for (const warning of warnings.slice(start)) console.error(`Warning: ${warning}`);
  return warnings.length;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
