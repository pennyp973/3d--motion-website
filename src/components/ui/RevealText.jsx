import { motion } from 'framer-motion'

// Masked line-by-line reveal. Each line rises out of an overflow-hidden
// wrapper — the classic cinematic title treatment.
export default function RevealText({
  lines = [],
  active = false,
  as = 'div',
  className = '',
  delay = 0,
  stagger = 0.09,
  duration = 1.1,
  y = '110%',
}) {
  const Tag = motion[as] ?? motion.div

  return (
    <Tag className={className} aria-label={lines.join(' ')}>
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden' }} aria-hidden="true">
          <motion.span
            style={{ display: 'block', willChange: 'transform' }}
            initial={{ y }}
            animate={active ? { y: '0%' } : { y }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// Soft fade-and-rise for body copy and small elements
export function FadeIn({ children, active, delay = 0, duration = 1.2, className = '', style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
