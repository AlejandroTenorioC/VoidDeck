# Void Deck development


Requirements: Node 22+ and pnpm.

```sh
pnpm install
pnpm preview     # browser preview: http://localhost:5173 (reloads on save)
pnpm typecheck
pnpm build       # generates dist/
pnpm package     # generates out/VoidDeck-v<version>.zip, the same ZIP published in Releases
```

In the preview, the arrow keys move focus (D-pad), Enter activates (A), X opens details, Q/E are L1/R1, and P
opens Quick Access.

## Architecture

| Layer | Purpose | Location |
|---|---|---|
| 1 · Global skin | Injects the design tokens into every Steam window | `src/skin.ts`, `src/theme/` |
| 2 · Custom screens | Replaces specific routes (Home) with React screens | `src/home/` |
| 3 · Settings | Panel in Quick Access | `src/qam/` |

Steam regenerates its CSS class names in every update, so they are never written by hand:
`src/steam/classes.ts` resolves them at runtime from their readable name.

## Testing on a Steam Deck

1. On the Deck: enable **Developer mode** in Decky Loader and enable SSH
   (run `passwd` if you do not have a password, then `sudo systemctl enable --now sshd`).
2. On your computer: copy `.env.deck.example` to `.env.deck` and set the Deck's IP address.
3. `pnpm deck` builds the plugin, copies it to the Deck, and restarts Decky.

For password-free deployment (one-time setup), create a key with
`ssh-keygen -t ed25519 -f ~/.ssh/voiddeck_deck -N ""` and run `pnpm deck:setup`. This authorizes the key and
installs `/etc/voiddeck/deploy.sh` plus a `sudo` rule limited to that script and to starting/stopping Decky
(`scripts/deck-setup/`). Undo it by deleting `/etc/sudoers.d/zz-voiddeck`. The script stops Decky, waits for it
to release port 1337, and clears orphan processes before starting it again: a hard restart while another plugin
is stuck can leave Decky in a loop and exhaust memory.

`pnpm deck:log` shows installed plugins and the Decky log.

To inspect the live Steam interface: in Decky, choose *⚙ → Developer → Allow Remote CEF Debugging*; then open
`chrome://inspect` in Chrome or Brave on your computer and add `DECK_IP:8081`.

## Publishing a release

1. Bump the version in `package.json` (for example, `0.2.0`) and commit it.
2. Create and push the tag: `git tag v0.2.0 && git push origin v0.2.0`.
3. GitHub Actions builds the project, generates `VoidDeck-v0.2.0.zip`, and creates a Release with the ZIP attached
   (`.github/workflows/release.yml`). The tag must match the version in `package.json`.

