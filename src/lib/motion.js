// Motion vocabulary for the whole site.
//
// One rule governs everything here: motion should read as *composure*,
// not as animation. Long, soft easing curves; short distances; nothing
// that draws attention to the fact that it moved.

export const EASE = [0.16, 1, 0.3, 1]
export const EASE_SOFT = [0.22, 1, 0.36, 1]

const VIEW = { once: true, amount: 0.25 }
const VIEW_EARLY = { once: true, amount: 0.15 }

// Body copy, small elements — rise and settle.
export function fadeUp(delay = 0, y = 26, duration = 0.9) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEW,
    transition: { duration, delay, ease: EASE },
  }
}

// Headlines — the line lifts out from behind its own edge.
// Returned as variants: the parent heading owns the in-view trigger,
// because a masked line is clipped out of its own intersection rect
// and would never fire an observer of its own.
export function lineReveal(delay = 0, duration = 1.05) {
  return {
    rest: { y: '110%' },
    lift: { y: '0%', transition: { duration, delay, ease: EASE } },
  }
}

// Viewport config for parent-driven reveals.
export const IN_VIEW = VIEW
export const IN_VIEW_EARLY = VIEW_EARLY

/* ——— Variant factories, for elements that cannot observe themselves ———
   A clipped or masked element is clipped out of its OWN
   IntersectionObserver rect, so `whileInView` on it never fires and it
   stays hidden forever. The unclipped parent carries the trigger
   (`initial="rest" whileInView="show"`) and these drive the children.
   Note also that both clipPath keyframes must use the same units —
   `inset(0 0 100% 0)` → `inset(0 0 0% 0)` will not interpolate. */

// Photography and video — a curtain opens down the frame.
export function curtainV(delay = 0, duration = 1.35) {
  return {
    rest: { clipPath: 'inset(0% 0% 100% 0%)' },
    show: {
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration, delay, ease: EASE },
    },
  }
}

// The image settles out of a slow push-in behind the curtain.
export function settleV(delay = 0, duration = 1.8) {
  return {
    rest: { scale: 1.12 },
    show: { scale: 1, transition: { duration, delay, ease: EASE } },
  }
}

export function fadeV(delay = 0, duration = 0.8, y = 12) {
  return {
    rest: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } },
  }
}

// Standalone push-in for an image with no clipping ancestor, where a
// self-observing `whileInView` is safe.
export function settle(delay = 0, duration = 1.6) {
  return {
    initial: { scale: 1.12 },
    whileInView: { scale: 1 },
    viewport: VIEW_EARLY,
    transition: { duration, delay, ease: EASE },
  }
}

// Hairlines that draw themselves across.
export function drawLine(delay = 0, duration = 1.1) {
  return {
    initial: { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: VIEW,
    transition: { duration, delay, ease: EASE },
    style: { transformOrigin: 'left' },
  }
}
