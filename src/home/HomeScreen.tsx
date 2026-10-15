// Capa 2: pantalla de Inicio de Void Deck. Medidas en píxeles del concepto (1280×800);
// el contenedor se escala al tamaño CSS real de la ventana de Steam.
import { Focusable, GamepadButton, Navigation, QuickAccessTab, type GamepadEvent } from "@decky/ui";
import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { skinState } from "../skin";
import { cls } from "../steam/classes";
import { installedGames, libraryCount, openDetails, playGame, recentGames, type Game } from "../steam/library";
import { fontsCss } from "../theme/fonts";
import { tokensCss } from "../theme/tokens";
import { deckCompat, glyph, playtime, shortPlaytime, since } from "./format";
import { homeCss } from "./homeCss";

const DESIGN_WIDTH = 1280;
const SHELF_SIZE = 7;

const TABS: { label: string; go?: () => void }[] = [
  { label: "Inicio" },
  { label: "Biblioteca", go: () => Navigation.NavigateToLibraryTab() },
  { label: "Tienda", go: () => Navigation.NavigateToSteamWeb("https://store.steampowered.com/") },
  { label: "Amigos", go: () => Navigation.OpenQuickAccessMenu(QuickAccessTab.Friends) },
  { label: "Descargas", go: () => Navigation.Navigate("/downloads") },
];

/** Escala el contenido para que 1280 px de diseño ocupen el ancho real de la ventana. */
function useDesignScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ zoom: 1, height: 800 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const zoom = el.clientWidth / DESIGN_WIDTH;
      setBox({ zoom, height: el.clientHeight / zoom });
    };
    measure();
    const win = el.ownerDocument.defaultView ?? window;
    win.addEventListener("resize", measure);
    return () => win.removeEventListener("resize", measure);
  }, []);
  return { ref, ...box };
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

function Tile(props: { game: Game; first?: boolean; onFocus: (el: HTMLDivElement) => void }) {
  const { game, first, onFocus } = props;
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
      onOKActionDescription="Jugar"
      onSecondaryActionDescription="Detalles"
      onGamepadFocus={focus}
      onFocus={focus}
    >
      <Cover game={game} />
      <div className="vd-tile-meta">
        <span className="vd-tile-title">{game.name}</span>
        <span className="vd-tile-detail">{shortPlaytime(game.minutes)}</span>
      </div>
    </Focusable>
  );
}

function Hero({ game, onFocus }: { game: Game; onFocus: () => void }) {
  const time = playtime(game.minutes);
  const last = since(game.lastPlayed);
  const compat = deckCompat(game.deckCompat);
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
      <span className="vd-kicker">{last ? `Continuar · jugado ${last}` : "Listo para jugar"}</span>
      <h1 className={game.name.length > 14 ? "vd-gtitle is-long" : "vd-gtitle"}>{game.name}</h1>
      <div className="vd-meta">
        {time && (
          <span>
            <b>{time.value}</b> {time.unit}
          </span>
        )}
        {compat && <span>{compat}</span>}
      </div>
      <Focusable className="vd-actions" flow-children="horizontal">
        {button("primary", "A", "Jugar", () => playGame(game))}
        {button("secondary", "X", "Detalles", () => openDetails(game))}
      </Focusable>
    </section>
  );
}

/**
 * Desplazamiento propio: el contenido se mueve con transform y una sola transición.
 * El contenedor usa `overflow: clip`, así el navegador no puede hacer su salto instantáneo
 * al recibir el foco (que encadenado con una animación producía un tirón).
 */
function useScroller(viewport: RefObject<HTMLDivElement>, content: RefObject<HTMLDivElement>) {
  const [offset, setOffset] = useState(0);
  const scroller = useMemo(
    () => ({
      toTop: () => setOffset(0),
      /** Centra el elemento en la ventana sin pasarse de los bordes del contenido. */
      reveal: (el: HTMLElement) => {
        const view = viewport.current?.clientHeight ?? 0;
        const max = Math.max(0, (content.current?.offsetHeight ?? 0) - view);
        let top = 0;
        for (let n: HTMLElement | null = el; n && n !== content.current; n = n.offsetParent as HTMLElement | null) {
          top += n.offsetTop;
        }
        setOffset(Math.min(max, Math.max(0, top + el.offsetHeight / 2 - view / 2)));
      },
    }),
    [viewport, content],
  );
  return { offset, ...scroller };
}

export function HomeScreen() {
  const recent = useMemo(() => recentGames(SHELF_SIZE), []);
  const installed = useMemo(() => installedGames(), []);
  const total = useMemo(() => libraryCount(), []);
  const [hero, setHero] = useState<Game | undefined>(() => recent[0] ?? installed[0]);
  const { ref, zoom, height } = useDesignScale();
  const homeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scroll = useScroller(homeRef, contentRef);
  // Tokens y fuentes propios: la pantalla funciona aunque la piel global esté apagada.
  const css = useMemo(
    () =>
      `${fontsCss}\n${tokensCss(skinState().theme, ".vd-home-viewport")}\n${homeCss}\n` +
      // El Inicio de Steam encendía la barra superior (reloj, batería); sin él queda transparente.
      `${cls("Header", "OverrideHeaderBackground")} { opacity: 1 !important; }`,
    [],
  );

  const onBumper = (e: GamepadEvent) => {
    if (e.detail.button === GamepadButton.BUMPER_RIGHT) TABS[1].go?.();
  };

  return (
    <div className="vd-home-viewport" ref={ref}>
      <style>{css}</style>
      <Focusable className="vd-home" ref={homeRef} style={{ zoom, height }} onButtonDown={onBumper}>
        <div className="vd-scroll" ref={contentRef} style={{ transform: `translateY(${-scroll.offset}px)` }}>
          <div className="vd-page" style={{ height }}>
            <Focusable className="vd-tabs" flow-children="horizontal">
              <span className="vd-trigger">L1</span>
              {TABS.map((t, i) => (
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
              <Hero game={hero} onFocus={scroll.toTop} />
            ) : (
              <section className="vd-hero">
                <div className="vd-field" aria-hidden />
                <span className="vd-kicker">Biblioteca vacía</span>
                <h1 className="vd-gtitle">VOID</h1>
              </section>
            )}

            {recent.length > 0 && (
              <section>
                <div className="vd-shelf-h">
                  <h2>Jugados recientemente</h2>
                  {total > 0 && <span className="vd-kicker">{`${recent.length} de ${total}`}</span>}
                </div>
                <Focusable className="vd-shelf" flow-children="horizontal">
                  {recent.map((g, i) => (
                    <Tile
                      key={g.appid}
                      game={g}
                      first={i === 0}
                      onFocus={() => {
                        setHero(g);
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
                <h2>Instalados</h2>
                <span className="vd-kicker">{`${installed.length} juegos`}</span>
              </div>
              <Focusable className="vd-grid" flow-children="grid">
                {installed.map((g) => (
                  <Tile
                    key={g.appid}
                    game={g}
                    onFocus={(el) => {
                      setHero(g);
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
