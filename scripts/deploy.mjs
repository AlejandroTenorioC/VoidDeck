// Build and copy the plugin to the Steam Deck over SSH, then restart Decky.
// Configuration is in .env.deck (see .env.deck.example). After `pnpm deck:setup`, no password is needed.
import { execFileSync, execSync } from "node:child_process";
import { pluginName, stagePlugin } from "./bundle.mjs";
import { deckConfig, root, sshArgs } from "./deck.mjs";

const run = (file, args) => execFileSync(file, args, { stdio: "inherit", cwd: root });
const succeeds = (file, args) => {
  try {
    execFileSync(file, args, { stdio: "ignore", cwd: root });
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
const batch = succeeds("ssh", [...sshArgs(cfg, { batch: true }), "-p", port, target, "sudo -n -l /etc/voiddeck/deploy.sh"]);
const ssh = (command, tty = false) =>
  run("ssh", [...sshArgs(cfg, { batch }), ...(tty ? ["-t"] : []), "-p", port, target, command]);
if (!batch) console.log("(No deployment setup: a password will be requested. Run `pnpm deck:setup` once.)");

console.log("→ Building");
execSync("pnpm build", { stdio: "inherit", cwd: root });

console.log("→ Preparing package");
const out = stagePlugin();

console.log(`→ Copying to ${target}`);
ssh(`rm -rf ${staging} && mkdir -p ${staging}`);
run("scp", [...sshArgs(cfg, { batch }), "-P", port, "-r", out, `${target}:${staging}/`]);

console.log("→ Installing and restarting Decky");
if (batch) {
  ssh("sudo -n /etc/voiddeck/deploy.sh");
} else {
  ssh(
    `sudo rm -rf ${pluginDir} && sudo cp -r ${staging}/${name} ${pluginDir} && sudo systemctl restart plugin_loader`,
    true,
  );
}

console.log("✓ Deployed");
