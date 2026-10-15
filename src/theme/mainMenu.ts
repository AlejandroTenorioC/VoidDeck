// Menú principal (botón STEAM): etiquetas monoespaciadas, foco con barra blanca y
// la sección actual marcada con un punto. Steam tiene dos copias idénticas de este módulo
// (sin ninguna clase que las distinga), así que se apunta a ambas: las que definen ActiveDot.
import { clsList } from "../steam/classes";

const MODULE = "ActiveDot";

export function mainMenuCss(): string {
  const of = (name: string) => clsList(name, MODULE);
  const items = of("Item");
  const join = (list: string[]) => list.join(", ");
  const cross = (a: string[], b: string[], sep: string) => a.flatMap((x) => b.map((y) => x + sep + y));

  return `
${join(of("Menu"))} { background: var(--vd-surface) !important; }

${join(items)} {
  transform: none !important; position: relative !important;
  background: transparent !important; color: var(--vd-ink-muted) !important;
}
${join([...cross(items, of("ItemLabel"), " "), ...cross(items, of("ItemLabel"), " ").map((s) => s + " *")])} {
  font-family: var(--vd-font-mono) !important; font-size: 10px !important;
  letter-spacing: .08em !important; text-transform: uppercase !important; color: inherit !important;
}
${join(of("ItemIcon").map((s) => s + " svg"))} { width: 16px !important; height: 16px !important; }

/* Sección actual: texto encendido y un punto en lugar de la pastilla azul */
${join(cross(items, of("Active"), ""))} { color: var(--vd-ink) !important; }
${join(of("ActiveDot"))} {
  width: 4px !important; height: 4px !important; border-radius: 50% !important;
  background: var(--vd-ink) !important; left: 10px !important; top: calc(50% - 2px) !important;
}

/* Foco: fila elevada con barra blanca a la izquierda */
${join(items.map((s) => s + ".gpfocus"))} {
  background: var(--vd-surface-raised) !important; box-shadow: inset 2px 0 0 var(--vd-ink) !important; color: var(--vd-ink) !important;
}
`;
}
