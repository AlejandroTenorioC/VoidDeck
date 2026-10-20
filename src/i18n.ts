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
    home: "Home", library: "Library", friends: "Friends",
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
    achievementUnlocked: "Achievement unlocked",
    screensaver: "Screensaver", screensaverDescription: "Replace Steam's slideshow with clock, battery, and weather widgets.",
    city: "Weather city", cityNone: "Not set", cityPrompt: "Type your city", cityNotFound: "City not found",
    cityError: "Could not reach the weather service", previewScreensaver: "Preview screensaver",
    battery: "Battery", charging: "Charging", charged: "Charged", onBattery: "On battery",
    weather: "Weather", weatherNoCity: "Pick a city in Void Deck", weatherUnavailable: "No connection",
    sky: { clear: "Clear", partly: "Partly cloudy", cloudy: "Cloudy", fog: "Fog", rain: "Rain", snow: "Snow", storm: "Storm" },
    cancel: "Cancel", save: "Save",
    notificationStyle: "Notification style", notificationStyleDescription: "Show achievements and friend alerts as Void Deck pills.",
    version: "Version", versionDescription: "View the latest release notes and download.", releaseNotes: "Open release notes",
  },
  es: {
    home: "Inicio", library: "Biblioteca", friends: "Amigos",
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
    achievementUnlocked: "Logro desbloqueado",
    screensaver: "Salvapantallas", screensaverDescription: "Sustituye las diapositivas de Steam por widgets de hora, batería y clima.",
    city: "Ciudad del clima", cityNone: "Sin elegir", cityPrompt: "Escribe tu ciudad", cityNotFound: "No se encontró la ciudad",
    cityError: "No se pudo contactar con el servicio del clima", previewScreensaver: "Probar salvapantallas",
    battery: "Batería", charging: "Cargando", charged: "Cargada", onBattery: "Con batería",
    weather: "Clima", weatherNoCity: "Elige una ciudad en Void Deck", weatherUnavailable: "Sin conexión",
    sky: { clear: "Despejado", partly: "Parcialmente nublado", cloudy: "Nublado", fog: "Niebla", rain: "Lluvia", snow: "Nieve", storm: "Tormenta" },
    cancel: "Cancelar", save: "Guardar",
    notificationStyle: "Estilo de notificaciones", notificationStyleDescription: "Muestra los logros y los avisos de amigos como píldoras de Void Deck.",
    version: "Versión", versionDescription: "Consulta las notas y descarga de la última versión.", releaseNotes: "Abrir notas de versión",
  },
} as const;

export function strings(forLanguage: Language) {
  return copy[forLanguage];
}
