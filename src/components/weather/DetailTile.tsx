import { cn } from '@/lib/utils'

interface DetailTileProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  className?: string
}

export function DetailTile({ icon, label, value, sub, className }: DetailTileProps) {
  return (
    <div className={cn('glass-card rounded-xl p-3 flex flex-col gap-1 min-w-[90px]', className)}>
      <div className="flex items-center gap-1.5 text-xs opacity-70" style={{ color: 'var(--weather-ink-muted)' }}>
        <span className="w-4 h-4 flex-shrink-0">{icon}</span>
        <span className="uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-base font-semibold leading-none" style={{ color: 'var(--weather-ink)' }}>{value}</p>
      {sub && <p className="text-xs opacity-60" style={{ color: 'var(--weather-ink-muted)' }}>{sub}</p>}
    </div>
  )
}
