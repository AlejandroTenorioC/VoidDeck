import { useSyncExternalStore } from "react";

export type Language = "en" | "es";

const STORAGE_KEY = "voiddeck-language";
const listeners = new Set<() => void>();

function loadLanguage(): Language {
  try {
    return globalThis.localStorage?.getItem(STORAGE_KEY) === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

let language: Language = loadLanguage();

export function languageState(): Language {
  return language;
}

export function setLanguage(next: Language): void {
  if (next === language) return;
  language = next;
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, next);
  } catch {
    // The preference still applies for this session if storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}

export function resetLanguage(): void {
  setLanguage("en");
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook for the shared Void Deck language preference. English is the default. */
export function useLanguage(): Language {
  return useSyncExternalStore(subscribe, languageState, languageState);
}

const copy = {
  en: {
    home: "Home", library: "Library", store: "Store", friends: "Friends", downloads: "Downloads",
    play: "Play", details: "Details", continue: "Continue", played: "played", ready: "Ready to play",
    emptyLibrary: "Library empty", recentlyPlayed: "Recently played", installed: "Installed",
    games: "games", of: "of", notPlayed: "Not played", minPlayed: "min played",
    now: "now", yesterday: "yesterday", unsupported: "Unsupported on Deck", playable: "Playable on Deck",
    verified: "Verified for Deck", globalSkin: "Global skin",
    globalSkinDescription: "Apply Void Deck colors and typefaces across the whole interface.",
    homeScreen: "Home screen", homeScreenDescription: "Replace Steam Home with Void Deck Home.",
    lightTheme: "Light theme", lightThemeDescription: "For outdoor use.",
    language: "Language", languageDescription: "Choose the language used by Void Deck.",
    noInstalledGames: "No installed games", noInstalledGamesDescription: "Install a game from your Library to see it here.",
    openLibrary: "Open Library", resetDefaults: "Reset to defaults", resetDefaultsDescription: "Restore English, dark theme, and enabled screens.",
    version: "Version", versionDescription: "View the latest release notes and download.", releaseNotes: "Open release notes",
  },
  es: {
    home: "Inicio", library: "Biblioteca", store: "Tienda", friends: "Amigos", downloads: "Descargas",
    play: "Jugar", details: "Detalles", continue: "Continuar", played: "jugado", ready: "Listo para jugar",
    emptyLibrary: "Biblioteca vacía", recentlyPlayed: "Jugados recientemente", installed: "Instalados",
    games: "juegos", of: "de", notPlayed: "Sin jugar", minPlayed: "min jugados",
    now: "ahora", yesterday: "ayer", unsupported: "No compatible con Deck", playable: "Jugable en Deck",
    verified: "Verificado para Deck", globalSkin: "Piel global",
    globalSkinDescription: "Aplica los colores y tipografías de Void Deck a toda la interfaz.",
    homeScreen: "Pantalla de Inicio", homeScreenDescription: "Sustituye el Inicio de Steam por el de Void Deck.",
    lightTheme: "Tema claro", lightThemeDescription: "Para uso en exterior.",
    language: "Idioma", languageDescription: "Elige el idioma que usa Void Deck.",
    noInstalledGames: "No hay juegos instalados", noInstalledGamesDescription: "Instala un juego desde tu Biblioteca para verlo aquí.",
    openLibrary: "Abrir Biblioteca", resetDefaults: "Restablecer valores predeterminados", resetDefaultsDescription: "Restaura inglés, tema oscuro y pantallas activadas.",
    version: "Versión", versionDescription: "Consulta las notas y descarga de la última versión.", releaseNotes: "Abrir notas de versión",
  },
} as const;

export function strings(forLanguage: Language) {
  return copy[forLanguage];
}
