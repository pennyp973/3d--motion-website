import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { EXTRA_CHAPTERS } from '../../journey/chapters'
import { journey } from '../../journey/journeyState'
import { useRafLoop } from '../../hooks/useRafLoop'
import RevealText, { FadeIn } from './RevealText'

function sectionOpacity(t, [start, end]) {
  const feather = Math.min(0.028, (end - start) * 0.32)
  const fadeIn = gsap.utils.clamp(0, 1, (t - start) / feather)
  const fadeOut = gsap.utils.clamp(0, 1, (end - t) / feather)
  return Math.min(fadeIn, fadeOut)
}

const pad = 'clamp(1.5rem, 5.5vw, 6.5rem)'

const SLIDES = {
  ownership: {
    index: '02',
    eyebrow: 'Owner Services',
    lines: ['Ownership,', 'without the overload.'],
    body: 'CRD coordinates the moving parts of ownership so clients can stay focused on the asset, not the daily friction.',
    items: ['Property oversight', 'Maintenance coordination', 'Tenant communication', 'Owner reporting'],
    align: 'left',
  },
  leasing: {
    index: '04',
    eyebrow: 'Leasing & Operations',
    lines: ['Protect the asset.', 'Support the resident.'],
    body: 'Strong operations come from consistent communication, clear standards and fast follow-through across the resident experience.',
    items: ['Leasing support', 'Tenant relations', 'Vendor coordination', 'Property care'],
    align: 'right',
  },
  acquisitions: {
    index: '06',
    eyebrow: 'Acquisitions',
    lines: ['See the property.', 'See the potential.'],
    body: 'CRD evaluates opportunities through an ownership lens — condition, operations, upside, risk and the path to long-term value.',
    items: ['Opportunity review', 'Due diligence', 'Acquisition strategy', 'Asset planning'],
    align: 'left',
  },
  process: {
    index: '08',
    eyebrow: 'How CRD Works',
    lines: ['One property.', 'One clear plan.'],
    body: 'Every engagement starts with the asset, the goal and the constraints. From there, CRD builds a practical operating or transaction plan around the client.',
    items: ['Assess', 'Plan', 'Execute', 'Optimize'],
    align: 'right',
  },
  whycrd: {
    index: '10',
    eyebrow: 'Why CRD',
    lines: ['Built for owners', 'who expect more.'],
    body: 'CRD brings real-estate execution, property operations and long-term thinking together in one accountable relationship.',
    items: ['Responsive communication', 'Ownership mindset', 'Local execution', 'Long-term value'],
    align: 'left',
  },
}

export default function EditorialSlides() {
  const refs = useRef([])
  const [activeId, setActiveId] = useState(null)

  useRafLoop(() => {
    const t = journey.smooth
    const heroGate = gsap.utils.clamp(0, 1, (journey.heroProgress - 0.93) / 0.05)
    let current = null

    EXTRA_CHAPTERS.forEach((ch, i) => {
      const el = refs.current[i]
      if (!el) return
      const o = (journey.ready ? sectionOpacity(t, ch.range) : 0) * heroGate
      const drift = (t - ch.center) * 70
      el.style.opacity = o.toFixed(3)
      el.style.transform = `translate3d(0, ${(-drift).toFixed(1)}px, 0)`
      el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      if (o > 0.2) current = ch.id
    })

    setActiveId((prev) => (prev === current ? prev : current))
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 11, pointerEvents: 'none' }}>
      {EXTRA_CHAPTERS.map((ch, i) => (
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
          <EditorialSlide id={ch.id} active={activeId === ch.id} />
        </section>
      ))}
    </div>
  )
}

function EditorialSlide({ id, active }) {
  const data = SLIDES[id]
  if (!data) return null

  const isRight = data.align === 'right'

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isRight ? 'flex-end' : 'flex-start',
        padding: pad,
      }}
    >
      <div
        className="chapter-copy"
        style={{
          maxWidth: 720,
          width: '100%',
          textAlign: isRight ? 'right' : 'left',
          marginLeft: isRight ? 'auto' : 0,
        }}
      >
        <FadeIn active={active} delay={0.08}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isRight ? 'flex-end' : 'flex-start',
              gap: '1rem',
              marginBottom: '1.8rem',
            }}
          >
            <span className="eyebrow" style={{ fontSize: '0.62rem' }}>{data.index}</span>
            <span style={{ width: 48, height: 1, background: 'var(--gold)', opacity: 0.62 }} />
            <span className="eyebrow" style={{ fontSize: '0.62rem', color: 'var(--ink-faint)' }}>{data.eyebrow}</span>
          </div>
        </FadeIn>

        <RevealText
          as="h2"
          className="display-lg"
          active={active}
          delay={0.2}
          stagger={0.11}
          lines={data.lines}
        />

        <FadeIn active={active} delay={0.72}>
          <p
            className="body-copy"
            style={{
              marginTop: '1.8rem',
              maxWidth: 620,
              marginLeft: isRight ? 'auto' : 0,
            }}
          >
            {data.body}
          </p>
        </FadeIn>

        <FadeIn active={active} delay={0.95}>
          <div
            style={{
              marginTop: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '0.75rem',
              pointerEvents: 'auto',
            }}
          >
            {data.items.map((item, i) => (
              <div
                key={item}
                className="glass-card"
                style={{
                  padding: '0.95rem 1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  justifyContent: isRight ? 'flex-end' : 'flex-start',
                }}
              >
                <span className="eyebrow" style={{ fontSize: '0.5rem', color: 'var(--ink-faint)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.9rem', letterSpacing: '0.03em', fontWeight: 300 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
