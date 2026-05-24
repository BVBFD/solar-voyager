import {
  getManifestTextureSet,
  TEXTURE_TYPES,
} from '../data/textureManifest'

export const TEXTURE_KEYS = {
  ...TEXTURE_TYPES,
}

const warnedTextureKeys = new Set()

export function resolveTextureSet(body) {
  const manifestTextureSet = getManifestTextureSet(body.id)

  return Object.values(TEXTURE_KEYS).reduce((resolved, key) => {
    resolved[key] = manifestTextureSet[key] ?? null
    return resolved
  }, {})
}

export function getTexturePath(body, key) {
  return resolveTextureSet(body)[key] ?? null
}

export function hasTexturePath(body, key) {
  return Boolean(getTexturePath(body, key))
}

export function warnTextureFallback(textureSource, error) {
  const paths = Array.isArray(textureSource)
    ? textureSource.filter(Boolean)
    : Object.values(textureSource ?? {}).filter(Boolean)

  if (paths.length === 0) {
    return
  }

  const key = paths.join('|')

  if (warnedTextureKeys.has(key)) {
    return
  }

  warnedTextureKeys.add(key)
  console.warn(
    `[textures] Failed to load ${paths.join(', ')}. Using fallback material.`,
    error,
  )
}
