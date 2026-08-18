import { motion } from 'framer-motion'
import { reveal, revealScale } from '../../lib/motion'

// Real CRD photography — a look at the kind of spaces CRD builds and
// manages, not a listing sheet for one specific address.
const GALLERY = [
  { src: '/img/chapters/ch-exterior.jpg', label: 'New Construction' },
  { src: '/img/chapters/ch-kitchen.jpg', label: 'The Kitchen' },
  { src: '/img/chapters/ch-living.jpg', label: 'Living Spaces' },
  { src: '/img/chapters/ch-bedroom.jpg', label: 'Primary Suites' },
  { src: '/img/chapters/ch-bathroom.jpg', label: 'Primary Baths' },
  { src: '/img/chapters/ch-terrace.jpg', label: 'Outdoor Living' },
  { src: '/img/chapters/ch-garage.jpg', label: 'Garage & Storage' },
  { src: '/img/chapters/ch-plaque.jpg', label: 'Considered Detail' },
]

export default function Properties() {
  return (
    <section id="properties" className="section properties-section" aria-label="Properties">
      <div className="section-inner">
        <motion.div {...reveal(0)} className="eyebrow">
          Properties
        </motion.div>
        <motion.h2 {...reveal(0.08)} className="display-lg">
          A look inside CRD residences.
        </motion.h2>
        <motion.p {...reveal(0.16)} className="body-copy" style={{ marginTop: '1.2rem' }}>
          Residences and multi-family assets across the Northeast — built,
          renovated and managed with the same attention throughout.
        </motion.p>

        <div className="properties-grid">
          {GALLERY.map((item, i) => (
            <motion.figure
              key={item.src}
              className="property-card"
              {...revealScale(0.05 * (i % 4))}
            >
              <img src={item.src} alt={item.label} loading="lazy" decoding="async" />
              <figcaption>{item.label}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
