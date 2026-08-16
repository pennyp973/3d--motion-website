import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats, geoms } from './materials'
import { InstancedList, ExtrudedText } from './Building'
import { Planter } from './Interior'
import { journey } from '../../journey/journeyState'
import { TIMINGS } from '../../journey/chapters'

// Arrival landscape: plaza, lit walkway, hedges, trees, monument sign.

const bollardGlow = new THREE.MeshBasicMaterial({
  color: new THREE.Color(1.8, 1.35, 0.75),
  toneMapped: false,
  transparent: true,
  opacity: 0,
})

const uplight = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0.9, 0.7, 0.4),
  toneMapped: false,
  transparent: true,
  opacity: 0,
})

function Trees() {
  const trees = useMemo(() => {
    const rng = mulberry32(31)
    const t = []
    ;[
      [-9, 6],
      [-12.5, 12],
      [-8.5, 18],
      [9, 6],
      [12.5, 12],
      [8.5, 18],
    ].forEach(([x, z]) => {
      t.push({ x, z, s: 0.85 + rng() * 0.5, r: rng() * Math.PI })
    })
    return t
  }, [])

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} rotation-y={t.r} scale={t.s}>
          <mesh position={[0, 1.1, 0]} material={mats.wood} castShadow>
            <cylinderGeometry args={[0.09, 0.14, 2.2, 8]} />
          </mesh>
          <mesh position={[0, 2.6, 0]} material={mats.hedge} castShadow>
            <icosahedronGeometry args={[1.15, 1]} />
          </mesh>
          <mesh position={[0.4, 3.3, 0.2]} material={mats.hedge}>
            <icosahedronGeometry args={[0.75, 1]} />
          </mesh>
          {/* uplight pool at the base */}
          <mesh geometry={geoms.plane} material={uplight} rotation-x={-Math.PI / 2} position={[0, 0.03, 0]} scale={[1.4, 1.4, 1]} />
        </group>
      ))}
    </group>
  )
}

export default function Landscape() {
  useFrame((state) => {
    // landscape lighting fades up as the environment awakens
    const t = Math.max(journey.smooth, state.clock.elapsedTime * 0.04)
    const a = THREE.MathUtils.clamp((t - 0.015) / (TIMINGS.awaken[1] * 0.7), 0, 1)
    bollardGlow.opacity = a
    uplight.opacity = a * 0.16
  })

  const bollards = useMemo(() => {
    const b = []
    ;[3.5, 8, 12.5, 17].forEach((z) => {
      b.push({ pos: [-2.9, 0.4, z], scale: [0.14, 0.8, 0.14] })
      b.push({ pos: [2.9, 0.4, z], scale: [0.14, 0.8, 0.14] })
    })
    return b
  }, [])

  const bollardCaps = useMemo(
    () => bollards.map((b) => ({ pos: [b.pos[0], 0.78, b.pos[2]], scale: [0.12, 0.05, 0.12] })),
    [bollards]
  )

  const hedges = useMemo(() => {
    const h = []
    for (let i = 0; i < 5; i++) {
      h.push({ pos: [-5.2, 0.35, 3.5 + i * 3.6], scale: [1.1, 0.7, 2.4] })
      h.push({ pos: [5.2, 0.35, 3.5 + i * 3.6], scale: [1.1, 0.7, 2.4] })
    }
    return h
  }, [])

  return (
    <group>
      {/* walkway to the entrance */}
      <mesh position={[0, 0.015, 11]} material={mats.paver} receiveShadow>
        <boxGeometry args={[5.4, 0.05, 19]} />
      </mesh>
      {/* plaza aprons */}
      <mesh position={[-11, 0.005, 12]} material={mats.ground} receiveShadow>
        <boxGeometry args={[16, 0.02, 22]} />
      </mesh>
      <mesh position={[11, 0.005, 12]} material={mats.ground} receiveShadow>
        <boxGeometry args={[16, 0.02, 22]} />
      </mesh>

      <InstancedList geometry={geoms.box} material={mats.darkMetal} items={bollards} castShadow />
      <InstancedList geometry={geoms.box} material={bollardGlow} items={bollardCaps} />
      <InstancedList geometry={geoms.box} material={mats.hedge} items={hedges} castShadow />

      <Trees />

      {/* monument sign at the walkway edge */}
      <group position={[5.8, 0, 18]} rotation-y={-0.35}>
        <mesh position={[0, 0.55, 0]} material={mats.stoneDark} castShadow>
          <boxGeometry args={[2.6, 1.1, 0.4]} />
        </mesh>
        <ExtrudedText text="CRD" size={0.42} depth={0.05} material={mats.goldBright} position={[-0.35, 0.68, 0.21]} />
        <ExtrudedText text="PROPERTY GROUP" size={0.11} depth={0.03} material={mats.gold} position={[0, 0.28, 0.21]} />
        <mesh geometry={geoms.plane} material={uplight} rotation-x={-Math.PI / 2} position={[0, 0.03, 0.5]} scale={[2.6, 0.5, 1]} />
      </group>

      {/* entry planters */}
      <Planter position={[-4.4, 0, 2.2]} />
      <Planter position={[4.4, 0, 2.2]} />
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
