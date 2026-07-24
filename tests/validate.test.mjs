import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const requiredDocs = [
  "gpt-image-2.md",
  "seedance-2-0.md",
  "happyhorse-1-0.md",
  "food-commercial-video.md",
  "video-prompt-generator.md",
  "realistic-video-workflow.md",
];

function runValidator(t, mutateIndex) {
  const fixture = mkdtempSync(join(tmpdir(), "hiapi-skills-validate-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));

  for (const file of ["README.md", "README.zh-CN.md", "llms-install.md", "LICENSE", "skills.json"]) {
    copyFileSync(join(repoRoot, file), join(fixture, file));
  }
  mkdirSync(join(fixture, "docs"));
  for (const file of requiredDocs) {
    copyFileSync(join(repoRoot, "docs", file), join(fixture, "docs", file));
  }

  const indexPath = join(fixture, "skills.json");
  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  mutateIndex(index);
  writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  return spawnSync(process.execPath, [join(repoRoot, "scripts", "validate.mjs")], {
    cwd: fixture,
    encoding: "utf8",
  });
}

test("validator rejects an index that omits the Seedream 5 Pro skill", (t) => {
  const result = runValidator(t, (index) => {
    index.skills = index.skills.filter((skill) => skill.id !== "hiapi-seedream-5-0-pro");
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing skill id: hiapi-seedream-5-0-pro/);
});

test("validator rejects an index that omits Food Commercial Video", (t) => {
  const result = runValidator(t, (index) => {
    index.skills = index.skills.filter((skill) => skill.id !== "hiapi-food-commercial-video");
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing skill id: hiapi-food-commercial-video/);
});

test("validator rejects duplicate Food Commercial Video routes", (t) => {
  const result = runValidator(t, (index) => {
    const skill = index.skills.find((item) => item.id === "hiapi-food-commercial-video");
    skill.models.push(skill.models[0]);
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must declare its three fixed model routes/);
});

test("validator rejects an incorrect Food Commercial Video version", (t) => {
  const result = runValidator(t, (index) => {
    const skill = index.skills.find((item) => item.id === "hiapi-food-commercial-video");
    skill.version = "0.1.1";
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /version policy must require 0.1.0/);
});
