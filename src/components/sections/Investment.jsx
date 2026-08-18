import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { curtainV, fadeV, IN_VIEW_EARLY } from '../../lib/motion'
import { SectionHead, Headline, Rise, Button } from '../ui/Primitives'

// IMPORTANT — content constraint, not a style preference:
// no fabricated portfolio returns, no fabricated occupancy statistics,
// no guaranteed appreciation, no guaranteed cash flow, no promises of
// profit. Every benefit below is written as a possibility, never a
// promise. Keep that pattern if you edit this copy.
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
    // Play only while on screen — the film should never burn battery
    // in a tab nobody is looking at.
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
    <section
      id="investment"
      className="section investment"
      aria-label="Investment and New Construction"
    >
      <div className="shell">
        <SectionHead index="04" label="Multifamily · New Construction · Long-Term Value" />

        <div className="investment-top">
          <Headline className="display-xl" lines={['Own the asset.', 'Build the future.']} />
          <Rise delay={0.18} className="investment-lede">
            <p className="body-copy">
              Multifamily and new-construction real estate can combine
              recurring rental income, operational scale and long-term
              ownership value. CRD helps clients look beyond the building
              itself — evaluating the property, the operating plan, the
              resident experience and the opportunities that can
              strengthen an asset over time.
            </p>
            <div className="investment-actions">
              <Button solid href="#contact">
                Explore Investment Opportunities
              </Button>
              <Button href="#contact">Build With CRD</Button>
            </div>
          </Rise>
        </div>

        <motion.div
          className="investment-stage"
          initial="rest"
          whileInView="show"
          viewport={IN_VIEW_EARLY}
        >
          <motion.div className="investment-clip" variants={curtainV(0.1)}>
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
          <motion.span className="investment-frame" aria-hidden="true" variants={fadeV(0.9)} />
        </motion.div>

        <div className="benefit-grid">
          {BENEFITS.map((b, i) => (
            <Rise key={b.n} delay={(i % 3) * 0.08} y={22} duration={0.75}>
              <article className="benefit">
                <span className="benefit-n">{b.n}</span>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-body">{b.body}</p>
              </article>
            </Rise>
          ))}
        </div>

        <Rise delay={0.1}>
          <p className="investment-note">
            Every investment is different. CRD evaluates each property on
            its actual condition, financing, market, operating costs and
            business plan.
          </p>
        </Rise>
      </div>
    </section>
  )
}
