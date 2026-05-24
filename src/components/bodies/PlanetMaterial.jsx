import { useMemo } from 'react'
import { Vector2 } from 'three'
import { useTextureSet } from '../../hooks/useTextureSet'
import {
  resolveTextureSet,
  TEXTURE_KEYS,
} from '../../utils/textureLoader'

export function FallbackPlanetMaterial({ body }) {
  return (
    <meshPhysicalMaterial
      color={body.color}
      clearcoat={body.type === 'planet' && body.hasAtmosphere ? 0.16 : 0}
      emissive={body.visualEmissive}
      metalness={body.visualMetalness}
      roughness={body.visualRoughness}
    />
  )
}

export function TexturedPlanetMaterial({ body, radius }) {
  const { paths, textures } = useTextureSet(body)
  const albedoTexture = textures[TEXTURE_KEYS.albedo]
  const bumpTexture = textures[TEXTURE_KEYS.bump]
  const normalTexture = textures[TEXTURE_KEYS.normal]
  const roughnessTexture = textures[TEXTURE_KEYS.roughness]
  const textureProps = useMemo(
    () => ({
      bumpMap: bumpTexture ?? undefined,
      map: albedoTexture ?? undefined,
      normalMap: normalTexture ?? undefined,
      roughnessMap: roughnessTexture ?? undefined,
    }),
    [albedoTexture, bumpTexture, normalTexture, roughnessTexture],
  )
  const hasLoadedTexture = Boolean(
    albedoTexture || bumpTexture || normalTexture || roughnessTexture,
  )

  const normalScale = useMemo(
    () => (paths[TEXTURE_KEYS.normal] ? new Vector2(0.32, 0.32) : undefined),
    [paths],
  )

  if (!hasLoadedTexture) {
    return <FallbackPlanetMaterial body={body} />
  }

  return (
    <meshPhysicalMaterial
      {...textureProps}
      color={textureProps.map ? '#ffffff' : body.color}
      clearcoat={body.hasAtmosphere ? 0.08 : 0}
      emissive={body.visualEmissive}
      metalness={body.visualMetalness}
      roughness={body.visualRoughness}
      bumpScale={paths[TEXTURE_KEYS.bump] ? radius * 0.055 : 0}
      normalScale={normalScale}
    />
  )
}

export function PlanetMaterial({ body, radius }) {
  const fallbackMaterial = <FallbackPlanetMaterial body={body} />
  const paths = useMemo(() => resolveTextureSet(body), [body])
  const hasSurfaceTexture = Boolean(
    paths[TEXTURE_KEYS.albedo] ||
      paths[TEXTURE_KEYS.bump] ||
      paths[TEXTURE_KEYS.normal] ||
      paths[TEXTURE_KEYS.roughness],
  )

  if (!hasSurfaceTexture) {
    return fallbackMaterial
  }

  return (
    <TexturedPlanetMaterial body={body} radius={radius} />
  )
}
