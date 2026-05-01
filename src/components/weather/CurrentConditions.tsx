import { motion } from 'framer-motion'
import { Wind, Droplets, Eye, Gauge, Sun, Thermometer, ArrowUp, ArrowDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { WeatherIcon, SunriseIcon, SunsetIcon } from '@/icons/WeatherIcon'
import { getWeatherLabel } from '@/lib/weatherCode'
import { formatTemp, windUnit, type Units } from '@/lib/units'
import type { ForecastResponse } from '@/api/openMeteo'
import { cn } from '@/lib/utils'

interface CardProps {
  forecast: ForecastResponse
  units: Units
  className?: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function compassDir(deg: number) {
  return ['N','NE','E','SE','S','SW','W','NW'][Math.round(deg / 45) % 8]
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest opacity-55" style={{ color: 'var(--weather-ink-muted)' }}>
      {children}
    </p>
  )
}

function BigValue({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('font-bold leading-none tabular-nums', className)} style={{ color: 'var(--weather-ink)' }}>
      {children}
    </p>
  )
}

/* ─── Hero: Temperature + Condition ─────────────────────────────────────── */
export function HeroCard({ forecast, units, className }: CardProps) {
  const { current, daily } = forecast

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('glass-card rounded-3xl p-7 flex flex-col justify-between', className)}
    >
      <Label>Current</Label>

      <div className="flex-1 flex flex-col justify-center gap-2 py-4">
        <BigValue className="text-7xl lg:text-8xl">
          {formatTemp(current.temperature_2m, units)}
        </BigValue>
        <p className="text-2xl font-semibold mt-1" style={{ color: 'var(--weather-ink)' }}>
          {getWeatherLabel(current.weather_code)}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <ArrowUp className="w-3.5 h-3.5 opacity-60" style={{ color: 'var(--weather-ink-muted)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--weather-ink)' }}>
            {formatTemp(daily.temperature_2m_max[0], units)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowDown className="w-3.5 h-3.5 opacity-60" style={{ color: 'var(--weather-ink-muted)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--weather-ink)' }}>
            {formatTemp(daily.temperature_2m_min[0], units)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Icon ───────────────────────────────────────────────────────────────── */
export function WeatherIconCard({ forecast, className }: Omit<CardProps, 'units'>) {
  const { current } = forecast
  const isDay = current.is_day === 1

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, type: 'spring', stiffness: 180 }}
      className={cn('glass-card rounded-3xl flex items-center justify-center', className)}
    >
      <motion.div
        key={current.weather_code}
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      >
        <WeatherIcon code={current.weather_code} isDay={isDay} size={96} />
      </motion.div>
    </motion.div>
  )
}

/* ─── Feels Like ─────────────────────────────────────────────────────────── */
export function FeelsLikeCard({ forecast, units, className }: CardProps) {
  const { current } = forecast
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className={cn('glass-card rounded-3xl p-5 flex flex-col justify-between', className)}
    >
      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 opacity-55" style={{ color: 'var(--weather-ink-muted)' }} />
        <Label>Feels like</Label>
      </div>
      <BigValue className="text-4xl">{formatTemp(current.apparent_temperature, units)}</BigValue>
    </motion.div>
  )
}

/* ─── Humidity ───────────────────────────────────────────────────────────── */
export function HumidityCard({ forecast, className }: Omit<CardProps, 'units'>) {
  const { current } = forecast
  const pct = current.relative_humidity_2m
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className={cn('glass-card rounded-3xl p-5 flex flex-col justify-between gap-3', className)}
    >
      <div className="flex items-center gap-2">
        <Droplets className="w-4 h-4 opacity-55" style={{ color: 'var(--weather-ink-muted)' }} />
        <Label>Humidity</Label>
      </div>
      <BigValue className="text-4xl">{pct}%</BigValue>
      {/* Bar */}
      <div className="h-1.5 rounded-full bg-white/25 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: 'var(--weather-accent)' }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Wind ───────────────────────────────────────────────────────────────── */
export function WindCard({ forecast, units, className }: CardProps) {
  const { current } = forecast
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn('glass-card rounded-3xl p-5 flex flex-col justify-between', className)}
    >
      <div className="flex items-center gap-2">
        <Wind className="w-4 h-4 opacity-55" style={{ color: 'var(--weather-ink-muted)' }} />
        <Label>Wind</Label>
      </div>
      <div>
        <BigValue className="text-4xl">{Math.round(current.wind_speed_10m)}</BigValue>
        <p className="text-sm mt-0.5 opacity-60" style={{ color: 'var(--weather-ink-muted)' }}>
          {windUnit(units)} · {compassDir(current.wind_direction_10m)}
        </p>
      </div>
    </motion.div>
  )
}

/* ─── UV Index ───────────────────────────────────────────────────────────── */
const UV_LEVELS = [
  { max: 2,  label: 'Low',       color: '#4ade80' },
  { max: 5,  label: 'Moderate',  color: '#facc15' },
  { max: 7,  label: 'High',      color: '#fb923c' },
  { max: 10, label: 'Very High', color: '#f87171' },
  { max: 99, label: 'Extreme',   color: '#e879f9' },
]

function uvLevel(uv: number) {
  return UV_LEVELS.find(l => uv <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1]
}

export function UVCard({ forecast, className }: Omit<CardProps, 'units'>) {
  const uv = forecast.current.uv_index
  const level = uvLevel(uv)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 }}
      className={cn('glass-card rounded-3xl p-5 flex flex-col justify-between', className)}
    >
      <div className="flex items-center gap-2">
        <Sun className="w-4 h-4 opacity-55" style={{ color: 'var(--weather-ink-muted)' }} />
        <Label>UV Index</Label>
      </div>
      <div>
        <BigValue className="text-4xl">{uv.toFixed(0)}</BigValue>
        <p className="text-sm mt-0.5 font-semibold" style={{ color: level.color }}>{level.label}</p>
      </div>
    </motion.div>
  )
}

/* ─── Visibility ─────────────────────────────────────────────────────────── */
export function VisibilityCard({ forecast, units, className }: CardProps) {
  const { current } = forecast
  const vis = units === 'imperial'
    ? `${(current.visibility / 1609).toFixed(0)} mi`
    : `${(current.visibility / 1000).toFixed(0)} km`

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.14 }}
      className={cn('glass-card rounded-3xl p-5 flex flex-col justify-between', className)}
    >
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 opacity-55" style={{ color: 'var(--weather-ink-muted)' }} />
        <Label>Visibility</Label>
      </div>
      <BigValue className="text-4xl">{vis}</BigValue>
    </motion.div>
  )
}

/* ─── Pressure ───────────────────────────────────────────────────────────── */
export function PressureCard({ forecast, className }: Omit<CardProps, 'units'>) {
  const { current } = forecast
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.16 }}
      className={cn('glass-card rounded-3xl p-5 flex flex-col justify-between', className)}
    >
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 opacity-55" style={{ color: 'var(--weather-ink-muted)' }} />
        <Label>Pressure</Label>
      </div>
      <div>
        <BigValue className="text-4xl">{Math.round(current.surface_pressure)}</BigValue>
        <p className="text-sm mt-0.5 opacity-60" style={{ color: 'var(--weather-ink-muted)' }}>hPa</p>
      </div>
    </motion.div>
  )
}

/* ─── Sunrise / Sunset ───────────────────────────────────────────────────── */
export function SunCard({ forecast, className }: Omit<CardProps, 'units'>) {
  const { daily } = forecast
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18 }}
      className={cn('glass-card rounded-3xl p-5 flex flex-col justify-between gap-3', className)}
    >
      <Label>Sun</Label>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <SunriseIcon width={28} height={28} />
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-55" style={{ color: 'var(--weather-ink-muted)' }}>Rise</p>
            <p className="text-base font-bold" style={{ color: 'var(--weather-ink)' }}>{formatTime(daily.sunrise[0])}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <SunsetIcon width={28} height={28} />
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-55" style={{ color: 'var(--weather-ink-muted)' }}>Set</p>
            <p className="text-base font-bold" style={{ color: 'var(--weather-ink)' }}>{formatTime(daily.sunset[0])}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Skeleton (covers the full bento area) ──────────────────────────────── */
export function BentoSkeleton() {
  return (
    <>
      <Skeleton className="rounded-3xl h-56 col-span-2 row-span-2" />
      <Skeleton className="rounded-3xl h-32" />
      <Skeleton className="rounded-3xl h-32" />
      <Skeleton className="rounded-3xl h-32" />
      <Skeleton className="rounded-3xl h-32" />
      <Skeleton className="rounded-3xl h-32" />
      <Skeleton className="rounded-3xl h-32" />
      <Skeleton className="rounded-3xl h-32" />
      <Skeleton className="rounded-3xl h-32" />
    </>
  )
}
