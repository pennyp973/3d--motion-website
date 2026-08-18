// Shared reveal presets — normal-scroll entrances, not scene-scrub.
// Small, fast, restrained: 400–900ms, 12–30px of travel, no long pins.

export const EASE = [0.22, 1, 0.36, 1]

export function reveal(delay = 0, y = 22, duration = 0.7) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration, delay, ease: EASE },
  }
}

export function revealScale(delay = 0, duration = 0.9) {
  return {
    initial: { opacity: 0, scale: 1.02 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration, delay, ease: EASE },
  }
}
