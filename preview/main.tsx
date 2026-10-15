// Monta el plugin real: la ruta de Inicio (con los parches del plugin) y el Acceso rápido simulado.
import type { RoutePatch } from "@decky/api/dist/types";
import { useEffect, useReducer, useState } from "react";
import { createRoot } from "react-dom/client";
import plugin from "../src/index";
import { installKeyboardNav } from "./keyboard";
import { installMockSteam } from "./mockSteam";
import { onRoutesChange, previewRoute } from "./stubs/decky-api";

installMockSteam();
const p = plugin();

function SteamHome() {
  return <div className="steam-home">Inicio de Steam (sin parche)</div>;
}

function HomeRoute() {
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  useEffect(() => onRoutesChange(rerender), []);
  const route = previewRoute("/library/home").reduce<ReturnType<RoutePatch>>((r, patch) => patch(r), {
    path: "/library/home",
    children: <SteamHome />,
  });
  return <>{route.children}</>;
}

function Screen() {
  const [qam, setQam] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key.toLowerCase() === "p" && setQam((v) => !v);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <div className="steam-header" />
      <HomeRoute />
      <div className="steam-footer">P · ACCESO RÁPIDO &nbsp; Q/E · L1/R1 &nbsp; ENTER · A &nbsp; X · X</div>
      {qam && (
        <aside className="qam">
          <div className="qam-title">{p.titleView ?? p.name}</div>
          <div className="qam-body">{p.content}</div>
        </aside>
      )}
    </>
  );
}

createRoot(document.getElementById("screen")!).render(<Screen />);
installKeyboardNav();
