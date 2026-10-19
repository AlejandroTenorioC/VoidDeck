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

/**
 * The gamepad context menu: the (⋯) menu of a library tile and the hamburger
 * menu of a Void Deck poster. Steam builds it as a BasicContextMenu, a class
 * family of its own (not the MenuPopup popups above), so it needs its own
 * block. Flat surface, one hairline, monospace rows and an inverted focus bar.
 */
export function contextMenuCss(): string {
  const join = (list: string[]) => list.join(", ");
  const of = (name: string, ...siblings: string[]) => clsList(name, ...siblings);
  // Every name lives in the module that publishes BasicContextMenuModal: the
  // sibling pins each class to it instead of a same-named class elsewhere.
  const modal = "BasicContextMenuModal";

  const scrim = of("contextMenu", modal);
  const container = of("BasicContextMenuContainer", modal);
  const contents = of("contextMenuContents", modal);
  const header = [...of("BasicContextMenuHeader", modal), ...of("BasicContextMenuHeaderShrinkableSpacing", modal)];
  const rows = of("contextMenuItem", modal);
  const selected = [
    ...rows.flatMap((selector) => [`${selector}.gpfocus`, `${selector}.gpfocuswithin`]),
    ...of("Focused", modal),
    ...of("Selected", modal),
  ];
  const separator = of("ContextMenuSeparator", modal);
  const sectionHeader = of("MenuSectionHeader", modal);
  const submenu = of("SubMenu", modal);
  const arrow = of("Arrow", modal);
  const banner = [...of("Destructive", modal), ...of("Emphasis", modal), ...of("Positive", modal)];

  return `
/* Gamepad context menu (the ⋯ menu of a poster or library tile) */
${join(scrim)} { background-color: rgba(0, 0, 0, .62) !important; }
${join(container)} {
  background: var(--vd-surface) !important;
  background-image: none !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
${join(contents)} { background: transparent !important; border: none !important; }
${join(header)} {
  background: transparent !important;
  border-bottom: 1px solid var(--vd-line) !important;
  color: var(--vd-ink) !important;
  font-family: var(--vd-font-mono) !important;
  font-size: 11px !important;
  letter-spacing: .12em !important;
  text-transform: uppercase !important;
}
${join(rows)} {
  background: transparent !important;
  border-radius: 0 !important;
  color: var(--vd-ink-muted) !important;
  font-family: var(--vd-font-mono) !important;
  font-size: 11px !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
}
${join(rows.map((selector) => `${selector} *`))}, ${join(selected)} { color: inherit !important; }
${join(selected)} {
  background: var(--vd-ink) !important;
  color: var(--vd-on-ink) !important;
}
${join(separator)} { background: var(--vd-line) !important; box-shadow: none !important; }
${join(sectionHeader)} {
  background: transparent !important;
  color: var(--vd-ink-faint) !important;
  font-family: var(--vd-font-mono) !important;
  font-size: 10px !important;
  letter-spacing: .12em !important;
  text-transform: uppercase !important;
}
${join(submenu)} {
  background: var(--vd-surface) !important;
  border: 1px solid var(--vd-line) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
${join(arrow)} { color: var(--vd-ink-muted) !important; fill: var(--vd-ink-muted) !important; }
${join(banner)} { color: var(--vd-ink) !important; }

/* Steam draws its own coloured A/B/X/Y prompts in here (as imgs or inline svg): force them monochrome. */
${join(container)} img, ${join(container)} svg { filter: grayscale(1) brightness(2.2) !important; }
`;
}
