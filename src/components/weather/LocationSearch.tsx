import { useState, useCallback } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useGeocode } from '@/hooks/useGeocode'
import { useAppStore } from '@/store/appStore'
import { formatLocationName, type GeoResult } from '@/api/geocoding'
import { requestGeolocation, geoErrorMessage, type GeoError } from '@/hooks/useGeolocation'
import { searchLocations } from '@/api/geocoding'

export function LocationSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [geoError, setGeoError] = useState<string | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const addLocation = useAppStore(s => s.addLocation)

  const { data: results, isFetching } = useGeocode(query)

  const handleSelect = useCallback(async (result: GeoResult) => {
    addLocation({
      name: formatLocationName(result),
      lat: result.latitude,
      lon: result.longitude,
      timezone: result.timezone,
    })
    setOpen(false)
    setQuery('')
  }, [addLocation])

  const handleGeolocate = useCallback(async () => {
    setGeoLoading(true)
    setGeoError(null)
    try {
      const { lat, lon } = await requestGeolocation()
      const results = await searchLocations(`${lat.toFixed(2)},${lon.toFixed(2)}`)
      if (results.length > 0) {
        addLocation({
          name: formatLocationName(results[0]),
          lat,
          lon,
          timezone: results[0].timezone,
        })
      } else {
        addLocation({ name: 'My Location', lat, lon, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
      }
      setOpen(false)
    } catch (err) {
      setGeoError(geoErrorMessage(err as GeoError))
    } finally {
      setGeoLoading(false)
    }
  }, [addLocation])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="glass-card border-0 gap-2 font-medium"
          style={{ color: 'var(--weather-ink)' }}
          aria-label="Search for a location"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-80" align="end">
        <Command>
          <CommandInput
            placeholder="Search city..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.length < 2 && (
              <div className="p-2">
                <button
                  onClick={handleGeolocate}
                  disabled={geoLoading}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {geoLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <MapPin className="w-4 h-4" />}
                  Use my current location
                </button>
                {geoError && <p className="text-xs text-destructive mt-1 px-3">{geoError}</p>}
              </div>
            )}
            {isFetching && (
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Searching…
              </div>
            )}
            {!isFetching && query.length >= 2 && results?.length === 0 && (
              <CommandEmpty>No locations found.</CommandEmpty>
            )}
            {results?.map(r => (
              <CommandItem
                key={r.id}
                value={formatLocationName(r)}
                onSelect={() => handleSelect(r)}
                className="cursor-pointer"
              >
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 opacity-60" />
                {formatLocationName(r)}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
