import { motion } from 'framer-motion'
import { reveal } from '../../lib/motion'
import { useMagnetic } from '../../hooks/useMagnetic'

function CtaButton({ children, href, solid }) {
  const ref = useMagnetic()
  return (
    <a ref={ref} className={`btn${solid ? ' btn--solid' : ''}`} href={href}>
      {children}
    </a>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="contact-section" aria-label="Contact CRD Property Group">
      <div className="contact-media" aria-hidden="true">
        <img src="/img/chapters/ch-approach.jpg" alt="" loading="lazy" decoding="async" />
        <div className="contact-scrim" />
      </div>

      <div className="contact-inner">
        <motion.div {...reveal(0)} className="eyebrow">
          Boston, Massachusetts
        </motion.div>

        <motion.h2 {...reveal(0.1)} className="contact-headline">
          Your next chapter
          <br />
          starts here.
        </motion.h2>

        <motion.p {...reveal(0.2)} className="body-copy contact-body">
          Owners, buyers, sellers and partners — bring us the property,
          we'll bring the plan.
        </motion.p>

        <motion.div {...reveal(0.3)} className="contact-actions">
          <CtaButton solid href="mailto:partners@crdpropertygroup.com">
            Schedule a Private Tour
          </CtaButton>
          <CtaButton href="mailto:hello@crdpropertygroup.com">
            Request Property Details
          </CtaButton>
        </motion.div>

        <motion.div {...reveal(0.4)} className="contact-details">
          <a href="mailto:hello@crdpropertygroup.com">hello@crdpropertygroup.com</a>
          <span>+1 (617) 555-0148</span>
          <span>Boston, Massachusetts</span>
        </motion.div>
      </div>

      <div className="contact-foot">
        © CRD Property Group — Real Estate · Property Management · Investment
      </div>
    </section>
  )
}
