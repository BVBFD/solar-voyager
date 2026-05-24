export const ASTRONOMICAL_UNIT_KM = 149597870.7
export const SOLAR_RADIUS_KM = 696340
export const EARTH_RADIUS_KM = 6371
export const EARTH_ORBITAL_PERIOD_DAYS = 365.25

export const SCALE_MODES = {
  visualScale: 'visualScale',
  compressedRealScale: 'compressedRealScale',
  realScalePlaceholder: 'realScalePlaceholder',
}

export const SIMULATION_DEFAULTS = {
  timeScale: 4,
  scaleMode: SCALE_MODES.visualScale,
  selectedBodyId: 'earth',
}

export const BLOOM_DEFAULTS = {
  enabled: true,
  strength: 0.56,
  radius: 0.34,
  threshold: 0.78,
}

export const QUALITY_LEVELS = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

export const RENDER_DEFAULTS = {
  quality: QUALITY_LEVELS.medium,
}

export const CAMERA_MODES = {
  orbit: 'orbit',
  freeFlight: 'freeFlight',
}

export const NAVIGATION_MODES = {
  observatory: 'observatory',
  voyagerReady: 'voyagerReady',
  voyagerActive: 'voyagerActive',
  voyagerPaused: 'voyagerPaused',
  transitioning: 'transitioning',
}

export const CONTROL_MODES = {
  orbit: NAVIGATION_MODES.observatory,
  flightReady: NAVIGATION_MODES.voyagerReady,
  flightActive: NAVIGATION_MODES.voyagerActive,
  flightPaused: NAVIGATION_MODES.voyagerPaused,
  transitioning: NAVIGATION_MODES.transitioning,
}

export const SIMULATION_MODES = {
  simulationOrbit: 'simulationOrbit',
  realAlignment: 'realAlignment',
}

export const CAMERA_TARGET_SOURCES = {
  autoFocus: 'autoFocus',
  none: 'none',
  returnToSun: 'returnToSun',
  userClick: 'userClick',
}

export const ORBIT_SEGMENTS = 160
