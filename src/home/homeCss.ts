// Home screen styles in design pixels. Every value comes from the --vd-* tokens.
export const homeCss = `
.vd-home-viewport { position: absolute; inset: 0; overflow: hidden; background: var(--vd-bg, #000); }
.vd-home-viewport { overflow: clip; }
/* Strip beneath the Steam top bar (40 CSS px): scrolled content fades to black. */
.vd-home-viewport::after {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 48px; z-index: 1; pointer-events: none;
  background: linear-gradient(var(--vd-bg) 75%, transparent);
}
.vd-home {
  overflow: clip; color: var(--vd-ink); font-family: var(--vd-font-sans);
  --vd-tile-width: 150px; --vd-grid-columns: 7; --vd-grid-gap: var(--vd-space-6);
}
.vd-scroll { transition: transform 320ms cubic-bezier(.2, .7, .2, 1); will-change: transform; }

/* First screen: tabs, featured game, and recent games fill the window exactly */
.vd-page {
  box-sizing: border-box; display: flex; flex-direction: column;
  padding: 88px var(--vd-space-8) 80px;
  max-width: 1280px; margin-inline: auto;
}

/* Below: all installed games */
.vd-installed { padding: 0 var(--vd-space-8) 120px; max-width: 1280px; margin-inline: auto; }
.vd-grid { display: grid; grid-template-columns: repeat(var(--vd-grid-columns), var(--vd-tile-width)); column-gap: var(--vd-grid-gap); row-gap: var(--vd-space-2); }
.vd-home.is-compact { --vd-tile-width: 124px; --vd-grid-columns: 8; --vd-grid-gap: var(--vd-space-4); }

/* Tabs L1 / R1 */
.vd-tabs { display: flex; flex: none; align-items: center; gap: var(--vd-space-3); }
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
.vd-tab.is-active.is-focused { color: var(--vd-on-ink); box-shadow: var(--vd-focus-ring); }

/* Juego destacado */
.vd-hero { position: relative; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 14px; min-height: 0; }
/* The hero never squashes its content: it overflows the page instead of overlapping itself. */
.vd-hero > * { flex: none; }
.vd-field {
  position: absolute; right: -32px; top: 0; width: 560px; height: 100%; pointer-events: none;
  --vd-dot-step: 8px;
  overflow: hidden;
  background-image: radial-gradient(circle, var(--vd-ink-faint) 1.5px, transparent 1.75px);
  background-size: var(--vd-dot-step) var(--vd-dot-step);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 60%);
}
/* The wave is a slanted window sweeping right-to-left. Its body raises the dots to
   muted ink so the shape reads. The vanishing dots are a sibling layer, not children:
   the sweep's mask would otherwise clip them to the band and tie the two effects. */
.vd-flicker {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle, var(--vd-ink-muted) 1.5px, transparent 1.75px);
  background-size: var(--vd-dot-step) var(--vd-dot-step);
  -webkit-mask-image: linear-gradient(105deg, transparent 18%, #000 42%, #000 58%, transparent 82%);
  -webkit-mask-size: 420px 100%;
  -webkit-mask-repeat: no-repeat;
  animation: vd-field-sweep 5.5s linear infinite;
}
.vd-dots { position: absolute; inset: 0; pointer-events: none; }
/* A dot-sized disc of the page colour: at full opacity it erases the grid dot beneath
   it, which is what makes the flicker read as absence. Centred on the 8px lattice. */
.vd-dots i {
  position: absolute; width: 7px; height: 7px; border-radius: 50%; background: var(--vd-bg); opacity: 0;
  animation-name: vd-dot-fade; animation-iteration-count: infinite; animation-timing-function: ease-in-out;
}
@keyframes vd-field-sweep {
  from { -webkit-mask-position: 720px 0; }
  to { -webkit-mask-position: -420px 0; }
}
/* Present, gone, present: the hold keeps a vanished dot away long enough to notice,
   while the smooth easing keeps the rhythm calm rather than stuttering. */
@keyframes vd-dot-fade {
  0%, 100% { opacity: 0; } 35%, 60% { opacity: 1; }
}
/* Boot, radar and ladder light the grid at full ink; each layer owns its own timing. */
.vd-boot, .vd-ladder { position: absolute; inset: 0; pointer-events: none; }
.vd-boot i, .vd-ladder i {
  position: absolute; left: 0; right: 0; height: var(--vd-dot-step);
  background-image: radial-gradient(circle, var(--vd-ink) 1.5px, transparent 1.75px);
  background-size: var(--vd-dot-step) var(--vd-dot-step);
  background-repeat: repeat-x;
  opacity: .08;
}
.vd-boot i { animation: vd-boot-row 2.6s cubic-bezier(.25, 1, .5, 1) infinite both; }
@keyframes vd-boot-row {
  0% { opacity: .08; } 14% { opacity: 1; } 72% { opacity: .95; } 100% { opacity: .08; }
}
.vd-ladder i { animation: vd-ladder-rung 2.4s linear infinite both; }
@keyframes vd-ladder-rung {
  0% { opacity: .08; } 25% { opacity: 1; } 50% { opacity: .08; } 75% { opacity: 1; } 100% { opacity: .08; }
}
.vd-radar { position: absolute; inset: 0; pointer-events: none; }
.vd-radar i, .vd-radar b {
  position: absolute; width: 5px; height: 5px; border-radius: 50%; background: var(--vd-ink);
  opacity: 0; animation: vd-radar-dot 2.2s linear infinite both;
}
.vd-radar b { width: 7px; height: 7px; }
@keyframes vd-radar-dot {
  0% { opacity: .14; } 3% { opacity: 1; } 16% { opacity: .5; } 42% { opacity: .22; } 100% { opacity: .14; }
}
.vd-compile, .vd-magnet, .vd-diamond, .vd-rain { position: absolute; inset: 0; pointer-events: none; }
.vd-compile i, .vd-magnet i, .vd-diamond i, .vd-rain i {
  position: absolute; width: 5px; height: 5px; border-radius: 50%;
  background: var(--vd-ink); opacity: 0;
}
.vd-compile i { animation: vd-compile-dot 2.4s cubic-bezier(.65, 0, .35, 1) infinite both; }
.vd-magnet i { animation: vd-glow-dot 2.4s cubic-bezier(.65, 0, .35, 1) infinite both; }
.vd-diamond i { animation: vd-glow-dot 2.2s cubic-bezier(.16, 1, .3, 1) infinite both; }
/* A drop is a short vertical trail: repeated grid dots whose top fades out through a mask,
   falling the whole field and fading in at the top, out at the bottom. */
.vd-rain i {
  height: 72px; border-radius: 0; background-color: transparent;
  background-image: radial-gradient(circle, var(--vd-ink) 1.5px, transparent 1.75px);
  background-size: var(--vd-dot-step) var(--vd-dot-step);
  -webkit-mask-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .25) 45%, #000);
  mask-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .25) 45%, #000);
  animation: vd-rain-drop 4.6s linear infinite both;
}
@keyframes vd-compile-dot {
  0% { opacity: .08; } 14% { opacity: 1; } 72% { opacity: .95; } 100% { opacity: .08; }
}
@keyframes vd-glow-dot {
  0% { opacity: 0; } 10% { opacity: 1; } 55% { opacity: .85; } 100% { opacity: 0; }
}
@keyframes vd-rain-drop {
  0% { transform: translateY(-96px); opacity: 0; }
  8% { opacity: 1; }
  84% { opacity: 1; }
  100% { transform: translateY(520px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .vd-flicker, .vd-dots, .vd-boot, .vd-radar, .vd-ladder, .vd-compile, .vd-magnet, .vd-diamond, .vd-rain { display: none; }
}
.vd-kicker { font: 14px/16px var(--vd-font-mono); letter-spacing: .08em; color: var(--vd-ink-muted); text-transform: uppercase; }
/* One fixed title box: the type shrinks to fit long names, but the block height never
   changes, so the kicker, playtime and buttons around it stay put. */
.vd-gtitle {
  position: relative; margin: 0; max-width: 100%; box-sizing: border-box;
  font: 800 96px/116px var(--vd-font-dot); letter-spacing: -.02em;
  text-transform: uppercase; white-space: nowrap;
  /* Doto's dot cells drop below the baseline: the padding keeps them clear of the row
     below, and the clip stops a long name from leaving the column. */
  padding-bottom: 18px; overflow: hidden;
}
.vd-gtitle.is-medium { font-size: 72px; line-height: 116px; letter-spacing: 0; }
.vd-gtitle.is-long { font-size: 52px; line-height: 116px; letter-spacing: 0; }
.vd-gtitle.is-extra-long { font-size: 38px; line-height: 116px; letter-spacing: 0; }
.vd-gtitle.is-ultra-long { font-size: 30px; line-height: 116px; letter-spacing: 0; }
.vd-empty-description { position: relative; max-width: 440px; margin: 0; color: var(--vd-ink-muted); font: 16px/24px var(--vd-font-sans); }
.vd-empty-library {
  display: inline-flex; align-items: center; justify-content: center; width: max-content; height: 42px; padding: 0 var(--vd-space-5, 20px);
  border: 1.5px solid var(--vd-line-strong); border-radius: var(--vd-radius-pill); color: var(--vd-ink);
  font: 500 15px/1 var(--vd-font-sans); transition: background 150ms ease, color 150ms ease;
}
.vd-empty-library.is-focused { background: var(--vd-ink); color: var(--vd-on-ink); box-shadow: var(--vd-focus-ring); }
.vd-meta { display: flex; gap: var(--vd-space-6); align-items: center; font: 16px/24px var(--vd-font-sans); color: var(--vd-ink-muted); }
.vd-meta b { color: var(--vd-ink); font-weight: 500; }
.vd-actions { display: flex; gap: var(--vd-space-4); }

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
/* 16px clears the focused cover's scale + ring above the shelf. */
.vd-shelf-h { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--vd-space-4); }
.vd-shelf-h h2 { margin: 0; font: 500 18px/24px var(--vd-font-sans); }
.vd-shelf { display: flex; gap: var(--vd-grid-gap); align-items: flex-start; height: 285px; }

.vd-tile { display: flex; flex-direction: column; gap: var(--vd-space-2); width: var(--vd-tile-width); flex: none; }
.vd-tile-art {
  position: relative; display: grid; place-items: center; aspect-ratio: 2 / 3; overflow: hidden;
  border-radius: var(--vd-radius-md); background-color: var(--vd-surface-raised);
  background-image: radial-gradient(circle, var(--vd-ink-faint) 1.5px, transparent 1.75px);
  background-size: var(--vd-space-3) var(--vd-space-3);
  transition: transform 150ms ease, box-shadow 150ms ease;
}
/* Covers are monochrome until the tile is hovered or focused. */
.vd-tile-art img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); transition: filter 150ms ease; }
.vd-tile:hover .vd-tile-art img, .vd-tile.is-focused .vd-tile-art img { filter: none; }
html[data-vd-bw="off"] .vd-tile-art img { filter: none; }
.vd-tile-glyph { font: 800 72px/1 var(--vd-font-dot); color: var(--vd-ink); }
.vd-tile-meta { display: flex; flex-direction: column; gap: 2px; padding: var(--vd-space-2) var(--vd-space-1) 0; opacity: 0; transition: opacity 150ms; }
.vd-tile-title { font: 500 16px/22px var(--vd-font-sans); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vd-tile-detail { font: 400 14px/20px var(--vd-font-sans); color: var(--vd-ink-muted); }
.vd-tile.is-focused .vd-tile-art { transform: scale(1.06); box-shadow: var(--vd-focus-ring); }
.vd-tile.is-focused .vd-tile-meta { opacity: 1; }
`;
