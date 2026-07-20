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

test("validator rejects an index that omits the Seedream 5 Pro skill", (t) => {
  const fixture = mkdtempSync(join(tmpdir(), "hiapi-skills-validate-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));

  for (const file of ["README.md", "README.zh-CN.md", "llms-install.md", "LICENSE", "skills.json"]) {
    copyFileSync(join(repoRoot, file), join(fixture, file));
  }
  mkdirSync(join(fixture, "docs"));
  for (const file of [
    "gpt-image-2.md",
    "seedance-2-0.md",
    "happyhorse-1-0.md",
    "video-prompt-generator.md",
    "realistic-video-workflow.md",
  ]) {
    copyFileSync(join(repoRoot, "docs", file), join(fixture, "docs", file));
  }

  const indexPath = join(fixture, "skills.json");
  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  index.skills = index.skills.filter((skill) => skill.id !== "hiapi-seedream-5-0-pro");
  writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

  const result = spawnSync(process.execPath, [join(repoRoot, "scripts", "validate.mjs")], {
    cwd: fixture,
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing skill id: hiapi-seedream-5-0-pro/);
});
