import { useMemo, useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import helvBold from 'three/examples/fonts/helvetiker_bold.typeface.json'
import helvReg from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { mats, geoms } from './materials'
import { journey } from '../../journey/journeyState'
import { TIMINGS } from '../../journey/chapters'

// ——— Building envelope ———
// Front facade z = 0, rear z = -28, width x ±17.
export const B = {
  W: 34,
  D: 28,
  PODIUM_H: 4.6,
  FLOOR_H: 3.28,
  FLOORS: 7,
  TOP: 4.6 + 7 * 3.28, // 27.56
}

const fontBold = new FontLoader().parse(helvBold)
const fontReg = new FontLoader().parse(helvReg)

function smoothstep(a, b, x) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

// Generic instanced mesh laid out from a list of {pos, scale, rotY}
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

// Extruded dimensional lettering (real geometry, not floating HTML)
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
    g.translate(ox - bb.min.x * 0, -h / 2 - bb.min.y * 0, 0)
    return g
  }, [text, size, depth, bold, align])

  return <mesh geometry={geometry} material={material} position={position} rotation-y={rotationY} castShadow />
}

// ——— Curtain wall tower (floors 2–8) ———
function Tower() {
  const { mullions, spandrels, glassBands } = useMemo(() => {
    const mullions = []
    const spandrels = []
    const glassBands = []
    const H = B.FLOORS * B.FLOOR_H
    const yMid = B.PODIUM_H + H / 2

    // Vertical mullions — full tower height
    const colsX = 17 // front & rear columns + edges
    for (let i = 0; i < colsX; i++) {
      const x = -B.W / 2 + (i * B.W) / (colsX - 1)
      mullions.push({ pos: [x, yMid, 0.07], scale: [0.09, H, 0.14] })
      mullions.push({ pos: [x, yMid, -B.D - 0.07], scale: [0.09, H, 0.14] })
    }
    const colsZ = 14
    for (let i = 0; i < colsZ; i++) {
      const z = -(i * B.D) / (colsZ - 1)
      mullions.push({ pos: [B.W / 2 + 0.07, yMid, z], scale: [0.14, H, 0.09] })
      mullions.push({ pos: [-B.W / 2 - 0.07, yMid, z], scale: [0.14, H, 0.09] })
    }

    // Floor spandrel bands + glass bands per floor, all four faces
    for (let f = 0; f <= B.FLOORS; f++) {
      const y = B.PODIUM_H + f * B.FLOOR_H
      spandrels.push({ pos: [0, y, 0.05], scale: [B.W + 0.3, 0.5, 0.2] })
      spandrels.push({ pos: [0, y, -B.D - 0.05], scale: [B.W + 0.3, 0.5, 0.2] })
      spandrels.push({ pos: [B.W / 2 + 0.05, y, -B.D / 2], scale: [0.2, 0.5, B.D + 0.3] })
      spandrels.push({ pos: [-B.W / 2 - 0.05, y, -B.D / 2], scale: [0.2, 0.5, B.D + 0.3] })
      if (f < B.FLOORS) {
        const gy = y + B.FLOOR_H / 2 + 0.1
        glassBands.push({ pos: [0, gy, 0], scale: [B.W, B.FLOOR_H - 0.5, 1] })
        glassBands.push({ pos: [0, gy, -B.D], scale: [B.W, B.FLOOR_H - 0.5, 1], rotY: Math.PI })
        glassBands.push({ pos: [B.W / 2, gy, -B.D / 2], scale: [B.D, B.FLOOR_H - 0.5, 1], rotY: Math.PI / 2 })
        glassBands.push({ pos: [-B.W / 2, gy, -B.D / 2], scale: [B.D, B.FLOOR_H - 0.5, 1], rotY: -Math.PI / 2 })
      }
    }
    return { mullions, spandrels, glassBands }
  }, [])

  return (
    <group>
      <InstancedList geometry={geoms.box} material={mats.mullion} items={mullions} />
      <InstancedList geometry={geoms.box} material={mats.darkMetal} items={spandrels} />
      {glassBands.map((g, i) => (
        <mesh
          key={i}
          geometry={geoms.plane}
          material={mats.glass}
          position={g.pos}
          rotation-y={g.rotY || 0}
          scale={[g.scale[0], g.scale[1], 1]}
        />
      ))}
      {/* Solid core behind the glass so the tower reads as a body, not a shell */}
      <mesh position={[0, B.PODIUM_H + (B.FLOORS * B.FLOOR_H) / 2, -B.D / 2]} material={mats.towerDark}>
        <boxGeometry args={[B.W - 1.2, B.FLOORS * B.FLOOR_H, B.D - 1.2]} />
      </mesh>
    </group>
  )
}

// ——— Vertical fins — the "assembly" moment of the descent ———
function Fins() {
  const ref = useRef()
  const data = useMemo(() => {
    const rng = mulberry32(91)
    const fins = []
    const cols = 17
    for (let i = 0; i < cols; i++) {
      const x = -B.W / 2 + (i * B.W) / (cols - 1)
      fins.push({ x, drop: 2.2 + rng() * 2.4, delay: rng() * 0.3 })
    }
    return fins
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const [a0, a1] = TIMINGS.assemble
    const t = smoothstep(a0, a1, journey.smooth)
    const m = new THREE.Matrix4()
    const H = B.FLOORS * B.FLOOR_H
    data.forEach((fin, i) => {
      const local = smoothstep(fin.delay, 1, t)
      const y = B.PODIUM_H + H / 2 + (1 - local) * fin.drop
      m.makeScale(0.26, H, 0.55)
      m.setPosition(fin.x, y, 0.32)
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={ref} args={[geoms.box, mats.darkMetal, data.length]} castShadow />
}

// ——— Lit interior cells behind the curtain wall ———
function LitCells() {
  const ref = useRef()
  const lastAct = useRef(-1)

  const cells = useMemo(() => {
    const rng = mulberry32(2024)
    const out = []
    const push = (pos, rotY) => {
      const warm = rng() > 0.25
      const b = 0.55 + rng() * 0.75
      out.push({
        pos,
        rotY,
        threshold: rng() * 0.85 + 0.08,
        color: warm
          ? new THREE.Color(1.7 * b, 1.2 * b, 0.62 * b)
          : new THREE.Color(0.85 * b, 0.95 * b, 1.15 * b),
      })
    }
    for (let f = 0; f < B.FLOORS; f++) {
      const y = B.PODIUM_H + f * B.FLOOR_H + B.FLOOR_H / 2 + 0.1
      for (let c = 0; c < 16; c++) {
        const x = -B.W / 2 + 1.06 + c * 2.125
        if (rng() > 0.52) push([x, y, -0.42], 0)
        if (rng() > 0.55) push([x, y, -B.D + 0.42], Math.PI)
      }
      for (let c = 0; c < 13; c++) {
        const z = -1.05 - c * 2.15
        if (rng() > 0.68) push([B.W / 2 - 0.42, y, z], Math.PI / 2)
        if (rng() > 0.68) push([-B.W / 2 + 0.42, y, z], -Math.PI / 2)
      }
    }
    return out
  }, [])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    cells.forEach((c, i) => {
      e.set(0, c.rotY, 0)
      q.setFromEuler(e)
      m.compose(new THREE.Vector3(...c.pos), q, new THREE.Vector3(1.8, 2.5, 1))
      ref.current.setMatrixAt(i, m)
      ref.current.setColorAt(i, new THREE.Color(0.01, 0.01, 0.012))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [cells])

  useFrame((state) => {
    const [w0, w1] = TIMINGS.awaken
    const act = smoothstep(w0, w1, Math.max(journey.smooth, state.clock.elapsedTime * 0.028))
    if (Math.abs(act - lastAct.current) < 0.004 || !ref.current) return
    lastAct.current = act
    const c = new THREE.Color()
    cells.forEach((cell, i) => {
      const on = smoothstep(cell.threshold - 0.12, cell.threshold, act)
      c.copy(cell.color).multiplyScalar(on).addScalar(0.012)
      ref.current.setColorAt(i, c)
    })
    ref.current.instanceColor.needsUpdate = true
  })

  const litMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    []
  )
  return <instancedMesh ref={ref} args={[geoms.plane, litMat, cells.length]} />
}

// ——— Podium: stone base, entrance recess, canopy, sliding doors ———
function Podium() {
  const doorL = useRef()
  const doorR = useRef()
  const canopyGlow = useRef()

  useFrame((state) => {
    const open = smoothstep(TIMINGS.doors[0], TIMINGS.doors[1], journey.smooth)
    if (doorL.current) doorL.current.position.x = -0.55 - open * 1.18
    if (doorR.current) doorR.current.position.x = 0.55 + open * 1.18
    if (canopyGlow.current) {
      const awaken = smoothstep(0.0, 0.08, Math.max(journey.smooth, state.clock.elapsedTime * 0.05))
      canopyGlow.current.material.opacity = awaken
    }
  })

  const vitrines = useMemo(() => {
    const v = []
    ;[-13.2, -9.4, 9.4, 13.2].forEach((x) => v.push({ pos: [x, 2.1, 0.06], scale: [2.7, 2.3, 1] }))
    return v
  }, [])

  return (
    <group>
      {/* stone wings */}
      <mesh position={[-10.6, B.PODIUM_H / 2, -0.35]} material={mats.stoneDark} castShadow receiveShadow>
        <boxGeometry args={[12.8, B.PODIUM_H, 1]} />
      </mesh>
      <mesh position={[10.6, B.PODIUM_H / 2, -0.35]} material={mats.stoneDark} castShadow receiveShadow>
        <boxGeometry args={[12.8, B.PODIUM_H, 1]} />
      </mesh>
      {/* band above the entrance carrying the wordmark */}
      <mesh position={[0, 4.15, -0.35]} material={mats.stoneDark} castShadow>
        <boxGeometry args={[8.4, 0.9, 1]} />
      </mesh>
      {/* rear wings framing the residence glazing */}
      <mesh position={[-12.5, B.PODIUM_H / 2, -B.D + 0.35]} material={mats.stoneDark} receiveShadow>
        <boxGeometry args={[9, B.PODIUM_H, 1]} />
      </mesh>
      <mesh position={[12.5, B.PODIUM_H / 2, -B.D + 0.35]} material={mats.stoneDark} receiveShadow>
        <boxGeometry args={[9, B.PODIUM_H, 1]} />
      </mesh>
      <mesh position={[0, 4.05, -B.D + 0.35]} material={mats.stoneDark}>
        <boxGeometry args={[16, 1.1, 1]} />
      </mesh>
      {/* podium sides + rear skirt */}
      <mesh position={[B.W / 2 - 0.5, B.PODIUM_H / 2, -B.D / 2]} material={mats.stoneDark} receiveShadow>
        <boxGeometry args={[1, B.PODIUM_H, B.D]} />
      </mesh>
      <mesh position={[-B.W / 2 + 0.5, B.PODIUM_H / 2, -B.D / 2]} material={mats.stoneDark} receiveShadow>
        <boxGeometry args={[1, B.PODIUM_H, B.D]} />
      </mesh>

      {/* vitrines — warm lit display glass in the wings */}
      <InstancedList geometry={geoms.plane} material={mats.warmLightSoft} items={vitrines} />
      {vitrines.map((v, i) => (
        <mesh key={i} geometry={geoms.plane} material={mats.glass} position={[v.pos[0], v.pos[1], 0.12]} scale={[2.9, 2.5, 1]} />
      ))}

      {/* entrance recess: side piers + glass wall + sliding doors */}
      <mesh position={[-3.6, 2.05, -0.8]} material={mats.stone} castShadow>
        <boxGeometry args={[0.8, 4.1, 1.9]} />
      </mesh>
      <mesh position={[3.6, 2.05, -0.8]} material={mats.stone} castShadow>
        <boxGeometry args={[0.8, 4.1, 1.9]} />
      </mesh>
      {/* fixed glazing beside the doors */}
      <mesh geometry={geoms.plane} material={mats.clearGlass} position={[-2.3, 1.95, -1.5]} scale={[1.8, 3.5, 1]} />
      <mesh geometry={geoms.plane} material={mats.clearGlass} position={[2.3, 1.95, -1.5]} scale={[1.8, 3.5, 1]} />
      {/* header over doors */}
      <mesh position={[0, 3.9, -1.5]} material={mats.mullion}>
        <boxGeometry args={[7.4, 0.35, 0.16]} />
      </mesh>
      {/* sliding door panels */}
      <group>
        <mesh ref={doorL} geometry={geoms.plane} material={mats.clearGlass} position={[-0.55, 1.62, -1.52]} scale={[1.12, 2.95, 1]} />
        <mesh ref={doorR} geometry={geoms.plane} material={mats.clearGlass} position={[0.55, 1.62, -1.52]} scale={[1.12, 2.95, 1]} />
      </group>
      {/* gold door frames */}
      <mesh position={[-1.35, 1.62, -1.5]} material={mats.gold}>
        <boxGeometry args={[0.07, 3.1, 0.1]} />
      </mesh>
      <mesh position={[1.35, 1.62, -1.5]} material={mats.gold}>
        <boxGeometry args={[0.07, 3.1, 0.1]} />
      </mesh>

      {/* canopy with lit soffit */}
      <mesh position={[0, 3.62, 1.55]} material={mats.canopy} castShadow>
        <boxGeometry args={[7.2, 0.16, 3.4]} />
      </mesh>
      <mesh position={[0, 3.7, 3.2]} material={mats.gold}>
        <boxGeometry args={[7.2, 0.05, 0.1]} />
      </mesh>
      <mesh ref={canopyGlow} geometry={geoms.plane} rotation-x={Math.PI / 2} position={[0, 3.53, 1.55]}>
        <meshBasicMaterial color={new THREE.Color(1.15, 0.9, 0.58)} toneMapped={false} transparent opacity={0} />
      </mesh>

      {/* recess floor + step */}
      <mesh position={[0, 0.02, 0.1]} material={mats.paver} receiveShadow>
        <boxGeometry args={[8, 0.06, 3.6]} />
      </mesh>
    </group>
  )
}

// ——— Roof: parapet, penthouse block, rooftop CRD sign ———
function Roof() {
  const trim = useRef()

  useFrame(() => {
    const t = smoothstep(TIMINGS.assemble[0], TIMINGS.assemble[1], journey.smooth)
    if (trim.current) trim.current.scale.x = Math.max(t, 0.0001)
  })

  const parapets = useMemo(
    () => [
      { pos: [0, B.TOP + 0.3, 0], scale: [B.W + 0.4, 0.6, 0.2] },
      { pos: [0, B.TOP + 0.3, -B.D], scale: [B.W + 0.4, 0.6, 0.2] },
      { pos: [B.W / 2, B.TOP + 0.3, -B.D / 2], scale: [0.2, 0.6, B.D + 0.4] },
      { pos: [-B.W / 2, B.TOP + 0.3, -B.D / 2], scale: [0.2, 0.6, B.D + 0.4] },
    ],
    []
  )

  return (
    <group>
      <InstancedList geometry={geoms.box} material={mats.darkMetal} items={parapets} />
      {/* gold parapet trim resolves into place during the descent */}
      <mesh ref={trim} position={[0, B.TOP + 0.62, 0.05]} material={mats.goldBright}>
        <boxGeometry args={[B.W + 0.4, 0.07, 0.24]} />
      </mesh>
      {/* roof slab */}
      <mesh position={[0, B.TOP + 0.02, -B.D / 2]} material={mats.concrete} receiveShadow>
        <boxGeometry args={[B.W, 0.12, B.D]} />
      </mesh>
      {/* penthouse mechanical block */}
      <mesh position={[0, B.TOP + 1.4, -24]} material={mats.darkMetal} castShadow>
        <boxGeometry args={[12, 2.8, 4]} />
      </mesh>
      {/* rooftop CRD sign on the terrace-facing face */}
      <ExtrudedText
        text="CRD"
        size={1.35}
        depth={0.22}
        material={mats.goldBright}
        position={[0, B.TOP + 1.55, -21.9]}
      />
      <mesh position={[0, B.TOP + 0.6, -21.92]} material={mats.warmLightSoft}>
        <boxGeometry args={[6.4, 0.05, 0.05]} />
      </mesh>
    </group>
  )
}

// ——— Facade wordmark above the canopy ———
function FacadeSignage() {
  return (
    <group>
      <ExtrudedText
        text="CRD PROPERTY GROUP"
        size={0.4}
        depth={0.09}
        material={mats.goldBright}
        position={[0, 4.15, 0.22]}
      />
      {/* hairline gold rule under the letters */}
      <mesh position={[0, 3.82, 0.2]} material={mats.gold}>
        <boxGeometry args={[7.6, 0.03, 0.05]} />
      </mesh>
    </group>
  )
}

export default function Building({ isMobile }) {
  return (
    <group>
      <Tower />
      {!isMobile && <Fins />}
      <LitCells />
      <Podium />
      <FacadeSignage />
      <Roof />
    </group>
  )
}

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
