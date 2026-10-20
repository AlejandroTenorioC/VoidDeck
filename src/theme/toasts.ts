// Notifications (window "notificationtoasts"). Every toast gets a flat surface card; achievements get the
// Xbox 360-style unlock: a dot with the achievement icon pops in, stretches left into a pill with the label
// and the name, and collapses back into the dot before Steam removes it (its exit starts at 5 s). Friend
// toasts share the pill shape without the animation.
// Gamescope pins this window to its corner and size, so the pill grows from the right edge.
import { clsAll, clsList } from "../steam/classes";

/** CSS variable with the localized "Achievement unlocked" label; src/skin.ts sets it on every window. */
export const ACHIEVEMENT_LABEL_VAR = "--vd-ach-label";
/** Attribute on every window when the notification style is turned off; toasts keep only the flat card. */
export const PLAIN_NOTIFICATIONS_ATTR = "data-vd-plain-notifications";

export function toastsCss(): string {
  const cards = clsList("ShortTemplate", "TwoLine");
  const icon = clsAll("AchievementIconWrapper");
  // The pill styles below apply only while the notification style is on.
  const styled = `:root:not([${PLAIN_NOTIFICATIONS_ATTR}])`;
  const achievement = cards.map((card) => `${styled} ${card}:has(${icon})`);
  // A part of the card (from the card's own module) inside an achievement toast.
  const part = (name: string, suffix = "") =>
    achievement.flatMap((a) => clsList(name, "ShortTemplate").map((p) => `${a} ${p}${suffix}`)).join(", ");
  const friend = cards.map((card) => `${styled} ${card}:has(${clsAll("AvatarStatus")})`);
  const friendPart = (name: string, suffix = "") =>
    friend.flatMap((f) => clsList(name, "ShortTemplate").map((p) => `${f} ${p}${suffix}`)).join(", ");
  const dot = "inset(0 0 0 calc(100% - 40px) round 20px)";
  const pill = "inset(0 0 0 0 round 20px)";

  return `
@keyframes vd-ach-in {
  0%   { transform: scale(0); clip-path: ${dot}; }
  22%  { transform: scale(1.12); clip-path: ${dot}; }
  34%  { transform: scale(1); clip-path: ${dot}; }
  100% { transform: scale(1); clip-path: ${pill}; }
}
@keyframes vd-ach-out {
  0%   { transform: scale(1); opacity: 1; clip-path: ${pill}; }
  60%  { transform: scale(1); opacity: 1; clip-path: ${dot}; }
  100% { transform: scale(0); opacity: 0; clip-path: ${dot}; }
}
@keyframes vd-ach-text { 0%, 55% { opacity: 0; transform: translateX(10px); } 100% { opacity: 1; transform: none; } }
@keyframes vd-ach-text-out { 0% { opacity: 1; } 40%, 100% { opacity: 0; } }

${cards.join(", ")} {
  background: var(--vd-surface) !important; border: 1px solid var(--vd-line) !important;
  border-radius: 12px !important; box-shadow: none !important;
}

${achievement.join(", ")} {
  width: fit-content !important; max-width: 300px !important; margin-left: auto !important;
  display: flex !important; flex-direction: row-reverse !important; align-items: center !important;
  border-radius: 20px !important; transform-origin: calc(100% - 20px) 50%;
  animation: vd-ach-in 900ms cubic-bezier(.3, 1.3, .5, 1) both, vd-ach-out 500ms cubic-bezier(.5, 0, .7, .4) 4.75s forwards !important;
}
${achievement.join(", ")} { box-sizing: border-box !important; height: 40px !important; }
/* The icon sits inside the dot with a dark ring around it: 1 px border + 5 px + 28 px icon + 5 px + 1 px = 40 px. */
${part("ShortLogoDimensions")} {
  width: 28px !important; height: 28px !important; min-width: 0 !important; margin: 0 5px !important;
  border-radius: 50% !important; overflow: hidden !important; flex: none !important;
}
${part("ShortLogoDimensions", " *")} { width: 100% !important; height: 100% !important; }
${part("Content")} {
  padding: 0 4px 0 16px !important;
  animation: vd-ach-text 900ms ease both, vd-ach-text-out 500ms ease 4.75s forwards;
}
${part("Content", "::before")} {
  content: var(${ACHIEVEMENT_LABEL_VAR}, "Achievement unlocked"); display: block; padding-left: 10px; margin-bottom: 2px;
  font: 400 8px/1 var(--vd-font-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--vd-ink-muted);
  background: radial-gradient(circle, var(--vd-signal) 2.4px, transparent 2.8px) 0 50% / 6px 6px no-repeat;
}
${achievement.flatMap((a) => clsList("Icon", "ShortTemplate").map((i) => clsList("Header", "ShortTemplate").map((h) => `${a} ${h} > ${i}`))).flat().join(", ")} { display: none !important; }
${part("Title")} { font: 500 12px/1.2 var(--vd-font-sans) !important; color: var(--vd-ink) !important; }
${part("Body")} { display: none !important; }

/* Friends (online, in game): the same pill with the round avatar on the right; Steam's status bar becomes a
   dot on the avatar, solid in game and hollow online. Steam's own enter and exit animations stay. */
${friend.join(", ")} {
  width: fit-content !important; max-width: 300px !important; height: 40px !important; margin-left: auto !important;
  box-sizing: border-box !important; position: relative !important;
  display: flex !important; flex-direction: row-reverse !important; align-items: center !important;
  border-radius: 20px !important;
}
${friendPart("ShortLogoDimensions")} {
  width: 28px !important; height: 28px !important; min-width: 0 !important; margin: 0 5px !important;
  border-radius: 50% !important; overflow: hidden !important; flex: none !important;
}
${friendPart("ShortLogoDimensions", " *")} { width: 100% !important; height: 100% !important; }
${friendPart("AvatarStatus")} {
  position: absolute !important; right: 4px; bottom: 4px; width: 9px !important; height: 9px !important;
  box-sizing: border-box !important; border-radius: 50% !important;
  border: 2px solid var(--vd-ink) !important; background: var(--vd-surface) !important;
  box-shadow: 0 0 0 2px var(--vd-surface) !important;
}
${friendPart("AvatarStatus", ".ingame")} { background: var(--vd-ink) !important; }
${friendPart("Content")} { padding: 0 4px 0 16px !important; }
${friendPart("Icon")} { display: none !important; }
${friendPart("Title")} { font: 500 12px/1.2 var(--vd-font-sans) !important; color: var(--vd-ink) !important; }
${friendPart("Body")} {
  font: 400 9px/1.4 var(--vd-font-mono) !important; letter-spacing: .06em; text-transform: uppercase;
  color: var(--vd-ink-muted) !important;
}
${friendPart("Body", " span")} { color: var(--vd-ink) !important; }
`;
}
