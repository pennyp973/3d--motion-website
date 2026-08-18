// ————————————————————————————————————————————————————————————————
// THE SCRIPT
//
// One house, one camera, one continuous journey. Each entry is a room
// the camera travels through after the film hero delivers the visitor
// to the opened front door.
//
// `cam` is the dolly move performed across the room's scroll window:
//   s — scale (>1 pushes in, shrinking pulls back)
//   x — horizontal drift in % of frame
//   y — vertical drift in % of frame
// The camera interpolates from `cam.from` to `cam.to` as you scroll,
// so every room breathes instead of sitting still.
//
// `weight` is relative scroll length — rooms carrying business content
// or complex imagery get more travel time.
//
// `chapter` attaches a content chapter (rendered by Overlay) to a room.
// `facts` are the progressive room details revealed on arrival.
// `light` positions a soft warm bloom, matched to the real light
// source in each photograph.
// ————————————————————————————————————————————————————————————————

export const ROOMS = [
  {
    id: 'foyer',
    enter: 'light',
    label: 'Foyer',
    src: '/img/chapters/ch-entry.jpg',
    weight: 1.25,
    chapter: 'about',
    eyebrow: 'The Arrival',
    title: 'The Foyer',
    facts: ['White oak treads', 'Custom millwork', 'Double-height entry'],
    cam: { from: { s: 1.02, x: 0, y: 1.5 }, to: { s: 1.16, x: -1.5, y: -1 } },
    light: { x: '62%', y: '34%', strength: 0.5 },
  },
  {
    id: 'living',
    enter: 'threshold',
    label: 'Great Room',
    src: '/img/chapters/ch-living.jpg',
    weight: 1.15,
    eyebrow: 'Gathering',
    title: 'The Great Room',
    facts: ['Coffered ceiling', 'Gas fireplace', 'Built-in shelving', 'Terrace access'],
    cam: { from: { s: 1.14, x: 3, y: 0 }, to: { s: 1.04, x: -3, y: 0.5 } },
    light: { x: '78%', y: '42%', strength: 0.42 },
  },
  {
    id: 'kitchen',
    enter: 'threshold',
    label: 'Kitchen',
    src: '/img/chapters/ch-kitchen.jpg',
    weight: 1.15,
    eyebrow: 'The Heart',
    title: "The Chef's Kitchen",
    facts: ['Oversized centre island', 'Custom cabinetry', 'Professional range', 'Natural stone surfaces'],
    cam: { from: { s: 1.03, x: -2, y: 0 }, to: { s: 1.2, x: 1, y: 1 } },
    light: { x: '30%', y: '38%', strength: 0.5 },
  },
  {
    id: 'island',
    enter: 'focus',
    label: 'Island',
    src: '/img/chapters/ch-island.jpg',
    weight: 1.5,
    chapter: 'management',
    eyebrow: 'Detail',
    title: 'Built to be lived in',
    facts: ['Seating for five', 'Waterfall stone', 'Open sightlines'],
    cam: { from: { s: 1.05, x: 2, y: -1 }, to: { s: 1.15, x: -2, y: 1 } },
    light: { x: '72%', y: '30%', strength: 0.45 },
  },
  {
    id: 'dining',
    enter: 'wall',
    label: 'Dining',
    src: '/img/chapters/ch-dining.jpg',
    weight: 1.0,
    eyebrow: 'Hosting',
    title: 'The Dining Room',
    facts: ['Seats twelve', 'Bronze chandelier', 'Doors to the terrace'],
    cam: { from: { s: 1.16, x: -3, y: 0 }, to: { s: 1.05, x: 2, y: 0 } },
    light: { x: '68%', y: '40%', strength: 0.46 },
  },
  {
    id: 'bedroom',
    enter: 'rise',
    label: 'Primary Suite',
    src: '/img/chapters/ch-bedroom.jpg',
    weight: 1.5,
    chapter: 'realestate',
    eyebrow: 'Retreat',
    title: 'The Primary Suite',
    facts: ['King proportions', 'Dual walk-in closets', 'Treetop outlook'],
    cam: { from: { s: 1.04, x: 2.5, y: -1 }, to: { s: 1.17, x: -1, y: 0.5 } },
    light: { x: '74%', y: '36%', strength: 0.44 },
  },
  {
    id: 'bath',
    enter: 'threshold',
    label: 'Primary Bath',
    src: '/img/chapters/ch-bathroom.jpg',
    weight: 1.0,
    eyebrow: 'Restoration',
    title: 'The Primary Bath',
    facts: ['Freestanding soaking tub', 'Frameless glass shower', 'Double stone vanity'],
    cam: { from: { s: 1.15, x: -2.5, y: 0.5 }, to: { s: 1.04, x: 2, y: -0.5 } },
    light: { x: '58%', y: '34%', strength: 0.48 },
  },
  {
    id: 'detail',
    enter: 'focus',
    label: 'Craft',
    src: '/img/chapters/ch-plaque.jpg',
    weight: 1.5,
    chapter: 'investment',
    eyebrow: 'Signature',
    title: 'Considered to the handle',
    facts: ['Solid bronze hardware', 'Steel-framed glazing', 'Engraved CRD mark'],
    cam: { from: { s: 1.18, x: -1, y: 0 }, to: { s: 1.05, x: 1.5, y: 0 } },
    light: { x: '46%', y: '30%', strength: 0.34 },
  },
  {
    id: 'garage',
    enter: 'wall',
    label: 'Garage',
    src: '/img/chapters/ch-garage.jpg',
    weight: 1.0,
    eyebrow: 'Utility',
    title: 'Three-Bay Garage',
    facts: ['Epoxy floor', 'Custom cabinetry', 'Direct interior access'],
    cam: { from: { s: 1.03, x: -2, y: 0 }, to: { s: 1.14, x: 2, y: 0.5 } },
    light: { x: '30%', y: '26%', strength: 0.4 },
  },
  {
    id: 'terrace',
    enter: 'light',
    label: 'Terrace',
    src: '/img/chapters/ch-terrace.jpg',
    weight: 1.1,
    eyebrow: 'Outdoors',
    title: 'The Terrace',
    facts: ['Bluestone patio', 'Cable railing', 'Skyline outlook'],
    cam: { from: { s: 1.16, x: 0, y: 2 }, to: { s: 1.03, x: 0, y: -1.5 } },
    light: { x: '50%', y: '58%', strength: 0.4 },
  },
  {
    id: 'summary',
    enter: 'threshold',
    label: 'The Residence',
    src: '/img/chapters/ch-skyline.jpg',
    weight: 1.6,
    chapter: 'summary',
    eyebrow: 'In Full',
    title: 'The Residence',
    cam: { from: { s: 1.12, x: 0, y: 1 }, to: { s: 1.02, x: 0, y: -1 } },
    light: { x: '50%', y: '52%', strength: 0.36 },
  },
]

// Property facts for the summary chapter.
export const PROPERTY = {
  address: 'A CRD Residence',
  location: 'Greater Boston, Massachusetts',
  stats: [
    ['4', 'Bedrooms'],
    ['3.5', 'Bathrooms'],
    ['3', 'Car garage'],
    ['6,400', 'Square feet'],
    ['1.2', 'Acre lot'],
    ['2024', 'Built'],
  ],
}

// ——— Derived scroll windows ———
// Each room owns [start, end] in journey progress space (0 → 1),
// proportional to its weight.
const TOTAL = ROOMS.reduce((sum, r) => sum + r.weight, 0)

let cursor = 0
export const ROOM_WINDOWS = ROOMS.map((r) => {
  const start = cursor
  cursor += r.weight / TOTAL
  return { id: r.id, start, end: cursor }
})

export function roomWindow(id) {
  return ROOM_WINDOWS.find((w) => w.id === id)
}

// Scroll length: enough travel that each room is genuinely inhabited
// rather than flashed past. ~170vh of scroll per unit of weight.
export const JOURNEY_VH = Math.round(TOTAL * 170)

// Navigation targets sit just inside each room, past its entry
// transition, so a jump lands in the room rather than mid-doorway.
export const NAV_LINKS = [
  { label: 'Residence', roomId: 'living' },
  { label: 'Management', roomId: 'island' },
  { label: 'Properties', roomId: 'bedroom' },
  { label: 'Invest', roomId: 'detail' },
  { label: 'Build', anchor: 'build' },
  { label: 'Contact', anchor: 'closing' },
]

export function roomTarget(id) {
  const w = roomWindow(id)
  return w ? w.start + (w.end - w.start) * 0.35 : 0
}
