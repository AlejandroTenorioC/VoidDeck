// Versiones mínimas de @decky/ui para el preview. Solo lo que usa Void Deck.
import type { ReactNode } from "react";

export const staticClasses = { Title: "stub-title" } as Record<string, string>;

// En el preview no hay clases minificadas: cada nombre se traduce a sí mismo.
const identity = new Proxy({}, { get: (_t, name) => (typeof name === "string" ? name : undefined) });
export function findClassModule(filter: (m: any) => boolean): Record<string, string> | void {
  return filter(identity) ? (identity as Record<string, string>) : undefined;
}

export function PanelSection(props: { title?: string; children?: ReactNode }) {
  return (
    <section className="stub-section">
      {props.title && <div className="stub-section-title">{props.title}</div>}
      {props.children}
    </section>
  );
}

export function PanelSectionRow(props: { children?: ReactNode }) {
  return <div className="stub-row">{props.children}</div>;
}

export function ToggleField(props: {
  label?: ReactNode;
  description?: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={props.checked}
      aria-disabled={props.disabled}
      className="stub-toggle"
      onClick={() => !props.disabled && props.onChange?.(!props.checked)}
    >
      <span className="stub-toggle-text">
        <div className="stub-toggle-label">{props.label}</div>
        {props.description && <div className="stub-toggle-desc">{props.description}</div>}
      </span>
      <span className={props.checked ? "stub-switch is-on" : "stub-switch"} />
    </button>
  );
}
