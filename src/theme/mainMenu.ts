// Main menu (STEAM button): monospace labels, focus with a white bar, and
// the current section marked by a dot. Steam has two identical copies of this module
// (with no class to distinguish them), so both are targeted: the ones defining ActiveDot.
import { clsList } from "../steam/classes";

const MODULE = "ActiveDot";

export function mainMenuCss(): string {
  const of = (name: string) => clsList(name, MODULE);
  const items = of("Item");
  const join = (list: string[]) => list.join(", ");
  const cross = (a: string[], b: string[], sep: string) => a.flatMap((x) => b.map((y) => x + sep + y));

  return `
${join(of("Menu"))} {
  background: var(--vd-surface) !important;
  border: none !important; border-radius: 0 !important; box-shadow: none !important;
}

${join(items)} {
  transform: none !important; position: relative !important;
  background: transparent !important; border-radius: 0 !important; color: var(--vd-ink-muted) !important;
}
${join([...cross(items, of("ItemLabel"), " "), ...cross(items, of("ItemLabel"), " ").map((s) => s + " *")])} {
  font-family: var(--vd-font-mono) !important; font-size: 10px !important;
  letter-spacing: .08em !important; text-transform: uppercase !important; color: inherit !important;
}
${join(of("ItemIcon").map((s) => s + " svg"))} { width: 16px !important; height: 16px !important; }

/* Section separators: one hairline instead of Steam's bevel */
${join(of("Separator"))} { background: var(--vd-line) !important; box-shadow: none !important; }

/* Current section: lit text and a dot instead of the blue pill */
${join(cross(items, of("Active"), ""))} { color: var(--vd-ink) !important; }
${join(of("ActiveDot"))} {
  width: 4px !important; height: 4px !important; border-radius: 50% !important;
  background: var(--vd-ink) !important; left: 10px !important; top: calc(50% - 2px) !important;
}

/* Focus: raised row with a white bar on the left */
${join(items.map((s) => s + ".gpfocus"))} {
  background: var(--vd-surface-raised) !important; box-shadow: inset 2px 0 0 var(--vd-ink) !important; color: var(--vd-ink) !important;
}
`;
}
