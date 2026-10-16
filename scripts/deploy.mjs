// Build and copy the plugin to the Steam Deck over SSH, then restart Decky.
// Configuration is in .env.deck (see .env.deck.example). After `pnpm deck:setup`, no password is needed.
import { execSync } from "node:child_process";
import { pluginName, stagePlugin } from "./bundle.mjs";
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
const name = pluginName();
const staging = `/home/${user}/.cache/voiddeck-deploy`;
const pluginDir = `/home/${user}/homebrew/plugins/${name}`;

// Password-free if the key is authorized and the deployment script exists on the Deck.
const batch = succeeds(`ssh ${sshOptions(cfg, { batch: true })} -p ${port} ${target} "sudo -n -l /etc/voiddeck/deploy.sh"`);
const ssh = `ssh ${sshOptions(cfg, { batch })} -p ${port}`;
const scp = `scp ${sshOptions(cfg, { batch })} -P ${port}`;
if (!batch) console.log("(No deployment setup: a password will be requested. Run `pnpm deck:setup` once.)");

console.log("→ Building");
run("pnpm build");

console.log("→ Preparing package");
const out = stagePlugin();

console.log(`→ Copying to ${target}`);
run(`${ssh} ${target} "rm -rf ${staging} && mkdir -p ${staging}"`);
run(`${scp} -r "${out}" ${target}:${staging}/`);

console.log("→ Installing and restarting Decky");
if (batch) {
  run(`${ssh} ${target} "sudo -n /etc/voiddeck/deploy.sh"`);
} else {
  run(
    `${ssh} -t ${target} "sudo rm -rf ${pluginDir} && sudo cp -r ${staging}/${name} ${pluginDir} && sudo systemctl restart plugin_loader"`,
  );
}

console.log("✓ Deployed");
