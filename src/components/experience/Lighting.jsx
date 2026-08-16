import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { B } from './archviz'

// Blue-hour architectural lighting: a real evening-sky HDRI drives
// ambient light and every reflection; one soft cool key carries the
// shadows; warm practicals belong to the building itself.

function EnvTuning() {
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    scene.environmentIntensity = 0.42
    scene.backgroundIntensity = 0.6
    return () => {
      scene.environmentIntensity = 1
      scene.backgroundIntensity = 1
    }
  }, [scene])
  return null
}

export default function Lighting({ isMobile }) {
  return (
    <>
      {/* sky HDRI: visible backdrop + lighting + every reflection */}
      <Environment files="/hdri/evening_road_01_puresky_2k.hdr" background />
      <EnvTuning />

      {/* residual daylight — soft cool key from the western sky */}
      <directionalLight
        position={[-45, 60, 55]}
        intensity={1.35}
        color="#a8bcd8"
        castShadow={!isMobile}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-48}
        shadow-camera-right={48}
        shadow-camera-top={48}
        shadow-camera-bottom={-48}
        shadow-camera-far={180}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      {/* warm afterglow bounce from the sunset horizon */}
      <directionalLight position={[20, 14, 70]} intensity={0.5} color="#d8a06a" />
      {/* faint uplight bounce off the ground */}
      <hemisphereLight args={['#2a3550', '#1a1512', 0.35]} />

      {/* entrance canopy pool */}
      <pointLight position={[0, 3.2, 1.8]} intensity={5} color="#f3ddb2" distance={10} decay={2} />
      {/* lobby */}
      <pointLight position={[0, 3.6, -7]} intensity={11} color="#e8c894" distance={14} />
      {/* residence */}
      <pointLight position={[-1, 3, -20]} intensity={16} color="#e8c894" distance={16} />
      <pointLight position={[2.5, 2.6, -24.5]} intensity={7} color="#e8c894" distance={10} />
      {/* stone wing facade wash */}
      <pointLight position={[-11.5, 2.5, 3]} intensity={6} color="#e8cf9a" distance={13} decay={2} />
      {/* rooftop terrace ambience */}
      <pointLight position={[-1, B.TOP + 3.4, -14]} intensity={6} color="#f0d5a0" distance={14} />
    </>
  )
}
