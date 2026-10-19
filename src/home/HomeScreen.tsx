// Layer 2: Void Deck's Home screen. Measurements are in design pixels (1280×800);
// the container scales to the actual CSS size of the Steam window.
import { Focusable, GamepadButton, Menu, MenuItem, Navigation, QuickAccessTab, showContextMenu, type GamepadEvent } from "@decky/ui";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { strings, useLanguage, type Language } from "../i18n";
import { skinState } from "../skin";
import { cls } from "../steam/classes";
import { installedGames, libraryCount, openDetails, openProperties, playGame, recentGames, type Game } from "../steam/library";
import { fontsCss } from "../theme/fonts";
import { tokensCss } from "../theme/tokens";
import { FROM_HOME_ATTR, FROM_HOME_MS, FROM_HOME_VALUE } from "../theme/transitions";
import { deckCompat, glyph, playtime, shortPlaytime, since } from "./format";
import { homeCss } from "./homeCss";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;
const SHELF_SIZE = 7;
// Space above the focused row when scrolling: Steam bar (60) + section title and padding.
const ROW_TOP_SPACE = 136;
// Decky art plugins rewrite Steam's capsule URLs, so the shelf re-reads them.
const ART_REFRESH_MS = 15000;

const tabs = (language: Language): { label: string; go?: () => void }[] => {
  const copy = strings(language);
  return [
    { label: copy.home, go: () => Navigation.Navigate("/library/home") },
    { label: copy.library, go: () => Navigation.NavigateToLibraryTab() },
    { label: copy.friends, go: () => Navigation.OpenQuickAccessMenu(QuickAccessTab.Friends) },
  ];
};

/** Scale content so the 1280x800 design box always fits the window, whatever its ratio. */
function useDesignScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ zoom: 1, width: DESIGN_WIDTH, height: DESIGN_HEIGHT });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      // Scale by the tighter axis: the design box keeps its proportions and the extra
      // room on the other axis becomes margin, so nothing is ever squeezed or cut off.
      const zoom = Math.min(w / DESIGN_WIDTH, h / DESIGN_HEIGHT);
      const width = w / zoom;
      const height = h / zoom;
      // Steam can emit a layout-driven resize while React is committing. Avoid scheduling
      // another render when its dimensions did not actually change.
      setBox((previous) =>
        previous.zoom === zoom && previous.width === width && previous.height === height
          ? previous
          : { zoom, width, height },
      );
    };
    measure();
    const win = el.ownerDocument.defaultView ?? window;
    win.addEventListener("resize", measure);
    // Steam resizes the Home container without a window resize (bars, overlays). An older engine
    // may lack ResizeObserver; the window listener above still covers that case.
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observer?.observe(el);
    return () => {
      win.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, []);
  return { ref, ...box };
}

/**
 * When Home begins to leave (Steam adds `Exit` to its transition container), mark the document
 * so the incoming screen uses the matching dot-dissolve transition.
 */
function useFromHomeMark(ref: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = el.ownerDocument.documentElement;
    const transition = el.closest(cls("TopLevelTransition", "EnterActive"));
    const exit = cls("Exit", "TopLevelTransition").slice(1);
    if (!transition) return;
    const observer = new MutationObserver(() => {
      if (!transition.classList.contains(exit)) return;
      observer.disconnect();
      root.setAttribute(FROM_HOME_ATTR, FROM_HOME_VALUE);
      setTimeout(() => root.removeAttribute(FROM_HOME_ATTR), FROM_HOME_MS);
    });
    observer.observe(transition, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [ref]);
}

function Cover({ game }: { game: Game }) {
  const [index, setIndex] = useState(0);
  const src = game.covers[index];
  return (
    <div className="vd-tile-art">
      <span className="vd-tile-glyph">{glyph(game.name)}</span>
      {src && <img src={src} alt="" loading="lazy" onError={() => setIndex((i) => i + 1)} />}
    </div>
  );
}

/** The native game menu lived in Steam Home, which Void Deck replaces; this rebuilds it. */
function openTileMenu(game: Game, language: Language, parent: HTMLElement | null): void {
  const copy = strings(language);
  showContextMenu(
    <Menu label={game.name}>
      <MenuItem onClick={() => playGame(game)}>{copy.play}</MenuItem>
      <MenuItem onClick={() => openDetails(game)}>{copy.details}</MenuItem>
      <MenuItem onClick={() => openProperties(game)}>{copy.properties}</MenuItem>
    </Menu>,
    parent ?? undefined,
  );
}

function Tile(props: { game: Game; first?: boolean; language: Language; onFocus: (el: HTMLDivElement) => void }) {
  const { game, first, language, onFocus } = props;
  const ref = useRef<HTMLDivElement>(null);
  const focus = () => ref.current && onFocus(ref.current);
  return (
    <Focusable
      ref={ref}
      className="vd-tile"
      focusClassName="is-focused"
      noFocusRing
      preferredFocus={first}
      onActivate={() => playGame(game)}
      onSecondaryButton={() => openDetails(game)}
      onOKActionDescription={strings(language).play}
      onSecondaryActionDescription={strings(language).details}
      onMenuButton={() => openTileMenu(game, language, ref.current)}
      onMenuActionDescription={strings(language).menu}
      onGamepadFocus={focus}
      onFocus={focus}
    >
      <Cover game={game} />
      <div className="vd-tile-meta">
        <span className="vd-tile-title">{game.name}</span>
        <span className="vd-tile-detail">{shortPlaytime(game.minutes, language)}</span>
      </div>
    </Focusable>
  );
}

function Hero({ game, language, onFocus }: { game: Game; language: Language; onFocus: () => void }) {
  const copy = strings(language);
  const time = playtime(game.minutes, language);
  const last = since(game.lastPlayed, language);
  const compat = deckCompat(game.deckCompat, language);
  const button = (variant: string, glyphLabel: string, label: string, action: () => void) => (
    <Focusable
      className={`vd-btn vd-btn-${variant}`}
      focusClassName="is-focused"
      noFocusRing
      onActivate={action}
      onGamepadFocus={onFocus}
      onFocus={onFocus}
    >
      <span className="vd-btn-glyph">{glyphLabel}</span>
      {label}
    </Focusable>
  );
  return (
    <section className="vd-hero">
      <div className="vd-field" aria-hidden />
      <span className="vd-kicker">{last ? `${copy.continue} · ${copy.played} ${last}` : copy.ready}</span>
      <h1
        className={
          game.name.length > 48
            ? "vd-gtitle is-ultra-long"
            : game.name.length > 32
              ? "vd-gtitle is-extra-long"
              : game.name.length > 20
                ? "vd-gtitle is-long"
                : game.name.length > 13
                  ? "vd-gtitle is-medium"
                  : "vd-gtitle"
        }
      >
        {game.name}
      </h1>
      <div className="vd-meta">
        {time && (
          <span>
            <b>{time.value}</b> {time.unit}
          </span>
        )}
        {compat && <span>{compat}</span>}
      </div>
      <Focusable className="vd-actions" flow-children="horizontal">
        {button("primary", "A", copy.play, () => playGame(game))}
        {button("secondary", "X", copy.details, () => openDetails(game))}
      </Focusable>
    </section>
  );
}

/**
 * Custom scrolling: content moves with a transform and one transition.
 * The container uses `overflow: clip`, so the browser cannot jump instantly when
 * focus arrives (which caused a jerk when chained to an animation).
 */
function useScroller(viewport: RefObject<HTMLDivElement>, content: RefObject<HTMLDivElement>) {
  const [offset, setOffset] = useState(0);
  const scroller = useMemo(
    () => ({
      toTop: () => setOffset((previous) => (previous === 0 ? previous : 0)),
      /** Move the item's row to just below the top bar and section title. */
      reveal: (el: HTMLElement) => {
        const view = viewport.current?.clientHeight ?? 0;
        const max = Math.max(0, (content.current?.offsetHeight ?? 0) - view);
        let top = 0;
        for (let n: HTMLElement | null = el; n && n !== content.current; n = n.offsetParent as HTMLElement | null) {
          top += n.offsetTop;
        }
        const next = Math.min(max, Math.max(0, top - ROW_TOP_SPACE));
        setOffset((previous) => (previous === next ? previous : next));
      },
    }),
    [viewport, content],
  );
  return { offset, ...scroller };
}

export function HomeScreen() {
  const language = useLanguage();
  const copy = strings(language);
  const navigationTabs = tabs(language);
  const [artTick, setArtTick] = useState(0);
  const recent = useMemo(() => recentGames(SHELF_SIZE), [artTick]);
  const installed = useMemo(() => installedGames(), [artTick]);
  const total = useMemo(() => libraryCount(), [artTick]);
  // The hero is held by appid so it survives a refresh and picks up new art.
  const [heroId, setHeroId] = useState<number | undefined>(() => (recent[0] ?? installed[0])?.appid);
  const hero = useMemo(() => {
    if (heroId === undefined) return undefined;
    return [...recent, ...installed].find((game) => game.appid === heroId) ?? recent[0] ?? installed[0];
  }, [heroId, recent, installed]);
  const { ref, zoom, width, height } = useDesignScale();
  useFromHomeMark(ref);
  const homeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scroll = useScroller(homeRef, contentRef);
  useEffect(() => {
    const refresh = () => setArtTick((tick) => tick + 1);
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, ART_REFRESH_MS);
    return () => {
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, []);
  // Local tokens and fonts let the screen work even with the global skin turned off.
  const theme = skinState().theme;
  const css = useMemo(
    () =>
      `${fontsCss}\n${tokensCss(theme, ".vd-home-viewport")}\n${homeCss}\n` +
      // Steam Home enabled the top bar (clock, battery); without it, it stays transparent.
      `${cls("Header", "OverrideHeaderBackground")} { opacity: 1 !important; }`,
    [theme],
  );

  const onBumper = (e: GamepadEvent) => {
    const button = e.detail.button;
    if (button === GamepadButton.BUMPER_LEFT) navigationTabs[0].go?.();
    else if (button === GamepadButton.BUMPER_RIGHT) navigationTabs[1].go?.();
  };

  return (
    <div className="vd-home-viewport" ref={ref}>
      <style>{css}</style>
      <Focusable
        className="vd-home"
        ref={homeRef}
        style={{ zoom, width, height }}
        onButtonDown={onBumper}
      >
        <div className="vd-scroll" ref={contentRef} style={{ transform: `translateY(${-scroll.offset}px)` }}>
          <div className="vd-page" style={{ height }}>
            <Focusable className="vd-tabs" flow-children="horizontal">
              <span className="vd-trigger">L1</span>
              {navigationTabs.map((t, i) => (
                <Focusable
                  key={t.label}
                  className={i === 0 ? "vd-tab is-active" : "vd-tab"}
                  focusClassName="is-focused"
                  noFocusRing
                  onActivate={() => t.go?.()}
                  onGamepadFocus={scroll.toTop}
                  onFocus={scroll.toTop}
                >
                  {t.label}
                </Focusable>
              ))}
              <span className="vd-trigger">R1</span>
            </Focusable>

            {hero ? (
              <Hero game={hero} language={language} onFocus={scroll.toTop} />
            ) : (
              <section className="vd-hero">
                <div className="vd-field" aria-hidden />
                <span className="vd-kicker">{copy.noInstalledGames}</span>
                <h1 className="vd-gtitle">VOID</h1>
                <p className="vd-empty-description">{copy.noInstalledGamesDescription}</p>
                <Focusable
                  className="vd-empty-library"
                  focusClassName="is-focused"
                  noFocusRing
                  onActivate={() => Navigation.NavigateToLibraryTab()}
                >
                  {copy.openLibrary}
                </Focusable>
              </section>
            )}

            {recent.length > 0 && (
              <section>
                <div className="vd-shelf-h">
                  <h2>{copy.recentlyPlayed}</h2>
                  {total > 0 && <span className="vd-kicker">{`${recent.length} ${copy.of} ${total}`}</span>}
                </div>
                <Focusable className="vd-shelf" flow-children="horizontal">
                  {recent.map((g, i) => (
                    <Tile
                      key={g.appid}
                      game={g}
                      first={i === 0}
                      language={language}
                      onFocus={() => {
                        setHeroId((current) => (current === g.appid ? current : g.appid));
                        scroll.toTop();
                      }}
                    />
                  ))}
                </Focusable>
              </section>
            )}
          </div>

          {installed.length > 0 && (
            <section className="vd-installed">
              <div className="vd-shelf-h">
                <h2>{copy.installed}</h2>
                <span className="vd-kicker">{`${installed.length} ${copy.games}`}</span>
              </div>
              <Focusable className="vd-grid" flow-children="grid">
                {installed.map((g) => (
                  <Tile
                    key={g.appid}
                    game={g}
                    language={language}
                    onFocus={(el) => {
                      setHeroId((current) => (current === g.appid ? current : g.appid));
                      scroll.reveal(el);
                    }}
                  />
                ))}
              </Focusable>
            </section>
          )}
        </div>
      </Focusable>
    </div>
  );
}
