import { useTranslation } from 'react-i18next'
import {
  formatDays,
  formatDistanceKm,
  formatHours,
  formatRadiusKm,
  formatUtcDateTime,
} from '../../utils/formatters'

export function InfoPanel({ body, ephemerisData }) {
  const { t } = useTranslation()

  if (!body) {
    return (
      <section className="info-panel">
        <h2>{t('info.emptyTitle')}</h2>
        <p>{t('info.emptyBody')}</p>
      </section>
    )
  }

  const bodyEphemeris = ephemerisData?.vectorsByBodyId?.[body.id]
  const hasBodyEphemeris = Boolean(bodyEphemeris)
  const orbitDistanceKm =
    body.actualAverageOrbitDistanceKm ?? body.actualAverageDistanceFromSunKm
  const orbitDistanceLabel = body.parentId
    ? t('info.avgParentOrbit')
    : t('info.avgDistance')
  const dataSource =
    ephemerisData?.active &&
    !hasBodyEphemeris &&
    ephemerisData.status !== 'loading' &&
    ephemerisData.status !== 'error'
      ? t('info.sources.bodyFallback')
      : ephemerisData?.active
        ? t(`info.sources.${ephemerisData.status}`, {
            defaultValue: ephemerisData.sourceLabel,
          })
        : t('info.sources.animated')
  const lastUpdated = ephemerisData?.updatedAt
    ? formatUtcDateTime(ephemerisData.updatedAt)
    : t('info.notLoaded')
  const bodyDescription = t(`bodies.${body.id}.description`, {
    defaultValue: body.description,
  })

  return (
    <section className="info-panel">
      <p className="eyebrow dossier-eyebrow">
        <span className="dossier-glyph" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {t('info.dossier')}
      </p>
      <h2>{body.name}</h2>
      <p>{bodyDescription}</p>
      <dl className="stat-list">
        <div>
          <dt>{t('info.meanRadius')}</dt>
          <dd>{formatRadiusKm(body.actualMeanRadiusKm)}</dd>
        </div>
        <div>
          <dt>{orbitDistanceLabel}</dt>
          <dd>{formatDistanceKm(orbitDistanceKm)}</dd>
        </div>
        <div>
          <dt>{t('info.siderealOrbit')}</dt>
          <dd>{formatDays(body.actualSiderealOrbitPeriodDays)}</dd>
        </div>
        <div>
          <dt>{t('info.siderealRotation')}</dt>
          <dd>{formatHours(body.actualSiderealRotationPeriodHours)}</dd>
        </div>
        <div>
          <dt>{t('info.dataSource')}</dt>
          <dd>{dataSource}</dd>
        </div>
        <div>
          <dt>{t('info.lastUpdate')}</dt>
          <dd>{lastUpdated}</dd>
        </div>
        {bodyEphemeris ? (
          <div>
            <dt>{t('info.vectorEpoch')}</dt>
            <dd>{bodyEphemeris.epoch}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  )
}
