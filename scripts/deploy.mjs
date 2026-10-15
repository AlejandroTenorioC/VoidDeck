// Compila y copia el plugin a la Steam Deck por SSH, luego reinicia Decky.
// Configuración en .env.deck (ver .env.deck.example). Con `pnpm deck:setup` hecho, no pide contraseña.
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { deckConfig, root, sshOptions } from "./deck.mjs";

const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: root });
const succeeds = (cmd) => {
  try {
    execSync(cmd, { stdio: "ignore", cwd: root });
    return true;
  } catch {
    return false;
  }
};

const cfg = deckConfig();
const { target, port, user } = cfg;
const { name } = JSON.parse(readFileSync(join(root, "plugin.json"), "utf8"));
const staging = `/home/${user}/.cache/voiddeck-deploy`;
const pluginDir = `/home/${user}/homebrew/plugins/${name}`;

// Sin contraseña si la clave está autorizada y el script de instalación existe en la Deck.
const batch = succeeds(`ssh ${sshOptions(cfg, { batch: true })} -p ${port} ${target} "sudo -n -l /etc/voiddeck/deploy.sh"`);
const ssh = `ssh ${sshOptions(cfg, { batch })} -p ${port}`;
const scp = `scp ${sshOptions(cfg, { batch })} -P ${port}`;
if (!batch) console.log("(Sin configuración de despliegue: se pedirá la contraseña. Ejecuta `pnpm deck:setup` una vez.)");

console.log("→ Compilando");
run("pnpm build");

console.log("→ Preparando paquete");
const out = join(root, "out", name);
rmSync(join(root, "out"), { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ["dist", "plugin.json", "package.json", "main.py", "LICENSE", "README.md"]) {
  if (existsSync(join(root, f))) cpSync(join(root, f), join(out, f), { recursive: true });
}

console.log(`→ Copiando a ${target}`);
run(`${ssh} ${target} "rm -rf ${staging} && mkdir -p ${staging}"`);
run(`${scp} -r "${out}" ${target}:${staging}/`);

console.log("→ Instalando y reiniciando Decky");
if (batch) {
  run(`${ssh} ${target} "sudo -n /etc/voiddeck/deploy.sh"`);
} else {
  run(
    `${ssh} -t ${target} "sudo rm -rf ${pluginDir} && sudo cp -r ${staging}/${name} ${pluginDir} && sudo systemctl restart plugin_loader"`,
  );
}

console.log("✓ Desplegado");
