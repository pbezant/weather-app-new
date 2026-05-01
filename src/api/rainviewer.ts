const MANIFEST_URL = 'https://api.rainviewer.com/public/weather-maps.json'

export interface RadarFrame {
  time: number
  path: string
}

export interface RainViewerManifest {
  version: string
  generated: number
  host: string
  radar: {
    past: RadarFrame[]
    nowcast: RadarFrame[]
  }
  satellite: {
    infrared: RadarFrame[]
  }
}

export async function fetchRadarManifest(): Promise<RainViewerManifest> {
  const res = await fetch(MANIFEST_URL)
  if (!res.ok) throw new Error(`RainViewer error: ${res.status}`)
  return res.json() as Promise<RainViewerManifest>
}

export function buildTileUrl(host: string, path: string, zoom: number, x: number, y: number): string {
  return `${host}${path}/256/${zoom}/${x}/${y}/2/1_1.png`
}

export function allFrames(manifest: RainViewerManifest): RadarFrame[] {
  return [...manifest.radar.past, ...manifest.radar.nowcast]
}
