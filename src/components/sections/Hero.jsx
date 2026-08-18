import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../../lib/motion'
import { Button } from '../ui/Primitives'

// The brand film. It plays; the visitor does nothing to earn it.
// Type enters in one composed sequence over the top.
export default function Hero() {
  const [on, setOn] = useState(false)
  const videoRef = useRef()

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 180)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      video.removeAttribute('loop')
    }
  }, [])

  const line = (i) => ({
    initial: { y: '112%' },
    animate: on ? { y: '0%' } : { y: '112%' },
    transition: { duration: 1.25, delay: 0.5 + i * 0.12, ease: EASE },
  })

  const soft = (d) => ({
    initial: { opacity: 0, y: 18 },
    animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 1, delay: d, ease: EASE },
  })

  return (
    <section id="hero" className="hero" aria-label="CRD Property Group">
      <div className="hero-media" aria-hidden="true">
        <motion.video
          ref={videoRef}
          className="hero-video"
          src="/video/crd-drone-web.mp4"
          poster="/video/crd-drone-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease: EASE }}
        />
        <div className="hero-scrim" />
      </div>

      <div className="hero-inner">
        <motion.div className="hero-eyebrow" {...soft(0.25)}>
          <span className="hero-eyebrow-rule" />
          <span>Massachusetts · Real Estate · Property Management</span>
        </motion.div>

        <h1 className="hero-headline" aria-label="Property. Elevated.">
          <span className="line-mask" aria-hidden="true">
            <motion.span className="line-inner" {...line(0)}>
              Property.
            </motion.span>
          </span>
          <span className="line-mask" aria-hidden="true">
            <motion.span className="line-inner hero-em" {...line(1)}>
              Elevated.
            </motion.span>
          </span>
        </h1>

        <motion.p className="hero-support" {...soft(1.15)}>
          CRD Property Group brings real-estate execution, property
          operations and long-term ownership thinking together under one
          roof.
        </motion.p>

        <motion.div className="hero-actions" {...soft(1.32)}>
          <Button solid href="#properties">
            Explore Properties
          </Button>
          <Button href="#contact">Work With CRD</Button>
        </motion.div>
      </div>

      <motion.div className="hero-cue" aria-hidden="true" {...soft(1.6)}>
        <span className="hero-cue-text">Scroll</span>
        <span className="hero-cue-track">
          <span className="hero-cue-dot" />
        </span>
      </motion.div>
    </section>
  )
}
