export const TRANSFER_MODES = new Set(["replace", "motion", "camera", "rhythm", "balanced"]);

const MODE_INSTRUCTIONS = {
  motion: "Use only the action order, movement direction, pose transitions, and performance timing from Video 1. Adapt the movement to the replacement subject's real anatomy and physically plausible locomotion; do not force human limb mechanics onto a non-human subject.",
  camera: "Use the framing, camera path, camera speed, and reveal pattern from Video 1. Preserve the replacement subject throughout the shot and do not restore the source performer.",
  rhythm: "Use the action density, pauses, accelerations, beat timing, and reveal cadence from Video 1. Rebuild those beats with the replacement subject and requested scene.",
  balanced: "Use Video 1 as temporal guidance for the main action, camera movement, and pacing. Prioritize a coherent result with the replacement subject over frame-exact imitation.",
};

export function normalizeTransferMode(value = "balanced") {
  const mode = String(value).trim().toLowerCase();
  if (!TRANSFER_MODES.has(mode)) {
    throw new Error(`Unsupported transfer mode "${value}". Use one of: ${Array.from(TRANSFER_MODES).join(", ")}.`);
  }
  return mode;
}

export function resolveTransferMode(value, replacementImageCount = 0) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return replacementImageCount > 0 ? "replace" : "balanced";
  }
  return normalizeTransferMode(value);
}

export function prepareReplacementInputs(options = {}) {
  const replacementImages = normalizeList(options.replacementImageUrls);
  const otherImages = normalizeList(options.referenceImageUrls);
  return {
    ...options,
    replacementImageCount: replacementImages.length,
    secondaryReferenceImageCount: otherImages.length,
    referenceImageUrls: [...replacementImages, ...otherImages],
  };
}

export function prepareTransferOptions(options = {}) {
  const prepared = prepareReplacementInputs(options);
  prepared.mode = resolveTransferMode(prepared.mode, prepared.replacementImageCount);
  prepared.preflightWarnings = [...(prepared.preflightWarnings || [])];

  if (prepared.mode === "replace") applyStrictReplaceDefaults(prepared);
  prepared.prompt = buildTransferPrompt(prepared);
  return prepared;
}

export function buildTransferPrompt({
  prompt,
  mode = "balanced",
  referenceVideoUrls,
  replacementImageCount = 0,
  replacementSubject,
} = {}) {
  const cleanPrompt = String(prompt || "").trim();
  const videos = normalizeList(referenceVideoUrls);
  if (videos.length === 0) throw new Error("At least one --reference-video-url or --reference-video-file is required for reference motion transfer.");

  const normalizedMode = normalizeTransferMode(mode);
  const subject = String(replacementSubject || "the requested new subject").trim();
  if (normalizedMode === "replace") {
    if (replacementImageCount === 0) {
      throw new Error("Strict replace mode requires --replacement-image-file or --replacement-image-url.");
    }
    if (!String(replacementSubject || "").trim()) {
      throw new Error("Strict replace mode requires --replacement-subject so the model can name the target subject unambiguously.");
    }
    const imageRange = replacementImageCount > 1
      ? `Images 1 through ${replacementImageCount}`
      : "Image 1";
    return [
      "Perform a strict subject-replacement edit of Video 1.",
      `Replace only the primary performer or main subject in Video 1 with ${subject} from ${imageRange}.`,
      "Preserve Video 1 as the source timeline: keep its background, location, props, lighting, framing, camera path, camera speed, shot order, action order, action timing, rhythm, composition, and duration.",
      `Use ${imageRange} only for the replacement subject's appearance, species, body shape, proportions, colors, and markings. Ignore the image background, pose, camera angle, lighting, and scenery.`,
      "The source performer must not appear in any frame. Do not add a new location, alternate scene, cutaway, or unrelated action.",
      "For cross-species replacement, preserve the action intent, direction, sequence, timing, and contact events while adapting gait, balance, contact points, and limb use to plausible target anatomy.",
      "This is reference-driven generative editing, so prioritize the requested one-subject edit and avoid unrelated creative changes.",
    ].join(" ");
  }

  if (!cleanPrompt) throw new Error("A prompt describing the new subject and scene is required.");
  const replacementDirection = replacementImageCount > 0
    ? `Image 1${replacementImageCount > 1 ? ` through Image ${replacementImageCount}` : ""} defines ${subject}. Completely replace every performer or main subject from Video 1 with ${subject}. The source performer must not appear in any frame. Preserve the replacement subject's identity, species, body shape, markings, and proportions from the replacement image.`
    : `Completely replace every performer or main subject from Video 1 with ${subject}. The source performer must not appear in any frame.`;
  const extraReferences = videos.length > 1
    ? ` Use Videos 2-${videos.length} only as secondary references; resolve conflicts in favor of Video 1.`
    : "";

  return `${cleanPrompt}\n\nReplacement direction: ${replacementDirection}\nReference direction: ${MODE_INSTRUCTIONS[normalizedMode]} Do not copy the source person's identity, face, clothing, or body.${extraReferences}`;
}

function applyStrictReplaceDefaults(options) {
  const videos = normalizeList(options.referenceVideoUrls);
  if (videos.length !== 1) {
    throw new Error("Strict replace mode requires exactly one primary reference video so scene, action, camera, and composition have a single source of truth.");
  }
  if (options.secondaryReferenceImageCount > 0) {
    throw new Error("Strict replace mode accepts only replacement-subject images. Remove --reference-image-* inputs that could compete with the subject or scene.");
  }
  if (normalizeList(options.referenceAudioUrls).length > 0) {
    throw new Error("Strict replace mode does not accept separate reference audio because it can compete with Video 1's timing. Remove --reference-audio-* inputs.");
  }
  if (String(options.prompt || "").trim()) {
    options.preflightWarnings.push(
      "Strict replace mode ignored --prompt so it cannot introduce a new scene, action, camera direction, or composition. Describe the target only with --replacement-subject and replacement images.",
    );
  }

  const imageMetadata = normalizeList(options.replacementImageMetadata);
  const hasTransparentSubjectImage = imageMetadata.some((image) => image?.hasAlpha === true);
  if (options.replacementImageCount < 2 && !hasTransparentSubjectImage && options.subjectImageClean !== true) {
    throw new Error(
      "Strict replace mode requires either a transparent replacement image, at least two replacement images showing multiple views, or --subject-image-clean to confirm the single image has a clean neutral background.",
    );
  }

  const videoMetadata = normalizeList(options.referenceVideoMetadata)[0];
  if (videoMetadata?.aspectRatio) {
    if (options.ratio && options.ratio !== videoMetadata.aspectRatio) {
      throw new Error(
        `Strict replace mode must preserve Video 1's ${videoMetadata.aspectRatio} aspect ratio; received --ratio ${options.ratio}. Use another mode when reframing is intentional.`,
      );
    }
    options.ratio = videoMetadata.aspectRatio;
  } else if (!options.ratio || options.ratio === "adaptive") {
    throw new Error("Strict replace mode could not inspect Video 1's aspect ratio. Provide its explicit fixed --ratio when using a remote reference video.");
  }

  const duration = videoMetadata?.duration ?? Number(normalizeList(options.referenceVideoDurations)[0]);
  if (Number.isFinite(duration)) {
    const outputSeconds = Math.max(4, Math.round(duration));
    if (options.seconds && Number(options.seconds) !== outputSeconds) {
      throw new Error(
        `Strict replace mode must preserve Video 1's timing with --seconds ${outputSeconds}; received --seconds ${options.seconds}. Use another mode when retiming is intentional.`,
      );
    }
    options.seconds = String(outputSeconds);
    if (outputSeconds !== Math.round(duration)) {
      options.preflightWarnings.push(
        `Video 1 is ${duration} seconds, but Seedance output must be at least 4 seconds. Output duration was set to 4 seconds.`,
      );
    }
  }

  if (imageMetadata.length < options.replacementImageCount) {
    options.preflightWarnings.push(
      "One or more remote replacement images could not be inspected for dimensions, alpha, or background cleanliness. Verify their crop and orientation against Video 1 before submission.",
    );
  }
}

function normalizeList(value) {
  if (value === undefined || value === null || value === "") return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}
