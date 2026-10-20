// Layer 3: update check against the latest GitHub release. Void Deck is installed from a release zip, not the
// Decky store, so Decky cannot offer the update itself; the panel does.
import { Navigation } from "@decky/ui";
import { version } from "../../package.json";
import { name } from "../../plugin.json";

export const RELEASE_URL = "https://github.com/AlejandroTenorioC/VoidDeck/releases/latest";
const LATEST_API = "https://api.github.com/repos/AlejandroTenorioC/VoidDeck/releases/latest";
// Unauthenticated GitHub API calls are limited per hour: ask at most once an hour.
const CHECK_EVERY_MS = 60 * 60 * 1000;
// Decky's install types (decky-loader frontend): 2 = update.
const INSTALL_TYPE_UPDATE = 2;

export type Release = { version: string; zipUrl: string; sha256: string };

let checked: { at: number; release: Release | null } | null = null;

/** "0.2.10" > "0.2.9": compare each number in turn. */
function isNewer(candidate: string, current: string): boolean {
  const a = candidate.split(".").map(Number);
  const b = current.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return false;
}

/** The latest release when it is newer than the installed plugin, otherwise null. */
export async function checkForUpdate(): Promise<Release | null> {
  if (checked && Date.now() - checked.at < CHECK_EVERY_MS) return checked.release;
  let release: Release | null = null;
  try {
    const response = await fetch(LATEST_API, { headers: { Accept: "application/vnd.github+json" } });
    if (response.ok) {
      const data = await response.json();
      const latest = String(data.tag_name ?? "").replace(/^v/, "");
      const zip = (data.assets ?? []).find((a: any) => /\.zip$/.test(a.name));
      if (zip && isNewer(latest, version)) {
        release = { version: latest, zipUrl: zip.browser_download_url, sha256: String(zip.digest ?? "").replace(/^sha256:/, "") };
      }
    }
  } catch (error) {
    console.warn("[Void Deck] update check failed", error);
  }
  checked = { at: Date.now(), release };
  return release;
}

/**
 * Hand the release zip to Decky, which asks for confirmation, installs it and reloads the plugin. This is the
 * call Decky's own "Install from URL" makes; it is not a public API, so on failure the release page opens.
 * The name must be the one in plugin.json: Decky uses it to unload the running copy before installing.
 */
export async function installUpdate(release: Release): Promise<void> {
  try {
    const backend = (window as any).DeckyBackend;
    if (!backend) throw new Error("DeckyBackend unavailable");
    await backend.call("utilities/install_plugin", release.zipUrl, name, release.version, release.sha256, INSTALL_TYPE_UPDATE);
  } catch (error) {
    console.warn("[Void Deck] update install failed", error);
    Navigation.NavigateToSteamWeb(RELEASE_URL);
  }
}
