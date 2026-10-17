# Void Deck

A Steam Deck interface made of dots, light and void. A [Decky Loader](https://decky.xyz) plugin that restyles
the whole Steam interface (Game Mode): pure black backgrounds, dot-matrix typography and a custom Home screen,
designed to be driven with the controller.

![Void Deck Home screen](docs/screenshots/inicio.png)

## What it changes

**A custom Home screen.** The game you were playing, front and center in dot-matrix type, with its playtime and
Steam Deck compatibility. Below it, your recently played games and every installed game — including non-Steam
ones such as emulators or other stores. A plays, X opens the details.

![Installed games on the Home screen](docs/screenshots/instalados.png)

![Library with Void Deck](docs/screenshots/biblioteca.png)

**The whole Steam interface.** The Library, main menu, top and bottom bars and Quick Access all share the same
language: pure black, Space Grotesk for text, Space Mono for labels and Doto (dot matrix) for numbers. Battery and
Wi-Fi in the top bar become dot meters, and the battery turns red below 20 %.

| Quick Access | Main menu |
|---|---|
| ![Quick Access](docs/screenshots/acceso-rapido.png) | ![Main menu](docs/screenshots/menu.png) |

Brightness and volume are shown as rows of dots and toggles as pills, but they work exactly as before: Void Deck
only changes how Steam looks, never how it works.

> The plugin interface is available in English and Spanish.

## Installation

You need [Decky Loader](https://decky.xyz) installed on your Steam Deck.

1. Find the latest `VoidDeck-vX.Y.Z.zip` on the [Releases](https://github.com/AlejandroTenorioC/VoidDeck/releases/latest) page.
2. On the Deck, in Game Mode, open Quick Access (the `···` button) → the **Decky** tab (plug icon) → **⚙**.
3. Under **General**, turn on **Developer mode**.
4. In the new **Developer** section, choose one of:
   - **Install Plugin from URL**: paste the link to the release `.zip` (right-click → copy link on the Releases
     page). This is the easiest way: no need to copy files to the Deck.
   - **Install Plugin from ZIP File**: pick the `.zip` if it is already on the Deck (for example, downloaded in
     Desktop Mode to your Downloads folder).
5. Confirm the installation. Void Deck applies immediately and shows up in the Decky tab.

**Updating:** repeat the steps with the new version's `.zip`; it replaces the previous one.

**Uninstalling:** Decky → ⚙ → **Plugins** → Void Deck → **Uninstall**. Steam goes back to its original look
right away.

## Settings

In Quick Access, Decky tab → **Void Deck**:

- **Global skin**: the Void Deck style across the whole Steam interface.
- **Home screen**: replaces Steam's Home with the Void Deck one.
- **Light theme**: inverted colors for outdoor use.
- **Language**: English or Spanish.
- **Reset to defaults**: restores the default settings.

Each part can be turned off on its own. If a Steam update breaks something, turn that part off and the rest keeps
working.

> Void Deck is an independent project, not affiliated with Valve or Steam. Steam changes its interface often:
> after an update, some screen may look half-styled until a new version of the plugin is released.

## How it was made

Void Deck was developed with AI assistance (Claude). The design, direction and every release are mine: as a
software engineer, I test each change on my own Steam Deck and review the code before it ships.

## License

[GPL-3.0](LICENSE). The bundled typefaces (Doto, Space Grotesk and Space Mono) are distributed under the
SIL Open Font License 1.1: see [`third_party/fonts`](third_party/fonts).
