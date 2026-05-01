export type GeoError = 'denied' | 'unavailable' | 'timeout' | 'unknown'

export interface GeoPosition {
  lat: number
  lon: number
}

export function requestGeolocation(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('unavailable' as GeoError)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => {
        if (err.code === err.PERMISSION_DENIED) reject('denied' as GeoError)
        else if (err.code === err.POSITION_UNAVAILABLE) reject('unavailable' as GeoError)
        else if (err.code === err.TIMEOUT) reject('timeout' as GeoError)
        else reject('unknown' as GeoError)
      },
      { timeout: 10000, maximumAge: 60000 },
    )
  })
}

export function geoErrorMessage(err: GeoError): string {
  switch (err) {
    case 'denied': return 'Location access was denied. Search for a city to get started.'
    case 'unavailable': return 'Location unavailable on this device. Search for a city to get started.'
    case 'timeout': return 'Location request timed out. Search for a city to get started.'
    default: return 'Could not get your location. Search for a city to get started.'
  }
}
