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
  "hiapi-seedance-2-0-video",
  "hiapi-happyhorse-1-0-video",
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
  "API Cookbook",
];

const requiredPublicEntryIds = [
  "prompt-galleries",
  "agent-skills",
  "remote-mcp",
  "api-cookbook",
];

const requiredDocs = [
  "docs/gpt-image-2.md",
  "docs/seedance-2-0.md",
  "docs/happyhorse-1-0.md",
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
    if (!skill.install?.openclaw?.includes(skill.repository)) {
      throw new Error(`${skill.id}.install.openclaw must reference its repository`);
    }
    if (!skill.install?.codex?.includes(skill.repository)) {
      throw new Error(`${skill.id}.install.codex must reference its repository`);
    }
    if (!skill.install?.claudeCode?.includes(skill.repository)) {
      throw new Error(`${skill.id}.install.claudeCode must reference its repository`);
    }
  }

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

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
