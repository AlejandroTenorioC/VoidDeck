// Game details (/library/app/:id): restyled without replacing it, so the Play button preserves every
// state (install, update, queued, stop, etc.). Steam CSS pixel measurements (1px = 1.5 concept pixels).
import { clsList } from "../steam/classes";

const join = (list: string[], suffix = "") => list.map((s) => s + suffix).join(", ");

/** Repeats the class (".a.a") so a rule outranks Steam's own, more specific, ones. */
const paint = (list: string[], suffix: string) => list.map((s) => `${s}${s}${suffix}`);

export function detailsCss(): string {
  const of = (name: string, ...siblings: string[]) => clsList(name, ...siblings);
  const play = of("PlayButton", "PlayButtonContainer");
  const container = of("PlayButtonContainer", "PlayButton");
  const selector = of("StreamingSelector", "PlayButton");
  const menuButton = of("MenuButton", "ControllerConfigButton");
  const capsule = of("TopCapsule");
  const tabRow = of("TabHeaderRowWrapper");
  const label = of("PlayBarLabel");
  const value = of("PlayBarDetailLabel");
  const section = of("AppDetailsSectionContainer");
  const post = of("PostButton");
  const ring = "0 0 0 2px var(--vd-bg), 0 0 0 4px var(--vd-ink)";
  const mono = "font-family: var(--vd-font-mono) !important; font-weight: 400 !important; font-size: 9px !important; letter-spacing: .08em !important; color: var(--vd-ink-muted) !important;";

  return `
/* Void first: no blurred copy of the header behind the entire page */
${join(of("AppDetailsRoot"))} { background: var(--vd-bg) !important; }
${join(of("ImgBlurBackdrop"))} { display: none !important; }
${join(of("PlaySection"))} { background: transparent !important; }
/* The header fills the screen: image + the Play bar (80px) meet Steam's bottom bar
   (40px). Scrolling moves it up through Steam's outer scroller and reveals the tabs. */
${join(capsule)} { position: relative; height: calc(100vh - 120px) !important; }
${join([...of("HeaderBackgroundImage"), ...of("HeaderBackgroundImage").map((s) => s + " img")])} { height: 100% !important; }
${join(of("HeaderBackgroundImage"), " img")} { object-fit: cover !important; }
${join(of("ScrollContainer", "Glassy").flatMap((s) => of("Glassy", "ScrollContainer").map((g) => s + g)))} {
  background: var(--vd-bg) !important; background-image: none !important;
}
/* With the page scrolled, Steam's top bar would blur what remains underneath (the fixed Play button),
   so use a solid black background instead. */
${join(of("Header", "OverrideHeaderBackground"), "::before")} { background: var(--vd-bg) !important; backdrop-filter: none !important; }
${join(capsule, "::after")} {
  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 55%; pointer-events: none;
  background: linear-gradient(transparent, var(--vd-bg));
}
${join([...tabRow, ...tabRow.map((s) => s + "::before"), ...tabRow.map((s) => s + "::after")])} {
  background: var(--vd-bg) !important; background-image: none !important; backdrop-filter: none !important;
}

/* Play button: white pill with the concept's (A); the focus ring surrounds the entire pill */
${join(container)} { background: transparent !important; border-radius: 999px !important; }
${join(container, ":has(.gpfocus)")} { box-shadow: ${ring} !important; }
${join(play)} { background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; border-radius: 999px 0 0 999px !important; gap: 8px; }
${join(play, ":only-child")} { border-radius: 999px !important; }
${join(play, " *")} { color: var(--vd-on-ink) !important; }
${join(play, " svg")} { display: none !important; }
${join(play, "::before")} {
  content: "A"; display: inline-grid; place-items: center; width: 16px; height: 16px; margin-left: 4px;
  border-radius: 50%; border: 1px solid currentColor; font: 700 8px/1 var(--vd-font-mono);
}
${join(selector)} {
  background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;
  border-radius: 0 999px 999px 0 !important; border-left: 1px solid rgba(0, 0, 0, .2) !important;
}
${join(selector, " svg")} { fill: var(--vd-on-ink) !important; color: var(--vd-on-ink) !important; }
${join([...play, ...selector], ".gpfocus")} { box-shadow: none !important; outline: none !important; }

/* Controller and settings: outlined circles that invert on hover, like the Play button.
   The class is repeated so these rules outrank Steam's own (more specific) fill on the glyph. */
${join(menuButton)} { background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: 50% !important; box-sizing: border-box !important; color: var(--vd-ink) !important; }
${join(paint(menuButton, " svg"))} { color: var(--vd-ink) !important; fill: var(--vd-ink) !important; }
${join(paint(menuButton, " svg *"))} { color: var(--vd-ink) !important; fill: var(--vd-ink) !important; }
${join(paint(menuButton, ":hover"))} { background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; color: var(--vd-on-ink) !important; }
${join(paint(menuButton, ".gpfocus"))} { background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; color: var(--vd-on-ink) !important; }
${join(paint(menuButton, ":hover svg"))} { color: var(--vd-on-ink) !important; fill: var(--vd-on-ink) !important; }
${join(paint(menuButton, ":hover svg *"))} { color: var(--vd-on-ink) !important; fill: var(--vd-on-ink) !important; }
${join(paint(menuButton, ".gpfocus svg"))} { color: var(--vd-on-ink) !important; fill: var(--vd-on-ink) !important; }
${join(paint(menuButton, ".gpfocus svg *"))} { color: var(--vd-on-ink) !important; fill: var(--vd-on-ink) !important; }
${join(menuButton, ".gpfocus")} { box-shadow: ${ring} !important; }

/* Last session / playtime: monospaced label and dot-matrix value */
${join([...label, ...label.map((s) => s + " *")])} { ${mono} }
${join([...value, ...value.map((s) => s + " *")])} {
  font-family: var(--vd-font-dot) !important; font-weight: 800 !important; font-size: 17px !important; color: var(--vd-ink) !important;
}

/* Sections (friends, activity, events) on a thin-lined surface */
${join(section)} { background: var(--vd-surface) !important; border: 1px solid var(--vd-line) !important; border-radius: 11px !important; }
${join([...of("FriendsSectionSubHeading"), ...of("SectionHeader")])} { ${mono} }
${join([...of("PartnerEventMediumImage_Container"), ...of("PartnerEvent", "PartnerEventMediumImage_Container")])} {
  background: var(--vd-surface) !important; background-image: none !important; border-radius: 11px !important;
}
${join(of("Rule", "PartnerEvent"))} { background: var(--vd-line) !important; background-image: none !important; }
${join(of("PostTextEntryArea"))} { background: var(--vd-surface-raised) !important; border-radius: 8px !important; }
${join(post)} { background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: 999px !important; color: var(--vd-ink) !important; box-shadow: none !important; }
${join(post, ".gpfocus")} { box-shadow: ${ring} !important; border-color: var(--vd-ink) !important; }
`;
}
