import { useQuery } from '@tanstack/react-query'
import { fetchForecast, type ForecastResponse } from '@/api/openMeteo'
import type { Units } from '@/lib/units'

export function useForecast(lat: number | null, lon: number | null, units: Units) {
  return useQuery<ForecastResponse, Error>({
    queryKey: ['forecast', lat, lon, units],
    queryFn: () => fetchForecast(lat!, lon!, units),
    enabled: lat != null && lon != null,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
