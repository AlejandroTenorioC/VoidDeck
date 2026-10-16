// Void Deck tokens as CSS variables. Source of truth: the design (tokens.json).

export type Theme = "dark" | "light";

const colors: Record<Theme, Record<string, string>> = {
  dark: {
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
  },
  light: {
    bg: "#f2f2f2",
    surface: "#ffffff",
    "surface-raised": "#e6e6e6",
    line: "#d4d4d4",
    "line-strong": "#8a8a8a",
    ink: "#000000",
    "ink-muted": "#5e5e5e",
    "ink-faint": "#b5b5b5",
    "on-ink": "#ffffff",
    signal: "#d71921",
    "signal-text": "#c0121a",
    "on-signal": "#ffffff",
    "focus-ring": "0 0 0 3px #f2f2f2, 0 0 0 6px #000000",
  },
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

/** A `selector { ... }` block with every `--vd-*` variable for the given theme. */
export function tokensCss(theme: Theme, selector = ":root"): string {
  return `${selector} { ${declare(colors[theme])} ${declare(scale)} }`;
}
