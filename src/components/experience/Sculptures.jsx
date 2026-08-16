import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { journey } from '../../journey/journeyState'

// How strongly a sculpture "wakes up" as the camera nears its chapter
function activation(center, spread = 0.14) {
  const d = Math.abs(journey.smooth - center)
  return THREE.MathUtils.clamp(1 - d / spread, 0, 1)
}

const gold = {
  color: '#8a6d3b',
  metalness: 1,
  roughness: 0.22,
  envMapIntensity: 1.6,
}

export default function Sculptures({ isMobile }) {
  return (
    <>
      <TorusForm isMobile={isMobile} />
      <OrbitRings />
      <Monolith isMobile={isMobile} />
      <ShardField />
    </>
  )
}

// Chapter II — Philosophy: a slowly-turning gold knot, the "endless line"
function TorusForm({ isMobile }) {
  const group = useRef()
  const mesh = useRef()

  useFrame((state, delta) => {
    const a = activation(0.29, 0.2)
    const t = state.clock.elapsedTime
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.12
      mesh.current.rotation.y = t * (0.16 + a * 0.25)
      const s = 1 + a * 0.12
      mesh.current.scale.setScalar(s)
      mesh.current.material.emissiveIntensity = a * 0.35
    }
    if (group.current) {
      group.current.position.y = 2.1 + Math.sin(t * 0.5) * 0.15
    }
  })

  return (
    <group ref={group} position={[-4.6, 2.1, -0.5]}>
      <mesh ref={mesh} castShadow={!isMobile}>
        <torusKnotGeometry args={[0.95, 0.28, isMobile ? 128 : 256, isMobile ? 20 : 40]} />
        <meshStandardMaterial {...gold} emissive="#c9a962" emissiveIntensity={0} />
      </mesh>
    </group>
  )
}

// Chapter III — Craft: three concentric rings orbiting a burning core
function OrbitRings() {
  const g1 = useRef()
  const g2 = useRef()
  const g3 = useRef()
  const core = useRef()

  useFrame((state) => {
    const a = activation(0.52, 0.2)
    const t = state.clock.elapsedTime
    const speed = 0.4 + a * 1.1
    if (g1.current) {
      g1.current.rotation.x = t * speed * 0.5
      g1.current.rotation.y = t * speed * 0.3
    }
    if (g2.current) {
      g2.current.rotation.y = t * speed * 0.55
      g2.current.rotation.z = t * speed * 0.35
    }
    if (g3.current) {
      g3.current.rotation.x = -t * speed * 0.4
      g3.current.rotation.z = t * speed * 0.5
    }
    if (core.current) {
      const pulse = 1 + Math.sin(t * 2.4) * 0.08 * (0.4 + a)
      core.current.scale.setScalar(pulse * 0.8)
      core.current.material.emissiveIntensity = 0.9 + a * 1.3
    }
  })

  const ringMat = useMemo(
    () => ({ color: '#9b7c45', metalness: 1, roughness: 0.18, envMapIntensity: 1.8 }),
    []
  )

  return (
    <group position={[2.2, 2.6, -8.5]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.42, 3]} />
        <meshStandardMaterial
          color="#1a1408"
          emissive="#e8cf8f"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <group ref={g1}>
        <mesh>
          <torusGeometry args={[1.15, 0.035, 16, 128]} />
          <meshStandardMaterial {...ringMat} />
        </mesh>
      </group>
      <group ref={g2}>
        <mesh>
          <torusGeometry args={[1.6, 0.028, 16, 128]} />
          <meshStandardMaterial {...ringMat} />
        </mesh>
      </group>
      <group ref={g3}>
        <mesh>
          <torusGeometry args={[2.05, 0.022, 16, 128]} />
          <meshStandardMaterial {...ringMat} />
        </mesh>
      </group>
    </group>
  )
}

// Chapter IV — Collection: a faceted dark crystal monolith, lit from within
function Monolith({ isMobile }) {
  const mesh = useRef()
  const inner = useRef()

  useFrame((state) => {
    const a = activation(0.73, 0.2)
    const t = state.clock.elapsedTime
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.15 + a * 0.4
    }
    if (inner.current) {
      inner.current.material.emissiveIntensity = 0.6 + a * 2.6
      inner.current.rotation.y = -t * 0.3
      inner.current.rotation.x = t * 0.2
    }
  })

  return (
    <group position={[5.0, 0, -16]}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.4}>
        <mesh ref={mesh} position={[0, 2.2, 0]} castShadow={!isMobile}>
          <octahedronGeometry args={[1.05, 0]} />
          <meshPhysicalMaterial
            color="#15151c"
            metalness={0.3}
            roughness={0.05}
            transmission={isMobile ? 0 : 0.6}
            thickness={1.2}
            ior={1.6}
            envMapIntensity={3}
            clearcoat={1}
            clearcoatRoughness={0.06}
            transparent
            opacity={isMobile ? 0.92 : 1}
          />
        </mesh>
        {/* burning heart inside the crystal */}
        <mesh ref={inner} position={[0, 2.2, 0]} scale={0.5}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#3a2b10"
            emissive="#e8cf8f"
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </mesh>
        {/* warm glow bleeding out of the crystal onto its plinth */}
        <pointLight position={[0, 2.2, 0]} intensity={6} color="#e8cf8f" distance={7} />
      </Float>
      {/* key light on the camera-facing facets */}
      <pointLight position={[-3.2, 3.2, 1.5]} intensity={22} color="#f0dcae" distance={11} />
      {/* plinth */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <cylinderGeometry args={[1.05, 1.2, 0.6, 64]} />
        <meshStandardMaterial color="#0c0c0e" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

// Scattered gold shards that drift along the whole journey
function ShardField() {
  const ref = useRef()

  const shards = useMemo(() => {
    const rng = mulberry32(1837)
    return Array.from({ length: 26 }, () => ({
      pos: [
        (rng() - 0.5) * 24,
        0.8 + rng() * 5.5,
        16 - rng() * 54,
      ],
      rot: [rng() * Math.PI, rng() * Math.PI, rng() * Math.PI],
      scale: 0.08 + rng() * 0.22,
      speed: 0.2 + rng() * 0.5,
    }))
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!ref.current) return
    ref.current.children.forEach((child, i) => {
      const s = shards[i]
      child.position.y = s.pos[1] + Math.sin(t * s.speed + i * 1.7) * 0.35
      child.rotation.x = s.rot[0] + t * s.speed * 0.4
      child.rotation.y = s.rot[1] + t * s.speed * 0.3
    })
  })

  return (
    <group ref={ref}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#7a6236"
            metalness={1}
            roughness={0.25}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  )
}

// Deterministic PRNG so the scene is identical on every visit
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
