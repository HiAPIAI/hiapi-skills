#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { argv, env, exit, stdin } from "node:process";

const SKILLS = new Set(["hiapi-reference-motion-transfer"]);
const args = argv.slice(2);
const skill = args.find((arg) => !arg.startsWith("-"));
const yes = args.includes("-y") || args.includes("--yes") || !stdin.isTTY;

if (!SKILLS.has(skill)) {
  console.error("Usage: hiapi-skills hiapi-reference-motion-transfer [--codex|--claude|--target=/path] [-y]");
  exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "skills", skill);
const explicitTarget = flagValue("target") ?? flagValue("skills-dir") ?? env.AGENT_SKILLS_DIR;
const targets = explicitTarget
  ? [expandHome(explicitTarget)]
  : detectTargets();

if (!existsSync(source)) {
  console.error(`Embedded skill source is missing: ${source}`);
  exit(1);
}
if (targets.length === 0) {
  console.error("No agent skills directory detected. Pass --codex, --claude, or --target=/path/to/skills.");
  exit(1);
}

for (const target of targets) {
  mkdirSync(target, { recursive: true });
  const destination = join(target, skill);
  if (existsSync(destination)) {
    if (!yes) {
      console.error(`${destination} already exists. Rerun with -y to replace it.`);
      exit(1);
    }
    rmSync(destination, { recursive: true, force: true });
  }
  cpSync(source, destination, {
    recursive: true,
    filter: (path) => !["node_modules", "outputs", ".env"].includes(path.split(/[\\/]/).at(-1)),
  });
  console.log(`Installed ${skill} to ${destination}`);
}

if (!env.HIAPI_API_KEY?.trim()) {
  console.log("HIAPI_API_KEY is not set. Configure it outside chat, then restart the agent.");
  console.log("https://www.hiapi.ai/en/dashboard/api-keys");
}

function flagValue(name) {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) ?? null;
}

function expandHome(path) {
  return path.replace(/^~(?=$|[\\/])/, homedir());
}

function detectTargets() {
  if (args.includes("--codex")) return [join(env.CODEX_HOME || join(homedir(), ".codex"), "skills")];
  if (args.includes("--claude")) return [join(homedir(), ".claude", "skills")];

  const targets = [];
  const codex = join(env.CODEX_HOME || join(homedir(), ".codex"), "skills");
  const claude = join(homedir(), ".claude", "skills");
  if (existsSync(dirname(codex))) targets.push(codex);
  if (existsSync(dirname(claude))) targets.push(claude);
  if (targets.length > 1 && !yes) {
    console.error("Multiple agent directories detected. Pass --codex, --claude, --target, or -y.");
    exit(1);
  }
  return targets;
}
