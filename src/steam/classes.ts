// Traduce nombres legibles de clases de Steam a sus versiones minificadas.
// Steam las regenera en cada actualización, así que nunca se escriben a mano.
import { classMap, findClassModule } from "@decky/ui";

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

/**
 * Selectores de `name` en todos los módulos que lo definen. Steam compone el mismo CSS en
 * varios paneles (Acceso rápido, Decky, ajustes...) y cada copia tiene su propio nombre.
 * `suffix` se añade a cada selector (p. ej. " *" para alcanzar los hijos) y `siblings`
 * limita a los módulos que también definen esas clases.
 */
export function clsAll(name: string, suffix = "", ...siblings: string[]): string {
  return clsList(name, ...siblings)
    .map((c) => c + suffix)
    .join(", ");
}

/** Como `clsAll`, pero como lista de selectores sueltos para combinarlos entre sí. */
export function clsList(name: string, ...siblings: string[]): string[] {
  const names = new Set(
    classMap
      .filter((m) => typeof m?.[name] === "string" && siblings.every((s) => typeof m[s] === "string"))
      .map((m) => m[name]),
  );
  if (names.size === 0) {
    missing.add(name);
    return [".vd-missing"];
  }
  return [...names].map((n) => `.${n}`);
}

/** Clases que no se encontraron (útil para detectar roturas tras una actualización de Steam). */
export function missingClasses(): string[] {
  return [...missing];
}
