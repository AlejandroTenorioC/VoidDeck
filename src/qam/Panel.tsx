// Layer 3: Void Deck settings in the Quick Access menu.
import { ButtonItem, DropdownItem, Navigation, PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { disableHome, enableHome } from "../home";
import { resetLanguage, setLanguage, strings, useLanguage, type Language } from "../i18n";
import { resetSettings, setHome, setSkin, useSettings } from "../settings";
import { applySkin, removeSkin } from "../skin";

const VERSION = "0.2.18";
const RELEASE_URL = "https://github.com/endoflineservice/VoidDeck/releases/latest";

export function Panel() {
  const settings = useSettings();
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
          checked={settings.skin}
          onChange={(on) => updateSkin(on, settings.theme === "light")}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label={copy.homeScreen}
          description={copy.homeScreenDescription}
          checked={settings.home}
          onChange={updateHome}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label={copy.lightTheme}
          description={copy.lightThemeDescription}
          checked={settings.theme === "light"}
          disabled={!settings.skin}
          onChange={(isLight) => updateSkin(settings.skin, isLight)}
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
