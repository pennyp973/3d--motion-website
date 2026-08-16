import { Component, Suspense, useEffect, useMemo, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { B } from './archviz'
import ProceduralBuilding from './ProceduralBuilding'

// ————————————————————————————————————————————————————————————————
// HeroProperty — the CRD hero building.
//
// Drop a professional architectural model at
//
//     /public/models/crd-property.glb
//
// and it becomes the hero property automatically — no code changes.
// Until then (or if the file fails to load) the procedural placeholder
// in ProceduralBuilding.jsx renders instead.
//
// Model conventions (standard glTF):
//   · units: meters, Y-up, front facade facing +Z
//   · with AUTO_FIT on (default), the model is uniformly scaled and
//     positioned so its footprint fills the site envelope:
//     width ≤ 34 m (x ±17), ground at y = 0, front facade at z = 0
//   · Draco-compressed geometry is supported (decoder served locally
//     from /public/draco — no CDN dependency)
//   · PBR materials render under the site's blue-hour HDRI with ACES
//     tone mapping; shadows and reflections are enabled on every mesh
//
// Manual placement: set AUTO_FIT to false and use MODEL_TRANSFORM.
// ————————————————————————————————————————————————————————————————

export const MODEL_URL = '/models/crd-property.glb'
const DRACO_PATH = '/draco/'

const AUTO_FIT = true
const MODEL_TRANSFORM = {
  position: [0, 0, 0],
  rotationY: 0,
  scale: 1,
}

// Normalizes a loaded scene for this site's renderer: shadow flags on,
// sane reflection intensity, crisp textures, and correct transparency
// sorting for glass.
function prepareScene(scene) {
  scene.traverse((o) => {
    if (!o.isMesh) return
    o.castShadow = true
    o.receiveShadow = true
    const materials = Array.isArray(o.material) ? o.material : [o.material]
    materials.forEach((m) => {
      if (!m) return
      if ('envMapIntensity' in m && m.envMapIntensity === 1) m.envMapIntensity = 0.9
      if (m.map) m.map.anisotropy = 8
      const isGlass =
        (m.transmission !== undefined && m.transmission > 0) ||
        (m.transparent && m.opacity < 0.98)
      if (isGlass) {
        m.depthWrite = false
        m.side = THREE.FrontSide
      }
      m.needsUpdate = true
    })
  })
}

// Computes the transform that fits the model to the site envelope:
// footprint centred on (0, -D/2), grounded at y = 0, front face at z = 0.
function fitToSite(scene) {
  const box = new THREE.Box3().setFromObject(scene)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)
  if (size.x <= 0 || size.z <= 0) return { scale: 1, position: [0, 0, 0] }

  // Uniform scale so the larger footprint axis fills the envelope
  const scale = Math.min(B.W / size.x, (B.D + 8) / size.z)
  return {
    scale,
    position: [
      -center.x * scale,
      -box.min.y * scale,
      // front face of the model lands on the z = 0 facade line
      -box.max.z * scale,
    ],
  }
}

function GLBProperty() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH)

  const { fitted, transform } = useMemo(() => {
    prepareScene(scene)
    if (!AUTO_FIT) return { fitted: scene, transform: MODEL_TRANSFORM }
    const fit = fitToSite(scene)
    return {
      fitted: scene,
      transform: {
        position: fit.position,
        rotationY: MODEL_TRANSFORM.rotationY,
        scale: fit.scale * MODEL_TRANSFORM.scale,
      },
    }
  }, [scene])

  return (
    <primitive
      object={fitted}
      position={transform.position}
      rotation-y={transform.rotationY}
      scale={transform.scale}
    />
  )
}

// Load failures (corrupt file, bad export, network) fall back to the
// placeholder instead of blanking the site.
class ModelBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('[HeroProperty] model failed to load, using placeholder:', err?.message)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

// Probe once per session. The dev/preview servers answer missing asset
// paths with the SPA's index.html, so a text/html content-type means
// "no model present" even when the response is 200.
function useModelAvailable() {
  const [available, setAvailable] = useState(false)
  useEffect(() => {
    let alive = true
    fetch(MODEL_URL, { method: 'HEAD' })
      .then((r) => {
        const ct = r.headers.get('content-type') || ''
        if (alive) setAvailable(r.ok && !ct.includes('text/html'))
      })
      .catch(() => alive && setAvailable(false))
    return () => {
      alive = false
    }
  }, [])
  return available
}

export default function HeroProperty({ isMobile }) {
  const available = useModelAvailable()
  const fallback = <ProceduralBuilding isMobile={isMobile} />

  if (!available) return fallback

  return (
    <ModelBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLBProperty />
      </Suspense>
    </ModelBoundary>
  )
}
