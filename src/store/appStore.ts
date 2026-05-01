import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultUnits, type Units } from '@/lib/units'

export interface SavedLocation {
  id: string
  name: string
  lat: number
  lon: number
  timezone: string
}

interface AppState {
  savedLocations: SavedLocation[]
  selectedId: string | null
  units: Units
  addLocation: (loc: Omit<SavedLocation, 'id'>) => void
  removeLocation: (id: string) => void
  selectLocation: (id: string) => void
  setUnits: (units: Units) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      savedLocations: [],
      selectedId: null,
      units: defaultUnits(),

      addLocation: (loc) => {
        const id = `${loc.lat.toFixed(4)},${loc.lon.toFixed(4)}`
        const exists = get().savedLocations.some(l => l.id === id)
        if (exists) {
          set({ selectedId: id })
          return
        }
        const newLoc: SavedLocation = { ...loc, id }
        set(state => ({
          savedLocations: [...state.savedLocations, newLoc],
          selectedId: id,
        }))
      },

      removeLocation: (id) => {
        set(state => {
          const next = state.savedLocations.filter(l => l.id !== id)
          const nextSelected =
            state.selectedId === id
              ? (next[0]?.id ?? null)
              : state.selectedId
          return { savedLocations: next, selectedId: nextSelected }
        })
      },

      selectLocation: (id) => set({ selectedId: id }),

      setUnits: (units) => set({ units }),
    }),
    { name: 'weather-app-state' },
  ),
)

export function useSelectedLocation(): SavedLocation | null {
  return useAppStore(state =>
    state.savedLocations.find(l => l.id === state.selectedId) ?? null
  )
}
