export type Units = 'metric' | 'imperial'

export function defaultUnits(): Units {
  return navigator.language.startsWith('en-US') ? 'imperial' : 'metric'
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

export function fahrenheitToCelsius(f: number): number {
  return Math.round((f - 32) * 5 / 9)
}

export function formatTemp(value: number, units: Units): string {
  return `${Math.round(value)}°${units === 'imperial' ? 'F' : 'C'}`
}

export function formatTempValue(value: number): number {
  return Math.round(value)
}

export function formatWind(ms: number, units: Units): string {
  if (units === 'imperial') {
    return `${Math.round(ms * 2.237)} mph`
  }
  return `${Math.round(ms * 3.6)} km/h`
}

export function formatPrecip(mm: number, units: Units): string {
  if (units === 'imperial') {
    return `${(mm / 25.4).toFixed(2)} in`
  }
  return `${mm.toFixed(1)} mm`
}

export function openMeteoUnits(units: Units): {
  temperature_unit: string
  wind_speed_unit: string
  precipitation_unit: string
} {
  return {
    temperature_unit: units === 'imperial' ? 'fahrenheit' : 'celsius',
    wind_speed_unit: units === 'imperial' ? 'mph' : 'kmh',
    precipitation_unit: units === 'imperial' ? 'inch' : 'mm',
  }
}

export function tempUnit(units: Units): string {
  return units === 'imperial' ? '°F' : '°C'
}

export function windUnit(units: Units): string {
  return units === 'imperial' ? 'mph' : 'km/h'
}
