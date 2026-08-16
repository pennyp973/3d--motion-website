import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import CameraRig from './CameraRig'
import World from './World'
import Sculptures from './Sculptures'
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

// The full-screen 3D stage. Everything here is fixed behind the
// scrolling overlay — the scroll only moves the camera.
export default function Experience({ isMobile, onReady }) {
  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: isMobile ? 52 : 42, near: 0.1, far: 90, position: [0, 3.2, 26] }}
      >
        <Suspense fallback={null}>
          <World isMobile={isMobile} />
          <Sculptures isMobile={isMobile} />
          <Particles count={isMobile ? 450 : 1400} />
          <CameraRig parallax={isMobile ? 0.35 : 1} />
          {!isMobile && <Effects />}
        </Suspense>
        <FirstFrames onReady={onReady} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
