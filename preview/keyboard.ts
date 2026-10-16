// Simulated controller via keyboard: arrows = D-pad, Enter = A.
const FOCUSABLE = "button, [tabindex='0']";

function move(step: 1 | -1) {
  const items = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (items.length === 0) return;
  const i = items.indexOf(document.activeElement as HTMLElement);
  const next = i === -1 ? 0 : Math.min(items.length - 1, Math.max(0, i + step));
  items[next].focus({ focusVisible: true } as FocusOptions);
}

export function installKeyboardNav() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") move(1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") move(-1);
    else return;
    e.preventDefault();
  });
  move(1);
}
