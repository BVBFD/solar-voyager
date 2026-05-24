# Planet Textures

Planet textures are organized by body and map type.

Expected map names:
- `albedo.jpg`: visible color surface map
- `normal.jpg`: normal map for local surface relief
- `bump.jpg`: optional grayscale bump map
- `roughness.jpg`: optional roughness map
- `clouds.png`: transparent cloud layer, mainly Earth
- `atmosphere.jpg`: optional atmospheric haze layer
- `ring.png`: transparent ring texture, mainly Saturn

The app reads these filenames through `src/data/planets.js` `textureSet` entries and falls back to procedural color/materials when files are missing.
