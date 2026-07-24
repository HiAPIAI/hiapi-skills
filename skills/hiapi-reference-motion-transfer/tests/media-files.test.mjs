import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { test } from "node:test";

import {
  appendLocalMedia,
  closestAspectRatio,
  needsVideoTranscode,
  pixelFormatHasAlpha,
  probeImageFile,
  probeVideoFile,
  transcodeVideoFile,
} from "../scripts/lib/media-files.mjs";

const VIDEO_FIXTURE = new URL("./fixtures/sample.mp4", import.meta.url);
const IMAGE_FIXTURE = new URL("./fixtures/sample.jpg", import.meta.url);

function probeResult(stream, duration) {
  return { stdout: JSON.stringify({ streams: [stream], format: duration ? { duration } : {} }) };
}

test("classifies compatible video and image formats", () => {
  assert.equal(needsVideoTranscode({ codec: "h264", pixelFormat: "yuv420p" }), false);
  assert.equal(needsVideoTranscode({ codec: "hevc", pixelFormat: "yuv420p" }), true);
  assert.equal(needsVideoTranscode({ codec: "h264", pixelFormat: "yuv444p" }), true);
  assert.equal(pixelFormatHasAlpha("rgba"), true);
  assert.equal(pixelFormatHasAlpha("yuv420p"), false);
  assert.equal(closestAspectRatio(240, 426), "9:16");
});

test("probes real video metadata through an injectable command runner", async () => {
  const metadata = await probeVideoFile(VIDEO_FIXTURE, {
    ffprobePath: "test-ffprobe",
    runCommand: async (command) => {
      assert.equal(command, "test-ffprobe");
      return probeResult({
        codec_type: "video",
        codec_name: "h264",
        pix_fmt: "yuv420p",
        width: 240,
        height: 426,
        avg_frame_rate: "24000/1001",
      }, "8.06");
    },
  });

  assert.deepEqual(metadata, {
    originalPath: metadata.originalPath,
    duration: 8.06,
    width: 240,
    height: 426,
    fps: 24000 / 1001,
    codec: "h264",
    pixelFormat: "yuv420p",
    aspectRatio: "9:16",
    transcoded: false,
  });
});

test("falls back to FFmpeg metadata when ffprobe is unavailable", async () => {
  const commands = [];
  const metadata = await probeVideoFile(VIDEO_FIXTURE, {
    ffprobePath: "missing-ffprobe",
    ffmpegPath: "test-ffmpeg",
    runCommand: async (command) => {
      commands.push(command);
      if (command === "missing-ffprobe") {
        const error = new Error("spawn missing-ffprobe ENOENT");
        error.code = "ENOENT";
        throw error;
      }
      return {
        stderr: [
          "Duration: 00:00:08.06, start: 0.000000, bitrate: 340 kb/s",
          "Stream #0:0: Video: mpeg4 (Simple Profile) (mp4v / 0x7634706D), yuv420p, 240x426, 24 fps, 24 tbr",
        ].join("\n"),
      };
    },
  });

  assert.deepEqual(commands, ["missing-ffprobe", "test-ffmpeg"]);
  assert.equal(metadata.duration, 8.06);
  assert.equal(metadata.codec, "mpeg4");
  assert.equal(metadata.pixelFormat, "yuv420p");
  assert.equal(metadata.width, 240);
  assert.equal(metadata.height, 426);
  assert.equal(metadata.aspectRatio, "9:16");
});

test("probes image dimensions and alpha support", async () => {
  const metadata = await probeImageFile(IMAGE_FIXTURE, {
    runCommand: async () => probeResult({
      codec_type: "video",
      codec_name: "png",
      pix_fmt: "rgba",
      width: 720,
      height: 1280,
    }),
  });
  assert.equal(metadata.width, 720);
  assert.equal(metadata.height, 1280);
  assert.equal(metadata.hasAlpha, true);
});

test("uses H.264/yuv420p FFmpeg output settings", async () => {
  let invocation;
  await transcodeVideoFile("input.mov", "output.mp4", {
    ffmpegPath: "test-ffmpeg",
    runCommand: async (command, args) => {
      invocation = { command, args };
    },
  });
  assert.equal(invocation.command, "test-ffmpeg");
  assert.deepEqual(invocation.args.slice(invocation.args.indexOf("-c:v"), invocation.args.indexOf("-movflags")), [
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
  ]);
});

test("appendLocalMedia transcodes incompatible video and inherits Video 1 ratio", async () => {
  const commands = [];
  const options = { referenceVideoFiles: [VIDEO_FIXTURE] };
  await appendLocalMedia(options, {
    ffmpegPath: "test-ffmpeg",
    ffprobePath: "test-ffprobe",
    runCommand: async (command, args) => {
      commands.push(command);
      const target = String(args.at(-1));
      if (command === "test-ffmpeg") {
        await writeFile(target, "converted video");
        return { stdout: "" };
      }
      if (target.includes("hiapi-reference-video-")) {
        return probeResult({
          codec_type: "video", codec_name: "h264", pix_fmt: "yuv420p",
          width: 240, height: 426, avg_frame_rate: "24/1",
        }, "8.06");
      }
      return probeResult({
        codec_type: "video", codec_name: "mpeg4", pix_fmt: "yuv420p",
        width: 240, height: 426, avg_frame_rate: "24/1",
      }, "8.06");
    },
  });

  assert.deepEqual(commands, ["test-ffprobe", "test-ffmpeg", "test-ffprobe"]);
  assert.equal(options.ratio, "9:16");
  assert.deepEqual(options.referenceVideoDurations, ["8.06"]);
  assert.equal(options.referenceVideoMetadata[0].transcoded, true);
  assert.equal(options.referenceVideoMetadata[0].sourceCodec, "mpeg4");
  assert.match(options.referenceVideoUrls[0], /^data:video\/mp4;base64,/);
  assert.equal("referenceVideoFiles" in options, false);
});

test("appendLocalMedia warns about opaque and conflicting replacement images", async () => {
  const warnings = [];
  const options = {
    replacementImageFiles: [IMAGE_FIXTURE],
    referenceVideoFiles: [VIDEO_FIXTURE],
  };
  await appendLocalMedia(options, {
    warn: (message) => warnings.push(message),
    runCommand: async (_command, args) => String(args.at(-1)).endsWith("sample.jpg")
      ? probeResult({ codec_type: "video", pix_fmt: "yuvj420p", width: 662, height: 397 })
      : probeResult({
        codec_type: "video", codec_name: "h264", pix_fmt: "yuv420p",
        width: 240, height: 426, avg_frame_rate: "24/1",
      }, "8.06"),
  });

  assert.equal(options.replacementImageMetadata[0].hasAlpha, false);
  assert.equal(options.preflightWarnings.length, 2);
  assert.equal(warnings.length, 2);
  assert.match(options.preflightWarnings[0], /clean neutral background/);
  assert.match(options.preflightWarnings[1], /conflicts with Video 1/);
});

test("warns when a local replacement image conflicts with a remote Video 1 ratio", async () => {
  const options = {
    replacementImageFiles: [IMAGE_FIXTURE],
    referenceVideoUrls: ["asset://remote-video"],
    referenceVideoDurations: [8],
    ratio: "9:16",
    subjectImageClean: true,
  };
  await appendLocalMedia(options, {
    runCommand: async () => probeResult({
      codec_type: "video", pix_fmt: "yuvj420p", width: 662, height: 397,
    }),
  });

  assert.equal(options.preflightWarnings.length, 1);
  assert.match(options.preflightWarnings[0], /declared Video 1 ratio 9:16/i);
});
