import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats } from './materials'
import { ExtrudedText, B } from './archviz'
import { journey } from '../../journey/journeyState'
import { TIMINGS } from '../../journey/chapters'

// Three architectural signage installations on the rear facade.
// The camera rises past each one during the services sequence —
// the building itself presents what CRD does.

const SERVICES = [
  { text: 'REAL ESTATE', y: 18.6 },
  { text: 'PROPERTY MANAGEMENT', y: 22.2 },
  { text: 'INVESTMENT', y: 26.0 },
]

function Panel({ text, y, timing }) {
  const glow = useRef()
  const wash = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(1.9, 1.45, 0.85),
        toneMapped: false,
        transparent: true,
        opacity: 0.25,
      }),
    []
  )

  useFrame(() => {
    // panel burns brightest as the camera passes it
    const d = Math.abs(journey.smooth - timing)
    const a = THREE.MathUtils.clamp(1 - d / 0.035, 0, 1)
    wash.opacity = 0.18 + a * 0.45
    if (glow.current) glow.current.material.emissiveIntensity = 0.25 + a * 1.4
  })

  const width = Math.max(text.length * 0.62, 7)

  return (
    <group position={[0, y, -B.D - 0.35]} rotation-y={Math.PI}>
      {/* backing slab */}
      <mesh material={mats.darkMetal} castShadow>
        <boxGeometry args={[width + 2.4, 2.3, 0.18]} />
      </mesh>
      {/* dimensional letters */}
      <ExtrudedText text={text} size={0.78} depth={0.12} material={mats.goldBright} position={[0, 0.14, 0.16]} />
      {/* gold rule that lights as you pass */}
      <mesh ref={glow} position={[0, -0.78, 0.14]}>
        <boxGeometry args={[width, 0.05, 0.05]} />
        <meshStandardMaterial color="#7a6236" metalness={1} roughness={0.3} emissive="#c9a25e" emissiveIntensity={0.25} />
      </mesh>
      {/* soft wash strip above */}
      <mesh material={wash} position={[0, 1.05, 0.14]}>
        <boxGeometry args={[width + 1.6, 0.04, 0.04]} />
      </mesh>
    </group>
  )
}

export default function ServicesSignage() {
  return (
    <group>
      {SERVICES.map((s, i) => (
        <Panel key={s.text} text={s.text} y={s.y} timing={TIMINGS.services[i]} />
      ))}
    </group>
  )
}
