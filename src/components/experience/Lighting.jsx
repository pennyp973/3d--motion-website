import { Environment, Lightformer } from '@react-three/drei'
import { B } from './Building'

// Night-scene lighting: cool moonlight key with shadows, a faint warm
// city-glow fill, and interior fixture points. Everything else glows
// from emissive geometry so the light count stays low.
export default function Lighting({ isMobile }) {
  return (
    <>
      <hemisphereLight args={['#1c2536', '#0a0908', 0.62]} />
      <ambientLight intensity={0.06} />

      {/* moon key — cool, from the south-west, casts the building shadows */}
      <directionalLight
        position={[-38, 55, 42]}
        intensity={0.85}
        color="#b9c8de"
        castShadow={!isMobile}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
        shadow-camera-far={160}
        shadow-bias={-0.0005}
      />
      {/* warm ember fill from the north horizon */}
      <directionalLight position={[10, 12, -60]} intensity={0.22} color="#d8a06a" />

      {/* entrance canopy pool */}
      <pointLight position={[0, 3.2, 1.6]} intensity={4.5} color="#f3ddb2" distance={9} />
      {/* lobby */}
      <pointLight position={[0, 3.6, -7]} intensity={11} color="#e8c894" distance={14} />
      {/* residence */}
      <pointLight position={[-1, 3, -20]} intensity={16} color="#e8c894" distance={16} />
      <pointLight position={[2.5, 2.6, -24.5]} intensity={7} color="#e8c894" distance={10} />
      {/* facade sign wash */}
      <pointLight position={[0, 5.6, 2.5]} intensity={4} color="#e8cf9a" distance={7} />
      {/* rooftop terrace ambience */}
      <pointLight position={[-4, B.TOP + 3.4, -14]} intensity={6} color="#f0d5a0" distance={14} />

      {/* procedural environment map for glass + metal reflections */}
      <Environment resolution={isMobile ? 64 : 256} frames={1}>
        <Lightformer intensity={2.2} position={[0, 8, -30]} scale={[40, 4, 1]} color="#c98a4e" />
        <Lightformer intensity={1.2} position={[0, 30, 20]} rotation-x={Math.PI / 3} scale={[30, 10, 1]} color="#2c3c55" />
        <Lightformer intensity={0.8} position={[-25, 10, 0]} rotation-y={Math.PI / 2} scale={[20, 3, 1]} color="#5a4a30" />
        <Lightformer intensity={0.6} position={[25, 14, 0]} rotation-y={-Math.PI / 2} scale={[20, 3, 1]} color="#3a4a62" />
      </Environment>
    </>
  )
}
