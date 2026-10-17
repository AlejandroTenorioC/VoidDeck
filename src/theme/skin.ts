// CSS de la capa 1: aplica los tokens de Void Deck sobre las clases de Steam.
import { cls } from "../steam/classes";
import { statusDotsCss } from "../steam/statusDots";
import { detailsCss } from "./details";
import { fontsCss } from "./fonts";
import { footerCss } from "./footer";
import { libraryCss } from "./library";
import { mainMenuCss } from "./mainMenu";
import { quickAccessCss } from "./quickAccess";
import { settingsCss } from "./settings";
import { transitionsCss } from "./transitions";
import { tokensCss, type Theme } from "./tokens";

/** Atributo que `src/skin.ts` pone en cada documento mientras hay un juego en marcha. */
export const IN_GAME_ATTR = "data-vd-ingame";

export function skinCss(theme: Theme): string {
  return `
${fontsCss}
${tokensCss(theme)}

/* Tipografía: Space Grotesk para todo el texto (las pantallas propias gestionan la suya) */
/* :where() deja la regla sin especificidad para que las reglas concretas (reloj, etiquetas) ganen */
:where(body, body *:not(.vd-home-viewport *)) { font-family: var(--vd-font-sans) !important; }

/* Vacío primero: fondo negro puro. Con un juego en marcha Steam deja estas capas transparentes para que el
   juego se vea detrás de los menús: ahí no se fuerza el negro. */
html:not([${IN_GAME_ATTR}]) :is(body, ${cls("BasicUiRoot")}, ${cls("BasicHome")}) {
  background: var(--vd-bg) !important;
  background-image: none !important;
}
${cls("RecentGamesBackground")} { display: none !important; }
${cls("GreyBackground")} { background-color: var(--vd-surface-raised) !important; }
${cls("BasicFooter")} {
  background: var(--vd-bg) !important;
  border-top: 1px solid var(--vd-line) !important;
}

/* Números del sistema en matriz de puntos */
${cls("Clock", "HeaderItem")}, ${cls("Percentage")} {
  font-family: var(--vd-font-dot) !important;
  font-weight: 800 !important;
}

/* Pistas de controles de la barra inferior */
${footerCss()}

/* Menú principal (botón STEAM) */
${mainMenuCss()}

/* Acceso rápido */
${quickAccessCss()}

/* Ajustes de Steam */
${settingsCss()}

/* Transición al salir del Inicio */
${transitionsCss()}

/* Ficha del juego */
${detailsCss()}

/* Biblioteca y páginas con pestañas */
${libraryCss()}

/* Wifi y batería como medidores de puntos */
${statusDotsCss()}

/* Etiquetas y pistas de controles en monoespaciada */
${cls("Tab")}, ${cls("ActionButtonLabel")} {
  font-family: var(--vd-font-mono) !important;
  letter-spacing: 0.08em;
}
`;
}
