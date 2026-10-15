// Capa 2: sustituye la ruta de Inicio de Steam por la pantalla de Void Deck.
import { routerHook } from "@decky/api";
import { HomeScreen } from "./HomeScreen";

const HOME_ROUTE = "/library/home";

type RoutePatch = Parameters<typeof routerHook.addPatch>[1];

const patch: RoutePatch = (route) => ({ ...route, children: <HomeScreen /> });
let active = false;

export function enableHome(): void {
  if (active) return;
  routerHook.addPatch(HOME_ROUTE, patch);
  active = true;
}

export function disableHome(): void {
  if (!active) return;
  routerHook.removePatch(HOME_ROUTE, patch);
  active = false;
}

export const homeEnabled = () => active;
