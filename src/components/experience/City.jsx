import { useMemo } from 'react'
import * as THREE from 'three'
import { mats, geoms } from './materials'
import { InstancedList, mulberry32 } from './Building'

// Urban context. The HDRI sky is the backdrop; this adds a believable
// Northeast skyline: near neighborhood mid-rises that ground the block,
// a distant tower skyline, window lights, and the ground plane.

function Neighborhood() {
  // A few mid-rise neighbors at the edges of the block — near enough to
  // give depth, far enough to keep the CRD building dominant.
  const buildings = useMemo(
    () => [
      { pos: [-42, 9, -18], scale: [18, 18, 22], mat: 'stone' },
      { pos: [-38, 6, 18], scale: [14, 12, 16], mat: 'panel' },
      { pos: [44, 11, -12], scale: [20, 22, 24], mat: 'panel' },
      { pos: [40, 7, 22], scale: [15, 14, 14], mat: 'stone' },
    ],
    []
  )

  const stoneMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#4a443c', metalness: 0.05, roughness: 0.9 }),
    []
  )
  const panelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#23262e', metalness: 0.4, roughness: 0.6 }),
    []
  )

  const { lights } = useMemo(() => {
    const rng = mulberry32(17)
    const pos = []
    const col = []
    buildings.forEach((b) => {
      const n = 10 + Math.floor(rng() * 14)
      for (let k = 0; k < n; k++) {
        const face = rng() > 0.5 ? 1 : -1
        pos.push(
          b.pos[0] + (rng() - 0.5) * b.scale[0] * 0.8,
          1.5 + rng() * (b.scale[1] * 2 - 3) * 0.5 + b.pos[1] - b.scale[1] / 2 + 1,
          b.pos[2] + face * (b.scale[2] / 2 + 0.3)
        )
        const warm = rng() > 0.3
        const br = 0.5 + rng() * 0.8
        if (warm) col.push(1.5 * br, 1.05 * br, 0.55 * br)
        else col.push(0.75 * br, 0.85 * br, 1.05 * br)
      }
    })
    return { lights: { positions: new Float32Array(pos), colors: new Float32Array(col), count: pos.length / 3 } }
  }, [buildings])

  const pMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.7,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  )

  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos} material={b.mat === 'stone' ? stoneMat : panelMat} castShadow receiveShadow>
          <boxGeometry args={b.scale} />
        </mesh>
      ))}
      {/* simple parapet caps so the neighbors read as buildings */}
      {buildings.map((b, i) => (
        <mesh key={`c${i}`} position={[b.pos[0], b.pos[1] + b.scale[1] / 2 + 0.15, b.pos[2]]} material={mats.darkMetal}>
          <boxGeometry args={[b.scale[0] + 0.4, 0.3, b.scale[2] + 0.4]} />
        </mesh>
      ))}
      <points material={pMat} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lights.count} array={lights.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={lights.count} array={lights.colors} itemSize={3} />
        </bufferGeometry>
      </points>
    </group>
  )
}

function Skyline() {
  const { towers, lights } = useMemo(() => {
    const rng = mulberry32(7)
    const towers = []
    const lightPos = []
    const lightCol = []
    for (let i = 0; i < 42; i++) {
      const x = (rng() - 0.5) * 320
      const z = -80 - rng() * 120
      if (Math.abs(x) < 28 && z > -105) continue
      const w = 10 + rng() * 16
      const d = 10 + rng() * 14
      const h = 14 + rng() * 60
      towers.push({ pos: [x, h / 2, z], scale: [w, h, d] })
      const n = Math.floor(8 + rng() * 18)
      for (let k = 0; k < n; k++) {
        lightPos.push(x + (rng() - 0.5) * w * 0.85, 2 + rng() * (h - 4), z + d / 2 + 0.5)
        const warm = rng() > 0.35
        const b = 0.5 + rng() * 0.9
        if (warm) lightCol.push(1.5 * b, 1.05 * b, 0.55 * b)
        else lightCol.push(0.75 * b, 0.85 * b, 1.05 * b)
      }
    }
    return {
      towers,
      lights: {
        positions: new Float32Array(lightPos),
        colors: new Float32Array(lightCol),
        count: lightPos.length / 3,
      },
    }
  }, [])

  const pointsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.9,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  )

  return (
    <group>
      <InstancedList geometry={geoms.box} material={mats.towerDark} items={towers} />
      <points material={pointsMat} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lights.count} array={lights.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={lights.count} array={lights.colors} itemSize={3} />
        </bufferGeometry>
      </points>
    </group>
  )
}

export default function City({ isMobile }) {
  return (
    <group>
      <Neighborhood />
      <Skyline />
      {/* ground plane beneath everything */}
      <mesh geometry={geoms.plane} material={mats.ground} rotation-x={-Math.PI / 2} position={[0, -0.02, -20]} scale={[800, 800, 1]} receiveShadow />
    </group>
  )
}
