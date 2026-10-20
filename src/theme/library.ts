// Library and other tabbed Steam pages (GamepadTabbedPage module).
// Measurements are in Steam CSS px: 1 px here = 1.5 design px.
import { cls } from "../steam/classes";

export function libraryCss(): string {
  const tab = cls("Tab", "TabCount");
  const selected = cls("Selected", "TabCount");
  const glyphs = cls("Glyphs", "TabRow");
  const item = cls("LibraryItemBox");
  // Design focus ring (3 px padding + 3 px white) at Steam scale.
  const ring = "0 0 0 2px var(--vd-bg), 0 0 0 4px var(--vd-ink)";

  return `
/* Void first: no background gradient */
${cls("GamepadLibrary")} { background: var(--vd-bg) !important; background-image: none !important; }

/* Tabs: monospace labels, active tab in a white pill */
${tab} {
  background: transparent !important; color: var(--vd-ink-muted) !important;
  font-family: var(--vd-font-mono) !important; font-size: 10px !important; font-weight: 400 !important; letter-spacing: .08em !important;
}
${tab}${selected} { background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; }
${tab}.gpfocus { box-shadow: ${ring} !important; color: var(--vd-ink) !important; }
${tab}${selected}.gpfocus { color: var(--vd-on-ink) !important; }
${cls("TabCount")} { font-family: var(--vd-font-mono) !important; opacity: .6; }

/* L1 / R1: outlined pills instead of Steam images */
${glyphs}:has(img[src*="_l1"]) img, ${glyphs}:has(img[src*="_r1"]) img { display: none !important; }
${glyphs}:has(img[src*="_l1"])::after, ${glyphs}:has(img[src*="_r1"])::after {
  display: inline-grid; place-items: center; min-width: 27px; height: 19px; padding: 0 4px; box-sizing: border-box;
  border: 1px solid var(--vd-line-strong); border-radius: 999px;
  font: 700 9px/1 var(--vd-font-mono); color: var(--vd-ink);
}
${glyphs}:has(img[src*="_l1"])::after { content: "L1"; }
${glyphs}:has(img[src*="_r1"])::after { content: "R1"; }

/* Cover art: radius-md corners, no shadows or glow; white focus ring */
${item} { box-shadow: none !important; border-radius: 11px !important; }
${item} ${cls("Capsule", "CapsuleVisible")} { border-radius: 11px !important; overflow: hidden !important; filter: grayscale(1) !important; transition: filter 150ms ease !important; }
${item}:hover ${cls("Capsule", "CapsuleVisible")}, ${item}.gpfocus ${cls("Capsule", "CapsuleVisible")} { filter: none !important; }
html[data-vd-bw="off"] ${item} ${cls("Capsule", "CapsuleVisible")} { filter: none !important; }
${item}.gpfocus { outline: none !important; box-shadow: ${ring} !important; }
${cls("LibraryImageBackgroundGlow")} { display: none !important; }
`;
}
