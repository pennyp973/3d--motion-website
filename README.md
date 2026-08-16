# LUMIÈRE — Atelier of Light

A cinematic, scroll-driven 3D experience built with React Three Fiber. The
visitor travels through a dark reflective hall past hand-lit sculptures —
scrolling moves the camera along a spline path while fixed overlay chapters
dissolve into one another like scenes in a film.

## Stack

- **Vite + React 18**
- **Three.js + React Three Fiber** — real-time rendered environment (no static renders)
- **@react-three/drei** — reflective floor, procedural environment lighting, float, adaptive DPR
- **@react-three/postprocessing** — bloom, chromatic aberration, vignette
- **GSAP + ScrollTrigger** — scroll → camera progress, section choreography, scroll-to navigation
- **Framer Motion** — typography reveals, menu, loader transitions

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## How it works

- `src/journey/chapters.js` — the film script: camera spline, look-target
  spline, and chapter ranges in scroll space (0 → 1).
- `src/journey/journeyState.js` — shared mutable state (scroll progress,
  smoothed progress, pointer) read by the render loop, GSAP and the DOM
  every frame without React re-renders.
- `src/components/experience/` — the WebGL stage: `CameraRig` (spline
  follow + inertia + handheld pointer parallax), `World` (fog, reflector
  floor, light columns, light gate, procedural env map), `Sculptures`
  (chapter set pieces that wake as the camera nears), `Particles`
  (GPU-shader dust), `Effects` (cinematic grade).
- `src/components/ui/` — the fixed overlay: crossfading chapters, masked
  line reveals, chapter menu, progress rail, custom cursor, loader.

Mobile gets a lighter scene automatically: no reflections/shadows/
post-processing, fewer particles, wider FOV, and a text scrim.
