import deckyPlugin from "@decky/rollup";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Embed typefaces as data URLs so the plugin works offline.
function inlineAssets() {
  return {
    name: "inline-assets",
    load(id) {
      if (!id.endsWith(".woff2")) return null;
      const data = readFileSync(id).toString("base64");
      return `export default "data:font/woff2;base64,${data}";`;
    },
  };
}

// Decky's asset plugin handles SVG files as emitted files. Generate one virtual module instead,
// so selected controller prompts are embedded as data URLs in the single plugin bundle.
const BUTTON_ASSETS = "virtual:voiddeck-button-assets";
function inlineButtonAssets() {
  return {
    name: "inline-button-assets",
    resolveId(id) {
      return id === BUTTON_ASSETS ? id : null;
    },
    load(id) {
      if (id !== BUTTON_ASSETS) return null;
      const root = new URL("./src/assets/buttons/", import.meta.url);
      const dataUrl = (style, button) => {
        const svg = readFileSync(join(root.pathname, style, `${button}.svg`)).toString("base64");
        return `data:image/svg+xml;base64,${svg}`;
      };
      const glyphs = Object.fromEntries(
        ["steam", "xbox", "ally"].map((style) => [
          style,
          Object.fromEntries(["a", "b", "x", "y"].map((button) => [button, dataUrl(style, button)])),
        ]),
      );
      return `export const buttonGlyphs = ${JSON.stringify(glyphs)};`;
    },
  };
}

export default deckyPlugin({
  plugins: [inlineAssets(), inlineButtonAssets()],
});
