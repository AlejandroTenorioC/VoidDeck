// Layer 3: Void Deck settings in the Quick Access menu.
import { ButtonItem, DropdownItem, Navigation, PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { useState } from "react";
import { disableHome, enableHome, homeEnabled } from "../home";
import { resetLanguage, setLanguage, strings, useLanguage, type Language } from "../i18n";
import { applySkin, removeSkin, skinState } from "../skin";

const VERSION = "0.2.13";
const RELEASE_URL = "https://github.com/endoflineservice/VoidDeck/releases/latest";

export function Panel() {
  const [skinOn, setSkinOn] = useState(() => skinState().on);
  const [light, setLight] = useState(() => skinState().theme === "light");
  const [homeOn, setHomeOn] = useState(homeEnabled);
  const language = useLanguage();
  const copy = strings(language);

  const updateSkin = (on: boolean, isLight: boolean) => {
    setSkinOn(on);
    setLight(isLight);
    if (on) applySkin(isLight ? "light" : "dark");
    else removeSkin();
  };

  const updateHome = (on: boolean) => {
    setHomeOn(on);
    if (on) enableHome();
    else disableHome(true);
  };

  const resetDefaults = () => {
    resetLanguage();
    setSkinOn(true);
    setLight(false);
    setHomeOn(true);
    applySkin("dark");
    enableHome();
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
      <PanelSectionRow>
        <ButtonItem label={copy.resetDefaults} description={copy.resetDefaultsDescription} onClick={resetDefaults} />
      </PanelSectionRow>
      <PanelSection title={copy.version}>
        <PanelSectionRow>
          <ButtonItem
            label={`Void Deck v${VERSION}`}
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
