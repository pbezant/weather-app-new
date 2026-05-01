import { openMeteoUnits, type Units } from '@/lib/units'

const BASE = 'https://api.open-meteo.com/v1/forecast'

export interface CurrentWeather {
  time: string
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  precipitation: number
  weather_code: number
  wind_speed_10m: number
  wind_direction_10m: number
  surface_pressure: number
  visibility: number
  uv_index: number
  is_day: number
  cloud_cover: number
}

export interface HourlyWeather {
  time: string[]
  temperature_2m: number[]
  apparent_temperature: number[]
  precipitation_probability: number[]
  weather_code: number[]
  wind_speed_10m: number[]
  is_day: number[]
  uv_index: number[]
}

export interface DailyWeather {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
  precipitation_probability_max: number[]
  wind_speed_10m_max: number[]
  sunrise: string[]
  sunset: string[]
  uv_index_max: number[]
}

export interface ForecastResponse {
  latitude: number
  longitude: number
  timezone: string
  timezone_abbreviation: string
  current: CurrentWeather
  hourly: HourlyWeather
  daily: DailyWeather
}

const CURRENT_VARS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'surface_pressure',
  'visibility',
  'uv_index',
  'is_day',
  'cloud_cover',
].join(',')

const HOURLY_VARS = [
  'temperature_2m',
  'apparent_temperature',
  'precipitation_probability',
  'weather_code',
  'wind_speed_10m',
  'is_day',
  'uv_index',
].join(',')

const DAILY_VARS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'sunrise',
  'sunset',
  'uv_index_max',
].join(',')

export async function fetchForecast(
  lat: number,
  lon: number,
  units: Units,
): Promise<ForecastResponse> {
  const unitParams = openMeteoUnits(units)
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: CURRENT_VARS,
    hourly: HOURLY_VARS,
    daily: DAILY_VARS,
    forecast_days: '7',
    ...unitParams,
  })

  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  return res.json() as Promise<ForecastResponse>
}
