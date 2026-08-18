import { SectionHead, Headline, Rise, Frame } from '../ui/Primitives'

// Real CRD photography, laid out as an editorial spread rather than a
// uniform tile grid — the composition is what signals the price point.
const GALLERY = [
  { src: '/img/chapters/ch-exterior.jpg', label: 'New Construction' },
  { src: '/img/chapters/ch-kitchen.jpg', label: 'The Kitchen' },
  { src: '/img/chapters/ch-living.jpg', label: 'Living Spaces' },
  { src: '/img/chapters/ch-bedroom.jpg', label: 'Primary Suites' },
  { src: '/img/chapters/ch-bathroom.jpg', label: 'Primary Baths' },
  { src: '/img/chapters/ch-terrace.jpg', label: 'Outdoor Living' },
  { src: '/img/chapters/ch-plaque.jpg', label: 'Considered Detail' },
  { src: '/img/chapters/ch-garage.jpg', label: 'Garage & Storage' },
]

export default function Properties() {
  return (
    <section id="properties" className="section properties" aria-label="Properties">
      <div className="shell">
        <SectionHead index="02" label="Properties" />

        <div className="properties-head">
          <Headline lines={['A look inside', 'CRD residences.']} />
          <Rise delay={0.16} className="properties-intro">
            <p className="body-copy">
              Residences and multi-family assets across the Northeast —
              built, renovated and managed with the same attention
              throughout.
            </p>
          </Rise>
        </div>

        <div className="gallery">
          {GALLERY.map((item, i) => (
            <Frame
              key={item.src}
              src={item.src}
              alt={item.label}
              caption={item.label}
              index={String(i + 1).padStart(2, '0')}
              delay={(i % 3) * 0.08}
              priority={i < 2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
