import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { journey } from '../../journey/journeyState'
import { CHAPTERS } from '../../journey/chapters'

// Hairline progress rail on the right edge with chapter markers.
export default function ProgressRail() {
  const fillRef = useRef()
  const dotRefs = useRef([])

  useEffect(() => {
    const update = () => {
      const t = journey.smooth
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${t})`
      }
      dotRefs.current.forEach((el, i) => {
        if (!el) return
        const ch = CHAPTERS[i]
        const on = t >= ch.range[0] - 0.02 && t <= ch.range[1] + 0.02
        el.style.color = on ? 'var(--gold)' : 'var(--ink-faint)'
      })
    }
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])

  const goTo = (center) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    gsap.to(window, { scrollTo: { y: center * max }, duration: 2, ease: 'power2.inOut' })
  }

  return (
    <motion.div
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
            aria-label={`Go to ${ch.title}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              color: 'var(--ink-faint)',
              transition: 'color 0.5s ease',
              padding: '0.1rem 0.2rem',
            }}
          >
            {ch.numeral}
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
