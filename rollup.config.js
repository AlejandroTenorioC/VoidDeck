import deckyPlugin from "@decky/rollup";
import { readFileSync } from "node:fs";

// Incrusta las fuentes .woff2 como data URL: funcionan sin conexión y sin servir archivos aparte.
function inlineFonts() {
  return {
    name: "inline-fonts",
    load(id) {
      if (!id.endsWith(".woff2")) return null;
      const data = readFileSync(id).toString("base64");
      return `export default "data:font/woff2;base64,${data}";`;
    },
  };
}

export default deckyPlugin({
  plugins: [inlineFonts()],
});
