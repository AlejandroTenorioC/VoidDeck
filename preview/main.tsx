// Monta el plugin real dentro de un Acceso rápido simulado.
import { createRoot } from "react-dom/client";
import plugin from "../src/index";
import { installKeyboardNav } from "./keyboard";

const p = plugin();

function Screen() {
  return (
    <aside className="qam">
      <div className="qam-title">{p.titleView ?? p.name}</div>
      <div className="qam-body">{p.content}</div>
    </aside>
  );
}

createRoot(document.getElementById("screen")!).render(<Screen />);
installKeyboardNav();
