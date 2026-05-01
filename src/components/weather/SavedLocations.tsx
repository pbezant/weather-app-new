import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

export function SavedLocations() {
  const savedLocations = useAppStore(s => s.savedLocations)
  const selectedId = useAppStore(s => s.selectedId)
  const selectLocation = useAppStore(s => s.selectLocation)
  const removeLocation = useAppStore(s => s.removeLocation)

  if (savedLocations.length === 0) return null

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
      <AnimatePresence initial={false}>
        {savedLocations.map(loc => (
          <motion.div
            key={loc.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <div
              className={cn(
                'group flex items-center gap-1 pl-3 pr-1 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer select-none',
                selectedId === loc.id
                  ? 'bg-white/40 ring-1 ring-white/60 shadow-sm'
                  : 'bg-white/20 hover:bg-white/30'
              )}
              style={{ color: 'var(--weather-ink)' }}
              onClick={() => selectLocation(loc.id)}
            >
              <span className="max-w-[120px] truncate">{loc.name.split(',')[0]}</span>
              <button
                onClick={e => { e.stopPropagation(); removeLocation(loc.id) }}
                className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity ml-0.5"
                aria-label={`Remove ${loc.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
