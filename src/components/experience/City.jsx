import { useMemo } from 'react'
import * as THREE from 'three'
import { mats, geoms } from './materials'
import { InstancedList } from './Building'

// Night city context: gradient sky dome with a sunset ember to the
// north, silhouette towers, a field of distant window lights, ground.

function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {},
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            float h = clamp(vDir.y, 0.0, 1.0);
            // ember glow strongest toward the north (-z), at the horizon
            float north = clamp(-vDir.z, 0.0, 1.0);
            vec3 zenith = vec3(0.012, 0.018, 0.035);
            vec3 horizonBase = vec3(0.05, 0.065, 0.095);
            vec3 ember = vec3(0.42, 0.19, 0.07);
            vec3 horizon = mix(horizonBase, ember, pow(north, 1.6) * 0.85);
            vec3 col = mix(horizon, zenith, pow(h, 0.5));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  )
  return (
    <mesh material={material} renderOrder={-10}>
      <sphereGeometry args={[420, 32, 20]} />
    </mesh>
  )
}

function Towers() {
  const { towers, lights } = useMemo(() => {
    const rng = mulberry32(7)
    const towers = []
    const lightPos = []
    const lightCol = []
    for (let i = 0; i < 42; i++) {
      const x = (rng() - 0.5) * 300
      const z = -70 - rng() * 110
      if (Math.abs(x) < 26 && z > -95) continue // keep the view corridor open
      const w = 10 + rng() * 16
      const d = 10 + rng() * 14
      const h = 14 + rng() * 58
      towers.push({ pos: [x, h / 2, z], scale: [w, h, d] })
      // sprinkle lit windows on the south face (facing us)
      const n = Math.floor(6 + rng() * 16)
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

function Stars() {
  const { positions, count } = useMemo(() => {
    const rng = mulberry32(99)
    const n = 260
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = rng() * Math.PI * 2
      const r = 180 + rng() * 200
      arr[i * 3] = Math.cos(a) * r
      arr[i * 3 + 1] = 60 + rng() * 240
      arr[i * 3 + 2] = Math.sin(a) * r
    }
    return { positions: arr, count: n }
  }, [])

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.7,
        color: new THREE.Color(0.8, 0.85, 1),
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  )

  return (
    <points material={mat} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
    </points>
  )
}

export default function City({ isMobile }) {
  return (
    <group>
      <SkyDome />
      <Towers />
      {!isMobile && <Stars />}
      {/* ground plane */}
      <mesh geometry={geoms.plane} material={mats.ground} rotation-x={-Math.PI / 2} position={[0, -0.02, -20]} scale={[700, 700, 1]} receiveShadow />
    </group>
  )
}

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
