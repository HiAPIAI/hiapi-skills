import { readFile } from "node:fs/promises";

const requiredFiles = [
  "README.md",
  "README.zh-CN.md",
  "llms-install.md",
  "skills.json",
  "LICENSE",
];

const requiredSkillIds = [
  "hiapi-gpt-image-2",
  "hiapi-seedream-5-0-pro",
  "hiapi-seedance-2-5-video",
  "hiapi-seedance-2-0-video",
  "hiapi-happyhorse-1-0-video",
  "hiapi-video-prompt-generator",
  "realistic-video-prompting",
  "image-to-video-director",
  "awesome-ai-product-video-workflows",
  "hiapi-2d-to-3d-video",
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
  "docs/seedream-5-0-pro.md",
  "docs/seedance-2-0.md",
  "docs/seedance-2-5.md",
  "docs/happyhorse-1-0.md",
  "docs/video-prompt-generator.md",
  "docs/image-to-video-director.md",
  "docs/awesome-ai-product-video-workflows.md",
  "docs/hiapi-animation-forge.md",
  "docs/product-video-skills.md",
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

  const seedance25Skill = index.skills.find((skill) => skill.id === "hiapi-seedance-2-5-video");
  if (seedance25Skill?.model !== "seedance-2.5/*") {
    throw new Error("hiapi-seedance-2-5-video.model must represent the three seedance-2.5 capability IDs");
  }
  if (
    seedance25Skill?.version !== "1.1.0"
    || seedance25Skill?.updatePolicy?.latestVersion !== "1.1.0"
    || seedance25Skill?.updatePolicy?.minimumVersion !== "1.1.0"
  ) {
    throw new Error("hiapi-seedance-2-5-video version policy must require 1.1.0 for the mode-specific resolution contract");
  }
  for (const capability of ["text-to-video", "image-to-video", "reference-to-video", "task-recovery"]) {
    if (!seedance25Skill?.capabilities?.includes(capability)) {
      throw new Error(`hiapi-seedance-2-5-video missing capability ${capability}`);
    }
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
    if (skill.version !== null && !/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(skill.version || "")) {
      throw new Error(`${skill.id}.version must be a semver-like string`);
    }
    if (skill.updatePolicy !== null) {
      if (!skill.updatePolicy || typeof skill.updatePolicy !== "object") {
        throw new Error(`${skill.id}.updatePolicy must be an object or null`);
      }
      for (const field of ["latestVersion", "minimumVersion"]) {
        if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(skill.updatePolicy[field] || "")) {
          throw new Error(`${skill.id}.updatePolicy.${field} must be a semver-like string`);
        }
      }
      if (!commandReferencesRepository(skill.updatePolicy.updateCommand, skill.repository)) {
        throw new Error(`${skill.id}.updatePolicy.updateCommand must reference its GitHub repository`);
      }
      if (!skill.updatePolicy.notice || !skill.updatePolicy.requiredNotice) {
        throw new Error(`${skill.id}.updatePolicy must include notice and requiredNotice`);
      }
    }
    if (!commandReferencesRepository(skill.install?.openclaw, skill.repository)) {
      throw new Error(`${skill.id}.install.openclaw must reference its repository`);
    }
    if (!commandReferencesRepository(skill.install?.codex, skill.repository)) {
      throw new Error(`${skill.id}.install.codex must reference its repository`);
    }
    if (!commandReferencesRepository(skill.install?.claudeCode, skill.repository)) {
      throw new Error(`${skill.id}.install.claudeCode must reference its repository`);
    }
  }

  const productVideoBundle = index.bundles.find((bundle) => bundle.id === "hiapi-product-video-skills");
  if (!productVideoBundle) {
    throw new Error("Missing bundle id: hiapi-product-video-skills");
  }
  assertUrl(productVideoBundle.repository, "hiapi-product-video-skills.repository");
  if (productVideoBundle.status !== "release-candidate") {
    throw new Error("hiapi-product-video-skills must remain release-candidate until its public release gate passes");
  }
  for (const adapter of ["ugc-ad", "fashion-lookbook", "food-commercial", "product-spokesperson"]) {
    if (!productVideoBundle.adapters?.includes(adapter)) {
      throw new Error(`hiapi-product-video-skills missing adapter ${adapter}`);
    }
  }

  const realisticBundle = index.bundles.find((bundle) => bundle.id === "hiapi-realistic-video-workflow");
  if (!realisticBundle) {
    throw new Error("Missing bundle id: hiapi-realistic-video-workflow");
  }
  assertUrl(realisticBundle.repository, "hiapi-realistic-video-workflow.repository");
  if (realisticBundle.status !== "archived") {
    throw new Error("hiapi-realistic-video-workflow must be marked archived after bundle migration");
  }
  if (!realisticBundle.installCommand?.includes("github:HiAPIAI/hiapi-realistic-video-workflow")) {
    throw new Error("hiapi-realistic-video-workflow.installCommand must reference its GitHub repository");
  }
  for (const skillId of ["realistic-video-prompting", "hiapi-seedance-2-0-video"]) {
    if (!realisticBundle.installs?.includes(skillId)) {
      throw new Error(`hiapi-realistic-video-workflow must install ${skillId}`);
    }
  }
  const replacementCommands = realisticBundle.replacement?.installCommands;
  if (!Array.isArray(replacementCommands) || replacementCommands.length !== 2) {
    throw new Error("hiapi-realistic-video-workflow.replacement must contain two direct install commands");
  }
  for (const command of replacementCommands) {
    if (!command.includes("github:HiAPIAI/") || command.includes("hiapi-realistic-video-workflow")) {
      throw new Error("hiapi-realistic-video-workflow replacement commands must install the independent skills");
    }
  }
  assertUrl(realisticBundle.replacement?.documentation, "hiapi-realistic-video-workflow.replacement.documentation");

  const readme = await readFile("README.md", "utf8");
  const readmeZh = await readFile("README.zh-CN.md", "utf8");
  const llmsInstall = await readFile("llms-install.md", "utf8");

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
  for (const bundle of index.bundles) {
    for (const [file, content] of [
      ["README.md", readme],
      ["README.zh-CN.md", readmeZh],
      ["llms-install.md", llmsInstall],
    ]) {
      if (!content.includes(bundle.repository)) {
        throw new Error(`${file} missing bundle repository ${bundle.repository}`);
      }
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

function commandReferencesRepository(command, repository) {
  if (typeof command !== "string") return false;
  const slug = repository.replace("https://github.com/", "");
  return command.includes(repository) || command.includes(`github:${slug}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
