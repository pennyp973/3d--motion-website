import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { NAV_LINKS } from '../../journey/chapters'
import { scrollToJourney } from '../../journey/scrollTo'
import { useIsMobile } from '../../hooks/useIsMobile'

// Minimal corporate nav: wordmark left, section links right.
// On mobile the links collapse into a full-screen menu.
export default function Nav() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const goTo = (target) => {
    setOpen(false)
    scrollToJourney(target)
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
          padding: 'clamp(1.1rem, 2.6vw, 1.9rem) clamp(1.5rem, 4vw, 3.2rem)',
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.55), transparent)',
        }}
      >
        <motion.button
          onClick={() => gsap.to(window, { scrollTo: { y: 0 }, duration: 2, ease: 'power2.inOut' })}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 1.1 }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.7rem',
          }}
          aria-label="CRD Property Group — back to top"
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '1.05rem',
              letterSpacing: '0.34em',
            }}
          >
            CRD
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '0.58rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--ink-dim)',
            }}
          >
            Property Group
          </span>
        </motion.button>

        {!isMobile && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 1.1 }}
            style={{ display: 'flex', gap: 'clamp(1.2rem, 2.6vw, 2.6rem)', alignItems: 'center' }}
          >
            {NAV_LINKS.map((l) => (
              <button key={l.label} className="nav-link" onClick={() => goTo(l.target)}>
                {l.label}
              </button>
            ))}
          </motion.nav>
        )}

        {isMobile && (
          <motion.button
            onClick={() => setOpen((v) => !v)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 1 }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
            }}
          >
            {open ? 'Close' : 'Menu'}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: 'currentColor' }} />
          </motion.button>
        )}
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
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
              gap: 'clamp(0.7rem, 2.2vh, 1.5rem)',
            }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.button
                key={l.label}
                onClick={() => goTo(l.target)}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="menu-item"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}
              >
                <span
                  className="menu-item-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 300,
                    fontSize: 'clamp(2.2rem, 8vw, 3.6rem)',
                    letterSpacing: '0.03em',
                    transition: 'color 0.4s ease, letter-spacing 0.6s ease',
                  }}
                >
                  {l.label}
                </span>
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
