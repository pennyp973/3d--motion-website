import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'
import { EASE } from '../../lib/motion'

const LINKS = [
  { label: 'Approach', id: 'about' },
  { label: 'Properties', id: 'properties' },
  { label: 'Management', id: 'management' },
  { label: 'Investment', id: 'investment' },
  { label: 'Contact', id: 'contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [condensed, setCondensed] = useState(false)
  const [active, setActive] = useState(null)
  const [progress, setProgress] = useState(0)
  const isMobile = useIsMobile()

  // Scroll progress + condensed header state
  useEffect(() => {
    let frame
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? window.scrollY / max : 0)
        setCondensed(window.scrollY > window.innerHeight * 0.6)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Which section is currently held in the upper half of the viewport
  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!targets.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  const goTo = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <motion.header
        className={`nav${condensed ? ' nav--condensed' : ''}`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
      >
        <button className="wordmark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="wordmark-main">CRD</span>
          <span className="wordmark-sub">Property Group</span>
        </button>

        {!isMobile && (
          <nav className="nav-links">
            {LINKS.map((l) => (
              <button
                key={l.id}
                className="nav-link"
                data-active={active === l.id}
                onClick={() => goTo(l.id)}
              >
                {l.label}
              </button>
            ))}
            <button className="nav-cta" onClick={() => goTo('contact')}>
              Enquire
            </button>
          </nav>
        )}

        {isMobile && (
          <button
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <span className={`nav-toggle-bars${open ? ' is-open' : ''}`}>
              <i />
              <i />
            </span>
          </button>
        )}

        <span className="nav-progress" aria-hidden="true">
          <span className="nav-progress-fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="menu"
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.id}
                className="menu-item"
                onClick={() => goTo(l.id)}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: 0.14 + i * 0.06, duration: 0.6, ease: EASE }}
              >
                <span className="menu-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="menu-title">{l.label}</span>
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
