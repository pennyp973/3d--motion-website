import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '@react-three/drei'
import { journey } from '../../journey/journeyState'

// Cinematic curtain: counts up while the WebGL scene compiles,
// then parts to reveal the hall. Tracks real asset progress via
// drei's loading manager and never finishes before the first frame.
export default function Loader({ sceneReady }) {
  const { progress: assetProgress, active } = useProgress()
  const [counter, setCounter] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const elapsed = (now - start) / 1000
      // Simulated pacing (~1.8s) blended with real asset progress
      const simulated = Math.min(elapsed / 1.8, 1) * 100
      const real = active ? assetProgress : 100
      const target = Math.min(simulated, real)
      setCounter((prev) => Math.max(prev, target))
      if (target >= 100 && sceneReady) {
        setDone(true)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [assetProgress, active, sceneReady])

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => {
        journey.ready = true
      }, 350)
      return () => clearTimeout(t)
    }
  }, [done])

  // Failsafe: on very slow GPUs shader compilation can hold the first
  // frame for many seconds — never keep the overlay copy hostage.
  useEffect(() => {
    const t = setTimeout(() => {
      journey.ready = true
    }, 6000)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.2rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{ opacity: 1, letterSpacing: '0.55em' }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              fontWeight: 300,
              textTransform: 'uppercase',
              color: 'var(--gold)',
              paddingLeft: '0.55em',
            }}
          >
            CRD Property Group
          </motion.div>

          {/* hairline progress */}
          <div style={{ width: 'min(280px, 60vw)', height: 1, background: 'rgba(232,228,220,0.12)' }}>
            <motion.div
              style={{
                height: '100%',
                background: 'var(--gold)',
                transformOrigin: 'left',
                scaleX: counter / 100,
              }}
              animate={{ scaleX: counter / 100 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 300,
              fontSize: '0.9rem',
              color: 'var(--ink-faint)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.15em',
            }}
          >
            {String(Math.round(counter)).padStart(3, '0')}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
