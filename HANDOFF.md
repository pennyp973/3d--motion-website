# CRD Property Group — Engineering Handoff

Everything another developer or AI agent needs to pick this project up.
Read the **Do Not Do** section before writing any code.

---

## 1. What this is

A marketing site for **CRD Property Group**, a real estate / property
management / investment company in the Boston, Massachusetts area.

The concept is *the property is the website*. There are two acts:

- **Act I — the film hero.** A pinned, full-screen section where scrolling
  scrubs a 15-second cinematic video of a real CRD property forward and
  backward (exterior at dusk → approach → front door opening → interiors →
  rooftop CRD plaque against the Boston skyline). Brand typography,
  captions, a gold progress rail and pointer-driven perspective are layered
  over the film in real time.
- **Act II — the chapter journey.** The film dissolves into a sequence of
  full-screen content chapters (About, The Property, Management,
  Properties, Investment, Services, Contact), each set over a real
  photograph of the property that crossfades with slow cinematic drift.

Everything the visitor sees of the property is **real client footage and
photography**. There is no 3D rendering, no generated imagery.

**Live coordinates**

| | |
|---|---|
| Repo | `pennyp973/3d--motion-website` |
| Working branch | `claude/cinematic-3d-react-site-7r64pw` |
| Pull request | #1 (open, tracks the branch) |
| Deploy target | Netlify (config committed, not yet connected) |

---

## 2. Do NOT do these things

These are hard constraints from the client, learned the expensive way.

**Do not add 3D rendering of the building.** Earlier versions built the
property as procedural Three.js geometry — twice, the second time with PBR
textures, HDRI lighting and a GLB loader. The client rejected both as
"cartoonish" and finally said: *"I want nothing to do with it... only use
the [photos] I provided."* All Three.js code and dependencies were deleted
in commit `87704fc`. Do not reintroduce `three`, `@react-three/fiber`,
`@react-three/drei`, or generated building imagery. If a scene needs a new
visual, it comes from client footage or client photography.

**Do not make the room transitions uniform.** Each threshold in
`rooms.js` has an `enter` kind that means something physical: `rise`
(climbing to the bedroom floor), `wall` (passing a door into dining or
the garage), `light` (stepping outside), `focus` (pulling onto a
detail). Keep new rooms honest to that vocabulary.

**Do not map build scroll linearly to video time.** The building goes
up in the first ~19% of that footage; `toVideoTime()` in
`BuildWithUs.jsx` remaps each stage's quarter of scroll onto the frames
that actually belong to it. A linear map races past the construction.

**Do not use `gsap.ticker.add()` for a persistent loop.** GSAP's ticker
sleeps when no tweens are active, which silently freezes anything driven by
it. This caused a bug where every chapter past the second one stayed
invisible. Use the `useRafLoop` hook (`src/hooks/useRafLoop.js`) for
always-on per-frame work.

**Do not compute scroll targets against the document.** The hero section
occupies 420vh before the journey begins, so `progress * documentHeight` is
wrong. Always use `scrollToJourney(p)` from `src/journey/scrollTo.js`,
which measures against the `#journey-track` element.

**Do not remove `gsap.ticker.lagSmoothing(0)`** in `src/App.jsx`. Without
it, GSAP fakes elapsed time during frame jank and scroll-synced motion
drifts out of sync with the scrollbar.

**Do not re-encode the hero video without keyframe-dense settings.** See
§6; ordinary encoding makes scrubbing stutter badly.

---

## 3. Stack and commands

React 18 + Vite. GSAP (ScrollTrigger, ScrollToPlugin) for scroll. Framer
Motion for typography and UI animation. No CSS framework — a small token
system in `src/styles/global.css`. No backend; fully static.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build
```

Bundle is ~410 KB of JS total (~140 KB gzipped). Media dominates payload:
28 MB of video, 1.6 MB of images, all long-cached via `netlify.toml`.

---

## 4. File map

```
src/
  App.jsx                  The four acts; the residence ScrollTrigger;
                           lagSmoothing(0)
  journey/
    rooms.js               THE SCRIPT. Room order, camera moves,
                           threshold kinds, copy, facts, scroll weights,
                           nav targets, derived ROOM_WINDOWS + JOURNEY_VH
    journeyState.js        Shared mutable state (see §5)
    scrollTo.js            scrollToJourney(p) / scrollToAnchor(id)
  components/
    rooms/
      RoomStage.jsx        THE CAMERA. Per-room dolly, doorway
                           transitions, threshold vocabulary, depth
                           layers, bloom, parallax; owns journey damping
      RoomInfo.jsx         Progressive room details
      RoomNavigator.jsx    Vertical plan + "03 / 11 — KITCHEN" counter
    build/
      BuildWithUs.jsx      Scrubbed construction sequence, stage chips,
                           completion meter, toVideoTime() remap
    closing/
      ClosingSection.jsx   The invitation
    ui/
      HeroCinematic.jsx    The arrival film (clipped at CLIP_END)
      Overlay.jsx          Business chapters, anchored to rooms
      Nav.jsx              Fixed header; rooms and anchors
      Loader.jsx           Opening curtain, gated on video buffering
      Cursor.jsx           Gold dot + lagging ring (fine pointers only)
      RevealText.jsx       Masked line-by-line reveal helper
  hooks/
    useRafLoop.js          Always-on requestAnimationFrame loop
    useMagnetic.js         Buttons lean toward the cursor
    useIsMobile.js         Viewport/pointer media query
  styles/global.css        Tokens, typography, stage, rooms, build, closing

public/
  video/                   Two scrub-optimised films (hero + build),
                           1080p + 720p, H.264 + VP9, posters
  img/chapters/            13 room photographs (1920×1080 JPG)
netlify.toml               Build config + immutable media caching
```

---

## 5. How the scroll system works

This is the least obvious part of the codebase. There are **two
independent ScrollTriggers** writing into **one shared mutable object**,
which several rAF loops read every frame. State lives outside React so
per-frame updates never trigger re-renders.

`src/journey/journeyState.js` exports `journey`:

| Field | Written by | Meaning |
|---|---|---|
| `heroProgress` | HeroCinematic | 0→1 through the film hero |
| `progress` | App.jsx | 0→1 through the chapter journey (raw) |
| `smooth` | RoomStage | inertia-damped `progress` — **read this** |
| `mouse` / `smoothMouse` | RoomStage | pointer position, raw and lerped |
| `roomIndex` | RoomStage | which room the camera is inside |
| `buildProgress` | BuildWithUs | 0→1 through the construction |
| `ready` | Loader | true once the opening curtain lifts |

It is also exposed as `window.__journey` for debugging and automated
testing (see §8).

**Act I.** A ScrollTrigger on the 560vh hero section writes progress to a
local target. A rAF loop damps toward it (λ≈4.6) and sets
`video.currentTime = t * duration * CLIP_END`. Damping is what makes
scrubbing feel weighted rather than jittery.

**Act II.** A ScrollTrigger on `#journey-track` (`JOURNEY_VH`, derived
from the room weights) writes `journey.progress`. RoomStage's rAF loop
damps it into `journey.smooth` (λ≈2.1 — deliberately slower than the
film), then for every room computes an `enter`/`exit` pair from its
window, a dolly position, a depth scale, and a threshold treatment.
RoomInfo, Overlay and RoomNavigator all read `journey.smooth`.

**Act III** repeats the Act I pattern with its own ScrollTrigger and
the `toVideoTime()` remap.

**The hero gate.** Acts II's layers sit behind the hero in the document,
so RoomStage, RoomInfo and Overlay each multiply opacity by a gate
derived from `heroProgress`. Content stays hidden until the film is ~90%
complete. If rooms ever appear during the film, this gate is the cause.

**Room windows.** `ROOM_WINDOWS` in `rooms.js` divides 0→1 into one
`[start, end]` per room, proportional to `weight`. Everything — camera,
copy, navigator, deep links — derives from those windows, so changing a
weight re-times the whole tour consistently.

**Chapter timeline.** `CHAPTERS` in `chapters.js` maps each chapter to a
`[start, end]` range in 0→1 progress space plus a `center` used by
navigation. Backdrop boundaries live separately in `PhotoStage.jsx` because
the Services chapter cycles three photographs against its three rotating
captions.

---

## 6. Media pipeline

**Video.** The client supplied a 1920×1080 HEVC master. HEVC does not play
in most browsers, and ordinary encoding scrubs badly because seeking must
decode from distant keyframes. The committed variants were produced with:

```bash
ffmpeg -i master.mp4 -c:v libx264 -preset slow -crf 22 -profile:v high \
  -g 4 -bf 0 -pix_fmt yuv420p -an -movflags +faststart crd-hero-1080.mp4
```

The critical flags: `-g 4` (keyframe every 4 frames — makes seeking
near-instant), `-bf 0` (no B-frames), `-movflags +faststart` (metadata
first so playback can begin before full download). A 720p variant and VP9
WebM fallbacks exist alongside. `HeroCinematic.jsx` picks 720p on
small/coarse-pointer devices. Video is `muted` and `playsInline`, required
for programmatic control on iOS.

**Photography.** Ten 1920×1080 JPGs in `public/img/chapters/`. Six are
client photographs (kitchen, living, staircase, bedroom, bathroom, garage);
four are frames extracted from the hero film (exterior, approach, door
hardware, skyline). Swapping any backdrop is a file replacement — same
filename, same dimensions, no code change.

---

## 7. What is placeholder and needs real data

| Item | Where | Current placeholder |
|---|---|---|
| Contact email | `Overlay.jsx` (Contact chapter) | `hello@crdpropertygroup.com` |
| Partnerships email | `Overlay.jsx` | `partners@crdpropertygroup.com` |
| Phone | `Overlay.jsx` | `+1 (617) 555-0148` — a fake 555 number |
| Investment stats | `Overlay.jsx` (`INVEST_STATS`) | 9.4% / 98% / 15 yrs — invented |
| Service descriptions | `Overlay.jsx` | plausible but unverified copy |
| Favicon | `index.html` | generic building glyph, not the CRD mark |

**Known content issue in the source video:** the bronze plaques visible at
roughly 11s and 13s read **"CRD Property Property"** — apparently a
placeholder in the footage itself. It appears in two prominent hero
moments. Fixing it requires a re-render of the video by whoever produced
it, not a code change.

---

## 8. Testing approach

There is no test suite. Verification has been done by driving a real
browser with Playwright and inspecting screenshots. The pattern that works:

```js
// scroll to a known point in the journey and wait for the damped
// value to actually converge before screenshotting
const geom = await page.evaluate(() => {
  const t = document.getElementById('journey-track')
  return { top: t.offsetTop, span: t.offsetHeight - window.innerHeight }
})
await page.evaluate((y) => window.scrollTo(0, y), geom.top + 0.465 * geom.span)
await page.waitForFunction(
  (t) => Math.abs(window.__journey.smooth - t) < 0.005, 0.465,
  { polling: 400 }
)
```

Always wait for convergence rather than a fixed timeout — everything is
inertia-damped, so a screenshot taken too early shows a mid-transition
frame. Note that headless Chromium decodes video in software and runs
several times slower than real hardware; entrance animations that appear
sluggish in tests are fine in a real browser.

---

## 9. Suggested next steps

Roughly in priority order:

1. **Replace the placeholder contact details and stats** (§7) with real
   values from the client.
2. **Connect Netlify.** Import the repo; `netlify.toml` already declares
   the build command, publish directory and cache headers. Then point the
   real domain at it.
3. **Add a working contact form.** Currently the CTAs are `mailto:` links.
   Netlify Forms needs no backend and suits a static site.
4. **SEO and social.** Open Graph image and description, sitemap, a proper
   favicon from the CRD mark.
5. **Analytics** — Plausible or GA4.
6. **Verify on real devices.** Scroll feel and video decode performance
   have only been checked in software-rendered headless Chromium. Test the
   hero scrub on a mid-range phone before launch; if it struggles, the
   fallback is an image-sequence approach instead of video scrubbing.

---

## 10. Design system quick reference

Tokens live at the top of `src/styles/global.css`.

- **Ground:** near-black `#050505`, with `#07090d` behind the film.
- **Text:** warm off-white `#f2efe9`, dimmed and faint variants for
  hierarchy.
- **Accent:** metallic gold `#c2a061` (bright `#e3c689`). Used sparingly —
  rules, the progress rail, one solid CTA, small numerals. Black and white
  dominate; gold accents.
- **Display type:** Cormorant Garamond, light weight, large. Used for
  chapter headlines and figures.
- **Body/UI type:** Inter. Small sizes carry wide letter-spacing and
  uppercase for eyebrows and labels.
- **Motion:** everything eases on `cubic-bezier(0.22, 1, 0.36, 1)`;
  scroll-linked values are exponentially damped, never linear.
- `prefers-reduced-motion` disables parallax and entrance animations
  throughout.
