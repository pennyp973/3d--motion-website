import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { journey } from '../../journey/journeyState'

// Fine atmospheric dust along the whole camera journey — exterior
// plaza, interior rooms and the rooftop. GPU-animated points.
export default function Particles({ count = 900 }) {
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
      positions[i * 3] = (rng() - 0.5) * 56
      positions[i * 3 + 1] = rng() * 34
      positions[i * 3 + 2] = 44 - rng() * 92
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
            p.y += sin(uTime * (0.12 + aSeed * 0.2) + aSeed * 40.0) * 0.5;
            p.x += cos(uTime * (0.08 + aSeed * 0.16) + aSeed * 20.0) * 0.35;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            float twinkle = 0.5 + 0.5 * sin(uTime * (0.5 + aSeed) + aSeed * 90.0);
            vAlpha = twinkle * smoothstep(-60.0, -4.0, mv.z);
            gl_PointSize = (10.0 + aSeed * 20.0) * uPixelRatio / max(1.0, -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;

          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            float glow = smoothstep(0.5, 0.0, d);
            vec3 dust = vec3(0.85, 0.72, 0.45);
            gl_FragColor = vec4(dust, glow * glow * vAlpha * 0.32);
          }
        `,
      }),
    []
  )

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio()
    if (ref.current) {
      ref.current.position.x = -journey.smoothMouse.x * 0.3
      ref.current.position.y = journey.smoothMouse.y * 0.2
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
