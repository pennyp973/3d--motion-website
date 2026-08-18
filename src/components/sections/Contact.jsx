import { motion } from 'framer-motion'
import { settle } from '../../lib/motion'
import { Headline, Rise, Button } from '../ui/Primitives'

export default function Contact() {
  return (
    <>
      <section id="contact" className="contact" aria-label="Contact CRD Property Group">
        <div className="contact-media" aria-hidden="true">
          <motion.img
            src="/img/chapters/ch-approach.jpg"
            alt=""
            loading="lazy"
            decoding="async"
            {...settle(0, 2)}
          />
          <div className="contact-scrim" />
        </div>

        <div className="contact-inner">
          <Rise duration={1}>
            <div className="hero-eyebrow contact-eyebrow">
              <span className="hero-eyebrow-rule" />
              <span>Boston, Massachusetts</span>
            </div>
          </Rise>

          <Headline
            className="contact-headline"
            lines={['Your next chapter', 'starts here.']}
            delay={0.12}
          />

          <Rise delay={0.3}>
            <p className="body-copy contact-body">
              Owners, buyers, sellers and partners — bring us the
              property, we'll bring the plan.
            </p>
          </Rise>

          <Rise delay={0.4}>
            <div className="contact-actions">
              <Button solid href="mailto:partners@crdpropertygroup.com">
                Schedule a Private Tour
              </Button>
              <Button href="mailto:hello@crdpropertygroup.com">
                Request Property Details
              </Button>
            </div>
          </Rise>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <span className="footer-mark">CRD</span>
            <span className="footer-mark-sub">Property Group</span>
            <p className="footer-line">
              Real estate, property management and investment across
              Massachusetts and the Northeast.
            </p>
          </div>

          <div className="footer-col">
            <span className="footer-head">Explore</span>
            <a href="#about">The Approach</a>
            <a href="#properties">Properties</a>
            <a href="#management">Management</a>
            <a href="#investment">Investment</a>
          </div>

          <div className="footer-col">
            <span className="footer-head">Contact</span>
            <a href="mailto:hello@crdpropertygroup.com">hello@crdpropertygroup.com</a>
            <a href="tel:+16175550148">+1 (617) 555-0148</a>
            <span>Boston, Massachusetts</span>
          </div>
        </div>

        <div className="shell footer-base">
          <span>© {new Date().getFullYear()} CRD Property Group</span>
          <span>Real Estate · Property Management · Investment</span>
        </div>
      </footer>
    </>
  )
}
