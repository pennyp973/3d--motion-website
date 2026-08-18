import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ROOMS, roomTarget } from '../../journey/rooms'
import { journey } from '../../journey/journeyState'
import { useRafLoop } from '../../hooks/useRafLoop'
import { scrollToJourney } from '../../journey/scrollTo'

// ————————————————————————————————————————————————————————————————
// RoomNavigator — where you are inside the house.
//
// A vertical plan of the residence pinned to the right edge: the
// current room's tick extends and takes the gold, and a counter reads
// "03 / 12 — KITCHEN". Labels stay hidden until the navigator is
// hovered, so it reads as an instrument rather than a menu.
// ————————————————————————————————————————————————————————————————

export default function RoomNavigator() {
  const rootRef = useRef()
  const itemRefs = useRef([])
  const countRef = useRef()
  const [current, setCurrent] = useState(0)
  const last = useRef(-1)

  useRafLoop(() => {
    // visible only while we are actually inside the residence
    const gate = journey.heroProgress > 0.99 && journey.progress < 0.995 ? 1 : 0
    if (rootRef.current) {
      rootRef.current.style.opacity = gate
      rootRef.current.style.pointerEvents = gate ? 'auto' : 'none'
    }

    const i = journey.roomIndex ?? 0
    if (i === last.current) return
    last.current = i
    setCurrent(i)

    itemRefs.current.forEach((el, idx) => {
      if (el) el.dataset.active = String(idx === i)
    })
    if (countRef.current) {
      countRef.current.textContent =
        `${String(i + 1).padStart(2, '0')} / ${String(ROOMS.length).padStart(2, '0')} — ${ROOMS[i].label.toUpperCase()}`
    }
  })

  return (
    <motion.nav
      ref={rootRef}
      className="navigator"
      aria-label="Rooms of the residence"
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.2, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navigator-count" ref={countRef}>
        01 / {String(ROOMS.length).padStart(2, '0')} — {ROOMS[0].label.toUpperCase()}
      </div>
      {ROOMS.map((room, i) => (
        <button
          key={room.id}
          ref={(el) => (itemRefs.current[i] = el)}
          className="navigator-item"
          data-active={i === current}
          onClick={() => scrollToJourney(roomTarget(room.id), 2.6)}
          aria-label={`Go to ${room.label}`}
          aria-current={i === current ? 'true' : undefined}
        >
          <span className="navigator-label">{room.label}</span>
          <span className="navigator-tick" />
        </button>
      ))}
    </motion.nav>
  )
}
