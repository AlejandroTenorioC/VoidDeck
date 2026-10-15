// Configuración única de la Deck para desplegar sin contraseña (pide la contraseña una última vez).
// - Autoriza la clave SSH del proyecto (DECK_KEY en .env.deck).
// - Instala /etc/voiddeck/deploy.sh y la regla /etc/sudoers.d/zz-voiddeck.
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

console.log("→ Copiando archivos a la Deck (contraseña de la Deck)");
run(`scp ${opts} -P ${port} "${join(setup, "deploy.sh")}" "${join(setup, "sudoers")}" ${target}:/tmp/`);

console.log("→ Autorizando la clave e instalando los permisos (contraseña de la Deck y de sudo)");
const remote = [
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh",
  `grep -qxF '${pub}' ~/.ssh/authorized_keys 2>/dev/null || echo '${pub}' >> ~/.ssh/authorized_keys`,
  "chmod 600 ~/.ssh/authorized_keys",
  "sudo install -D -m 755 -o root -g root /tmp/deploy.sh /etc/voiddeck/deploy.sh",
  // zz-: sudoers aplica la última regla que coincide; debe leerse después de wheel (contraseña).
  "sudo install -m 440 -o root -g root /tmp/sudoers /etc/sudoers.d/zz-voiddeck",
  "sudo rm -f /etc/sudoers.d/voiddeck",
  "sudo visudo -c -f /etc/sudoers.d/zz-voiddeck",
  "rm -f /tmp/deploy.sh /tmp/sudoers",
].join(" && ");
run(`ssh ${opts} -t -p ${port} ${target} "${remote}"`);

console.log("✓ Listo: pnpm deck ya no pedirá contraseña");
