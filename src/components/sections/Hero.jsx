import { useEffect, useRef, useState } from 'react'
import RevealText, { FadeIn } from '../ui/RevealText'
import { useMagnetic } from '../../hooks/useMagnetic'

function CtaButton({ children, href, solid }) {
  const ref = useMagnetic()
  return (
    <a ref={ref} className={`btn${solid ? ' btn--solid' : ''}`} href={href}>
      {children}
    </a>
  )
}

// Full-screen brand film. Plays straight through — no scroll-scrubbing,
// no pin, no wait. The visitor lands on the site already looking at it.
export default function Hero() {
  const [active, setActive] = useState(false)
  const videoRef = useRef()

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 120)
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

  return (
    <section id="hero" className="hero" aria-label="CRD Property Group">
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          src="/video/crd-drone-web.mp4"
          poster="/video/crd-drone-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="hero-scrim" />
      </div>

      <div className="hero-inner">
        <FadeIn active={active} delay={0.1}>
          <div className="eyebrow">Massachusetts · Real Estate · Property Management</div>
        </FadeIn>

        <RevealText
          as="h1"
          className="hero-headline"
          active={active}
          delay={0.32}
          stagger={0.1}
          lines={['Property.', 'Elevated.']}
        />

        <FadeIn active={active} delay={0.85}>
          <p className="body-copy hero-support">
            CRD Property Group brings real-estate execution, property
            operations and long-term ownership thinking together under
            one roof.
          </p>
        </FadeIn>

        <FadeIn active={active} delay={1.05}>
          <div className="hero-actions">
            <CtaButton solid href="#properties">
              Explore Properties
            </CtaButton>
            <CtaButton href="#contact">Work With CRD</CtaButton>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
