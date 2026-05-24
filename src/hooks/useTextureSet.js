import { useMemo } from 'react'
import { SRGBColorSpace } from 'three'
import { useOptionalTexture } from './useOptionalTexture'
import {
  resolveTextureSet,
  TEXTURE_KEYS,
} from '../utils/textureLoader'

export function useTextureSet(body) {
  const paths = useMemo(() => resolveTextureSet(body), [body])
  const albedo = useOptionalTexture(paths[TEXTURE_KEYS.albedo], {
    colorSpace: SRGBColorSpace,
  })
  const atmosphere = useOptionalTexture(paths[TEXTURE_KEYS.atmosphere], {
    colorSpace: SRGBColorSpace,
  })
  const bump = useOptionalTexture(paths[TEXTURE_KEYS.bump])
  const cloud = useOptionalTexture(paths[TEXTURE_KEYS.cloud], {
    colorSpace: SRGBColorSpace,
  })
  const night = useOptionalTexture(paths[TEXTURE_KEYS.night], {
    colorSpace: SRGBColorSpace,
  })
  const normal = useOptionalTexture(paths[TEXTURE_KEYS.normal])
  const ring = useOptionalTexture(paths[TEXTURE_KEYS.ring], {
    colorSpace: SRGBColorSpace,
  })
  const roughness = useOptionalTexture(paths[TEXTURE_KEYS.roughness])
  const textures = useMemo(
    () => ({
      [TEXTURE_KEYS.albedo]: albedo,
      [TEXTURE_KEYS.atmosphere]: atmosphere,
      [TEXTURE_KEYS.bump]: bump,
      [TEXTURE_KEYS.cloud]: cloud,
      [TEXTURE_KEYS.night]: night,
      [TEXTURE_KEYS.normal]: normal,
      [TEXTURE_KEYS.ring]: ring,
      [TEXTURE_KEYS.roughness]: roughness,
    }),
    [albedo, atmosphere, bump, cloud, night, normal, ring, roughness],
  )

  return {
    hasAnyTexture: Object.values(textures).some(Boolean),
    paths,
    textures,
  }
}
