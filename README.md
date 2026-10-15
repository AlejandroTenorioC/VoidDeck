# Void Deck

Una interfaz para Steam Deck hecha de puntos, luz y vacío. Plugin para [Decky Loader](https://decky.xyz) que
cambia el aspecto de toda la interfaz de Steam (Game Mode): fondo negro puro, tipografías de matriz de puntos y
una pantalla de Inicio propia, pensada para manejarse con el mando.

![Pantalla de Inicio de Void Deck](docs/screenshots/inicio.png)

## Qué cambia

**Pantalla de Inicio propia.** El juego que estabas jugando en grande, escrito en matriz de puntos, con sus horas
y su compatibilidad con la Deck; debajo, los jugados recientemente y todos tus juegos instalados (incluidos los
que no son de Steam: emuladores, otras tiendas...). A juega, X abre los detalles.

![Juegos instalados en el Inicio](docs/screenshots/instalados.png)

![Biblioteca con Void Deck](docs/screenshots/biblioteca.png)

**Toda la interfaz de Steam.** Biblioteca, menú principal, barras superior e inferior y el Acceso rápido toman el
mismo lenguaje: negro puro, Space Grotesk para el texto, Space Mono para las etiquetas y Doto (matriz de puntos)
para los números. La batería y el wifi de la barra superior se convierten en medidores de puntos, y la batería
se pone en rojo cuando baja del 20 %.

| Acceso rápido | Menú principal |
|---|---|
| ![Acceso rápido](docs/screenshots/acceso-rapido.png) | ![Menú principal](docs/screenshots/menu.png) |

Brillo y volumen se muestran como filas de puntos y los interruptores como píldoras, pero funcionan igual que
siempre: Void Deck solo cambia el aspecto, nunca cómo se usa Steam.

## Instalación

Necesitas [Decky Loader](https://decky.xyz) instalado en la Deck.

1. Descarga el último `VoidDeck-vX.Y.Z.zip` desde [Releases](https://github.com/AlejandroTenorioC/VoidDeck/releases/latest).
2. En la Deck, en modo Gaming, abre el Acceso rápido (botón `···`) → pestaña de **Decky** (el enchufe) → **⚙**.
3. En **General**, activa **Developer mode** (modo desarrollador).
4. En la nueva sección **Developer**, usa una de estas dos opciones:
   - **Install Plugin from URL**: pega el enlace del `.zip` de la release (clic derecho → copiar enlace en la
     página de Releases). Es lo más cómodo: no hace falta pasar archivos a la Deck.
   - **Install Plugin from ZIP File**: elige el `.zip` si ya lo tienes en la Deck (por ejemplo, descargado en
     modo Escritorio a la carpeta Descargas).
5. Acepta la instalación. Void Deck se activa al momento y aparece en la pestaña de Decky.

**Actualizar:** repite los pasos con el `.zip` de la versión nueva; sustituye a la anterior.

**Desinstalar:** Decky → ⚙ → **Plugins** → Void Deck → **Uninstall**. Steam vuelve a su aspecto original al
instante.

## Ajustes

En el Acceso rápido, pestaña de Decky → **Void Deck**:

- **Piel global**: el estilo de Void Deck en toda la interfaz de Steam.
- **Pantalla de Inicio**: sustituye el Inicio de Steam por el de Void Deck.
- **Tema claro**: invierte los colores para usar la Deck en exterior.

Cada parte se puede apagar por separado. Si una actualización de Steam rompe algo, apaga esa parte y el resto
sigue funcionando.

> Void Deck es un proyecto independiente, sin relación con Valve ni con Steam. Steam cambia su interfaz con
> frecuencia: tras una actualización puede que alguna pantalla se vea a medias hasta que salga una versión nueva
> del plugin.

## Desarrollo

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

### Arquitectura

| Capa | Qué hace | Dónde |
|---|---|---|
| 1 · Piel global | Inyecta los tokens del diseño en todas las ventanas de Steam | `src/skin.ts`, `src/theme/` |
| 2 · Pantallas propias | Sustituye rutas concretas (Inicio) por pantallas en React | `src/home/` |
| 3 · Ajustes | Panel en el Acceso rápido | `src/qam/` |

Steam genera los nombres de sus clases CSS en cada actualización, así que nunca se escriben a mano:
`src/steam/classes.ts` los traduce en tiempo de ejecución a partir de su nombre legible.

### Probar en una Steam Deck

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

### Publicar una versión

1. Sube la versión en `package.json` (por ejemplo `0.2.0`) y haz commit.
2. Crea y sube la etiqueta: `git tag v0.2.0 && git push origin v0.2.0`.
3. GitHub Actions compila, genera `VoidDeck-v0.2.0.zip` y crea la Release con el zip adjunto
   (`.github/workflows/release.yml`). La etiqueta debe coincidir con la versión de `package.json`.

## Licencia

[GPL-3.0](LICENSE). Las tipografías incluidas (Doto, Space Grotesk y Space Mono) se distribuyen bajo la
SIL Open Font License 1.1: ver [`third_party/fonts`](third_party/fonts).
