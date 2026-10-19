// Volume overlays (dashboard popup and desktop popin): one pure-black surface.
import { clsList } from "../steam/classes";

export function volumeCss(): string {
  const join = (list: string[]) => list.join(", ");
  const of = (name: string, ...siblings: string[]) => clsList(name, ...siblings);
  const popup = [...of("VolumePopup", "PopupBody"), ...of("PopupBody", "VolumePopup")];
  const popin = [...of("VolumePopin", "VolumeSliderPosition"), ...of("VolumeSliderPosition", "VolumePopin")];

  return `
${join([...popup, ...popin])} {
  background: var(--vd-bg) !important;
  background-image: none !important;
}
`;
}
