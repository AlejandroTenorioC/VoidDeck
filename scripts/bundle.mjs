// Prepare the plugin directory as Decky expects: out/<name>/ with dist, plugin.json, etc.
// Used by deployment to the Deck and release packaging.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { root } from "./deck.mjs";

const FILES = ["dist", "plugin.json", "package.json", "main.py", "LICENSE", "README.md", "third_party"];

export function pluginName() {
  return JSON.parse(readFileSync(join(root, "plugin.json"), "utf8")).name;
}

/** Copy plugin files to out/<name> and return that path. Requires `pnpm build` first. */
export function stagePlugin() {
  if (!existsSync(join(root, "dist", "index.js"))) throw new Error("Missing dist/index.js: run pnpm build");
  const out = join(root, "out", pluginName());
  rmSync(join(root, "out"), { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const f of FILES) {
    if (existsSync(join(root, f))) cpSync(join(root, f), join(out, f), { recursive: true });
  }
  // The source map is development-only data; the release ships the bundle alone.
  rmSync(join(out, "dist", "index.js.map"), { force: true });
  return out;
}
