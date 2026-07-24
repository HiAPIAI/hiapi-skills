import { readdir, readFile } from "node:fs/promises";

const requiredFiles = [
  "README.md",
  "README.zh-CN.md",
  "llms-install.md",
  "skills.json",
  "LICENSE",
  "scripts/install-skill.mjs",
  "skills/hiapi-reference-motion-transfer/SKILL.md",
  "skills/hiapi-reference-motion-transfer/package.json",
];

const requiredSkillIds = [
  "hiapi-gpt-image-2",
  "hiapi-seedream-5-0-pro",
  "hiapi-seedance-2-0-video",
  "hiapi-reference-motion-transfer",
  "hiapi-happyhorse-1-0-video",
  "hiapi-video-prompt-generator",
  "realistic-video-prompting",
];

const requiredPublicLinks = [
  "https://github.com/HiAPIAI/awesome-gpt-image-2-prompts",
  "https://github.com/HiAPIAI/hiapi-skills",
  "https://mcp.hiapi.ai/mcp",
  "https://docs.hiapi.ai",
];

const requiredPositioning = [
  "Prompt Galleries",
  "Agent Skills",
  "Remote MCP",
  "Async Tasks API",
  "API Cookbook",
];

const requiredPublicEntryIds = [
  "prompt-galleries",
  "agent-skills",
  "remote-mcp",
  "async-tasks-api",
  "api-cookbook",
];

const requiredDocs = [
  "docs/gpt-image-2.md",
  "docs/seedance-2-0.md",
  "docs/happyhorse-1-0.md",
  "docs/video-prompt-generator.md",
  "docs/realistic-video-workflow.md",
];

const bannedReadmePhrases = [
  "The public surface is API-first",
  "HiAPI 的公开面",
];

async function main() {
  for (const file of [...requiredFiles, ...requiredDocs]) {
    const content = await readFile(file, "utf8");
    if (!content.trim()) {
      throw new Error(`${file} is empty`);
    }
  }

  const index = JSON.parse(await readFile("skills.json", "utf8"));
  if (!Array.isArray(index.skills)) {
    throw new Error("skills.json must contain a skills array");
  }
  if (!Array.isArray(index.publicEntries)) {
    throw new Error("skills.json must contain a publicEntries array");
  }
  if (!Array.isArray(index.bundles)) {
    throw new Error("skills.json must contain a bundles array");
  }
  assertUrl(index.website?.en, "website.en");
  assertUrl(index.website?.zh, "website.zh");
  assertUrl(index.apiKeys?.en, "apiKeys.en");
  assertUrl(index.apiKeys?.zh, "apiKeys.zh");
  assertUrl(index.pricing?.en, "pricing.en");
  assertUrl(index.pricing?.zh, "pricing.zh");
  assertUrl(index.docs, "docs");
  assertUrl(index.remoteMcp, "remoteMcp");
  for (const link of [
    "https://www.hiapi.ai/en/dashboard/api-keys",
    "https://www.hiapi.ai/zh/dashboard/api-keys",
  ]) {
    if (!Object.values(index.apiKeys || {}).includes(link)) {
      throw new Error(`skills.json apiKeys missing ${link}`);
    }
  }

  const ids = new Set(index.skills.map((skill) => skill.id));
  for (const id of requiredSkillIds) {
    if (!ids.has(id)) {
      throw new Error(`Missing skill id: ${id}`);
    }
  }

  const seedanceSkill = index.skills.find((skill) => skill.id === "hiapi-seedance-2-0-video");
  if (seedanceSkill?.model !== "seedance-2.0") {
    throw new Error("hiapi-seedance-2-0-video.model must use the canonical API id seedance-2.0");
  }
  if (
    seedanceSkill?.version !== "0.1.8"
    || seedanceSkill?.updatePolicy?.latestVersion !== "0.1.8"
    || seedanceSkill?.updatePolicy?.minimumVersion !== "0.1.8"
  ) {
    throw new Error("hiapi-seedance-2-0-video version policy must require 0.1.8");
  }

  const referenceSkill = index.skills.find((skill) => skill.id === "hiapi-reference-motion-transfer");
  const referencePath = "skills/hiapi-reference-motion-transfer";
  if (
    referenceSkill?.repository !== "https://github.com/HiAPIAI/hiapi-skills"
    || referenceSkill?.sourcePath !== referencePath
  ) {
    throw new Error("hiapi-reference-motion-transfer must be embedded in hiapi-skills");
  }
  const referencePackage = JSON.parse(await readFile(`${referencePath}/package.json`, "utf8"));
  if (referencePackage.version !== referenceSkill.version) {
    throw new Error("Embedded reference-motion package version must match skills.json");
  }
  const embeddedFiles = await listFiles(referencePath);
  const bannedEmbeddedNames = new Set([
    "motion.mp4",
    "motion-small.mp4",
    "replacement.jpg",
    "run-test.ps1",
    "resume-test.ps1",
  ]);
  if (embeddedFiles.some((file) => bannedEmbeddedNames.has(file.split("/").at(-1)))) {
    throw new Error("Embedded reference-motion skill contains local test material");
  }
  if (embeddedFiles.some((file) => file.startsWith("outputs/") || file.startsWith("tmp/"))) {
    throw new Error("Embedded reference-motion skill contains generated output or temp files");
  }

  const publicEntryIds = new Set(index.publicEntries.map((entry) => entry.id));
  for (const id of requiredPublicEntryIds) {
    if (!publicEntryIds.has(id)) {
      throw new Error(`Missing public entry id: ${id}`);
    }
  }

  for (const entry of index.publicEntries) {
    assertUrl(entry.url, `${entry.id}.url`);
    if (entry.id === "agent-skills" && /^install\b/iu.test(entry.useWhen || "")) {
      throw new Error("agent-skills.useWhen must describe choosing skills, not installing this directory as a skill");
    }
  }

  for (const skill of index.skills) {
    assertUrl(skill.repository, `${skill.id}.repository`);
    assertUrl(skill.modelPage.en, `${skill.id}.modelPage.en`);
    assertUrl(skill.modelPage.zh, `${skill.id}.modelPage.zh`);
    if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(skill.version || "")) {
      throw new Error(`${skill.id}.version must be a semver-like string`);
    }
    if (!skill.updatePolicy || typeof skill.updatePolicy !== "object") {
      throw new Error(`${skill.id}.updatePolicy is required`);
    }
    for (const field of ["latestVersion", "minimumVersion"]) {
      if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(skill.updatePolicy[field] || "")) {
        throw new Error(`${skill.id}.updatePolicy.${field} must be a semver-like string`);
      }
    }
    if (!skill.updatePolicy.updateCommand?.includes(skill.repository.replace("https://github.com/", "github:"))) {
      throw new Error(`${skill.id}.updatePolicy.updateCommand must reference its GitHub repository`);
    }
    if (!skill.updatePolicy.notice || !skill.updatePolicy.requiredNotice) {
      throw new Error(`${skill.id}.updatePolicy must include notice and requiredNotice`);
    }
    const repositorySpec = skill.repository.replace("https://github.com/", "github:");
    if (!referencesRepository(skill.install?.openclaw, skill.repository, repositorySpec)) {
      throw new Error(`${skill.id}.install.openclaw must reference its repository`);
    }
    if (!referencesRepository(skill.install?.codex, skill.repository, repositorySpec)) {
      throw new Error(`${skill.id}.install.codex must reference its repository`);
    }
    if (!referencesRepository(skill.install?.claudeCode, skill.repository, repositorySpec)) {
      throw new Error(`${skill.id}.install.claudeCode must reference its repository`);
    }
  }

  const realisticBundle = index.bundles.find((bundle) => bundle.id === "hiapi-realistic-video-workflow");
  if (!realisticBundle) {
    throw new Error("Missing bundle id: hiapi-realistic-video-workflow");
  }
  assertUrl(realisticBundle.repository, "hiapi-realistic-video-workflow.repository");
  if (!realisticBundle.installCommand?.includes("github:HiAPIAI/hiapi-realistic-video-workflow")) {
    throw new Error("hiapi-realistic-video-workflow.installCommand must reference its GitHub repository");
  }
  for (const skillId of ["realistic-video-prompting", "hiapi-seedance-2-0-video"]) {
    if (!realisticBundle.installs?.includes(skillId)) {
      throw new Error(`hiapi-realistic-video-workflow must install ${skillId}`);
    }
  }

  const readme = await readFile("README.md", "utf8");
  const readmeZh = await readFile("README.zh-CN.md", "utf8");
  const llmsInstall = await readFile("llms-install.md", "utf8");
  const embeddedUrl = "https://github.com/HiAPIAI/hiapi-skills/tree/main/skills/hiapi-reference-motion-transfer";
  if (!readme.includes(embeddedUrl) || !readmeZh.includes(embeddedUrl) || !llmsInstall.includes(embeddedUrl)) {
    throw new Error("Embedded reference-motion skill URL is missing from install documentation");
  }

  for (const phrase of bannedReadmePhrases) {
    if (readme.includes(phrase) || readmeZh.includes(phrase)) {
      throw new Error(`README contains internal-facing phrase: ${phrase}`);
    }
  }

  if (!readme.includes("Install One Skill") || !readmeZh.includes("安装一个 Skill")) {
    throw new Error("README install section must tell users to install one selected skill");
  }

  for (const skill of index.skills) {
    if (!readme.includes(skill.repository)) {
      throw new Error(`README.md missing ${skill.repository}`);
    }
    if (!readmeZh.includes(skill.repository)) {
      throw new Error(`README.zh-CN.md missing ${skill.repository}`);
    }
    if (!llmsInstall.includes(skill.repository)) {
      throw new Error(`llms-install.md missing ${skill.repository}`);
    }
  }
  if (!readme.includes(realisticBundle.repository) || !readmeZh.includes(realisticBundle.repository) || !llmsInstall.includes(realisticBundle.repository)) {
    throw new Error("README and llms-install must include the realistic video bundle repository");
  }

  for (const link of requiredPublicLinks) {
    if (!readme.includes(link)) {
      throw new Error(`README.md missing public link: ${link}`);
    }
    if (!readmeZh.includes(link)) {
      throw new Error(`README.zh-CN.md missing public link: ${link}`);
    }
    if (!llmsInstall.includes(link)) {
      throw new Error(`llms-install.md missing public link: ${link}`);
    }
  }

  for (const phrase of requiredPositioning) {
    if (!readme.includes(phrase)) {
      throw new Error(`README.md missing positioning phrase: ${phrase}`);
    }
  }

  for (const file of requiredDocs) {
    const content = await readFile(file, "utf8");
    for (const link of [
      "https://www.hiapi.ai/en/dashboard/api-keys",
      "https://www.hiapi.ai/zh/dashboard/api-keys",
    ]) {
      if (!content.includes(link)) {
        throw new Error(`${file} missing API key link: ${link}`);
      }
    }
  }

  console.log(`Validated ${index.skills.length} HiAPI skills.`);
}

async function listFiles(root, prefix = "") {
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(`${root}/${entry.name}`, relative));
    else files.push(relative);
  }
  return files;
}

function referencesRepository(command, repository, repositorySpec) {
  return command?.includes(repository) || command?.includes(repositorySpec);
}

function assertUrl(value, field) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname.includes(".")) {
      throw new Error("invalid");
    }
  } catch {
    throw new Error(`${field} must be an https URL`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
