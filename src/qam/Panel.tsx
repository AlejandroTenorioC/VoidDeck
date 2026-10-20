// Layer 3: Void Deck settings in the Quick Access menu.
import { ButtonItem, DropdownItem, Navigation, PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { disableHome, enableHome } from "../home";
import { resetLanguage, setLanguage, strings, useLanguage, type Language } from "../i18n";
import { version } from "../../package.json";
import { resetSettings, setHome, setSkin, useSettings } from "../settings";
import { applySkin, removeSkin } from "../skin";

const RELEASE_URL = "https://github.com/AlejandroTenorioC/VoidDeck/releases/latest";

export function Panel() {
  // Stored preferences (they survive restarts); the toggles read and write them.
  const settings = useSettings();
  const skinOn = settings.skin;
  const light = settings.theme === "light";
  const homeOn = settings.home;
  const language = useLanguage();
  const copy = strings(language);

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

  const resetDefaults = () => {
    resetLanguage();
    resetSettings();
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
