// Prepara la carpeta del plugin tal como la espera Decky: out/<nombre>/ con dist, plugin.json, etc.
// La usan el despliegue a la Deck y el empaquetado de releases.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { root } from "./deck.mjs";

const FILES = ["dist", "plugin.json", "package.json", "main.py", "LICENSE", "README.md", "third_party"];

export function pluginName() {
  return JSON.parse(readFileSync(join(root, "plugin.json"), "utf8")).name;
}

/** Copia los archivos del plugin a out/<nombre> y devuelve esa ruta. Requiere `pnpm build` antes. */
export function stagePlugin() {
  if (!existsSync(join(root, "dist", "index.js"))) throw new Error("Falta dist/index.js: ejecuta pnpm build");
  const out = join(root, "out", pluginName());
  rmSync(join(root, "out"), { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const f of FILES) {
    if (existsSync(join(root, f))) cpSync(join(root, f), join(out, f), { recursive: true });
  }
  return out;
}
