# Solar Voyager Celestial Expansion Roadmap

## Goal

Solar Voyager should scale beyond the initial eight-planet scene into a hierarchical solar-system explorer. The code now separates selectable physical bodies from dense small-body fields so future work can add moons, dwarf planets, asteroid populations, Kuiper Belt populations, and comet trails without turning every object into an individual mesh.

## Data Model

Primary data now lives in `src/data/bodies.js`.

- `PHYSICAL_BODIES`: Sun, planets, major moons, and dwarf planets.
- `MOONS`: parented bodies with `parentId` pointing to their planet.
- `DWARF_PLANETS`: Sun-parented bodies that can be rendered by quality tier.
- `SMALL_BODY_FIELDS`: aggregate fields for asteroid belt, Kuiper Belt, and comet trails.
- `SELECTABLE_BODIES`: bodies shown in the navigation UI and eligible for camera travel.

Every orbiting body uses:

- `id`: app identifier.
- `horizonsId`: JPL Horizons/NAIF identifier when available.
- `type`: `star`, `planet`, `moon`, or `dwarfPlanet`.
- `parentId`: parent body for orbital hierarchy.
- `actualAverageOrbitDistanceKm`: parent-relative average orbital distance.
- `actualSiderealOrbitPeriodDays`: simple circular fallback period.
- `renderPriority`: quality-tier visibility control.

## Rendering Architecture

`src/components/bodies/BodySystem.jsx` replaces the flat planet-only render path for new scenes.

- It builds a `parentId` tree.
- It renders parent bodies first, then recursively renders child bodies inside the parent transform.
- It keeps orbit paths parent-relative.
- It prefers JPL vector data in Real Alignment Mode.
- If a child and parent both have heliocentric vectors, the child vector is converted to parent-relative coordinates before rendering.
- Child orbits can use render-only visual multipliers in `src/utils/vectorScale.js`; physical distances remain in `src/data/bodies.js`.

`src/components/bodies/SmallBodyField.jsx` renders dense populations as `Points`.

- Asteroid Belt, Kuiper Belt, and comet trails are aggregate fields.
- Individual asteroids are not rendered as meshes.
- Future named objects can be promoted from a field into `PHYSICAL_BODIES`.

## Quality And LOD Rules

Quality controls decide how much of the expanded system is visible:

- `low`: planets, the Moon, and the main asteroid belt.
- `medium`: higher-priority moons, Pluto/Ceres, asteroid belt, and Kuiper Belt.
- `high`: all configured major moons, dwarf planets, asteroid belt, Kuiper Belt, and comet trails.

Labels remain distance-sensitive through `PlanetLabel.jsx`, so nearby bodies can be inspected without flooding the screen. Distant dense populations stay as point clouds.

## Added Body Groups

- Earth system: Moon
- Mars system: Phobos, Deimos
- Jupiter system: Io, Europa, Ganymede, Callisto
- Saturn system: Titan, Enceladus, Rhea, Iapetus, Dione, Tethys, Mimas
- Uranus system: Titania, Oberon, Umbriel, Ariel, Miranda
- Neptune system: Triton
- Dwarf planets: Pluto, Ceres, Eris, Haumea, Makemake
- Small body fields: Asteroid Belt, Kuiper Belt, Comet trails

## Next Steps

1. Replace approximate fallback orbital values with vetted source data.
2. Add body-specific texture sets for major moons and dwarf planets.
3. Add per-system visibility controls, such as "show Jupiter system".
4. Stream named asteroids/comets on demand instead of bundling them into the base scene.
5. Add backend-backed Horizons batching for high object counts.
