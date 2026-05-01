import { useEffect } from 'react'
import { getWeatherTheme, type WeatherTheme } from '@/lib/weatherCode'

interface WeatherThemeProviderProps {
  weatherCode: number
  isDay: boolean
  children: React.ReactNode
}

export function WeatherThemeProvider({ weatherCode, isDay, children }: WeatherThemeProviderProps) {
  const theme: WeatherTheme = getWeatherTheme(weatherCode, isDay)

  useEffect(() => {
    document.documentElement.setAttribute('data-weather', theme)
    return () => {
      document.documentElement.removeAttribute('data-weather')
    }
  }, [theme])

  return <>{children}</>
}

export function DefaultThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-weather', 'clear-day')
  }, [])
  return <>{children}</>
}
