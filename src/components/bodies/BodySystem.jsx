import { useMemo } from 'react'
import { QUALITY_LEVELS } from '../../data/constants'
import { OrbitPath } from './OrbitPath'
import { Earth } from './Earth'
import { Planet } from './Planet'
import { SmallBodyField } from './SmallBodyField'
import { Sun } from './Sun'

const BODY_QUALITY_LIMITS = {
  [QUALITY_LEVELS.low]: {
    dwarfPlanetPriority: -1,
    moonPriority: 0,
    smallBodyPriority: 0,
  },
  [QUALITY_LEVELS.medium]: {
    dwarfPlanetPriority: 1,
    moonPriority: 2,
    smallBodyPriority: 1,
  },
  [QUALITY_LEVELS.high]: {
    dwarfPlanetPriority: 3,
    moonPriority: 3,
    smallBodyPriority: 2,
  },
}

function shouldRenderBody(body, quality) {
  const limits =
    BODY_QUALITY_LIMITS[quality] ?? BODY_QUALITY_LIMITS[QUALITY_LEVELS.medium]

  if (body.type === 'star' || body.type === 'planet') {
    return true
  }

  if (body.type === 'moon') {
    return body.renderPriority <= limits.moonPriority
  }

  if (body.type === 'dwarfPlanet') {
    return body.renderPriority <= limits.dwarfPlanetPriority
  }

  return false
}

function getRelativeEphemerisVector(body, ephemerisByBodyId) {
  const vector = ephemerisByBodyId?.[body.id]
  const parentVector = body.parentId ? ephemerisByBodyId?.[body.parentId] : null

  if (!vector || !parentVector) {
    return vector
  }

  return {
    ...vector,
    positionKm: [
      vector.positionKm[0] - parentVector.positionKm[0],
      vector.positionKm[1] - parentVector.positionKm[1],
      vector.positionKm[2] - parentVector.positionKm[2],
    ],
  }
}

function buildChildrenByParent(bodies) {
  return bodies.reduce((index, body) => {
    const parentId = body.parentId ?? null

    if (!index.has(parentId)) {
      index.set(parentId, [])
    }

    index.get(parentId).push(body)
    return index
  }, new Map())
}

function BodyNode({
  bodies,
  body,
  childrenByParent,
  elapsedDays,
  ephemerisByBodyId,
  onSelectBody,
  positionMode,
  scaleMode,
  selectedBodyId,
}) {
  const children = childrenByParent.get(body.id) ?? []
  const childNodes = children.map((child) => (
    <BodyNode
      key={child.id}
      bodies={bodies}
      body={child}
      childrenByParent={childrenByParent}
      elapsedDays={elapsedDays}
      ephemerisByBodyId={ephemerisByBodyId}
      onSelectBody={onSelectBody}
      positionMode={positionMode}
      scaleMode={scaleMode}
      selectedBodyId={selectedBodyId}
    />
  ))

  if (body.type === 'star') {
    return (
      <Sun
        body={body}
        isSelected={selectedBodyId === body.id}
        onSelectBody={onSelectBody}
        scaleMode={scaleMode}
      >
        {childNodes}
      </Sun>
    )
  }

  const ephemerisVector = getRelativeEphemerisVector(body, ephemerisByBodyId)
  const sharedProps = {
    body,
    elapsedDays,
    ephemerisVector,
    isSelected: selectedBodyId === body.id,
    onSelectBody,
    positionMode,
    scaleMode,
  }

  return (
    <>
      <OrbitPath body={body} scaleMode={scaleMode} />
      {body.id === 'earth' ? (
        <Earth {...sharedProps}>{childNodes}</Earth>
      ) : (
        <Planet {...sharedProps}>{childNodes}</Planet>
      )}
    </>
  )
}

export function BodySystem({
  bodies,
  elapsedDays,
  ephemerisByBodyId,
  selectedBodyId,
  onSelectBody,
  positionMode,
  quality = QUALITY_LEVELS.medium,
  scaleMode,
  smallBodyFields = [],
}) {
  const renderedBodies = useMemo(
    () => bodies.filter((body) => shouldRenderBody(body, quality)),
    [bodies, quality],
  )
  const childrenByParent = useMemo(
    () => buildChildrenByParent(renderedBodies),
    [renderedBodies],
  )
  const rootBodies = childrenByParent.get(null) ?? []
  const limits =
    BODY_QUALITY_LIMITS[quality] ?? BODY_QUALITY_LIMITS[QUALITY_LEVELS.medium]

  return (
    <group>
      {rootBodies.map((body) => (
        <BodyNode
          key={body.id}
          bodies={bodies}
          body={body}
          childrenByParent={childrenByParent}
          elapsedDays={elapsedDays}
          ephemerisByBodyId={ephemerisByBodyId}
          onSelectBody={onSelectBody}
          positionMode={positionMode}
          scaleMode={scaleMode}
          selectedBodyId={selectedBodyId}
        />
      ))}
      {smallBodyFields
        .filter((field) => field.renderPriority <= limits.smallBodyPriority)
        .map((field) => (
          <SmallBodyField
            key={field.id}
            field={field}
            quality={quality}
            scaleMode={scaleMode}
          />
        ))}
    </group>
  )
}
