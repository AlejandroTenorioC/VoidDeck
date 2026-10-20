// Quick Access (···): surface panel, circular tabs, design rows,
// pill toggles, and sliders as dot meters.
// Measurements are in Steam CSS px: 1 px here = 1.5 design px.
import { cls, clsAll } from "../steam/classes";

/** Dot row for sliders: 4 px dots every 7 px. */
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
  // Repeated to override the position specificity set by Steam.
  const knob = cls("ToggleSwitch", "ToggleRail").repeat(2);
  const ring = "var(--vd-focus-ring)";

  return `
/* Panel */
${cls("QuickAccessMenu", "TabList")}, ${title} { background: var(--vd-surface) !important; box-shadow: none !important; }
${title} { font-weight: 500 !important; }
${clsAll("PanelSectionTitle")}, ${clsAll("PanelSectionTitle", " *")} {
  font-family: var(--vd-font-mono) !important; font-weight: 400 !important; font-size: 10px !important;
  letter-spacing: .08em !important; color: var(--vd-ink-muted) !important;
}

/* Tabs: icon circles; active tab filled */
${cls("Tabs", "TabList")} {
  width: 48px !important; min-width: 48px !important;
  background: var(--vd-surface) !important; border-right: 1px solid var(--vd-line) !important;
}
/* The list clips overflow (overflow: auto): use its full width so the focus ring fits. */
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

/* Rows: focus raises the row and marks the left edge */
${field}.gpfocus, ${field}.gpfocuswithin { background: var(--vd-surface-raised) !important; box-shadow: inset 2px 0 0 var(--vd-ink) !important; }

/* Sliders (brightness, volume…) as dot meters */
${track} { height: 8px !important; border-radius: 0 !important; background: ${dotRow("var(--vd-ink-faint)")} !important; }
${track}::before { height: 8px !important; border-radius: 0 !important; background: ${dotRow("var(--vd-ink)")} !important; }
${cls("SliderHandle", "SliderTrack")} { opacity: 0 !important; }

/* Toggles: outlined pill; on = white fill with black knob */
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
