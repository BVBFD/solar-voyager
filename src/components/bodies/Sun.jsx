import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BackSide, Color } from 'three'
import { SCALE_MODES } from '../../data/constants'
import { scaleRadius } from '../../utils/scale'

const SUN_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const SUN_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uHotColor;
  uniform vec3 uDarkColor;
  varying vec2 vUv;
  varying vec3 vNormal;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.04;
      amplitude *= 0.52;
    }

    return value;
  }

  void main() {
    vec2 flowUv = vec2(vUv.x + uTime * 0.035, vUv.y);
    float plasma = fbm(flowUv * 7.0 + vec2(uTime * 0.08, sin(uTime * 0.25)));
    float cells = fbm(flowUv * 18.0 - vec2(uTime * 0.12, 0.0));
    float flare = smoothstep(0.52, 0.95, plasma + cells * 0.45);
    float limb = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 1.7);

    vec3 color = mix(uDarkColor, uBaseColor, plasma);
    color = mix(color, uHotColor, flare);
    color += uHotColor * limb * 0.45;

    gl_FragColor = vec4(color * 1.35, 1.0);
  }
`

const SUN_GLOW_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const SUN_GLOW_FRAGMENT_SHADER = `
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 centeredUv = vUv - vec2(0.5);
    float radius = length(centeredUv) * 2.0;
    float edgeFade = smoothstep(1.0, 0.0, radius);
    float inverseFalloff = 1.0 / (1.0 + radius * radius * 10.0);
    float coronaFalloff = pow(max(0.0, 1.0 - radius), 2.85);
    float alpha = (inverseFalloff * 0.22 + coronaFalloff * 0.78) * edgeFade * uOpacity;

    vec3 centerColor = vec3(1.0, 0.965, 0.72);
    vec3 warmColor = vec3(1.0, 0.78, 0.28);
    vec3 outerColor = vec3(1.0, 0.48, 0.15);
    vec3 color = mix(centerColor, warmColor, smoothstep(0.06, 0.44, radius));
    color = mix(color, outerColor, smoothstep(0.38, 0.92, radius));

    if (alpha < 0.002) {
      discard;
    }

    gl_FragColor = vec4(color, alpha);
  }
`

function CoronaLayer({ radius, scale, color, opacity }) {
  return (
    <mesh scale={[scale, scale, scale]}>
      <sphereGeometry args={[radius, 48, 24]} />
      <meshBasicMaterial
        blending={AdditiveBlending}
        color={color}
        depthTest
        depthWrite={false}
        opacity={opacity}
        side={BackSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  )
}

function SoftCoronaBillboard({ radius }) {
  return (
    <mesh renderOrder={-1}>
      <planeGeometry args={[radius * 4.2, radius * 4.2]} />
      <shaderMaterial
        blending={AdditiveBlending}
        depthTest
        depthWrite={false}
        fragmentShader={SUN_GLOW_FRAGMENT_SHADER}
        toneMapped={false}
        transparent
        uniforms={{
          uOpacity: { value: 0.46 },
        }}
        vertexShader={SUN_GLOW_VERTEX_SHADER}
      />
    </mesh>
  )
}

const DEFAULT_CORONA_LAYERS = [
  { color: '#ffb347', opacity: 0.22, scale: 1.18 },
  { color: '#ffd166', opacity: 0.12, scale: 1.45 },
  { color: '#fff1a8', opacity: 0.06, scale: 1.9 },
]

const VISUAL_CORONA_LAYERS = [
  { color: '#ffb347', opacity: 0.18, scale: 1.12 },
  { color: '#ffd166', opacity: 0.08, scale: 1.3 },
  { color: '#fff1a8', opacity: 0.025, scale: 1.55 },
]

export function Sun({
  body,
  children,
  isSelected,
  onSelectBody,
  scaleMode = SCALE_MODES.visualScale,
}) {
  const meshRef = useRef(null)
  const glowRef = useRef(null)
  const materialRef = useRef(null)
  const radius = scaleRadius(body.actualMeanRadiusKm, scaleMode, body.type)
  const coronaRadius =
    scaleMode === SCALE_MODES.visualScale ? radius * 0.96 : radius
  const coronaLayers =
    scaleMode === SCALE_MODES.visualScale
      ? VISUAL_CORONA_LAYERS
      : DEFAULT_CORONA_LAYERS
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new Color('#ff9f1c') },
      uHotColor: { value: new Color('#fff2a8') },
      uDarkColor: { value: new Color('#b9360c') },
    }),
    [],
  )

  useFrame(({ camera }, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08
    }

    if (glowRef.current) {
      glowRef.current.quaternion.copy(camera.quaternion)
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
    }
  })

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelectBody(body.id)
        }}
      >
        <sphereGeometry args={[radius, 64, 40]} />
        <shaderMaterial
          ref={materialRef}
          fragmentShader={SUN_FRAGMENT_SHADER}
          toneMapped={false}
          uniforms={uniforms}
          vertexShader={SUN_VERTEX_SHADER}
        />
      </mesh>

      {scaleMode === SCALE_MODES.visualScale ? (
        <group ref={glowRef}>
          <SoftCoronaBillboard radius={radius} />
        </group>
      ) : (
        coronaLayers.map((layer) => (
          <CoronaLayer
            color={layer.color}
            key={`${layer.color}-${layer.scale}`}
            opacity={layer.opacity}
            radius={coronaRadius}
            scale={layer.scale}
          />
        ))
      )}

      <pointLight
        color="#fff1b8"
        decay={1.4}
        distance={140}
        intensity={6.2}
        position={[0, 0, 0]}
      />

      {isSelected ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.18, radius * 1.28, 64]} />
          <meshBasicMaterial
            color="#fef3c7"
            depthWrite={false}
            opacity={0.28}
            transparent
          />
        </mesh>
      ) : null}

      {children}
    </group>
  )
}
