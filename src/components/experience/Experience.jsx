import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
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
// Scroll only moves the camera through the development.
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
        camera={{ fov: isMobile ? 55 : 45, near: 0.1, far: 900, position: [26, 16, 40] }}
      >
        <color attach="background" args={['#05060a']} />
        <fog attach="fog" args={['#0a0c12', 50, 320]} />
        <Suspense fallback={null}>
          <Lighting isMobile={isMobile} />
          <City isMobile={isMobile} />
          <Building isMobile={isMobile} />
          <Interior />
          <Landscape />
          <Rooftop />
          <ServicesSignage />
          <Particles count={isMobile ? 350 : 900} />
          <CameraRig parallax={isMobile ? 0.3 : 0.6} />
          {!isMobile && <Effects />}
        </Suspense>
        <FirstFrames onReady={onReady} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
