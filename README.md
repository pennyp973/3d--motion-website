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
7. **Contact** — the ask, two CTAs, contact details.

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
- `src/components/ui/RevealText.jsx` — masked line-by-line title
  reveal (`RevealText`) and a fade/rise wrapper (`FadeIn`), used by the
  hero's staged entrance.
- `src/lib/motion.js` — `reveal()` / `revealScale()`, the shared
  Framer Motion presets every section reuses for its `whileInView`
  entrances.
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

- Reveals: 400–900ms, opacity + 12–30px of y-translation, once per
  element (`viewport: { once: true }`).
- Media reveals: opacity + scale 1.02 → 1.00.
- No long pins, no scroll-scrubbed video, no camera-travel-style
  transitions. Navigation should never make a visitor wait for an
  animation to catch up.

Responsive, reduced-motion aware, fully static, Netlify-ready.
