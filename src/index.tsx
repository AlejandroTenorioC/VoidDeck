import { definePlugin, toaster } from "@decky/api";
import { Navigation, staticClasses } from "@decky/ui";
import { disableHome, enableHome } from "./home";
import { languageState, strings } from "./i18n";
import { Panel, RELEASE_URL, VERSION } from "./qam/Panel";
import { settingsState } from "./settings";
import { applySkin, removeSkin } from "./skin";
import { checkForUpdate } from "./update/check";

const UPDATE_CHECK_DELAY_MS = 30_000;

// Icon: 5×5 dot grid with the diagonal lit.
function VoidIcon() {
  const dots = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      dots.push(
        <circle key={`${x}${y}`} cx={2 + x * 4} cy={2 + y * 4} r={1.2} opacity={x === y ? 1 : 0.3} />,
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

  // One quiet check after load, mirroring Decky's own update badge: toast only when something newer exists.
  const updateTimer = setTimeout(() => {
    void checkForUpdate(VERSION).then((result) => {
      if (!result.success || !result.available || !result.latest) return;
      const copy = strings(languageState());
      toaster.toast({
        title: `${copy.updateAvailable} — ${result.latest}`,
        body: copy.updateDescription,
        onClick: () => Navigation.NavigateToSteamWeb(RELEASE_URL),
      });
    });
  }, UPDATE_CHECK_DELAY_MS);

  return {
    name: "Void Deck",
    titleView: <div className={staticClasses.Title}>Void Deck</div>,
    content: <Panel />,
    icon: <VoidIcon />,
    onDismount() {
      clearTimeout(updateTimer);
      disableHome();
      removeSkin();
    },
  };
});
