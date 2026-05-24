import { useEffect, useState } from 'react'
import { TextureLoader } from 'three'
import { warnTextureFallback } from '../utils/textureLoader'

const textureLoader = new TextureLoader()
const textureCache = new Map()

function loadOptionalTexture(path, colorSpace) {
  if (!path) {
    return Promise.resolve(null)
  }

  const cacheKey = `${path}|${colorSpace ?? 'default'}`

  if (!textureCache.has(cacheKey)) {
    textureCache.set(
      cacheKey,
      new Promise((resolve) => {
        textureLoader.load(
          path,
          (texture) => {
            if (colorSpace) {
              texture.colorSpace = colorSpace
            }

            texture.needsUpdate = true
            resolve(texture)
          },
          undefined,
          (error) => {
            warnTextureFallback(path, error)
            resolve(null)
          },
        )
      }),
    )
  }

  return textureCache.get(cacheKey)
}

export function useOptionalTexture(path, options = {}) {
  const colorSpace = options.colorSpace ?? null
  const cacheKey = `${path ?? 'none'}|${colorSpace ?? 'default'}`
  const [textureState, setTextureState] = useState({
    cacheKey: null,
    texture: null,
  })

  useEffect(() => {
    let isMounted = true

    loadOptionalTexture(path, colorSpace).then((loadedTexture) => {
      if (isMounted) {
        setTextureState({
          cacheKey,
          texture: loadedTexture,
        })
      }
    })

    return () => {
      isMounted = false
    }
  }, [cacheKey, colorSpace, path])

  return textureState.cacheKey === cacheKey ? textureState.texture : null
}
