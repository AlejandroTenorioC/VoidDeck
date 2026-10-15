// Versión mínima de @decky/api para el preview: el CSS "de Steam" se inyecta en esta página.
import type { DefinePluginFn } from "@decky/api/dist/types";

export const definePlugin = (fn: DefinePluginFn) => fn;

const styles = new Map<string, HTMLStyleElement>();

export function injectCssIntoTab(tab: string, css: string): string {
  const el = document.createElement("style");
  el.dataset.tab = tab;
  el.textContent = css;
  document.head.appendChild(el);
  styles.set(css, el);
  return css;
}

export function removeCssFromTab(_tab: string, css: string): void {
  styles.get(css)?.remove();
  styles.delete(css);
}
