import { useMemo, useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats, geoms, sets, pbrMaterial } from './materials'
import { journey } from '../../journey/journeyState'
import { TIMINGS } from '../../journey/chapters'
import { B, smoothstep, mulberry32, InstancedList, ExtrudedText } from './archviz'

// ————————————————————————————————————————————————————————————————
// FALLBACK PLACEHOLDER for the hero property.
//
// This procedural building renders ONLY when no professional model is
// present at /public/models/crd-property.glb (see HeroProperty.jsx).
// Three articulated volumes on a shared podium:
//   A — west wing, x -17…-6: stone, punched windows, 6 levels
//   B — centre bay, x -6…6: full-height curtain wall, proud of the line
//   C — east wing, x 6…17: bronze panels with recessed loggias
// Footprint and datums follow B in archviz.jsx.
// ————————————————————————————————————————————————————————————————

// ————— Shared deterministic unit data (placement + lighting agree) —————

// Every glazed "unit" that can glow: punched windows (wing A), curtain
// wall cells (bay B), loggia backs (wing C). mode: 0 dark, 1 dim warm,
// 2 warm, 3 cool.
const UNITS = (() => {
  const rng = mulberry32(4171)
  const units = []
  const push = (kind, pos, rotY, w, h) => {
    const r = rng()
    // curtain-wall cells stay mostly dark so the bay doesn't stripe
    const darkCut = kind === 'cw' ? 0.58 : 0.38
    const mode = r < darkCut ? 0 : r < darkCut + 0.16 ? 1 : r < 0.9 ? 2 : 3
    units.push({ kind, pos, rotY, w, h, mode, threshold: rng() * 0.85 + 0.08, glassVar: rng() })
  }

  // — Wing A punched windows —
  // front (z=0 face), 4 columns × 5 upper floors
  for (let f = 1; f <= 5; f++) {
    const y = 1.0 + f * B.FLOOR_H + 1.62
    for (const x of [-15.1, -12.7, -10.3, -7.9]) push('punch', [x, y, -0.02], 0, 1.7, 2.15)
    // west side (x=-17), 6 columns
    for (let c = 0; c < 6; c++) push('punch', [-16.98, y, -3.4 - c * 4.2], -Math.PI / 2, 1.7, 2.15)
    // rear
    for (const x of [-15.1, -12.7, -10.3, -7.9]) push('punch', [x, y, -B.D + 0.02], Math.PI, 1.7, 2.15)
  }

  // — Bay B curtain wall cells (front, floors 2-7 above podium) —
  for (let f = 0; f < B.FLOORS; f++) {
    const y = B.PODIUM_H + f * B.FLOOR_H + B.FLOOR_H / 2 + 0.08
    for (let c = 0; c < 7; c++) {
      const x = -5.1 + c * 1.7
      push('cw', [x, y, 0.05], 0, 1.55, 2.5)
    }
    // rear of bay B
    for (let c = 0; c < 5; c++) push('cw', [-3.4 + c * 1.7, y, -B.D + 0.35], Math.PI, 1.55, 2.5)
  }

  // — Wing C loggia rear walls (front face recessed) + rear/side windows —
  for (let f = 0; f < 6; f++) {
    const y = B.PODIUM_H + f * B.FLOOR_H + 1.55
    for (const x of [8.5, 11.5, 14.5]) push('loggia', [x, y, -1.32], 0, 2.5, 2.3)
    for (const x of [8.2, 11.2, 14.2]) push('punch', [x, y, -B.D + 0.02], Math.PI, 1.7, 2.15)
    for (let c = 0; c < 5; c++) push('punch', [16.98, y, -4.2 - c * 4.4], Math.PI / 2, 1.7, 2.15)
  }
  return units
})()

// ————— Lit interiors: one instanced mesh over all units —————

function LitUnits() {
  const ref = useRef()
  const lastAct = useRef(-1)

  const colors = useMemo(
    () =>
      UNITS.map((u) => {
        const b = 0.5 + u.glassVar * 0.8
        if (u.mode === 0) return new THREE.Color(0.012, 0.013, 0.016)
        if (u.mode === 1) return new THREE.Color(0.5 * b, 0.36 * b, 0.2 * b)
        if (u.mode === 2) return new THREE.Color(1.55 * b, 1.1 * b, 0.58 * b)
        return new THREE.Color(0.8 * b, 0.9 * b, 1.05 * b)
      }),
    []
  )

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    UNITS.forEach((u, i) => {
      e.set(0, u.rotY, 0)
      q.setFromEuler(e)
      const inset = u.kind === 'loggia' ? 0 : 0.32
      const p = new THREE.Vector3(...u.pos)
      // push the lit plane behind the glass along the face normal
      p.x -= Math.sin(u.rotY) * inset
      p.z -= Math.cos(u.rotY) * inset
      m.compose(p, q, new THREE.Vector3(u.w - 0.12, u.h - 0.12, 1))
      ref.current.setMatrixAt(i, m)
      ref.current.setColorAt(i, new THREE.Color(0.012, 0.013, 0.016))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [])

  useFrame((state) => {
    const [w0, w1] = TIMINGS.awaken
    const act = smoothstep(w0, w1, Math.max(journey.smooth, state.clock.elapsedTime * 0.03))
    if (Math.abs(act - lastAct.current) < 0.004 || !ref.current) return
    lastAct.current = act
    const c = new THREE.Color()
    UNITS.forEach((u, i) => {
      const on = u.mode === 0 ? 0 : smoothstep(u.threshold - 0.12, u.threshold, act)
      c.copy(colors[i]).multiplyScalar(Math.max(on, 0.02))
      ref.current.setColorAt(i, c)
    })
    ref.current.instanceColor.needsUpdate = true
  })

  const litMat = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), [])
  return <instancedMesh ref={ref} args={[geoms.plane, litMat, UNITS.length]} />
}

// ————— Window joinery: reveals, frames, glass, sills — instanced —————

function WindowJoinery() {
  const { reveals, frames, glassA, glassB, sills } = useMemo(() => {
    const reveals = []
    const frames = []
    const glassA = []
    const glassB = []
    const sills = []
    UNITS.forEach((u) => {
      const sin = Math.sin(u.rotY)
      const cos = Math.cos(u.rotY)
      const off = (d) => [u.pos[0] - sin * d, u.pos[1], u.pos[2] - cos * d]
      if (u.kind === 'punch') {
        // dark reveal cavity reads as a deep opening in the stone
        reveals.push({ pos: off(0.18), rotY: u.rotY, scale: [u.w + 0.1, u.h + 0.1, 0.5] })
        frames.push({ pos: off(-0.02), rotY: u.rotY, scale: [u.w + 0.02, u.h + 0.02, 0.055] })
        ;(u.glassVar > 0.5 ? glassA : glassB).push({ pos: off(0.08), rotY: u.rotY, scale: [u.w - 0.14, u.h - 0.14, 1] })
        sills.push({ pos: [u.pos[0] - sin * -0.08, u.pos[1] - u.h / 2 - 0.05, u.pos[2] - cos * -0.08], rotY: u.rotY, scale: [u.w + 0.22, 0.09, 0.3] })
      } else if (u.kind === 'cw') {
        ;(u.glassVar > 0.5 ? glassA : glassB).push({ pos: off(0), rotY: u.rotY, scale: [u.w, u.h, 1] })
      } else {
        // loggia rear wall glazing
        ;(u.glassVar > 0.5 ? glassA : glassB).push({ pos: off(-0.02), rotY: u.rotY, scale: [u.w, u.h, 1] })
        frames.push({ pos: off(0.0), rotY: u.rotY, scale: [u.w + 0.06, u.h + 0.06, 0.05] })
      }
    })
    return { reveals, frames, glassA, glassB, sills }
  }, [])

  const revealMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0b0b0c', metalness: 0.2, roughness: 0.9 }),
    []
  )

  return (
    <group>
      <InstancedList geometry={geoms.box} material={revealMat} items={reveals} />
      <InstancedList geometry={geoms.box} material={mats.mullion} items={frames} castShadow />
      <InstancedList geometry={geoms.plane} material={mats.glass} items={glassA} />
      <InstancedList geometry={geoms.plane} material={mats.glassSoft} items={glassB} />
      <InstancedList geometry={geoms.box} material={mats.stoneDark} items={sills} castShadow />
    </group>
  )
}

// ————— Wing A: stone volume —————

function StoneWing() {
  const wallH = B.A_TOP
  const front = useMemo(() => pbrMaterial(sets.stone, { surface: [11, wallH], worldSize: 5, color: '#a9a294' }), [wallH])
  const side = useMemo(() => pbrMaterial(sets.stone, { surface: [B.D, wallH], worldSize: 5, color: '#a19a8c' }), [wallH])
  const rear = useMemo(() => pbrMaterial(sets.stone, { surface: [11, wallH], worldSize: 5, color: '#9c9486' }), [wallH])
  const roofMat = useMemo(() => pbrMaterial(sets.grass, { surface: [10.4, 27.4], worldSize: 3, color: '#6a7a5a' }), [])

  return (
    <group>
      {/* stone slabs */}
      <mesh position={[-11.5, wallH / 2, -0.3]} material={front} castShadow receiveShadow>
        <boxGeometry args={[11, wallH, 0.6]} />
      </mesh>
      <mesh position={[-16.7, wallH / 2, -B.D / 2]} material={side} castShadow receiveShadow>
        <boxGeometry args={[0.6, wallH, B.D - 0.6]} />
      </mesh>
      <mesh position={[-11.5, wallH / 2, -B.D + 0.3]} material={rear} receiveShadow>
        <boxGeometry args={[11, wallH, 0.6]} />
      </mesh>
      {/* core mass */}
      <mesh position={[-11.5, wallH / 2, -B.D / 2]} material={mats.towerDark}>
        <boxGeometry args={[10.4, wallH - 0.4, B.D - 1.4]} />
      </mesh>
      {/* parapet + metal coping */}
      <mesh position={[-11.5, wallH + 0.35, -B.D / 2]} material={front}>
        <boxGeometry args={[11, 0.7, 0.5]} />
      </mesh>
      <mesh position={[-11.5, wallH + 0.74, -B.D / 2]} material={mats.darkMetal} castShadow>
        <boxGeometry args={[11.15, 0.09, B.D + 0.15]} />
      </mesh>
      {/* wrap parapet walls front/rear/west */}
      {[[-11.5, -0.15, 11, 0.3], [-11.5, -B.D + 0.15, 11, 0.3]].map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, wallH + 0.35, z]} material={front}>
          <boxGeometry args={[w, 0.7, d]} />
        </mesh>
      ))}
      <mesh position={[-16.85, wallH + 0.35, -B.D / 2]} material={side}>
        <boxGeometry args={[0.3, 0.7, B.D]} />
      </mesh>
      {/* green roof visible from the aerial hero */}
      <mesh geometry={geoms.plane} material={roofMat} rotation-x={-Math.PI / 2} position={[-11.5, wallH + 0.06, -B.D / 2]} scale={[10.4, B.D - 0.8, 1]} receiveShadow />
      {/* skylight monitors */}
      {[-9, -14].map((x) => (
        <group key={x} position={[x, wallH + 0.4, -12]}>
          <mesh material={mats.darkMetal} castShadow>
            <boxGeometry args={[2.2, 0.66, 3.2]} />
          </mesh>
          <mesh geometry={geoms.plane} material={mats.glass} rotation-x={-Math.PI / 2} position={[0, 0.35, 0]} scale={[2, 3, 1]} />
        </group>
      ))}
      {/* string course bands every two floors */}
      {[1, 3, 5].map((f) => (
        <mesh key={f} position={[-11.5, 1.0 + f * B.FLOOR_H + 0.02, 0.02]} material={mats.concrete} castShadow>
          <boxGeometry args={[11.05, 0.16, 0.1]} />
        </mesh>
      ))}
    </group>
  )
}

// ————— Bay B: curtain wall centre —————

function GlassBay() {
  const slabs = useMemo(() => {
    const s = []
    for (let f = 0; f <= B.FLOORS; f++) {
      const y = B.PODIUM_H + f * B.FLOOR_H
      s.push({ pos: [0, y, 0.42], scale: [12.1, 0.44, 0.34] })
    }
    return s
  }, [])

  const mullions = useMemo(() => {
    const m = []
    const H = B.FLOORS * B.FLOOR_H
    for (let c = 0; c <= 7; c++) {
      const x = -5.95 + c * 1.7
      m.push({ pos: [x, B.PODIUM_H + H / 2, 0.5], scale: [0.07, H, 0.16] })
    }
    return m
  }, [])

  const transoms = useMemo(() => {
    const t = []
    for (let f = 0; f < B.FLOORS; f++) {
      const y = B.PODIUM_H + f * B.FLOOR_H + 2.5
      t.push({ pos: [0, y, 0.5], scale: [12, 0.05, 0.12] })
    }
    return t
  }, [])

  const H = B.FLOORS * B.FLOOR_H

  return (
    <group>
      {/* the proud volume's flank returns */}
      <mesh geometry={geoms.plane} material={mats.glass} rotation-y={Math.PI / 2} position={[-6.02, B.PODIUM_H + H / 2, 0.22]} scale={[0.45, H, 1]} />
      <mesh geometry={geoms.plane} material={mats.glass} rotation-y={-Math.PI / 2} position={[6.02, B.PODIUM_H + H / 2, 0.22]} scale={[0.45, H, 1]} />
      {/* slab edges + mullions + transoms */}
      <InstancedList geometry={geoms.box} material={mats.concrete} items={slabs} castShadow />
      <InstancedList geometry={geoms.box} material={mats.mullion} items={mullions} castShadow />
      <InstancedList geometry={geoms.box} material={mats.mullion} items={transoms} />
      {/* full-height bronze feature fins bracketing the bay */}
      <mesh position={[-6.18, B.PODIUM_H + H / 2, 0.35]} material={mats.bronzePanel} castShadow>
        <boxGeometry args={[0.34, H, 0.75]} />
      </mesh>
      <mesh position={[6.18, B.PODIUM_H + H / 2, 0.35]} material={mats.bronzePanel} castShadow>
        <boxGeometry args={[0.34, H, 0.75]} />
      </mesh>
      {/* rear face of bay is part of the shared rear plane */}
      <mesh position={[0, B.PODIUM_H + H / 2, -B.D + 0.3]} material={mats.towerDark}>
        <boxGeometry args={[12, H, 0.6]} />
      </mesh>
      {/* core mass */}
      <mesh position={[0, B.PODIUM_H + H / 2, -B.D / 2]} material={mats.towerDark}>
        <boxGeometry args={[11.4, H - 0.4, B.D - 1.6]} />
      </mesh>
    </group>
  )
}

// ————— Wing C: bronze panels + recessed loggias —————

function LoggiaWing({ isMobile }) {
  const fins = useRef()

  const finData = useMemo(() => {
    const rng = mulberry32(555)
    const d = []
    for (let f = 0; f < 6; f++) {
      const yBase = B.PODIUM_H + f * B.FLOOR_H
      for (const x of [10, 13]) d.push({ x, y: yBase + (B.FLOOR_H - 0.42) / 2, delay: rng() * 0.5 })
    }
    return d
  }, [])

  // loggia divider fins grow into place during the assembly beat
  useFrame(() => {
    if (!fins.current) return
    const t = smoothstep(TIMINGS.assemble[0], TIMINGS.assemble[1], journey.smooth)
    const m = new THREE.Matrix4()
    finData.forEach((fin, i) => {
      const local = smoothstep(fin.delay, 1, t)
      const h = (B.FLOOR_H - 0.42) * Math.max(local, 0.001)
      m.makeScale(0.09, h, 1.35)
      m.setPosition(fin.x, fin.y - ((B.FLOOR_H - 0.42) - h) / 2, -0.72)
      fins.current.setMatrixAt(i, m)
    })
    fins.current.instanceMatrix.needsUpdate = true
  })

  const parts = useMemo(() => {
    const slabs = []
    const soffits = []
    const rails = []
    const railTops = []
    const cavities = []
    const planters = []
    const rng = mulberry32(88)
    for (let f = 0; f < 6; f++) {
      const yBase = B.PODIUM_H + f * B.FLOOR_H
      // balcony slab band with drip shadow gap
      slabs.push({ pos: [11.5, yBase + 0.21, -0.35], scale: [9.4, 0.42, 1.75] })
      // loggia cavity + wood soffit
      cavities.push({ pos: [11.5, yBase + B.FLOOR_H / 2 + 0.2, -0.85], scale: [9, B.FLOOR_H - 0.4, 1.15] })
      soffits.push({ pos: [11.5, yBase + B.FLOOR_H - 0.24, -0.75], scale: [9, 0.06, 1.3] })
      // glass railing panels ×5 + continuous handrail
      for (let p = 0; p < 5; p++) {
        rails.push({ pos: [7.85 + p * 1.83, yBase + 0.97, -0.12], scale: [1.7, 1.05, 1] })
      }
      railTops.push({ pos: [11.5, yBase + 1.53, -0.12], scale: [9.2, 0.06, 0.08] })
      // planter boxes on some balconies
      if (rng() > 0.45) planters.push({ pos: [8 + rng() * 6.5, yBase + 0.66, -0.4], scale: [1.1, 0.42, 0.5] })
    }
    return { slabs, soffits, rails, railTops, cavities, planters }
  }, [])

  const grooves = useMemo(() => {
    const g = []
    // panel joints on the piers and side face
    for (const x of [6.5, 16.5]) {
      for (let f = 1; f <= 6; f++) g.push({ pos: [x, B.PODIUM_H + f * B.FLOOR_H, 0.05], scale: [1.1, 0.03, 0.06] })
    }
    for (let c = 0; c < 6; c++) {
      g.push({ pos: [17.02, B.PODIUM_H + 11.5, -2.2 - c * 4.4], scale: [0.06, 23, 0.03] })
    }
    return g
  }, [])

  const wallH = B.FLOORS * B.FLOOR_H

  return (
    <group>
      {/* pier panels flanking the loggia zone */}
      <mesh position={[6.5, B.PODIUM_H + wallH / 2, -0.25]} material={mats.bronzePanel} castShadow receiveShadow>
        <boxGeometry args={[1, wallH, 0.5]} />
      </mesh>
      <mesh position={[16.5, B.PODIUM_H + wallH / 2, -0.25]} material={mats.bronzePanel} castShadow receiveShadow>
        <boxGeometry args={[1, wallH, 0.5]} />
      </mesh>
      {/* east side + rear */}
      <mesh position={[16.75, B.PODIUM_H + wallH / 2, -B.D / 2]} material={mats.bronzePanel} castShadow receiveShadow>
        <boxGeometry args={[0.5, wallH, B.D - 0.5]} />
      </mesh>
      <mesh position={[11.5, B.PODIUM_H + wallH / 2, -B.D + 0.3]} material={mats.bronzePanel} receiveShadow>
        <boxGeometry args={[11, wallH, 0.6]} />
      </mesh>
      {/* core */}
      <mesh position={[11.5, B.PODIUM_H + wallH / 2, -B.D / 2]} material={mats.towerDark}>
        <boxGeometry args={[10.2, wallH - 0.4, B.D - 1.6]} />
      </mesh>

      <InstancedList geometry={geoms.box} material={mats.panelGroove} items={grooves} />
      <InstancedList geometry={geoms.box} material={mats.concrete} items={parts.slabs} castShadow receiveShadow />
      <InstancedList geometry={geoms.box} material={mats.towerDark} items={parts.cavities} />
      <InstancedList geometry={geoms.box} material={mats.woodSlat} items={parts.soffits} />
      <InstancedList geometry={geoms.plane} material={mats.railGlass} items={parts.rails} />
      <InstancedList geometry={geoms.box} material={mats.darkMetal} items={parts.railTops} castShadow />
      <InstancedList geometry={geoms.box} material={mats.stoneDark} items={parts.planters} />
      <instancedMesh ref={fins} args={[geoms.box, mats.bronzePanel, finData.length]} castShadow />
    </group>
  )
}

// ————— Podium: entrance, canopy, storefronts, plinth —————

function Podium() {
  const doorL = useRef()
  const doorR = useRef()
  const canopyGlow = useRef()

  const stoneBase = useMemo(() => pbrMaterial(sets.stone, { surface: [11, B.PODIUM_H], worldSize: 5, color: '#a9a294' }), [])
  const concretePlinth = useMemo(() => pbrMaterial(sets.concrete, { surface: [34, 0.7], worldSize: 3, color: '#8d8a84' }), [])

  useFrame((state) => {
    const open = smoothstep(TIMINGS.doors[0], TIMINGS.doors[1], journey.smooth)
    if (doorL.current) doorL.current.position.x = -0.55 - open * 1.18
    if (doorR.current) doorR.current.position.x = 0.55 + open * 1.18
    if (canopyGlow.current) {
      const awaken = smoothstep(0.0, 0.08, Math.max(journey.smooth, state.clock.elapsedTime * 0.05))
      canopyGlow.current.material.opacity = awaken * 0.85
    }
  })

  const woodSlats = useMemo(() => {
    const s = []
    // vertical slat screen on the east podium bay
    for (let i = 0; i < 34; i++) s.push({ pos: [6.6 + i * 0.31, 2.3, 0.06], scale: [0.09, B.PODIUM_H - 0.7, 0.14] })
    return s
  }, [])

  const downlights = useMemo(
    () => [-2.2, 0, 2.2].map((x) => ({ pos: [x, 3.58, 1.6], scale: [0.26, 0.02, 0.26] })),
    []
  )

  return (
    <group>
      {/* concrete plinth around the whole base */}
      <mesh position={[0, 0.32, 0.1]} material={concretePlinth} receiveShadow>
        <boxGeometry args={[B.W + 0.5, 0.64, 0.7]} />
      </mesh>
      {/* west podium — stone continues to grade, storefront vitrines */}
      <mesh position={[-11.5, B.PODIUM_H / 2, -0.28]} material={stoneBase} castShadow receiveShadow>
        <boxGeometry args={[11, B.PODIUM_H, 0.64]} />
      </mesh>
      {[-13.6, -9.4].map((x) => (
        <group key={x}>
          <mesh position={[x, 2, 0.08]} material={mats.mullion}>
            <boxGeometry args={[3.1, 2.5, 0.1]} />
          </mesh>
          <mesh geometry={geoms.plane} material={mats.warmLightSoft} position={[x, 2, 0.1]} scale={[2.9, 2.3, 1]} />
          <mesh geometry={geoms.plane} material={mats.clearGlass} position={[x, 2, 0.16]} scale={[2.95, 2.35, 1]} />
        </group>
      ))}
      {/* east podium — wood slat screen over dark wall */}
      <mesh position={[11.5, B.PODIUM_H / 2, -0.15]} material={mats.canopy} receiveShadow>
        <boxGeometry args={[11, B.PODIUM_H, 0.4]} />
      </mesh>
      <InstancedList geometry={geoms.box} material={mats.woodSlat} items={woodSlats} castShadow />
      {/* soft grazing light over the slats */}
      <mesh position={[11.5, B.PODIUM_H - 0.35, 0.18]} material={mats.warmLightSoft}>
        <boxGeometry args={[10.4, 0.03, 0.03]} />
      </mesh>

      {/* entrance recess: piers, glazing, sliding doors */}
      <mesh position={[-3.9, 2.05, -0.8]} material={stoneBase} castShadow>
        <boxGeometry args={[0.9, 4.1, 1.9]} />
      </mesh>
      <mesh position={[3.9, 2.05, -0.8]} material={stoneBase} castShadow>
        <boxGeometry args={[0.9, 4.1, 1.9]} />
      </mesh>
      <mesh geometry={geoms.plane} material={mats.clearGlass} position={[-2.4, 1.95, -1.5]} scale={[2, 3.5, 1]} />
      <mesh geometry={geoms.plane} material={mats.clearGlass} position={[2.4, 1.95, -1.5]} scale={[2, 3.5, 1]} />
      <mesh position={[0, 3.9, -1.5]} material={mats.mullion}>
        <boxGeometry args={[7.8, 0.35, 0.16]} />
      </mesh>
      <group>
        <mesh ref={doorL} geometry={geoms.plane} material={mats.clearGlass} position={[-0.55, 1.62, -1.52]} scale={[1.12, 2.95, 1]} />
        <mesh ref={doorR} geometry={geoms.plane} material={mats.clearGlass} position={[0.55, 1.62, -1.52]} scale={[1.12, 2.95, 1]} />
      </group>
      <mesh position={[-1.35, 1.62, -1.5]} material={mats.gold}>
        <boxGeometry args={[0.07, 3.1, 0.1]} />
      </mesh>
      <mesh position={[1.35, 1.62, -1.5]} material={mats.gold}>
        <boxGeometry args={[0.07, 3.1, 0.1]} />
      </mesh>

      {/* canopy: dark fascia, wood soffit, slender steel columns */}
      <group>
        <mesh position={[0, 3.75, 1.7]} material={mats.canopy} castShadow>
          <boxGeometry args={[8.6, 0.3, 3.9]} />
        </mesh>
        <mesh geometry={geoms.plane} material={mats.woodSlat} rotation-x={Math.PI / 2} position={[0, 3.59, 1.7]} scale={[8.4, 3.7, 1]} />
        <mesh position={[0, 3.75, 3.68]} material={mats.gold}>
          <boxGeometry args={[8.6, 0.06, 0.06]} />
        </mesh>
        {[-3.9, 3.9].map((x) => (
          <mesh key={x} position={[x, 1.85, 3.3]} material={mats.darkMetal} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 3.7, 12]} />
          </mesh>
        ))}
        {/* recessed downlight discs */}
        <InstancedList geometry={geoms.box} material={mats.warmLight} items={downlights} />
        <mesh ref={canopyGlow} geometry={geoms.plane} rotation-x={Math.PI / 2} position={[0, 3.56, 1.7]}>
          <meshBasicMaterial color={new THREE.Color(1.0, 0.78, 0.5)} toneMapped={false} transparent opacity={0} />
        </mesh>
      </group>

      {/* CRD dimensional letters on the canopy fascia, softly haloed */}
      <ExtrudedText text="CRD PROPERTY GROUP" size={0.26} depth={0.06} material={mats.goldBright} position={[0, 3.76, 3.68]} />
      {/* engraved address stone on the entrance pier */}
      <ExtrudedText text="No. 28" size={0.14} depth={0.02} material={mats.gold} position={[-3.9, 2.6, 0.16]} />
    </group>
  )
}

// ————— Roof: parapets, penthouse, mech screen, rooftop sign —————

function Roof() {
  const trim = useRef()
  useFrame(() => {
    const t = smoothstep(TIMINGS.assemble[0], TIMINGS.assemble[1], journey.smooth)
    if (trim.current) trim.current.scale.x = Math.max(t, 0.0001)
  })

  const parapets = useMemo(
    () => [
      // tall mass parapet: front/rear span x -6…17, east side, west return
      { pos: [5.5, B.TOP + 0.3, -0.1], scale: [23.4, 0.6, 0.24] },
      { pos: [5.5, B.TOP + 0.3, -B.D + 0.1], scale: [23.4, 0.6, 0.24] },
      { pos: [16.9, B.TOP + 0.3, -B.D / 2], scale: [0.24, 0.6, B.D + 0.2] },
      { pos: [-5.9, B.TOP + 0.3, -B.D / 2], scale: [0.24, 0.6, B.D + 0.2] },
      // metal copings
      { pos: [5.5, B.TOP + 0.64, -0.1], scale: [23.6, 0.08, 0.34] },
      { pos: [5.5, B.TOP + 0.64, -B.D + 0.1], scale: [23.6, 0.08, 0.34] },
      { pos: [16.9, B.TOP + 0.64, -B.D / 2], scale: [0.34, 0.08, B.D + 0.3] },
      { pos: [-5.9, B.TOP + 0.64, -B.D / 2], scale: [0.34, 0.08, B.D + 0.3] },
    ],
    []
  )

  const louvers = useMemo(() => {
    const l = []
    for (let i = 0; i < 9; i++) l.push({ pos: [0, B.TOP + 0.35 + i * 0.18, -26.4], scale: [6.2, 0.06, 0.3], rotX: 0.5 })
    return l
  }, [])

  return (
    <group>
      <InstancedList geometry={geoms.box} material={mats.darkMetal} items={parapets} castShadow />
      {/* gold trim resolves along the parapet during the descent */}
      <mesh ref={trim} position={[5.5, B.TOP + 0.72, 0.0]} material={mats.goldBright}>
        <boxGeometry args={[23.4, 0.06, 0.2]} />
      </mesh>
      {/* roof slab */}
      <mesh position={[5.5, B.TOP + 0.02, -B.D / 2]} material={mats.concrete} receiveShadow>
        <boxGeometry args={[22.8, 0.12, B.D - 0.4]} />
      </mesh>
      {/* penthouse: wood-clad with continuous clerestory */}
      <group position={[0, 0, -24]}>
        <mesh position={[0, B.TOP + 1.3, 0]} material={mats.woodSlat} castShadow>
          <boxGeometry args={[12, 2.4, 4]} />
        </mesh>
        <mesh geometry={geoms.plane} material={mats.glass} position={[0, B.TOP + 1.7, 2.03]} scale={[11.4, 1.0, 1]} />
        <mesh position={[0, B.TOP + 2.66, 0]} material={mats.darkMetal} castShadow>
          <boxGeometry args={[12.7, 0.14, 4.7]} />
        </mesh>
      </group>
      {/* mechanical screen tucked behind, louvered */}
      <InstancedList geometry={geoms.box} material={mats.darkMetal} items={louvers} />
      {/* rooftop CRD sign facing the terrace */}
      <ExtrudedText text="CRD" size={1.15} depth={0.2} material={mats.goldBright} position={[0, B.TOP + 1.45, -21.7]} />
      <mesh position={[0, B.TOP + 0.62, -21.96]} material={mats.warmLightSoft}>
        <boxGeometry args={[5.6, 0.04, 0.04]} />
      </mesh>
    </group>
  )
}

// ————— Volume seams — deep shadow gaps between the three masses —————

function Seams() {
  const seamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#060607', metalness: 0.1, roughness: 0.95 }),
    []
  )
  return (
    <group>
      <mesh position={[-6, B.A_TOP / 2, -0.1]} material={seamMat}>
        <boxGeometry args={[0.5, B.A_TOP, 0.55]} />
      </mesh>
      <mesh position={[6.05, (B.PODIUM_H + B.FLOORS * B.FLOOR_H) / 2, -0.1]} material={seamMat}>
        <boxGeometry args={[0.4, B.PODIUM_H + B.FLOORS * B.FLOOR_H, 0.5]} />
      </mesh>
    </group>
  )
}

export default function ProceduralBuilding({ isMobile }) {
  return (
    <group>
      <StoneWing />
      <GlassBay />
      <LoggiaWing isMobile={isMobile} />
      <Podium />
      <Roof />
      <Seams />
      <WindowJoinery />
      <LitUnits />
    </group>
  )
}
