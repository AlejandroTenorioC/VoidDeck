# Desarrollo de Void Deck


Requisitos: Node 22+ y pnpm.

```sh
pnpm install
pnpm preview     # preview en el navegador: http://localhost:5173 (recarga al guardar)
pnpm typecheck
pnpm build       # genera dist/
pnpm package     # genera out/VoidDeck-v<versión>.zip, el mismo que se publica en Releases
```

En el preview, las flechas mueven el foco (D-pad), Enter activa (A), X abre detalles, Q/E son L1/R1 y P abre el
Acceso rápido.

## Arquitectura

| Capa | Qué hace | Dónde |
|---|---|---|
| 1 · Piel global | Inyecta los tokens del diseño en todas las ventanas de Steam | `src/skin.ts`, `src/theme/` |
| 2 · Pantallas propias | Sustituye rutas concretas (Inicio) por pantallas en React | `src/home/` |
| 3 · Ajustes | Panel en el Acceso rápido | `src/qam/` |

Steam genera los nombres de sus clases CSS en cada actualización, así que nunca se escriben a mano:
`src/steam/classes.ts` los traduce en tiempo de ejecución a partir de su nombre legible.

## Probar en una Steam Deck

1. En la Deck: Decky Loader con **Developer mode** activado y SSH habilitado
   (`passwd` si no tienes contraseña, luego `sudo systemctl enable --now sshd`).
2. En el PC: copia `.env.deck.example` como `.env.deck` y pon la IP de la Deck.
3. `pnpm deck` compila, copia el plugin a la Deck y reinicia Decky.

Para desplegar sin contraseña (una sola vez): crea una clave con
`ssh-keygen -t ed25519 -f ~/.ssh/voiddeck_deck -N ""` y ejecuta `pnpm deck:setup`. Autoriza la clave e instala
en la Deck `/etc/voiddeck/deploy.sh` y una regla de `sudo` limitada a ese script y a arrancar/parar Decky
(`scripts/deck-setup/`). Se revierte borrando `/etc/sudoers.d/zz-voiddeck`. El script detiene Decky, espera a
que libere su puerto (1337) y limpia procesos huérfanos antes de arrancarlo: un reinicio brusco con otro plugin
colgado puede dejar a Decky en bucle y agotar la memoria.

`pnpm deck:log` muestra los plugins instalados y el registro de Decky.

Para inspeccionar la interfaz de Steam en vivo: en Decky, *⚙ → Developer → Allow Remote CEF Debugging*; después,
en Chrome o Brave del PC, abre `chrome://inspect` y añade `IP_DE_LA_DECK:8081`.

## Publicar una versión

1. Sube la versión en `package.json` (por ejemplo `0.2.0`) y haz commit.
2. Crea y sube la etiqueta: `git tag v0.2.0 && git push origin v0.2.0`.
3. GitHub Actions compila, genera `VoidDeck-v0.2.0.zip` y crea la Release con el zip adjunto
   (`.github/workflows/release.yml`). La etiqueta debe coincidir con la versión de `package.json`.

