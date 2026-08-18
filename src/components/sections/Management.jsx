import { motion } from 'framer-motion'
import { reveal } from '../../lib/motion'

const SERVICES = [
  'Tenant relations',
  'Leasing coordination',
  'Rent and payment oversight',
  'Maintenance and vendor coordination',
  'Inspections and property care',
  'Owner communication and reporting',
]

export default function Management() {
  return (
    <section id="management" className="section management-section" aria-label="Property Management">
      <div className="section-inner management-inner">
        <div className="management-copy">
          <motion.div {...reveal(0)} className="eyebrow">
            Property Management
          </motion.div>
          <motion.h2 {...reveal(0.08)} className="display-lg">
            Your property, operated with an ownership mindset.
          </motion.h2>
        </div>

        <div className="management-list">
          {SERVICES.map((label, i) => (
            <motion.div key={label} {...reveal(0.06 * i, 16, 0.6)} className="glass-card management-row">
              <span className="eyebrow" style={{ fontSize: '0.55rem', color: 'var(--ink-faint)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="management-row-label">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
