export const TEXTURE_TYPES = {
  albedo: 'albedo',
  atmosphere: 'atmosphere',
  bump: 'bump',
  cloud: 'cloud',
  night: 'night',
  normal: 'normal',
  ring: 'ring',
  roughness: 'roughness',
}

const PLANET_TEXTURE_ROOT = '/textures/planets'
const MOON_TEXTURE_ROOT = '/textures/moons'
const BACKGROUND_TEXTURE_ROOT = '/textures/backgrounds'

// Authoritative texture path manifest. Put NASA, Solar System Scope, or other
// license-approved assets under public/textures and update only this file.
export const TEXTURE_MANIFEST = {
  sun: {},
  mercury: {
    [TEXTURE_TYPES.albedo]: `${PLANET_TEXTURE_ROOT}/mercury/albedo.jpg`,
    [TEXTURE_TYPES.normal]: `${PLANET_TEXTURE_ROOT}/mercury/normal.jpg`,
  },
  venus: {
    [TEXTURE_TYPES.albedo]: `${PLANET_TEXTURE_ROOT}/venus/albedo.jpg`,
    [TEXTURE_TYPES.atmosphere]: `${PLANET_TEXTURE_ROOT}/venus/atmosphere.jpg`,
  },
  earth: {
    [TEXTURE_TYPES.albedo]: `${PLANET_TEXTURE_ROOT}/earth/albedo.jpg`,
    [TEXTURE_TYPES.cloud]: `${PLANET_TEXTURE_ROOT}/earth/clouds.png`,
    [TEXTURE_TYPES.normal]: `${PLANET_TEXTURE_ROOT}/earth/normal.jpg`,
    [TEXTURE_TYPES.night]: `${PLANET_TEXTURE_ROOT}/earth/night.jpg`,
  },
  mars: {
    [TEXTURE_TYPES.albedo]: `${PLANET_TEXTURE_ROOT}/mars/albedo.jpg`,
    [TEXTURE_TYPES.normal]: `${PLANET_TEXTURE_ROOT}/mars/normal.jpg`,
  },
  jupiter: {
    [TEXTURE_TYPES.albedo]: `${PLANET_TEXTURE_ROOT}/jupiter/albedo.jpg`,
  },
  saturn: {
    [TEXTURE_TYPES.albedo]: `${PLANET_TEXTURE_ROOT}/saturn/albedo.jpg`,
    [TEXTURE_TYPES.ring]: `${PLANET_TEXTURE_ROOT}/saturn/ring.png`,
  },
  uranus: {
    [TEXTURE_TYPES.albedo]: `${PLANET_TEXTURE_ROOT}/uranus/albedo.jpg`,
  },
  neptune: {
    [TEXTURE_TYPES.albedo]: `${PLANET_TEXTURE_ROOT}/neptune/albedo.jpg`,
  },
  moon: {
    [TEXTURE_TYPES.albedo]: `${MOON_TEXTURE_ROOT}/moon/albedo.jpg`,
    [TEXTURE_TYPES.normal]: `${MOON_TEXTURE_ROOT}/moon/normal.jpg`,
  },
}

export const BACKGROUND_TEXTURE_MANIFEST = {
  milkyway: `${BACKGROUND_TEXTURE_ROOT}/milkyway.jpg`,
}

export function getManifestTextureSet(bodyId) {
  return TEXTURE_MANIFEST[bodyId] ?? {}
}
