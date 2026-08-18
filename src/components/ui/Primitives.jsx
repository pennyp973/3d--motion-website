import { motion } from 'framer-motion'
import {
  fadeUp,
  lineReveal,
  curtainV,
  settleV,
  fadeV,
  drawLine,
  IN_VIEW_EARLY,
} from '../../lib/motion'
import { useMagnetic } from '../../hooks/useMagnetic'

/* ——— Section marker: 01 ——————— The Approach ——— */
export function SectionHead({ index, label }) {
  return (
    <div className="sec-head">
      <motion.span className="sec-num" {...fadeUp(0, 12, 0.7)}>
        {index}
      </motion.span>
      <motion.span className="sec-rule" {...drawLine(0.1)} />
      <motion.span className="sec-label" {...fadeUp(0.16, 12, 0.7)}>
        {label}
      </motion.span>
    </div>
  )
}

/* ——— Headline whose lines lift out of their own masks ———
   The in-view trigger has to live on the heading, not on each line:
   an IntersectionObserver on the line itself never fires, because the
   mask's overflow:hidden clips the line out of its own intersection
   rect while it is parked below. Parent observes, children inherit. */
export function Headline({ lines, className = 'display-lg', delay = 0, as = 'h2' }) {
  const Tag = motion[as] ?? motion.h2
  return (
    <Tag
      className={className}
      aria-label={lines.join(' ')}
      initial="rest"
      whileInView="lift"
      viewport={{ once: true, amount: 0.2 }}
    >
      {lines.map((line, i) => (
        <span className="line-mask" key={i} aria-hidden="true">
          <motion.span className="line-inner" variants={lineReveal(delay + i * 0.11)}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ——— Generic rise-and-settle wrapper ——— */
export function Rise({ children, delay = 0, y = 26, duration = 0.9, className, style }) {
  return (
    <motion.div className={className} style={style} {...fadeUp(delay, y, duration)}>
      {children}
    </motion.div>
  )
}

/* ——— Photography: curtain opens, image settles out of a push-in ———
   The figure carries the trigger and stays unclipped; the clip lives on
   an inner layer, so the reveal can actually fire. */
export function Frame({ src, alt, caption, index, className = '', delay = 0, priority }) {
  return (
    <motion.figure
      className={`frame ${className}`}
      initial="rest"
      whileInView="show"
      viewport={IN_VIEW_EARLY}
    >
      <motion.span className="frame-clip" variants={curtainV(delay)}>
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          variants={settleV(delay)}
        />
        <span className="frame-veil" aria-hidden="true" />
      </motion.span>
      {caption && (
        <motion.figcaption className="frame-caption" variants={fadeV(delay + 0.5)}>
          {index && <span className="frame-index">{index}</span>}
          <span className="frame-label">{caption}</span>
        </motion.figcaption>
      )}
    </motion.figure>
  )
}

/* ——— Buttons: a gold field sweeps across on approach ——— */
export function Button({ children, href, solid, onClick }) {
  const ref = useMagnetic(0.18, 80)
  const cls = `btn${solid ? ' btn--solid' : ''}`
  const inner = (
    <>
      <span className="btn-fill" aria-hidden="true" />
      <span className="btn-label">{children}</span>
      <svg className="btn-arrow" viewBox="0 0 22 8" aria-hidden="true">
        <path d="M0 4h20M17 1l3.2 3L17 7" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </>
  )
  if (href) {
    return (
      <a ref={ref} className={cls} href={href}>
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref} className={cls} onClick={onClick}>
      {inner}
    </button>
  )
}
