import { SectionHead, Headline, Rise } from '../ui/Primitives'

const DISCIPLINES = [
  ['Buyers & Sellers', 'Representation across Boston and the North Shore.'],
  ['Management', 'Full-service operations for owners who expect performance.'],
  ['Investment', 'Ownership-minded capital and long-horizon strategy.'],
]

export default function About() {
  return (
    <section id="about" className="section about" aria-label="The CRD Approach">
      <div className="shell">
        <SectionHead index="01" label="The CRD Approach" />

        <div className="about-grid">
          <div className="about-lead">
            <Headline
              className="display-xl"
              lines={['Build. Manage.', 'Invest. Grow.']}
            />
          </div>

          <div className="about-side">
            <Rise delay={0.1}>
              <p className="body-copy">
                From ground-up development to decades of asset
                performance — one accountable partner across the entire
                life of a property. CRD connects the people who build,
                operate and hold real estate, so nothing is lost in the
                handoff between them.
              </p>
            </Rise>

            <div className="discipline-list">
              {DISCIPLINES.map(([title, note], i) => (
                <Rise key={title} delay={0.18 + i * 0.09} className="discipline">
                  <span className="discipline-title">{title}</span>
                  <span className="discipline-note">{note}</span>
                </Rise>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
