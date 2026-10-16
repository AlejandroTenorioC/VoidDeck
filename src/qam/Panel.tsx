// Layer 3: Void Deck settings in the Quick Access menu.
import { PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { useState } from "react";
import { disableHome, enableHome, homeEnabled } from "../home";
import { setLanguage, strings, useLanguage } from "../i18n";
import { applySkin, removeSkin, skinState } from "../skin";

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
    else disableHome();
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
          label={copy.spanishLanguage}
          description={copy.spanishLanguageDescription}
          checked={language === "es"}
          onChange={(spanish) => setLanguage(spanish ? "es" : "en")}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}
