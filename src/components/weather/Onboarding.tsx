import { MapPin, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export function Onboarding() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-10 flex flex-col items-center gap-4 text-center max-w-sm mx-auto"
    >
      <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
        <MapPin className="w-8 h-8" style={{ color: 'var(--weather-accent)' }} />
      </div>
      <div>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--weather-ink)' }}>
          Where are you?
        </h2>
        <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--weather-ink-muted)' }}>
          Search for a city or allow location access to see live weather.
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm opacity-60" style={{ color: 'var(--weather-ink-muted)' }}>
        <Search className="w-4 h-4" />
        <span>Use the search button above to get started</span>
      </div>
    </motion.div>
  )
}
