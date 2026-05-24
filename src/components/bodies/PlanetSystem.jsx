import { OrbitPath } from './OrbitPath'
import { Earth } from './Earth'
import { Planet } from './Planet'
import { Sun } from './Sun'

export function PlanetSystem({
  bodies,
  elapsedDays,
  ephemerisByBodyId,
  selectedBodyId,
  onSelectBody,
  positionMode,
  scaleMode,
}) {
  const sun = bodies.find((body) => body.type === 'star')
  const planets = bodies.filter((body) => body.type === 'planet')

  return (
    <group>
      {sun ? (
        <Sun
          body={sun}
          isSelected={selectedBodyId === sun.id}
          onSelectBody={onSelectBody}
          scaleMode={scaleMode}
        />
      ) : null}

      {planets.map((body) => (
        <group key={body.id}>
          <OrbitPath body={body} scaleMode={scaleMode} />
          {body.id === 'earth' ? (
            <Earth
              body={body}
              elapsedDays={elapsedDays}
              ephemerisVector={ephemerisByBodyId?.[body.id]}
              isSelected={selectedBodyId === body.id}
              onSelectBody={onSelectBody}
              positionMode={positionMode}
              scaleMode={scaleMode}
            />
          ) : (
            <Planet
              body={body}
              elapsedDays={elapsedDays}
              ephemerisVector={ephemerisByBodyId?.[body.id]}
              isSelected={selectedBodyId === body.id}
              onSelectBody={onSelectBody}
              positionMode={positionMode}
              scaleMode={scaleMode}
            />
          )}
        </group>
      ))}
    </group>
  )
}
