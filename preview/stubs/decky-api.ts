// Minimal @decky/api implementation for the preview.
import type { DefinePluginFn, RoutePatch } from "@decky/api/dist/types";

export const definePlugin = (fn: DefinePluginFn) => fn;

// The preview shows the Home screen when its route has a registered patch.
const patches = new Map<string, Set<RoutePatch>>();
const listeners = new Set<() => void>();

export const routerHook = {
  addPatch(path: string, patch: RoutePatch) {
    if (!patches.has(path)) patches.set(path, new Set());
    patches.get(path)!.add(patch);
    listeners.forEach((l) => l());
    return patch;
  },
  removePatch(path: string, patch: RoutePatch) {
    patches.get(path)?.delete(patch);
    listeners.forEach((l) => l());
  },
};

export function previewRoute(path: string): RoutePatch[] {
  return [...(patches.get(path) ?? [])];
}

export function onRoutesChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
