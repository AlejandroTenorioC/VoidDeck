// Barra inferior de pistas de controles (ButtonHint del concepto).
// Steam dibuja A/B/X/Y con imágenes por dirección: s = A, e = B, w = X, n = Y.
import { cls } from "../steam/classes";

const FACE_BUTTONS: [direction: string, letter: string][] = [
  ["s", "A"],
  ["e", "B"],
  ["w", "X"],
  ["n", "Y"],
];

export function footerCss(): string {
  const glyph = cls("ActionButtonGlyph", "ActionButtonLabel");
  const label = cls("ActionButtonLabel", "ActionButtonGlyph");
  const face = `${glyph}:has(img[src*="shared_buttons_"])`;

  return `
/* A/B/X/Y: círculo con la letra; A relleno (acción principal) */
${face} img { display: none !important; }
${face}::after {
  display: inline-grid; place-items: center; width: 19px; height: 19px; box-sizing: border-box; border-radius: 50%;
  border: 1px solid var(--vd-line-strong); color: var(--vd-ink); font: 700 9px/1 var(--vd-font-mono);
}
${glyph}:has(img[src*="shared_buttons_s"])::after { background: var(--vd-ink); border-color: var(--vd-ink); color: var(--vd-on-ink); }
${FACE_BUTTONS.map(([dir, letter]) => `${glyph}:has(img[src*="shared_buttons_${dir}"])::after { content: "${letter}"; }`).join("\n")}

/* STEAM, Opciones...: las píldoras blancas de Steam pasan a píldoras con borde */
${glyph} svg { filter: invert(1); border-radius: 999px; outline: 1px solid var(--vd-line-strong); outline-offset: -1px; }

${label} {
  color: var(--vd-ink-muted) !important; font-size: 9.5px !important;
  letter-spacing: .08em !important; text-transform: uppercase;
}
`;
}
