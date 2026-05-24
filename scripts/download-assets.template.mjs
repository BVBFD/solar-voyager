import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Fill this only after checking source ownership, license terms, and required
// attribution. Do not use wallpaper mirrors, repost sites, or unclear sources.
// NASA logos/insignia should not be downloaded or bundled.
const ASSET_DOWNLOADS = [
  {
    outputPath: 'public/textures/planets/earth/albedo.jpg',
    sourceUrl: 'TODO_REVIEW_LICENSE_AND_INSERT_SOURCE_URL',
    attribution: 'TODO',
    license: 'TODO',
  },
]

async function downloadAsset({ outputPath, sourceUrl }) {
  if (!sourceUrl || sourceUrl.startsWith('TODO_')) {
    console.warn(`[assets] Skipping ${outputPath}: source URL is not configured.`)
    return
  }

  const response = await fetch(sourceUrl)

  if (!response.ok) {
    throw new Error(`Failed to download ${sourceUrl}: ${response.status}`)
  }

  const bytes = Buffer.from(await response.arrayBuffer())
  const absoluteOutputPath = resolve(repoRoot, outputPath)

  await mkdir(dirname(absoluteOutputPath), { recursive: true })
  await writeFile(absoluteOutputPath, bytes)
  console.log(`[assets] Downloaded ${outputPath}`)
}

for (const asset of ASSET_DOWNLOADS) {
  await downloadAsset(asset)
}

console.log(
  '[assets] Review docs/ASSET_CREDITS.md and record source, license, and attribution before committing downloaded files.',
)
