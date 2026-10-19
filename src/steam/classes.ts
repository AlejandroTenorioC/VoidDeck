// Resolve readable Steam class names to their minified versions.
// Steam regenerates them in every update, so they are never written by hand.
import { classMap } from "@decky/ui";
import { harvestedModules, type ClassModule } from "./windowClasses";

const missing = new Set<string>();

/**
 * Every class map the theme can read: Steam's own, plus the ones harvested from the
 * other Steam windows (the on-screen keyboard only loads its module when it opens).
 */
function allModules(): ClassModule[] {
  return [...classMap, ...harvestedModules()];
}

/** True when the module publishes `name` and all the siblings used to pick the right one. */
function publishes(module: ClassModule, name: string, siblings: string[]): boolean {
  return typeof module?.[name] === "string" && siblings.every((s) => typeof module[s] === "string");
}

/**
 * CSS selector for the `name` class. If the name exists in several modules,
 * `siblings` chooses the module that also defines those other classes.
 * If it cannot be found, returns a selector that matches nothing.
 */
export function cls(name: string, ...siblings: string[]): string {
  const mod = allModules().find((m) => publishes(m, name, siblings));
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
    allModules()
      .filter((m) => publishes(m, name, siblings))
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

/** Number of class modules the theme can read: it changes when Steam publishes new ones. */
export function classEpoch(): number {
  return classMap.length + harvestedModules().length;
}

let warned = "";

/**
 * Log the classes that could not be found, once per distinct set, so a Steam update that
 * breaks part of the theme leaves a trace in the plugin log instead of failing silently.
 */
export function warnMissingClasses(): void {
  if (missing.size === 0) return;
  const signature = [...missing].sort().join(", ");
  if (signature === warned) return;
  warned = signature;
  console.warn(`[Void Deck] Steam classes not found: ${signature}`);
}
