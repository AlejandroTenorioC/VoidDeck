import { fetchNoCors } from "@decky/api";
import { isNewerVersion } from "./versions";

const RELEASES_API = "https://api.github.com/repos/endoflineservice/VoidDeck/releases/latest";
const ASSET_PREFIX = "VoidDeck-";
const ASSET_SUFFIX = ".zip";
const CACHE_TTL_MS = 60 * 60 * 1000;

/** Outcome of a release check. `success: false` always carries `error`; the function never throws. */
export type UpdateCheck = {
  success: boolean;
  error?: string;
  available: boolean;
  current: string;
  latest?: string;
  assetUrl?: string;
  assetName?: string;
  digest?: string;
  notesUrl?: string;
};

type ReleaseAsset = { name?: unknown; browser_download_url?: unknown; digest?: unknown };
type ReleasePayload = { tag_name?: unknown; html_url?: unknown; assets?: unknown };

let cache: { checkedAt: number; result: UpdateCheck } | null = null;

function pickAsset(assets: ReleaseAsset[], tag: string): ReleaseAsset | null {
  const preferred = `${ASSET_PREFIX}${tag}${ASSET_SUFFIX}`;
  return (
    assets.find((asset) => asset.name === preferred) ??
    assets.find((asset) => typeof asset.name === "string" && asset.name.endsWith(ASSET_SUFFIX)) ??
    null
  );
}

/** Validate a GitHub release payload against the installed version; malformed input becomes an error result. */
function readRelease(payload: ReleasePayload, current: string): UpdateCheck {
  const failed = (error: string): UpdateCheck => ({ success: false, error, available: false, current });
  if (typeof payload.tag_name !== "string") return failed("Unexpected release payload");

  const latest = payload.tag_name;
  const notesUrl = typeof payload.html_url === "string" ? payload.html_url : RELEASES_API;
  const assets = Array.isArray(payload.assets) ? (payload.assets as ReleaseAsset[]) : [];
  const asset = pickAsset(assets, latest);
  if (!asset || typeof asset.browser_download_url !== "string") {
    return failed("Release ships no installable zip");
  }

  const shared = {
    success: true,
    current,
    latest,
    assetUrl: asset.browser_download_url,
    assetName: typeof asset.name === "string" ? asset.name : "",
    digest: typeof asset.digest === "string" ? asset.digest : "",
    notesUrl,
  };
  return { ...shared, available: isNewerVersion(latest, current) };
}

/** Ask GitHub for the latest Void Deck release. Cached for an hour; failures return `{success:false}`. */
export async function checkForUpdate(current: string, force = false): Promise<UpdateCheck> {
  const fresh = cache && cache.result.current === current && Date.now() - cache.checkedAt < CACHE_TTL_MS;
  if (!force && fresh && cache) return cache.result;

  try {
    const response = await fetchNoCors(RELEASES_API);
    if (!response.ok) {
      return { success: false, error: `GitHub responded ${response.status}`, available: false, current };
    }
    const result = readRelease((await response.json()) as ReleasePayload, current);
    if (result.success) cache = { checkedAt: Date.now(), result };
    return result;
  } catch (error) {
    return { success: false, error: String(error), available: false, current };
  }
}
