// Steam minifies its class names in every update, so the theme asks the running Steam
// windows for the names they use. The on-screen keyboard lives in a window of its own
// and only loads its module the first time it opens, so the harvest has to run again
// later; the caller rebuilds the CSS when `harvestClasses` reports something new.

export type ClassModule = Record<string, string>;

type ChunkLoader = { push: (chunk: unknown) => void };
type WebpackWindow = Window & { webpackChunksteamui?: ChunkLoader };
type WebpackRequire = { c?: Record<string, { exports?: unknown }> };

/** A CSS class name is made of letters, digits, dashes and underscores — never of spaces. */
const CLASS_NAME = /^[A-Za-z0-9_-]+$/;

/** Keys webpack and the CSS loader use for the real payload of a module. */
const WRAPPERS = new Set(["__esModule", "default", "locals"]);

const maps = new WeakMap<object, ClassModule | null>();
const requires = new WeakMap<Window, WebpackRequire | null>();
let harvested: ClassModule[] = [];
let seen = new Set<ClassModule>();

/**
 * The (readable name → class name) map a webpack module publishes, or null when the
 * module does not publish one. The answer is cached so the same module keeps its
 * identity and the harvest can tell a new module from a known one.
 */
function classMapOf(value: unknown): ClassModule | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const cached = maps.get(source);
  if (cached !== undefined) return cached;
  const entries = Object.entries(source).filter(
    (entry): entry is [string, string] => !WRAPPERS.has(entry[0]) && typeof entry[1] === "string",
  );
  const names = entries.map(([name]) => name);
  const isNoise =
    (names.length === 1 && names[0] === "version") ||
    (names.length > 1000 && names.includes("AboutSettings"));
  const isClassMap = !isNoise && entries.every(([, entry]) => CLASS_NAME.test(entry));
  const map = isClassMap ? Object.fromEntries(entries) : null;
  maps.set(source, map);
  return map;
}

/**
 * The window's webpack require function. Capturing it runs no module: the pushed chunk
 * only asks the runtime to hand the function over. Every window is asked once, because
 * each push leaves an entry behind in Steam's chunk list.
 */
function requireOf(win: Window): WebpackRequire | undefined {
  const cached = requires.get(win);
  if (cached !== undefined) return cached ?? undefined;
  let chunks: ChunkLoader | undefined;
  try {
    chunks = (win as WebpackWindow).webpackChunksteamui;
  } catch {
    requires.set(win, null);
    return undefined;
  }
  if (typeof chunks?.push !== "function") {
    requires.set(win, null);
    return undefined;
  }
  let required: WebpackRequire | undefined;
  try {
    chunks.push([[Symbol("voiddeck")], {}, (r: WebpackRequire) => { required = r; }]);
  } catch {
    requires.set(win, null);
    return undefined;
  }
  requires.set(win, required ?? null);
  return required;
}

/** The places a module can keep the class map it publishes. */
function payloads(exports: unknown): unknown[] {
  if (typeof exports !== "object" || exports === null) return [];
  const record = exports as Record<string, unknown>;
  return [exports, record.default, record.locals];
}

/** Class modules the window has already executed. Reading them runs no code. */
function harvestWindow(win: Window): ClassModule[] {
  const executed = requireOf(win)?.c;
  if (!executed) return [];
  const modules: ClassModule[] = [];
  for (const id of Object.keys(executed)) {
    for (const payload of payloads(executed[id]?.exports)) {
      const map = classMapOf(payload);
      if (map) modules.push(map);
    }
  }
  return modules;
}

/**
 * Re-read the class modules of every Steam window. Returns true when new ones appeared,
 * which happens the first time the on-screen keyboard is opened.
 */
export function harvestClasses(windows: Window[]): boolean {
  const modules = [...new Set(windows.flatMap(harvestWindow))];
  const next = new Set(modules);
  if (next.size === seen.size && [...next].every((m) => seen.has(m))) return false;
  seen = next;
  harvested = modules;
  return true;
}

/** Class modules read from the Steam windows. */
export function harvestedModules(): ClassModule[] {
  return harvested;
}
