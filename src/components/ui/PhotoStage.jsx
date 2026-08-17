import { useEffect, useRef } from 'react'
import { journey, damp } from '../../journey/journeyState'
import { useRafLoop } from '../../hooks/useRafLoop'

// ————————————————————————————————————————————————————————————————
// PhotoStage — cinematic photographic backdrop for the CRD journey.
// Existing CRD imagery is reused across the expanded editorial sequence,
// with longer holds and softer crossfades to keep the pace premium.
// ————————————————————————————————————————————————————————————————

const BACKDROPS = [
  { id: 'hero', src: '/img/chapters/ch-exterior.jpg', from: 0 },
  { id: 'approach', src: '/img/chapters/ch-approach.jpg', from: 0.055 },
  { id: 'ownership', src: '/img/chapters/ch-exterior.jpg', from: 0.135 },
  { id: 'enter', src: '/img/chapters/ch-entry.jpg', from: 0.225 },
  { id: 'management', src: '/img/chapters/ch-kitchen.jpg', from: 0.295 },
  { id: 'leasing', src: '/img/chapters/ch-bedroom.jpg', from: 0.38 },
  { id: 'realestate', src: '/img/chapters/ch-living.jpg', from: 0.485 },
  { id: 'acquisitions', src: '/img/chapters/ch-garage.jpg', from: 0.56 },
  { id: 'investment', src: '/img/chapters/ch-plaque.jpg', from: 0.655 },
  { id: 'process', src: '/img/chapters/ch-bathroom.jpg', from: 0.73 },
  { id: 'services-re', src: '/img/chapters/ch-bedroom.jpg', from: 0.815 },
  { id: 'services-pm', src: '/img/chapters/ch-bathroom.jpg', from: 0.84 },
  { id: 'services-inv', src: '/img/chapters/ch-garage.jpg', from: 0.865 },
  { id: 'whycrd', src: '/img/chapters/ch-approach.jpg', from: 0.88 },
  { id: 'contact', src: '/img/chapters/ch-skyline.jpg', from: 0.94 },
]

const BOUNDS = BACKDROPS.map((b) => b.from)

function edge(t, b, f = 0.04) {
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

    // A gentler damp value creates more graceful, less abrupt motion.
    journey.smooth = damp(journey.smooth, journey.progress, 2.25, dt)
    journey.smoothMouse.x = damp(journey.smoothMouse.x, journey.mouse.x, 2.1, dt)
    journey.smoothMouse.y = damp(journey.smoothMouse.y, journey.mouse.y, 2.1, dt)

    const t = journey.smooth
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
        const local = Math.min(Math.max((t - BOUNDS[i]) / 0.19, 0), 1)
        const scale = 1.045 + local * 0.04
        const px = -journey.smoothMouse.x * 7
        const py = -journey.smoothMouse.y * 5
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
            transform: 'scale(1.045)',
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top, rgba(4,6,10,0.66) 0%, transparent 40%), linear-gradient(to right, rgba(4,6,10,0.5) 0%, transparent 48%), linear-gradient(to left, rgba(4,6,10,0.5) 0%, transparent 48%)',
        }}
      />
    </div>
  )
}
