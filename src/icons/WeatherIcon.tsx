import { getIconName } from '@/lib/weatherCode'
import './overrides.css'

/* Vite's @svgr/rollup transforms .svg imports into React components */
import ClearDay         from './meteocons/clear-day.svg?react'
import ClearNight       from './meteocons/clear-night.svg?react'
import Cloudy           from './meteocons/cloudy.svg?react'
import Drizzle          from './meteocons/drizzle.svg?react'
import Mist             from './meteocons/mist.svg?react'
import PartlyCloudyDay  from './meteocons/partly-cloudy-day.svg?react'
import PartlyCloudyNight from './meteocons/partly-cloudy-night.svg?react'
import PartlyCloudyDayRain  from './meteocons/partly-cloudy-day-rain.svg?react'
import PartlyCloudyNightRain from './meteocons/partly-cloudy-night-rain.svg?react'
import PartlyCloudyDaySnow  from './meteocons/partly-cloudy-day-snow.svg?react'
import PartlyCloudyNightSnow from './meteocons/partly-cloudy-night-snow.svg?react'
import Rain             from './meteocons/rain.svg?react'
import Snow             from './meteocons/snow.svg?react'
import Thunderstorms    from './meteocons/thunderstorms.svg?react'
import Sunrise          from './meteocons/sunrise.svg?react'
import Sunset           from './meteocons/sunset.svg?react'
import Wind             from './meteocons/wind.svg?react'
import Droplet          from './meteocons/droplet.svg?react'
import Thermometer      from './meteocons/thermometer.svg?react'
import Compass          from './meteocons/compass.svg?react'

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'clear-day':               ClearDay,
  'clear-night':             ClearNight,
  'cloudy':                  Cloudy,
  'drizzle':                 Drizzle,
  'mist':                    Mist,
  'partly-cloudy-day':       PartlyCloudyDay,
  'partly-cloudy-night':     PartlyCloudyNight,
  'partly-cloudy-day-rain':  PartlyCloudyDayRain,
  'partly-cloudy-night-rain': PartlyCloudyNightRain,
  'partly-cloudy-day-snow':  PartlyCloudyDaySnow,
  'partly-cloudy-night-snow': PartlyCloudyNightSnow,
  'rain':                    Rain,
  'snow':                    Snow,
  'thunderstorms':           Thunderstorms,
  'sunrise':                 Sunrise,
  'sunset':                  Sunset,
  'wind':                    Wind,
  'droplet':                 Droplet,
  'thermometer':             Thermometer,
  'compass':                 Compass,
}

interface WeatherIconProps {
  code: number
  isDay: boolean
  size?: number
  className?: string
}

export function WeatherIcon({ code, isDay, size = 64, className = '' }: WeatherIconProps) {
  const name = getIconName(code, isDay)
  const Icon = ICON_MAP[name] ?? ICON_MAP['cloudy']
  return <Icon width={size} height={size} className={`weather-icon ${className}`} aria-hidden />
}

/* Named icon exports for UI elements (sunrise/sunset, wind, etc.) */
export { Sunrise as SunriseIcon, Sunset as SunsetIcon, Wind as WindIcon, Droplet as DropletIcon, Thermometer as ThermometerIcon, Compass as CompassIcon }
