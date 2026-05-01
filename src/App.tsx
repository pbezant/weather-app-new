import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WeatherBackground } from '@/components/weather/WeatherBackground'
import { WeatherThemeProvider, DefaultThemeProvider } from '@/components/weather/WeatherThemeProvider'
import {
  HeroCard,
  WeatherIconCard,
  FeelsLikeCard,
  HumidityCard,
  WindCard,
  UVCard,
  VisibilityCard,
  PressureCard,
  SunCard,
  BentoSkeleton,
} from '@/components/weather/CurrentConditions'
import { HourlyForecast, HourlyForecastSkeleton } from '@/components/weather/HourlyForecast'
import { DailyForecast, DailyForecastSkeleton } from '@/components/weather/DailyForecast'
import { RadarPanel } from '@/components/weather/RadarPanel'
import { LocationSearch } from '@/components/weather/LocationSearch'
import { SavedLocations } from '@/components/weather/SavedLocations'
import { UnitsToggle } from '@/components/weather/UnitsToggle'
import { Onboarding } from '@/components/weather/Onboarding'
import { useForecast } from '@/hooks/useForecast'
import { useAppStore, useSelectedLocation } from '@/store/appStore'
import { getWeatherTheme } from '@/lib/weatherCode'

function WeatherContent() {
  const location = useSelectedLocation()
  const units = useAppStore(s => s.units)
  const { data: forecast, isLoading, isError, refetch } = useForecast(
    location?.lat ?? null,
    location?.lon ?? null,
    units,
  )

  if (!location) return <Onboarding />

  if (isError) {
    return (
      <div className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4 text-center max-w-sm mx-auto">
        <AlertTriangle className="w-10 h-10 opacity-60" style={{ color: 'var(--weather-ink)' }} />
        <p className="text-sm" style={{ color: 'var(--weather-ink)' }}>
          Could not load weather data.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    )
  }

  const theme = forecast
    ? getWeatherTheme(forecast.current.weather_code, forecast.current.is_day === 1)
    : 'clear-day'

  return (
    <>
      {forecast && (
        <WeatherThemeProvider
          weatherCode={forecast.current.weather_code}
          isDay={forecast.current.is_day === 1}
        >
          {null}
        </WeatherThemeProvider>
      )}
      <WeatherBackground theme={theme} />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.id + units}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full space-y-3"
        >
          {isLoading || !forecast ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
                <BentoSkeleton />
              </div>
              <HourlyForecastSkeleton />
              <DailyForecastSkeleton />
            </>
          ) : (
            <>
              {/* Bento grid — 4 cols desktop, 2 cols mobile */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Hero: 2×2 on desktop */}
                <HeroCard
                  forecast={forecast}
                  units={units}
                  className="col-span-2 lg:row-span-2 min-h-[200px] lg:min-h-0"
                />
                {/* Top-right quadrant (rows 1-2, cols 3-4 on desktop) */}
                <WeatherIconCard forecast={forecast} className="min-h-[140px]" />
                <FeelsLikeCard forecast={forecast} units={units} className="min-h-[140px]" />
                <HumidityCard forecast={forecast} className="min-h-[140px]" />
                <WindCard forecast={forecast} units={units} className="min-h-[140px]" />
                {/* Bottom row — 4 equal cells */}
                <UVCard forecast={forecast} className="min-h-[140px]" />
                <VisibilityCard forecast={forecast} units={units} className="min-h-[140px]" />
                <PressureCard forecast={forecast} className="min-h-[140px]" />
                <SunCard forecast={forecast} className="min-h-[140px]" />
              </div>

              <HourlyForecast forecast={forecast} units={units} />

              {/* Daily + Radar side-by-side on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <DailyForecast forecast={forecast} units={units} />
                <RadarPanel location={location} />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  const savedLocations = useAppStore(s => s.savedLocations)

  useEffect(() => {
    if (savedLocations.length === 0) {
      document.documentElement.setAttribute('data-weather', 'clear-day')
    }
  }, [savedLocations.length])

  return (
    <DefaultThemeProvider>
      <div className="min-h-screen relative">
        {savedLocations.length === 0 && <WeatherBackground theme="clear-day" />}

        {/* Header */}
        <header className="sticky top-0 z-20 px-4 py-3 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.15)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <SavedLocations />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <UnitsToggle />
              <LocationSearch />
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="px-4 pb-8 max-w-6xl mx-auto">
          <WeatherContent />
        </main>
      </div>
    </DefaultThemeProvider>
  )
}
