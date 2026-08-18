import { motion } from 'framer-motion'
import { settle } from '../../lib/motion'
import { Headline, Rise, Button } from '../ui/Primitives'

const PHONE_DISPLAY = '(781) 257-4696'
const PHONE_HREF = 'tel:+17812574696'
const EMAIL = 'cristalrijore@gmail.com'
const INSTAGRAM = 'cristalrijorealty'
const BROKERAGE = 'Cameron Real Estate Group'

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
              <span>Boston · Massachusetts North Shore</span>
            </div>
          </Rise>

          <Headline
            className="contact-headline"
            lines={['Your next chapter', 'starts here.']}
            delay={0.12}
          />

          <Rise delay={0.3}>
            <p className="body-copy contact-body">
              Buyers, sellers and investors — bring us the property,
              we'll bring the plan.
            </p>
          </Rise>

          <Rise delay={0.4}>
            <div className="contact-actions">
              <Button solid href={PHONE_HREF}>
                Call {PHONE_DISPLAY}
              </Button>
              <Button href={`mailto:${EMAIL}`}>Send an Email</Button>
            </div>
          </Rise>

          <Rise delay={0.5}>
            <div className="agent">
              <span className="agent-name">
                Cristal Rijo, <span className="agent-mark">REALTOR®</span>
              </span>
              <span className="agent-role">
                Real Estate Agent &amp; Investor · {BROKERAGE} · Se habla español
              </span>
            </div>
          </Rise>

          <Rise delay={0.58}>
            <dl className="contact-details">
              <div>
                <dt>Direct</dt>
                <dd>
                  <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </dd>
              </div>
              <div>
                <dt>Office</dt>
                <dd>
                  20C Del Carmine Street
                  <br />
                  Wakefield, MA 01880
                </dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a
                    href={`https://instagram.com/${INSTAGRAM}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{INSTAGRAM}
                  </a>
                </dd>
              </div>
            </dl>
          </Rise>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <span className="footer-mark">CRD</span>
            <span className="footer-mark-sub">Property Group</span>
            <p className="footer-line">
              Real estate and investment across Boston and the
              Massachusetts North Shore. Buyers, sellers and investors —
              with Spanish-speaking services available.
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
            <span className="footer-agent">Cristal Rijo, REALTOR®</span>
            <span>Brokerage: {BROKERAGE}</span>
            <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{INSTAGRAM}
            </a>
            <span>20C Del Carmine Street, Wakefield, MA 01880</span>
          </div>
        </div>

        <div className="shell footer-base">
          <span>© {new Date().getFullYear()} CRD Property Group</span>
          <span>Brokerage: {BROKERAGE}</span>
          <span>Equal Housing Opportunity</span>
          <span>Buyers · Sellers · Real Estate Investment</span>
        </div>
      </footer>
    </>
  )
}
