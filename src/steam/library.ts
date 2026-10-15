// Datos de la biblioteca de Steam: juegos recientes, portadas y acciones.
import { Navigation } from "@decky/ui";

export interface Game {
  appid: number;
  gameid: string;
  name: string;
  /** Minutos jugados en total. */
  minutes: number;
  /** Última partida, en segundos Unix (0 si nunca). */
  lastPlayed: number;
  /** 0 desconocido, 1 no compatible, 2 jugable, 3 verificado. */
  deckCompat: number;
  /** Portadas 2:3 candidatas, de más a menos preferida. */
  covers: string[];
}

const ASSETS = "https://steamloopback.host";
// Los accesos directos que no son de Steam usan appids por encima de 2^31.
const isSteamApp = (appid: number) => appid < 0x80000000;

const stores = () => window as any;

function toGame(app: any): Game {
  const appStore = stores().appStore;
  // Mismo orden que el Inicio de Steam: portada personalizada, CDN de Steam y caché local.
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
 * Juegos instalados en esta Deck, en orden alfabético. Incluye los accesos directos que no son
 * de Steam (emuladores, otras tiendas): la colección "type-games" los contiene, "local-install" no.
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
