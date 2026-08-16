import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { CHAPTERS, TIMINGS } from '../../journey/chapters'
import { useRafLoop } from '../../hooks/useRafLoop'
import { journey } from '../../journey/journeyState'
import RevealText, { FadeIn } from './RevealText'

// Every chapter is a fixed full-screen layer over the 3D stage.
// Layers crossfade as the camera travels — content never stacks
// vertically under empty black space.

function sectionOpacity(t, [start, end]) {
  const feather = Math.min(0.045, (end - start) * 0.45)
  const fadeIn = start <= 0 ? 1 : gsap.utils.clamp(0, 1, (t - start) / feather)
  const fadeOut = end >= 1 ? 1 : gsap.utils.clamp(0, 1, (end - t) / feather)
  return Math.min(fadeIn, fadeOut)
}

export default function Overlay() {
  const refs = useRef([])
  const [activeId, setActiveId] = useState(null)

  useRafLoop(() => {
    const t = journey.smooth
    let current = null
    CHAPTERS.forEach((ch, i) => {
      const el = refs.current[i]
      if (!el) return
      const o = journey.ready ? sectionOpacity(t, ch.range) : 0
      const drift = (t - ch.center) * 90
      el.style.opacity = o.toFixed(3)
      el.style.transform = `translate3d(0, ${(-drift).toFixed(1)}px, 0)`
      el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      if (o > 0.15) current = ch.id
    })
    if (typeof window !== 'undefined') window.__activeId = current
    setActiveId((prev) => (prev === current ? prev : current))
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
      {CHAPTERS.map((ch, i) => (
        <section
          key={ch.id}
          ref={(el) => (refs.current[i] = el)}
          aria-label={ch.label}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            visibility: 'hidden',
            opacity: 0,
            willChange: 'opacity, transform',
          }}
        >
          <ChapterContent id={ch.id} active={activeId === ch.id} />
        </section>
      ))}
    </div>
  )
}

const pad = 'clamp(1.5rem, 5.5vw, 6.5rem)'

function ChapterContent({ id, active }) {
  switch (id) {
    case 'hero':
      return <Hero active={active} />
    case 'approach':
      return <Approach active={active} />
    case 'enter':
      return <Enter active={active} />
    case 'management':
      return <Management active={active} />
    case 'realestate':
      return <RealEstate active={active} />
    case 'investment':
      return <Investment active={active} />
    case 'services':
      return <Services active={active} />
    case 'contact':
      return <Contact active={active} />
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

function scrollToProgress(p) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  gsap.to(window, { scrollTo: { y: p * max }, duration: 2.4, ease: 'power2.inOut' })
}

/* — 01 · HERO — */
function Hero({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: pad,
        paddingBottom: 'clamp(6.5rem, 12vh, 9rem)',
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 980 }}>
        <FadeIn active={active} delay={0.2}>
          <div className="eyebrow" style={{ marginBottom: '1.9rem' }}>
            Boston · Massachusetts
          </div>
        </FadeIn>
        <RevealText
          as="h1"
          className="display-hero"
          active={active}
          delay={0.4}
          stagger={0.16}
          lines={['CRD Property', 'Group']}
        />
        <FadeIn active={active} delay={1.05}>
          <p
            style={{
              marginTop: '2rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'clamp(0.72rem, 1vw, 0.85rem)',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: 'var(--ink-dim)',
            }}
          >
            Real Estate&nbsp;·&nbsp;Property Management&nbsp;·&nbsp;Investment
          </p>
        </FadeIn>
        <FadeIn active={active} delay={1.35}>
          <div style={{ marginTop: '2.8rem', pointerEvents: 'auto' }}>
            <button className="btn" onClick={() => scrollToProgress(0.175)}>
              Explore CRD
            </button>
          </div>
        </FadeIn>
      </div>

      <FadeIn
        active={active}
        delay={1.7}
        style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
          <span className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--ink-faint)' }}>
            Scroll to begin the tour
          </span>
          <span
            style={{
              width: 1,
              height: 44,
              background: 'linear-gradient(to bottom, var(--gold), transparent)',
              display: 'block',
            }}
          />
        </div>
      </FadeIn>
    </div>
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

/* — 03 · ENTER — */
function Enter({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: pad,
        paddingBottom: 'clamp(4rem, 12vh, 9rem)',
        textAlign: 'center',
      }}
    >
      <div className="chapter-copy">
        <Mark index="02" label="The Property" active={active} />
        <RevealText
          as="h2"
          className="display-lg"
          active={active}
          delay={0.2}
          lines={['Step inside a CRD development.']}
        />
        <FadeIn active={active} delay={0.7}>
          <p className="body-copy" style={{ marginTop: '1.6rem', marginInline: 'auto', textAlign: 'center' }}>
            Every property we build, buy or manage is held to the same
            standard — the one you're walking into.
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
        <Mark index="03" label="Management" active={active} />
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
        <Mark index="04" label="Real Estate" active={active} />
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
        <Mark index="05" label="Investment" active={active} />
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

/* — 07 · SERVICES (synced captions to the facade signage) — */
const SERVICE_CAPTIONS = [
  ['Real Estate', 'Acquisition and sales across the Northeast — residences, multi-family, mixed-use.'],
  ['Property Management', 'Full-service operations for owners who expect performance, not excuses.'],
  ['Investment', 'Long-term value creation through disciplined, ownership-minded capital.'],
]

function Services({ active }) {
  const [idx, setIdx] = useState(0)

  useRafLoop(() => {
    const t = journey.smooth
    const [a, b, c] = TIMINGS.services
    const next = t < (a + b) / 2 ? 0 : t < (b + c) / 2 ? 1 : 2
    setIdx((prev) => (prev === next ? prev : next))
  })

  const [title, note] = SERVICE_CAPTIONS[idx]

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: pad,
        paddingBottom: 'clamp(4rem, 11vh, 8rem)',
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 620 }}>
        <Mark index="06" label="What we do" active={active} />
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="display-lg">{title}</h2>
          <p className="body-copy" style={{ marginTop: '1.2rem' }}>{note}</p>
        </motion.div>
        <FadeIn active={active} delay={0.4}>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
            {SERVICE_CAPTIONS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 34,
                  height: 2,
                  background: i === idx ? 'var(--gold)' : 'rgba(242,239,233,0.15)',
                  transition: 'background 0.5s ease',
                }}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

/* — 08 · CONTACT — */
function Contact({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: pad,
      }}
    >
      <div className="chapter-copy" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Mark index="07" label="Contact" active={active} />
        <RevealText
          as="h2"
          className="display-xl"
          active={active}
          delay={0.2}
          lines={["Let's build", "what's next."]}
        />
        <FadeIn active={active} delay={0.8}>
          <p className="body-copy" style={{ marginTop: '1.8rem', textAlign: 'center' }}>
            Owners, buyers, sellers and partners — bring us the property,
            we'll bring the plan.
          </p>
        </FadeIn>
        <FadeIn active={active} delay={1.05}>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.6rem', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto' }}>
            <a className="btn btn--solid" href="mailto:partners@crdpropertygroup.com">
              Work with CRD
            </a>
            <a className="btn" href="mailto:hello@crdpropertygroup.com">
              Contact us
            </a>
          </div>
        </FadeIn>
        <FadeIn active={active} delay={1.3}>
          <div
            style={{
              marginTop: '2.8rem',
              display: 'flex',
              gap: 'clamp(1.2rem, 3vw, 2.6rem)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 300,
              letterSpacing: '0.12em',
              color: 'var(--ink-dim)',
              pointerEvents: 'auto',
            }}
          >
            <a href="mailto:hello@crdpropertygroup.com" style={{ color: 'inherit', textDecoration: 'none' }}>
              hello@crdpropertygroup.com
            </a>
            <span>+1 (617) 555-0148</span>
            <span>Boston, Massachusetts</span>
          </div>
        </FadeIn>
      </div>

      <FadeIn active={active} delay={1.5}>
        <div
          className="eyebrow"
          style={{
            position: 'absolute',
            bottom: 'clamp(1.4rem, 4vh, 2.6rem)',
            left: 0,
            right: 0,
            fontSize: '0.52rem',
            color: 'var(--ink-faint)',
            letterSpacing: '0.32em',
          }}
        >
          © CRD Property Group — Real Estate · Property Management · Investment
        </div>
      </FadeIn>
    </div>
  )
}
