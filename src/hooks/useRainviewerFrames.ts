import { useQuery } from '@tanstack/react-query'
import { fetchRadarManifest, allFrames, type RadarFrame, type RainViewerManifest } from '@/api/rainviewer'

export interface RadarFrameData {
  frames: RadarFrame[]
  host: string
  pastCount: number
}

export function useRainviewerFrames() {
  return useQuery<RadarFrameData, Error>({
    queryKey: ['radar-frames'],
    queryFn: async () => {
      const manifest: RainViewerManifest = await fetchRadarManifest()
      return {
        frames: allFrames(manifest),
        host: manifest.host,
        pastCount: manifest.radar.past.length,
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
  })
}
