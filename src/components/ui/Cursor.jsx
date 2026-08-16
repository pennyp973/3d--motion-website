import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Gold dot with a lagging halo ring. Desktop / fine pointers only.
export default function Cursor() {
  const dotRef = useRef()
  const ringRef = useRef()

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPos = { ...pos }
    let hovering = false
    let visible = false

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.4 })
      }
      const target = e.target
      hovering = !!target.closest('a, button, [data-cursor]')
    }

    const onLeave = () => {
      visible = false
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
    }

    const update = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.14
      ringPos.y += (pos.y - ringPos.y) * 0.14
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
      const scale = hovering ? 1.8 : 1
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${scale})`
      ring.style.borderColor = hovering ? 'rgba(201,169,98,0.9)' : 'rgba(201,169,98,0.4)'
    }

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    gsap.ticker.add(update)
    document.documentElement.classList.add('custom-cursor')

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      gsap.ticker.remove(update)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'var(--gold-bright)',
          zIndex: 90,
          pointerEvents: 'none',
          opacity: 0,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: '1px solid rgba(201,169,98,0.4)',
          zIndex: 90,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'border-color 0.3s ease',
        }}
      />
    </>
  )
}
