import { gsap } from 'gsap'

// Scrolls to a position inside the 3D journey (0 → 1 of the tour).
// The journey's scroll span starts after the cinematic hero section,
// so targets are computed off the track element, not the document.
export function scrollToJourney(p, duration = 2.4) {
  const track = document.getElementById('journey-track')
  if (!track) return
  const top = track.offsetTop
  const span = Math.max(track.offsetHeight - window.innerHeight, 1)
  gsap.to(window, {
    scrollTo: { y: top + p * span },
    duration,
    ease: 'power2.inOut',
  })
}
