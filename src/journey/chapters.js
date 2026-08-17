// The CRD chapter journey that follows the cinematic film hero.
// The longer track deliberately slows each transition and creates room
// for additional information chapters without stacking content vertically.

export const SCROLL_LENGTH_VH = 1650

export const CHAPTERS = [
  { id: 'hero',       label: 'CRD',          range: [0.0, 0.065],  center: 0.025 },
  { id: 'approach',   label: 'About',        range: [0.055, 0.14], center: 0.095 },
  { id: 'enter',      label: 'The Property', range: [0.225, 0.305], center: 0.265 },
  { id: 'management', label: 'Management',   range: [0.295, 0.385], center: 0.34 },
  { id: 'realestate', label: 'Properties',   range: [0.485, 0.565], center: 0.525 },
  { id: 'investment', label: 'Invest',       range: [0.655, 0.735], center: 0.695 },
  { id: 'services',   label: 'Services',     range: [0.815, 0.885], center: 0.85 },
  { id: 'contact',    label: 'Contact',      range: [0.94, 1.0],   center: 0.975 },
]

// Additional editorial slides live between the primary chapters.
export const EXTRA_CHAPTERS = [
  { id: 'ownership',    label: 'Owner Services', range: [0.135, 0.225], center: 0.18 },
  { id: 'leasing',      label: 'Leasing',        range: [0.38, 0.485],  center: 0.435 },
  { id: 'acquisitions', label: 'Acquisitions',   range: [0.56, 0.655],  center: 0.607 },
  { id: 'process',      label: 'Our Process',    range: [0.73, 0.815],  center: 0.773 },
  { id: 'whycrd',       label: 'Why CRD',        range: [0.88, 0.945],  center: 0.912 },
]

export const NAV_LINKS = [
  { label: 'Properties', target: 0.525 },
  { label: 'Management', target: 0.34 },
  { label: 'Invest', target: 0.695 },
  { label: 'About', target: 0.095 },
  { label: 'Contact', target: 0.975 },
]

// Key event timings in progress space
export const TIMINGS = {
  // services caption sub-moments within the services chapter
  services: [0.825, 0.85, 0.875],
}
