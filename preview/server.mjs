// Browser preview: builds src/ with Decky stubs and reloads on save.
import * as esbuild from "esbuild";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const port = Number(process.env.PORT ?? 5173);

// The controller prompts live in a virtual module that rollup generates (see rollup.config.js);
// the preview builds the same sources, so it needs the same module.
const BUTTON_ASSETS = "virtual:voiddeck-button-assets";
const buttonAssets = {
  name: "button-assets",
  setup(build) {
    build.onResolve({ filter: /^virtual:voiddeck-button-assets$/ }, (args) => ({
      path: args.path,
      namespace: "vd-assets",
    }));
    build.onLoad({ filter: /.*/, namespace: "vd-assets" }, () => {
      const root = here("../src/assets/buttons/");
      const dataUrl = (style, button) =>
        `data:image/svg+xml;base64,${readFileSync(join(root, style, `${button}.svg`)).toString("base64")}`;
      const glyphs = Object.fromEntries(
        ["steam", "xbox", "ally"].map((style) => [
          style,
          Object.fromEntries(["a", "b", "x", "y"].map((button) => [button, dataUrl(style, button)])),
        ]),
      );
      return { contents: `export const buttonGlyphs = ${JSON.stringify(glyphs)};` };
    });
  },
};

const ctx = await esbuild.context({
  entryPoints: [here("./main.tsx")],
  bundle: true,
  outdir: here("./public/build"),
  format: "esm",
  jsx: "automatic",
  loader: { ".woff2": "dataurl" },
  sourcemap: true,
  alias: {
    "@decky/ui": here("./stubs/decky-ui.tsx"),
    "@decky/api": here("./stubs/decky-api.ts"),
  },
  plugins: [buttonAssets],
  define: { "process.env.NODE_ENV": '"development"' },
  logLevel: "info",
});

await ctx.watch();
await ctx.serve({ servedir: here("./public"), port });
console.log(`\n  Void Deck preview → http://localhost:${port}\n`);
