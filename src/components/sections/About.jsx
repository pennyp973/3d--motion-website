import { motion } from 'framer-motion'
import { reveal } from '../../lib/motion'

export default function About() {
  return (
    <section id="about" className="section about-section" aria-label="The CRD Approach">
      <div className="section-inner about-inner">
        <motion.div {...reveal(0)} className="eyebrow">
          The CRD Approach
        </motion.div>
        <motion.h2 {...reveal(0.08)} className="display-xl about-headline">
          Build. Manage. Invest. Grow.
        </motion.h2>
        <motion.p {...reveal(0.16)} className="body-copy about-body">
          From ground-up development to decades of asset performance —
          one accountable partner across the entire life of a property.
          CRD connects the people who build, operate and hold real
          estate, so nothing gets lost in the handoff between them.
        </motion.p>
      </div>
    </section>
  )
}
