// Traduce nombres legibles de clases de Steam a sus versiones minificadas.
// Steam las regenera en cada actualización, así que nunca se escriben a mano.
import { findClassModule } from "@decky/ui";

const missing = new Set<string>();

/**
 * Selector CSS para la clase `name`. Si el nombre existe en varios módulos,
 * `siblings` elige el módulo que también define esas otras clases.
 * Si no se encuentra, devuelve un selector que no coincide con nada.
 */
export function cls(name: string, ...siblings: string[]): string {
  const mod = findClassModule((m) => typeof m?.[name] === "string" && siblings.every((s) => m[s]));
  if (!mod) {
    missing.add(name);
    return ".vd-missing";
  }
  return "." + mod[name];
}

/** Clases que no se encontraron (útil para detectar roturas tras una actualización de Steam). */
export function missingClasses(): string[] {
  return [...missing];
}
