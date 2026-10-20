// Layer 2: Void Deck screensaver. Steam opens its screensaver in a window of its own ("Screensaver"); while it
// is open, a page of widgets (clock, battery, weather) covers Steam's game slideshow.
import { findModuleExport } from "@decky/ui";
import { languageState, strings } from "../i18n";
import { settingsState } from "../settings";
import { cls } from "../steam/classes";
import { steamDocuments } from "../steam/windows";
import { fontsCss } from "../theme/fonts";
import { tokensCss } from "../theme/tokens";
import { skyIcon } from "./icons";
import { screensaverCss } from "./screensaverCss";
import { fetchWeather, sky, type City, type Weather } from "./weather";

const ROOT_ID = "voiddeck-screensaver";
const STYLE_ID = "voiddeck-screensaver-style";
const DESIGN_WIDTH = 1280;
const CHECK_MS = 1000;
const WEATHER_MAX_AGE_MS = 30 * 60 * 1000;
const BATTERY_DOTS = 10;
const LOW_BATTERY = 0.2;
const AC_CONNECTED = 2;

type Mounted = { doc: Document; root: HTMLElement; tick: ReturnType<typeof setInterval>; unregister: () => void };

let timer: ReturnType<typeof setInterval> | undefined;
let mounted: Mounted | null = null;
let battery: { level: number; charging: boolean } | null = null;
let weather: { city: City; data: Weather | null; at: number } | null = null;

/** Steam's screensaver service (the one its "Preview" button uses). */
const service = () => findModuleExport((e: any) => typeof e?.ForceScreensaver === "function");

/** Show the screensaver now, from the panel. */
export function previewScreensaver(): void {
  service()?.ForceScreensaver({ enabled: true });
}

/** The screensaver window: React renders it from the Big Picture window through a portal. */
function screensaverDocument(container: Element): Document | null {
  const host = container.parentElement ?? container;
  const key = Object.keys(host).find((k) => k.startsWith("__reactFiber"));
  let found: Document | null = null;
  const scan = (fiber: any, depth: number) => {
    if (!fiber || found || depth > 300) return;
    if (fiber.tag === 4) {
      const doc: Document | undefined = fiber.stateNode?.containerInfo?.ownerDocument;
      if (doc && doc !== container.ownerDocument) found = doc;
    }
    scan(fiber.child, depth + 1);
    if (depth > 0) scan(fiber.sibling, depth);
  };
  scan(key ? (host as any)[key] : null, 0);
  return found;
}

function check(): void {
  const selector = cls("ScreensaverContainer");
  const container = steamDocuments()
    .map((doc) => doc.querySelector(selector))
    .find(Boolean);
  if (mounted && (!container || mounted.doc.defaultView?.closed || !mounted.root.isConnected)) unmount();
  if (!container || mounted) return;
  const doc = screensaverDocument(container);
  if (doc?.body) mount(doc);
}

const PAGE = `
<div class="vd-ss-grid"></div>
<div class="vd-ss-content">
  <div class="vd-ss-clock">
    <div class="vd-ss-time"><span class="vd-ss-hours"></span><span class="vd-ss-period"></span></div>
    <div class="vd-ss-date"></div>
  </div>
  <div class="vd-ss-widgets">
    <div class="vd-ss-card vd-ss-battery">
      <span class="vd-ss-label"></span>
      <div class="vd-ss-meter"></div>
      <div class="vd-ss-row"><span class="vd-ss-value"></span><span class="vd-ss-note"></span></div>
    </div>
    <div class="vd-ss-card vd-ss-weather">
      <span class="vd-ss-label"></span>
      <div class="vd-ss-row">
        <div><div class="vd-ss-value"></div><div class="vd-ss-note"></div></div>
        <div class="vd-ss-sky"></div>
      </div>
    </div>
  </div>
</div>`;

function mount(doc: Document): void {
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `${fontsCss}\n${tokensCss()}\n${screensaverCss()}`;
  doc.head.appendChild(style);

  const root = doc.createElement("div");
  root.id = ROOT_ID;
  root.innerHTML = PAGE;
  root.querySelector(".vd-ss-meter")!.replaceChildren(...Array.from({ length: BATTERY_DOTS }, () => doc.createElement("i")));
  doc.body.appendChild(root);

  const reg = (window as any).SteamClient?.System?.RegisterForBatteryStateChanges?.((s: any) => {
    battery = s.bHasBattery ? { level: s.flLevel, charging: s.eACState === AC_CONNECTED } : null;
    if (mounted) render(mounted);
  });
  mounted = { doc, root, tick: setInterval(() => mounted && render(mounted), CHECK_MS), unregister: () => reg?.unregister?.() };
  render(mounted);
  refreshWeather();
}

function unmount(): void {
  if (!mounted) return;
  clearInterval(mounted.tick);
  mounted.unregister();
  mounted.root.remove();
  mounted.doc.getElementById(STYLE_ID)?.remove();
  mounted = null;
}

function refreshWeather(): void {
  const city = settingsState().city;
  if (!city) return;
  const fresh = weather?.city === city && Date.now() - weather.at < WEATHER_MAX_AGE_MS;
  if (fresh) return;
  weather = { city, data: weather?.city === city ? weather.data : null, at: Date.now() };
  fetchWeather(city)
    .then((data) => {
      if (weather?.city === city) weather.data = data;
    })
    .catch((error) => console.warn("[Void Deck] weather failed", error))
    .finally(() => mounted && render(mounted));
}

const text = (root: HTMLElement, selector: string, value: string) => {
  const el = root.querySelector(selector);
  if (el && el.textContent !== value) el.textContent = value;
};

function render({ root, doc }: Mounted): void {
  const language = languageState();
  const copy = strings(language);
  const zoom = `${(doc.defaultView?.innerWidth ?? DESIGN_WIDTH) / DESIGN_WIDTH}`;
  if (root.style.zoom !== zoom) root.style.zoom = zoom;

  // Clock: the same 12/24-hour choice as Steam's own clock.
  const now = new Date();
  const hour12 = !(window as any).settingsStore?.m_FriendSettings?.b24HourClock;
  const parts = new Intl.DateTimeFormat(language, { hour: "numeric", minute: "2-digit", hour12 }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  text(root, ".vd-ss-hours", `${part("hour")}:${part("minute")}`);
  text(root, ".vd-ss-period", hour12 ? part("dayPeriod").replace(/\./g, "").toUpperCase() : "");
  const date = new Intl.DateTimeFormat(language, { weekday: "short", day: "numeric", month: "short" }).format(now);
  text(root, ".vd-ss-date", date.replace(/[.,]/g, "").toUpperCase());

  // Battery.
  const card = root.querySelector(".vd-ss-battery")!;
  text(root, ".vd-ss-battery .vd-ss-label", copy.battery);
  const level = battery?.level ?? 0;
  const on = battery ? Math.max(level > 0 ? 1 : 0, Math.round(level * BATTERY_DOTS)) : 0;
  card.querySelectorAll(".vd-ss-meter i").forEach((dot, i) => {
    const className = i < on ? "on" : i === on ? "next" : "";
    if (dot.className !== className) dot.className = className;
  });
  card.classList.toggle("is-low", !!battery && level <= LOW_BATTERY);
  card.classList.toggle("is-charging", !!battery?.charging && on < BATTERY_DOTS);
  text(root, ".vd-ss-battery .vd-ss-value", battery ? `${Math.round(level * 100)}%` : "—");
  const status = !battery ? "" : battery.charging ? (on >= BATTERY_DOTS ? copy.charged : copy.charging) : copy.onBattery;
  text(root, ".vd-ss-battery .vd-ss-note", status);

  // Weather.
  const city = settingsState().city;
  const box = root.querySelector(".vd-ss-weather")!;
  const data = weather?.city === city ? weather?.data : null;
  text(root, ".vd-ss-weather .vd-ss-label", city ? `${copy.weather} · ${city.name}` : copy.weather);
  box.classList.toggle("is-empty", !data);
  if (data) {
    const kind = sky(data.code);
    text(root, ".vd-ss-weather .vd-ss-value", `${Math.round(data.temperature)}°`);
    text(root, ".vd-ss-weather .vd-ss-note", `${copy.sky[kind]} · ${Math.round(data.high)}° / ${Math.round(data.low)}°`);
    const icon = skyIcon(kind, data.isDay);
    const holder = root.querySelector<HTMLElement>(".vd-ss-sky")!;
    if (holder.dataset.icon !== icon) {
      holder.innerHTML = icon;
      holder.dataset.icon = icon;
    }
  } else {
    text(root, ".vd-ss-weather .vd-ss-value", city ? copy.weatherUnavailable : copy.weatherNoCity);
    text(root, ".vd-ss-weather .vd-ss-note", "");
    root.querySelector(".vd-ss-sky")!.replaceChildren();
    delete root.querySelector<HTMLElement>(".vd-ss-sky")!.dataset.icon;
  }
  refreshWeather();
}

export function enableScreensaver(): void {
  timer ??= setInterval(check, CHECK_MS);
  check();
}

export function disableScreensaver(): void {
  clearInterval(timer);
  timer = undefined;
  unmount();
}
