import { useEffect, useRef } from 'react'

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
    let raf

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      hovering = !!e.target.closest('a, button, [data-cursor]')
    }

    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.14
      ringPos.y += (pos.y - ringPos.y) * 0.14
      dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
      const scale = hovering ? 1.8 : 1
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${scale})`
      ring.style.borderColor = hovering ? 'rgba(201,169,98,0.9)' : 'rgba(201,169,98,0.4)'
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)
    document.documentElement.classList.add('custom-cursor')

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
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
          transition: 'opacity 0.4s ease',
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
          transition: 'opacity 0.4s ease, border-color 0.3s ease',
        }}
      />
    </>
  )
}
