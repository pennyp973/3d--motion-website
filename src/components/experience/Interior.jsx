import { useMemo } from 'react'
import * as THREE from 'three'
import { mats, geoms } from './materials'
import { InstancedList, ExtrudedText, B } from './Building'

// Ground-floor interior: lobby (z 0…-13), corridor (-13…-16),
// residence (-16…-28) ending in full-height glazing to the city.

const polishedStone = new THREE.MeshStandardMaterial({
  color: '#141210',
  metalness: 0.45,
  roughness: 0.22,
  envMapIntensity: 1.4,
})

const ceilingStrip = new THREE.MeshBasicMaterial({
  color: new THREE.Color(1.6, 1.25, 0.8),
  toneMapped: false,
})

const sconce = new THREE.MeshBasicMaterial({
  color: new THREE.Color(1.9, 1.4, 0.85),
  toneMapped: false,
})

function Lobby() {
  const strips = useMemo(
    () => [
      { pos: [-3.5, 3.98, -4], scale: [0.18, 0.04, 6] },
      { pos: [0, 3.98, -7], scale: [0.18, 0.04, 9] },
      { pos: [3.5, 3.98, -4], scale: [0.18, 0.04, 6] },
      // cove above reception
      { pos: [-4, 3.2, -12.6], scale: [5.5, 0.05, 0.08] },
    ],
    []
  )

  return (
    <group>
      {/* polished stone floor */}
      <mesh geometry={geoms.plane} material={polishedStone} rotation-x={-Math.PI / 2} position={[0, 0.01, -6.5]} scale={[16, 13, 1]} receiveShadow />
      {/* ceiling */}
      <mesh position={[0, 4.05, -6.5]} material={mats.interiorCeiling}>
        <boxGeometry args={[16, 0.12, 13]} />
      </mesh>
      <InstancedList geometry={geoms.box} material={ceilingStrip} items={strips} />
      {/* side walls */}
      <mesh position={[-8, 2, -6.5]} material={mats.interiorWall}>
        <boxGeometry args={[0.2, 4.1, 13]} />
      </mesh>
      <mesh position={[8, 2, -6.5]} material={mats.interiorWall}>
        <boxGeometry args={[0.2, 4.1, 13]} />
      </mesh>
      {/* rear wall with corridor opening (x ±1.9) */}
      <mesh position={[-5, 2, -13]} material={mats.wood}>
        <boxGeometry args={[6.2, 4.1, 0.25]} />
      </mesh>
      <mesh position={[5, 2, -13]} material={mats.wood}>
        <boxGeometry args={[6.2, 4.1, 0.25]} />
      </mesh>
      <mesh position={[0, 3.55, -13]} material={mats.wood}>
        <boxGeometry args={[3.9, 1.0, 0.25]} />
      </mesh>
      {/* gold reveal around the corridor opening */}
      <mesh position={[-1.92, 1.5, -12.98]} material={mats.gold}>
        <boxGeometry args={[0.06, 3.1, 0.3]} />
      </mesh>
      <mesh position={[1.92, 1.5, -12.98]} material={mats.gold}>
        <boxGeometry args={[0.06, 3.1, 0.3]} />
      </mesh>

      {/* reception desk (left) */}
      <group position={[-4, 0, -10.5]}>
        <mesh position={[0, 0.55, 0]} material={mats.stone} castShadow>
          <boxGeometry args={[4.2, 1.1, 0.9]} />
        </mesh>
        <mesh position={[0, 1.12, 0]} material={mats.darkMetal}>
          <boxGeometry args={[4.4, 0.06, 1.05]} />
        </mesh>
        <mesh position={[0, 0.12, 0.48]} material={mats.gold}>
          <boxGeometry args={[4.2, 0.05, 0.02]} />
        </mesh>
        {/* pendant trio above the desk */}
        {[-1.3, 0, 1.3].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, 3.3, 0]} material={mats.darkMetal}>
              <cylinderGeometry args={[0.012, 0.012, 1.4, 6]} />
            </mesh>
            <mesh position={[0, 2.55, 0]} material={sconce}>
              <sphereGeometry args={[0.09, 12, 12]} />
            </mesh>
          </group>
        ))}
      </group>
      {/* CRD lettering on the rear wood wall behind the desk */}
      <ExtrudedText text="CRD" size={0.5} depth={0.06} material={mats.goldBright} position={[-4.6, 2.5, -12.85]} />
      <mesh position={[-4.6, 2.05, -12.85]} material={mats.gold}>
        <boxGeometry args={[2.2, 0.02, 0.04]} />
      </mesh>

      {/* lounge seating (right) */}
      <group position={[4.2, 0, -8]}>
        <mesh geometry={geoms.plane} material={mats.rug} rotation-x={-Math.PI / 2} position={[0, 0.02, 0]} scale={[5, 4, 1]} />
        <Sofa position={[0, 0, -1.4]} />
        <Sofa position={[0, 0, 1.4]} rotationY={Math.PI} />
        <mesh position={[0, 0.22, 0]} material={mats.darkMetal} castShadow>
          <boxGeometry args={[1.6, 0.16, 0.8]} />
        </mesh>
        <mesh position={[0.45, 0.36, 0]} material={mats.gold}>
          <cylinderGeometry args={[0.12, 0.14, 0.12, 16]} />
        </mesh>
      </group>

      {/* columns */}
      <mesh position={[-3.4, 2, -4]} material={mats.stone} castShadow>
        <boxGeometry args={[0.55, 4.1, 0.55]} />
      </mesh>
      <mesh position={[3.4, 2, -4]} material={mats.stone} castShadow>
        <boxGeometry args={[0.55, 4.1, 0.55]} />
      </mesh>
      {/* planters flanking the entrance, inside */}
      <Planter position={[-6.5, 0, -2]} />
      <Planter position={[6.5, 0, -2]} />
    </group>
  )
}

function Corridor() {
  const sconces = useMemo(() => {
    const s = []
    ;[-14, -15.2].forEach((z) => {
      s.push({ pos: [-1.82, 2.2, z], scale: [0.05, 0.7, 0.05] })
      s.push({ pos: [1.82, 2.2, z], scale: [0.05, 0.7, 0.05] })
    })
    return s
  }, [])

  return (
    <group>
      <mesh geometry={geoms.plane} material={polishedStone} rotation-x={-Math.PI / 2} position={[0, 0.01, -14.5]} scale={[3.8, 3.2, 1]} />
      <mesh position={[0, 3.06, -14.5]} material={mats.interiorCeiling}>
        <boxGeometry args={[3.8, 0.12, 3.2]} />
      </mesh>
      <mesh position={[-1.9, 1.5, -14.5]} material={mats.wood}>
        <boxGeometry args={[0.2, 3.1, 3.2]} />
      </mesh>
      <mesh position={[1.9, 1.5, -14.5]} material={mats.wood}>
        <boxGeometry args={[0.2, 3.1, 3.2]} />
      </mesh>
      <InstancedList geometry={geoms.box} material={sconce} items={sconces} />
    </group>
  )
}

function Residence() {
  const rearMullions = useMemo(() => {
    const m = []
    for (let i = 0; i <= 8; i++) {
      const x = -8 + i * 2
      m.push({ pos: [x, 1.7, -27.9], scale: [0.08, 3.4, 0.12] })
    }
    return m
  }, [])

  return (
    <group>
      {/* wood floor */}
      <mesh geometry={geoms.plane} material={mats.woodFloor} rotation-x={-Math.PI / 2} position={[0, 0.01, -22]} scale={[16, 12, 1]} receiveShadow />
      {/* ceiling with strips */}
      <mesh position={[0, 3.36, -22]} material={mats.interiorCeiling}>
        <boxGeometry args={[16, 0.12, 12]} />
      </mesh>
      <InstancedList
        geometry={geoms.box}
        material={ceilingStrip}
        items={[
          { pos: [-3.5, 3.28, -20], scale: [0.16, 0.04, 5] },
          { pos: [3, 3.28, -23], scale: [0.16, 0.04, 6] },
        ]}
      />
      {/* side walls */}
      <mesh position={[-8, 1.7, -22]} material={mats.interiorWall}>
        <boxGeometry args={[0.2, 3.4, 12]} />
      </mesh>
      <mesh position={[8, 1.7, -22]} material={mats.interiorWall}>
        <boxGeometry args={[0.2, 3.4, 12]} />
      </mesh>
      {/* wall between corridor and residence */}
      <mesh position={[-5, 1.7, -16]} material={mats.interiorWall}>
        <boxGeometry args={[6.2, 3.4, 0.2]} />
      </mesh>
      <mesh position={[5, 1.7, -16]} material={mats.interiorWall}>
        <boxGeometry args={[6.2, 3.4, 0.2]} />
      </mesh>

      {/* kitchen — island, rear counter, pendants */}
      <group position={[-4, 0, -19]}>
        <mesh position={[0, 0.5, 0]} material={mats.stone} castShadow>
          <boxGeometry args={[3, 1, 1.25]} />
        </mesh>
        <mesh position={[0, 1.02, 0]} material={polishedStone}>
          <boxGeometry args={[3.2, 0.06, 1.4]} />
        </mesh>
        <mesh position={[0, 0.1, 0.65]} material={mats.gold}>
          <boxGeometry args={[3, 0.04, 0.02]} />
        </mesh>
        {[-1, 0, 1].map((x) => (
          <group key={x}>
            <mesh position={[x, 2.7, 0]} material={mats.darkMetal}>
              <cylinderGeometry args={[0.01, 0.01, 1.2, 6]} />
            </mesh>
            <mesh position={[x, 2.05, 0]} material={sconce}>
              <cylinderGeometry args={[0.08, 0.11, 0.22, 14]} />
            </mesh>
          </group>
        ))}
        {/* rear counter along the left wall */}
        <mesh position={[-3.4, 0.48, -1]} material={mats.darkMetal} castShadow>
          <boxGeometry args={[0.9, 0.96, 4.6]} />
        </mesh>
        <mesh position={[-3.65, 2.2, -1]} material={ceilingStrip}>
          <boxGeometry args={[0.04, 0.03, 4.2]} />
        </mesh>
      </group>

      {/* dining */}
      <group position={[3.4, 0, -19.5]}>
        <mesh position={[0, 0.72, 0]} material={mats.wood} castShadow>
          <boxGeometry args={[2.4, 0.08, 1.1]} />
        </mesh>
        <mesh position={[-0.9, 0.36, 0]} material={mats.darkMetal}>
          <boxGeometry args={[0.08, 0.72, 0.9]} />
        </mesh>
        <mesh position={[0.9, 0.36, 0]} material={mats.darkMetal}>
          <boxGeometry args={[0.08, 0.72, 0.9]} />
        </mesh>
        <mesh position={[0, 0.35, 0.85]} material={mats.upholstery}>
          <boxGeometry args={[2.2, 0.7, 0.4]} />
        </mesh>
        <mesh position={[0, 0.35, -0.85]} material={mats.upholstery}>
          <boxGeometry args={[2.2, 0.7, 0.4]} />
        </mesh>
        <mesh position={[0, 0.84, 0]} material={mats.gold}>
          <cylinderGeometry args={[0.1, 0.12, 0.1, 16]} />
        </mesh>
      </group>

      {/* living — sofa facing the glazing, rug, lamp */}
      <group position={[2.8, 0, -24.5]}>
        <mesh geometry={geoms.plane} material={mats.rug} rotation-x={-Math.PI / 2} position={[0, 0.02, -0.5]} scale={[5.4, 4, 1]} />
        <Sofa position={[0, 0, 0.6]} wide />
        <mesh position={[0, 0.2, -1.2]} material={mats.darkMetal} castShadow>
          <boxGeometry args={[1.8, 0.14, 0.9]} />
        </mesh>
        <group position={[2.4, 0, 0.2]}>
          <mesh position={[0, 0.8, 0]} material={mats.darkMetal}>
            <cylinderGeometry args={[0.02, 0.03, 1.6, 8]} />
          </mesh>
          <mesh position={[0, 1.68, 0]} material={sconce}>
            <sphereGeometry args={[0.12, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* framed art on the right wall */}
      {[-20.5, -23.5].map((z) => (
        <group key={z} position={[7.88, 1.9, z]}>
          <mesh material={mats.gold}>
            <boxGeometry args={[0.05, 1.5, 1.1]} />
          </mesh>
          <mesh position={[-0.04, 0, 0]} material={mats.upholstery}>
            <boxGeometry args={[0.02, 1.34, 0.94]} />
          </mesh>
        </group>
      ))}

      {/* rear glazing — clear, city visible beyond */}
      <mesh geometry={geoms.plane} material={mats.clearGlass} position={[0, 1.7, -27.92]} scale={[16, 3.4, 1]} />
      <InstancedList geometry={geoms.box} material={mats.mullion} items={rearMullions} />
      <mesh position={[0, 3.42, -27.9]} material={mats.mullion}>
        <boxGeometry args={[16, 0.18, 0.16]} />
      </mesh>
    </group>
  )
}

function Sofa({ position, rotationY = 0, wide = false }) {
  const w = wide ? 3 : 2.4
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh position={[0, 0.3, 0]} material={mats.upholstery} castShadow>
        <boxGeometry args={[w, 0.42, 1.05]} />
      </mesh>
      <mesh position={[0, 0.66, 0.42]} material={mats.upholstery}>
        <boxGeometry args={[w, 0.6, 0.24]} />
      </mesh>
      <mesh position={[-w / 2 + 0.12, 0.52, 0]} material={mats.upholstery}>
        <boxGeometry args={[0.24, 0.34, 1.05]} />
      </mesh>
      <mesh position={[w / 2 - 0.12, 0.52, 0]} material={mats.upholstery}>
        <boxGeometry args={[0.24, 0.34, 1.05]} />
      </mesh>
    </group>
  )
}

export function Planter({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} material={mats.stoneDark} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
      </mesh>
      <mesh position={[0, 0.95, 0]} material={mats.hedge}>
        <sphereGeometry args={[0.42, 10, 8]} />
      </mesh>
    </group>
  )
}

export default function Interior() {
  return (
    <group>
      <Lobby />
      <Corridor />
      <Residence />
    </group>
  )
}
