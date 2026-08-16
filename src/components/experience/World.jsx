import { MeshReflectorMaterial, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

// The hall itself: fog, reflective obsidian floor, architectural light
// columns, and a procedural environment map (no network assets).
export default function World({ isMobile }) {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 14, 46]} />

      {/* Key + fill */}
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[6, 12, 4]}
        intensity={0.8}
        color="#f5e7c8"
        castShadow={!isMobile}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0004}
      />
      {/* Cool rim from behind, warm pools along the path */}
      <pointLight position={[-8, 4, 2]} intensity={14} color="#3d5a80" distance={22} />
      <pointLight position={[2.2, 3.4, -8.5]} intensity={18} color="#c9a962" distance={20} />
      <pointLight position={[1.8, 3.4, -13.5]} intensity={16} color="#b08d57" distance={18} />
      <pointLight position={[0, 6, -28]} intensity={30} color="#e8cf8f" distance={30} />

      {/* Obsidian floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]} receiveShadow>
        <planeGeometry args={[90, 120]} />
        {isMobile ? (
          <meshStandardMaterial color="#08080a" metalness={0.4} roughness={0.6} />
        ) : (
          <MeshReflectorMaterial
            blur={[400, 120]}
            resolution={1024}
            mixBlur={0.9}
            mixStrength={12}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            roughness={0.75}
            color="#0a0a0c"
            metalness={0.55}
            mirror={0.6}
          />
        )}
      </mesh>

      {/* Light columns flanking the journey — glowing slabs picked up by bloom */}
      <LightColumns />

      {/* The distant light gate the whole journey moves toward */}
      <LightGate />

      {/* Procedural environment for reflections — rendered once, no downloads */}
      <Environment resolution={isMobile ? 64 : 256} frames={1}>
        <Lightformer intensity={4} position={[0, 5, -9]} scale={[10, 1, 1]} color="#f0dcae" />
        <Lightformer intensity={1.5} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[12, 1.5, 1]} color="#4a6a92" />
        <Lightformer intensity={1.2} position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[14, 1, 1]} color="#c9a962" />
        <Lightformer intensity={0.6} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} color="#20232a" />
      </Environment>
    </>
  )
}

const columnGeom = new THREE.BoxGeometry(0.12, 9, 0.12)

function LightColumns() {
  const columns = []
  for (let i = 0; i < 9; i++) {
    const z = 14 - i * 6.5
    const flip = i % 2 === 0 ? 1 : -1
    columns.push(
      <group key={i}>
        <mesh geometry={columnGeom} position={[10.5 * flip, 4.5, z]}>
          <meshStandardMaterial
            color="#0d0d0f"
            emissive="#c9a962"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
        <mesh geometry={columnGeom} position={[-10.5 * flip, 4.5, z + 3]}>
          <meshStandardMaterial
            color="#0d0d0f"
            emissive="#31435c"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      </group>
    )
  }
  return <>{columns}</>
}

function LightGate() {
  return (
    <group position={[0, 5, -40]}>
      <mesh>
        <ringGeometry args={[3.4, 3.75, 96]} />
        <meshBasicMaterial color="#f4e3b2" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <circleGeometry args={[3.4, 96]} />
        <meshBasicMaterial color="#1a1610" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <pointLight intensity={40} color="#f4e3b2" distance={26} />
    </group>
  )
}
