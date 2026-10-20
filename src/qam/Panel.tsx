// Layer 3: Void Deck settings in the Quick Access menu.
import { ButtonItem, DropdownItem, Navigation, PanelSection, PanelSectionRow, showModal, ToggleField } from "@decky/ui";
import { useEffect, useState } from "react";
import { disableHome, enableHome } from "../home";
import { setLanguage, strings, useLanguage, type Language } from "../i18n";
import { version } from "../../package.json";
import { disableScreensaver, enableScreensaver, previewScreensaver } from "../screensaver";
import { setHome, setNotifications, setScreensaver, setSkin, useSettings } from "../settings";
import { applySkin, removeSkin, sync } from "../skin";
import { CityModal } from "./CityModal";
import { checkForUpdate, installUpdate, RELEASE_URL, type Release } from "./updates";

export function Panel() {
  // Stored preferences (they survive restarts); the toggles read and write them.
  const settings = useSettings();
  const skinOn = settings.skin;
  const light = settings.theme === "light";
  const homeOn = settings.home;
  const notificationsOn = settings.notifications;
  const screensaverOn = settings.screensaver;
  const language = useLanguage();
  const copy = strings(language);
  const [update, setUpdate] = useState<Release | null>(null);

  useEffect(() => {
    let open = true;
    checkForUpdate().then((release) => open && setUpdate(release));
    return () => {
      open = false;
    };
  }, []);

  const updateSkin = (on: boolean, isLight: boolean) => {
    setSkin(on, isLight ? "light" : "dark");
    if (on) applySkin(isLight ? "light" : "dark");
    else removeSkin();
  };

  const updateHome = (on: boolean) => {
    setHome(on);
    if (on) enableHome();
    else disableHome(true);
  };

  const updateNotifications = (on: boolean) => {
    setNotifications(on);
    sync();
  };

  const updateScreensaver = (on: boolean) => {
    setScreensaver(on);
    if (on) enableScreensaver();
    else disableScreensaver();
  };

  return (
    <PanelSection title="VOID DECK">
      <PanelSectionRow>
        <ToggleField
          label={copy.globalSkin}
          description={copy.globalSkinDescription}
          checked={skinOn}
          onChange={(on) => updateSkin(on, light)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label={copy.homeScreen}
          description={copy.homeScreenDescription}
          checked={homeOn}
          onChange={updateHome}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label={copy.lightTheme}
          description={copy.lightThemeDescription}
          checked={light}
          disabled={!skinOn}
          onChange={(isLight) => updateSkin(skinOn, isLight)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label={copy.notificationStyle}
          description={copy.notificationStyleDescription}
          checked={notificationsOn}
          disabled={!skinOn}
          onChange={updateNotifications}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label={copy.screensaver}
          description={copy.screensaverDescription}
          checked={screensaverOn}
          onChange={updateScreensaver}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem
          label={copy.city}
          description={settings.city ? `${settings.city.name}, ${settings.city.country}` : copy.cityNone}
          disabled={!screensaverOn}
          onClick={() => showModal(<CityModal />)}
        >
          {copy.cityPrompt}
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem disabled={!screensaverOn} onClick={previewScreensaver}>
          {copy.previewScreensaver}
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <DropdownItem
          label={copy.language}
          description={copy.languageDescription}
          rgOptions={[
            { label: "English", data: "en" },
            { label: "Español", data: "es" },
          ]}
          selectedOption={language}
          onChange={({ data }) => setLanguage(data as Language)}
        />
      </PanelSectionRow>
      <PanelSection title={copy.version}>
        {update && (
          <PanelSectionRow>
            <ButtonItem
              label={copy.updateAvailable}
              description={`Void Deck v${version} → v${update.version}`}
              onClick={() => installUpdate(update)}
            >
              {`${copy.updateTo} v${update.version}`}
            </ButtonItem>
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <ButtonItem
            label={`Void Deck v${version}`}
            description={copy.versionDescription}
            onClick={() => Navigation.NavigateToSteamWeb(RELEASE_URL)}
          >
            {copy.releaseNotes}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </PanelSection>
  );
}
