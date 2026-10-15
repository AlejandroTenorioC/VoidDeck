// Capa 1: piel global. Inyecta el CSS de Void Deck en todas las ventanas de Steam.
import { steamDocuments } from "./steam/windows";
import { skinCss } from "./theme/skin";
import type { Theme } from "./theme/tokens";

const STYLE_ID = "voiddeck-skin";
// Steam crea ventanas nuevas (overlays, popups) sobre la marcha: revisamos cada poco.
const RESYNC_MS = 2000;

let css: string | null = null;
let theme: Theme = "dark";
let timer: ReturnType<typeof setInterval> | undefined;

function sync(): void {
  for (const doc of steamDocuments()) {
    let el = doc.getElementById(STYLE_ID);
    if (!el) {
      el = doc.createElement("style");
      el.id = STYLE_ID;
      doc.head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
  }
}

export function applySkin(next: Theme): void {
  theme = next;
  css = skinCss(next);
  sync();
  timer ??= setInterval(sync, RESYNC_MS);
}

export function removeSkin(): void {
  clearInterval(timer);
  timer = undefined;
  css = null;
  for (const doc of steamDocuments()) doc.getElementById(STYLE_ID)?.remove();
}

/** Estado actual, para que el panel lo muestre al volver a abrirse. */
export function skinState(): { on: boolean; theme: Theme } {
  return { on: css !== null, theme };
}
