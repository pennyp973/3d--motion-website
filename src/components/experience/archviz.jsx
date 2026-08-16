import { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import helvBold from 'three/examples/fonts/helvetiker_bold.typeface.json'
import helvReg from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { mats } from './materials'

// Shared architectural-visualization plumbing: the site datums every
// scene module aligns to, deterministic randomness, an instanced-mesh
// helper, and dimensional lettering.

// ——— Site datums ———
// The hero property occupies footprint x ±17, z 0…-28 (front facade at
// z = 0, entrance on the +z axis). The interior tour, camera path,
// signage and rooftop all reference these numbers — a swapped-in GLB
// model is fitted to the same envelope by HeroProperty.
export const B = {
  W: 34,
  D: 28,
  PODIUM_H: 4.6,
  FLOOR_H: 3.28,
  FLOORS: 7,
  TOP: 4.6 + 7 * 3.28, // 27.56
  A_TOP: 4.6 + 5 * 3.28, // west wing height 21.0
}

const fontBold = new FontLoader().parse(helvBold)
const fontReg = new FontLoader().parse(helvReg)

export function smoothstep(a, b, x) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function InstancedList({ geometry, material, items, castShadow, receiveShadow }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    items.forEach((it, i) => {
      p.set(...it.pos)
      e.set(it.rotX || 0, it.rotY || 0, 0)
      q.setFromEuler(e)
      s.set(...(it.scale || [1, 1, 1]))
      m.compose(p, q, s)
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [items])
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, items.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
}

export function ExtrudedText({
  text,
  size = 0.5,
  depth = 0.1,
  material = mats.gold,
  bold = true,
  position = [0, 0, 0],
  rotationY = 0,
  align = 'center',
}) {
  const geometry = useMemo(() => {
    const g = new TextGeometry(text, {
      font: bold ? fontBold : fontReg,
      size,
      depth,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: depth * 0.15,
      bevelSize: size * 0.012,
      bevelSegments: 2,
    })
    g.computeBoundingBox()
    const bb = g.boundingBox
    const w = bb.max.x - bb.min.x
    const h = bb.max.y - bb.min.y
    const ox = align === 'center' ? -w / 2 : align === 'right' ? -w : 0
    g.translate(ox, -h / 2, 0)
    return g
  }, [text, size, depth, bold, align])

  return <mesh geometry={geometry} material={material} position={position} rotation-y={rotationY} castShadow />
}
