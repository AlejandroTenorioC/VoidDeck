// The Steam Deck on-screen keyboard: a black matrix of square keys with dot-matrix letters.
import { clsList } from "../steam/classes";
import { join, paint } from "./selectors";

/** Dot grid behind the text buffer, like the dot meters in Quick Access. */
const dots = (color: string) => `radial-gradient(circle, ${color} 1.4px, transparent 1.8px) 0 0 / 6px 6px repeat`;

/** Selectors for a Steam class: the Decky class map when the Deck publishes it, plus the hashed
    CSS-module form other pads and SteamOS use (`virtualkeyboard_KeyboardKey_2KhPX`). The hash is
    rewritten on every Steam update, so match the readable name and its `_` delimiter and let the
    hash be whatever the update made it. */
const of = (name: string): string[] => [
  ...clsList(name).filter((c) => c !== ".vd-missing"),
  `[class~="${name}"]`,
  `[class*="${name}_"]`,
];

/** A rule, or nothing when Steam has not published the classes it needs. */
const rule = (selectors: string[], body: string): string =>
  selectors.length ? `${join(selectors)} { ${body} }` : "";

/** The letter of a key: Steam draws it as a bare span, without a class of its own. */
const LABEL = " span:not([class])";

/** Every selector of the first list followed by every selector of the second. */
const pairs = (list: string[], others: string[]): string[] =>
  list.flatMap((a) => others.map((b) => `${a} ${b}`));

export function keyboardCss(): string {
  const panel = [
    // The keyboard root itself, which carries `DefaultTheme` and `virtualkeyboard_Keyboard_<hash>`.
    '[class*="Keyboard_"]',
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
  // The keyboard root and the extended keys, matched by their stable readable names.
  const root = ['.DefaultTheme[class*="Keyboard_"]', '[class*="Keyboard_"]'];
  const extended = ['[class*="KeyboardExtendedKey_"]'];
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
    ...of("KeyboardNavKeyRight"),
  ];
  const tile = [
    ...of("KeyboardEmojiKey"),
    ...of("KeyboardSteamItemKey"),
    ...of("KeyboardImeLutKey"),
    ...of("KeyboardImeLutNav"),
  ];
  const mono = "font-family: var(--vd-font-mono) !important; font-weight: 400 !important;";
  const shifted = of("ShiftedLabel");
  // The combined keyboard names its label; the plain one leaves the letter as a bare span.
  const letter = [...paint(key, LABEL), ...paint(of("KeyboardKeyLabel"))];

  return `
/* Panel: a black slab with a hairline frame, square like the matrix of keys inside it */
${rule(panel, "background-color: var(--vd-bg) !important; background-image: none !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; box-shadow: none !important; backdrop-filter: none !important;")}

/* Steam paints the keyboard through its own custom properties rather than through backgrounds.
   Set them here so the panel and every key come out black whatever Steam's own rules declare. */
${rule(root, "--background-color: var(--vd-bg) !important; --foreground-color: var(--vd-ink) !important; --key-color: var(--vd-ink) !important; --key-focused-color: var(--vd-on-ink) !important;")}
${rule(key, "--key-background-color: transparent !important; --key-focused-background-color: var(--vd-ink) !important; --key-spacebar-background-color: transparent !important; --key-caps-background-color: transparent !important; --key-shift-background-color: transparent !important; --key-tab-background-color: transparent !important; --key-enter-background-color: transparent !important; --key-backspace-background-color: transparent !important; --key-meta-background-color: transparent !important;")}
${rule(extended, "--key-extendedkey-background-color: transparent !important; --key-extendedkey-focused-background-color: var(--vd-ink) !important;")}

/* Keys: square cells of a matrix — black, hairline border, no rounded keycap */
${rule(key, "background: transparent !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; box-shadow: none !important; color: var(--vd-ink) !important; padding: var(--vd-space-1) var(--vd-space-2) !important; min-width: 0 !important;")}
${rule(paint(key, ".gpfocus"), "background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}

/* The clickable area inside a key must not draw anything of its own */
${rule(of("KeyboardKeyHitArea"), "background: transparent !important; border: 0 !important; box-shadow: none !important;")}

/* The letter: dot matrix, the same type as the numbers of the Home screen */
${rule(letter, "font-family: var(--vd-font-dot) !important; font-weight: 800 !important; font-size: 22px !important; line-height: 1 !important; letter-spacing: 0 !important; color: var(--vd-ink) !important;")}
${rule(pairs(paint(key, ".gpfocus"), ["span:not([class])"]), "color: var(--vd-on-ink) !important;")}

/* The word on a modifier key reads better in small caps than in dots */
${rule(paint(wide, LABEL), `${mono} font-size: 11px !important; letter-spacing: .1em !important; text-transform: uppercase !important;`)}
${rule(pairs(paint(wide, ".gpfocus"), ["span:not([class])"]), "color: var(--vd-on-ink) !important;")}

/* The shifted symbol above a letter */
${rule(shifted, `${mono} font-size: 10px !important; line-height: 1 !important; letter-spacing: .06em !important; color: var(--vd-ink-muted) !important;`)}
${rule(pairs(paint(key, ".gpfocus"), shifted), "color: var(--vd-on-ink) !important;")}

/* Dead key held down */
${rule(of("KeyboardKeyDeadKeyActive"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; border-color: var(--vd-ink) !important;")}
${rule(paint(of("KeyboardKeyDeadKeyActive"), LABEL), "color: var(--vd-on-ink) !important;")}

/* Text buffer: what has been typed, over a dot grid */
${rule(of("VirtualKeyboardTextBuffer"), `background: var(--vd-bg) ${dots("var(--vd-ink-faint)")} !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; box-shadow: none !important;`)}
${rule(of("VirtualKeyboardTextBufferText"), `${mono} font-size: 14px !important; color: var(--vd-ink) !important;`)}
${rule(of("VirtualKeyboardTextBufferCursor"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}

/* Action buttons: square cells that invert on focus */
${rule(action, "background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: 0 !important; box-shadow: none !important; color: var(--vd-ink) !important;")}
${rule(paint(action, ".gpfocus"), "background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; color: var(--vd-on-ink) !important;")}
${rule(action, `${mono} font-size: 11px !important; letter-spacing: .1em !important; text-transform: uppercase !important;`)}
${rule(paint(action, ".gpfocus").map((s) => `${s} span`), "color: var(--vd-on-ink) !important;")}

/* Categories: the active one is a white cell */
${rule(of("KeyboardCategoryKeyHighlight"), "background: var(--vd-ink) !important; color: var(--vd-on-ink) !important; border-radius: 0 !important;")}
${rule(of("KeyboardEmojiCategory"), "background: transparent !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; color: var(--vd-ink) !important;")}
${rule(of("KeyboardEmojiCategoryDivider"), "background: var(--vd-line) !important;")}

/* Emoji, Steam items and IME candidates: flat cells */
${rule(tile, "background: transparent !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important; box-shadow: none !important;")}
${rule(paint(tile, ".gpfocus"), "background: var(--vd-ink) !important; border-color: var(--vd-ink) !important;")}
${rule(of("KeyboardEmojiContainer"), "background: var(--vd-bg) !important; border: 1px solid var(--vd-line) !important; border-radius: 0 !important;")}

/* Emoji header */
${rule(of("KeyboardEmojiHeader"), `${mono} font-size: 10px !important; letter-spacing: .08em !important; color: var(--vd-ink-muted) !important;`)}
${rule(of("KeyboardImeLutActionGlyph"), "color: var(--vd-ink) !important;")}

/* IME: the text being composed */
${rule(of("KeyboardImePreeditText"), `${mono} color: var(--vd-ink) !important; border-bottom: 1px dashed var(--vd-ink-muted) !important;`)}
${rule(of("KeyboardImeAuxText"), `${mono} color: var(--vd-ink-muted) !important;`)}
${rule(of("KeyboardImeUnavailable"), "color: var(--vd-ink-muted) !important;")}

/* Steam item list */
${rule(of("KeyboardSteamItems"), "background: var(--vd-bg) !important; border-top: 1px solid var(--vd-line) !important;")}

/* Theme and layout options */
${rule([...of("KeyboardThemeButtons"), ...of("KeyboardLayoutOptions"), ...of("ShowKeyboardButton")], "background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: 0 !important; color: var(--vd-ink) !important;")}

/* The invisible layer that captures typing must not draw anything */
${rule(of("KeyboardCapture"), "background: transparent !important; border: 0 !important; box-shadow: none !important;")}
`;
}
