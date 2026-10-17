// Minimal @decky/ui implementations for the preview: only what Void Deck uses.
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";

export const staticClasses = { Title: "stub-title" } as Record<string, string>;

// The preview has no minified classes: every name resolves to itself.
const identity = new Proxy({}, { get: (_t, name) => (typeof name === "string" ? name : undefined) });
export const classMap = [identity as Record<string, string>];
export function findClassModule(filter: (m: any) => boolean): Record<string, string> | void {
  return filter(identity) ? (identity as Record<string, string>) : undefined;
}

export enum GamepadButton {
  OK = 1,
  CANCEL = 2,
  SECONDARY = 3,
  BUMPER_LEFT = 5,
  BUMPER_RIGHT = 6,
}

export enum QuickAccessTab {
  Friends = 3,
}

export type GamepadEvent = CustomEvent<{ button: number }>;

const log = (what: string) => () => console.info(`[Navigation] ${what}`);
export const Navigation = {
  Navigate: (path: string) => console.info(`[Navigation] Navigate ${path}`),
  NavigateToLibraryTab: log("NavigateToLibraryTab"),
  NavigateToSteamWeb: (url: string) => console.info(`[Navigation] NavigateToSteamWeb ${url}`),
  OpenQuickAccessMenu: (tab?: number) => console.info(`[Navigation] OpenQuickAccessMenu ${tab}`),
};

type FocusableProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  "flow-children"?: string;
  focusClassName?: string;
  noFocusRing?: boolean;
  onActivate?: () => void;
  onSecondaryButton?: () => void;
  onButtonDown?: (e: GamepadEvent) => void;
  onGamepadFocus?: () => void;
  preferredFocus?: boolean;
  onOKActionDescription?: ReactNode;
  onSecondaryActionDescription?: ReactNode;
};

// Teclado → mando: Enter = A, X = X, Q/E = L1/R1.
const KEY_BUTTONS: Record<string, GamepadButton> = { q: GamepadButton.BUMPER_LEFT, e: GamepadButton.BUMPER_RIGHT };

export const Focusable = forwardRef<HTMLDivElement, FocusableProps>(function Focusable(props, ref) {
  const {
    focusClassName, noFocusRing, preferredFocus, onActivate, onSecondaryButton, onButtonDown, onGamepadFocus,
    onOKActionDescription, onSecondaryActionDescription, className, onFocus, onBlur, ...rest
  } = props;
  void noFocusRing; void preferredFocus; void onOKActionDescription; void onSecondaryActionDescription;
  const [focused, setFocused] = useState(false);
  const interactive = Boolean(onActivate || onSecondaryButton);
  return (
    <div
      {...rest}
      ref={ref}
      tabIndex={interactive ? 0 : undefined}
      className={[className, focused && focusClassName].filter(Boolean).join(" ")}
      onFocus={(e) => {
        if (e.target === e.currentTarget) {
          setFocused(true);
          onGamepadFocus?.();
        }
        onFocus?.(e);
      }}
      onBlur={(e) => {
        if (e.target === e.currentTarget) setFocused(false);
        onBlur?.(e);
      }}
      onKeyDown={(e) => {
        const key = e.key.toLowerCase();
        if (e.target === e.currentTarget && key === "enter") onActivate?.();
        else if (e.target === e.currentTarget && key === "x") onSecondaryButton?.();
        else if (KEY_BUTTONS[key] && onButtonDown) {
          onButtonDown(new CustomEvent("button", { detail: { button: KEY_BUTTONS[key] } }));
        } else return;
        e.stopPropagation();
      }}
    />
  );
});

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

type DropdownOption = { data: any; label: ReactNode };

export function DropdownItem(props: {
  label?: ReactNode;
  description?: ReactNode;
  rgOptions: DropdownOption[];
  selectedOption: any;
  onChange?: (option: DropdownOption) => void;
}) {
  return (
    <label className="stub-dropdown">
      <span className="stub-toggle-text">
        <div className="stub-toggle-label">{props.label}</div>
        {props.description && <div className="stub-toggle-desc">{props.description}</div>}
      </span>
      <select value={props.selectedOption} onChange={(e) => props.onChange?.(props.rgOptions.find((o) => o.data === e.target.value) ?? props.rgOptions[0])}>
        {props.rgOptions.map((option) => <option key={String(option.data)} value={option.data}>{option.label}</option>)}
      </select>
    </label>
  );
}

export function ButtonItem(props: { label?: ReactNode; description?: ReactNode; children?: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" className="stub-toggle" onClick={props.onClick}>
      <span className="stub-toggle-text">
        <div className="stub-toggle-label">{props.label}</div>
        {props.description && <div className="stub-toggle-desc">{props.description}</div>}
      </span>
      {props.children && <span>{props.children}</span>}
    </button>
  );
}
