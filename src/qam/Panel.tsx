// Capa 3: ajustes de Void Deck en el menú de Acceso rápido.
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
          label="Piel global"
          description="Aplica los colores y tipografías de Void Deck a toda la interfaz."
          checked={skinOn}
          onChange={(on) => updateSkin(on, light)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Pantalla de Inicio"
          description="Sustituye el Inicio de Steam por el de Void Deck."
          checked={homeOn}
          onChange={updateHome}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Tema claro"
          description="Para uso en exterior."
          checked={light}
          disabled={!skinOn}
          onChange={(isLight) => updateSkin(skinOn, isLight)}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}
