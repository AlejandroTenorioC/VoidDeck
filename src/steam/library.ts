// Steam library data: recent games, cover art, and actions.
import { Navigation } from "@decky/ui";

export interface Game {
  appid: number;
  gameid: string;
  name: string;
  /** Total minutes played. */
  minutes: number;
  /** Last play time, as Unix seconds (0 if never). */
  lastPlayed: number;
  /** 0 unknown, 1 unsupported, 2 playable, 3 verified. */
  deckCompat: number;
  /** Candidate 2:3 covers, in descending preference. */
  covers: string[];
}

const ASSETS = "https://steamloopback.host";
// Non-Steam shortcuts use app IDs above 2^31.
const isSteamApp = (appid: number) => appid < 0x80000000;

const stores = () => window as any;

function toGame(app: any): Game {
  const appStore = stores().appStore;
  // Same order as Steam Home: custom cover, Steam CDN, then local cache.
  const custom: string[] = appStore?.GetCustomVerticalCapsuleURLs?.(app) ?? [];
  const covers = custom.map((u) => (u.startsWith("http") ? u : ASSETS + u));
  if (isSteamApp(app.appid)) {
    const cdn: string | undefined = appStore?.GetVerticalCapsuleURLForApp?.(app);
    if (cdn) covers.push(cdn);
    covers.push(`${ASSETS}/assets/${app.appid}/library_600x900.jpg`);
  }
  return {
    appid: app.appid,
    gameid: String(app.m_gameid ?? app.appid),
    name: app.display_name ?? "",
    minutes: app.minutes_playtime_forever ?? 0,
    lastPlayed: app.rt_last_time_played ?? 0,
    deckCompat: (app.steam_hw_compat_category_packed ?? 0) & 3,
    covers,
  };
}

export function recentGames(limit: number): Game[] {
  const apps: any[] = stores().collectionStore?.recentAppsCollection?.allApps ?? [];
  return apps.slice(0, limit).map(toGame);
}

/**
 * Games installed on this Deck, alphabetically. Includes non-Steam shortcuts
 * (emulators, other stores): the "type-games" collection contains them, while "local-install" does not.
 */
export function installedGames(): Game[] {
  const store = stores().collectionStore;
  const games: any[] | undefined = store?.appTypeCollectionMap?.get?.("type-games")?.allApps;
  const apps = games ? games.filter((a) => a.installed) : (store?.localGamesCollection?.allApps ?? []);
  return apps.map(toGame);
}

export function libraryCount(): number {
  return stores().collectionStore?.myGamesCollection?.allApps?.length ?? 0;
}

export function playGame(game: Game): void {
  stores().SteamClient?.Apps?.RunGame(game.gameid, "", -1, 100);
}

export function openDetails(game: Game): void {
  Navigation.Navigate(`/library/app/${game.appid}`);
}
