# CRD Property Group — Cinematic Property Experience

**One house, one camera, one journey.** The site is a continuous
architectural walkthrough in four acts, built entirely from real CRD
footage and photography. No generated 3D geometry anywhere.

**Act I — Arrival.** A pinned, scroll-scrubbed film of the house at
dusk. Scroll drives the footage forward and backward and stops exactly
as the front doors finish opening, handing the visitor across the
threshold.

**Act II — The Residence.** Eleven rooms, each with its own camera
dolly, its own kind of threshold, and its own story. Foyer, great
room, kitchen, island, dining, primary suite, primary bath, the
bronze hardware, garage, terrace, and a summary of the property in
full. Business chapters (management, real estate, investment) are
spoken from the room they belong to.

**Act III — Build With Us.** The camera leaves the finished house and
lands on open ground at sunrise, where scrolling raises a building out
of it — slab, structure, envelope, delivery — with four clickable
stages and a completion meter.

**Act IV — The Invitation.** The camera comes to rest in front of the
house at dusk, where it began.

## Stack

- **Vite + React 18**
- **GSAP + ScrollTrigger** — scroll → film time, room windows, deep links
- **Framer Motion** — typography reveals, cards, chart, menu, loader

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## Architecture

- `src/journey/rooms.js` — **the script.** Room order, camera moves,
  threshold kinds, copy, facts, scroll weights, nav targets. Almost
  every creative change to the tour is a change to this one file.
- `src/components/rooms/RoomStage.jsx` — the camera: per-room dolly,
  doorway transitions, depth layers, bloom, parallax.
- `src/components/rooms/RoomInfo.jsx` — progressive room details.
- `src/components/rooms/RoomNavigator.jsx` — where you are in the house.
- `src/components/ui/HeroCinematic.jsx` — the arrival film.
- `src/components/build/BuildWithUs.jsx` — the construction sequence.
- `src/components/closing/ClosingSection.jsx` — the invitation.
- `src/components/ui/Overlay.jsx` — business chapters, anchored to rooms.

Media lives in `public/video/` (two scrub-optimised films, 1080p +
720p, H.264 + VP9) and `public/img/chapters/` (1920×1080 JPGs — swap a
file to change a room's photograph).

Responsive, reduced-motion aware, fully static, Netlify-ready.
