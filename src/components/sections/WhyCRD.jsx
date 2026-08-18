import { motion } from 'framer-motion'
import { reveal } from '../../lib/motion'

const PILLARS = [
  'Real-estate execution',
  'Property operations',
  'Ownership perspective',
  'Long-term thinking',
]

export default function WhyCRD() {
  return (
    <section className="section why-section" aria-label="Why CRD">
      <div className="section-inner">
        <motion.div {...reveal(0)} className="eyebrow">
          Why CRD
        </motion.div>
        <motion.h2 {...reveal(0.08)} className="display-lg">
          One property. One clear plan.
        </motion.h2>
        <motion.p {...reveal(0.16)} className="body-copy" style={{ marginTop: '1.2rem' }}>
          CRD connects transaction thinking with day-to-day property
          operations so owners, buyers and partners can make decisions
          with the whole asset in view.
        </motion.p>

        <div className="pillar-grid">
          {PILLARS.map((label, i) => (
            <motion.div key={label} {...reveal(0.08 * i, 20, 0.7)} className="pillar">
              <span className="pillar-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="pillar-label">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
