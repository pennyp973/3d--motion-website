# CRD Property Group — Claude Handoff

Work from branch: `chatgpt/crd-two-video-luxury-site`.

Goal: convert the current CRD site from slow scroll-scrub/3D-style navigation into a faster luxury motion website using TWO cinematic videos.

## Video placement

Place these files in `public/video/`:
- `crd-drone.mp4` — HERO video at the top of the page
- `crd-investment.mp4` — INVESTMENT section video farther down the page

## Hero direction
- Full-viewport cinematic hero using `crd-drone.mp4`
- autoplay, muted, playsInline
- do NOT require the visitor to scrub the video with scroll
- keep CRD black/white/gold branding
- overlay: CRD Property Group / Property. Elevated.
- CTA buttons: Explore Investment and Work With CRD
- normal site navigation should remain fast and clickable

## Investment section
Create a premium full-width section around `crd-investment.mp4`.

Headline direction:
**Own more than a property. Build an asset.**

Explain the potential benefits of multifamily ownership and new construction without promising returns or using invented statistics:
- multiple rental income sources across several units
- operating scale and efficiencies from multiple units under one roof
- potential long-term equity/value creation through operations, improvements, and market appreciation
- new-construction benefits such as modern systems, current layouts, energy-efficiency potential, and greater control over the finished product
- ownership-minded property management and long-term planning

Include concise cards or motion-reveal callouts for these benefits.

## UX direction
- remove or disable giant artificial scroll distances
- no 3D/WebGL requirement
- no long forced scroll-scrub sections
- keep cinematic motion, subtle parallax, GSAP/Framer Motion reveals where useful
- prioritize normal smooth scrolling and instant navigation
- retain premium typography, dark palette, gold accents, glass details, and responsive behavior
- keep performance high: pause offscreen videos with IntersectionObserver if useful

## Tone
High-end Massachusetts real-estate investment company. Sophisticated, architectural, trustworthy, cinematic, not flashy, not game-like, not cartoonish.

## Important
Do not use fake financial performance statistics, guaranteed-return language, or fabricated CRD facts. Keep investment copy educational and general unless verified company data is already present in the repo.
