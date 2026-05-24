import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { QUALITY_LEVELS } from '../../data/constants'

const POST_PROCESSING_BY_QUALITY = {
  [QUALITY_LEVELS.low]: {
    bloomMultiplier: 0.62,
    depthOfField: false,
    multisampling: 0,
    noiseOpacity: 0,
    vignetteDarkness: 0.36,
  },
  [QUALITY_LEVELS.medium]: {
    bloomMultiplier: 1,
    depthOfField: false,
    multisampling: 2,
    noiseOpacity: 0.018,
    vignetteDarkness: 0.48,
  },
  [QUALITY_LEVELS.high]: {
    bloomMultiplier: 1.22,
    depthOfField: true,
    multisampling: 4,
    noiseOpacity: 0.025,
    vignetteDarkness: 0.58,
  },
}

export function PostProcessing({ bloom, quality = QUALITY_LEVELS.medium }) {
  if (!bloom?.enabled) {
    return null
  }

  const profile =
    POST_PROCESSING_BY_QUALITY[quality] ??
    POST_PROCESSING_BY_QUALITY[QUALITY_LEVELS.medium]

  return (
    <EffectComposer
      depthBuffer={profile.depthOfField}
      multisampling={profile.multisampling}
    >
      <Bloom
        intensity={bloom.strength * profile.bloomMultiplier}
        luminanceSmoothing={0.28}
        luminanceThreshold={bloom.threshold}
        mipmapBlur
        radius={bloom.radius}
      />
      {profile.depthOfField ? (
        <DepthOfField
          bokehScale={0.85}
          focusDistance={0.012}
          focalLength={0.024}
        />
      ) : null}
      {profile.noiseOpacity > 0 ? (
        <Noise
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={profile.noiseOpacity}
        />
      ) : null}
      <Vignette
        darkness={profile.vignetteDarkness}
        eskil={false}
        offset={0.24}
      />
    </EffectComposer>
  )
}
