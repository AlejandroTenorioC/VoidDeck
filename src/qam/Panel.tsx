// Layer 3: Void Deck settings in the Quick Access menu.
import { useState } from "react";
import { toaster } from "@decky/api";
import { ButtonItem, DropdownItem, Navigation, PanelSection, PanelSectionRow, ToggleField } from "@decky/ui";
import { disableHome, enableHome } from "../home";
import { resetLanguage, setLanguage, strings, useLanguage, type Language } from "../i18n";
import { resetSettings, setDotEffect, setHome, setPostersBw, setSkin, useSettings, type DotEffect } from "../settings";
import { applyPosterColor, applySkin, removeSkin } from "../skin";
import { type UpdateCheck } from "../update/check";
import { installUpdate } from "../update/install";
import { useUpdateCheck } from "../update/useUpdateCheck";

export const VERSION = "1.2.2";
export const RELEASE_URL = "https://github.com/endoflineservice/VoidDeck/releases/latest";

/** Status line under the installed version: installed, still checking, check failed, update ready, or up to date. */
function describeVersion(update: UpdateCheck | null, copy: ReturnType<typeof strings>, installed: boolean): string {
  if (installed) return copy.updateInstalledBody;
  if (!update) return copy.versionDescription;
  if (!update.success) return copy.updateCheckFailed;
  return update.available ? copy.updateDescription : copy.upToDate;
}

export function Panel() {
  const settings = useSettings();
  const language = useLanguage();
  const copy = strings(language);
  const update = useUpdateCheck(VERSION);
  const [installing, setInstalling] = useState(false);
  const [installedVersion, setInstalledVersion] = useState<string | null>(null);

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

  const updatePosters = (on: boolean) => {
    setPostersBw(on);
    applyPosterColor(on);
  };

  const resetDefaults = () => {
    resetLanguage();
    resetSettings();
    applySkin("dark");
    enableHome();
    applyPosterColor(true);
  };

  const runUpdate = async () => {
    if (!update?.assetUrl || installing) return;
    setInstalling(true);
    const started = await installUpdate(update.assetUrl, update.latest ?? "", update.digest ?? "");
    setInstalling(false);
    if (started.success) {
      setInstalledVersion(update.latest ?? "");
      return;
    }
    toaster.toast({
      title: copy.updateFailedTitle,
      body: copy.updateFailedBody,
      onClick: () => Navigation.NavigateToSteamWeb(RELEASE_URL),
    });
    Navigation.NavigateToSteamWeb(RELEASE_URL);
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
          label={copy.postersBw}
          description={copy.postersBwDescription}
          checked={settings.postersBw}
          disabled={!settings.home}
          onChange={updatePosters}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <DropdownItem
          label={copy.dotEffect}
          description={copy.dotEffectDescription}
          rgOptions={[
            { label: copy.dotWave, data: "wave" },
            { label: copy.dotBoot, data: "boot" },
            { label: copy.dotRadar, data: "radar" },
            { label: copy.dotLadder, data: "ladder" },
            { label: copy.dotCompile, data: "compile" },
            { label: copy.dotMagnet, data: "magnet" },
            { label: copy.dotDiamond, data: "diamond" },
            { label: copy.dotRain, data: "rain" },
            { label: copy.dotOff, data: "none" },
          ]}
          selectedOption={settings.dotEffect}
          disabled={!settings.home}
          onChange={({ data }) => setDotEffect(data as DotEffect)}
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
        {installedVersion ? (
          <PanelSectionRow>
            <ButtonItem
              label={`${copy.updateInstalled} — ${installedVersion}`}
              description={copy.updateInstalledBody}
              onClick={() => Navigation.NavigateToSteamWeb(RELEASE_URL)}
            >
              {copy.releaseNotes}
            </ButtonItem>
          </PanelSectionRow>
        ) : (
          update?.success &&
          update.available &&
          update.assetUrl && (
            <PanelSectionRow>
              <ButtonItem
                label={`${copy.updateAvailable} — ${update.latest}`}
                description={copy.updateDescription}
                onClick={() => void runUpdate()}
              >
                {installing ? copy.updateInstalling : copy.updateNow}
              </ButtonItem>
            </PanelSectionRow>
          )
        )}
        <PanelSectionRow>
          <ButtonItem
            label={`Void Deck v${VERSION}`}
            description={describeVersion(update, copy, installedVersion !== null)}
            onClick={() => Navigation.NavigateToSteamWeb(RELEASE_URL)}
          >
            {copy.releaseNotes}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </PanelSection>
  );
}
