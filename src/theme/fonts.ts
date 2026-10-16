// Void Deck typefaces (SIL Open Font License), embedded to work offline.
import doto800 from "@fontsource/doto/files/doto-latin-800-normal.woff2";
import grotesk400 from "@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2";
import grotesk500 from "@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2";
import grotesk700 from "@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2";
import mono400 from "@fontsource/space-mono/files/space-mono-latin-400-normal.woff2";
import mono700 from "@fontsource/space-mono/files/space-mono-latin-700-normal.woff2";

const faces: [family: string, weight: number, src: string][] = [
  ["Doto", 800, doto800],
  ["Space Grotesk", 400, grotesk400],
  ["Space Grotesk", 500, grotesk500],
  ["Space Grotesk", 700, grotesk700],
  ["Space Mono", 400, mono400],
  ["Space Mono", 700, mono700],
];

export const fontsCss = faces
  .map(
    ([family, weight, src]) =>
      `@font-face { font-family: "${family}"; font-weight: ${weight}; font-style: normal; font-display: block; src: url(${src}) format("woff2"); }`,
  )
  .join("\n");
