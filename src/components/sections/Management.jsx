import { SectionHead, Headline, Rise, Frame } from '../ui/Primitives'

const SERVICES = [
  ['Tenant relations', 'Responsive, respectful, retention-focused.'],
  ['Leasing coordination', 'Listing, showing, screening and turnover.'],
  ['Rent and payment oversight', 'Collections, escalations and owner statements.'],
  ['Maintenance and vendor coordination', 'Scheduled upkeep and trusted trades.'],
  ['Inspections and property care', 'Routine walkthroughs and condition reporting.'],
  ['Owner communication and reporting', 'One point of contact, nothing withheld.'],
]

export default function Management() {
  return (
    <section id="management" className="section management" aria-label="Property Management">
      <div className="shell">
        <SectionHead index="03" label="Property Management" />

        <div className="management-grid">
          <div className="management-aside">
            <Headline lines={['Your property,', 'operated with an', 'ownership mindset.']} />
            <Frame
              src="/img/chapters/ch-entry.jpg"
              alt="Entry of a CRD-managed residence"
              className="management-figure"
              delay={0.12}
            />
          </div>

          <ol className="service-list">
            {SERVICES.map(([title, note], i) => (
              <Rise key={title} delay={0.06 * i} y={18} duration={0.7}>
                <li className="service-row">
                  <span className="service-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="service-body">
                    <span className="service-title">{title}</span>
                    <span className="service-note">{note}</span>
                  </span>
                </li>
              </Rise>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
