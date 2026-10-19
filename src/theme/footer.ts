// Bottom control-hint bar (the design's ButtonHint).
// Steam draws A/B/X/Y as directional images: s = A, e = B, w = X, n = Y.
import { cls } from "../steam/classes";
import { buttonGlyphs } from "virtual:voiddeck-button-assets";

const directions = { s: "a", e: "b", w: "x", n: "y" } as const;

export function footerCss(): string {
  const glyph = cls("ActionButtonGlyph", "ActionButtonLabel");
  const label = cls("ActionButtonLabel", "ActionButtonGlyph");
  const face = `${glyph}:has(img[src*="shared_buttons_"])`;

  return `
/* A/B/X/Y: bundled Steam Deck controller glyphs */
${face} img { display: none !important; }
${face}::after {
  content: ""; display: inline-block; width: 21px; height: 21px; background: center / contain no-repeat;
}
${Object.entries(directions).map(([dir, button]) => `${glyph}:has(img[src*="shared_buttons_${dir}"])::after { background-image: url("${buttonGlyphs.steam[button]}"); }`).join("\n")}

/* Every prompt Steam paints into the hint bar becomes monochrome, whatever its format:
   the Deck serves <img src="…/steaminputglyphs/…">, while other pads (Xbox/XInput, e.g. the
   ROG Ally) draw inline <svg> — invert() would only recolour a coloured glyph, so grayscale it. */
${glyph} img, ${glyph} svg { filter: grayscale(1) brightness(2.2) !important; }

${label} {
  color: var(--vd-ink-muted) !important; font-size: 9.5px !important;
  letter-spacing: .08em !important; text-transform: uppercase;
}
`;
}
