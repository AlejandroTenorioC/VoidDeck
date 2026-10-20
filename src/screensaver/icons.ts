// Weather icons drawn on a 7×7 dot grid, like the plugin icon: "X" is a lit dot.
import type { Sky } from "./weather";

const patterns: Record<Sky | "night", string[]> = {
  clear: ["X..X..X", ".......", "..XXX..", "X.XXX.X", "..XXX..", ".......", "X..X..X"],
  night: ["..XXX..", ".XX....", "XX.....", "XX.....", "XX.....", ".XX....", "..XXX.."],
  partly: [".....X.", "..XXX.X", ".XXXXX.", "XXXXXXX", "XXXXXXX", ".......", "......."],
  cloudy: [".......", "..XXX..", ".XXXXX.", "XXXXXXX", "XXXXXXX", ".......", "......."],
  fog: [".......", "XXXXXX.", ".......", ".XXXXXX", ".......", "XXXXXX.", "......."],
  rain: ["..XXX..", ".XXXXX.", "XXXXXXX", ".......", ".X.X.X.", "X.X.X..", "......."],
  snow: ["..XXX..", ".XXXXX.", "XXXXXXX", ".......", "X..X..X", ".......", ".X..X.."],
  storm: ["..XXX..", ".XXXXX.", "XXXXXXX", "...X...", "..X....", "...X...", "..X...."],
};

/** SVG markup for the sky; a clear night shows the moon. */
export function skyIcon(kind: Sky, isDay: boolean): string {
  const rows = patterns[kind === "clear" && !isDay ? "night" : kind];
  const dots = rows.flatMap((row, y) =>
    [...row].map((c, x) => `<circle cx="${4 + x * 8}" cy="${4 + y * 8}" r="2.6" opacity="${c === "X" ? 1 : 0.15}"/>`),
  );
  return `<svg viewBox="0 0 56 56" fill="currentColor">${dots.join("")}</svg>`;
}
