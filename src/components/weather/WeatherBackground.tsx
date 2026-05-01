import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WeatherTheme } from '@/lib/weatherCode'

interface WeatherBackgroundProps {
  theme: WeatherTheme
}

function SunScene() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <radialGradient id="sun-glow" cx="75%" cy="20%" r="30%">
          <stop offset="0%" stopColor="var(--weather-accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--weather-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#sun-glow)" />
      <style>{`
        @keyframes sun-ray-pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .sun-rays { animation: sun-ray-pulse 4s ease-in-out infinite; transform-origin: 75% 20%; }
        @media (prefers-reduced-motion: reduce) { .sun-rays { animation: none; } }
      `}</style>
      <g className="sun-rays">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const cx = 0.75, cy = 0.2
          const len = 0.12
          return (
            <line
              key={i}
              x1={`${(cx + Math.cos(angle) * 0.05) * 100}%`}
              y1={`${(cy + Math.sin(angle) * 0.05) * 100}%`}
              x2={`${(cx + Math.cos(angle) * (0.05 + len)) * 100}%`}
              y2={`${(cy + Math.sin(angle) * (0.05 + len)) * 100}%`}
              stroke="var(--weather-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
          )
        })}
      </g>
    </svg>
  )
}

function CloudLayer({ opacity = 0.25, speed = 60, yPct = 20, scale = 1 }: {
  opacity?: number; speed?: number; yPct?: number; scale?: number
}) {
  const id = useRef(Math.random().toString(36).slice(2))
  return (
    <svg className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden>
      <style>{`
        @keyframes cloud-drift-${id.current} {
          from { transform: translateX(-20%); }
          to   { transform: translateX(120%); }
        }
        .cloud-${id.current} {
          animation: cloud-drift-${id.current} ${speed}s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) { .cloud-${id.current} { animation: none; } }
      `}</style>
      <g
        className={`cloud-${id.current}`}
        opacity={opacity}
        transform={`translate(0, ${yPct}%) scale(${scale})`}
      >
        <ellipse cx="80" cy="60" rx="70" ry="35" fill="white" />
        <ellipse cx="130" cy="50" rx="50" ry="28" fill="white" />
        <ellipse cx="50" cy="55" rx="40" ry="22" fill="white" />
      </g>
    </svg>
  )
}

function RainScene() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <style>{`
        @keyframes rain-fall {
          0%   { transform: translateY(-10px); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .raindrop { animation: none !important; } }
      `}</style>
      {Array.from({ length: 40 }, (_, i) => (
        <line
          key={i}
          className="raindrop"
          x1={`${(i * 2.5 + Math.random() * 2.5).toFixed(1)}%`}
          y1={`${(-Math.random() * 20).toFixed(1)}%`}
          x2={`${(i * 2.5 + Math.random() * 2.5 + 1).toFixed(1)}%`}
          y2={`${(-Math.random() * 20 + 5).toFixed(1)}%`}
          stroke="var(--weather-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0"
          style={{
            animationName: 'rain-fall',
            animationDuration: `${0.6 + Math.random() * 0.4}s`,
            animationDelay: `${Math.random() * 2}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </svg>
  )
}

function SnowScene() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <style>{`
        @keyframes snow-fall {
          0%   { transform: translateY(-5px) translateX(0); opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(20px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .snowflake { animation: none !important; } }
      `}</style>
      {Array.from({ length: 30 }, (_, i) => (
        <circle
          key={i}
          className="snowflake"
          cx={`${Math.random() * 100}%`}
          cy="-5%"
          r={1 + Math.random() * 2}
          fill="white"
          opacity="0"
          style={{
            animationName: 'snow-fall',
            animationDuration: `${3 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 5}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </svg>
  )
}

function ThunderstormFlash() {
  return (
    <div
      className="absolute inset-0 bg-white pointer-events-none"
      style={{ animation: 'lightning-flash 8s ease-in-out infinite' }}
      aria-hidden
    >
      <style>{`
        @keyframes lightning-flash {
          0%, 7%, 9%, 11%, 100% { opacity: 0; }
          8%, 10% { opacity: 0.07; }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="lightning-flash"] { animation: none; }
        }
      `}</style>
    </div>
  )
}

function StarField() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <style>{`
        @keyframes star-twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }
        @media (prefers-reduced-motion: reduce) { .star { animation: none !important; } }
      `}</style>
      {Array.from({ length: 60 }, (_, i) => (
        <circle
          key={i}
          className="star"
          cx={`${Math.random() * 100}%`}
          cy={`${Math.random() * 60}%`}
          r={0.5 + Math.random() * 1}
          fill="white"
          style={{
            animationName: 'star-twinkle',
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 4}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </svg>
  )
}

function FogScene() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <style>{`
        @keyframes fog-drift { from { transform: translateX(-5%); } to { transform: translateX(5%); } }
        .fog-band { animation: fog-drift ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) { .fog-band { animation: none; } }
      `}</style>
      {[20, 35, 50, 65, 78].map((y, i) => (
        <rect
          key={i}
          className="fog-band"
          x="-10%"
          y={`${y}%`}
          width="120%"
          height="6%"
          fill="white"
          opacity={0.12 + i * 0.03}
          style={{ animationDuration: `${5 + i * 2}s`, animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </svg>
  )
}

const SCENE_MAP: Partial<Record<WeatherTheme, React.ReactNode>> = {
  'clear-day': <><SunScene /><CloudLayer opacity={0.15} speed={90} yPct={15} /></>,
  'partly-cloudy-day': <><SunScene /><CloudLayer opacity={0.3} speed={60} yPct={20} /><CloudLayer opacity={0.2} speed={80} yPct={35} scale={0.7} /></>,
  'partly-cloudy-night': <><StarField /><CloudLayer opacity={0.25} speed={70} yPct={25} /></>,
  'clear-night': <StarField />,
  'cloudy': <><CloudLayer opacity={0.4} speed={50} yPct={10} /><CloudLayer opacity={0.3} speed={70} yPct={30} scale={0.8} /><CloudLayer opacity={0.25} speed={90} yPct={50} scale={1.2} /></>,
  'fog': <FogScene />,
  'drizzle': <><CloudLayer opacity={0.35} speed={55} yPct={5} /><RainScene /></>,
  'rain': <><CloudLayer opacity={0.5} speed={40} yPct={5} /><RainScene /></>,
  'snow': <><CloudLayer opacity={0.3} speed={60} yPct={5} /><SnowScene /></>,
  'thunderstorm': <><CloudLayer opacity={0.6} speed={35} yPct={5} /><RainScene /><ThunderstormFlash /></>,
}

export function WeatherBackground({ theme }: WeatherBackgroundProps) {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--weather-bg-from), var(--weather-bg-mid) 50%, var(--weather-bg-to))',
      }}
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {SCENE_MAP[theme] ?? null}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

