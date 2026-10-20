type LoaderBackend = { call: (route: string, ...args: unknown[]) => Promise<unknown> };

/**
 * GitHub reports asset digests as `sha256:<hex>`, but Decky's installer compares against bare hex
 * and aborts with "SHA-256 Mismatch" otherwise. Anything unverifiable becomes an empty hash so the
 * install proceeds without an integrity check instead of failing.
 */
function bareDigest(digest: string): string {
  const hex = digest.trim().replace(/^sha256:/i, "");
  return /^[0-9a-f]{64}$/i.test(hex) ? hex : "";
}

/** Decky Loader's own router: the only path to loader-level routes such as the plugin installer. */
function loaderBackend(): LoaderBackend | null {
  const backend = (globalThis as typeof globalThis & { DeckyBackend?: LoaderBackend }).DeckyBackend;
  return backend && typeof backend.call === "function" ? backend : null;
}

/**
 * Hand the release zip to Decky's installer, which opens its native confirmation dialog.
 * Returns `{success:false}` instead of throwing when the loader route is unavailable.
 */
export async function installUpdate(
  assetUrl: string,
  version: string,
  digest: string,
): Promise<{ success: boolean; error?: string }> {
  if (!assetUrl) return { success: false, error: "No release asset to install" };
  const backend = loaderBackend();
  if (!backend) return { success: false, error: "Decky install route unavailable" };
  try {
    // install_type is omitted so Decky's own default (fresh install) applies.
    await backend.call("utilities/install_plugin", assetUrl, "Void Deck", version, bareDigest(digest));
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
