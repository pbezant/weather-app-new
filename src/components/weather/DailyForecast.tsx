import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { WeatherIcon } from '@/icons/WeatherIcon'
import { getWeatherLabel } from '@/lib/weatherCode'
import { formatTemp, type Units } from '@/lib/units'
import type { ForecastResponse } from '@/api/openMeteo'

interface DailyForecastProps {
  forecast: ForecastResponse
  units: Units
}

function formatDay(isoDate: string, index: number): string {
  if (index === 0) return 'Today'
  if (index === 1) return 'Tomorrow'
  return new Date(isoDate + 'T12:00:00').toLocaleDateString([], { weekday: 'long' })
}

export function DailyForecast({ forecast, units }: DailyForecastProps) {
  const { daily } = forecast
  const temps = daily.temperature_2m_max.concat(daily.temperature_2m_min)
  const absMin = Math.min(...temps)
  const absMax = Math.max(...temps)
  const range = absMax - absMin || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="glass-card rounded-2xl p-4 w-full"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-70" style={{ color: 'var(--weather-ink-muted)' }}>
        7-Day Forecast
      </h2>
      <div className="flex flex-col divide-y" style={{ borderColor: 'var(--weather-card-border)' }}>
        {daily.time.map((date, i) => {
          const hi = daily.temperature_2m_max[i]
          const lo = daily.temperature_2m_min[i]
          const barLeft = ((lo - absMin) / range) * 100
          const barWidth = ((hi - lo) / range) * 100

          return (
            <div key={date} className="flex items-center gap-3 py-2.5">
              <span className="w-20 text-sm font-medium flex-shrink-0" style={{ color: 'var(--weather-ink)' }}>
                {formatDay(date, i)}
              </span>
              <WeatherIcon code={daily.weather_code[i]} isDay size={28} />
              <span className="flex-1 text-xs opacity-60 truncate hidden sm:block" style={{ color: 'var(--weather-ink-muted)' }}>
                {getWeatherLabel(daily.weather_code[i])}
              </span>
              <span className="text-sm w-12 text-right opacity-60" style={{ color: 'var(--weather-ink-muted)' }}>
                {formatTemp(lo, units)}
              </span>
              {/* Gradient bar */}
              <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-white/20 relative">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${barLeft}%`,
                    width: `${Math.max(barWidth, 8)}%`,
                    background: 'linear-gradient(to right, var(--weather-accent), var(--weather-bg-to))',
                  }}
                />
              </div>
              <span className="text-sm w-12 font-semibold" style={{ color: 'var(--weather-ink)' }}>
                {formatTemp(hi, units)}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export function DailyForecastSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 w-full space-y-2">
      <Skeleton className="h-4 w-28 mb-3" />
      {Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
    </div>
  )
}
