// Datos de ejemplo que imitan los stores de Steam (collectionStore, appStore, SteamClient).
const now = Math.floor(Date.now() / 1000);
const hours = (h: number) => h * 60;

const apps = [
  { appid: 1145350, display_name: "Hades II", minutes_playtime_forever: hours(48), rt_last_time_played: now - 2 * 3600, steam_hw_compat_category_packed: 3 },
  { appid: 504230, display_name: "Celeste", minutes_playtime_forever: hours(12), rt_last_time_played: now - 86400, steam_hw_compat_category_packed: 3 },
  { appid: 2379780, display_name: "Balatro", minutes_playtime_forever: 0, rt_last_time_played: 0, steam_hw_compat_category_packed: 3 },
  { appid: 753640, display_name: "Outer Wilds", minutes_playtime_forever: hours(31), rt_last_time_played: now - 3 * 86400, steam_hw_compat_category_packed: 2 },
  { appid: 367520, display_name: "Hollow Knight", minutes_playtime_forever: hours(76), rt_last_time_played: now - 6 * 86400, steam_hw_compat_category_packed: 3 },
  { appid: 553420, display_name: "Tunic", minutes_playtime_forever: hours(9), rt_last_time_played: now - 9 * 86400, steam_hw_compat_category_packed: 3 },
  { appid: 1868140, display_name: "Dave the Diver", minutes_playtime_forever: 35, rt_last_time_played: now - 20 * 86400, steam_hw_compat_category_packed: 3 },
];

export function installMockSteam() {
  Object.assign(window as any, {
    collectionStore: {
      recentAppsCollection: { allApps: apps },
      localGamesCollection: { allApps: [...apps, ...apps.map((a) => ({ ...a, appid: a.appid + 1 }))].sort((a, b) => a.display_name.localeCompare(b.display_name)) },
      myGamesCollection: { allApps: { length: 214 } },
    },
    // Sin portadas: el preview muestra las iniciales sobre la retícula, como el concepto.
    appStore: { GetCustomVerticalCapsuleURLs: () => [] },
    SteamClient: { Apps: { RunGame: (id: string) => console.info(`[SteamClient] RunGame ${id}`) } },
  });
}
