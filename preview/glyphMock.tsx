// A stand-in for Steam's bottom control-hint bar, so the monochrome prompt CSS can be checked in
// the browser. Steam paints a prompt in several ways — the Deck uses <img src="…/shared_buttons_…">,
// other pads serve their own image set, and some draw inline <svg> — so this renders one of each.
// The preview maps every class name to itself, so the readable names below match the real selectors.
import type { ReactNode } from "react";

const XBOX_A = "#7db700";
const XBOX_B = "#d43f3f";

/** The coloured Xbox-style glyph Steam draws inline on non-Deck pads. */
function InlineGlyph({ letter, color }: { letter: string; color: string }) {
  return (
    <svg width="21" height="21" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="30" fill={color} />
      <text x="32" y="45" textAnchor="middle" fontFamily="sans-serif" fontSize="36" fill="#fff">
        {letter}
      </text>
    </svg>
  );
}

function Hint({ glyph, label }: { glyph: ReactNode; label: string }) {
  return (
    <span className="vd-hint">
      <span className="ActionButtonGlyph">{glyph}</span>
      <span className="ActionButtonLabel">{label}</span>
    </span>
  );
}

export function GlyphMock() {
  return (
    <div className="glyph-mock">
      <Hint label="Deck" glyph={<img src="/steaminputglyphs/shared_buttons_s.svg" alt="" />} />
      <Hint label="Xbox img" glyph={<img src="/steaminputglyphs/xbox_buttons_a.svg" alt="" />} />
      <Hint label="Xbox svg" glyph={<InlineGlyph letter="A" color={XBOX_A} />} />
      <Hint label="Colour svg" glyph={<InlineGlyph letter="B" color={XBOX_B} />} />
    </div>
  );
}
