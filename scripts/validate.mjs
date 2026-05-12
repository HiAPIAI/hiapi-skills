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

async function main() {
  for (const file of requiredFiles) {
    const content = await readFile(file, "utf8");
    if (!content.trim()) {
      throw new Error(`${file} is empty`);
    }
  }

  const index = JSON.parse(await readFile("skills.json", "utf8"));
  if (!Array.isArray(index.skills)) {
    throw new Error("skills.json must contain a skills array");
  }

  const ids = new Set(index.skills.map((skill) => skill.id));
  for (const id of requiredSkillIds) {
    if (!ids.has(id)) {
      throw new Error(`Missing skill id: ${id}`);
    }
  }

  for (const skill of index.skills) {
    assertUrl(skill.repository, `${skill.id}.repository`);
    assertUrl(skill.modelPage.en, `${skill.id}.modelPage.en`);
    assertUrl(skill.modelPage.zh, `${skill.id}.modelPage.zh`);
    if (!skill.install?.openclaw?.includes(skill.repository)) {
      throw new Error(`${skill.id}.install.openclaw must reference its repository`);
    }
  }

  const readme = await readFile("README.md", "utf8");
  const readmeZh = await readFile("README.zh-CN.md", "utf8");
  const llmsInstall = await readFile("llms-install.md", "utf8");
  for (const skill of index.skills) {
    if (!readme.includes(skill.repository)) {
      throw new Error(`README.md missing ${skill.repository}`);
    }
    if (!readmeZh.includes(skill.repository)) {
      throw new Error(`README.zh-CN.md missing ${skill.repository}`);
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

  console.log(`Validated ${index.skills.length} HiAPI skills.`);
}

function assertUrl(value, field) {
  if (!/^https:\/\/.+/u.test(value || "")) {
    throw new Error(`${field} must be an https URL`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
