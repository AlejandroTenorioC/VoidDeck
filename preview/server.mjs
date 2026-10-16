// Browser preview: builds src/ with Decky stubs and reloads on save.
import * as esbuild from "esbuild";
import { fileURLToPath } from "node:url";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const port = Number(process.env.PORT ?? 5173);

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
  define: { "process.env.NODE_ENV": '"development"' },
  logLevel: "info",
});

await ctx.watch();
await ctx.serve({ servedir: here("./public"), port });
console.log(`\n  Void Deck preview → http://localhost:${port}\n`);
