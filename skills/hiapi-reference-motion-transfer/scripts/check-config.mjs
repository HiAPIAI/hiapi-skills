#!/usr/bin/env node
import { resolveConfig } from "./lib/seedance-2-video.mjs";
import { resolveFfmpegPath, resolveFfprobePath, runMediaCommand } from "./lib/media-files.mjs";

async function main() {
  if (process.argv.includes("--media") || process.argv.includes("--media-only")) {
    await checkMediaTools();
    if (process.argv.includes("--media-only")) return;
  }

  const config = resolveConfig();
  console.log("HIAPI_API_KEY is available to this process (presence only; not authenticated).");
  console.log(`Base URL: ${config.baseUrl}`);

  if (process.argv.includes("--live")) {
    const response = await fetch(`${config.baseUrl}/api/pricing`);
    if (!response.ok) throw new Error(`Live check failed: HTTP ${response.status}`);
    console.log("Live check reached the public HiAPI pricing endpoint.");
    console.log("This network check does not authenticate or validate the API key.");
  }
}

async function checkMediaTools() {
  const ffmpegPath = resolveFfmpegPath();
  await runMediaCommand(ffmpegPath, ["-version"]).catch((error) => {
    throw new Error(`FFmpeg is required for local media: ${error.message}`);
  });
  console.log(`FFmpeg: ${ffmpegPath}`);

  const ffprobePath = resolveFfprobePath();
  try {
    await runMediaCommand(ffprobePath, ["-version"]);
    console.log(`ffprobe: ${ffprobePath}`);
  } catch {
    console.log(`ffprobe unavailable at ${ffprobePath}; FFmpeg metadata fallback will be used.`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
