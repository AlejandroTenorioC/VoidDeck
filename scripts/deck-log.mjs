// Diagnóstico: plugins instalados y últimas líneas del registro de Decky (requiere `pnpm deck:setup`).
import { execSync } from "node:child_process";
import { deckConfig, root, sshOptions } from "./deck.mjs";

const cfg = deckConfig();
const lines = process.argv[2] ?? "80";
const remote = [
  "echo '== PLUGINS'",
  "ls -la ~/homebrew/plugins",
  "echo '== ESTADO DECKY'",
  "systemctl is-active plugin_loader || true",
  "echo '== REGISTRO DECKY'",
  `journalctl -u plugin_loader -n ${lines} --no-pager`,
].join("; ");
execSync(`ssh ${sshOptions(cfg, { batch: true })} -p ${cfg.port} ${cfg.target} "${remote}"`, { stdio: "inherit", cwd: root });
