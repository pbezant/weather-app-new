import { motion } from 'framer-motion'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { WeatherIcon } from '@/icons/WeatherIcon'
import { formatTemp, type Units } from '@/lib/units'
import type { ForecastResponse } from '@/api/openMeteo'

interface HourlyForecastProps {
  forecast: ForecastResponse
  units: Units
}

function formatHour(isoString: string): string {
  const d = new Date(isoString)
  const hour = d.getHours()
  if (hour === 0) return '12am'
  if (hour === 12) return '12pm'
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`
}

function isNow(isoString: string): boolean {
  const d = new Date(isoString)
  const now = new Date()
  return d.getHours() === now.getHours() && d.getDate() === now.getDate()
}

export function HourlyForecast({ forecast, units }: HourlyForecastProps) {
  const { hourly } = forecast
  // Show next 24 hours from now
  const nowIndex = hourly.time.findIndex(t => new Date(t) >= new Date())
  const startIndex = Math.max(0, nowIndex === -1 ? 0 : nowIndex)
  const slice = hourly.time.slice(startIndex, startIndex + 24)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card rounded-2xl p-4 w-full"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-70" style={{ color: 'var(--weather-ink-muted)' }}>
        Hourly Forecast
      </h2>
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {slice.map((time, i) => {
            const idx = startIndex + i
            const now = isNow(time)
            return (
              <div
                key={time}
                className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl min-w-[56px] transition-all ${
                  now ? 'bg-white/30 ring-1 ring-white/50' : 'hover:bg-white/15'
                }`}
              >
                <span className="text-xs font-semibold" style={{ color: 'var(--weather-ink)' }}>
                  {now ? 'Now' : formatHour(time)}
                </span>
                <WeatherIcon
                  code={hourly.weather_code[idx]}
                  isDay={hourly.is_day[idx] === 1}
                  size={32}
                />
                <span className="text-sm font-bold" style={{ color: 'var(--weather-ink)' }}>
                  {formatTemp(hourly.temperature_2m[idx], units)}
                </span>
                {hourly.precipitation_probability[idx] > 20 && (
                  <span className="text-xs opacity-70 w-full text-center truncate" style={{ color: 'var(--weather-ink-muted)' }}>
                    {hourly.precipitation_probability[idx]}%
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  )
}

export function HourlyForecastSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 w-full">
      <Skeleton className="h-4 w-32 mb-3" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-24 w-14 rounded-xl flex-shrink-0" />
        ))}
      </div>
    </div>
  )
}
