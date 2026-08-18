import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { journey } from '../../journey/journeyState'
import { useMagnetic } from '../../hooks/useMagnetic'
import { scrollToAnchor } from '../../journey/scrollTo'

gsap.registerPlugin(ScrollTrigger)

// ————————————————————————————————————————————————————————————————
// BuildWithUs — step outside, and build one.
//
// The residence tour ends on the terrace. Here the camera leaves the
// finished house entirely and lands on open ground at sunrise, where
// scrolling raises a building out of it: slab, structure, envelope,
// delivery. The visitor does the building.
//
// Deliberately the friendliest part of the site — plain sentences,
// four named stages you can click straight to, and a meter reading
// how far along you are.
// ————————————————————————————————————————————————————————————————

const SCROLL_VH = 620

const SOURCES = {
  desktop: { mp4: '/video/crd-build-1080.mp4', webm: '/video/crd-build-1080.webm' },
  mobile: { mp4: '/video/crd-build-720.mp4', webm: '/video/crd-build-720.webm' },
  poster: '/video/crd-build-poster.jpg',
}

const STAGES = [
  {
    n: '01', key: 'site', at: 0.0, label: 'Site',
    title: 'It starts with the land.',
    body: 'We find the parcel, run the numbers, and handle zoning, permits and design. By the time the slab is poured, everything is already decided.',
    points: ['Site selection', 'Feasibility & budget', 'Permits & approvals'],
  },
  {
    n: '02', key: 'structure', at: 0.25, label: 'Structure',
    title: 'Then the bones go up.',
    body: 'Foundation, frame and floors — built by crews we have worked with for years, on a schedule you can actually see.',
    points: ['Foundation & slab', 'Frame & floors', 'Weekly progress reports'],
  },
  {
    n: '03', key: 'envelope', at: 0.5, label: 'Envelope',
    title: 'Glass, stone and light.',
    body: 'The facade closes in and the building becomes itself. This is where the finish level you chose starts to show.',
    points: ['Facade & glazing', 'Roofing & systems', 'Interior finishes'],
  },
  {
    n: '04', key: 'delivery', at: 0.75, label: 'Delivery',
    title: 'Doors open — and we stay on.',
    body: 'We hand over a finished building, then manage it for you: leasing, maintenance, reporting. The same team, start to forever.',
    points: ['Handover & warranty', 'Leasing & tenants', 'Ongoing management'],
  },
]

const clamp01 = (v) => Math.min(Math.max(v, 0), 1)

// The building actually goes up in the first fifth of the footage;
// the rest is a slow dusk orbit of the finished thing. A flat scroll
// would race past the construction and then dwell on nothing, so
// scroll time is remapped onto video time: each stage gets an equal
// quarter of the scroll and exactly the frames that belong to it.
const SCROLL_KEYS = [0, 0.25, 0.5, 0.75, 1]
const VIDEO_KEYS = [0, 0.035, 0.115, 0.19, 1]

function toVideoTime(t) {
  for (let i = 1; i < SCROLL_KEYS.length; i++) {
    if (t <= SCROLL_KEYS[i]) {
      const span = SCROLL_KEYS[i] - SCROLL_KEYS[i - 1]
      const local = span > 0 ? (t - SCROLL_KEYS[i - 1]) / span : 0
      return VIDEO_KEYS[i - 1] + (VIDEO_KEYS[i] - VIDEO_KEYS[i - 1]) * local
    }
  }
  return 1
}

function BuildButton({ children, onClick }) {
  const ref = useMagnetic()
  return (
    <button ref={ref} className="btn btn--solid" onClick={onClick}>
      {children}
    </button>
  )
}

export default function BuildWithUs() {
  const sectionRef = useRef()
  const videoRef = useRef()
  const stageRefs = useRef([])
  const meterRef = useRef()
  const meterFill = useRef()
  const chipRefs = useRef([])
  const introRef = useRef()
  const [active, setActive] = useState(0)
  const lastActive = useRef(-1)

  const [src] = useState(() =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(pointer: coarse)').matches)
      ? SOURCES.mobile
      : SOURCES.desktop
  )

  const goToStage = (i) => {
    const section = sectionRef.current
    if (!section) return
    const span = section.offsetHeight - window.innerHeight
    const target = section.offsetTop + span * Math.min(STAGES[i].at + 0.09, 0.99)
    gsap.to(window, { scrollTo: { y: target }, duration: 2, ease: 'power2.inOut' })
  }

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    let target = 0
    let shown = -1
    let raf
    let last = performance.now()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { target = self.progress },
    })

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.6)
      last = now
      shown = shown < 0 ? target : shown + (target - shown) * (1 - Math.exp(-4.6 * dt))
      const t = clamp01(shown)
      journey.buildProgress = t

      if (video.duration) {
        const want = toVideoTime(t) * (video.duration - 0.06)
        if (Math.abs(video.currentTime - want) > 0.016) video.currentTime = want
      }

      if (introRef.current) {
        introRef.current.style.opacity = (1 - clamp01((t - 0.06) / 0.12)).toFixed(3)
      }

      let current = 0
      STAGES.forEach((s, i) => {
        const el = stageRefs.current[i]
        if (!el) return
        const next = STAGES[i + 1]?.at ?? 1.08
        const appear = clamp01((t - s.at) / 0.07)
        const depart = clamp01((t - (next - 0.05)) / 0.06)
        const o = appear * (1 - depart)
        el.style.opacity = o.toFixed(3)
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
        el.style.transform = reduced ? 'none' : `translate3d(0, ${((1 - appear) * 26).toFixed(1)}px, 0)`
        if (o > 0.5) current = i
      })

      if (meterFill.current) meterFill.current.style.transform = `scaleX(${t.toFixed(4)})`
      if (meterRef.current) meterRef.current.textContent = `${Math.round(t * 100)}% BUILT`

      if (current !== lastActive.current) {
        lastActive.current = current
        setActive(current)
        chipRefs.current.forEach((el, idx) => {
          if (el) el.dataset.active = String(idx === current)
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => { st.kill(); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="build-section"
      style={{ height: `${SCROLL_VH}vh` }}
      aria-label="Build with CRD"
    >
      <div className="build-sticky">
        <video
          ref={videoRef}
          className="build-video"
          poster={SOURCES.poster}
          muted
          playsInline
          preload="auto"
        >
          <source src={src.mp4} type="video/mp4" />
          <source src={src.webm} type="video/webm" />
        </video>

        <div className="build-scrim" />

        <div ref={introRef} className="build-intro">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Beyond the finished home
          </motion.div>
          <motion.h2
            className="build-headline"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            Build with us
          </motion.h2>
          <motion.p
            className="build-sub"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Keep scrolling — you'll put the whole thing up.
          </motion.p>
        </div>

        {STAGES.map((s, i) => (
          <div
            key={s.key}
            ref={(el) => (stageRefs.current[i] = el)}
            className="build-stage"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <div className="build-stage-mark">
              <span className="build-stage-n">{s.n}</span>
              <span className="build-stage-rule" />
              <span className="build-stage-label">{s.label}</span>
            </div>
            <h3 className="build-stage-title">{s.title}</h3>
            <p className="build-stage-body">{s.body}</p>
            <ul className="build-points">
              {s.points.map((p) => (
                <li key={p} className="build-point">{p}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="build-controls">
          <div className="build-meter">
            <span ref={meterRef} className="build-meter-text">0% BUILT</span>
            <span className="build-meter-track">
              <span ref={meterFill} className="build-meter-fill" />
            </span>
          </div>
          <div className="build-chips" role="tablist" aria-label="Build stages">
            {STAGES.map((s, i) => (
              <button
                key={s.key}
                ref={(el) => (chipRefs.current[i] = el)}
                className="build-chip"
                data-active={i === active}
                onClick={() => goToStage(i)}
                role="tab"
                aria-selected={i === active}
                aria-label={`Jump to ${s.label}`}
              >
                <span className="build-chip-n">{s.n}</span>
                {s.label}
              </button>
            ))}
          </div>
          <div className="build-cta">
            <BuildButton onClick={() => scrollToAnchor('closing', 2.2)}>
              Start a project with us
            </BuildButton>
          </div>
        </div>
      </div>
    </section>
  )
}
