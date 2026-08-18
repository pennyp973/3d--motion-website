# CRD Property Group — Cinematic Real Estate Site

A fast, luxury, normal-scrolling site built from real CRD footage and
photography. Black / warm-white / muted-gold branding, editorial
typography, two cinematic videos, and clear, click-to-scroll navigation.
No pinned scroll-scrubbing, no generated 3D geometry.

## Pages, in order

1. **Hero** — full-screen looping brand film (`crd-drone-web.mp4`),
   plays straight through, no scroll interaction required.
2. **About** — the CRD approach, one paragraph.
3. **Properties** — a photo gallery of real CRD interiors and exteriors.
4. **Management** — the six services CRD provides as property manager.
5. **Investment** — the major feature section. A second cinematic film
   (`crd-investment-web.mp4`) beside six benefit cards explaining the
   case for multifamily and new-construction ownership. No fabricated
   statistics or guaranteed-return language anywhere in this section —
   see "Investment copy rules" below.
6. **Why CRD** — four pillars, one supporting paragraph.
7. **Contact** — the ask, two CTAs, and a full footer.

Sections carry a numbered marker (`01 ——— The CRD Approach`), alternate
their ground tone so the page reads in strata, and are separated by a
hairline seam. Headlines lift out of their own masks; photography and
video open behind a curtain wipe.

## Stack

- **Vite + React 18**
- **Framer Motion** — every reveal on the page (`whileInView`, once,
  400–900ms, 12–30px of travel). No GSAP, no ScrollTrigger.
- Native `<video>` for both films; the investment video is gated by
  `IntersectionObserver` so it only plays while on screen.
- Native anchor scrolling (`scrollIntoView({ behavior: 'smooth' })`)
  for navigation — no custom scroll-tweening.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## Architecture

- `src/App.jsx` — page shell: `Nav`, the seven sections in order,
  `Cursor`, film grain.
- `src/components/sections/` — one file per section
  (`Hero`, `About`, `Properties`, `Management`, `Investment`, `WhyCRD`,
  `Contact`). Each is self-contained; reordering the page is reordering
  these imports in `App.jsx`.
- `src/components/ui/Nav.jsx` — fixed header, anchor links to each
  section's `id` (`about`, `properties`, `management`, `investment`,
  `contact`), collapses to a full-screen menu under 820px.
- `src/components/ui/Cursor.jsx` — gold cursor dot + lagging ring,
  fine-pointer only.
- `src/components/ui/Primitives.jsx` — the shared design vocabulary:
  `SectionHead` (the `01 ——— Label` marker), `Headline` (masked
  line-by-line reveal), `Rise`, `Frame` (curtain-revealed photography)
  and `Button` (gold sweep + arrow). Sections are assembled from these
  rather than restyling from scratch.
- `src/lib/motion.js` — the shared reveal vocabulary (`fadeUp`,
  `lineReveal`, `curtainV`, `settleV`, `drawLine`) every section reuses
  for its scroll entrances.
- `src/hooks/useMagnetic.js` — cursor-attraction hover for buttons.
- `src/hooks/useIsMobile.js` — `(max-width: 820px), (pointer: coarse)`
  media query hook, drives the mobile nav.

Media lives in `public/video/` (`crd-drone-web.mp4` /
`crd-drone-poster.jpg` for the hero, `crd-investment-web.mp4` /
`crd-investment-poster.jpg` for Investment) and `public/img/chapters/`
(real CRD photography, used by Properties and Contact).

## Investment copy rules

The Investment section is not allowed to say anything that implies a
guaranteed outcome. Do not add:

- Fabricated portfolio returns or appreciation percentages
- Fabricated occupancy statistics
- Guaranteed appreciation, guaranteed cash flow, or promises of profit

Every benefit is written as a possibility ("can," "may," "depending
on"), never a promise. If you add copy to this section, keep that
pattern.

## Motion rules

- Reveals fire once per element (`viewport: { once: true }`): copy
  rises 12–30px, headlines lift out of a mask, media opens behind a
  curtain wipe while the image settles out of a 1.12 → 1.00 push-in.
- No long pins, no scroll-scrubbed video, no camera-travel-style
  transitions. Navigation should never make a visitor wait for an
  animation to catch up.
- **Never put a `whileInView` trigger on an element that is clipped**
  by `clip-path` or by an ancestor's `overflow: hidden` — it is clipped
  out of its own IntersectionObserver rect, so the reveal never fires
  and the content stays invisible. The unclipped parent owns the
  trigger; the clipped child is driven by variants. `HANDOFF.md` has
  the full explanation.

Responsive, reduced-motion aware, fully static, Netlify-ready.
