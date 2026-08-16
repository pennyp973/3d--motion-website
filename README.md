# CRD Property Group — Immersive 3D Website

**The website is the property.** A cinematic, scroll-driven tour of a
CRD development, rendered live in Three.js: the visitor arrives on an
aerial view of a luxury condominium at dusk, descends past the
assembling facade, walks through the opening entrance doors into the
lobby, moves through a model residence to the glazing overlooking the
city, rises up the rear facade past dimensional service signage, and
lands on the rooftop terrace at the skyline for the closing call to
action.

## Stack

- **Vite + React 18**
- **Three.js + React Three Fiber** — all architecture is real, procedurally
  built 3D geometry (curtain-wall tower, podium, interiors, city, rooftop)
- **@react-three/drei** — instancing helpers, environment lighting, adaptive DPR
- **@react-three/postprocessing** — bloom, chromatic aberration, vignette
- **GSAP + ScrollTrigger** — scroll → camera progress and scroll-to navigation
- **Framer Motion** — typography reveals, cards, chart draw, menu, loader

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## Architecture

- `src/journey/chapters.js` — the film script: camera spline, gaze spline,
  chapter scroll ranges, nav targets and event timings (door opening,
  facade assembly, signage moments).
- `src/journey/journeyState.js` — shared mutable scroll/pointer state read
  by the render loop, GSAP and the DOM overlay without React re-renders.
- `src/components/experience/` — the stage: `Building` (tower, podium,
  entrance, sliding doors, extruded CRD signage), `Interior` (lobby,
  corridor, residence), `City` (sky shader, towers, window-light points),
  `Landscape`, `Rooftop`, `ServicesSignage`, `CameraRig`, `Lighting`,
  `Particles`, `Effects` — materials shared from `materials.js`,
  repetition instanced.
- `src/components/ui/` — fixed overlay chapters that crossfade in place
  (no empty scroll voids), inline nav, progress rail, loader, cursor.

Mobile keeps the full journey with a lighter scene: no shadows or
post-processing, fewer particles, wider FOV, text scrims for legibility.
