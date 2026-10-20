// Weather for the screensaver, from Open-Meteo (free, no account or key). Only the city the user typed and
// its coordinates are sent.
import type { Language } from "../i18n";

export type City = { name: string; country: string; latitude: number; longitude: number };
export type Weather = { temperature: number; high: number; low: number; code: number; isDay: boolean };
export type Sky = "clear" | "partly" | "cloudy" | "fog" | "rain" | "snow" | "storm";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function getJson(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/** First match for the typed name, or null when there is none. */
export async function findCity(query: string, language: Language): Promise<City | null> {
  const params = new URLSearchParams({ name: query.trim(), count: "1", language, format: "json" });
  const result = (await getJson(`${GEOCODING_URL}?${params}`)).results?.[0];
  if (!result) return null;
  return { name: result.name, country: result.country_code ?? "", latitude: result.latitude, longitude: result.longitude };
}

export async function fetchWeather(city: City): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: `${city.latitude}`,
    longitude: `${city.longitude}`,
    current: "temperature_2m,weather_code,is_day",
    daily: "temperature_2m_max,temperature_2m_min",
    forecast_days: "1",
    timezone: "auto",
  });
  const data = await getJson(`${FORECAST_URL}?${params}`);
  return {
    temperature: data.current.temperature_2m,
    high: data.daily.temperature_2m_max[0],
    low: data.daily.temperature_2m_min[0],
    code: data.current.weather_code,
    isDay: data.current.is_day === 1,
  };
}

/** WMO weather code (what Open-Meteo returns) grouped into the skies Void Deck draws. */
export function sky(code: number): Sky {
  if (code === 0) return "clear";
  if (code <= 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "rain";
}
