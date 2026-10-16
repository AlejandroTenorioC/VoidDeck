// Layer 3: Void Deck settings in the Quick Access menu.
import { PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { useState } from "react";
import { disableHome, enableHome, homeEnabled } from "../home";
import { applySkin, removeSkin, skinState } from "../skin";

export function Panel() {
  const [skinOn, setSkinOn] = useState(() => skinState().on);
  const [light, setLight] = useState(() => skinState().theme === "light");
  const [homeOn, setHomeOn] = useState(homeEnabled);

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
          label="Global skin"
          description="Apply Void Deck colors and typefaces across the whole interface."
          checked={skinOn}
          onChange={(on) => updateSkin(on, light)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Home screen"
          description="Replace Steam Home with Void Deck Home."
          checked={homeOn}
          onChange={updateHome}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Light theme"
          description="For outdoor use."
          checked={light}
          disabled={!skinOn}
          onChange={(isLight) => updateSkin(skinOn, isLight)}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}
