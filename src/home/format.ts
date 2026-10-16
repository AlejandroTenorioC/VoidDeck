// Void Deck copy: concise, technical, and without exclamation marks.

export function playtime(minutes: number): { value: string; unit: string } | null {
  if (minutes <= 0) return null;
  if (minutes < 60) return { value: `${minutes}`, unit: "min played" };
  return { value: `${Math.round(minutes / 60)} h`, unit: "played" };
}

export function shortPlaytime(minutes: number): string {
  const p = playtime(minutes);
  return p ? `${p.value} ${p.unit}` : "Not played";
}

export function since(unixSeconds: number, now = Date.now()): string | null {
  if (!unixSeconds) return null;
  const min = Math.max(0, Math.round((now / 1000 - unixSeconds) / 60));
  if (min < 1) return "now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

const COMPAT = ["", "Unsupported on Deck", "Playable on Deck", "Verified for Deck"];
export const deckCompat = (category: number) => COMPAT[category] ?? "";

/** Fallback for empty cover art: the first letter or digit in the name. */
export const glyph = (name: string) => (name.match(/[\p{L}\p{N}]/u)?.[0] ?? "·").toUpperCase();
