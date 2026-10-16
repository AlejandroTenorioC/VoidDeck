// Layer 1: global skin. Injects Void Deck CSS into every Steam window.
import { removeStatusDots, unwatchBattery, updateStatusDots, watchBattery } from "./steam/statusDots";
import { steamDocuments } from "./steam/windows";
import { skinCss } from "./theme/skin";
import type { Theme } from "./theme/tokens";
import { appearanceState } from "./preferences";

const STYLE_ID = "voiddeck-skin";
// Steam creates new windows (overlays, popups) on demand and Wi-Fi changes, so check periodically.
const RESYNC_MS = 2000;

let css: string | null = null;
let theme: Theme = "dark";
let timer: ReturnType<typeof setInterval> | undefined;

function sync(): void {
  if (css === null) return;
  for (const doc of steamDocuments()) {
    let el = doc.getElementById(STYLE_ID);
    if (!el) {
      el = doc.createElement("style");
      el.id = STYLE_ID;
      doc.head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
    updateStatusDots(doc);
  }
}

export function applySkin(next: Theme): void {
  theme = next;
  const appearance = appearanceState();
  css = skinCss(next, appearance.accent, appearance.buttonStyle);
  sync();
  timer ??= setInterval(sync, RESYNC_MS);
  watchBattery(sync);
}

export function removeSkin(): void {
  clearInterval(timer);
  timer = undefined;
  unwatchBattery();
  css = null;
  for (const doc of steamDocuments()) {
    doc.getElementById(STYLE_ID)?.remove();
    removeStatusDots(doc);
  }
}

/** Current state, so the panel can show it when reopened. */
export function skinState(): { on: boolean; theme: Theme } {
  return { on: css !== null, theme };
}
