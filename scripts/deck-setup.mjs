// One-time Deck configuration for password-free deployment (asks for the password one final time).
// - Authorizes the project's SSH key (DECK_KEY in .env.deck).
// - Installs /etc/voiddeck/deploy.sh and the /etc/sudoers.d/zz-voiddeck rule.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { deckConfig, root, sshOptions } from "./deck.mjs";

const cfg = deckConfig();
const { target, port, key } = cfg;
const opts = sshOptions(cfg);
const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: root });
const pub = readFileSync(`${key}.pub`, "utf8").trim();
const setup = join(root, "scripts", "deck-setup");

console.log("→ Copying files to the Deck (Deck password)");
run(`scp ${opts} -P ${port} "${join(setup, "deploy.sh")}" "${join(setup, "sudoers")}" ${target}:/tmp/`);

console.log("→ Authorizing key and installing permissions (Deck and sudo passwords)");
const remote = [
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh",
  `grep -qxF '${pub}' ~/.ssh/authorized_keys 2>/dev/null || echo '${pub}' >> ~/.ssh/authorized_keys`,
  "chmod 600 ~/.ssh/authorized_keys",
  "sudo install -D -m 755 -o root -g root /tmp/deploy.sh /etc/voiddeck/deploy.sh",
  // zz-: sudoers applies the last matching rule, so it must be read after wheel (password).
  "sudo install -m 440 -o root -g root /tmp/sudoers /etc/sudoers.d/zz-voiddeck",
  "sudo rm -f /etc/sudoers.d/voiddeck",
  "sudo visudo -c -f /etc/sudoers.d/zz-voiddeck",
  "rm -f /tmp/deploy.sh /tmp/sudoers",
].join(" && ");
run(`ssh ${opts} -t -p ${port} ${target} "${remote}"`);

console.log("✓ Ready: pnpm deck will no longer ask for a password");
