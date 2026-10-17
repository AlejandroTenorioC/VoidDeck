// Layer 2: replace Steam's Home route with the Void Deck screen.
import { routerHook } from "@decky/api";
import { Navigation } from "@decky/ui";
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

export function disableHome(navigateAway = false): void {
  if (!active) return;
  routerHook.removePatch(HOME_ROUTE, patch);
  active = false;
  if (navigateAway) Navigation.NavigateToLibraryTab();
}

export const homeEnabled = () => active;
