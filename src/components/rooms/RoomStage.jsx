import { useEffect, useRef } from 'react'
import { ROOMS, ROOM_WINDOWS } from '../../journey/rooms'
import { journey, damp } from '../../journey/journeyState'
import { useRafLoop } from '../../hooks/useRafLoop'

// ————————————————————————————————————————————————————————————————
// RoomStage — the camera.
//
// Renders every room of the residence and moves one continuous camera
// through them. Three things happen at once, all on transform/opacity:
//
//   1. DOLLY — inside its own scroll window each room interpolates
//      from cam.from to cam.to, so the camera is always drifting,
//      pushing in or pulling back. No room is ever a static JPEG.
//
//   2. THRESHOLD — at a boundary the outgoing room accelerates toward
//      the lens, blurs and fades (the doorway rushing past), while the
//      incoming room arrives from depth at 0.93 scale and settles.
//      Read together this is forward travel, not a crossfade.
//
//   2b. VOCABULARY — no two thresholds are the same, and each means
//      something: 'rise' lifts a dark plane downward as the camera
//      climbs to the bedroom floor, 'wall' sweeps a plane sideways as
//      you pass a doorway into the dining room or garage, 'light'
//      floods warm as you step outside, 'focus' pulls the lens onto a
//      detail. Read in sequence they describe a route through a house.
//
//   3. DEPTH — the photograph, a warm bloom keyed to the room's real
//      light source, and a foreground aperture vignette each take a
//      different share of the pointer parallax. The near frame moves
//      more than the far image, so the frame reads as an opening you
//      are looking through.
// ————————————————————————————————————————————————————————————————

const TRANSITION = 0.02 // half-width of a doorway, in progress units

function smoothstep(a, b, x) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

const lerp = (a, b, t) => a + (b - a) * t

export default function RoomStage({ isMobile }) {
  const layerRefs = useRef([])
  const imgRefs = useRef([])
  const bloomRefs = useRef([])
  const apertureRef = useRef()
  const washRef = useRef()
  const sweepRef = useRef()
  const reduced = useRef(false)
  const clock = useRef(performance.now())
  const lastIndex = useRef(-1)

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

    // The journey's inertia lives here — the one always-running loop.
    // A gentler lambda than the film hero: rooms settle slowly, which
    // is what makes the travel feel weighted and expensive.
    journey.smooth = damp(journey.smooth, journey.progress, 2.1, dt)
    journey.smoothMouse.x = damp(journey.smoothMouse.x, journey.mouse.x, 2.2, dt)
    journey.smoothMouse.y = damp(journey.smoothMouse.y, journey.mouse.y, 2.2, dt)

    const t = journey.smooth
    // the film hero owns the screen until it has delivered us inside
    const gate = smoothstep(0.9, 0.985, journey.heroProgress)

    const par = reduced.current ? 0 : 1
    const mx = journey.smoothMouse.x * par
    const my = journey.smoothMouse.y * par

    let active = 0
    // nearest threshold: how close, which way, and what kind it is
    let near = { prox: 0, signed: 0, kind: 'threshold' }
    for (let b = 1; b < ROOM_WINDOWS.length; b++) {
      const at = ROOM_WINDOWS[b].start
      const signed = (t - at) / TRANSITION
      if (Math.abs(signed) <= 1) {
        const prox = 1 - Math.abs(signed)
        if (prox > near.prox) near = { prox, signed, kind: ROOMS[b].enter || 'threshold' }
      }
    }
    const focusBlur = near.kind === 'focus' ? near.prox * 9 : 0

    ROOM_WINDOWS.forEach((w, i) => {
      const layer = layerRefs.current[i]
      const img = imgRefs.current[i]
      if (!layer || !img) return

      const isFirst = i === 0
      const isLast = i === ROOM_WINDOWS.length - 1

      const enter = isFirst ? 1 : smoothstep(w.start - TRANSITION, w.start + TRANSITION, t)
      const exit = isLast ? 0 : smoothstep(w.end - TRANSITION, w.end + TRANSITION, t)
      const opacity = enter * (1 - exit) * gate

      if (opacity < 0.004) {
        if (layer.style.visibility !== 'hidden') {
          layer.style.visibility = 'hidden'
          layer.style.opacity = '0'
        }
        return
      }
      layer.style.visibility = 'visible'
      layer.style.opacity = opacity.toFixed(3)

      if (opacity > 0.5) active = i

      // — dolly through the room —
      const room = ROOMS[i]
      const span = Math.max(w.end - w.start, 0.0001)
      const ct = Math.min(Math.max((t - w.start) / span, 0), 1)
      const s = lerp(room.cam.from.s, room.cam.to.s, ct)
      const x = lerp(room.cam.from.x, room.cam.to.x, ct)
      const y = lerp(room.cam.from.y, room.cam.to.y, ct)

      // — threshold: arrive from depth, then rush past the lens —
      const depth = (0.93 + 0.07 * enter) * (1 + 0.3 * exit)

      img.style.transform =
        `translate3d(${(x + mx * 1.1).toFixed(3)}%, ${(y + my * 0.8).toFixed(3)}%, 0) ` +
        `scale(${(s * depth).toFixed(4)})`

      if (!isMobile) {
        const blur = exit * 7 + (1 - enter) * 3 + focusBlur
        img.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none'
      }

      // warm bloom keyed to the room's real light source, drifting
      // slightly against the camera
      const bloom = bloomRefs.current[i]
      if (bloom) {
        bloom.style.transform = `translate3d(${(-mx * 2.6).toFixed(2)}%, ${(-my * 2).toFixed(2)}%, 0)`
        bloom.style.opacity = ((room.light?.strength ?? 0.4) * (0.55 + 0.45 * Math.sin(ct * Math.PI))).toFixed(3)
      }

    })

    // — foreground aperture: nearer than the image, so it parallaxes
    //   further. This is what sells the frame as an opening. —
    if (apertureRef.current) {
      apertureRef.current.style.transform =
        `translate3d(${(-mx * 3.4).toFixed(2)}%, ${(-my * 2.6).toFixed(2)}%, 0) scale(1.08)`
      apertureRef.current.style.opacity = gate.toFixed(3)
    }

    // — light spilling from the space you are passing into —
    if (washRef.current) {
      const strength =
        near.kind === 'light' ? 0.85 : near.kind === 'threshold' ? 0.5 : 0.18
      washRef.current.style.opacity = (near.prox * strength * gate).toFixed(3)
    }

    // — a solid plane crossing the lens: a wall passed, a floor climbed —
    if (sweepRef.current) {
      const sweeping = near.kind === 'wall' || near.kind === 'rise'
      if (sweeping && near.prox > 0.001) {
        const travel = near.signed * 118
        sweepRef.current.style.transform =
          near.kind === 'wall'
            ? `translate3d(${travel.toFixed(1)}%, 0, 0)`
            : `translate3d(0, ${(-travel).toFixed(1)}%, 0)`
        sweepRef.current.style.opacity = (Math.min(near.prox * 1.6, 1) * gate).toFixed(3)
      } else {
        sweepRef.current.style.opacity = '0'
      }
    }

    if (active !== lastIndex.current) {
      lastIndex.current = active
      journey.roomIndex = active
    }
  })

  return (
    <div className="stage room-stage" aria-hidden="true">
      {ROOMS.map((room, i) => (
        <div
          key={room.id}
          ref={(el) => (layerRefs.current[i] = el)}
          className="room-layer"
        >
          <img
            ref={(el) => (imgRefs.current[i] = el)}
            className="room-image"
            src={room.src}
            alt=""
            draggable={false}
            // the current room and its two neighbours are always warm;
            // everything further out defers
            loading={i < 3 ? 'eager' : 'lazy'}
            decoding="async"
          />
          {room.light && (
            <div
              ref={(el) => (bloomRefs.current[i] = el)}
              className="room-bloom"
              style={{
                background: `radial-gradient(ellipse 55% 48% at ${room.light.x} ${room.light.y},
                  rgba(255, 228, 178, 0.5), rgba(255, 214, 150, 0.14) 42%, transparent 72%)`,
              }}
            />
          )}
        </div>
      ))}

      {/* foreground aperture — the near plane */}
      <div ref={apertureRef} className="room-aperture" />
      {/* light spilling through each threshold */}
      <div ref={washRef} className="room-wash" />
      {/* a wall or floor crossing the lens */}
      <div ref={sweepRef} className="room-sweep" />
      {/* legibility scrims, unaffected by parallax */}
      <div className="room-scrim" />
    </div>
  )
}
