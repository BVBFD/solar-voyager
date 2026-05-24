# Solar Voyager

Solar Voyager is a React Three Fiber prototype for a 3D solar system travel simulator.

## Running

```bash
npm.cmd run dev
```

If your shell allows npm PowerShell scripts, `npm run dev` works as well.

## Accuracy And Scale

Planet data in `src/data/planets.js` keeps real values for mean radius, average distance from the Sun, sidereal orbital period, and sidereal rotation period. Rendering scale is handled separately in `src/utils/scale.js`.

Exact real scale is difficult to view in a normal browser scene because the solar system has extreme ratios. Earth is about 149.6 million km from the Sun, while Earth's radius is about 6,371 km. If one scene unit represents one AU, Earth is only about 0.000043 scene units wide. That makes planets effectively invisible unless the camera, clipping, picking, labels, and navigation are designed around true-scale exploration.

Scale modes:
- `visualScale`: intentionally compressed distances and radii for a readable v1 scene.
- `compressedRealScale`: keeps orbital spacing linear by AU while boosting radii enough to inspect planets.
- `realScalePlaceholder`: reserves a future true-scale path and shows why a literal scale needs special camera and interaction design.

## Texture Asset Sources And Licenses

Texture filenames are managed through each body's `textureSet` field, currently seeded from `src/data/planets.js` and expanded through `src/data/bodies.js`. Actual image files should be placed under `public/textures` using the documented folder layout.

Record every imported asset here before committing it:

| Asset | Source URL | Author/Agency | License/Usage Notes |
| --- | --- | --- | --- |
| Pending planet textures | TBD | TBD | Add source and license before use. |
| Pending moon textures | TBD | TBD | Add source and license before use. |
| Pending background textures | TBD | TBD | Add source and license before use. |

NASA assets must not imply NASA endorsement. When using NASA/JPL/public astronomy imagery, preserve required attribution, note any modifications, and avoid wording or UI treatment that suggests NASA sponsors or approves this project.

## Celestial Expansion

The expanded body roadmap is documented in `docs/celestial-expansion-roadmap.md`.

The active expansion structure starts in `src/data/bodies.js` and uses `parentId` to support moon systems, dwarf planets, and small-body fields without rendering every object as a mesh.
