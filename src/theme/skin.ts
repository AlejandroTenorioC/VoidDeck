// Layer 1 CSS: apply Void Deck tokens to Steam classes.
import { cls } from "../steam/classes";
import { statusDotsCss } from "../steam/statusDots";
import { detailsCss } from "./details";
import { fontsCss } from "./fonts";
import { footerCss } from "./footer";
import { keyboardCss } from "./keyboard";
import { libraryCss } from "./library";
import { mainMenuCss } from "./mainMenu";
import { contextMenuCss, menusCss } from "./menus";
import { quickAccessCss } from "./quickAccess";
import { settingsCss } from "./settings";
import { sliderCss } from "./slider";
import { transitionsCss } from "./transitions";
import { tokensCss, type Theme } from "./tokens";
import { volumeCss } from "./volume";

export function skinCss(theme: Theme): string {
  return `
${fontsCss}
${tokensCss(theme)}

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
${footerCss()}

/* Any Steam button-prompt art anywhere (Deck, Xbox, Ally…) becomes monochrome */
img[src*="shared_buttons_"], img[src*="/steaminputglyphs/"] { filter: grayscale(1) brightness(2.2) !important; }

/* Main menu (STEAM button) */
${mainMenuCss()}

/* Popup menus, the power submenu and shut-down screens */
${menusCss()}

/* Gamepad context menus (the ⋯ hamburger on a poster or library tile) */
${contextMenuCss()}

/* Quick Access */
${quickAccessCss()}

/* Volume overlays */
${volumeCss()}

/* Icon sliders (Quick Access brightness and volume) */
${sliderCss()}

/* On-screen keyboard */
${keyboardCss()}

/* Steam Settings */
${settingsCss()}

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
