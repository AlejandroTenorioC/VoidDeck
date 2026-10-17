// Void Deck copy: concise, technical, and without exclamation marks.
import { strings, type Language } from "../i18n";

export function playtime(minutes: number, language: Language): { value: string; unit: string } | null {
  const copy = strings(language);
  if (minutes <= 0) return null;
  if (minutes < 60) return { value: `${minutes}`, unit: copy.minPlayed };
  return { value: `${Math.round(minutes / 60)} h`, unit: copy.played };
}

export function shortPlaytime(minutes: number, language: Language): string {
  const p = playtime(minutes, language);
  return p ? `${p.value} ${p.unit}` : strings(language).notPlayed;
}

export function since(unixSeconds: number, language: Language, now = Date.now()): string | null {
  const copy = strings(language);
  if (!unixSeconds) return null;
  const min = Math.max(0, Math.round((now / 1000 - unixSeconds) / 60));
  if (min < 1) return copy.now;
  if (min < 60) return language === "en" ? `${min} min ago` : `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return language === "en" ? `${h} h ago` : `hace ${h} h`;
  const d = Math.round(h / 24);
  if (d === 1) return copy.yesterday;
  return language === "en" ? `${d} days ago` : `hace ${d} días`;
}

export function deckCompat(category: number, language: Language): string {
  const copy = strings(language);
  return ["", copy.unsupported, copy.playable, copy.verified][category] ?? "";
}

/** Fallback for empty cover art: the first letter or digit in the name. */
export const glyph = (name: string) => (name.match(/[\p{L}\p{N}]/u)?.[0] ?? "·").toUpperCase();
