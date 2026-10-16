// Home screen styles in design pixels. Every value comes from the --vd-* tokens.
export const homeCss = `
.vd-home-viewport { position: absolute; inset: 0; overflow: hidden; background: var(--vd-bg, #000); }
.vd-home-viewport { overflow: clip; }
/* Strip beneath the Steam top bar (40 CSS px): scrolled content fades to black. */
.vd-home-viewport::after {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 48px; z-index: 1; pointer-events: none;
  background: linear-gradient(var(--vd-bg) 75%, transparent);
}
.vd-home { width: 1280px; overflow: clip; color: var(--vd-ink); font-family: var(--vd-font-sans); }
.vd-scroll { transition: transform 320ms cubic-bezier(.2, .7, .2, 1); will-change: transform; }

/* First screen: tabs, featured game, and recent games fill the window exactly */
.vd-page {
  box-sizing: border-box; display: flex; flex-direction: column;
  padding: 88px var(--vd-space-8) 80px;
}

/* Below: all installed games */
.vd-installed { padding: 0 var(--vd-space-8) 120px; }
.vd-grid { display: grid; grid-template-columns: repeat(7, 150px); column-gap: var(--vd-space-6); row-gap: var(--vd-space-2); }

/* Tabs L1 / R1 */
.vd-tabs { display: flex; align-items: center; gap: var(--vd-space-1); }
.vd-trigger {
  display: inline-grid; place-items: center; min-width: 40px; height: 28px; padding: 0 6px; box-sizing: border-box;
  border: 1.5px solid var(--vd-line-strong); border-radius: var(--vd-radius-pill);
  font: 700 13px/1 var(--vd-font-mono); color: var(--vd-ink);
}
.vd-tabs .vd-trigger:first-child { margin-right: var(--vd-space-3); }
.vd-tabs .vd-trigger:last-child { margin-left: var(--vd-space-3); }
.vd-tab {
  height: 36px; padding: 0 var(--vd-space-4); display: inline-flex; align-items: center;
  border-radius: var(--vd-radius-pill); color: var(--vd-ink-muted);
  font: 14px/16px var(--vd-font-mono); letter-spacing: .08em; text-transform: uppercase;
}
.vd-tab.is-active { background: var(--vd-ink); color: var(--vd-on-ink); }
.vd-tab.is-focused { box-shadow: var(--vd-focus-ring); color: var(--vd-ink); }
.vd-tab.is-active.is-focused { color: var(--vd-on-ink); }

/* Juego destacado */
.vd-hero { position: relative; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: var(--vd-space-4); min-height: 0; }
.vd-field {
  position: absolute; right: -32px; top: 0; width: 560px; height: 100%; pointer-events: none;
  background-image: radial-gradient(circle, var(--vd-ink-faint) 1.5px, transparent 1.75px);
  background-size: var(--vd-space-3) var(--vd-space-3);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 60%);
}
.vd-kicker { font: 14px/16px var(--vd-font-mono); letter-spacing: .08em; color: var(--vd-ink-muted); text-transform: uppercase; }
.vd-gtitle {
  position: relative; margin: 0; max-width: 1100px; font: 800 96px/88px var(--vd-font-dot); letter-spacing: -.02em;
  text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.vd-gtitle.is-long { font-size: 56px; line-height: 56px; letter-spacing: 0; }
.vd-meta { display: flex; gap: var(--vd-space-6); align-items: center; font: 16px/24px var(--vd-font-sans); color: var(--vd-ink-muted); }
.vd-meta b { color: var(--vd-ink); font-weight: 500; }
.vd-actions { display: flex; gap: var(--vd-space-4); margin-top: var(--vd-space-2); }

/* Botones */
.vd-btn {
  display: inline-flex; align-items: center; gap: var(--vd-space-2); height: 48px; box-sizing: border-box;
  padding: 0 var(--vd-space-6) 0 var(--vd-space-4); border-radius: var(--vd-radius-pill);
  border: 1.5px solid transparent; font: 500 16px/1 var(--vd-font-sans);
  transition: transform 150ms ease;
}
.vd-btn-primary { background: var(--vd-ink); color: var(--vd-on-ink); }
.vd-btn-secondary { background: transparent; color: var(--vd-ink); border-color: var(--vd-line-strong); }
.vd-btn.is-focused { box-shadow: var(--vd-focus-ring); transform: scale(1.04); }
.vd-btn-glyph {
  display: inline-grid; place-items: center; width: 24px; height: 24px; box-sizing: border-box;
  border-radius: var(--vd-radius-pill); border: 1.5px solid currentColor; font: 700 12px/1 var(--vd-font-mono);
}

/* Estante de recientes */
.vd-shelf-h { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--vd-space-3); }
.vd-shelf-h h2 { margin: 0; font: 500 18px/24px var(--vd-font-sans); }
.vd-shelf { display: flex; gap: var(--vd-space-6); align-items: flex-start; height: 290px; }

.vd-tile { display: flex; flex-direction: column; gap: var(--vd-space-2); width: 150px; flex: none; }
.vd-tile-art {
  position: relative; display: grid; place-items: center; aspect-ratio: 2 / 3; overflow: hidden;
  border-radius: var(--vd-radius-md); background-color: var(--vd-surface-raised);
  background-image: radial-gradient(circle, var(--vd-ink-faint) 1.5px, transparent 1.75px);
  background-size: var(--vd-space-3) var(--vd-space-3);
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.vd-tile-art img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.vd-tile-glyph { font: 800 72px/1 var(--vd-font-dot); color: var(--vd-ink); }
.vd-tile-meta { display: flex; flex-direction: column; gap: 2px; padding: 0 var(--vd-space-1); opacity: 0; transition: opacity 150ms; }
.vd-tile-title { font: 500 16px/22px var(--vd-font-sans); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vd-tile-detail { font: 400 14px/20px var(--vd-font-sans); color: var(--vd-ink-muted); }
.vd-tile.is-focused .vd-tile-art { transform: scale(1.06); box-shadow: var(--vd-focus-ring); }
.vd-tile.is-focused .vd-tile-meta { opacity: 1; }
`;
