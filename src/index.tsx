import { definePlugin } from "@decky/api";
import { staticClasses } from "@decky/ui";
import { disableHome, enableHome } from "./home";
import { Panel } from "./qam/Panel";
import { disableScreensaver, enableScreensaver } from "./screensaver";
import { settingsState } from "./settings";
import { applySkin, removeSkin } from "./skin";

// Icono: retícula de puntos 5×5 con una V encendida (la inicial de Void).
const V_ROWS = ["X...X", "X...X", ".X.X.", ".X.X.", "..X.."];

function VoidIcon() {
  const dots = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      dots.push(
        <circle key={`${x}${y}`} cx={2 + x * 4} cy={2 + y * 4} r={1.2} opacity={V_ROWS[y][x] === "X" ? 1 : 0.3} />,
      );
    }
  }
  return (
    <svg viewBox="0 0 20 20" width="1em" height="1em" fill="currentColor">
      {dots}
    </svg>
  );
}

export default definePlugin(() => {
  // The plugin mounts again after every Steam restart, so the stored choices are restored here.
  const settings = settingsState();
  // Each part stands alone: a failure in one must never stop the other from applying.
  if (settings.skin) {
    try {
      applySkin(settings.theme);
    } catch (error) {
      console.error("[Void Deck] skin failed to apply", error);
    }
  }
  if (settings.home) {
    try {
      enableHome();
    } catch (error) {
      console.error("[Void Deck] home screen failed to mount", error);
    }
  }
  if (settings.screensaver) {
    try {
      enableScreensaver();
    } catch (error) {
      console.error("[Void Deck] screensaver failed to start", error);
    }
  }

  return {
    name: "Void Deck",
    titleView: <div className={staticClasses.Title}>Void Deck</div>,
    content: <Panel />,
    icon: <VoidIcon />,
    onDismount() {
      disableHome();
      disableScreensaver();
      removeSkin();
    },
  };
});
