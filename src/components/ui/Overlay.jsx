import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CHAPTERS } from '../../journey/chapters'
import { journey } from '../../journey/journeyState'
import RevealText, { FadeIn } from './RevealText'

// All chapters live as fixed, full-screen layers over the canvas.
// They never stack vertically — each dissolves into the next as the
// camera travels, driven every frame from the smoothed scroll value.

function sectionOpacity(t, [start, end]) {
  const feather = Math.min(0.055, (end - start) * 0.45)
  // Chapters touching the ends of the journey stay visible at the edges
  const fadeIn = start <= 0 ? 1 : gsap.utils.clamp(0, 1, (t - start) / feather)
  const fadeOut = end >= 1 ? 1 : gsap.utils.clamp(0, 1, (end - t) / feather)
  return Math.min(fadeIn, fadeOut)
}

export default function Overlay() {
  const refs = useRef([])
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const update = () => {
      const t = journey.smooth
      let current = null

      CHAPTERS.forEach((ch, i) => {
        const el = refs.current[i]
        if (!el) return
        const o = journey.ready ? sectionOpacity(t, ch.range) : 0
        const drift = (t - ch.center) * 120 // parallax slide against travel
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translate3d(0, ${(-drift).toFixed(1)}px, 0)`
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
        if (o > 0.35) current = ch.id
      })

      setActiveId((prev) => (prev === current ? prev : current))
    }
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
      {CHAPTERS.map((ch, i) => (
        <section
          key={ch.id}
          ref={(el) => (refs.current[i] = el)}
          aria-label={ch.title}
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

const pad = 'clamp(1.5rem, 6vw, 7rem)'

function ChapterContent({ id, active }) {
  switch (id) {
    case 'overture':
      return <Overture active={active} />
    case 'philosophy':
      return <Philosophy active={active} />
    case 'craft':
      return <Craft active={active} />
    case 'collection':
      return <Collection active={active} />
    case 'epilogue':
      return <Epilogue active={active} />
    default:
      return null
  }
}

function ChapterMark({ numeral, label, active }) {
  return (
    <FadeIn active={active} delay={0.1}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <span className="eyebrow">{numeral}</span>
        <span style={{ width: 42, height: 1, background: 'var(--gold)', opacity: 0.6 }} />
        <span className="eyebrow" style={{ color: 'var(--ink-faint)' }}>{label}</span>
      </div>
    </FadeIn>
  )
}

/* — I — */
function Overture({ active }) {
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
      <FadeIn active={active} delay={0.15}>
        <div className="eyebrow" style={{ marginBottom: '2.4rem' }}>
          Atelier of Light — Est. MMXXVI
        </div>
      </FadeIn>
      <RevealText
        as="h1"
        className="display-xl"
        active={active}
        delay={0.35}
        stagger={0.14}
        lines={['LUMIÈRE']}
      />
      <FadeIn active={active} delay={0.9}>
        <p
          className="serif-italic"
          style={{
            marginTop: '2.2rem',
            fontSize: 'clamp(1rem, 1.6vw, 1.35rem)',
            color: 'var(--ink-dim)',
            letterSpacing: '0.06em',
          }}
        >
          Sculptures of light, gravity & silence
        </p>
      </FadeIn>

      <FadeIn
        active={active}
        delay={1.4}
        style={{ position: 'absolute', bottom: 'clamp(2rem, 5vh, 3.5rem)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}>
          <span className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--ink-faint)' }}>
            Scroll to enter
          </span>
          <span
            style={{
              width: 1,
              height: 52,
              background: 'linear-gradient(to bottom, var(--gold), transparent)',
              display: 'block',
              animation: 'none',
            }}
          />
        </div>
      </FadeIn>
    </div>
  )
}

/* — II — */
function Philosophy({ active }) {
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
      <div className="chapter-copy" style={{ maxWidth: 560 }}>
        <ChapterMark numeral="II" label="Philosophy" active={active} />
        <RevealText
          as="h2"
          className="display-lg"
          active={active}
          delay={0.2}
          lines={['Light is not', 'seen. It is', 'felt.']}
        />
        <FadeIn active={active} delay={0.75}>
          <p className="body-copy" style={{ marginTop: '2.2rem' }}>
            Every piece begins as a single continuous line — bent, folded and
            returned to itself until it holds tension the way a held breath
            does. We do not decorate objects with light. We give light a body
            to live in.
          </p>
        </FadeIn>
      </div>
    </div>
  )
}

/* — III — */
function Craft({ active }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: pad,
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 560 }}>
        <ChapterMark numeral="III" label="Craft" active={active} />
        <RevealText
          as="h2"
          className="display-lg"
          active={active}
          delay={0.2}
          lines={['Forged in', 'orbit.']}
        />
        <FadeIn active={active} delay={0.7}>
          <p className="body-copy" style={{ marginTop: '2.2rem' }}>
            Twelve artisans. Nine months a piece. Bronze poured at midnight,
            when the workshop cools and the metal keeps its patience. Each
            ring is balanced by hand until it turns forever on a breath of
            air.
          </p>
        </FadeIn>
        <FadeIn active={active} delay={0.95}>
          <dl
            style={{
              marginTop: '2.6rem',
              display: 'flex',
              gap: 'clamp(1.6rem, 4vw, 3.5rem)',
            }}
          >
            {[
              ['12', 'Artisans'],
              ['270', 'Days each'],
              ['01', 'Line of gold'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt
                  className="serif-italic"
                  style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--gold)' }}
                >
                  {n}
                </dt>
                <dd className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--ink-faint)', marginTop: '0.5rem' }}>
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </div>
  )
}

/* — IV — */
function Collection({ active }) {
  const pieces = [
    ['N°1', 'Solstice', 'Bronze · light-core'],
    ['N°2', 'Meridian', 'Blackened steel'],
    ['N°3', 'Umbra', 'Smoked crystal'],
  ]
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: pad,
      }}
    >
      <div className="chapter-copy" style={{ maxWidth: 620 }}>
        <ChapterMark numeral="IV" label="Collection" active={active} />
        <RevealText
          as="h2"
          className="display-lg"
          active={active}
          delay={0.2}
          lines={['Objects of', 'gravity.']}
        />
        <FadeIn active={active} delay={0.7}>
          <div style={{ marginTop: '2.6rem', pointerEvents: 'auto' }}>
            {pieces.map(([no, name, note], i) => (
              <div
                key={no}
                className="collection-row"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1.4rem',
                  padding: '1.05rem 0',
                  borderTop: '1px solid rgba(232,228,220,0.1)',
                  borderBottom: i === pieces.length - 1 ? '1px solid rgba(232,228,220,0.1)' : 'none',
                }}
              >
                <span className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--ink-faint)' }}>
                  {no}
                </span>
                <span
                  className="serif-italic"
                  style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)', flex: 1 }}
                >
                  {name}
                </span>
                <span
                  className="eyebrow"
                  style={{ fontSize: '0.55rem', color: 'var(--ink-faint)', letterSpacing: '0.3em' }}
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

/* — V — */
function Epilogue({ active }) {
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
      <ChapterMark numeral="V" label="Epilogue" active={active} />
      <RevealText
        as="h2"
        className="display-lg"
        active={active}
        delay={0.2}
        lines={['Step into', 'the light.']}
      />
      <FadeIn active={active} delay={0.75}>
        <p className="body-copy" style={{ marginTop: '2rem', textAlign: 'center' }}>
          Commissions open for autumn. Two pieces remain.
        </p>
      </FadeIn>
      <FadeIn active={active} delay={1.0}>
        <a
          href="mailto:atelier@lumiere.example"
          className="cta-link"
          style={{
            pointerEvents: 'auto',
            display: 'inline-block',
            marginTop: '2.8rem',
            padding: '1.1rem 3.2rem',
            border: '1px solid rgba(201,169,98,0.5)',
            color: 'var(--gold-bright)',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            fontWeight: 400,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            paddingLeft: 'calc(3.2rem + 0.45em)',
            transition: 'background 0.6s ease, color 0.6s ease, border-color 0.6s ease',
          }}
        >
          Begin a commission
        </a>
      </FadeIn>
      <FadeIn active={active} delay={1.3}>
        <div
          className="eyebrow"
          style={{
            position: 'absolute',
            bottom: 'clamp(1.6rem, 4vh, 3rem)',
            left: 0,
            right: 0,
            fontSize: '0.5rem',
            color: 'var(--ink-faint)',
            letterSpacing: '0.35em',
          }}
        >
          Lumière Atelier — Paris · Kyoto · New York
        </div>
      </FadeIn>
    </div>
  )
}
