// The five chapters of the journey. Each chapter owns:
//  - a segment of the camera path (positions + look targets)
//  - the overlay copy shown while the camera travels its segment
// Progress space is 0 → 1 across the whole scroll.

export const SCROLL_LENGTH_VH = 800 // total scroll travel

export const CAMERA_PATH = [
  // Overture — high and far, looking down the axis of the hall
  [0, 3.2, 26],
  [0, 2.6, 18],
  // Philosophy — medium shot drifting past the torus on the left
  [-5.8, 1.7, 11],
  [-7.2, 2.1, 4],
  // Craft — cross the centre, orbit rings framed right of the copy
  [-2.5, 2.9, -2.0],
  [3.2, 2.4, -5.5],
  // Collection — glide down the centre-left, through the orbit rings,
  // with the monolith held on the right of frame
  [2.2, 2.0, -10.5],
  [0.8, 2.6, -17.5],
  // Epilogue — rise toward the light gate
  [0, 4.2, -25.5],
  [0, 5.5, -31.0],
]

export const LOOK_PATH = [
  [0, 2.2, 10],
  [0, 2.0, 4],
  [-2.4, 1.9, 1.0],
  [-2.2, 2.1, -2.5],
  [0.8, 2.3, -6.5],
  [1.8, 2.2, -9.5],
  // Both collection look-points hold on the monolith — the gaze stays
  // fixed on the crystal while the camera drives past it
  [4.6, 2.3, -15.5],
  [4.2, 2.6, -17.5],
  [0, 4.2, -34.0],
  [0, 5.0, -40.0],
]

export const CHAPTERS = [
  {
    id: 'overture',
    numeral: 'I',
    title: 'Overture',
    range: [0.0, 0.16],
    center: 0.04,
  },
  {
    id: 'philosophy',
    numeral: 'II',
    title: 'Philosophy',
    range: [0.18, 0.4],
    center: 0.29,
  },
  {
    id: 'craft',
    numeral: 'III',
    title: 'Craft',
    range: [0.42, 0.62],
    center: 0.52,
  },
  {
    id: 'collection',
    numeral: 'IV',
    title: 'Collection',
    range: [0.64, 0.82],
    center: 0.73,
  },
  {
    id: 'epilogue',
    numeral: 'V',
    title: 'Epilogue',
    range: [0.86, 1.0],
    center: 0.95,
  },
]
