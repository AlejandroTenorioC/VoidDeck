// Capa 1: piel global. Inyecta el CSS de Void Deck en todas las ventanas de Steam.
import { removeStatusDots, unwatchBattery, updateStatusDots, watchBattery } from "./steam/statusDots";
import { steamDocuments } from "./steam/windows";
import { languageState, strings } from "./i18n";
import { IN_GAME_ATTR, skinCss } from "./theme/skin";
import { ACHIEVEMENT_LABEL_VAR } from "./theme/toasts";
import type { Theme } from "./theme/tokens";

const STYLE_ID = "voiddeck-skin";
// Steam crea ventanas nuevas (overlays, popups) sobre la marcha y cambia el wifi: revisamos cada poco.
const RESYNC_MS = 2000;

let css: string | null = null;
let theme: Theme = "dark";
let timer: ReturnType<typeof setInterval> | undefined;

const gameRunning = () => ((window as any).SteamUIStore?.RunningApps?.length ?? 0) > 0;

function sync(): void {
  if (css === null) return;
  const inGame = gameRunning();
  const achievementLabel = JSON.stringify(strings(languageState()).achievementUnlocked);
  for (const doc of steamDocuments()) {
    doc.documentElement.toggleAttribute(IN_GAME_ATTR, inGame);
    doc.documentElement.style.setProperty(ACHIEVEMENT_LABEL_VAR, achievementLabel);
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
  css = skinCss(next);
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
    doc.documentElement.removeAttribute(IN_GAME_ATTR);
    doc.documentElement.style.removeProperty(ACHIEVEMENT_LABEL_VAR);
    removeStatusDots(doc);
  }
}

/** Estado actual, para que el panel lo muestre al volver a abrirse. */
export function skinState(): { on: boolean; theme: Theme } {
  return { on: css !== null, theme };
}
