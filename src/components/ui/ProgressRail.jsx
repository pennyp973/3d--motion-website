import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { journey } from '../../journey/journeyState'
import { useRafLoop } from '../../hooks/useRafLoop'
import { CHAPTERS } from '../../journey/chapters'
import { scrollToJourney } from '../../journey/scrollTo'

// Hairline progress rail on the right edge with chapter markers.
export default function ProgressRail() {
  const rootRef = useRef()
  const fillRef = useRef()
  const dotRefs = useRef([])

  useRafLoop(() => {
    const t = journey.smooth
    const heroGate = journey.heroProgress > 0.96 ? 1 : 0
    if (rootRef.current) {
      rootRef.current.style.opacity = heroGate
      rootRef.current.style.pointerEvents = heroGate ? 'auto' : 'none'
    }
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleY(${t})`
    }
    dotRefs.current.forEach((el, i) => {
      if (!el) return
      const ch = CHAPTERS[i]
      const on = t >= ch.range[0] - 0.02 && t <= ch.range[1] + 0.02
      el.style.color = on ? 'var(--gold)' : 'var(--ink-faint)'
    })
  })

  const goTo = (center) => scrollToJourney(center, 2)

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.4, duration: 1.4 }}
      className="progress-rail"
      style={{
        position: 'fixed',
        right: 'clamp(1.2rem, 2.5vw, 2.4rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '1.1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.35rem',
          alignItems: 'flex-end',
        }}
      >
        {CHAPTERS.map((ch, i) => (
          <button
            key={ch.id}
            ref={(el) => (dotRefs.current[i] = el)}
            onClick={() => goTo(ch.center)}
            aria-label={`Go to ${ch.label}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.58rem',
              letterSpacing: '0.12em',
              color: 'var(--ink-faint)',
              transition: 'color 0.5s ease',
              padding: '0.1rem 0.2rem',
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
      <div
        style={{
          width: 1,
          height: 'clamp(120px, 26vh, 240px)',
          background: 'rgba(232,228,220,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          ref={fillRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, var(--gold), var(--gold-bright))',
            transformOrigin: 'top',
            transform: 'scaleY(0)',
          }}
        />
      </div>
    </motion.div>
  )
}
