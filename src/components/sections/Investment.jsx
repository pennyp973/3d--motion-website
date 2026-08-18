import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { reveal, revealScale } from '../../lib/motion'
import { useMagnetic } from '../../hooks/useMagnetic'

function CtaButton({ children, href, solid }) {
  const ref = useMagnetic()
  return (
    <a ref={ref} className={`btn${solid ? ' btn--solid' : ''}`} href={href}>
      {children}
    </a>
  )
}

// IMPORTANT: no fake portfolio returns, no fake occupancy statistics,
// no guaranteed appreciation, no guaranteed cash flow, no promises of
// profit. Every line here is deliberately qualified.
const BENEFITS = [
  {
    n: '01',
    title: 'Multiple income streams',
    body: 'With multiple units under one property, ownership is less dependent on a single tenant and can create several sources of rental income.',
  },
  {
    n: '02',
    title: 'Operating scale',
    body: 'Multiple units can share major property expenses, systems, land and management infrastructure — creating efficiencies that single-unit ownership does not always provide.',
  },
  {
    n: '03',
    title: 'Equity & value creation',
    body: 'Mortgage principal paydown, strategic improvements and potential market appreciation can contribute to long-term equity growth. Appreciation is never guaranteed.',
  },
  {
    n: '04',
    title: 'New-construction advantage',
    body: 'New construction can offer modern systems, current building standards, improved energy efficiency, lower near-term maintenance needs and applicable builder or manufacturer warranties.',
  },
  {
    n: '05',
    title: 'Better control of the asset',
    body: 'Owners can influence renovations, leasing standards, maintenance strategy, resident experience and long-term positioning of the property.',
  },
  {
    n: '06',
    title: 'Flexible long-term strategy',
    body: 'Depending on the property and financing, owners may choose to hold, improve, refinance or sell as their goals and market conditions evolve.',
  },
]

export default function Investment() {
  const videoRef = useRef()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.2 }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <section id="investment" className="section investment-section" aria-label="Investment and New Construction">
      <div className="section-inner">
        <motion.div {...reveal(0)} className="eyebrow">
          Multifamily · New Construction · Long-Term Value
        </motion.div>
        <motion.h2 {...reveal(0.08)} className="display-lg investment-headline">
          Own the asset. Build the future.
        </motion.h2>

        <div className="investment-layout">
          <motion.div {...revealScale(0.1)} className="investment-video-wrap">
            <video
              ref={videoRef}
              className="investment-video"
              src="/video/crd-investment-web.mp4"
              poster="/video/crd-investment-poster.jpg"
              muted
              loop
              playsInline
              preload="metadata"
            />
          </motion.div>

          <div className="investment-panel">
            <motion.p {...reveal(0.14)} className="body-copy">
              Multifamily and new-construction real estate can combine
              recurring rental income, operational scale and long-term
              ownership value. CRD helps clients look beyond the building
              itself — evaluating the property, the operating plan, the
              resident experience and the opportunities that can
              strengthen an asset over time.
            </motion.p>

            <motion.div {...reveal(0.2)} className="investment-actions">
              <CtaButton solid href="#contact">
                Explore Investment Opportunities
              </CtaButton>
              <CtaButton href="#contact">Build With CRD</CtaButton>
            </motion.div>
          </div>
        </div>

        <div className="benefit-grid">
          {BENEFITS.map((b, i) => (
            <motion.div key={b.n} {...reveal(0.05 * i, 18, 0.6)} className="glass-card benefit-card">
              <div className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--gold)' }}>
                {b.n}
              </div>
              <div className="benefit-title">{b.title}</div>
              <p className="benefit-body">{b.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...reveal(0.1)} className="investment-disclaimer">
          Every investment is different. CRD evaluates each property on
          its actual condition, financing, market, operating costs and
          business plan.
        </motion.p>
      </div>
    </section>
  )
}
