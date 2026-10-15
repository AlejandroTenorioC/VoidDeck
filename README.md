# Void Deck

Una interfaz para Steam Deck hecha de puntos, luz y vacío. Plugin para [Decky Loader](https://decky.xyz).

## Arquitectura

| Capa | Qué hace | Dónde |
|---|---|---|
| 1 · Piel global | Inyecta los tokens (colores, tipografía, foco) en toda la UI de Steam | `src/skin.ts`, `src/theme/` |
| 2 · Pantallas propias | Sustituye rutas concretas (Inicio) por pantallas en React | *pendiente* |
| 3 · Ajustes | Panel en el menú de Acceso rápido | `src/qam/` |

Cada capa se puede activar o desactivar por separado.

## Desarrollo

Requisitos: Node 20+ y pnpm.

```sh
pnpm install
pnpm preview     # preview en http://localhost:5173 (recarga al guardar)
pnpm typecheck
pnpm build       # genera dist/
```

En el preview, las flechas mueven el foco (D-pad) y Enter activa (A).

### Probar en la Steam Deck

1. En la Deck: Decky Loader con el **modo desarrollador** activado y SSH habilitado:
   `passwd` (si no tienes contraseña) y luego `sudo systemctl enable --now sshd`.
2. En el PC: copia `.env.deck.example` como `.env.deck` y pon la IP de la Deck.
3. `pnpm deck` compila, copia el plugin y reinicia Decky.

Para desplegar sin contraseña (una sola vez): crea la clave con
`ssh-keygen -t ed25519 -f ~/.ssh/voiddeck_deck -N ""` y ejecuta `pnpm deck:setup`. Autoriza la clave e instala
en la Deck `/etc/voiddeck/deploy.sh` y una regla de `sudo` limitada a ese script y a arrancar/parar Decky
(`scripts/deck-setup/`). Se revierte borrando `/etc/sudoers.d/zz-voiddeck`.
El script para Decky, espera a que libere el puerto 1337 y limpia procesos huérfanos antes de arrancarlo: un
reinicio brusco con otro plugin colgado puede dejar a Decky en bucle y agotar la memoria.
`pnpm deck:log` muestra los plugins instalados y el registro de Decky.

Para inspeccionar la UI de Steam en vivo: en Decky, *Ajustes → Desarrollador → Allow Remote CEF Debugging*,
y desde Chrome en el PC abre `chrome://inspect` y añade `IP_DE_LA_DECK:8081`.
