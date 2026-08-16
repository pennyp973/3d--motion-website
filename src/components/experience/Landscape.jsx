import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Clone } from '@react-three/drei'
import * as THREE from 'three'
import { mats, geoms, sets, pbrMaterial } from './materials'
import { InstancedList, ExtrudedText, mulberry32 } from './archviz'
import { journey } from '../../journey/journeyState'
import { TIMINGS } from '../../journey/chapters'

// Site context: street with curb and sidewalk, entry drive, stone
// walkway, lawns and planting beds, mature trees, street lighting —
// the property sits in a believable Northeast streetscape.

const bollardGlow = new THREE.MeshBasicMaterial({
  color: new THREE.Color(1.8, 1.35, 0.75),
  toneMapped: false,
  transparent: true,
  opacity: 0,
})

const uplightPool = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0.85, 0.65, 0.38),
  toneMapped: false,
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})

const lampGlow = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.9, 1.5, 0.95), toneMapped: false })

// A mature deciduous tree: tapered trunk, main limbs, clustered
// multi-tone canopy. Reads correctly as a soft mass at blue hour.
function Tree({ position, scale = 1, seed = 1 }) {
  const blobs = useMemo(() => {
    const rng = mulberry32(seed * 97 + 11)
    const b = []
    const n = 16 + Math.floor(rng() * 6)
    for (let i = 0; i < n; i++) {
      const a = rng() * Math.PI * 2
      const rr = Math.sqrt(rng())
      const r = rr * 1.5
      b.push({
        pos: [Math.cos(a) * r, 3.0 + rng() * 2.0 - rr * 0.5, Math.sin(a) * r * 0.9],
        s: 0.38 + rng() * 0.55,
        dark: rng() > 0.45,
      })
    }
    return b
  }, [seed])

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.3, 0]} material={mats.bark} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 2.6, 8]} />
      </mesh>
      {[0.5, 2.2, 4.0].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 0.45, 2.7, Math.sin(a) * 0.45]} rotation-z={Math.cos(a) * 0.5} rotation-x={Math.sin(a) * 0.5} material={mats.bark}>
          <cylinderGeometry args={[0.04, 0.08, 1.6, 6]} />
        </mesh>
      ))}
      {blobs.map((b, i) => (
        <mesh key={i} position={b.pos} scale={b.s} material={b.dark ? mats.foliageDark : mats.foliage} castShadow>
          <icosahedronGeometry args={[1, 1]} />
        </mesh>
      ))}
      <mesh geometry={geoms.plane} material={uplightPool} rotation-x={-Math.PI / 2} position={[0, 0.04, 0]} scale={[2.2, 2.2, 1]} />
    </group>
  )
}

function StreetLamp({ position, flip = false }) {
  const dir = flip ? -1 : 1
  return (
    <group position={position}>
      <mesh position={[0, 3.1, 0]} material={mats.darkMetal} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 6.2, 10]} />
      </mesh>
      <mesh position={[dir * 0.9, 6.05, 0]} rotation-z={dir * 0.25} material={mats.darkMetal}>
        <boxGeometry args={[1.9, 0.08, 0.08]} />
      </mesh>
      <mesh position={[dir * 1.8, 5.9, 0]} material={lampGlow}>
        <boxGeometry args={[0.55, 0.1, 0.22]} />
      </mesh>
      <pointLight position={[dir * 1.8, 5.6, 0]} intensity={5} color="#ffd9a0" distance={16} decay={2} />
    </group>
  )
}

function Planting() {
  const shrub = useGLTF('/models/veg/shrub_04/shrub_04_1k.gltf')
  const grass = useGLTF('/models/veg/grass_medium_01/grass_medium_01_1k.gltf')

  const shrubs = useMemo(() => {
    const rng = mulberry32(71)
    const out = []
    // foundation bed along the facade
    for (let i = 0; i < 9; i++) out.push({ pos: [-15.8 + i * 3.6, 0.02, 1.3 + rng() * 0.5], s: 1.6 + rng() * 1.2, r: rng() * Math.PI * 2 })
    // walkway companions
    for (let i = 0; i < 4; i++) {
      out.push({ pos: [-4.3 - rng() * 1.5, 0.02, 4 + i * 4.2], s: 1.3 + rng() * 0.9, r: rng() * Math.PI * 2 })
      out.push({ pos: [4.3 + rng() * 1.5, 0.02, 4 + i * 4.2], s: 1.3 + rng() * 0.9, r: rng() * Math.PI * 2 })
    }
    return out
  }, [])

  const clumps = useMemo(() => {
    const rng = mulberry32(72)
    const out = []
    for (let i = 0; i < 34; i++) {
      const side = rng() > 0.5 ? 1 : -1
      out.push({ pos: [side * (4.5 + rng() * 10), 0.02, 2.5 + rng() * 15.5], s: 1.1 + rng() * 1.3, r: rng() * Math.PI * 2 })
    }
    return out
  }, [])

  return (
    <group>
      {shrubs.map((p, i) => (
        <Clone key={`s${i}`} object={shrub.scene} position={p.pos} scale={p.s} rotation-y={p.r} />
      ))}
      {clumps.map((p, i) => (
        <Clone key={`g${i}`} object={grass.scene} position={p.pos} scale={p.s} rotation-y={p.r} />
      ))}
    </group>
  )
}

useGLTF.preload('/models/veg/shrub_04/shrub_04_1k.gltf')
useGLTF.preload('/models/veg/grass_medium_01/grass_medium_01_1k.gltf')

export default function Landscape() {
  useFrame((state) => {
    const t = Math.max(journey.smooth, state.clock.elapsedTime * 0.04)
    const a = THREE.MathUtils.clamp((t - 0.015) / (TIMINGS.awaken[1] * 0.7), 0, 1)
    bollardGlow.opacity = a
    uplightPool.opacity = a * 0.28
  })

  // ——— textured ground materials, tiled at true scale ———
  const walkway = useMemo(() => pbrMaterial(sets.plaza, { surface: [5.4, 19], worldSize: 3.2, color: '#9a958c' }), [])
  const sidewalkMat = useMemo(() => pbrMaterial(sets.sidewalk, { surface: [64, 5], worldSize: 4, color: '#8f8b83' }), [])
  const asphaltStreet = useMemo(() => pbrMaterial(sets.asphalt, { surface: [64, 12], worldSize: 6, color: '#606064' }), [])
  const asphaltDrive = useMemo(() => pbrMaterial(sets.asphalt, { surface: [18, 6], worldSize: 6, color: '#67676b' }), [])
  const lawnL = useMemo(() => pbrMaterial(sets.grass, { surface: [12.5, 17], worldSize: 3.5, color: '#7c8a68' }), [])
  const lawnR = useMemo(() => pbrMaterial(sets.grass, { surface: [12.5, 17], worldSize: 3.5, color: '#75835f' }), [])

  const bollards = useMemo(() => {
    const b = []
    ;[4, 9, 14].forEach((z) => {
      b.push({ pos: [-3.1, 0.4, z], scale: [0.13, 0.8, 0.13] })
      b.push({ pos: [3.1, 0.4, z], scale: [0.13, 0.8, 0.13] })
    })
    return b
  }, [])

  const bollardCaps = useMemo(
    () => bollards.map((b) => ({ pos: [b.pos[0], 0.78, b.pos[2]], scale: [0.11, 0.05, 0.11] })),
    [bollards]
  )

  const hedges = useMemo(() => {
    const h = []
    for (let i = 0; i < 4; i++) {
      h.push({ pos: [-4.6, 0.32, 3.6 + i * 3.9], scale: [1.0, 0.64, 2.6] })
      h.push({ pos: [4.6, 0.32, 3.6 + i * 3.9], scale: [1.0, 0.64, 2.6] })
    }
    // foundation planting against the facade
    for (let i = 0; i < 5; i++) {
      h.push({ pos: [-15.5 + i * 2.4, 0.34, 1.35], scale: [1.6, 0.68, 1.0] })
      h.push({ pos: [7.6 + i * 2.2, 0.34, 1.35], scale: [1.4, 0.68, 1.0] })
    }
    return h
  }, [])

  // ornamental grass tufts scattered through the beds
  const tufts = useMemo(() => {
    const rng = mulberry32(303)
    const t = []
    for (let i = 0; i < 46; i++) {
      const side = rng() > 0.5 ? 1 : -1
      t.push({
        pos: [side * (4.2 + rng() * 10.5), 0.22, 2.5 + rng() * 15],
        scale: [0.3 + rng() * 0.24, 0.42 + rng() * 0.4, 0.3 + rng() * 0.24],
        rotY: rng() * Math.PI,
      })
    }
    return t
  }, [])

  const tuftMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#454536', roughness: 1 }),
    []
  )

  // facade uplights washing the stone wing
  const facadeWash = useMemo(() => {
    const w = []
    for (const x of [-15.2, -12.8, -10.4, -8]) w.push({ pos: [x, 0.06, 0.85], scale: [0.5, 0.02, 0.5] })
    return w
  }, [])

  return (
    <group>
      {/* ——— street, curb, sidewalk ——— */}
      <mesh geometry={geoms.plane} material={asphaltStreet} rotation-x={-Math.PI / 2} position={[0, 0.001, 36]} scale={[64, 12, 1]} receiveShadow />
      <mesh position={[0, 0.09, 29.8]} material={mats.curb} receiveShadow>
        <boxGeometry args={[64, 0.18, 0.4]} />
      </mesh>
      <mesh geometry={geoms.plane} material={sidewalkMat} rotation-x={-Math.PI / 2} position={[0, 0.17, 27.2]} scale={[64, 5, 1]} receiveShadow />
      {/* drop-off drive apron from street to walkway */}
      <mesh geometry={geoms.plane} material={asphaltDrive} rotation-x={-Math.PI / 2} position={[0, 0.012, 22.2]} scale={[18, 6, 1]} receiveShadow />
      <mesh position={[-9.2, 0.08, 22.2]} material={mats.curb}>
        <boxGeometry args={[0.35, 0.16, 6]} />
      </mesh>
      <mesh position={[9.2, 0.08, 22.2]} material={mats.curb}>
        <boxGeometry args={[0.35, 0.16, 6]} />
      </mesh>

      {/* ——— stone walkway to the entrance ——— */}
      <mesh geometry={geoms.plane} material={walkway} rotation-x={-Math.PI / 2} position={[0, 0.02, 10.5]} scale={[5.4, 19, 1]} receiveShadow />
      {/* walkway edging */}
      <mesh position={[-2.8, 0.04, 10.5]} material={mats.curb}>
        <boxGeometry args={[0.14, 0.08, 19]} />
      </mesh>
      <mesh position={[2.8, 0.04, 10.5]} material={mats.curb}>
        <boxGeometry args={[0.14, 0.08, 19]} />
      </mesh>

      {/* ——— lawns + planting beds ——— */}
      <mesh geometry={geoms.plane} material={lawnL} rotation-x={-Math.PI / 2} position={[-9.7, 0.015, 10.4]} scale={[13, 16.8, 1]} receiveShadow />
      <mesh geometry={geoms.plane} material={lawnR} rotation-x={-Math.PI / 2} position={[9.7, 0.015, 10.4]} scale={[13, 16.8, 1]} receiveShadow />
      {/* soil bed against the building */}
      <mesh geometry={geoms.plane} material={mats.soil} rotation-x={-Math.PI / 2} position={[0, 0.018, 1.35]} scale={[33, 1.9, 1]} receiveShadow />

      <InstancedList geometry={geoms.box} material={mats.darkMetal} items={bollards} castShadow />
      <InstancedList geometry={geoms.box} material={bollardGlow} items={bollardCaps} />
      <InstancedList geometry={geoms.box} material={mats.hedge} items={hedges} castShadow />
      <InstancedList geometry={geoms.plane} material={uplightPool} items={facadeWash.map((f) => ({ ...f, rotX: -Math.PI / 2 }))} />

      {/* ——— trees: lawn specimens + street trees ——— */}
      <Planting />
      <Tree position={[-11.5, 0, 5.5]} scale={1.15} seed={1} />
      <Tree position={[-13, 0, 13.5]} scale={1.35} seed={2} />
      <Tree position={[-12, 0, 19]} scale={1.0} seed={3} />
      <Tree position={[11.5, 0, 5.5]} scale={1.1} seed={4} />
      <Tree position={[13, 0, 13.5]} scale={1.3} seed={5} />
      <Tree position={[12, 0, 19]} scale={1.05} seed={6} />
      <Tree position={[-20, 0, 27]} scale={1.25} seed={7} />
      <Tree position={[20, 0, 27]} scale={1.2} seed={8} />

      {/* ——— street lamps ——— */}
      <StreetLamp position={[-14, 0, 29.2]} />
      <StreetLamp position={[14, 0, 29.2]} />

      {/* ——— monument sign ——— */}
      <group position={[6.2, 0, 18.5]} rotation-y={-0.3}>
        <mesh position={[0, 0.6, 0]} material={mats.stoneDark} castShadow>
          <boxGeometry args={[2.8, 1.2, 0.42]} />
        </mesh>
        <mesh position={[0, 1.24, 0]} material={mats.darkMetal}>
          <boxGeometry args={[2.9, 0.08, 0.5]} />
        </mesh>
        <ExtrudedText text="CRD" size={0.4} depth={0.05} material={mats.goldBright} position={[-0.4, 0.75, 0.22]} />
        <ExtrudedText text="PROPERTY GROUP" size={0.105} depth={0.03} material={mats.gold} position={[0, 0.34, 0.22]} />
        <mesh geometry={geoms.plane} material={uplightPool} rotation-x={-Math.PI / 2} position={[0, 0.03, 0.55]} scale={[2.8, 0.6, 1]} />
      </group>

      {/* premium planters flanking the entrance */}
      {[-4.6, 4.6].map((x) => (
        <group key={x} position={[x, 0, 2.2]}>
          <mesh position={[0, 0.4, 0]} material={mats.stoneDark} castShadow>
            <boxGeometry args={[1.0, 0.8, 1.0]} />
          </mesh>
          <mesh position={[0, 1.05, 0]} material={mats.hedge}>
            <sphereGeometry args={[0.46, 10, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
