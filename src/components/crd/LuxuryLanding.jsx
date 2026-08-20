import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import '../../styles/luxuryLanding.css'

const ease = [0.16, 1, 0.3, 1]

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
}

function GlassButton({ href, children, solid = false }) {
  const [glow, setGlow] = useState({ x: 50, y: 50 })

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setGlow({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <a
      className={`lux-glass-btn ${solid ? 'lux-glass-btn--solid' : ''}`}
      href={href}
      onMouseMove={handleMove}
      style={{ '--glow-x': `${glow.x}%`, '--glow-y': `${glow.y}%` }}
    >
      <span className="lux-glass-btn__gloss" />
      <span className="lux-glass-btn__label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <span className="lux-glass-btn__arrow" aria-hidden="true">
        <span>↗</span><span>↗</span>
      </span>
    </a>
  )
}

function AutoVideo({ src, className = '', rate = 1, poster }) {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const setRate = () => { video.playbackRate = rate }
    video.addEventListener('loadedmetadata', setRate)
    setRate()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.12 },
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.removeEventListener('loadedmetadata', setRate)
    }
  }, [rate])

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      className="lux-nav-wrap"
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease }}
    >
      <nav className="lux-nav">
        <a href="#top" className="lux-brand" aria-label="CRD Property Group home">
          <span className="lux-brand__mark">CRD</span>
          <span className="lux-brand__name">Property Group</span>
        </a>

        <div className="lux-nav__links">
          <a href="#approach">About</a>
          <a href="#services">Services</a>
          <a href="#investment">Invest</a>
          <a href="#contact">Contact</a>
        </div>

        <a className="lux-nav__cta" href="#contact">
          <span>Work with CRD</span><span>↗</span>
        </a>

        <button
          type="button"
          className="lux-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
      </nav>

      {open && (
        <motion.div
          className="lux-mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          {['approach', 'services', 'investment', 'contact'].map((item) => (
            <a key={item} href={`#${item}`} onClick={() => setOpen(false)}>
              {item === 'approach' ? 'About' : item}
            </a>
          ))}
        </motion.div>
      )}
    </motion.header>
  )
}

const benefits = [
  ['Multiple income sources', 'Several units can spread rental income across more than one tenant.'],
  ['Operating scale', 'Multiple units under one roof can create efficiencies in management and maintenance.'],
  ['Value creation', 'Operations, improvements and market appreciation can contribute to long-term asset value.'],
  ['New-construction control', 'Modern systems and current layouts can provide more control over the finished product.'],
]

const services = [
  ['01', 'Buy & Sell', 'Strategic representation built around the property, the market and your next move.'],
  ['02', 'Property Management', 'Ownership-minded operations that protect the resident experience and the asset.'],
  ['03', 'Multifamily Investment', 'A disciplined lens on income-producing properties and long-term ownership.'],
  ['04', 'New Construction', 'A modern path from opportunity through planning, delivery and long-term value.'],
]

export default function LuxuryLanding() {
  return (
    <main className="lux-site" id="top">
      <Nav />

      <section className="lux-hero" aria-label="CRD Property Group introduction">
        <AutoVideo
          src="/video/crd-drone.mp4"
          poster="/video/crd-hero-poster.jpg"
          className="lux-hero__video"
          rate={0.8}
        />
        <div className="lux-hero__wash" />
        <div className="lux-hero__mesh" />

        <motion.div
          className="lux-hero__content"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.p className="lux-kicker" variants={reveal}>
            Massachusetts · Real Estate · Property Management · Investment
          </motion.p>

          <motion.h1 className="lux-hero__title" variants={reveal}>
            Property.<br />
            <em>Elevated.</em>
          </motion.h1>

          <motion.p className="lux-hero__copy" variants={reveal}>
            A modern property group connecting real estate, management and investment strategy through one refined ownership experience.
          </motion.p>

          <motion.div className="lux-hero__actions" variants={reveal}>
            <GlassButton href="#investment" solid>Explore investment</GlassButton>
            <GlassButton href="#contact">Work with CRD</GlassButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="lux-hero__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.15 }}
        >
          <span>Scroll to explore</span>
          <div className="lux-scroll-line"><span /></div>
          <span>CRD / Massachusetts</span>
        </motion.div>
      </section>

      <section className="lux-manifesto" id="approach">
        <motion.div
          className="lux-manifesto__grid"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div variants={reveal}>
            <p className="lux-kicker">The CRD approach</p>
            <h2>Built around the asset.<br /><em>Focused on the outcome.</em></h2>
          </motion.div>
          <motion.div className="lux-manifesto__copy" variants={reveal}>
            <p>CRD brings the transaction, the property and the long-term ownership perspective into one conversation.</p>
            <p>The experience is cinematic when it matters and direct when decisions need to be made.</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="lux-services" id="services">
        <div className="lux-section-head">
          <p className="lux-kicker">Capabilities</p>
          <h2>One group.<br /><em>Four ways forward.</em></h2>
        </div>

        <div className="lux-services__list">
          {services.map(([number, title, copy], index) => (
            <motion.article
              key={title}
              className="lux-service-row"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: index * 0.06, ease }}
            >
              <span className="lux-service-row__number">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span className="lux-service-row__arrow">↗</span>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="lux-investment" id="investment">
        <div className="lux-investment__sticky">
          <AutoVideo
            src="/video/crd-investment.mp4"
            poster="/video/crd-build-poster.jpg"
            className="lux-investment__video"
            rate={0.9}
          />
          <div className="lux-investment__wash" />

          <motion.div
            className="lux-investment__content"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.p className="lux-kicker" variants={reveal}>Multifamily & new construction</motion.p>
            <motion.h2 variants={reveal}>Own more than a property.<br /><em>Build an asset.</em></motion.h2>
            <motion.p className="lux-investment__lead" variants={reveal}>
              Multifamily ownership can combine several rent streams, operating scale and long-term value creation in one physical asset. New construction adds another path through modern systems, current layouts and greater control over what gets built.
            </motion.p>

            <motion.div className="lux-benefits" variants={stagger}>
              {benefits.map(([title, copy]) => (
                <motion.article key={title} className="lux-benefit" variants={reveal}>
                  <span className="lux-benefit__dot" />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </motion.article>
              ))}
            </motion.div>

            <motion.div variants={reveal}>
              <GlassButton href="#contact" solid>Discuss an opportunity</GlassButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="lux-ownership">
        <motion.div
          className="lux-ownership__panel"
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, ease }}
        >
          <p className="lux-kicker">Property management</p>
          <h2>The closing is not the end.<br /><em>It is where ownership begins.</em></h2>
          <p>From day-to-day operations to the resident experience and long-term property condition, management should serve the asset as carefully as the acquisition itself.</p>
          <GlassButton href="#contact">Explore management</GlassButton>
        </motion.div>
      </section>

      <section className="lux-contact" id="contact">
        <motion.div
          className="lux-contact__inner"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <motion.p className="lux-kicker" variants={reveal}>Start the conversation</motion.p>
          <motion.h2 variants={reveal}>A better property decision<br /><em>starts with a clearer view.</em></motion.h2>
          <motion.p variants={reveal}>Buying, selling, managing, investing or building — bring CRD into the conversation early.</motion.p>
          <motion.div variants={reveal}>
            <GlassButton href="mailto:hello@crdpropertygroup.com" solid>Contact CRD</GlassButton>
          </motion.div>
        </motion.div>

        <footer className="lux-footer">
          <span>CRD Property Group</span>
          <span>Massachusetts</span>
          <span>Real Estate · Management · Investment</span>
        </footer>
      </section>
    </main>
  )
}
