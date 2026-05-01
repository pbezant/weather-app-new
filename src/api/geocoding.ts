const BASE = 'https://geocoding-api.open-meteo.com/v1/search'

export interface GeoResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  country_code: string
  admin1?: string
  timezone: string
}

interface GeoResponse {
  results?: GeoResult[]
}

export async function searchLocations(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return []
  const params = new URLSearchParams({ name: query, count: '6', language: 'en', format: 'json' })
  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`)
  const data = (await res.json()) as GeoResponse
  return data.results ?? []
}

export function formatLocationName(result: GeoResult): string {
  const parts = [result.name]
  if (result.admin1) parts.push(result.admin1)
  parts.push(result.country)
  return parts.join(', ')
}
