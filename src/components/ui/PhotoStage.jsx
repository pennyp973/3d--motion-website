import { useEffect, useRef } from 'react'
import { CHAPTERS } from '../../journey/chapters'
import { journey, damp } from '../../journey/journeyState'
import { useRafLoop } from '../../hooks/useRafLoop'

// ————————————————————————————————————————————————————————————————
// PhotoStage — the photographic backdrop for the chapter journey.
//
// Every frame shown here is real CRD footage (stills from the hero
// film). As the visitor scrolls the chapters, backdrops crossfade
// with a slow cinematic drift and a whisper of pointer parallax —
// no generated geometry anywhere.
//
// To swap any backdrop for a supplied photograph, replace the file
// in /public/img/chapters/ (1920×1080, JPG).
// ————————————————————————————————————————————————————————————————

const BACKDROPS = [
  { id: 'hero', src: '/img/chapters/ch-exterior.jpg' },
  { id: 'approach', src: '/img/chapters/ch-approach.jpg' },
  { id: 'enter', src: '/img/chapters/ch-entry.jpg' },
  { id: 'management', src: '/img/chapters/ch-kitchen.jpg' },
  { id: 'realestate', src: '/img/chapters/ch-living.jpg' },
  { id: 'investment', src: '/img/chapters/ch-plaque.jpg' },
  { id: 'services', src: '/img/chapters/ch-terrace.jpg' },
  { id: 'contact', src: '/img/chapters/ch-skyline.jpg' },
]

// Chapter boundaries in journey-progress space; backdrop i holds the
// frame from its boundary until the next chapter's boundary.
const BOUNDS = CHAPTERS.map((c) => c.range[0])

function edge(t, b, f = 0.028) {
  return Math.min(Math.max((t - (b - f)) / (2 * f), 0), 1)
}

export default function PhotoStage() {
  const refs = useRef([])
  const reduced = useRef(false)
  const clock = useRef(performance.now())

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onMove = (e) => {
      journey.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      journey.mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useRafLoop(() => {
    const now = performance.now()
    const dt = Math.min((now - clock.current) / 1000, 0.6)
    clock.current = now

    // journey smoothing lives here now — the single always-running loop
    journey.smooth = damp(journey.smooth, journey.progress, 3.2, dt)
    journey.smoothMouse.x = damp(journey.smoothMouse.x, journey.mouse.x, 2.5, dt)
    journey.smoothMouse.y = damp(journey.smoothMouse.y, journey.mouse.y, 2.5, dt)

    const t = journey.smooth
    // the film hero owns the screen until it completes
    const heroGate = Math.min(Math.max((journey.heroProgress - 0.9) / 0.06, 0), 1)

    BACKDROPS.forEach((b, i) => {
      const el = refs.current[i]
      if (!el) return
      const on = i === 0 ? 1 : edge(t, BOUNDS[i])
      const off = i === BACKDROPS.length - 1 ? 0 : edge(t, BOUNDS[i + 1])
      const o = (on - off) * heroGate
      el.style.opacity = o.toFixed(3)
      el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      if (o > 0.01 && !reduced.current) {
        // slow cinematic drift + pointer parallax
        const local = Math.min(Math.max((t - BOUNDS[i]) / 0.15, 0), 1)
        const scale = 1.06 + local * 0.05
        const px = -journey.smoothMouse.x * 9
        const py = -journey.smoothMouse.y * 6
        el.style.transform = `scale(${scale.toFixed(4)}) translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`
      }
    })
  })

  return (
    <div className="stage" aria-hidden="true" style={{ background: '#07090d', overflow: 'hidden' }}>
      {BACKDROPS.map((b, i) => (
        <img
          key={b.id}
          ref={(el) => (refs.current[i] = el)}
          src={b.src}
          alt=""
          draggable={false}
          loading={i < 2 ? 'eager' : 'lazy'}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0,
            visibility: 'hidden',
            willChange: 'opacity, transform',
            transform: 'scale(1.06)',
          }}
        />
      ))}
      {/* edge scrims for typographic legibility over photography */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top, rgba(4,6,10,0.6) 0%, transparent 38%), linear-gradient(to right, rgba(4,6,10,0.45) 0%, transparent 46%), linear-gradient(to left, rgba(4,6,10,0.45) 0%, transparent 46%)',
        }}
      />
    </div>
  )
}
