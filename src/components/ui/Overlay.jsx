import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ROOMS, ROOM_WINDOWS, PROPERTY } from '../../journey/rooms'
import { useRafLoop } from '../../hooks/useRafLoop'
import { journey } from '../../journey/journeyState'
import { useMagnetic } from '../../hooks/useMagnetic'
import RevealText, { FadeIn } from './RevealText'

// ————————————————————————————————————————————————————————————————
// Overlay — what CRD has to say, said from inside a room.
//
// Every chapter is anchored to a room of the residence rather than to
// an abstract slice of the page: management speaks at the kitchen
// island, real estate in the primary suite, investment at the bronze
// hardware, the summary and the invitation out on the terrace. The
// chapter holds while the camera is in its room and releases as the
// camera moves on, so content and place arrive together.
// ————————————————————————————————————————————————————————————————

// Chapters live slightly inside their room, letting the doorway
// transition finish before words appear.
const LEAD_IN = 0.2
const LEAD_OUT = 0.16

function clamp01(v) {
  return Math.min(Math.max(v, 0), 1)
}

const CHAPTER_ROOMS = ROOMS.map((r, i) => ({ ...r, index: i })).filter((r) => r.chapter)

export default function Overlay() {
  const refs = useRef({})
  const [activeId, setActiveId] = useState(null)
  const last = useRef(null)

  useRafLoop(() => {
    const t = journey.smooth
    // the film hero holds the screen until it has carried us inside
    const gate = clamp01((journey.heroProgress - 0.9) / 0.085)
    let current = null

    CHAPTER_ROOMS.forEach((room) => {
      const el = refs.current[room.id]
      if (!el) return
      const w = ROOM_WINDOWS[room.index]
      const span = Math.max(w.end - w.start, 0.0001)
      const ct = (t - w.start) / span

      const appear = clamp01(ct / LEAD_IN)
      const depart = clamp01((ct - (1 - LEAD_OUT)) / LEAD_OUT)
      const o = appear * (1 - depart) * gate

      el.style.opacity = o.toFixed(3)
      el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      // content drifts gently against the camera's travel
      el.style.transform = `translate3d(0, ${((0.5 - ct) * 26).toFixed(1)}px, 0)`
      if (o > 0.4) current = room.id
    })

    if (current !== last.current) {
      last.current = current
      setActiveId(current)
    }
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 14, pointerEvents: 'none' }}>
      {CHAPTER_ROOMS.map((room) => (
        <section
          key={room.id}
          ref={(el) => (refs.current[room.id] = el)}
          aria-label={room.label}
          className="chapter-section"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            visibility: 'hidden',
            opacity: 0,
            willChange: 'opacity, transform',
          }}
        >
          <ChapterContent id={room.chapter} active={activeId === room.id} />
        </section>
      ))}
    </div>
  )
}

const pad = 'clamp(1.5rem, 5.5vw, 6.5rem)'

function ChapterContent({ id, active }) {
  switch (id) {
    case 'about':
      return <Approach active={active} />
    case 'management':
      return <Management active={active} />
    case 'realestate':
      return <RealEstate active={active} />
    case 'investment':
      return <Investment active={active} />
    case 'summary':
      return <Summary active={active} />
    default:
      return null
  }
}

function Mark({ index, label, active }) {
  return (
    <FadeIn active={active} delay={0.08}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.8rem' }}>
        <span className="eyebrow" style={{ fontSize: '0.62rem' }}>{index}</span>
        <span style={{ width: 46, height: 1, background: 'var(--gold)', opacity: 0.6 }} />
        <span className="eyebrow" style={{ fontSize: '0.62rem', color: 'var(--ink-faint)' }}>{label}</span>
      </div>
    </FadeIn>
  )
}

// A button that leans toward the cursor as it approaches.
function MagneticButton({ children, onClick, href, solid }) {
  const ref = useMagnetic()
  const cls = `btn${solid ? ' btn--solid' : ''}`
  if (href) {
    return (
      <a ref={ref} className={cls} href={href}>
        {children}
      </a>
    )
  }
  return (
    <button ref={ref} className={cls} onClick={onClick}>
      {children}
    </button>
  )
}

/* — 02 · APPROACH (About) — */
function Approach({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: pad,
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 620, textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Mark index="01" label="The CRD Approach" active={active} />
        </div>
        <RevealText
          as="h2"
          className="display-xl"
          active={active}
          delay={0.2}
          stagger={0.12}
          lines={['Build.', 'Manage.', 'Invest.', 'Grow.']}
        />
        <FadeIn active={active} delay={0.9}>
          <p className="body-copy" style={{ marginTop: '2.2rem', marginLeft: 'auto' }}>
            From ground-up development to decades of asset performance —
            one accountable partner across the entire life of a property.
          </p>
        </FadeIn>
      </div>
    </div>
  )
}
/* — 04 · PROPERTY MANAGEMENT — */
const SERVICES_MGMT = [
  ['Tenant Relations', 'Responsive, respectful, retention-focused'],
  ['Property Maintenance', '24/7 upkeep, vendor and capital planning'],
  ['Rent Management', 'Collections, escalations and reporting'],
  ['Property Oversight', 'Inspections, compliance and performance'],
  ['Owner Support', 'Transparent statements, one point of contact'],
]

function Management({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '3rem',
        padding: pad,
        flexWrap: 'wrap',
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 520, flex: '1 1 320px' }}>
        <Mark index="02" label="Management" active={active} />
        <RevealText
          as="h2"
          className="display-lg"
          active={active}
          delay={0.2}
          lines={['Property', 'Management']}
        />
        <FadeIn active={active} delay={0.7}>
          <p className="body-copy" style={{ marginTop: '2rem' }}>
            Your building, run like it's ours. CRD operates every asset
            with institutional discipline and neighborhood-level care.
          </p>
        </FadeIn>
      </div>

      <div style={{ flex: '0 1 420px', display: 'flex', flexDirection: 'column', gap: '0.7rem', pointerEvents: 'auto' }}>
        {SERVICES_MGMT.map(([title, note], i) => (
          <FadeIn key={title} active={active} delay={0.5 + i * 0.12}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'baseline', gap: '1.2rem' }}>
              <span className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--ink-faint)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.15rem, 1.9vw, 1.5rem)',
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                  }}
                >
                  {title}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 300, color: 'var(--ink-dim)', marginTop: '0.25rem', letterSpacing: '0.03em' }}>
                  {note}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
/* — 05 · REAL ESTATE — */
const RE_ROWS = [
  ['Properties', 'Residences and multi-family assets across the Northeast'],
  ['Opportunities', 'Off-market listings and development parcels'],
  ['Acquisition', 'Sourcing, diligence and closing — handled end to end'],
  ['Strategy', 'Buy-side and sell-side advisory grounded in ownership'],
]

function RealEstate({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: pad,
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 640 }}>
        <Mark index="03" label="Real Estate" active={active} />
        <RevealText
          as="h2"
          className="display-xl"
          active={active}
          delay={0.2}
          lines={['Buy. Sell.', 'Invest.']}
        />
        <FadeIn active={active} delay={0.75}>
          <div style={{ marginTop: '2.4rem', pointerEvents: 'auto' }}>
            {RE_ROWS.map(([title, note], i) => (
              <div
                key={title}
                className="list-row"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1.4rem',
                  padding: '1rem 0',
                  borderTop: '1px solid var(--hairline)',
                  borderBottom: i === RE_ROWS.length - 1 ? '1px solid var(--hairline)' : 'none',
                }}
              >
                <span className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--ink-faint)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="serif-italic" style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.8rem)', whiteSpace: 'nowrap' }}>
                  {title}
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 300,
                    color: 'var(--ink-dim)',
                    letterSpacing: '0.03em',
                    textAlign: 'right',
                    flex: 1,
                  }}
                >
                  {note}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
/* — 06 · INVESTMENT — */
function Chart({ active }) {
  // Indexed value curve — drawn as the section becomes active
  const line = 'M0,86 C30,80 48,74 70,66 C95,57 118,52 142,44 C165,37 185,30 210,24 C232,19 250,14 268,10'
  const area = `${line} L268,100 L0,100 Z`
  return (
    <svg viewBox="0 0 268 100" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="goldfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(194,160,97,0.35)" />
          <stop offset="100%" stopColor="rgba(194,160,97,0)" />
        </linearGradient>
      </defs>
      {[25, 50, 75].map((y) => (
        <line key={y} x1="0" x2="268" y1={y} y2={y} stroke="rgba(242,239,233,0.07)" strokeWidth="0.5" />
      ))}
      <motion.path
        d={area}
        fill="url(#goldfade)"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.6, delay: 1.2 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--gold-bright)"
        strokeWidth="1.6"
        initial={{ pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="268"
        cy="10"
        r="2.6"
        fill="var(--gold-bright)"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      />
    </svg>
  )
}

const INVEST_STATS = [
  ['9.4%', 'Avg. annual appreciation, CRD portfolio'],
  ['98%', 'Stabilized occupancy across assets'],
  ['15 yrs', 'Average hold — built for the long term'],
]

function Investment({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '2.5rem',
        padding: pad,
        paddingBottom: 'clamp(3rem, 9vh, 7rem)',
        flexWrap: 'wrap',
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 560, flex: '1 1 320px' }}>
        <Mark index="04" label="Investment" active={active} />
        <RevealText
          as="h2"
          className="display-lg"
          active={active}
          delay={0.2}
          lines={['Build long-term', 'value.']}
        />
        <FadeIn active={active} delay={0.75}>
          <p className="body-copy" style={{ marginTop: '1.8rem' }}>
            Property is more than shelter — it's income, equity and
            generational wealth. CRD structures acquisitions that pay
            today and compound for decades.
          </p>
        </FadeIn>
      </div>

      <FadeIn active={active} delay={0.6} style={{ flex: '0 1 430px', pointerEvents: 'auto' }}>
        <div className="glass-card glass-card--lg">
          <div className="eyebrow" style={{ fontSize: '0.55rem', marginBottom: '1.1rem', color: 'var(--ink-faint)' }}>
            Portfolio index — value over time
          </div>
          <Chart active={active} />
          <div
            style={{
              display: 'flex',
              gap: 'clamp(1.2rem, 3vw, 2.4rem)',
              marginTop: '1.4rem',
              paddingTop: '1.2rem',
              borderTop: '1px solid var(--hairline)',
            }}
          >
            {INVEST_STATS.map(([n, l]) => (
              <div key={l} style={{ flex: 1 }}>
                <div className="serif-italic" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', color: 'var(--gold-bright)' }}>
                  {n}
                </div>
                <div style={{ fontSize: '0.66rem', fontWeight: 300, color: 'var(--ink-dim)', marginTop: '0.35rem', lineHeight: 1.5, letterSpacing: '0.04em' }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

/* — THE RESIDENCE IN FULL — the property, stated plainly, on the terrace — */
const SERVICE_LINES = [
  ['Real Estate', 'Acquisition and sales across the Northeast — residences, multi-family, mixed-use.'],
  ['Property Management', 'Full-service operations for owners who expect performance, not excuses.'],
  ['Investment', 'Long-term value creation through disciplined, ownership-minded capital.'],
]

function Summary({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: pad,
        gap: 'clamp(1.8rem, 4vh, 3rem)',
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 1080 }}>
        <Mark index="05" label="The Residence" active={active} />
        <RevealText
          as="h2"
          className="display-lg"
          active={active}
          delay={0.2}
          lines={['Everything you just', 'walked through.']}
        />
        <FadeIn active={active} delay={0.7}>
          <div className="summary-grid" style={{ marginTop: '2.6rem', maxWidth: 760 }}>
            {PROPERTY.stats.map(([figure, caption], i) => (
              <FadeIn key={caption} active={active} delay={0.8 + i * 0.09}>
                <div className="summary-stat">
                  <div className="summary-figure">{figure}</div>
                  <div className="summary-caption">{caption}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
        <FadeIn active={active} delay={1.45}>
          <div
            style={{
              marginTop: '2.6rem',
              display: 'flex',
              gap: 'clamp(1.4rem, 3vw, 3rem)',
              flexWrap: 'wrap',
              maxWidth: 900,
            }}
          >
            {SERVICE_LINES.map(([title, note]) => (
              <div key={title} style={{ flex: '1 1 15rem', maxWidth: '20rem' }}>
                <div
                  className="serif-italic"
                  style={{ fontSize: 'clamp(1.15rem, 1.9vw, 1.5rem)', color: 'var(--gold-bright)' }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 300,
                    lineHeight: 1.7,
                    letterSpacing: '0.03em',
                    color: 'var(--ink-dim)',
                    marginTop: '0.5rem',
                  }}
                >
                  {note}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

