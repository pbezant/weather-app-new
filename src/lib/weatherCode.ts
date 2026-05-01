export type WeatherTheme =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'

export interface WeatherInfo {
  label: string
  theme: (isDay: boolean) => WeatherTheme
  iconName: string
  isPrecip: boolean
}

const WMO_CODES: Record<number, WeatherInfo> = {
  0:  { label: 'Clear sky',            theme: d => d ? 'clear-day' : 'clear-night',                   iconName: 'clear-day',                   isPrecip: false },
  1:  { label: 'Mainly clear',         theme: d => d ? 'clear-day' : 'clear-night',                   iconName: 'clear-day',                   isPrecip: false },
  2:  { label: 'Partly cloudy',        theme: d => d ? 'partly-cloudy-day' : 'partly-cloudy-night',   iconName: 'partly-cloudy-day',           isPrecip: false },
  3:  { label: 'Overcast',             theme: _  => 'cloudy',                                          iconName: 'cloudy',                      isPrecip: false },
  45: { label: 'Foggy',                theme: _  => 'fog',                                             iconName: 'mist',                        isPrecip: false },
  48: { label: 'Icy fog',              theme: _  => 'fog',                                             iconName: 'mist',                        isPrecip: false },
  51: { label: 'Light drizzle',        theme: _  => 'drizzle',                                         iconName: 'drizzle',                     isPrecip: true  },
  53: { label: 'Drizzle',              theme: _  => 'drizzle',                                         iconName: 'drizzle',                     isPrecip: true  },
  55: { label: 'Heavy drizzle',        theme: _  => 'drizzle',                                         iconName: 'drizzle',                     isPrecip: true  },
  56: { label: 'Freezing drizzle',     theme: _  => 'drizzle',                                         iconName: 'drizzle',                     isPrecip: true  },
  57: { label: 'Heavy freezing drizzle', theme: _ => 'drizzle',                                        iconName: 'drizzle',                     isPrecip: true  },
  61: { label: 'Slight rain',          theme: _  => 'rain',                                            iconName: 'rain',                        isPrecip: true  },
  63: { label: 'Rain',                 theme: _  => 'rain',                                            iconName: 'rain',                        isPrecip: true  },
  65: { label: 'Heavy rain',           theme: _  => 'rain',                                            iconName: 'rain',                        isPrecip: true  },
  66: { label: 'Freezing rain',        theme: _  => 'rain',                                            iconName: 'rain',                        isPrecip: true  },
  67: { label: 'Heavy freezing rain',  theme: _  => 'rain',                                            iconName: 'rain',                        isPrecip: true  },
  71: { label: 'Slight snow',          theme: _  => 'snow',                                            iconName: 'snow',                        isPrecip: true  },
  73: { label: 'Snow',                 theme: _  => 'snow',                                            iconName: 'snow',                        isPrecip: true  },
  75: { label: 'Heavy snow',           theme: _  => 'snow',                                            iconName: 'snow',                        isPrecip: true  },
  77: { label: 'Snow grains',          theme: _  => 'snow',                                            iconName: 'snow',                        isPrecip: true  },
  80: { label: 'Slight showers',       theme: d => d ? 'partly-cloudy-day' : 'partly-cloudy-night',   iconName: 'partly-cloudy-day-rain',      isPrecip: true  },
  81: { label: 'Rain showers',         theme: _  => 'rain',                                            iconName: 'rain',                        isPrecip: true  },
  82: { label: 'Heavy rain showers',   theme: _  => 'rain',                                            iconName: 'rain',                        isPrecip: true  },
  85: { label: 'Slight snow showers',  theme: _  => 'snow',                                            iconName: 'partly-cloudy-day-snow',      isPrecip: true  },
  86: { label: 'Heavy snow showers',   theme: _  => 'snow',                                            iconName: 'snow',                        isPrecip: true  },
  95: { label: 'Thunderstorm',         theme: _  => 'thunderstorm',                                    iconName: 'thunderstorms',               isPrecip: true  },
  96: { label: 'Thunderstorm w/ hail', theme: _  => 'thunderstorm',                                    iconName: 'thunderstorms',               isPrecip: true  },
  99: { label: 'Thunderstorm w/ heavy hail', theme: _ => 'thunderstorm',                               iconName: 'thunderstorms',               isPrecip: true  },
}

const FALLBACK: WeatherInfo = {
  label: 'Unknown',
  theme: d => d ? 'clear-day' : 'clear-night',
  iconName: 'cloudy',
  isPrecip: false,
}

export function getWeatherInfo(code: number): WeatherInfo {
  return WMO_CODES[code] ?? FALLBACK
}

export function getWeatherTheme(code: number, isDay: boolean): WeatherTheme {
  return getWeatherInfo(code).theme(isDay)
}

export function getWeatherLabel(code: number): string {
  return getWeatherInfo(code).label
}

export function getIconName(code: number, isDay: boolean): string {
  const info = getWeatherInfo(code)
  if (!isDay) {
    if (info.iconName === 'clear-day') return 'clear-night'
    if (info.iconName === 'partly-cloudy-day') return 'partly-cloudy-night'
    if (info.iconName === 'partly-cloudy-day-rain') return 'partly-cloudy-night-rain'
    if (info.iconName === 'partly-cloudy-day-snow') return 'partly-cloudy-night-snow'
  }
  return info.iconName
}
