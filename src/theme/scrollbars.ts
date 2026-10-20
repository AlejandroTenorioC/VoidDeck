// Steam's own scrollbars: chunky, rounded, and drawn on every surface that
// scrolls — Quick Access, the Library, Steam Settings and the popup menus.
// Void Deck replaces them with a square hairline thumb on an empty track so the
// flat look survives the moment you scroll.
export function scrollbarsCss(): string {
  return `
/* One scrollbar treatment for every scrolled surface */
*::-webkit-scrollbar { width: 8px !important; height: 8px !important; background: transparent !important; }
*::-webkit-scrollbar-track, *::-webkit-scrollbar-corner { background: transparent !important; }
*::-webkit-scrollbar-thumb {
  background: var(--vd-line-strong) !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
*::-webkit-scrollbar-thumb:hover { background: var(--vd-ink-muted) !important; }
`;
}
