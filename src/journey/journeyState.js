// Shared mutable state for the scroll journey.
// Kept outside React so the render loop, GSAP and the DOM overlay
// can all read/write it every frame without triggering re-renders.

export const journey = {
  // Raw scroll progress from ScrollTrigger, 0 → 1
  progress: 0,
  // Inertia-smoothed progress the camera actually follows
  smooth: 0,
  // Normalized pointer position, -1 → 1
  mouse: { x: 0, y: 0 },
  // Lerped pointer used for parallax
  smoothMouse: { x: 0, y: 0 },
  // Set true once the loader has finished its reveal
  ready: false,
  // Progress of the cinematic film hero that precedes the tour
  heroProgress: 0,
}

export function damp(current, target, lambda, delta) {
  return current + (target - current) * (1 - Math.exp(-lambda * delta))
}

if (typeof window !== 'undefined') {
  window.__journey = journey
}
