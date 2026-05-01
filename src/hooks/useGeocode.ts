import { useQuery } from '@tanstack/react-query'
import { searchLocations, type GeoResult } from '@/api/geocoding'

export function useGeocode(query: string) {
  return useQuery<GeoResult[], Error>({
    queryKey: ['geocode', query],
    queryFn: () => searchLocations(query),
    enabled: query.trim().length >= 2,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}
