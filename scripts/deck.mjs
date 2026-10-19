// Shared configuration for scripts that communicate with the Deck (.env.deck).
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("..", import.meta.url));

export function deckConfig() {
  const file = join(root, ".env.deck");
  if (!existsSync(file)) {
    console.error("Missing .env.deck. Copy .env.deck.example and set your Deck's IP address.");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  if (!env.DECK_HOST) {
    console.error("DECK_HOST is not defined in .env.deck");
    process.exit(1);
  }
  const user = env.DECK_USER || "deck";
  const port = env.DECK_PORT || "22";
  // These values end up inside remote shell commands, so reject anything unexpected.
  if (!/^[A-Za-z0-9._:-]+$/.test(env.DECK_HOST) || !/^[A-Za-z0-9._-]+$/.test(user) || !/^\d+$/.test(port)) {
    console.error("DECK_HOST, DECK_USER or DECK_PORT contains unexpected characters.");
    process.exit(1);
  }
  const key = (env.DECK_KEY || join(homedir(), ".ssh", "voiddeck_deck")).replace(/^~/, homedir());
  return { host: env.DECK_HOST, user, port, key, target: `${user}@${env.DECK_HOST}` };
}

/** ssh/scp options: use the project key if present; never prompt in `batch` mode. */
export function sshOptions({ key }, { batch = false } = {}) {
  const opts = ["-o StrictHostKeyChecking=accept-new"];
  if (existsSync(key)) opts.push(`-i "${key}"`, "-o IdentitiesOnly=yes");
  if (batch) opts.push("-o BatchMode=yes");
  return opts.join(" ");
}

/** The same options as an argument list, so no shell ever parses the configured values. */
export function sshArgs({ key }, { batch = false } = {}) {
  const args = ["-o", "StrictHostKeyChecking=accept-new"];
  if (existsSync(key)) args.push("-i", key, "-o", "IdentitiesOnly=yes");
  if (batch) args.push("-o", "BatchMode=yes");
  return args;
}
