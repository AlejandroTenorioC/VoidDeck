// Steam Settings: make the page list and form fields speak the same quiet,
// dot-matrix language as Void Deck Home. Stable shell classes are intentionally
// used alongside runtime-resolved component classes so this survives Steam hashes.
import { clsList } from "../steam/classes";

// Rows, buttons and inputs are scoped to .DialogContent: Field is also used by the Quick Access rows,
// which have their own styling.
const SCOPE = ".DialogContent";

export function settingsCss(): string {
  const join = (selectors: string[]) => selectors.map((s) => `${SCOPE} ${s}`).join(", ");
  const field = clsList("Field", "FieldLabel");
  const fieldLabel = clsList("FieldLabel", "Field");
  const button = clsList("DialogButton");
  const focusedField = field.flatMap((selector) => [`${selector}.gpfocus`, `${selector}.gpfocuswithin`]);
  const focusedButton = button.map((selector) => `${selector}.gpfocus`);
  const list = clsList("PagedSettingsDialog_PageList");
  const item = clsList("PagedSettingsDialog_PageListItem");
  const activeItem = item.flatMap((i) => clsList("Active", "PagedSettingsDialog_PageListItem").map((a) => i + a));
  const sidebar = (selectors: string[], suffix: string) => selectors.map((s) => `.PageListColumn ${s}${suffix}`).join(", ");

  return `
/* Settings frame and content field */
.PageListColumn {
  background: var(--vd-bg) !important;
  border-right: 1px solid var(--vd-line) !important;
}
.DialogContent, .DialogContent_InnerWidth { background: var(--vd-bg) !important; }
.DialogContentTransition {
  background-color: var(--vd-bg) !important;
  background-image: radial-gradient(circle, var(--vd-ink-faint) 1px, transparent 1.3px) !important;
  background-size: 12px 12px !important;
}

/* Sidebar: quiet labels; the current page is marked with a dot (as in the main menu) and the focused
   row is raised. No rails: the list itself is a Panel holding focus, so a focus rail ran down the
   whole column. Steam's blue marker on the active page is a left border. */
${sidebar(list, "")} { background: transparent !important; box-shadow: none !important; }
${sidebar(item, "")}, ${sidebar(item, ".gpfocus")} {
  position: relative !important; background: transparent !important; box-shadow: none !important;
  border-left: 0 !important; border-radius: 0 !important; color: var(--vd-ink-muted) !important;
  font-family: var(--vd-font-mono) !important; font-size: 11px !important;
  letter-spacing: .08em !important; text-transform: uppercase !important;
}
${sidebar(item, " *")} { color: inherit !important; }
${sidebar(activeItem, "")} { color: var(--vd-ink) !important; }
${sidebar(activeItem, "::before")} {
  content: ""; position: absolute; left: 11px; top: 50%; width: 4px; height: 4px; margin-top: -2px;
  border-radius: 50%; background: var(--vd-ink);
}
${sidebar(item, ".gpfocus")} { background: var(--vd-surface-raised) !important; color: var(--vd-ink) !important; }

/* Setting rows become a precise ruled form rather than floating cards. */
${join(field)} {
  background: rgba(0, 0, 0, .72) !important;
  border-bottom: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
}
${join(focusedField)} {
  background: var(--vd-surface-raised) !important;
  box-shadow: inset 2px 0 0 var(--vd-ink) !important;
}
${join(fieldLabel)}, ${join(fieldLabel.map((selector) => `${selector} *`))} {
  font-family: var(--vd-font-mono) !important;
  letter-spacing: .06em !important;
}

/* Inputs and action buttons are simple outlined instruments. */
${SCOPE} .DialogTextInputBase, ${SCOPE} input.DialogInput {
  background: var(--vd-bg) !important;
  border: 1px solid var(--vd-line-strong) !important;
  border-radius: 0 !important;
  color: var(--vd-ink) !important;
  box-shadow: none !important;
}
${SCOPE} :is(.DialogTextInputBase, input.DialogInput):is(:focus, .gpfocus) {
  border-color: var(--vd-ink) !important;
  box-shadow: 0 0 0 2px var(--vd-bg), 0 0 0 4px var(--vd-ink) !important;
}
${join(button)} {
  background: transparent !important;
  border: 1px solid var(--vd-line-strong) !important;
  border-radius: 999px !important;
  color: var(--vd-ink) !important;
  font-family: var(--vd-font-mono) !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
}
${join(focusedButton)} {
  background: var(--vd-ink) !important;
  border-color: var(--vd-ink) !important;
  box-shadow: 0 0 0 2px var(--vd-bg), 0 0 0 4px var(--vd-ink) !important;
  color: var(--vd-on-ink) !important;
}
${join(focusedButton.map((selector) => `${selector} *`))} { color: inherit !important; }
`;
}
