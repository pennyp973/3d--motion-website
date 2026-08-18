# Engineering Handoff — CRD Property Group

This document is for whoever picks this project up next (human or AI).
It describes the current architecture, the constraints that shaped it,
and what's still open.

## What this site is

A fast, luxury, normal-scrolling real-estate marketing site for CRD
Property Group. React 18 + Vite, no backend, fully static, deployable
to Netlify as-is (`netlify.toml` is already configured).

**This is the second major architecture.** The first version (see git
history before this handoff was rewritten) was a scroll-scrubbed
"walk through the house" experience: a pinned camera, eleven rooms,
GSAP ScrollTrigger driving a virtual dolly. The client explicitly asked
for that to be removed — "Remove the slow forced 3D-style scrolling"
— in favor of a normal page a visitor can navigate immediately. If you
are looking at old commits and see `RoomStage`, `journey/rooms.js`,
`BuildWithUs`, or similar, that is the **previous** architecture. It
has been deleted. Do not resurrect it without being asked.

## Structure

```
src/
  App.jsx                     — page shell, section order
  components/
    sections/                 — one file per page section
      Hero.jsx                — full-bleed looping brand film
      About.jsx
      Properties.jsx          — real-photo gallery
      Management.jsx          — six-service list
      Investment.jsx          — major section, second video, benefit cards
      WhyCRD.jsx               — four pillars
      Contact.jsx              — CTA + contact details
    ui/
      Nav.jsx                 — fixed header, anchor nav, mobile menu
      Cursor.jsx               — custom cursor (fine pointers only)
      RevealText.jsx           — RevealText (line reveal) + FadeIn
  hooks/
    useMagnetic.js             — button hover attraction
    useIsMobile.js             — mobile/coarse-pointer media query
  lib/
    motion.js                  — reveal()/revealScale() Framer Motion presets
  styles/global.css             — design tokens + all section styles
```

Every section is self-contained and mounted once in `App.jsx`. Reorder
the page by reordering the imports there. There is no shared runtime
state between sections (no `journey`/`window.__journey` global — that
belonged to the deleted architecture and does not exist anymore).

## Design tokens (do not change without asking)

Defined in `src/styles/global.css`:

```css
--ink: #f2efe9;
--gold: #c2a061;
--gold-bright: #e3c689;
--void: #050505;
--font-display: 'Cormorant Garamond';
--font-body: 'Inter';
```

## Media

- `public/video/crd-drone-web.mp4` + `crd-drone-poster.jpg` — hero.
  Autoplay, muted, loop, playsInline. Plays straight through; never
  wire scroll position to its currentTime.
- `public/video/crd-investment-web.mp4` + `crd-investment-poster.jpg`
  — Investment section. **Not** autoplay-on-load — gated by an
  `IntersectionObserver` in `Investment.jsx` so it only plays while
  visible (CPU/battery). If you change how this section is laid out,
  keep that gating.
- `public/img/chapters/*.jpg` — real CRD photography (13 files).
  `Properties.jsx` and `Contact.jsx` currently use a subset; the rest
  (`ch-entry.jpg`, `ch-dining.jpg`, `ch-island.jpg`, `ch-skyline.jpg`)
  are unused but kept in case a future section wants them. All of this
  is real client photography — never replace it with generated imagery.

Both videos were supplied pre-optimized (H.264, fast-start) — no
re-encoding needed. If new video is ever added, keep it web-ready:
fast-start MP4, reasonable bitrate for its resolution, a poster image,
and — if it's a background/loop video — dense keyframes if you ever do
need to scrub it (this site currently scrubs nothing).

## Content rule: the Investment section

This is a hard constraint, not a style preference. The Investment
section must never say or imply:

- A specific portfolio return or appreciation percentage
- A specific occupancy statistic
- Guaranteed appreciation
- Guaranteed cash flow
- Any promise of profit

Every benefit in `Investment.jsx` is phrased as a possibility ("can,"
"may," "depending on"), and the section ends with an explicit
qualifier: *"Every investment is different. CRD evaluates each
property on its actual condition, financing, market, operating costs
and business plan."* If you edit this section's copy, keep that
pattern. The previous architecture's `Overlay.jsx` had a chart and
fabricated stats (9.4% appreciation, 98% occupancy, 15-year average
hold) in its Investment chapter — that component has been deleted;
do not bring those numbers back in any form.

## Motion

All motion is Framer Motion `whileInView`, via the presets in
`src/lib/motion.js`:

- `fadeUp(delay, y, duration)` — opacity + y-translate, fires once per
  element. Safe to spread directly onto any element.
- `settle(delay, duration)` — scale 1.12 → 1.00 for a standalone image
  with **no clipping ancestor**.
- `lineReveal` / `curtainV` / `settleV` / `fadeV` — **variant
  factories**, for elements that cannot observe themselves. See below.
- `drawLine(delay)` — scaleX 0 → 1 for hairlines.

### The self-clipping deadlock (read before touching a reveal)

`whileInView` is backed by an IntersectionObserver, and an element's
intersection rect is clipped by its ancestors' `overflow` **and** by
its own `clip-path`. That creates a deadlock for exactly the two
effects this site leans on:

1. **Masked headline lines.** `.line-inner` is parked at `y: 110%`
   inside a `.line-mask` with `overflow: hidden`. The line is clipped
   fully out of its own intersection rect, so an observer on the line
   never fires and the headline stays invisible forever.
2. **Curtain-revealed media.** A `clip-path: inset(0% 0% 100% 0%)` on
   the observed element clips it to zero height, so it never reports as
   intersecting and never un-clips.

The fix in both cases is the same: **the trigger goes on an unclipped
parent, and the clipped child is driven by variants.** The parent gets
`initial="rest" whileInView="show" viewport={IN_VIEW}`; the child gets
`variants={curtainV(delay)}`. That's why `Frame` has a `.frame-clip`
inner layer and `Headline` puts the trigger on the `<h2>` — do not
"simplify" either by moving the trigger back onto the clipped element.

Also: **both `clipPath` keyframes must use the same units.**
`inset(0 0 100% 0)` → `inset(0 0 0% 0)` will not interpolate and the
element stays fully clipped. Write all four values as percentages.

There is no GSAP in this project (removed along with the scroll-scrub
architecture — check `package.json` before reaching for it again).
Navigation is native `element.scrollIntoView({ behavior: 'smooth' })`
plus `html { scroll-behavior: smooth }` — no scroll-tweening library.
Each `section[id]` has `scroll-margin-top` so the fixed header doesn't
cover the section's top on anchor-jump.

## QA notes

Verified with a Vite dev server + headless Chromium (software
rendering, `--use-gl=swiftshader`) at 1440×900 and 390×844: hero
staged reveal, all seven sections, mobile menu open/close, nav
click-to-scroll, no horizontal overflow, clean production build. That
environment is a reasonable proxy but is meaningfully slower than a
real browser (particularly video decode) — re-check on a real device
before calling this "verified" for production traffic.

## Open items

- **Netlify deployment**: not yet actually deployed from this
  environment. Deploying via CLI needs either an interactive OAuth
  login (not available headless) or a Netlify personal access token
  from the client. `netlify-cli` was previously confirmed to install
  and run fine here (`npx --yes netlify-cli`). The simplest path is
  usually the client connecting this GitHub repo directly in the
  Netlify dashboard (Import from Git) — `netlify.toml` is already set
  up for that (`npm run build`, publish `dist`, immutable caching on
  `/video/*` and `/img/*`).
- **Contact details are placeholders**: `hello@crdpropertygroup.com`,
  `partners@crdpropertygroup.com`, `+1 (617) 555-0148` in
  `Contact.jsx` are not verified as real. Replace with the client's
  actual contact info before launch.
- **Hero is aspirational, not a listing**: the brief that shaped this
  section was explicit that the drone footage should not be presented
  as a specific active CRD listing unless the client says otherwise.
  Same logic applied to the Properties gallery — captions are generic
  ("The Kitchen," "Primary Suites"), not tied to one address's stats.

## Do NOT do these things

- Do not reintroduce scroll-scrubbed video, pinned camera sections, or
  any "wait for the scene to catch up" navigation. The client asked
  for exactly the opposite of that.
- Do not add GSAP/ScrollTrigger back for routine reveals — Framer
  Motion's `whileInView` already covers it and keeps the bundle
  smaller.
- Do not add fabricated statistics anywhere in the Investment section
  (see above — this is the one constraint that's been repeated by the
  client across two different briefs).
- Do not generate 3D geometry or synthetic property imagery. Every
  photo and video on this site is real CRD material.
- Do not let the investment video autoplay unconditionally — keep the
  `IntersectionObserver` gate.
- Do not move a `whileInView` trigger onto an element that is clipped
  by `clip-path` or by an ancestor's `overflow: hidden` — it will never
  fire and the content will silently vanish. See "The self-clipping
  deadlock" above.
