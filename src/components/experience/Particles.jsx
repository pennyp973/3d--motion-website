import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { journey } from '../../journey/journeyState'

// Atmospheric dust suspended through the hall.
// A custom shader keeps every particle softly round and lets
// size/alpha pulse individually without per-frame CPU work.
export default function Particles({ count = 1400 }) {
  const ref = useRef()

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    let s = 42
    const rng = () => {
      s = (s * 16807) % 2147483647
      return (s - 1) / 2147483646
    }
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 34
      positions[i * 3 + 1] = rng() * 9
      positions[i * 3 + 2] = 20 - rng() * 62
      seeds[i] = rng()
    }
    return { positions, seeds }
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform float uPixelRatio;
          attribute float aSeed;
          varying float vAlpha;

          void main() {
            vec3 p = position;
            p.y += sin(uTime * (0.15 + aSeed * 0.25) + aSeed * 40.0) * 0.6;
            p.x += cos(uTime * (0.1 + aSeed * 0.2) + aSeed * 20.0) * 0.4;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed) + aSeed * 90.0);
            vAlpha = twinkle * smoothstep(-46.0, -6.0, mv.z);
            gl_PointSize = (14.0 + aSeed * 26.0) * uPixelRatio / max(1.0, -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;

          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            float glow = smoothstep(0.5, 0.0, d);
            vec3 dust = vec3(0.85, 0.72, 0.45);
            gl_FragColor = vec4(dust, glow * glow * vAlpha * 0.5);
          }
        `,
      }),
    []
  )

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    if (ref.current) {
      // Dust drifts faintly opposite the pointer — depth cue
      ref.current.position.x = -journey.smoothMouse.x * 0.4
      ref.current.position.y = journey.smoothMouse.y * 0.25
    }
  })

  return (
    <points ref={ref} material={material} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
    </points>
  )
}
