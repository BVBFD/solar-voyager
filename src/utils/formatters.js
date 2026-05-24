const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const decimalFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

export function formatRadiusKm(radiusKm) {
  return `${integerFormatter.format(radiusKm)} km`
}

export function formatDistanceKm(distanceKm) {
  if (distanceKm === 0) {
    return '0 km'
  }

  return `${integerFormatter.format(distanceKm)} km`
}

export function formatDays(days) {
  if (!days) {
    return 'N/A'
  }

  return `${decimalFormatter.format(days)} days`
}

export function formatHours(hours) {
  if (!hours) {
    return 'N/A'
  }

  return `${decimalFormatter.format(Math.abs(hours))} hours${
    hours < 0 ? ' retrograde' : ''
  }`
}

export function formatElapsedDays(elapsedDays) {
  return `${elapsedDays.toFixed(1)} days`
}

export function formatSpeedDaysPerSecond(speed) {
  return `${Number(speed).toFixed(1)} days/s`
}

export function formatUtcDateTime(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return `${date.toISOString().replace('.000Z', 'Z')}`
}
