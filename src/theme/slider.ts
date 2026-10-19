// The icon slider of the Quick Access panel (the brightness row).
// Steam draws it as a rounded bar filled with its accent colour; Void Deck keeps
// the same geometry but flattens it into a thin monochrome track with a white fill.
// Measurements are in Steam CSS px: 1 px here = 1.5 design px.
import { cls, clsAll } from "../steam/classes";

export function sliderCss(): string {
  // The five slider classes live in the same module, so the sibling lookup is unambiguous.
  const slider = cls("Slider", "SliderControlContainer");
  const control = cls("SliderControlContainer", "SliderIconContainer");
  const track = cls("SliderContainer", "SliderIconContainer");
  const iconBox = cls("SliderIconContainer", "SliderContainer");
  const icon = cls("SliderIcon", "SliderIconContainer");
  const disabled = cls("ControlDisabled", "SliderControlContainer");
  // The icon button of the dashboard popup (the sun next to the volume slider).
  const clickableIcon = cls("ClickableSliderIcon", "VolumePopup");
  // The label of the row that holds the slider.
  const label = clsAll("Label", "", "PanelSectionRow", "SliderControlContainer");

  return `
/* Row label: same mono caption as the rest of the panels */
${label} {
  font-family: var(--vd-font-mono) !important; font-weight: 400 !important;
  font-size: 10px !important; letter-spacing: .08em !important;
  color: var(--vd-ink-muted) !important; text-transform: uppercase !important;
}

/* Icon + track in a row */
${slider} { background: transparent !important; background-image: none !important; }
${control} { display: flex !important; align-items: center !important; gap: 10px !important; }

/* Track: a thin grey bar; the filled part is drawn by Steam as a ::before or a child */
${track} {
  flex: 1 1 auto !important; height: 4px !important; min-height: 4px !important;
  border-radius: 999px !important; box-shadow: none !important; border: 0 !important;
  background-color: var(--vd-line) !important; background-image: none !important;
}
${track}::before, ${track} > :not(${iconBox}) {
  height: 100% !important; border-radius: 999px !important; box-shadow: none !important;
  background-color: var(--vd-ink) !important; background-image: none !important;
}

/* Sun / speaker icon */
${iconBox} {
  display: grid !important; place-items: center !important; flex: none !important;
  width: 24px !important; height: 24px !important; border-radius: 50% !important;
  background-color: var(--vd-surface-raised) !important; background-image: none !important;
}
${icon} { width: 14px !important; height: 14px !important; color: var(--vd-ink) !important; }
${clickableIcon} { color: var(--vd-ink) !important; background: transparent !important; }

/* Dimmed while the control is off */
${disabled} ${icon}, ${disabled} ${iconBox}, ${disabled} ${track} { opacity: .45 !important; }
`;
}
