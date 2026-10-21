// Layer 3: Void Deck preferences that survive a Steam or Decky restart.
import { useSyncExternalStore } from "react";
import type { City } from "./screensaver/weather";
import type { Theme } from "./theme/tokens";

export type Settings = {
  skin: boolean;
  theme: Theme;
  home: boolean;
  notifications: boolean;
  screensaver: boolean;
  /** City for the screensaver weather; null until the user picks one. */
  city: City | null;
};

const STORAGE_KEY = "voiddeck-settings";
const listeners = new Set<() => void>();

const defaultSettings: Settings = { skin: true, theme: "dark", home: true, notifications: true, screensaver: true, city: null };

// Declared before load() runs below: a const used before its line throws, and load() would fall back to the defaults.
const isCity = (value: unknown): value is City =>
  !!value &&
  typeof (value as City).name === "string" &&
  typeof (value as City).latitude === "number" &&
  typeof (value as City).longitude === "number";

let settings: Settings = load();

/** Read the stored preferences, falling back to the defaults when storage is empty or invalid. */
function load(): Settings {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      skin: typeof parsed.skin === "boolean" ? parsed.skin : defaultSettings.skin,
      theme: parsed.theme === "light" ? "light" : "dark",
      home: typeof parsed.home === "boolean" ? parsed.home : defaultSettings.home,
      notifications: typeof parsed.notifications === "boolean" ? parsed.notifications : defaultSettings.notifications,
      screensaver: typeof parsed.screensaver === "boolean" ? parsed.screensaver : defaultSettings.screensaver,
      city: isCity(parsed.city) ? parsed.city : null,
    };
  } catch {
    return defaultSettings;
  }
}

/** Replace the preferences: keep them in memory, persist them, and notify the panel. */
function store(next: Settings): void {
  settings = next;
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The preference still applies for this session if storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}

/** Current preferences, so the plugin can apply them when it mounts. */
export function settingsState(): Settings {
  return settings;
}

export function setSkin(skin: boolean, theme: Theme): void {
  store({ ...settings, skin, theme });
}

export function setHome(home: boolean): void {
  store({ ...settings, home });
}

export function setNotifications(notifications: boolean): void {
  store({ ...settings, notifications });
}

export function setScreensaver(screensaver: boolean): void {
  store({ ...settings, screensaver });
}

export function setCity(city: City | null): void {
  store({ ...settings, city });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook for the stored preferences. */
export function useSettings(): Settings {
  return useSyncExternalStore(subscribe, settingsState, settingsState);
}
