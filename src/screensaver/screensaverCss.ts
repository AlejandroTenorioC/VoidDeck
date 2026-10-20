// Screensaver styles in design pixels (1280×800); the root is zoomed to the window. Every value comes from
// the --vd-* tokens.
import { clsAll } from "../steam/classes";

export const screensaverCss = () => `
/* Steam's slideshow stays mounted (it drives the screensaver) but is not drawn. */
${clsAll("ScreensaverGameBackgrounds")} { display: none !important; }

#voiddeck-screensaver {
  position: fixed; top: 0; left: 0; width: 1280px; height: 800px; z-index: 2147483647; overflow: hidden;
  background: var(--vd-bg); color: var(--vd-ink); font-family: var(--vd-font-sans);
}
/* Faint dot grid, brighter towards the centre. */
.vd-ss-grid {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, var(--vd-ink-faint) 1.5px, transparent 1.75px);
  background-size: var(--vd-space-6) var(--vd-space-6); opacity: .5;
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000, transparent 70%);
}
/* The content drifts a few pixels so nothing stays lit on the same OLED pixels. */
@keyframes vd-ss-drift { 0% { transform: translate(-14px, -10px); } 100% { transform: translate(14px, 10px); } }
.vd-ss-content {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--vd-space-12); animation: vd-ss-drift 180s ease-in-out infinite alternate;
}

.vd-ss-clock { display: flex; flex-direction: column; align-items: center; gap: var(--vd-space-4); }
.vd-ss-time { display: flex; align-items: flex-start; gap: var(--vd-space-3); }
.vd-ss-hours { font: 800 200px/.9 var(--vd-font-dot); letter-spacing: -.02em; }
.vd-ss-period { margin-top: 24px; font: 700 22px/1 var(--vd-font-mono); letter-spacing: .12em; color: var(--vd-ink-muted); }
.vd-ss-date {
  display: flex; align-items: center; gap: var(--vd-space-3);
  font: 400 20px/1 var(--vd-font-mono); letter-spacing: .2em; color: var(--vd-ink-muted);
}
.vd-ss-date::before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--vd-signal); }

.vd-ss-widgets { display: flex; gap: var(--vd-space-6); }
.vd-ss-card {
  box-sizing: border-box; width: 380px; height: 168px; padding: var(--vd-space-6);
  display: flex; flex-direction: column; justify-content: space-between;
  background: var(--vd-surface); border: 1px solid var(--vd-line); border-radius: var(--vd-radius-lg);
}
.vd-ss-label { font: 400 14px/1 var(--vd-font-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--vd-ink-muted); }
.vd-ss-row { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--vd-space-4); }
.vd-ss-value { font: 500 56px/1 var(--vd-font-sans); }
.vd-ss-note { font: 400 14px/1.3 var(--vd-font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--vd-ink-muted); }

/* Battery: ten dots, red when low; the next dot breathes while charging. */
.vd-ss-meter { display: flex; gap: 8px; margin-bottom: 8px; }
.vd-ss-meter i { width: 12px; height: 12px; border-radius: 50%; background: var(--vd-ink-faint); }
.vd-ss-meter i.on { background: var(--vd-ink); }
.vd-ss-battery.is-low .vd-ss-meter i.on { background: var(--vd-signal); }
@keyframes vd-ss-charge { 0%, 100% { opacity: .2; } 50% { opacity: 1; } }
.vd-ss-battery.is-charging .vd-ss-meter i.next { background: var(--vd-ink); animation: vd-ss-charge 2s ease-in-out infinite; }

.vd-ss-sky { width: 64px; height: 64px; color: var(--vd-ink); }
.vd-ss-sky svg { width: 100%; height: 100%; display: block; }
.vd-ss-weather.is-empty .vd-ss-value { font-size: 20px; line-height: 1.3; color: var(--vd-ink-muted); }
`;
