import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Play, Pause, Loader2 } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { useRainviewerFrames } from '@/hooks/useRainviewerFrames'
import type { SavedLocation } from '@/store/appStore'
import 'leaflet/dist/leaflet.css'

interface RadarPanelProps {
  location: SavedLocation
}

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], map.getZoom())
  }, [lat, lon, map])
  return null
}

export function RadarPanel({ location }: RadarPanelProps) {
  const { data, isLoading, isError } = useRainviewerFrames()
  const [frameIndex, setFrameIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (data) setFrameIndex(data.pastCount - 1)
  }, [data])

  useEffect(() => {
    if (playing && data) {
      intervalRef.current = setInterval(() => {
        setFrameIndex(i => (i + 1) % data.frames.length)
      }, 500)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing, data])

  const currentFrame = data?.frames[frameIndex]
  const tileUrl = currentFrame && data
    ? `${data.host}${currentFrame.path}/256/{z}/{x}/{y}/2/1_1.png`
    : null

  const frameTime = currentFrame
    ? new Date(currentFrame.time * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : ''

  const isPast = data ? frameIndex < data.pastCount : true

  return (
    <div className="glass-card rounded-2xl overflow-hidden w-full">
      <div className="p-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-70" style={{ color: 'var(--weather-ink-muted)' }}>
            Radar
          </h2>
          {currentFrame && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--weather-ink-muted)' }}>
              {isPast ? '⏱ ' : '🔮 '}{frameTime}
              {!isPast && ' (forecast)'}
            </p>
          )}
        </div>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin opacity-60" />}
      </div>

      {isError && (
        <div className="h-64 flex items-center justify-center text-sm opacity-60" style={{ color: 'var(--weather-ink-muted)' }}>
          Radar data unavailable
        </div>
      )}

      {!isError && (
        <>
          <div className="h-64 relative">
            <MapContainer
              center={[location.lat, location.lon]}
              zoom={7}
              zoomControl={false}
              scrollWheelZoom={false}
              className="h-full w-full"
              style={{ background: 'transparent' }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {tileUrl && (
                <TileLayer
                  key={tileUrl}
                  url={tileUrl}
                  opacity={0.65}
                  attribution='Radar: <a href="https://rainviewer.com">RainViewer</a>'
                />
              )}
              <RecenterMap lat={location.lat} lon={location.lon} />
            </MapContainer>
          </div>

          {data && data.frames.length > 0 && (
            <div className="p-3 flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPlaying(p => !p)}
                className="w-8 h-8 p-0 rounded-full"
                style={{ color: 'var(--weather-ink)' }}
                aria-label={playing ? 'Pause radar' : 'Play radar'}
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Slider
                min={0}
                max={data.frames.length - 1}
                step={1}
                value={[frameIndex]}
                onValueChange={([v]) => { setPlaying(false); setFrameIndex(v) }}
                className="flex-1"
              />
              <span className="text-xs font-medium w-10 text-right tabular-nums" style={{ color: 'var(--weather-ink-muted)' }}>
                {frameIndex < data.pastCount
                  ? `-${data.pastCount - frameIndex * 10}min`
                  : `+${(frameIndex - data.pastCount + 1) * 10}min`}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
