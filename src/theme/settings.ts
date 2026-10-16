// Steam Settings: make the page list and form fields speak the same quiet,
// dot-matrix language as Void Deck Home. Stable shell classes are intentionally
// used alongside runtime-resolved component classes so this survives Steam hashes.
import { clsList } from "../steam/classes";

export function settingsCss(): string {
  const join = (selectors: string[]) => selectors.join(", ");
  const field = clsList("Field", "FieldLabel");
  const fieldLabel = clsList("FieldLabel", "Field");
  const button = clsList("DialogButton");
  const focusedField = field.flatMap((selector) => [`${selector}.gpfocus`, `${selector}.gpfocuswithin`]);
  const focusedButton = button.map((selector) => `${selector}.gpfocus`);

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

/* Sidebar: quiet labels, a lit row, and a clean white focus rail. */
.PageListColumn .Panel {
  background: transparent !important;
  border-radius: 0 !important;
  color: var(--vd-ink-muted) !important;
  font-family: var(--vd-font-mono) !important;
  font-size: 11px !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
}
.PageListColumn .Panel * { color: inherit !important; }
.PageListColumn .Panel.gpfocus, .PageListColumn .Panel:focus-within {
  background: var(--vd-surface-raised) !important;
  box-shadow: inset 2px 0 0 var(--vd-ink) !important;
  color: var(--vd-ink) !important;
}

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
.DialogTextInputBase, input.DialogInput {
  background: var(--vd-bg) !important;
  border: 1px solid var(--vd-line-strong) !important;
  border-radius: 0 !important;
  color: var(--vd-ink) !important;
  box-shadow: none !important;
}
.DialogTextInputBase:focus, input.DialogInput:focus, .DialogTextInputBase.gpfocus, input.DialogInput.gpfocus {
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
