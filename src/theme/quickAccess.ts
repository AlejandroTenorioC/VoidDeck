// Acceso rápido (···): panel en surface, pestañas en círculos, filas del concepto,
// interruptores en píldora y deslizantes como medidores de puntos.
// Medidas en px CSS de Steam: 1 px aquí = 1,5 px del concepto.
import { cls, clsAll } from "../steam/classes";

/** Fila de puntos para los deslizantes: puntos de 4 px cada 7 px. */
const dotRow = (color: string) => `radial-gradient(circle, ${color} 1.6px, transparent 2px) 0 50% / 7px 8px repeat-x`;

export function quickAccessCss(): string {
  const tab = cls("Tab", "TabList");
  const selected = cls("Selected", "TabList");
  const title = cls("Title", "TabList");
  const field = cls("Field", "FieldLabel");
  const track = cls("SliderTrack", "SliderHandle");
  const toggle = cls("Toggle", "ToggleRail");
  const on = cls("On", "ToggleRail");
  const rail = cls("ToggleRail", "ToggleSwitch");
  // Repetida para ganar en especificidad a la posición que fija Steam.
  const knob = cls("ToggleSwitch", "ToggleRail").repeat(2);
  const ring = "0 0 0 2px var(--vd-surface), 0 0 0 4px var(--vd-ink)";

  return `
/* Panel */
${cls("QuickAccessMenu", "TabList")}, ${title} { background: var(--vd-surface) !important; box-shadow: none !important; }
${title} { font-weight: 500 !important; }
${clsAll("PanelSectionTitle")}, ${clsAll("PanelSectionTitle", " *")} {
  font-family: var(--vd-font-mono) !important; font-weight: 400 !important; font-size: 10px !important;
  letter-spacing: .08em !important; color: var(--vd-ink-muted) !important;
}

/* Pestañas: círculos con el icono; la activa rellena */
${cls("Tabs", "TabList")} {
  width: 48px !important; min-width: 48px !important;
  background: var(--vd-surface) !important; border-right: 1px solid var(--vd-line) !important;
}
/* La lista recorta lo que sobresale (overflow: auto): a todo el ancho, para que quepa el anillo de foco */
${cls("TabList", "Tabs")} { width: 48px !important; box-sizing: border-box !important; }
${tab} {
  width: 32px !important; height: 32px !important; min-height: 0 !important; margin: 8px auto !important; padding: 0 !important;
  display: grid !important; place-items: center !important; box-sizing: border-box !important;
  border-radius: 50% !important; border: 1px solid var(--vd-line-strong) !important;
  background: transparent !important; color: var(--vd-ink-muted) !important;
}
${tab} svg { width: 16px !important; height: 16px !important; }
${tab}${selected} { background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; color: var(--vd-on-ink) !important; }
${tab}.gpfocus { box-shadow: ${ring} !important; }

/* Filas: el foco eleva la fila y marca el borde izquierdo */
${field}.gpfocus, ${field}.gpfocuswithin { background: var(--vd-surface-raised) !important; box-shadow: inset 2px 0 0 var(--vd-ink) !important; }

/* Deslizantes (brillo, volumen...) como medidores de puntos */
${track} { height: 8px !important; border-radius: 0 !important; background: ${dotRow("var(--vd-ink-faint)")} !important; }
${track}::before { height: 8px !important; border-radius: 0 !important; background: ${dotRow("var(--vd-ink)")} !important; }
${cls("SliderHandle", "SliderTrack")} { opacity: 0 !important; }

/* Interruptores: píldora con borde; encendido = relleno blanco con botón negro */
${rail} { background: transparent !important; border: 1px solid var(--vd-line-strong) !important; border-radius: 999px !important; box-sizing: border-box !important; }
${rail}::before { display: none !important; }
${toggle}${on} ${rail} { background: var(--vd-ink) !important; border-color: var(--vd-ink) !important; }
${knob} {
  width: 14px !important; height: 14px !important; top: 4px !important; left: 4px !important; right: auto !important;
  background: var(--vd-ink-muted) !important; box-shadow: none !important; transition: transform 150ms ease !important;
}
${toggle}${on} ${knob} { transform: translateX(16px) !important; background: var(--vd-on-ink) !important; }
`;
}
