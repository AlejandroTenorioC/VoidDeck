// Transition when leaving Void Deck Home: the incoming screen appears through a grid of dots
// that grow to cover it. Steam sequences exit and entry (one leaves before the other enters), so
// the incoming screen cannot know its source: Home marks the document as it unmounts (FROM_HOME).
import { cls } from "../steam/classes";

export const FROM_HOME_ATTR = "data-vd-from";
export const FROM_HOME_VALUE = "home";
/** Mark duration: covers Steam's entry transition (~800 ms, its JavaScript's maximum duration). */
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

/* Home exit: a short fade from the first frame, without Steam's zoom (waiting for ExitActive
   would leave a Home "ghost" behind the incoming screen). */
${tl}${exit}:has(.vd-home-viewport), ${tl}${exit}${exitActive}:has(.vd-home-viewport) {
  opacity: 0 !important; transform: none !important; transition: opacity 120ms ease !important;
}

/* Entry: dots with a growing radius in an 8px grid (a 6px radius covers it completely). It starts
   as Home fades: a crossfade through the dot grid. */
${fromHome} ${tl}${enter}:not(:has(.vd-home-viewport)) {
  opacity: 1 !important; transform: none !important; transition: none !important;
  -webkit-mask-image: radial-gradient(circle, #000 var(--vd-dot), transparent calc(var(--vd-dot) + 0.6px));
  -webkit-mask-size: 8px 8px;
  animation: vd-dots-in 480ms cubic-bezier(.4, 0, .2, 1) 40ms both;
}
`;
}
