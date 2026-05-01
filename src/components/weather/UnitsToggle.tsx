import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

export function UnitsToggle() {
  const units = useAppStore(s => s.units)
  const setUnits = useAppStore(s => s.setUnits)

  return (
    <div className="flex items-center rounded-full border p-0.5 text-sm font-medium" style={{ borderColor: 'var(--weather-card-border)', background: 'var(--weather-card-bg)' }}>
      <button
        onClick={() => setUnits('imperial')}
        className={cn(
          'px-3 py-1 rounded-full transition-all duration-200',
          units === 'imperial'
            ? 'bg-white/80 shadow-sm text-slate-900'
            : 'text-[var(--weather-ink)] opacity-60 hover:opacity-90'
        )}
      >
        °F
      </button>
      <button
        onClick={() => setUnits('metric')}
        className={cn(
          'px-3 py-1 rounded-full transition-all duration-200',
          units === 'metric'
            ? 'bg-white/80 shadow-sm text-slate-900'
            : 'text-[var(--weather-ink)] opacity-60 hover:opacity-90'
        )}
      >
        °C
      </button>
    </div>
  )
}
