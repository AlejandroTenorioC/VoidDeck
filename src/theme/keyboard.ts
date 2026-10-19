// The Steam Deck on-screen keyboard: pure black panel, hairline keys, inverted focus.
import { clsList } from "../steam/classes";
import { join, paint } from "./selectors";

/** Dot grid behind the text buffer, like the dot meters in Quick Access. */
const dots = (color: string) => `radial-gradient(circle, ${color} 1.4px, transparent 1.8px) 0 0 / 6px 6px repeat`;

/** Selectors for a Steam class, without the placeholder used when Steam has not published it. */
const of = (name: string): string[] => clsList(name).filter((c) => c !== ".vd-missing");

/** The same selectors with something appended (".gpfocus", " svg"…). */
const withSuffix = (list: string[], suffix: string): string[] => list.map((s) => s + suffix);

/** A rule, or nothing when Steam has not published the classes it needs. */
const rule = (selectors: string[], body: string): string =>
  selectors.length ? `${join(selectors)} { ${body} }` : "";

export function keyboardCss(): string {
  const panel = [
    ...of("VirtualKeyboardContainer"),
    ...of("ModalVirtualKeyboardContainer"),
    ...of("VirtualKeyboardStandaloneContainer"),
    ...of("CombinedKeyboardContainer"),
    ...of("KeyboardContainer"),
    ...of("KeyboardPageContainer"),
    ...of("VRFloatingKeyboard"),
    ...of("VRVirtualKeyboardContents"),
  ];
  const key = of("KeyboardKey");
  const wide = [
    ...of("KeyboardSpacebar"),
    ...of("KeyboardTabKey"),
    ...of("KeyboardCapsKey"),
    ...of("KeyboardEnter"),
    ...of("KeyboardBackspace"),
    ...of("KeyboardLeftShift"),
    ...of("KeyboardRightShift"),
    ...of("KeyboardMetaKey"),
  ];
  const action = [
    ...of("KeyboardActionButtonLeft"),
    ...of("KeyboardActionButtonRight"),
    ...of("KeyboardActionButtonCenterLeft"),
    ...of("KeyboardButton"),
  ];
  const tile = [...of("KeyboardEmojiKey"), ...of("KeyboardSteamItemKey"), ...of("KeyboardImeLutKey")];
  const ring = "0 0 0 2px var(--vd-bg), 0 0 0 4px var(--vd-ink)";
  const mono = "font-family: var(--vd-font-mono) !important; font-weight: 400 !important;";

  return `
/* Panel: pure black with a hairline frame */
${rule(panel, "background-color: var(--vd-bg) !important; background-image: none !important; border: 1px solid var(--vd-line) !important; border-radius: var(--vd-radius-md) !important; box-shadow: none !important; backdrop-filter: none !important;")}

/* Keys: flat, hairline border, inverted when focused */
${rule(key, "background: var(--vd-surface-raised) !important; border: 1px solid var(--vd-line) !important; border-radius: var(--vd-radius-sm) !important; box-shadow: none !important; color: var(--vd-ink) !important; padding: var(--vd-space-1) var(--vd-space-2) !important; min-width: 0 !important;")}
${rule(paint(key, ".gpfocus"), "background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}
${rule(withSuffix(key, ".gpfocus"), `box-shadow: ${ring} !important;`)}

/* Wide keys: space bar and modifiers */
${rule(wide, "background: var(--vd-surface) !important;")}

/* Dead key held down */
${rule(of("KeyboardKeyDeadKeyActive"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; border-color: var(--vd-ink) !important;")}

/* Key labels: monospaced, the shifted character in a smaller tone */
${rule([...of("KeyboardKeyLabel"), ...of("ShiftedLabel")], `${mono} font-size: 11px !important; letter-spacing: .06em !important; color: inherit !important;`)}
${rule(of("ShiftedLabel"), "font-size: 9px !important; color: var(--vd-ink-muted) !important;")}

/* Text buffer: what has been typed, over a dot grid */
${rule(of("VirtualKeyboardTextBuffer"), `background: var(--vd-bg) ${dots("var(--vd-ink-faint)")} !important; border: 1px solid var(--vd-line) !important; border-radius: var(--vd-radius-sm) !important; box-shadow: none !important;`)}
${rule(of("VirtualKeyboardTextBufferText"), `${mono} font-size: 14px !important; color: var(--vd-ink) !important;`)}
${rule(of("VirtualKeyboardTextBufferCursor"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}

/* Action buttons: outlined pills that invert on focus */
${rule(action, "background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: var(--vd-radius-pill) !important; box-shadow: none !important; color: var(--vd-ink) !important;")}
${rule(paint(action, ".gpfocus"), "background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}

/* Categories: the active one is a white pill */
${rule(of("KeyboardCategoryKeyHighlight"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; border-radius: var(--vd-radius-pill) !important;")}
${rule(of("KeyboardEmojiCategoryDivider"), "background: var(--vd-line) !important;")}

/* Emoji, Steam items and IME candidates: flat tiles */
${rule(tile, "background: var(--vd-surface-raised) !important; border: 1px solid var(--vd-line) !important; border-radius: var(--vd-radius-sm) !important; box-shadow: none !important;")}
${rule(paint(tile, ".gpfocus"), "background: var(--vd-ink) !important; border-color: var(--vd-ink) !important;")}

/* Emoji header */
${rule(of("KeyboardEmojiHeader"), `${mono} font-size: 10px !important; letter-spacing: .08em !important; color: var(--vd-ink-muted) !important;`)}

/* IME: the text being composed */
${rule(of("KeyboardImePreeditText"), `${mono} color: var(--vd-ink) !important; border-bottom: 1px dashed var(--vd-ink-muted) !important;`)}
${rule(of("KeyboardImeAuxText"), `${mono} color: var(--vd-ink-muted) !important;`)}

/* Steam item list */
${rule(of("KeyboardSteamItems"), "background: var(--vd-bg) !important; border-top: 1px solid var(--vd-line) !important;")}

/* Theme and layout options */
${rule([...of("KeyboardThemeButtons"), ...of("KeyboardLayoutOptions"), ...of("ShowKeyboardButton")], "background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: var(--vd-radius-pill) !important; color: var(--vd-ink) !important;")}

/* The invisible layer that captures typing must not draw anything */
${rule(of("KeyboardCapture"), "background: transparent !important; border: 0 !important; box-shadow: none !important;")}
`;
}
