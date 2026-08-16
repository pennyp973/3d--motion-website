import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { CHAPTERS } from '../../journey/chapters'

// Minimal top bar + full-screen chapter menu.
// Menu links glide the scroll position to a chapter's center.
export default function Nav() {
  const [open, setOpen] = useState(false)

  const goTo = (center) => {
    setOpen(false)
    const max = document.documentElement.scrollHeight - window.innerHeight
    gsap.to(window, {
      scrollTo: { y: center * max },
      duration: 2.2,
      ease: 'power2.inOut',
    })
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(1.2rem, 3vw, 2.2rem) clamp(1.5rem, 4vw, 3.5rem)',
          mixBlendMode: 'difference',
        }}
      >
        <motion.button
          onClick={() => goTo(0)}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 1.2 }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            fontWeight: 400,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
          }}
        >
          Lumière
        </motion.button>

        <motion.button
          onClick={() => setOpen((v) => !v)}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 1.2 }}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            fontWeight: 400,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          {open ? 'Close' : 'Menu'}
          <span
            style={{
              display: 'inline-block',
              width: 24,
              height: 1,
              background: 'currentColor',
            }}
          />
        </motion.button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
              background: 'rgba(5,5,5,0.96)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(0.6rem, 2vh, 1.4rem)',
            }}
          >
            {CHAPTERS.map((ch, i) => (
              <motion.button
                key={ch.id}
                onClick={() => goTo(ch.center)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="menu-item"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '1.6rem',
                  color: 'var(--ink)',
                }}
              >
                <span className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--gold)' }}>
                  {ch.numeral}
                </span>
                <span
                  className="menu-item-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 300,
                    fontSize: 'clamp(2rem, 5.5vw, 4rem)',
                    letterSpacing: '0.04em',
                    lineHeight: 1.15,
                    transition: 'color 0.4s ease, letter-spacing 0.6s ease',
                  }}
                >
                  {ch.title}
                </span>
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
