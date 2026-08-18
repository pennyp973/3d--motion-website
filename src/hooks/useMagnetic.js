import { useEffect, useRef } from 'react'

// Buttons lean very slightly toward the cursor as it nears them, then
// release. Subtle enough to register as quality rather than as a
// trick — and disabled entirely for coarse pointers and reduced motion.
export function useMagnetic(strength = 0.22, radius = 90) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf
    const target = { x: 0, y: 0 }
    const shown = { x: 0, y: 0 }
    let running = false

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const reach = Math.max(r.width, r.height) / 2 + radius
      if (dist < reach) {
        const falloff = 1 - dist / reach
        target.x = dx * strength * falloff
        target.y = dy * strength * falloff
      } else {
        target.x = 0
        target.y = 0
      }
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    const tick = () => {
      shown.x += (target.x - shown.x) * 0.16
      shown.y += (target.y - shown.y) * 0.16
      el.style.transform = `translate3d(${shown.x.toFixed(2)}px, ${shown.y.toFixed(2)}px, 0)`
      if (Math.abs(shown.x - target.x) < 0.05 && Math.abs(shown.y - target.y) < 0.05 && target.x === 0 && target.y === 0) {
        el.style.transform = ''
        running = false
        return
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [strength, radius])

  return ref
}
