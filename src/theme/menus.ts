// Popup menus and shut-down screens: the power submenu (STEAM button), other
// pop-out menu panels, and the dialogs the system shows when powering off.
// The STEAM menu sidebar itself is styled in mainMenu.ts; these are the
// surfaces around it. Radius 0 and one hairline keep the void look flat.
import { clsList } from "../steam/classes";

export function menusCss(): string {
  const join = (list: string[]) => list.join(", ");
  const of = (name: string, ...siblings: string[]) => clsList(name, ...siblings);

  // Generic popup menu (power submenu and similar). The menu module defines
  // both MenuPopup and MenuItem, which pins each class to the right copy.
  const popup = of("MenuPopup", "MenuItem");
  const rows = [...of("Item", "MenuPopup"), ...of("MenuItem", "MenuPopup")];
  const open = of("MenuOpen", "MenuPopup");
  const separator = of("Separator", "MenuPopup");
  const disabled = of("Disabled", "MenuPopup");
  const focused = rows.flatMap((selector) => [`${selector}.gpfocus`, `${selector}.gpfocuswithin`]);

  // Submenu panel of the STEAM menu (Power and similar).
  const submenu = of("PopupBody", "ActiveDot");

  // Shut-down screens and their buttons.
  const shutdown = of("ShutdownDialog", "Body");
  const shutdownBody = of("Body", "ShutdownDialog");
  const shutdownButtons = of("Buttons", "ShutdownDialog");
  const dialogButton = [
    ...of("Button", "ShutdownDialog"),
    ...of("ShutdownAppButton", "ForceShutdownButton"),
    ...of("ForceShutdownButton", "ShutdownAppButton"),
  ];
  const focusedButton = dialogButton.map((selector) => `${selector}.gpfocus`);

  return `
/* Popup menus: a flat panel with one hairline and ruled, monospace rows. */
${join(popup)} {
  background: var(--vd-surface) !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
${join(rows)} {
  background: transparent !important;
  color: var(--vd-ink-muted) !important;
  font-family: var(--vd-font-mono) !important;
  font-size: 11px !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
}
${join(open)} { color: var(--vd-ink) !important; }
${join(separator)} { background: var(--vd-line) !important; box-shadow: none !important; }
${join([...disabled, ...disabled.map((selector) => `${selector} *`)])} { color: var(--vd-ink-faint) !important; }

/* Focus: raised row with a white bar on the left */
${join(focused)} {
  background: var(--vd-surface-raised) !important;
  box-shadow: inset 2px 0 0 var(--vd-ink) !important;
  color: var(--vd-ink) !important;
}
${join(focused.map((selector) => `${selector} *`))} { color: inherit !important; }

/* Submenu panels of the STEAM menu */
${join(submenu)} {
  background: var(--vd-surface) !important;
  border: 1px solid var(--vd-line) !important;
  box-shadow: none !important;
}

/* Shut-down screens: void background, instrument-pill buttons. */
${join(shutdown)} { background: var(--vd-bg) !important; }
${join(shutdownBody)}, ${join(shutdownBody.map((selector) => `${selector} *`))} { color: var(--vd-ink) !important; }
${join(shutdownButtons)} { background: transparent !important; }
${join(dialogButton)} {
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
