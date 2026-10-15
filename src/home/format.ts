// Textos con la voz de Void Deck: cortos, técnicos, sin exclamaciones.

export function playtime(minutes: number): { value: string; unit: string } | null {
  if (minutes <= 0) return null;
  if (minutes < 60) return { value: `${minutes}`, unit: "min jugados" };
  return { value: `${Math.round(minutes / 60)} h`, unit: "jugadas" };
}

export function shortPlaytime(minutes: number): string {
  const p = playtime(minutes);
  return p ? `${p.value} ${p.unit}` : "Sin jugar";
}

export function since(unixSeconds: number, now = Date.now()): string | null {
  if (!unixSeconds) return null;
  const min = Math.max(0, Math.round((now / 1000 - unixSeconds) / 60));
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
}

const COMPAT = ["", "No compatible con Deck", "Jugable en Deck", "Verificado para Deck"];
export const deckCompat = (category: number) => COMPAT[category] ?? "";

/** Inicial para portadas vacías: primera letra o dígito del nombre. */
export const glyph = (name: string) => (name.match(/[\p{L}\p{N}]/u)?.[0] ?? "·").toUpperCase();
