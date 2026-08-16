import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats, geoms } from './materials'
import { InstancedList, B } from './Building'
import { journey } from '../../journey/journeyState'

// Penthouse terrace: wood deck, glass parapet, pergola lounge,
// fire pit, planters — the finale scene against the skyline.

const stringLight = new THREE.MeshBasicMaterial({
  color: new THREE.Color(2.0, 1.5, 0.85),
  toneMapped: false,
})

const deckWood = new THREE.MeshStandardMaterial({
  color: '#4f3b25',
  metalness: 0.05,
  roughness: 0.65,
})

export default function Rooftop() {
  const fire = useRef()
  const fireLight = useRef()
  const Y = B.TOP + 0.09

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const near = journey.smooth > 0.85
    const flicker = 0.85 + Math.sin(t * 9.3) * 0.08 + Math.sin(t * 23.7) * 0.05
    if (fire.current) fire.current.material.opacity = near ? flicker : 0.0001
    if (fireLight.current) fireLight.current.intensity = near ? 9 * flicker : 0
  })

  const railings = useMemo(() => {
    const r = []
    // glass panels around the deck zone (z -7 … -21, x -5…11)
    for (let i = 0; i < 8; i++) {
      r.push({ pos: [-5 + 2.1 * i + 1, Y + 0.55, -7], scale: [1.95, 1.1, 1] })
      r.push({ pos: [-5 + 2.1 * i + 1, Y + 0.55, -21], scale: [1.95, 1.1, 1] })
    }
    for (let i = 0; i < 6; i++) {
      r.push({ pos: [-5, Y + 0.55, -8.2 - 2.35 * i], scale: [1.95, 1.1, 1], rotY: Math.PI / 2 })
      r.push({ pos: [11, Y + 0.55, -8.2 - 2.35 * i], scale: [1.95, 1.1, 1], rotY: Math.PI / 2 })
    }
    return r
  }, [Y])

  const stringLights = useMemo(() => {
    const pts = []
    // two gentle catenaries across the lounge
    for (let s = 0; s < 2; s++) {
      const z0 = -10 - s * 6
      for (let i = 0; i < 13; i++) {
        const u = i / 12
        const x = -4.5 + u * 15
        const sag = Math.sin(u * Math.PI) * -0.7
        pts.push({ pos: [x, Y + 3.1 + sag, z0], scale: [0.07, 0.07, 0.07] })
      }
    }
    return pts
  }, [Y])

  return (
    <group>
      {/* deck */}
      <mesh geometry={geoms.plane} material={deckWood} rotation-x={-Math.PI / 2} position={[3, Y, -14]} scale={[16.4, 14.4, 1]} receiveShadow />
      {/* deck border */}
      <mesh position={[3, Y + 0.02, -14]} material={mats.darkMetal}>
        <boxGeometry args={[16.8, 0.06, 14.8]} />
      </mesh>
      <mesh geometry={geoms.plane} material={deckWood} rotation-x={-Math.PI / 2} position={[3, Y + 0.06, -14]} scale={[16.4, 14.4, 1]} receiveShadow />

      {/* glass parapet */}
      {railings.map((r, i) => (
        <mesh key={i} geometry={geoms.plane} material={mats.glass} position={r.pos} rotation-y={r.rotY || 0} scale={r.scale} />
      ))}

      {/* pergola over the west lounge */}
      <group position={[-1.5, Y, -14]}>
        {[
          [-2.6, -2.6],
          [-2.6, 2.6],
          [2.6, -2.6],
          [2.6, 2.6],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 1.5, z]} material={mats.darkMetal} castShadow>
            <boxGeometry args={[0.14, 3, 0.14]} />
          </mesh>
        ))}
        {[-2, -1, 0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 1.2, 3.05, 0]} material={mats.darkMetal}>
            <boxGeometry args={[0.1, 0.14, 5.6]} />
          </mesh>
        ))}
        <mesh position={[0, 2.98, 0]} material={stringLight}>
          <boxGeometry args={[5.4, 0.02, 0.02]} />
        </mesh>
        {/* lounge seating under the pergola */}
        <mesh position={[-1.2, 0.32, 0]} material={mats.upholstery} castShadow>
          <boxGeometry args={[1.3, 0.45, 3.6]} />
        </mesh>
        <mesh position={[1.2, 0.32, 0]} material={mats.upholstery} castShadow>
          <boxGeometry args={[1.3, 0.45, 3.6]} />
        </mesh>
      </group>

      {/* fire pit */}
      <group position={[3.5, Y, -13]}>
        <mesh position={[0, 0.3, 0]} material={mats.stoneDark} castShadow>
          <cylinderGeometry args={[0.85, 0.95, 0.6, 24]} />
        </mesh>
        <mesh ref={fire} geometry={geoms.plane} rotation-x={-Math.PI / 2} position={[0, 0.62, 0]} scale={[1.1, 1.1, 1]}>
          <meshBasicMaterial color={new THREE.Color(2.6, 1.1, 0.3)} toneMapped={false} transparent opacity={0} />
        </mesh>
        <pointLight ref={fireLight} position={[0, 1.2, 0]} color="#ff9a3c" intensity={0} distance={12} />
        {/* seating arc around the pit */}
        {[-1, 0, 1].map((i) => (
          <mesh key={i} position={[Math.sin(i * 0.8) * 2.2, 0.25, Math.cos(i * 0.8) * 2.2]} rotation-y={-i * 0.8} material={mats.upholstery} castShadow>
            <boxGeometry args={[1.5, 0.45, 0.6]} />
          </mesh>
        ))}
      </group>

      {/* string lights */}
      <InstancedList geometry={geoms.box} material={stringLight} items={stringLights} />

      {/* terrace planters */}
      {[
        [-4, -8],
        [-4, -20],
        [10, -8],
        [10, -20],
        [3, -20.5],
      ].map(([x, z], i) => (
        <group key={i} position={[x, Y, z]}>
          <mesh position={[0, 0.3, 0]} material={mats.stoneDark}>
            <boxGeometry args={[1.5, 0.6, 0.7]} />
          </mesh>
          <mesh position={[0, 0.78, 0]} material={mats.hedge}>
            <boxGeometry args={[1.35, 0.5, 0.55]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
