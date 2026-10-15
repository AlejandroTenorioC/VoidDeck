// Capa 1: piel global. Inyecta el CSS de Void Deck en la UI de Steam.
import { injectCssIntoTab, removeCssFromTab } from "@decky/api";
import { tokensCss, type Theme } from "./theme/tokens";

// Pestaña CEF de la interfaz principal de Steam (Game Mode).
const STEAM_TAB = "SP";

let injected: string | null = null;
let theme: Theme = "dark";

export function applySkin(next: Theme): void {
  removeSkin();
  const css = tokensCss(next);
  injectCssIntoTab(STEAM_TAB, css);
  injected = css;
  theme = next;
}

export function removeSkin(): void {
  if (injected === null) return;
  removeCssFromTab(STEAM_TAB, injected);
  injected = null;
}

/** Estado actual, para que el panel lo muestre al volver a abrirse. */
export function skinState(): { on: boolean; theme: Theme } {
  return { on: injected !== null, theme };
}
