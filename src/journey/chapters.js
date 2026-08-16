// The CRD property journey. Scroll progress (0 → 1) drives the camera
// along CAMERA_PATH while it gazes along LOOK_PATH. Chapters own ranges
// of progress space; the overlay crossfades between them.
//
// World layout:
//   Building: front facade at z = 0, rear facade at z = -28,
//   width x ±17, podium 0–4.6, tower to y ≈ 27.5, roof terrace on top.
//   Interior (ground floor): lobby z 0…-13, corridor -13…-16,
//   residence -16…-28 with full glazing at the rear.
//   City skyline: z -70…-160. Sunset glow to the north (-z).

export const SCROLL_LENGTH_VH = 950

export const CAMERA_PATH = [
  // Aerial arrival — the building dominates
  [26, 16, 40],
  [15, 10, 30],
  // Descent while the facade assembles
  [7, 5.5, 21],
  // Approach the entrance on axis
  [0, 2.6, 11],
  // Through the opening doors
  [0, 2.4, 0.5],
  // Lobby
  [1.6, 2.3, -7],
  // Corridor
  [-0.8, 2.3, -14],
  // Residence
  [1.8, 2.4, -21],
  // At the rear glazing, city beyond
  [0, 2.6, -26.5],
  // Out through the glass, rising along the rear facade
  [0, 6, -34],
  [0, 16, -37],
  // Crest over the parapet
  [0, 30, -34],
  // Settle above the roof terrace, skyline beyond
  [10, 33.5, -9],
]

export const LOOK_PATH = [
  [0, 10, -6],
  [0, 8, -3],
  [0, 5, 0],
  [0, 3.0, 0],
  [0, 2.5, -8],
  [-1.2, 2.2, -13],
  [0.8, 2.3, -20],
  [-4.5, 1.9, -22.5],
  // Gaze out to the city through the glazing
  [0, 5, -45],
  // Turn back to the rear facade for the services sequence
  [0, 7, -42],
  [0, 19, -28.5],
  // Sweep over the roof
  [0, 26, -24],
  [-2, 27, -24],
]

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
  // exterior comes alive during the opening
  awaken: [0.0, 0.13],
  // facade elements assemble while descending
  assemble: [0.1, 0.26],
  // entrance doors slide open
  doors: [0.27, 0.33],
  // interior lights pre-warm as we approach
  interior: [0.25, 0.4],
  // services signage sub-moments (camera y sweep on the rear facade)
  services: [0.845, 0.875, 0.905],
}
