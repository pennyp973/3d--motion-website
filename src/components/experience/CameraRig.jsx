import { useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { journey, damp } from '../../journey/journeyState'
import { CAMERA_PATH, LOOK_PATH } from '../../journey/chapters'

// Drives the camera along a CatmullRom spline as the visitor scrolls.
// Scroll progress is inertia-smoothed so the ride feels weighted,
// and the pointer adds a subtle handheld parallax on top.
export default function CameraRig({ parallax = 1 }) {
  const { camera } = useThree()

  const { curve, lookCurve } = useMemo(() => {
    const toV3 = (p) => new THREE.Vector3(...p)
    return {
      curve: new THREE.CatmullRomCurve3(CAMERA_PATH.map(toV3), false, 'centripetal', 0.5),
      lookCurve: new THREE.CatmullRomCurve3(LOOK_PATH.map(toV3), false, 'centripetal', 0.5),
    }
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      journey.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      journey.mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    // Exponential damping is framerate-independent, so a large delta on a
    // slow device simply converges further — never clamp it down to the
    // point where wall-clock catch-up crawls.
    const dt = Math.min(delta, 0.6)

    // Weighted scroll follow
    journey.smooth = damp(journey.smooth, journey.progress, 3.2, dt)
    journey.smoothMouse.x = damp(journey.smoothMouse.x, journey.mouse.x, 2.5, dt)
    journey.smoothMouse.y = damp(journey.smoothMouse.y, journey.mouse.y, 2.5, dt)

    const t = THREE.MathUtils.clamp(journey.smooth, 0, 1)
    curve.getPoint(t, pos)
    lookCurve.getPoint(t, look)

    // Subtle breathing so a still frame is never truly still
    const time = state.clock.elapsedTime
    const breatheY = Math.sin(time * 0.35) * 0.04
    const breatheX = Math.cos(time * 0.24) * 0.03

    // Handheld parallax from the pointer — restrained, professional
    const px = journey.smoothMouse.x * 0.4 * parallax
    const py = -journey.smoothMouse.y * 0.25 * parallax

    camera.position.set(
      pos.x + px + breatheX,
      pos.y + py + breatheY,
      pos.z
    )

    look.x += journey.smoothMouse.x * 0.7 * parallax
    look.y += -journey.smoothMouse.y * 0.45 * parallax
    camera.lookAt(look)

    // A whisper of roll through the path's curves
    camera.rotation.z += Math.sin(t * Math.PI * 2) * 0.008 + journey.smoothMouse.x * 0.005
  })

  return null
}
