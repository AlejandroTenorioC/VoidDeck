// Tokens de Void Deck como variables CSS. Fuente de verdad: el concepto (tokens.json).

export type Theme = "dark" | "light";

// Only the dark palette: the light theme inverts the whole window (see lightThemeCss in skin.ts),
// which also covers the Steam colors Void Deck never restyles.
const colors: Record<string, string> = {
  bg: "#000000",
  surface: "#111111",
  "surface-raised": "#1c1c1c",
  line: "#2a2a2a",
  "line-strong": "#6b6b6b",
  ink: "#ffffff",
  "ink-muted": "#9a9a9a",
  "ink-faint": "#4a4a4a",
  "on-ink": "#000000",
  signal: "#d71921",
  "signal-text": "#ff5a60",
  "on-signal": "#ffffff",
  "focus-ring": "0 0 0 3px #000000, 0 0 0 6px #ffffff",
};

const scale: Record<string, string> = {
  "space-1": "4px",
  "space-2": "8px",
  "space-3": "12px",
  "space-4": "16px",
  "space-6": "24px",
  "space-8": "32px",
  "space-12": "48px",
  "radius-sm": "8px",
  "radius-md": "16px",
  "radius-lg": "24px",
  "radius-pill": "999px",
  "font-dot": '"Doto", "Space Mono", ui-monospace, monospace',
  "font-sans": '"Space Grotesk", system-ui, sans-serif',
  "font-mono": '"Space Mono", ui-monospace, monospace',
};

const declare = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([name, value]) => `--vd-${name}: ${value};`)
    .join(" ");

/** A `selector { ... }` block with every `--vd-*` variable. */
export function tokensCss(selector = ":root"): string {
  return `${selector} { ${declare(colors)} ${declare(scale)} }`;
}
