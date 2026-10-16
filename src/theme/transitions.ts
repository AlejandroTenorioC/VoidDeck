// Transición al salir del Inicio de Void Deck: la pantalla nueva aparece a través de una retícula de puntos
// que crecen hasta cubrirla. Steam encadena salida y entrada (primero sale una, luego entra la otra), así que
// la pantalla que entra no sabe de dónde viene: el Inicio marca el documento al desmontarse (FROM_HOME).
import { cls } from "../steam/classes";

export const FROM_HOME_ATTR = "data-vd-from";
export const FROM_HOME_VALUE = "home";
/** Cuánto dura la marca: cubre la entrada de Steam (~800 ms, la duración máxima que fija su JavaScript). */
export const FROM_HOME_MS = 1000;

export function transitionsCss(): string {
  const tl = cls("TopLevelTransition", "EnterActive");
  const exit = cls("Exit", "TopLevelTransition");
  const exitActive = cls("ExitActive", "TopLevelTransition");
  const enter = cls("Enter", "TopLevelTransition");
  const fromHome = `html[${FROM_HOME_ATTR}="${FROM_HOME_VALUE}"]`;

  return `
@property --vd-dot { syntax: "<length>"; inherits: false; initial-value: 0px; }
@keyframes vd-dots-in { from { --vd-dot: 0px; } to { --vd-dot: 6px; } }

/* Salida del Inicio: fundido corto desde el primer instante, sin el zoom de Steam (si esperase a ExitActive
   quedaría un "fantasma" del Inicio detrás de la pantalla que entra) */
${tl}${exit}:has(.vd-home-viewport), ${tl}${exit}${exitActive}:has(.vd-home-viewport) {
  opacity: 0 !important; transform: none !important; transition: opacity 120ms ease !important;
}

/* Entrada: puntos de radio creciente en una retícula de 8 px (6 px de radio la cubre entera). Empieza a la vez
   que se desvanece el Inicio: un fundido cruzado a través de la retícula. */
${fromHome} ${tl}${enter}:not(:has(.vd-home-viewport)) {
  opacity: 1 !important; transform: none !important; transition: none !important;
  -webkit-mask-image: radial-gradient(circle, #000 var(--vd-dot), transparent calc(var(--vd-dot) + 0.6px));
  -webkit-mask-size: 8px 8px;
  animation: vd-dots-in 480ms cubic-bezier(.4, 0, .2, 1) 40ms both;
}
`;
}
