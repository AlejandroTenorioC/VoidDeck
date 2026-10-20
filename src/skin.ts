// Layer 1: global skin. Injects Void Deck CSS into every Steam window.
import { warnMissingClasses } from "./steam/classes";
import { removeStatusDots, unwatchBattery, updateStatusDots, watchBattery } from "./steam/statusDots";
import { harvestClasses } from "./steam/windowClasses";
import { steamDocuments, steamWindows } from "./steam/windows";
import { skinCss } from "./theme/skin";
import type { Theme } from "./theme/tokens";

const STYLE_ID = "voiddeck-skin";
// Steam creates new windows (overlays, popups) on demand and Wi-Fi changes, so check periodically.
const RESYNC_MS = 2000;

let css: string | null = null;
let theme: Theme = "dark";
let postersBw = true;
let timer: ReturnType<typeof setInterval> | undefined;

function setPosters(doc: Document): void {
  if (postersBw) delete doc.documentElement.dataset.vdBw;
  else doc.documentElement.dataset.vdBw = "off";
}

function sync(): void {
  if (css === null) return;
  // The on-screen keyboard publishes its class names only once it opens, so the theme
  // is rebuilt as soon as new ones are found.
  if (harvestClasses(steamWindows())) {
    css = skinCss(theme);
    warnMissingClasses();
  }
  for (const doc of steamDocuments()) {
    let el = doc.getElementById(STYLE_ID);
    if (!el) {
      el = doc.createElement("style");
      el.id = STYLE_ID;
      doc.head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
    // Steam appends its own styles after ours, so ours goes back to the end of the head.
    if (doc.head.lastElementChild !== el) doc.head.appendChild(el);
    updateStatusDots(doc);
    setPosters(doc);
  }
  // Steam does not always have the battery hook ready when the skin applies.
  watchBattery(sync);
}

export function applySkin(next: Theme): void {
  theme = next;
  css = skinCss(next);
  warnMissingClasses();
  sync();
  timer ??= setInterval(sync, RESYNC_MS);
}

export function applyPosterColor(bw: boolean): void {
  postersBw = bw;
  for (const doc of steamDocuments()) setPosters(doc);
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
