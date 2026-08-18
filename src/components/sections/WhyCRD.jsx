import { SectionHead, Headline, Rise } from '../ui/Primitives'

const PILLARS = [
  ['Real-estate execution', 'Sourcing, diligence and closing, handled end to end.'],
  ['Property operations', 'Day-to-day management that protects the asset.'],
  ['Ownership perspective', 'Decisions made the way an owner would make them.'],
  ['Long-term thinking', 'Positioned for the decade, not the quarter.'],
]

export default function WhyCRD() {
  return (
    <section className="section why" aria-label="Why CRD">
      <div className="shell">
        <SectionHead index="05" label="Why CRD" />

        <div className="why-head">
          <Headline className="display-xl" lines={['One property.', 'One clear plan.']} />
          <Rise delay={0.16} className="why-intro">
            <p className="body-copy">
              CRD connects transaction thinking with day-to-day property
              operations so owners, buyers and partners can make
              decisions with the whole asset in view.
            </p>
          </Rise>
        </div>

        <div className="pillar-grid">
          {PILLARS.map(([label, note], i) => (
            <Rise key={label} delay={0.08 * i} className="pillar">
              <span className="pillar-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="pillar-label">{label}</span>
              <span className="pillar-note">{note}</span>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  )
}
