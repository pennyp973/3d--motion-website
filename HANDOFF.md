# CRD Property Group — Complete Engineering Handoff

**For the next developer or AI agent picking this project up.**
Everything needed to finish and launch this site is in this document.
Read §1 and §2 before writing any code.

- **Repo:** `pennyp973/3d--motion-website`
- **Working branch:** `claude/cinematic-3d-react-site-7r64pw` (tracked by PR #1)
- **Status:** feature-complete and QA'd, **not yet deployed**
- **Stack:** Vite 5 + React 18 + Framer Motion. No backend. Fully static.

---

## 1. TL;DR — what to do next

The build is clean and the site is finished as a piece of front-end
work. Four things stand between it and launch, in priority order:

| # | Task | Blocked on | Effort |
|---|------|-----------|--------|
| 1 | **Deploy to Netlify** | Client (token or dashboard import) | 10 min |
| 2 | **Add brokerage name + Equal Housing + license #** | Client must supply | 15 min |
| 3 | **Decide the Property Management section's fate** | Client decision | 20 min |
| 4 | **Test on a real phone** | Needs a live URL (task 1) | 15 min |

Full detail on each in §3. **Do not start a redesign.** The visual
direction is signed off. Everything below the line in §3 is optional.

---

## 2. Hard constraints — do not break these

These are not style preferences. Each one was set by the client, some
of them repeatedly across multiple briefs.

1. **No fabricated investment statistics.** No portfolio returns, no
   occupancy figures, no guaranteed appreciation, no guaranteed cash
   flow, no promise of profit. See §7.
2. **No scroll-scrubbed video, no pinned camera sections, no
   pseudo-3D transitions.** A previous version of this site was a
   scroll-driven "walk through the house." The client explicitly asked
   for it to be removed: *"Remove the slow forced 3D-style scrolling."*
   Navigation must never make a visitor wait for an animation.
3. **No generated 3D geometry and no synthetic property imagery.**
   Every photo and video is real client material. An earlier Three.js
   version was deleted at the client's insistence.
4. **Never put a `whileInView` trigger on a clipped element.** It fails
   by silently hiding content. See §8 — this is the single most likely
   way to break this codebase.
5. **Keep the investment video's `IntersectionObserver` gate.** It must
   not autoplay unconditionally.
6. **Real contact details only.** See §4.

---

## 3. Remaining work

### 3.1 Deploy to Netlify — BLOCKED ON CLIENT

`netlify.toml` is already configured (`npm run build` → publish `dist`,
immutable caching on `/video/*` and `/img/*`). Two paths:

- **Client self-serve (simplest):** Netlify dashboard → Add new site →
  Import an existing project → pick this repo → pick the branch. The
  build settings are read from `netlify.toml`; nothing to type.
- **CLI:** needs a Netlify personal access token from the client.
  `npx --yes netlify-cli deploy --build --prod`. `netlify-cli` v27.1.1
  was confirmed working in this environment. Interactive OAuth login
  does **not** work headless.

After deploying, set up the custom domain if the client has one.

### 3.2 Brokerage attribution + Equal Housing — BLOCKED ON CLIENT

**This is a compliance gap, not a polish item.** Cristal Rijo is a
REALTOR®, which means she works under a supervising licensed broker.
Massachusetts real-estate advertising regulations (254 CMR 3.00)
generally require the broker's or firm's name to appear in advertising.
"CRD Property Group" currently reads as a personal brand, and no
brokerage is named anywhere on the site.

Standard practice for a US agent site also includes an **Equal Housing
Opportunity** statement/logo and the agent's **license number**.

**Ask the client for:** brokerage name, brokerage address (if it
differs from the Wakefield office), and MA license number. Then add
them to the footer base in `src/components/sections/Contact.jsx`
(the `.footer-base` block) — alongside the existing copyright line.
Add an Equal Housing statement there too.

Do not invent a brokerage name. If the client says CRD Property Group
*is* the licensed entity, get that confirmed in writing before
shipping without a separate brokerage line.

### 3.3 Property Management section — BLOCKED ON CLIENT DECISION

The client's stated services are **Buyers • Sellers • Real Estate
Investment** — property management is *not* among them. But the site
carries a full Property Management section (chapter `03`, six
services), because an earlier brief specified one.

This was left in place deliberately rather than deleted on an
assumption. Resolve it:

- **If CRD does not manage property:** delete
  `src/components/sections/Management.jsx`, remove its import and
  `<Management />` from `src/App.jsx`, remove the `management` entry
  from `LINKS` in `src/components/ui/Nav.jsx`, remove the Management
  link from the footer in `Contact.jsx`, renumber `SectionHead`
  indices (Investment `04`→`03`, Why CRD `05`→`04`), and delete the
  `.management-*` and `.service-*` blocks from `global.css`.
- **If it does:** no change needed, but update the client's service
  list wording so the two stop contradicting each other.

### 3.4 Real-device testing — BLOCKED ON 3.1

All QA so far ran in headless Chromium with software rendering
(`--use-gl=swiftshader`). That is a good proxy for layout, overflow and
logic, but **not** for video decode performance. Once live, open on a
real iPhone and a real Android over cellular and confirm:

- The hero video autoplays (iOS Safari needs `muted` + `playsinline` —
  both are set, but verify).
- The investment video starts when scrolled into view and pauses when
  scrolled away.
- The 8 MB investment video does not stall the page on a slow
  connection.

---

### Optional / nice-to-have (not blocking launch)

- **Image optimisation.** The 13 chapter JPGs are 76–312 KB each,
  ~2.1 MB total. Converting to WebP/AVIF with `<picture>` fallbacks
  would roughly halve that. They are already `loading="lazy"`.
- **Investment video is 8.0 MB** (1920×1080, 15 s). A 720p variant
  with a `<source>` media query would help mobile. The hero video is
  3.7 MB / 1280×720 and is fine.
- **A contact form.** Currently `tel:` and `mailto:` only, which is
  reasonable for a solo agent. Netlify Forms would work with no backend.
- **Analytics** — none installed.
- **Favicon** is a generic gold SVG monogram in `index.html`. A real
  logo would be better.
- **4 unused photos** (`ch-entry` is used by Management; `ch-dining`,
  `ch-island`, `ch-skyline` are unused) — kept in case a future
  section wants them.

---

## 4. The client

**CRD Property Group** is **Cristal Rijo, REALTOR®** — Real Estate
Agent & Investor. Buyers, sellers and investors across **Boston and the
Massachusetts North Shore**. Spanish-speaking services available.

| Field | Value |
|---|---|
| Direct / mobile | `(781) 257-4696` → `tel:+17812574696` |
| Email | `cristalrijore@gmail.com` |
| Office | 20C Del Carmine Street, Wakefield, MA 01880 |
| Instagram | `@cristalrijorealty` |

**These details live in exactly two files — keep them in sync:**

1. `src/components/sections/Contact.jsx` — the constants at the top
   (`PHONE_DISPLAY`, `PHONE_HREF`, `EMAIL`, `INSTAGRAM`), plus the
   office address in the `contact-details` list and in the footer block.
2. `index.html` — meta description, `og:` tags, and the
   `RealEstateAgent` JSON-LD block (telephone, email, postal address,
   `knowsLanguage`, `areaServed`, `sameAs`).

---

## 5. Architecture

```
src/
  main.jsx                  — React root, imports global.css
  App.jsx                   — page shell; section order lives here
  components/
    sections/               — one file per page section, in page order
                              (numbers = the on-screen SectionHead index)
      Hero.jsx              — --  full-bleed looping drone film
      About.jsx             — 01  the CRD approach + disciplines
      Properties.jsx        — 02  editorial photo spread (8 images)
      Management.jsx        — 03  numbered service list  (see §3.3)
      Investment.jsx        — 04  flagship: film + 6 benefit cards
      WhyCRD.jsx            — 05  four pillars
      Contact.jsx           — --  CTA, agent identity, + the footer
    ui/
      Nav.jsx               — fixed header, anchor nav, progress rail,
                              active-section tracking, mobile menu
      Primitives.jsx        — SectionHead / Headline / Rise / Frame / Button
      Cursor.jsx            — gold cursor dot + ring (fine pointers only)
  hooks/
    useMagnetic.js          — buttons lean toward the cursor
    useIsMobile.js          — (max-width:820px), (pointer:coarse)
  lib/
    motion.js               — the entire reveal vocabulary
  styles/
    global.css              — design tokens + every section's styles
public/
  video/                    — 2 films + 2 posters (see §6)
  img/chapters/             — 13 real client photographs
```

**Section order is `App.jsx`.** Reordering the page means reordering
those imports. Every section is self-contained — there is no shared
runtime state between them, no global store, no `window.__*` hooks.
(An earlier architecture had a `journey` global; it is gone. If you see
references to `RoomStage`, `journey/rooms.js`, `BuildWithUs`,
`HeroCinematic` or `Overlay` in old commits, that is the **deleted**
architecture. Do not restore it.)

Hero and Contact deliberately carry no `SectionHead` index — the
numbered markers run 01–05 across the five content chapters only.

### Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build
```

Build output is ~50 KB gzipped JS + 5 KB gzipped CSS, plus media.

---

## 6. Media

| File | Size | Detail |
|---|---|---|
| `public/video/crd-drone-web.mp4` | 3.7 MB | 1280×720, 15.0 s, H.264, fast-start. Hero. |
| `public/video/crd-drone-poster.jpg` | 88 KB | Hero poster. |
| `public/video/crd-investment-web.mp4` | 8.0 MB | 1920×1080, 15.0 s, H.264, fast-start. Investment. |
| `public/video/crd-investment-poster.jpg` | 88 KB | Investment poster. |
| `public/img/chapters/*.jpg` | ~2.1 MB total | 13 real photographs, 1920×1080. |

Both videos were supplied already web-optimised — they were **not**
re-encoded. Any new video should be fast-start H.264 MP4 with a poster.

**Hero framing note:** the drone footage is treated as an aspirational
brand film, *not* as a specific active listing. The client was explicit
about this. The Properties captions are likewise generic ("The
Kitchen", "Primary Suites") rather than tied to one address.

---

## 7. Content rule: the Investment section

**A hard constraint, restated by the client in two separate briefs.**

The Investment section must never state or imply:

- a specific portfolio return or appreciation percentage
- a specific occupancy statistic
- guaranteed appreciation
- guaranteed cash flow
- any promise of profit

Every one of the six benefit cards in `Investment.jsx` is phrased as a
possibility — *"can"*, *"may"*, *"depending on"* — never a promise. Card
03 carries an explicit *"Appreciation is never guaranteed."* The
section closes with:

> Every investment is different. CRD evaluates each property on its
> actual condition, financing, market, operating costs and business plan.

Keep that pattern in any new copy. **Historical note:** the deleted
`Overlay.jsx` component contained an SVG "portfolio index" chart and
fabricated stats (9.4% appreciation, 98% occupancy, 15-year average
hold). Those were removed for this reason. Do not reintroduce them or
anything like them.

---

## 8. The self-clipping deadlock — read before touching any reveal

**This is the most likely way to break this codebase, and it fails
silently by hiding content outright.**

`whileInView` is backed by an IntersectionObserver. An element's
intersection rect is clipped by its ancestors' `overflow` **and** by its
own `clip-path`. That creates a deadlock for exactly the two effects
this site is built on:

1. **Masked headline lines.** `.line-inner` is parked at `y: 110%`
   inside a `.line-mask` with `overflow: hidden`. The line is clipped
   entirely out of its own intersection rect, so an observer on the
   line never fires, so it never animates in — invisible forever.
2. **Curtain-revealed media.** `clip-path: inset(0% 0% 100% 0%)` clips
   the element to zero height, so it never reports as intersecting, so
   it never un-clips — invisible forever.

**The fix, applied throughout:** the trigger lives on an *unclipped
parent*; the clipped child is driven by **variants**.

```jsx
// parent owns the trigger
<motion.figure initial="rest" whileInView="show" viewport={IN_VIEW_EARLY}>
  {/* clipped child is driven by it */}
  <motion.span className="frame-clip" variants={curtainV(delay)}>
    <motion.img variants={settleV(delay)} />
  </motion.span>
</motion.figure>
```

This is why `Frame` has a `.frame-clip` inner layer, why `Headline`
puts the trigger on the `<h2>`, and why `Investment.jsx` has an
`.investment-clip` inside `.investment-stage`. **Do not "simplify" any
of these by moving the trigger back onto the clipped element.**

**Also:** both `clipPath` keyframes must use the same units.
`inset(0 0 100% 0)` → `inset(0 0 0% 0)` will not interpolate and the
element stays fully clipped. Write all four values as percentages.

---

## 9. Design system

### Tokens (`global.css`) — do not change without asking

```css
--ink: #f4f1ec;      --ink-soft: rgba(244,241,236,.72);
--ink-dim: rgba(244,241,236,.52);  --ink-faint: rgba(244,241,236,.3);
--gold: #c2a061;     --gold-bright: #e3c689;   --gold-deep: #9c7f45;
--void: #050505;     --near: #0a0a0b;          --raise: #101012;
--hairline: rgba(244,241,236,.1);
--font-display: 'Cormorant Garamond', serif;
--font-body: 'Inter', sans-serif;
--gutter: clamp(1.4rem, 5vw, 6.5rem);
--bay: clamp(5.5rem, 13vh, 11rem);   /* vertical section rhythm */
--maxw: 1440px;
--ease: cubic-bezier(0.16, 1, 0.3, 1);
```

**Three rules govern the sheet:** space is the luxury; gold is
punctuation, never paint (hairlines, numerals, one CTA); type carries
the class — serif display against a quiet sans with real tracking
discipline.

Sections alternate ground tone (`--void` / `--near`) so the page reads
in strata, separated by hairline seams. Each carries a numbered marker
(`01 ——— The CRD Approach`).

### Motion (`src/lib/motion.js`)

| Export | Use |
|---|---|
| `fadeUp(delay, y, duration)` | Safe to spread on any element. |
| `settle(delay, duration)` | Standalone image, **no clipping ancestor**. |
| `lineReveal(delay)` | Variants — masked headline lines. |
| `curtainV(delay)` | Variants — media curtain wipe. |
| `settleV(delay)` | Variants — 1.12 → 1.00 push-in behind a curtain. |
| `fadeV(delay)` | Variants — captions, frames. |
| `drawLine(delay)` | scaleX 0 → 1 hairlines. |
| `IN_VIEW`, `IN_VIEW_EARLY` | Shared viewport configs. |

All reveals are `once: true`. Headlines lift out of masks; media opens
behind a curtain wipe while settling out of a push-in; hairlines draw
themselves across. Everything respects `prefers-reduced-motion` (see
the bottom of `global.css`).

**There is no GSAP in this project.** It was removed with the
scroll-scrub architecture — check `package.json` before reaching for
it. Framer Motion's `whileInView` covers everything here. Navigation is
native `scrollIntoView({ behavior: 'smooth' })` plus
`html { scroll-behavior: smooth }`; `section[id]` carries
`scroll-margin-top` so the fixed header doesn't cover section tops.

---

## 10. QA — how it was verified, and how to repeat it

Verified with a Vite dev server and headless Chromium via
`playwright-core`, software-rendered:

```js
chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=swiftshader', '--no-sandbox'],
})
```

**Covered:** 320 / 390 / 768 / 1366 / 1920 px. Zero console errors,
zero page errors, no horizontal overflow at any width, all reveals
resolve (verified by asserting no element retains `clip-path` with
`100%` or a non-identity transform after settling). Production build
clean. `tel:` / `mailto:` / Instagram links present; JSON-LD parses.

**Two gotchas when re-running this:**

- **Allow enough settle time.** Reveals take 1.0–1.8 s. Asserting too
  early reports elements as "stuck hidden" when they are merely
  mid-flight. Scroll the page, then wait ~3 s before asserting.
- **Screenshots catch mid-animation states.** A half-revealed headline
  in a screenshot is usually the capture moment, not a bug — confirm
  against computed styles before chasing it.

**Not covered:** real-device video decode. See §3.4.

---

## 11. Project history — why things are the way they are

Useful context so you don't "restore" something that was deliberately
removed:

1. Started as a cinematic 3D scroll site (Three.js / R3F / drei).
2. Client rejected all generated 3D as insufficiently photoreal, twice.
3. Pivoted to a hybrid: real video hero + CSS depth effects.
4. Client then rejected **all** generated imagery — Three.js deleted
   entirely, replaced with real client photography.
5. Built a scroll-scrubbed "one house, one camera, one journey" tour:
   11 rooms, virtual camera dolly, GSAP ScrollTrigger, a construction
   time-lapse act.
6. Client reversed course: *"Remove the slow forced 3D-style
   scrolling."* Supplied two new videos (drone + investment). The
   entire room-journey system, GSAP, and the old video assets were
   deleted; the site was rebuilt as a normal-scrolling page.
7. Art-direction pass: design system, editorial layouts, the reveal
   vocabulary in §8/§9.
8. Real contact details, geography corrections, SEO metadata + JSON-LD.

Commits `8b00f9a` → `f1000d7` → `dcead05` cover steps 6–8.

---

## 12. Do NOT do these things

- Do not reintroduce scroll-scrubbed video, pinned camera sections, or
  any "wait for the scene to catch up" navigation.
- Do not put a `whileInView` trigger on an element clipped by
  `clip-path` or an ancestor's `overflow: hidden` (§8).
- Do not add fabricated statistics anywhere in Investment (§7).
- Do not generate 3D geometry or synthetic property imagery.
- Do not let the investment video autoplay unconditionally.
- Do not add GSAP back for routine reveals.
- Do not invent a brokerage name, license number, or any credential the
  client has not supplied (§3.2).
- Do not rebuild the design. It is signed off.
