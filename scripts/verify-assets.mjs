import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  BACKGROUND_TEXTURE_MANIFEST,
  TEXTURE_MANIFEST,
} from '../src/data/textureManifest.js'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function publicPathToFilePath(publicPath) {
  return resolve(repoRoot, 'public', publicPath.replace(/^\//, ''))
}

function flattenManifestEntries() {
  const bodyEntries = Object.entries(TEXTURE_MANIFEST).flatMap(
    ([bodyId, textureSet]) =>
      Object.entries(textureSet).map(([textureType, publicPath]) => ({
        id: `${bodyId}.${textureType}`,
        publicPath,
      })),
  )
  const backgroundEntries = Object.entries(BACKGROUND_TEXTURE_MANIFEST).map(
    ([backgroundId, publicPath]) => ({
      id: `background.${backgroundId}`,
      publicPath,
    }),
  )

  return [...bodyEntries, ...backgroundEntries]
}

const entries = flattenManifestEntries()
const missingEntries = []

for (const entry of entries) {
  const filePath = publicPathToFilePath(entry.publicPath)

  if (!existsSync(filePath)) {
    missingEntries.push(entry)
    console.warn(`[assets] Missing ${entry.id}: ${entry.publicPath}`)
  }
}

if (missingEntries.length === 0) {
  console.log(`[assets] OK: ${entries.length} manifest assets found.`)
} else {
  console.warn(
    `[assets] ${missingEntries.length}/${entries.length} manifest assets are missing. Runtime fallback materials will be used.`,
  )
}
