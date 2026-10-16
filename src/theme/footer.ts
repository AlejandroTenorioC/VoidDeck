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

/* STEAM, Options…: Steam's white pills become outlined pills */
${glyph} svg { filter: invert(1); border-radius: 999px; outline: 1px solid var(--vd-line-strong); outline-offset: -1px; }

${label} {
  color: var(--vd-ink-muted) !important; font-size: 9.5px !important;
  letter-spacing: .08em !important; text-transform: uppercase;
}
`;
}
