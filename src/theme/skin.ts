// Layer 1 CSS: apply Void Deck tokens to Steam classes.
import { cls } from "../steam/classes";
import { statusDotsCss } from "../steam/statusDots";
import { detailsCss } from "./details";
import { fontsCss } from "./fonts";
import { footerCss } from "./footer";
import { libraryCss } from "./library";
import { mainMenuCss } from "./mainMenu";
import { quickAccessCss } from "./quickAccess";
import { transitionsCss } from "./transitions";
import { tokensCss, type Theme } from "./tokens";
import type { Accent, ButtonStyle } from "../preferences";

export function skinCss(theme: Theme, accent: Accent = "red", buttonStyle: ButtonStyle = "steam"): string {
  return `
${fontsCss}
${tokensCss(theme, ":root", accent)}

/* Typography: Space Grotesk for all text (custom screens manage their own) */
/* :where() keeps this rule at zero specificity so specific rules (clock, labels) win */
:where(body, body *:not(.vd-home-viewport *)) { font-family: var(--vd-font-sans) !important; }

/* Void first: pure black background */
body, ${cls("BasicUiRoot")}, ${cls("BasicHome")} {
  background: var(--vd-bg) !important;
  background-image: none !important;
}
${cls("RecentGamesBackground")} { display: none !important; }
${cls("GreyBackground")} { background-color: var(--vd-surface-raised) !important; }
${cls("BasicFooter")} {
  background: var(--vd-bg) !important;
  border-top: 1px solid var(--vd-line) !important;
}

/* System numbers in dot matrix */
${cls("Clock", "HeaderItem")}, ${cls("Percentage")} {
  font-family: var(--vd-font-dot) !important;
  font-weight: 800 !important;
}

/* Bottom-bar control hints */
${footerCss(buttonStyle)}

/* Main menu (STEAM button) */
${mainMenuCss()}

/* Quick Access */
${quickAccessCss()}

/* Transition when leaving Home */
${transitionsCss()}

/* Game details */
${detailsCss()}

/* Library and tabbed pages */
${libraryCss()}

/* Wi-Fi and battery as dot meters */
${statusDotsCss()}

/* Monospace labels and control hints */
${cls("Tab")}, ${cls("ActionButtonLabel")} {
  font-family: var(--vd-font-mono) !important;
  letter-spacing: 0.08em;
}
`;
}
