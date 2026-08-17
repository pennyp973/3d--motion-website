# CRD Property Group — Cinematic Property Experience

**The property is the website.** A pinned, scroll-scrubbed cinematic
film of a real CRD property opens the site — scroll drives the film
forward and backward through exterior, approach, residences and the
rooftop CRD reveal, with the brand system, staged typography,
pointer-responsive perspective and a gold progress rail layered over
it. The film then dissolves into the chapter journey: real photographic
backdrops (stills from the same footage) crossfade with cinematic
drift while the content chapters — About, Management, Properties,
Investment, Services, Contact — play over them.

No generated 3D geometry is used anywhere; every visual of the
property is real CRD footage.

## Stack

- **Vite + React 18**
- **GSAP + ScrollTrigger** — scroll → film time, chapter choreography,
  journey-relative deep links
- **Framer Motion** — typography reveals, cards, chart draw, menu, loader

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## Architecture

- `src/components/ui/HeroCinematic.jsx` — the scroll-scrubbed film hero
  (scrub smoothing, staged typography, parallax, progress rail,
  hand-off fade). Video variants live in `public/video/` (1080p + 720p,
  H.264 keyframe-dense + VP9 fallbacks, poster).
- `src/components/ui/PhotoStage.jsx` — photographic chapter backdrops
  (`public/img/chapters/`, swap any file to change a backdrop).
- `src/components/ui/Overlay.jsx` — the chapter content system.
- `src/journey/chapters.js` — chapter ranges, nav targets, timings.

Responsive (mobile picks the 720p film), reduced-motion aware, and
fully static — deployable on Netlify as-is (`netlify.toml` included).
