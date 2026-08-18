import { useRef } from 'react'
import { ROOMS, ROOM_WINDOWS } from '../../journey/rooms'
import { journey } from '../../journey/journeyState'
import { useRafLoop } from '../../hooks/useRafLoop'

// ————————————————————————————————————————————————————————————————
// RoomInfo — what the room tells you about itself.
//
// Rooms that carry a business chapter stay quiet here; their story is
// the chapter. The rest introduce themselves as the camera settles:
// eyebrow, then title, then details one at a time, each keyed to how
// far into the room you have travelled. Scroll back and they retract.
//
// Written imperatively every frame so nothing re-renders mid-journey.
// ————————————————————————————————————————————————————————————————

const STORY_ROOMS = ROOMS.map((r, i) => ({ ...r, index: i })).filter(
  (r) => !r.chapter && r.facts?.length
)

function clamp01(v) {
  return Math.min(Math.max(v, 0), 1)
}

export default function RoomInfo() {
  const blockRefs = useRef({})
  const partRefs = useRef({})

  useRafLoop(() => {
    const t = journey.smooth
    const gate = clamp01((journey.heroProgress - 0.9) / 0.085)

    STORY_ROOMS.forEach((room) => {
      const block = blockRefs.current[room.id]
      if (!block) return
      const w = ROOM_WINDOWS[room.index]
      const span = Math.max(w.end - w.start, 0.0001)
      const ct = (t - w.start) / span

      // the block lives between arrival and departure
      const appear = clamp01(ct / 0.16)
      const depart = clamp01((ct - 0.82) / 0.18)
      const vis = appear * (1 - depart) * gate

      if (vis < 0.004) {
        if (block.style.visibility !== 'hidden') {
          block.style.visibility = 'hidden'
          block.style.opacity = '0'
        }
        return
      }
      block.style.visibility = 'visible'
      block.style.opacity = vis.toFixed(3)
      block.style.transform = `translate3d(0, ${((1 - appear) * 22).toFixed(1)}px, 0)`

      // details arrive one after another as you move further in
      const parts = partRefs.current[room.id]
      if (!parts) return
      parts.forEach((el, i) => {
        if (!el) return
        const at = 0.2 + i * 0.075
        const p = clamp01((ct - at) / 0.11)
        el.style.opacity = (p * (1 - depart)).toFixed(3)
        el.style.transform = `translate3d(${((1 - p) * -14).toFixed(1)}px, 0, 0)`
      })
    })
  })

  return (
    <>
      {STORY_ROOMS.map((room) => (
        <div
          key={room.id}
          className="room-info"
          ref={(el) => (blockRefs.current[room.id] = el)}
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          <div className="room-eyebrow">
            <span className="eyebrow" style={{ fontSize: '0.62rem' }}>{room.eyebrow}</span>
          </div>
          <h2 className="room-title">{room.title}</h2>
          <ul className="room-facts">
            {room.facts.map((fact, i) => (
              <li
                key={fact}
                className="room-fact"
                ref={(el) => {
                  if (!partRefs.current[room.id]) partRefs.current[room.id] = []
                  partRefs.current[room.id][i] = el
                }}
                style={{ opacity: 0 }}
              >
                {fact}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}
