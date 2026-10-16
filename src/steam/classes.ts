// Resolve readable Steam class names to their minified versions.
// Steam regenerates them in every update, so they are never written by hand.
import { classMap, findClassModule } from "@decky/ui";

const missing = new Set<string>();

/**
 * CSS selector for the `name` class. If the name exists in several modules,
 * `siblings` chooses the module that also defines those other classes.
 * If it cannot be found, returns a selector that matches nothing.
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
 * Selectors for `name` in every module that defines it. Steam composes the same CSS in
 * several panels (Quick Access, Decky, settings…), and each copy has its own name.
 * `suffix` is added to each selector (for example, " *" to reach children), and `siblings`
 * limits it to modules that also define those classes.
 */
export function clsAll(name: string, suffix = "", ...siblings: string[]): string {
  return clsList(name, ...siblings)
    .map((c) => c + suffix)
    .join(", ");
}

/** Like `clsAll`, but returns a list of separate selectors for combining with each other. */
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

/** Classes that could not be found (useful for detecting breakage after a Steam update). */
export function missingClasses(): string[] {
  return [...missing];
}
