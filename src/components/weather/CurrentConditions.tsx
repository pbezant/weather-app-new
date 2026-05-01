import { motion } from 'framer-motion'
import { Wind, Droplets, Eye, Gauge, Sun } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { WeatherIcon, SunriseIcon, SunsetIcon } from '@/icons/WeatherIcon'
import { DetailTile } from './DetailTile'
import { getWeatherLabel } from '@/lib/weatherCode'
import { formatTemp, windUnit, type Units } from '@/lib/units'
import type { ForecastResponse } from '@/api/openMeteo'

interface CurrentConditionsProps {
  forecast: ForecastResponse
  units: Units
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function compassDir(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

export function CurrentConditions({ forecast, units }: CurrentConditionsProps) {
  const { current, daily } = forecast
  const isDay = current.is_day === 1
  const wUnit = windUnit(units)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-card rounded-2xl p-6 w-full"
    >
      {/* Hero row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-6xl font-bold tracking-tight leading-none" style={{ color: 'var(--weather-ink)' }}>
            {formatTemp(current.temperature_2m, units)}
          </p>
          <p className="text-xl mt-2 font-medium" style={{ color: 'var(--weather-ink)' }}>
            {getWeatherLabel(current.weather_code)}
          </p>
          <p className="text-sm mt-1 opacity-70" style={{ color: 'var(--weather-ink-muted)' }}>
            Feels like {formatTemp(current.apparent_temperature, units)}
          </p>
        </div>

        <motion.div
          key={current.weather_code}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        >
          <WeatherIcon code={current.weather_code} isDay={isDay} size={120} />
        </motion.div>
      </div>

      {/* Hi/Lo */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-sm font-medium" style={{ color: 'var(--weather-ink)' }}>
          H: {formatTemp(daily.temperature_2m_max[0], units)}
        </span>
        <span className="text-sm opacity-60" style={{ color: 'var(--weather-ink-muted)' }}>·</span>
        <span className="text-sm font-medium" style={{ color: 'var(--weather-ink)' }}>
          L: {formatTemp(daily.temperature_2m_min[0], units)}
        </span>
      </div>

      {/* Detail tiles */}
      <div className="flex flex-wrap gap-2 mt-4">
        <DetailTile
          icon={<Droplets className="w-4 h-4" />}
          label="Humidity"
          value={`${current.relative_humidity_2m}%`}
        />
        <DetailTile
          icon={<Wind className="w-4 h-4" />}
          label="Wind"
          value={`${Math.round(current.wind_speed_10m)} ${wUnit}`}
          sub={compassDir(current.wind_direction_10m)}
        />
        <DetailTile
          icon={<Sun className="w-4 h-4" />}
          label="UV Index"
          value={current.uv_index.toFixed(0)}
          sub={current.uv_index <= 2 ? 'Low' : current.uv_index <= 5 ? 'Moderate' : current.uv_index <= 7 ? 'High' : 'Very High'}
        />
        <DetailTile
          icon={<Eye className="w-4 h-4" />}
          label="Visibility"
          value={units === 'imperial'
            ? `${(current.visibility / 1609).toFixed(0)} mi`
            : `${(current.visibility / 1000).toFixed(0)} km`}
        />
        <DetailTile
          icon={<Gauge className="w-4 h-4" />}
          label="Pressure"
          value={`${Math.round(current.surface_pressure)} hPa`}
        />
      </div>

      {/* Sunrise / Sunset */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: 'var(--weather-card-border)' }}>
        <div className="flex items-center gap-2">
          <SunriseIcon width={20} height={20} />
          <span className="text-sm font-medium" style={{ color: 'var(--weather-ink)' }}>
            {formatTime(daily.sunrise[0])}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SunsetIcon width={20} height={20} />
          <span className="text-sm font-medium" style={{ color: 'var(--weather-ink)' }}>
            {formatTime(daily.sunset[0])}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function CurrentConditionsSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-14 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-28 w-28 rounded-full" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-16 w-20 rounded-xl" />)}
      </div>
    </div>
  )
}
