// Configuración compartida de los scripts que hablan con la Deck (.env.deck).
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("..", import.meta.url));

export function deckConfig() {
  const file = join(root, ".env.deck");
  if (!existsSync(file)) {
    console.error("Falta .env.deck. Copia .env.deck.example y pon la IP de tu Deck.");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  if (!env.DECK_HOST) {
    console.error("DECK_HOST no está definido en .env.deck");
    process.exit(1);
  }
  const user = env.DECK_USER || "deck";
  const key = (env.DECK_KEY || join(homedir(), ".ssh", "voiddeck_deck")).replace(/^~/, homedir());
  return { host: env.DECK_HOST, user, port: env.DECK_PORT || "22", key, target: `${user}@${env.DECK_HOST}` };
}

/** Opciones de ssh/scp: usa la clave del proyecto si existe; nunca pregunta en modo `batch`. */
export function sshOptions({ key }, { batch = false } = {}) {
  const opts = ["-o StrictHostKeyChecking=accept-new"];
  if (existsSync(key)) opts.push(`-i "${key}"`, "-o IdentitiesOnly=yes");
  if (batch) opts.push("-o BatchMode=yes");
  return opts.join(" ");
}
