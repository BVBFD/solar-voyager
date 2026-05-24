const BODY_LABEL_ICONS = {
  sun: '☉',
  mercury: '☿',
  venus: '♀',
  earth: '♁',
  moon: '☾',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '⛢',
  neptune: '♆',
  pluto: '♇',
}

export function getBodyLabelIcon(body) {
  const key = String(body?.id || body?.name || '').toLowerCase()

  // Decorative only: these glyphs are UI markers, not scientific notation.
  return BODY_LABEL_ICONS[key] || '•'
}
