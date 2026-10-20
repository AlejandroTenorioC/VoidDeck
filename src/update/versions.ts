// Pure version arithmetic for the in-plugin updater: no I/O, no globals.

const VERSION_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)/;

/** Parse a release tag ("v1.2.0" or "1.2.0") into numeric parts; null when it is not a plain triple. */
export function parseVersion(version: string): [number, number, number] | null {
  const match = VERSION_PATTERN.exec(version.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** True only when `latest` is strictly newer than `current`; anything unparseable never counts as newer. */
export function isNewerVersion(latest: string, current: string): boolean {
  const next = parseVersion(latest);
  const active = parseVersion(current);
  if (!next || !active) return false;
  if (next[0] !== active[0]) return next[0] > active[0];
  if (next[1] !== active[1]) return next[1] > active[1];
  if (next[2] !== active[2]) return next[2] > active[2];
  return false;
}
