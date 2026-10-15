// Barra superior: sustituye los iconos de wifi y batería de Steam por medidores de puntos.
import { cls } from "./classes";

const METER = "vd-meter";
const BATTERY_DOTS = 5;
const LOW_BATTERY = 0.2;
// Steam marca los arcos apagados del icono de wifi con fill-opacity 0.25.
const LIT_ARC = '[fill-opacity="1"]';
const AC_CONNECTED = 2;

let battery: { level: number; charging: boolean } | null = null;
let unregister: (() => void) | null = null;

export function watchBattery(onChange: () => void): void {
  if (unregister) return;
  const reg = (window as any).SteamClient?.System?.RegisterForBatteryStateChanges?.((s: any) => {
    battery = s.bHasBattery ? { level: s.flLevel, charging: s.eACState === AC_CONNECTED } : null;
    onChange();
  });
  unregister = () => reg?.unregister?.();
}

export function unwatchBattery(): void {
  unregister?.();
  unregister = null;
  battery = null;
}

let cached: Record<"wifi" | "battery" | "stack" | "percentage", string> | null = null;
const selectors = () =>
  (cached ??= {
    wifi: cls("WirelessIcon", "HeaderItem"),
    battery: cls("BatteryIcon", "HeaderItem"),
    stack: cls("BatteryIconVerticalStack"),
    percentage: cls("Percentage", "BatteryIcon"),
  });

/** Crea o actualiza el medidor dentro de `host`: `on` puntos encendidos de `total`. */
function meter(host: Element, on: number, total: number, modifiers: string[], first: boolean): void {
  const doc = host.ownerDocument;
  let el = host.querySelector(`:scope > .${METER}`);
  if (!el) {
    el = doc.createElement("span");
    if (first) host.prepend(el);
    else host.append(el);
  }
  const className = [METER, ...modifiers].join(" ");
  if (el.className !== className) el.className = className;
  if (el.childElementCount !== total) {
    el.replaceChildren(...Array.from({ length: total }, () => doc.createElement("i")));
  }
  Array.from(el.children).forEach((dot, i) => {
    dot.className = i < on ? "on" : i === on ? "next" : "";
  });
}

export function updateStatusDots(doc: Document): void {
  const s = selectors();
  const wifi = doc.querySelector(s.wifi);
  if (wifi) {
    const arcs = wifi.querySelectorAll("svg path");
    meter(wifi, wifi.querySelectorAll(`svg path${LIT_ARC}`).length, arcs.length || 4, [], false);
  }
  const host = doc.querySelector(s.battery);
  if (host && battery) {
    const on = battery.level > 0 ? Math.max(1, Math.round(battery.level * BATTERY_DOTS)) : 0;
    const mods = [battery.level <= LOW_BATTERY ? "is-low" : "", battery.charging ? "is-charging" : ""].filter(Boolean);
    meter(host, on, BATTERY_DOTS, mods, true);
    host.classList.toggle("vd-battery-low", battery.level <= LOW_BATTERY);
  }
}

export function removeStatusDots(doc: Document): void {
  doc.querySelectorAll(`.${METER}`).forEach((el) => el.remove());
  doc.querySelectorAll(".vd-battery-low").forEach((el) => el.classList.remove("vd-battery-low"));
}

/** CSS: oculta los iconos originales y dibuja los puntos (4 px = 6 px del concepto a escala 1,5). */
export function statusDotsCss(): string {
  const s = selectors();
  return `
${s.wifi} svg, ${s.battery} ${s.stack} { display: none !important; }
.${METER} { display: inline-flex; align-items: center; gap: 2px; margin: 0 6px; }
.${METER} i { width: 4px; height: 4px; border-radius: 50%; background: var(--vd-ink-faint); }
.${METER} i.on { background: var(--vd-ink); }
.${METER}.is-low i.on { background: var(--vd-signal); }
.${METER}.is-charging i.next { animation: vd-charge 1.2s ease-in-out infinite; }
@keyframes vd-charge { 50% { background: var(--vd-ink); } }
.vd-battery-low ${s.percentage} { color: var(--vd-signal-text) !important; }
`;
}
