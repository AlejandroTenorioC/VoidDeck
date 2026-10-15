// Biblioteca y demás páginas con pestañas de Steam (módulo GamepadTabbedPage).
// Medidas en px CSS de Steam: 1 px aquí = 1,5 px del concepto.
import { cls } from "../steam/classes";

export function libraryCss(): string {
  const tab = cls("Tab", "TabCount");
  const selected = cls("Selected", "TabCount");
  const glyphs = cls("Glyphs", "TabRow");
  const item = cls("LibraryItemBox");
  // Anillo de foco del concepto (3 px de holgura + 3 px blanco) a escala de Steam.
  const ring = "0 0 0 2px var(--vd-bg), 0 0 0 4px var(--vd-ink)";

  return `
/* Vacío primero: sin degradado de fondo */
${cls("GamepadLibrary")} { background: var(--vd-bg) !important; background-image: none !important; }

/* Pestañas: etiquetas monoespaciadas, la activa en píldora blanca */
${tab} {
  background: transparent !important; color: var(--vd-ink-muted) !important;
  font-family: var(--vd-font-mono) !important; font-size: 10px !important; font-weight: 400 !important; letter-spacing: .08em !important;
}
${tab}${selected} { background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; }
${tab}.gpfocus { box-shadow: ${ring} !important; color: var(--vd-ink) !important; }
${tab}${selected}.gpfocus { color: var(--vd-on-ink) !important; }
${cls("TabCount")} { font-family: var(--vd-font-mono) !important; opacity: .6; }

/* L1 / R1: píldoras con borde en vez de las imágenes de Steam */
${glyphs}:has(img[src*="_l1"]) img, ${glyphs}:has(img[src*="_r1"]) img { display: none !important; }
${glyphs}:has(img[src*="_l1"])::after, ${glyphs}:has(img[src*="_r1"])::after {
  display: inline-grid; place-items: center; min-width: 27px; height: 19px; padding: 0 4px; box-sizing: border-box;
  border: 1px solid var(--vd-line-strong); border-radius: 999px;
  font: 700 9px/1 var(--vd-font-mono); color: var(--vd-ink);
}
${glyphs}:has(img[src*="_l1"])::after { content: "L1"; }
${glyphs}:has(img[src*="_r1"])::after { content: "R1"; }

/* Portadas: esquinas radius-md, sin sombras ni resplandor; foco con anillo blanco */
${item} { box-shadow: none !important; border-radius: 11px !important; }
${item} ${cls("Capsule", "CapsuleVisible")} { border-radius: 11px !important; overflow: hidden !important; }
${item}.gpfocus { outline: none !important; box-shadow: ${ring} !important; }
${cls("LibraryImageBackgroundGlow")} { display: none !important; }
`;
}
