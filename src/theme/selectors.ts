// Helpers to turn lists of Steam class selectors into CSS.

/** Every selector in the list, with the suffix appended. */
export const join = (list: string[], suffix = "") => list.map((s) => s + suffix).join(", ");

/** Repeats the class (".a.a") so a rule outranks Steam's own, more specific, ones. */
export const paint = (list: string[], suffix = "") => list.map((s) => `${s}${s}${suffix}`);
