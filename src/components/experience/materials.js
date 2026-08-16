import * as THREE from 'three'

// PBR material library for the development. Poly Haven CC0 texture sets
// (diffuse + GL normal + ARM ao/rough/metal) loaded through the default
// manager so the site loader reports real progress. Textures are tiled
// per surface at true world scale via tiled().

const loader = new THREE.TextureLoader()

function tex(path, { srgb = false, repeat = [1, 1] } = {}) {
  const t = loader.load(path)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(...repeat)
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

function pbrSet(name) {
  const base = `/textures/${name}/${name}`
  return {
    map: tex(`${base}_diff_1k.jpg`, { srgb: true }),
    normalMap: tex(`${base}_nor_gl_1k.jpg`),
    armMap: tex(`${base}_arm_1k.jpg`),
  }
}

export const sets = {
  stone: pbrSet('sandstone_blocks_04'),
  concrete: pbrSet('brushed_concrete_03'),
  asphalt: pbrSet('asphalt_04'),
  sidewalk: pbrSet('rectangular_paving'),
  plaza: pbrSet('precast_stone_paving'),
  grass: pbrSet('leafy_grass'),
  deck: pbrSet('wood_floor_deck'),
}

// Physical material from a PBR set. worldSize = meters covered by one
// texture tile; surface = [w, h] meters of the mesh face it dresses.
export function pbrMaterial(set, { surface = [4, 4], worldSize = 4, color = '#ffffff', ...rest } = {}) {
  const rx = surface[0] / worldSize
  const ry = surface[1] / worldSize
  const mkTex = (t, srgb) => {
    const c = t.clone()
    c.repeat.set(rx, ry)
    c.needsUpdate = true
    return c
  }
  return new THREE.MeshStandardMaterial({
    map: mkTex(set.map, true),
    normalMap: mkTex(set.normalMap),
    aoMap: mkTex(set.armMap),
    roughnessMap: mkTex(set.armMap),
    metalnessMap: mkTex(set.armMap),
    color,
    metalness: 1, // modulated by ARM blue channel
    roughness: 1, // modulated by ARM green channel
    ...rest,
  })
}

// ——— Untextured architectural materials ———

export const mats = {
  // Vision glass — deep blue-green, strongly reflective
  glass: new THREE.MeshPhysicalMaterial({
    color: '#12181d',
    metalness: 0.05,
    roughness: 0.05,
    envMapIntensity: 1.6,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.75,
  }),
  // Slightly hazier glass variant so units differ
  glassSoft: new THREE.MeshPhysicalMaterial({
    color: '#151b1f',
    metalness: 0.05,
    roughness: 0.14,
    envMapIntensity: 1.1,
    transparent: true,
    opacity: 0.8,
  }),
  // Clear low-iron entrance glass
  clearGlass: new THREE.MeshPhysicalMaterial({
    color: '#1a2129',
    metalness: 0,
    roughness: 0.03,
    envMapIntensity: 1.3,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  }),
  mullion: new THREE.MeshStandardMaterial({ color: '#22262a', metalness: 0.85, roughness: 0.35 }),
  darkMetal: new THREE.MeshStandardMaterial({ color: '#1d2125', metalness: 0.8, roughness: 0.42 }),
  // Bronze-anodized panel for the east wing
  bronzePanel: new THREE.MeshStandardMaterial({ color: '#241f1a', metalness: 0.45, roughness: 0.62, envMapIntensity: 0.7 }),
  panelGroove: new THREE.MeshStandardMaterial({ color: '#0e0f11', metalness: 0.4, roughness: 0.8 }),
  stone: new THREE.MeshStandardMaterial({ color: '#8a8274', metalness: 0.02, roughness: 0.9 }),
  stoneDark: new THREE.MeshStandardMaterial({ color: '#454138', metalness: 0.05, roughness: 0.88 }),
  concrete: new THREE.MeshStandardMaterial({ color: '#4a463f', metalness: 0.02, roughness: 0.92 }),
  wood: new THREE.MeshStandardMaterial({ color: '#6b4f33', metalness: 0.05, roughness: 0.62 }),
  woodSlat: new THREE.MeshStandardMaterial({ color: '#7a5836', metalness: 0.02, roughness: 0.55 }),
  woodFloor: new THREE.MeshStandardMaterial({ color: '#4a3722', metalness: 0.1, roughness: 0.55 }),
  gold: new THREE.MeshStandardMaterial({ color: '#b08d57', metalness: 1, roughness: 0.28, envMapIntensity: 1.4 }),
  goldBright: new THREE.MeshStandardMaterial({
    color: '#8a6f42',
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.6,
    emissive: '#c9a25e',
    emissiveIntensity: 0.22,
  }),
  hedge: new THREE.MeshStandardMaterial({ color: '#243522', metalness: 0, roughness: 1 }),
  foliage: new THREE.MeshStandardMaterial({ color: '#25321f', metalness: 0, roughness: 1, flatShading: true }),
  foliageDark: new THREE.MeshStandardMaterial({ color: '#182417', metalness: 0, roughness: 1, flatShading: true }),
  bark: new THREE.MeshStandardMaterial({ color: '#4a3a2c', metalness: 0, roughness: 0.95 }),
  canopy: new THREE.MeshStandardMaterial({ color: '#0e1013', metalness: 0.25, roughness: 0.8 }),
  ground: new THREE.MeshStandardMaterial({ color: '#101113', metalness: 0.05, roughness: 0.95 }),
  paver: new THREE.MeshStandardMaterial({ color: '#26272a', metalness: 0.05, roughness: 0.85 }),
  soil: new THREE.MeshStandardMaterial({ color: '#221c15', metalness: 0, roughness: 1 }),
  curb: new THREE.MeshStandardMaterial({ color: '#6e6a62', metalness: 0.02, roughness: 0.9 }),
  interiorWall: new THREE.MeshStandardMaterial({ color: '#332e27', metalness: 0.02, roughness: 0.88 }),
  interiorCeiling: new THREE.MeshStandardMaterial({ color: '#171512', metalness: 0.05, roughness: 0.9 }),
  upholstery: new THREE.MeshStandardMaterial({ color: '#211f1c', metalness: 0, roughness: 1 }),
  rug: new THREE.MeshStandardMaterial({ color: '#2b2620', metalness: 0, roughness: 1 }),
  towerDark: new THREE.MeshStandardMaterial({ color: '#131720', metalness: 0.3, roughness: 0.7 }),
  railGlass: new THREE.MeshPhysicalMaterial({
    color: '#28313a',
    metalness: 0,
    roughness: 0.06,
    envMapIntensity: 1.2,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  }),
  // Emissive fixtures — values above 1 so only these reach bloom
  warmLight: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.0, 1.45, 0.8), toneMapped: false }),
  warmLightSoft: new THREE.MeshBasicMaterial({ color: new THREE.Color(1.15, 0.85, 0.5), toneMapped: false }),
  coolLight: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.95, 1.25), toneMapped: false }),
  fireGlow: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 1.1, 0.3), toneMapped: false }),
}

export const geoms = {
  box: new THREE.BoxGeometry(1, 1, 1),
  plane: new THREE.PlaneGeometry(1, 1),
}
