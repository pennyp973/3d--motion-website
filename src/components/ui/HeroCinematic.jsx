import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollToJourney } from '../../journey/scrollTo'
import { journey } from '../../journey/journeyState'

gsap.registerPlugin(ScrollTrigger)

// ————————————————————————————————————————————————————————————————
// HeroCinematic — the pinned, scroll-scrubbed film hero.
//
// The CRD architectural video is the realism layer; scroll drives
// video time directly (forward, hold, reverse). Interactive depth is
// layered around it in real time: pointer-responsive perspective,
// gold dimensional accents, staged typography, a progress rail, and
// a crossfade hand-off into the WebGL property tour that follows.
//
// Sequence map (matches the cut):
//   0.00  exterior opening      → brand block
//   0.30  approach              → caption
//   0.55  interior residences   → caption
//   0.90  rooftop CRD reveal    → transition cue into the 3D tour
// ————————————————————————————————————————————————————————————————

const SCROLL_VH = 420 // scroll distance that plays the film once

const SOURCES = {
  desktop: { mp4: '/video/crd-hero-1080.mp4', webm: '/video/crd-hero-1080.webm' },
  mobile: { mp4: '/video/crd-hero-720.mp4', webm: '/video/crd-hero-720.webm' },
  poster: '/video/crd-hero-poster.jpg',
}

const STAGES = [
  { id: 'brand', range: [0.0, 0.2] },
  { id: 'approach', range: [0.28, 0.5], eyebrow: 'The Property', line: 'A Northeast address, crafted to endure.' },
  { id: 'residence', range: [0.55, 0.8], eyebrow: 'The Residences', line: 'Interiors that live beautifully — and perform.' },
  { id: 'reveal', range: [0.875, 1.0] },
]

function stageOpacity(t, [a, b], feather = 0.05) {
  const fadeIn = a <= 0 ? 1 : Math.min(Math.max((t - a) / feather, 0), 1)
  const fadeOut = b >= 1 ? 1 : Math.min(Math.max((b - t) / feather, 0), 1)
  return Math.min(fadeIn, fadeOut)
}

export default function HeroCinematic() {
  const sectionRef = useRef()
  const stickyRef = useRef()
  const frameRef = useRef()
  const videoRef = useRef()
  const stageRefs = useRef({})
  const railFill = useRef()
  const railDots = useRef([])
  const goldLine = useRef()
  const [reduced, setReduced] = useState(false)
  const [ready, setReady] = useState(false)

  // choose source once per session
  const [src] = useState(() =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(pointer: coarse)').matches)
      ? SOURCES.mobile
      : SOURCES.desktop
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    let target = 0
    let shown = -1
    let raf
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
    let last = performance.now()

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        target = self.progress
      },
    })

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const fine = window.matchMedia('(pointer: fine)').matches
    if (fine) window.addEventListener('pointermove', onMove)

    const onLoaded = () => setReady(true)
    video.addEventListener('loadeddata', onLoaded)
    if (video.readyState >= 2) setReady(true)

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.6)
      last = now

      // weighted scrub — the film has inertia, never jitter
      shown = shown < 0 ? target : shown + (target - shown) * (1 - Math.exp(-7 * dt))
      const t = Math.min(Math.max(shown, 0), 1)
      journey.heroProgress = t

      // scroll → film time
      if (video.duration && Math.abs(video.currentTime - t * (video.duration - 0.06)) > 0.016) {
        video.currentTime = t * (video.duration - 0.06)
      }

      // pointer-responsive perspective (skipped for reduced motion)
      if (frameRef.current) {
        if (!reduced && fine) {
          pointer.sx += (pointer.x - pointer.sx) * (1 - Math.exp(-3 * dt))
          pointer.sy += (pointer.y - pointer.sy) * (1 - Math.exp(-3 * dt))
          frameRef.current.style.transform = `perspective(1200px) scale(1.07) rotateY(${(pointer.sx * 0.55).toFixed(3)}deg) rotateX(${(-pointer.sy * 0.4).toFixed(3)}deg) translate3d(${(-pointer.sx * 8).toFixed(1)}px, ${(-pointer.sy * 6).toFixed(1)}px, 0)`
        } else {
          frameRef.current.style.transform = 'scale(1.02)'
        }
      }

      // staged typography
      STAGES.forEach((s) => {
        const el = stageRefs.current[s.id]
        if (!el) return
        const o = stageOpacity(t, s.range)
        el.style.opacity = o.toFixed(3)
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
        el.style.transform = `translate3d(0, ${((1 - o) * 14).toFixed(1)}px, 0)`
      })

      // gold dimensional line + progress rail
      if (goldLine.current) goldLine.current.style.transform = `scaleY(${t.toFixed(4)})`
      if (railFill.current) railFill.current.style.transform = `scaleY(${t.toFixed(4)})`
      railDots.current.forEach((el, i) => {
        if (el) el.style.color = t >= STAGES[i].range[0] - 0.02 ? 'var(--gold)' : 'rgba(242,239,233,0.28)'
      })

      // 3D stage stays hidden (still warming up) until the hand-off
      const stage = document.querySelector('.stage')
      if (stage) stage.style.visibility = t > 0.9 ? 'visible' : 'hidden'

      // hand-off: the film dissolves into the live 3D tour
      if (stickyRef.current) {
        const fade = t < 0.955 ? 1 : 1 - (t - 0.955) / 0.045
        stickyRef.current.style.opacity = Math.max(fade, 0).toFixed(3)
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      st.kill()
      cancelAnimationFrame(raf)
      if (fine) window.removeEventListener('pointermove', onMove)
      video.removeEventListener('loadeddata', onLoaded)
    }
  }, [reduced])

  const entrance = (delay) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] },
        }

  return (
    <section ref={sectionRef} aria-label="CRD Property Group" style={{ position: 'relative', height: `${SCROLL_VH}vh`, zIndex: 5 }}>
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#07090d',
        }}
      >
        {/* film layer with pointer perspective */}
        <div ref={frameRef} style={{ position: 'absolute', inset: 0, willChange: 'transform', transform: 'scale(1.07)' }}>
          <video
            ref={videoRef}
            poster={SOURCES.poster}
            muted
            playsInline
            preload="auto"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={src.mp4} type="video/mp4" />
            <source src={src.webm} type="video/webm" />
          </video>
        </div>

        {/* legibility scrims */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,5,8,0.62) 0%, transparent 34%), linear-gradient(to bottom, rgba(4,5,8,0.4) 0%, transparent 22%)', pointerEvents: 'none' }} />

        {/* gold dimensional line — grows with the journey */}
        <div style={{ position: 'absolute', left: 'clamp(1.2rem, 3vw, 2.8rem)', top: '18%', bottom: '18%', width: 1, background: 'rgba(242,239,233,0.14)' }}>
          <div ref={goldLine} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--gold), var(--gold-bright))', transformOrigin: 'top', transform: 'scaleY(0)' }} />
        </div>

        {/* ——— Stage: brand block ——— */}
        <div
          ref={(el) => (stageRefs.current.brand = el)}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(1.5rem, 5.5vw, 6.5rem)', paddingBottom: 'clamp(5rem, 12vh, 9rem)', pointerEvents: 'none' }}
        >
          <div className="chapter-copy" style={{ maxWidth: 980 }}>
            <motion.div {...entrance(0.3)} className="eyebrow" style={{ marginBottom: '1.7rem' }}>
              Boston · Massachusetts
            </motion.div>
            <motion.h1 {...entrance(0.5)} className="display-hero">
              CRD Property
              <br />
              Group
            </motion.h1>
            <motion.p
              {...entrance(0.85)}
              className="serif-italic"
              style={{ marginTop: '1.6rem', fontSize: 'clamp(1.15rem, 2vw, 1.7rem)', color: 'var(--gold-bright)', letterSpacing: '0.14em' }}
            >
              Property. Elevated.
            </motion.p>
            <motion.p
              {...entrance(1.05)}
              style={{ marginTop: '1.4rem', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 'clamp(0.7rem, 0.95vw, 0.82rem)', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--ink-dim)' }}
            >
              Real Estate&nbsp;·&nbsp;Property Management&nbsp;·&nbsp;Investment
            </motion.p>
            <motion.div {...entrance(1.3)} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2.4rem', pointerEvents: 'auto' }}>
              <button className="btn btn--solid" onClick={() => scrollToJourney(0.62, 3)}>
                View Properties
              </button>
              <button className="btn" onClick={() => scrollToJourney(0.98, 3.4)}>
                Work with CRD
              </button>
            </motion.div>
          </div>
          <motion.div {...entrance(1.6)} style={{ position: 'absolute', bottom: '1.8rem', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
            <span className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--ink-faint)' }}>Scroll to experience the property</span>
            <span style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
          </motion.div>
        </div>

        {/* ——— Stages: lower-third captions ——— */}
        {STAGES.filter((s) => s.line).map((s) => (
          <div
            key={s.id}
            ref={(el) => (stageRefs.current[s.id] = el)}
            style={{ position: 'absolute', left: 'clamp(2.2rem, 6vw, 6.5rem)', bottom: 'clamp(4rem, 11vh, 8rem)', maxWidth: 560, opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' }}>
              <span style={{ width: 34, height: 1, background: 'var(--gold)' }} />
              <span className="eyebrow" style={{ fontSize: '0.6rem' }}>{s.eyebrow}</span>
            </div>
            <div className="display-lg" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 3rem)' }}>{s.line}</div>
          </div>
        ))}

        {/* ——— Stage: final reveal / hand-off ——— */}
        <div
          ref={(el) => (stageRefs.current.reveal = el)}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 'clamp(3rem, 9vh, 6rem)', opacity: 0, visibility: 'hidden', pointerEvents: 'none', textAlign: 'center' }}
        >
          <div className="eyebrow" style={{ marginBottom: '0.9rem' }}>Property · Elevated</div>
          <div className="serif-italic" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 2rem)', color: 'var(--ink)' }}>
            Now step inside a CRD development.
          </div>
          <span style={{ width: 1, height: 38, marginTop: '1.4rem', background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
        </div>

        {/* ——— progress rail ——— */}
        <div style={{ position: 'absolute', right: 'clamp(1.2rem, 2.5vw, 2.4rem)', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', alignItems: 'flex-end' }}>
            {['Exterior', 'Approach', 'Residences', 'Skyline'].map((label, i) => (
              <span
                key={label}
                ref={(el) => (railDots.current[i] = el)}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.52rem', fontWeight: 500, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(242,239,233,0.28)', transition: 'color 0.5s ease' }}
              >
                {label}
              </span>
            ))}
          </div>
          <div style={{ width: 1, height: 'clamp(110px, 22vh, 200px)', background: 'rgba(242,239,233,0.14)', position: 'relative', overflow: 'hidden' }}>
            <div ref={railFill} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--gold), var(--gold-bright))', transformOrigin: 'top', transform: 'scaleY(0)' }} />
          </div>
        </div>

        {/* poster shows until first frame decodes */}
        {!ready && (
          <div style={{ position: 'absolute', inset: 0, background: `url(${SOURCES.poster}) center/cover`, pointerEvents: 'none' }} />
        )}
      </div>
    </section>
  )
}
