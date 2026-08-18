import { motion } from 'framer-motion'
import { PROPERTY } from '../../journey/rooms'
import { useMagnetic } from '../../hooks/useMagnetic'

// ————————————————————————————————————————————————————————————————
// ClosingSection — the invitation.
//
// The camera has left the site and come back to rest in front of the
// house at dusk, where the journey began. Everything resolves here:
// the address, the ask, and the two ways to start.
// ————————————————————————————————————————————————————————————————

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] },
})

function CtaButton({ children, href, solid }) {
  const ref = useMagnetic()
  return (
    <a ref={ref} className={`btn${solid ? ' btn--solid' : ''}`} href={href}>
      {children}
    </a>
  )
}

export default function ClosingSection() {
  return (
    <section id="closing" className="closing" aria-label="Contact CRD Property Group">
      <div className="closing-media" aria-hidden="true">
        <img src="/img/chapters/ch-approach.jpg" alt="" loading="lazy" decoding="async" />
        <div className="closing-scrim" />
      </div>

      <div className="closing-inner">
        <motion.div {...rise(0)} className="eyebrow">
          {PROPERTY.location}
        </motion.div>

        <motion.h2 {...rise(0.12)} className="closing-headline">
          Your next chapter
          <br />
          starts here.
        </motion.h2>

        <motion.p {...rise(0.24)} className="body-copy closing-body">
          Owners, buyers, sellers and partners — bring us the property,
          we'll bring the plan.
        </motion.p>

        <motion.div {...rise(0.36)} className="closing-actions">
          <CtaButton solid href="mailto:partners@crdpropertygroup.com">
            Schedule a Private Tour
          </CtaButton>
          <CtaButton href="mailto:hello@crdpropertygroup.com">
            Request Property Details
          </CtaButton>
        </motion.div>

        <motion.div {...rise(0.48)} className="closing-details">
          <a href="mailto:hello@crdpropertygroup.com">hello@crdpropertygroup.com</a>
          <span>+1 (617) 555-0148</span>
          <span>Boston, Massachusetts</span>
        </motion.div>
      </div>

      <div className="closing-foot">
        © CRD Property Group — Real Estate · Property Management · Investment
      </div>
    </section>
  )
}
