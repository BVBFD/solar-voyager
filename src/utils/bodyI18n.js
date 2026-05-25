const BODY_NAME_TO_ID = {
  ariel: 'ariel',
  callisto: 'callisto',
  ceres: 'ceres',
  deimos: 'deimos',
  dione: 'dione',
  earth: 'earth',
  enceladus: 'enceladus',
  eris: 'eris',
  europa: 'europa',
  ganymede: 'ganymede',
  haumea: 'haumea',
  iapetus: 'iapetus',
  io: 'io',
  jupiter: 'jupiter',
  makemake: 'makemake',
  mars: 'mars',
  mercury: 'mercury',
  mimas: 'mimas',
  miranda: 'miranda',
  moon: 'moon',
  neptune: 'neptune',
  oberon: 'oberon',
  phobos: 'phobos',
  pluto: 'pluto',
  rhea: 'rhea',
  saturn: 'saturn',
  sun: 'sun',
  tethys: 'tethys',
  titan: 'titan',
  titania: 'titania',
  triton: 'triton',
  umbriel: 'umbriel',
  uranus: 'uranus',
  venus: 'venus',
}

const INTERNAL_DRAFT_PATTERN = /\b(placeholder|temporary|draft|todo|preliminary|reserved|prepared)\b/i

function normalizeBodyKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getBodyTranslationId(bodyOrName) {
  if (typeof bodyOrName === 'string') {
    const normalizedName = normalizeBodyKey(bodyOrName)
    return BODY_NAME_TO_ID[normalizedName] ?? normalizedName
  }

  const bodyId = normalizeBodyKey(bodyOrName?.id)

  if (bodyId) {
    return bodyId
  }

  const normalizedName = normalizeBodyKey(bodyOrName?.name)
  return BODY_NAME_TO_ID[normalizedName] ?? normalizedName
}

export function getBodyName(bodyOrName, t) {
  const bodyId = getBodyTranslationId(bodyOrName)
  const fallbackName =
    typeof bodyOrName === 'string'
      ? bodyOrName
      : bodyOrName?.name ?? bodyId

  if (!bodyId) {
    return fallbackName
  }

  return t(`bodies.names.${bodyId}`, { defaultValue: fallbackName })
}

export function getBodyDescription(body, t) {
  const bodyId = getBodyTranslationId(body)
  const fallbackDescription =
    body?.description && !INTERNAL_DRAFT_PATTERN.test(body.description)
      ? body.description
      : t('bodies.descriptions.unknown', {
          defaultValue: 'Solar system body available for visual exploration.',
        })

  if (!bodyId) {
    return fallbackDescription
  }

  return t(`bodies.descriptions.${bodyId}`, {
    defaultValue: fallbackDescription,
  })
}
