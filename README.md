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
3. `pnpm deploy` compila, copia el plugin y reinicia Decky (pide la contraseña de la Deck para `sudo`).

Para inspeccionar la UI de Steam en vivo: en Decky, *Ajustes → Desarrollador → Allow Remote CEF Debugging*,
y desde Chrome en el PC abre `chrome://inspect` y añade `IP_DE_LA_DECK:8081`.
