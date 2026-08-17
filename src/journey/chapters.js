// The CRD chapter journey that follows the cinematic film hero.
// Scroll progress (0 → 1) crossfades photographic backdrops (real CRD
// footage) while the overlay chapters carry the content.

export const SCROLL_LENGTH_VH = 950

export const CHAPTERS = [
  { id: 'hero',       label: 'CRD',                 range: [0.0, 0.085],  center: 0.02 },
  { id: 'approach',   label: 'About',               range: [0.075, 0.235], center: 0.16 },
  { id: 'enter',      label: 'The Property',        range: [0.26, 0.37],  center: 0.31 },
  { id: 'management', label: 'Management',          range: [0.385, 0.545], center: 0.465 },
  { id: 'realestate', label: 'Properties',          range: [0.565, 0.685], center: 0.62 },
  { id: 'investment', label: 'Invest',              range: [0.68, 0.825], center: 0.75 },
  { id: 'services',   label: 'Services',            range: [0.835, 0.925], center: 0.87 },
  { id: 'contact',    label: 'Contact',             range: [0.94, 1.0],   center: 0.98 },
]

export const NAV_LINKS = [
  { label: 'Properties', target: 0.62 },
  { label: 'Management', target: 0.465 },
  { label: 'Invest', target: 0.755 },
  { label: 'About', target: 0.175 },
  { label: 'Contact', target: 0.98 },
]

// Key event timings in progress space
export const TIMINGS = {
  // services caption sub-moments within the services chapter
  services: [0.845, 0.875, 0.905],
}
