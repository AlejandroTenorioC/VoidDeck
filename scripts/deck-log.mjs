// Diagnostics: installed plugins and the latest Decky log lines (requires `pnpm deck:setup`).
import { execSync } from "node:child_process";
import { deckConfig, root, sshOptions } from "./deck.mjs";

const cfg = deckConfig();
const lines = process.argv[2] ?? "80";
const remote = [
  "echo '== PLUGINS'",
  "ls -la ~/homebrew/plugins",
  "echo '== DECKY STATUS'",
  "systemctl is-active plugin_loader || true",
  "echo '== DECKY LOG'",
  `journalctl -u plugin_loader -n ${lines} --no-pager`,
].join("; ");
execSync(`ssh ${sshOptions(cfg, { batch: true })} -p ${cfg.port} ${cfg.target} "${remote}"`, { stdio: "inherit", cwd: root });
