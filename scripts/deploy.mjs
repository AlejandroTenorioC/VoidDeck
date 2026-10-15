// Compila y copia el plugin a la Steam Deck por SSH, luego reinicia Decky.
// Configuración en .env.deck (ver .env.deck.example).
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function loadEnv() {
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
  return env;
}

const run = (cmd) => execSync(cmd, { stdio: "inherit", cwd: root });

const env = loadEnv();
const host = env.DECK_HOST;
const user = env.DECK_USER || "deck";
const port = env.DECK_PORT || "22";
if (!host) {
  console.error("DECK_HOST no está definido en .env.deck");
  process.exit(1);
}

const { name } = JSON.parse(readFileSync(join(root, "plugin.json"), "utf8"));
const target = `${user}@${host}`;
const staging = `/home/${user}/.cache/voiddeck-deploy`;
const pluginDir = `/home/${user}/homebrew/plugins/${name}`;

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
run(`ssh -p ${port} ${target} "rm -rf ${staging} && mkdir -p ${staging}"`);
run(`scp -P ${port} -r "${out}" ${target}:${staging}/`);

// Los plugins pertenecen a root: sudo pedirá la contraseña de la Deck.
console.log("→ Instalando y reiniciando Decky (sudo)");
run(
  `ssh -t -p ${port} ${target} "sudo rm -rf ${pluginDir} && sudo cp -r ${staging}/${name} ${pluginDir} && sudo systemctl restart plugin_loader"`,
);

console.log("✓ Desplegado");
