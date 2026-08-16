# CRD hero property model

Drop your professional architectural model here as:

    crd-property.glb

It replaces the procedural placeholder automatically — no code changes.
Loader: `src/components/experience/HeroProperty.jsx`.

Model conventions (standard glTF 2.0):

- Units in **meters**, **Y-up**, front facade facing **+Z**
- Auto-fit (default) uniformly scales and positions the model so its
  footprint fills the site envelope: width <= 34 m, ground at y = 0,
  front facade on the z = 0 line — the camera journey, landscaping and
  signage all align to that envelope
- For manual placement, set `AUTO_FIT = false` in HeroProperty.jsx and
  use `MODEL_TRANSFORM`
- Draco compression is supported (decoder served from /public/draco)
- PBR materials (metallic-roughness) render under a blue-hour HDRI with
  ACES filmic tone mapping; shadows and env reflections are enabled on
  every mesh at load
- Keep the file web-friendly: ideally < 25 MB, 1–2K textures

`veg/` contains CC0 planting models (Poly Haven) used by the landscape.
