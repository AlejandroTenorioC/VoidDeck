import { useSyncExternalStore } from "react";

export type Accent = "red" | "cyan" | "amber" | "violet";
export type Density = "comfortable" | "compact";
export type ButtonStyle = "steam" | "xbox" | "ally";

const ACCENT_KEY = "voiddeck-accent";
const DENSITY_KEY = "voiddeck-density";
const BUTTON_STYLE_KEY = "voiddeck-button-style";
const listeners = new Set<() => void>();

function read<T extends string>(key: string, values: readonly T[], fallback: T): T {
  try {
    const value = globalThis.localStorage?.getItem(key);
    return values.includes(value as T) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

let accent = read(ACCENT_KEY, ["red", "cyan", "amber", "violet"] as const, "red");
let density = read(DENSITY_KEY, ["comfortable", "compact"] as const, "comfortable");
let buttonStyle = read(BUTTON_STYLE_KEY, ["steam", "xbox", "ally"] as const, "steam");

function save(key: string, value: string): void {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // Preferences still apply for the current session if storage is unavailable.
  }
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function appearanceState(): { accent: Accent; density: Density; buttonStyle: ButtonStyle } {
  return { accent, density, buttonStyle };
}

export function setAccent(next: Accent): void {
  if (next === accent) return;
  accent = next;
  save(ACCENT_KEY, next);
  notify();
}

export function setDensity(next: Density): void {
  if (next === density) return;
  density = next;
  save(DENSITY_KEY, next);
  notify();
}

export function setButtonStyle(next: ButtonStyle): void {
  if (next === buttonStyle) return;
  buttonStyle = next;
  save(BUTTON_STYLE_KEY, next);
  notify();
}

export function resetAppearance(): void {
  accent = "red";
  density = "comfortable";
  buttonStyle = "steam";
  save(ACCENT_KEY, accent);
  save(DENSITY_KEY, density);
  save(BUTTON_STYLE_KEY, buttonStyle);
  notify();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook for the shared accent color and Home density preferences. */
export function useAppearance(): { accent: Accent; density: Density; buttonStyle: ButtonStyle } {
  return useSyncExternalStore(subscribe, appearanceState, appearanceState);
}
