import * as THREE from 'three'

// One shared physically-based material set for the whole development —
// created once, reused by every mesh (cheap draw-state changes, one
// compile per material).

export const mats = {
  // Architectural glass — dark, reflective, believable at night
  glass: new THREE.MeshPhysicalMaterial({
    color: '#0c1116',
    metalness: 0.1,
    roughness: 0.06,
    envMapIntensity: 1.15,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 0.62,
  }),
  // Clear entrance glass — you can see the lobby through it
  clearGlass: new THREE.MeshPhysicalMaterial({
    color: '#1a2129',
    metalness: 0,
    roughness: 0.04,
    envMapIntensity: 1.4,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
  }),
  mullion: new THREE.MeshStandardMaterial({
    color: '#181a1d',
    metalness: 0.85,
    roughness: 0.38,
  }),
  darkMetal: new THREE.MeshStandardMaterial({
    color: '#131518',
    metalness: 0.8,
    roughness: 0.45,
  }),
  stone: new THREE.MeshStandardMaterial({
    color: '#797262',
    metalness: 0.02,
    roughness: 0.92,
  }),
  stoneDark: new THREE.MeshStandardMaterial({
    color: '#37342e',
    metalness: 0.05,
    roughness: 0.9,
  }),
  concrete: new THREE.MeshStandardMaterial({
    color: '#4a4741',
    metalness: 0.02,
    roughness: 0.95,
  }),
  wood: new THREE.MeshStandardMaterial({
    color: '#5d452e',
    metalness: 0.05,
    roughness: 0.7,
  }),
  woodFloor: new THREE.MeshStandardMaterial({
    color: '#4a3722',
    metalness: 0.1,
    roughness: 0.55,
  }),
  gold: new THREE.MeshStandardMaterial({
    color: '#b08d57',
    metalness: 1,
    roughness: 0.28,
    envMapIntensity: 1.6,
  }),
  goldBright: new THREE.MeshStandardMaterial({
    color: '#7a6236',
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 1.8,
    emissive: '#c9a25e',
    emissiveIntensity: 0.25,
  }),
  hedge: new THREE.MeshStandardMaterial({
    color: '#1c2a1a',
    metalness: 0,
    roughness: 1,
  }),
  canopy: new THREE.MeshStandardMaterial({
    color: '#101214',
    metalness: 0.7,
    roughness: 0.5,
  }),
  ground: new THREE.MeshStandardMaterial({
    color: '#0a0b0d',
    metalness: 0.1,
    roughness: 0.95,
  }),
  paver: new THREE.MeshStandardMaterial({
    color: '#191a1c',
    metalness: 0.05,
    roughness: 0.85,
  }),
  interiorWall: new THREE.MeshStandardMaterial({
    color: '#332e27',
    metalness: 0.02,
    roughness: 0.88,
  }),
  interiorCeiling: new THREE.MeshStandardMaterial({
    color: '#171512',
    metalness: 0.05,
    roughness: 0.9,
  }),
  upholstery: new THREE.MeshStandardMaterial({
    color: '#211f1c',
    metalness: 0,
    roughness: 1,
  }),
  rug: new THREE.MeshStandardMaterial({
    color: '#2b2620',
    metalness: 0,
    roughness: 1,
  }),
  towerDark: new THREE.MeshStandardMaterial({
    color: '#0b0d12',
    metalness: 0.3,
    roughness: 0.7,
  }),
  // Emissive fixtures — toneMapped false so bloom picks them up
  warmLight: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.55, 0.85), toneMapped: false }),
  warmLightSoft: new THREE.MeshBasicMaterial({ color: new THREE.Color(1.15, 0.85, 0.5), toneMapped: false }),
  coolLight: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.8, 0.95, 1.25), toneMapped: false }),
  fireGlow: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 1.1, 0.3), toneMapped: false }),
}

// Common geometries reused across instances
export const geoms = {
  box: new THREE.BoxGeometry(1, 1, 1),
  plane: new THREE.PlaneGeometry(1, 1),
}
