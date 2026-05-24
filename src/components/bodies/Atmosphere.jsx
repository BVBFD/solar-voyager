import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  Color,
  Vector3,
} from 'three'

const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const ATMOSPHERE_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uPower;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

    // Fresnel-style rim alpha keeps atmosphere as a WebGL scattering pass
    // instead of a flat CSS glow pasted over the planet.
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDirection)), uPower);
    float alpha = smoothstep(0.08, 1.0, fresnel) * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`

const ATMOSPHERE_PROFILES = {
  earth: { color: '#5db8ff', opacity: 0.2, power: 1.75, scale: 1.105 },
  venus: { color: '#f6c56f', opacity: 0.32, power: 1.35, scale: 1.2 },
  mars: { color: '#e16b35', opacity: 0.1, power: 1.65, scale: 1.09 },
  jupiter: { color: '#f1d4a8', opacity: 0.09, power: 1.45, scale: 1.045 },
  saturn: { color: '#f5dfad', opacity: 0.11, power: 1.5, scale: 1.055 },
  uranus: { color: '#8ff5ff', opacity: 0.2, power: 1.32, scale: 1.12 },
  neptune: { color: '#6ea8ff', opacity: 0.22, power: 1.35, scale: 1.13 },
}

export function Atmosphere({ body, radius }) {
  const meshRef = useRef(null)
  const worldPositionRef = useRef(new Vector3())
  const profile = ATMOSPHERE_PROFILES[body.id] ?? {
    color: body.color,
    opacity: 0.14,
    power: 1.5,
    scale: 1.08,
  }
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(profile.color) },
      uOpacity: { value: profile.opacity },
      uPower: { value: profile.power },
    }),
    [profile.color, profile.opacity, profile.power],
  )

  useFrame(({ camera }) => {
    if (!meshRef.current) {
      return
    }

    const worldPosition = meshRef.current.getWorldPosition(worldPositionRef.current)
    const cameraDistance = camera.position.distanceTo(worldPosition)
    const atmosphereRadius = radius * profile.scale

    // Hide the render-only glow while the camera is close enough for clipping
    // to expose individual sphere faces.
    meshRef.current.visible = cameraDistance > atmosphereRadius * 1.35
  })

  if (!body.hasAtmosphere) {
    return null
  }

  return (
    <mesh ref={meshRef} scale={[profile.scale, profile.scale, profile.scale]}>
      <sphereGeometry args={[radius, 48, 24]} />
      <shaderMaterial
        blending={AdditiveBlending}
        depthTest
        depthWrite={false}
        fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
        toneMapped={false}
        transparent
        uniforms={uniforms}
        vertexShader={ATMOSPHERE_VERTEX_SHADER}
      />
    </mesh>
  )
}
