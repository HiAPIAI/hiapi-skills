import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

export const MAX_LOCAL_MEDIA_BYTES = 180 * 1024 * 1024;

const execFileAsync = promisify(execFile);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const OUTPUT_ASPECT_RATIOS = [
  ["16:9", 16 / 9],
  ["9:16", 9 / 16],
  ["1:1", 1],
  ["4:3", 4 / 3],
  ["3:4", 3 / 4],
  ["21:9", 21 / 9],
];

const MIME_TYPES = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".mp4", "video/mp4"],
  [".mov", "video/quicktime"],
  [".webm", "video/webm"],
  [".mp3", "audio/mpeg"],
  [".wav", "audio/wav"],
  [".m4a", "audio/mp4"],
]);

export async function runMediaCommand(command, args) {
  return execFileAsync(command, args, {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true,
  });
}

export function closestAspectRatio(width, height) {
  const ratio = Number(width) / Number(height);
  if (!Number.isFinite(ratio) || ratio <= 0) throw new Error("Media dimensions must be positive numbers.");
  return OUTPUT_ASPECT_RATIOS.reduce((best, candidate) =>
    Math.abs(Math.log(candidate[1] / ratio)) < Math.abs(Math.log(best[1] / ratio)) ? candidate : best
  )[0];
}

export function pixelFormatHasAlpha(pixelFormat = "") {
  return /^(?:rgba|bgra|argb|abgr|ya\d*|yuva|gbrap|pal8)/i.test(String(pixelFormat));
}

export function needsVideoTranscode({ codec, pixelFormat } = {}) {
  return String(codec).toLowerCase() !== "h264" || String(pixelFormat).toLowerCase() !== "yuv420p";
}

export function resolveFfmpegPath(env = process.env) {
  return env.HIAPI_FFMPEG_PATH || "ffmpeg";
}

export function resolveFfprobePath(env = process.env) {
  return env.HIAPI_FFPROBE_PATH || siblingFfprobePath(env) || "ffprobe";
}

export async function probeVideoFile(filePath, dependencies = {}) {
  const path = await validateLocalFile(filePath, VIDEO_EXTENSIONS);
  const probe = await probeFile(path, dependencies);
  const stream = probe.streams?.find((item) => item.codec_type === "video") || probe.streams?.[0];
  if (!stream) throw new Error(`No video stream found in local reference: ${path}`);

  const dimensions = displayDimensions(stream);
  const duration = finiteNumber(stream.duration) ?? finiteNumber(probe.format?.duration);
  if (!duration || duration <= 0) throw new Error(`Could not read a positive video duration from: ${path}`);

  return {
    originalPath: path,
    duration,
    width: dimensions.width,
    height: dimensions.height,
    fps: parseFrameRate(stream.avg_frame_rate || stream.r_frame_rate),
    codec: String(stream.codec_name || "unknown").toLowerCase(),
    pixelFormat: String(stream.pix_fmt || "unknown").toLowerCase(),
    aspectRatio: closestAspectRatio(dimensions.width, dimensions.height),
    transcoded: false,
  };
}

export async function probeImageFile(filePath, dependencies = {}) {
  const path = await validateLocalFile(filePath, IMAGE_EXTENSIONS);
  const probe = await probeFile(path, dependencies);
  const stream = probe.streams?.find((item) => item.codec_type === "video") || probe.streams?.[0];
  const width = Number(stream?.width);
  const height = Number(stream?.height);
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    throw new Error(`Could not read image dimensions from: ${path}`);
  }
  return {
    path,
    width,
    height,
    hasAlpha: pixelFormatHasAlpha(stream.pix_fmt),
  };
}

export async function transcodeVideoFile(inputPath, outputPath, dependencies = {}) {
  const runCommand = dependencies.runCommand || runMediaCommand;
  const ffmpegPath = dependencies.ffmpegPath || resolveFfmpegPath();
  const args = [
    "-hide_banner", "-loglevel", "error", "-y", "-i", inputPath,
    "-map", "0:v:0", "-map", "0:a?",
    "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    "-c:a", "aac", outputPath,
  ];
  await invokeMediaTool(runCommand, ffmpegPath, args, "transcode video");
  return outputPath;
}

export async function fileToDataUri(filePath) {
  const path = normalizePath(filePath);
  const extension = extname(path).toLowerCase();
  const mimeType = MIME_TYPES.get(extension);
  if (!mimeType) {
    throw new Error(`Unsupported local media type "${extension || "unknown"}" for ${path}.`);
  }

  await validateFileSize(path);
  const bytes = await readFile(path);
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

export async function appendLocalMedia(options, dependencies = {}) {
  const initialVideoUrlCount = (options.referenceVideoUrls || []).length;
  const replacementImages = await appendImageFiles(options, "replacementImageFiles", "replacementImageUrls", dependencies);
  const referenceImages = await appendImageFiles(options, "referenceImageFiles", "referenceImageUrls", dependencies);
  const videos = await appendVideoFiles(options, dependencies);
  await appendFiles(options, "referenceAudioFiles", "referenceAudioUrls");

  if (replacementImages.length > 0) options.replacementImageMetadata = replacementImages;
  if (referenceImages.length > 0) options.referenceImageMetadata = referenceImages;
  if (videos.length > 0) {
    options.referenceVideoMetadata = videos;
    const declaredDurations = listValues(options.referenceVideoDurations);
    options.referenceVideoDurations = [
      ...declaredDurations.slice(0, initialVideoUrlCount),
      ...videos.map((video) => String(video.duration)),
    ];
    if (initialVideoUrlCount === 0 && !options.ratio) options.ratio = videos[0].aspectRatio;
  }

  addReplacementWarnings(options, initialVideoUrlCount === 0 ? videos[0] : undefined, replacementImages, dependencies.warn);
  return options;
}

async function appendVideoFiles(options, dependencies) {
  const files = options.referenceVideoFiles || [];
  const metadata = [];
  for (const file of files) {
    const prepared = await prepareVideo(file, dependencies);
    options.referenceVideoUrls = [...(options.referenceVideoUrls || []), prepared.dataUri];
    metadata.push(prepared.metadata);
  }
  if (files.length > 0) delete options.referenceVideoFiles;
  return metadata;
}

async function prepareVideo(filePath, dependencies) {
  const source = await probeVideoFile(filePath, dependencies);
  if (!needsVideoTranscode(source)) {
    return { dataUri: await fileToDataUri(source.originalPath), metadata: source };
  }

  const tempDirectory = await mkdtemp(join(tmpdir(), "hiapi-reference-video-"));
  const outputPath = join(tempDirectory, `${basename(source.originalPath, extname(source.originalPath))}-h264.mp4`);
  try {
    await transcodeVideoFile(source.originalPath, outputPath, dependencies);
    const converted = await probeVideoFile(outputPath, dependencies);
    if (needsVideoTranscode(converted)) {
      throw new Error(`FFmpeg output is not H.264/yuv420p: ${outputPath}`);
    }
    return {
      dataUri: await fileToDataUri(outputPath),
      metadata: {
        ...converted,
        originalPath: source.originalPath,
        transcoded: true,
        sourceCodec: source.codec,
        sourcePixelFormat: source.pixelFormat,
      },
    };
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
}

async function appendImageFiles(options, fileKey, urlKey, dependencies) {
  const files = options[fileKey] || [];
  const metadata = [];
  for (const file of files) {
    const image = await probeImageFile(file, dependencies);
    options[urlKey] = [...(options[urlKey] || []), await fileToDataUri(image.path)];
    metadata.push(image);
  }
  if (files.length > 0) delete options[fileKey];
  return metadata;
}

async function appendFiles(options, fileKey, urlKey) {
  const files = options[fileKey] || [];
  if (files.length === 0) return;
  const dataUris = await Promise.all(files.map(fileToDataUri));
  options[urlKey] = [...(options[urlKey] || []), ...dataUris];
  delete options[fileKey];
}

async function probeFile(path, dependencies) {
  const runCommand = dependencies.runCommand || runMediaCommand;
  const ffprobePath = dependencies.ffprobePath || resolveFfprobePath();
  let result;
  try {
    result = await runCommand(ffprobePath, ["-v", "error", "-show_streams", "-show_format", "-of", "json", path]);
  } catch (error) {
    if (isMissingCommand(error)) return probeFileWithFfmpeg(path, dependencies);
    throw mediaToolError("inspect media", ffprobePath, error);
  }
  try {
    return JSON.parse(typeof result === "string" ? result : String(result?.stdout || ""));
  } catch {
    throw new Error(`ffprobe returned invalid JSON for: ${path}`);
  }
}

async function probeFileWithFfmpeg(path, dependencies) {
  const runCommand = dependencies.runCommand || runMediaCommand;
  const ffmpegPath = dependencies.ffmpegPath || resolveFfmpegPath();
  const result = await invokeMediaTool(
    runCommand,
    ffmpegPath,
    ["-nostdin", "-hide_banner", "-i", path, "-map", "0:v:0", "-frames:v", "1", "-f", "null", "-"],
    "inspect media",
  );
  return parseFfmpegProbeOutput(String(result?.stderr || result?.stdout || result || ""), path);
}

function parseFfmpegProbeOutput(output, path) {
  const videoLine = output.split(/\r?\n/).find((line) => /\bVideo:\s*/i.test(line));
  const dimensions = videoLine?.match(/,\s*(\d{2,6})x(\d{2,6})(?=[\s,\[])/);
  const details = videoLine?.slice(videoLine.search(/\bVideo:\s*/i) + 6) || "";
  const codec = details.match(/^\s*([a-z0-9_]+)/i)?.[1];
  const pixelFormat = details.split(",")[1]?.trim().match(/^([a-z0-9_]+)/i)?.[1];
  if (!videoLine || !codec || !pixelFormat || !dimensions) {
    throw new Error(`FFmpeg could not read video codec, pixel format, and dimensions from: ${path}`);
  }

  const duration = output.match(/Duration:\s*(\d+):(\d+):([\d.]+)/i);
  const fps = videoLine.match(/,\s*([\d.]+)\s*fps\b/i)?.[1] || "0";
  const rotation = output.match(/rotation of\s+(-?[\d.]+)\s+degrees/i)?.[1];
  return {
    streams: [{
      codec_type: "video",
      codec_name: codec,
      pix_fmt: pixelFormat,
      width: Number(dimensions[1]),
      height: Number(dimensions[2]),
      avg_frame_rate: `${fps}/1`,
      ...(rotation ? { side_data_list: [{ rotation: Number(rotation) }] } : {}),
    }],
    format: duration ? {
      duration: Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]),
    } : {},
  };
}

async function invokeMediaTool(runCommand, command, args, action) {
  try {
    return await runCommand(command, args);
  } catch (error) {
    throw mediaToolError(action, command, error);
  }
}

function mediaToolError(action, command, error) {
  const detail = String(error?.stderr || error?.message || error).trim();
  return new Error(
    `Unable to ${action} with "${command}"${detail ? `: ${detail}` : "."} ` +
    "Install FFmpeg or set HIAPI_FFMPEG_PATH. Set HIAPI_FFPROBE_PATH when ffprobe is installed separately.",
    { cause: error },
  );
}

function isMissingCommand(error) {
  return error?.code === "ENOENT" || /\bENOENT\b|not recognized as an internal or external command/i.test(String(error?.message || error));
}

async function validateLocalFile(filePath, allowedExtensions) {
  const path = normalizePath(filePath);
  const extension = extname(path).toLowerCase();
  if (!allowedExtensions.has(extension)) {
    throw new Error(`Unsupported local media type "${extension || "unknown"}" for ${path}.`);
  }
  await validateFileSize(path);
  return path;
}

async function validateFileSize(path) {
  const info = await stat(path);
  if (!info.isFile()) throw new Error(`Local media path is not a file: ${path}`);
  if (info.size > MAX_LOCAL_MEDIA_BYTES) {
    throw new Error(`Local media file is too large: ${path}. Keep each file at or below 180 MiB, or upload it and pass a URL.`);
  }
}

function normalizePath(filePath) {
  return filePath instanceof URL ? fileURLToPath(filePath) : resolve(String(filePath));
}

function siblingFfprobePath(env) {
  const ffmpegPath = env.HIAPI_FFMPEG_PATH;
  if (!ffmpegPath || (!ffmpegPath.includes("/") && !ffmpegPath.includes("\\"))) return "";
  const extension = extname(ffmpegPath);
  return join(dirname(ffmpegPath), `ffprobe${extension}`);
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function parseFrameRate(value) {
  const [numerator, denominator = "1"] = String(value || "0").split("/").map(Number);
  const fps = numerator / denominator;
  return Number.isFinite(fps) && fps > 0 ? fps : 0;
}

function displayDimensions(stream) {
  let width = Number(stream.width);
  let height = Number(stream.height);
  const rotation = Number(
    stream.tags?.rotate ?? stream.side_data_list?.find((item) => item.rotation !== undefined)?.rotation ?? 0,
  );
  if (Math.abs(rotation) % 180 === 90) [width, height] = [height, width];
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    throw new Error("ffprobe did not return valid video dimensions.");
  }
  return { width, height };
}

function listValues(value) {
  if (value === undefined || value === null || value === "") return [];
  return (Array.isArray(value) ? value : [value]).flatMap((item) => String(item).split(",")).map((item) => item.trim()).filter(Boolean);
}

function addReplacementWarnings(options, video, images, warn = () => {}) {
  const warnings = [];
  if (images.length === 1 && !images[0].hasAlpha && options.subjectImageClean !== true) {
    warnings.push("The replacement image has no detected alpha channel. Use a clean neutral background, a transparent cutout, or multiple subject views before submission.");
  }
  const targetRatio = video ? video.width / video.height : parseAspectRatio(options.ratio);
  if (targetRatio) {
    for (const [index, image] of images.entries()) {
      const imageRatio = image.width / image.height;
      if (Math.abs(Math.log(imageRatio / targetRatio)) > 0.1) {
        warnings.push(video
          ? `Replacement image ${index + 1} (${image.width}x${image.height}) conflicts with Video 1 (${video.width}x${video.height}); crop or pad it toward ${video.aspectRatio}.`
          : `Replacement image ${index + 1} (${image.width}x${image.height}) conflicts with the declared Video 1 ratio ${options.ratio}; crop or pad it before submission.`);
      }
    }
  }
  if (warnings.length === 0) return;
  options.preflightWarnings = [...(options.preflightWarnings || []), ...warnings];
  for (const warning of warnings) warn(`Media preflight warning: ${warning}`);
}

function parseAspectRatio(value) {
  const match = /^(\d+):(\d+)$/.exec(String(value || ""));
  if (!match) return 0;
  return Number(match[1]) / Number(match[2]);
}
