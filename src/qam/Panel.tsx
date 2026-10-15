// Capa 3: ajustes de Void Deck en el menú de Acceso rápido.
import { PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { useState } from "react";
import { applySkin, removeSkin, skinState } from "../skin";

export function Panel() {
  const [skinOn, setSkinOn] = useState(() => skinState().on);
  const [light, setLight] = useState(() => skinState().theme === "light");

  const update = (on: boolean, isLight: boolean) => {
    setSkinOn(on);
    setLight(isLight);
    if (on) applySkin(isLight ? "light" : "dark");
    else removeSkin();
  };

  return (
    <PanelSection title="VOID DECK">
      <PanelSectionRow>
        <ToggleField
          label="Piel global"
          description="Aplica los colores y tipografías de Void Deck a toda la interfaz."
          checked={skinOn}
          onChange={(on) => update(on, light)}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <ToggleField
          label="Tema claro"
          description="Para uso en exterior."
          checked={light}
          disabled={!skinOn}
          onChange={(isLight) => update(skinOn, isLight)}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}
