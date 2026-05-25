import { useTranslation } from 'react-i18next'
import { getBodyName } from '../../utils/bodyI18n'
import { formatDistanceKm } from '../../utils/formatters'

export function PlanetList({ bodies, selectedBodyId, onSelectBody }) {
  const { t } = useTranslation()
  const navigationBodies = bodies.filter((body) =>
    ['planet', 'moon', 'dwarfPlanet'].includes(body.type),
  )

  return (
    <nav className="planet-list" aria-label={t('planetList.aria')}>
      {navigationBodies.map((body) => {
        const isSelected = selectedBodyId === body.id
        const bodyName = getBodyName(body, t)
        const parentName = body.parentId
          ? getBodyName(body.parentId, t)
          : null
        const orbitDistanceKm =
          body.actualAverageOrbitDistanceKm ?? body.actualAverageDistanceFromSunKm

        return (
          <button
            className={isSelected ? 'planet-list__item is-selected' : 'planet-list__item'}
            key={body.id}
            type="button"
            onClick={() => onSelectBody(body.id)}
          >
            <span className="planet-list__header">
              <span
                className="planet-list__swatch"
                style={{ backgroundColor: body.color }}
              />
              <span>{bodyName}</span>
            </span>
            <span className="planet-list__meta">
              {parentName ? `${parentName} / ` : ''}
              {formatDistanceKm(orbitDistanceKm)}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
