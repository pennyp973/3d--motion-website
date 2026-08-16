import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import CameraRig from './CameraRig'
import Lighting from './Lighting'
import Building from './Building'
import Interior from './Interior'
import City from './City'
import Landscape from './Landscape'
import Rooftop from './Rooftop'
import ServicesSignage from './ServicesSignage'
import Particles from './Particles'
import Effects from './Effects'

// Fires once the scene has actually drawn a few frames,
// so the loader never lifts onto a black screen.
function FirstFrames({ onReady }) {
  const frames = useRef(0)
  const fired = useRef(false)
  useFrame(() => {
    if (fired.current) return
    frames.current += 1
    if (frames.current > 2) {
      fired.current = true
      onReady?.()
    }
  })
  return null
}

// The full-screen WebGL stage — fixed behind the scrolling overlay.
// ACES filmic grade at a slightly lifted exposure for the blue hour.
export default function Experience({ isMobile, onReady }) {
  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        shadows="soft"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
        camera={{ fov: isMobile ? 48 : 38, near: 0.1, far: 900, position: [26, 13, 36] }}
      >
        <color attach="background" args={['#10141d']} />
        <fog attach="fog" args={['#181c26', 70, 420]} />
        <Suspense fallback={null}>
          <Lighting isMobile={isMobile} />
          <City isMobile={isMobile} />
          <Building isMobile={isMobile} />
          <Interior />
          <Landscape />
          <Rooftop />
          <ServicesSignage />
          <Particles count={isMobile ? 250 : 600} />
          {/* one static soft contact-shadow bake under the arrival plaza */}
          {!isMobile && (
            <ContactShadows position={[0, 0.03, 10]} scale={70} far={30} blur={2.4} opacity={0.55} frames={1} resolution={512} color="#000208" />
          )}
          <CameraRig parallax={isMobile ? 0.3 : 0.6} />
          {!isMobile && <Effects />}
        </Suspense>
        <FirstFrames onReady={onReady} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
