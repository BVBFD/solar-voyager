# Solar Voyager Asset Credits

This document tracks texture asset sources, required credit, usage terms, and
visual accuracy notes before assets are added to `public/textures`.

NASA/JPL/USGS source material may be used as reference or asset sources, but Solar Voyager is not affiliated with, endorsed by, or sponsored by NASA, JPL, USGS, or any official space agency.

Some textures may be representative, model-derived, enhanced-color, gap-filled, or procedural approximations rather than exact global observed maps.

## Recording Policy

- Record every texture or generated texture before committing it.
- Prefer NASA, JPL, USGS, NASA SVS, and NASA 3D Resources when an official source is available.
- Do not use NASA logos, insignia, mission patches, or wording that implies official endorsement.
- Do not use scraped mirrors, wallpaper sites, AI-upscaled reposts, or unclear-license sources.
- Keep the source URL specific to the asset page, not just the provider homepage.
- Record all changes made to the source asset, including resizing, projection changes, color correction, alpha generation, or format conversion.
- Record an accuracy note for each asset so users and contributors can tell observed maps from representative visuals.

## Visual Accuracy Classes

Use one of these labels in each asset record.

| Accuracy class | Meaning |
| --- | --- |
| `official observed texture` | A global or near-global map derived from direct spacecraft, telescope, survey, or mission observations. |
| `official model-derived texture` | A texture extracted or derived from an official model, 3D resource, mosaic, elevation product, radar product, or image set. |
| `representative approximate texture` | A plausible visual texture based on official imagery or known appearance, but not an exact global observed map. |
| `procedural fallback` | A generated texture or shader-like visual created for bodies without suitable global source imagery. |

## Source Guidance

| Provider | Typical use | Required notes |
| --- | --- | --- |
| NASA | Public mission imagery, reference imagery, texture candidates | Credit NASA and the specific mission/provider when listed; do not imply endorsement. |
| JPL / Caltech | Solar System Simulator maps, mission mosaics, processed images | Credit NASA/JPL-Caltech and any listed instrument or mission team. |
| USGS Astrogeology | Planetary global mosaics, controlled maps, DEM products | Credit USGS Astrogeology and listed mission data sources. |
| NASA SVS | Render-ready maps, visualization products, CGI kits | Credit NASA SVS and listed data/model contributors. |
| NASA 3D Resources | Official 3D model assets and embedded texture candidates | Credit NASA 3D Resources or the listed model contributor; note if texture was extracted from a model. |
| Solar System Scope | Non-official texture fallback candidate | Verify license before use. CC BY 4.0 material requires attribution and a license link. |

## Solar System Scope Attribution

Solar System Scope texture assets are commonly distributed under Creative
Commons Attribution 4.0 International (CC BY 4.0). If used, record:

- Source: Solar System Scope
- License: Creative Commons Attribution 4.0 International
- License URL: https://creativecommons.org/licenses/by/4.0/
- Required credit line from the source page, if provided
- Any changes made before bundling the asset

## Asset Record Template

Copy this template for each texture file.

```text
Asset path:
Body id:
Texture type:
Accuracy class:
Source title:
Source URL:
Provider:
License / usage terms:
Required credit line:
Changes made:
Accuracy note:
Endorsement note:
```

## Asset Records

```text
Asset path: public/textures/planets/earth/albedo.jpg
Body id: earth
Texture type: albedo
Accuracy class: official observed texture
Source title: Blue Marble: Next Generation, Base Map
Source URL: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/
Provider: NASA Earth Observatory
License / usage terms: NASA media usage guidelines; no endorsement implied.
Required credit line: NASA Earth Observatory
Changes made: January global 5400x2700 JPEG resized to 2048x1024 JPG.
Accuracy note: Cloud-free monthly composite; not a live or single-date Earth appearance.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/moons/moon/albedo.jpg
Body id: moon
Texture type: albedo
Accuracy class: official observed texture
Source title: CGI Moon Kit - LROC WAC Color Mosaic
Source URL: https://svs.gsfc.nasa.gov/4720/
Provider: NASA SVS / LRO / LROC
License / usage terms: NASA media usage guidelines; no endorsement implied.
Required credit line: NASA's Scientific Visualization Studio
Changes made: lroc_color_2k.jpg normalized through JPG export at 2048x1024.
Accuracy note: Rendering-optimized lunar color map; polar areas include lower-resolution albedo fill and are not intended for scientific analysis.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/mars/albedo.jpg
Body id: mars
Texture type: albedo
Accuracy class: official observed texture
Source title: Mars Viking Colorized Global Mosaic 232m
Source URL: https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m
Provider: USGS Astrogeology Science Center / NASA AMES
License / usage terms: Public domain; use constraints none.
Required credit line: USGS Astrogeology Science Center; NASA AMES; Viking Orbiter / Mariner 9 source data.
Changes made: Ancillary 1km JPG resized to 2048x1024 JPG.
Accuracy note: Colorized, controlled global mosaic with photometric and cosmetic processing; suitable as a visual basemap.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/jupiter/albedo.jpg
Body id: jupiter
Texture type: albedo
Accuracy class: official model-derived texture
Source title: Jupiter 3D Model
Source URL: https://science.nasa.gov/resource/jupiter-3d-model/
Provider: NASA Visualization Technology Applications and Development (VTAD)
License / usage terms: NASA 3D Resources / NASA media usage guidelines; no endorsement implied.
Required credit line: NASA Visualization Technology Applications and Development (VTAD)
Changes made: Base color texture extracted from glTF, central surface atlas band cropped, resized to 2048x1024, and converted to JPG for the app's sphere UVs.
Accuracy note: Representative Jupiter cloud-deck visual derived from an official 3D model; Jupiter has no fixed solid surface and atmospheric appearance changes over time.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/saturn/albedo.jpg
Body id: saturn
Texture type: albedo
Accuracy class: official model-derived texture
Source title: Saturn 3D Model
Source URL: https://science.nasa.gov/resource/saturn-3d-model/
Provider: NASA Visualization Technology Applications and Development (VTAD)
License / usage terms: NASA 3D Resources / NASA media usage guidelines; no endorsement implied.
Required credit line: NASA Visualization Technology Applications and Development (VTAD)
Changes made: Base color texture extracted from glTF, central surface atlas band cropped, resized to 2048x1024, and converted to JPG for the app's sphere UVs.
Accuracy note: Representative Saturn cloud-deck visual derived from an official 3D model; atmospheric bands are approximate and time-variable.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/mercury/albedo.jpg
Body id: mercury
Texture type: albedo
Accuracy class: official model-derived texture
Source title: Mercury 3D Model
Source URL: https://science.nasa.gov/resource/mercury-3d-model/
Provider: NASA Visualization Technology Applications and Development (VTAD)
License / usage terms: NASA 3D Resources / NASA media usage guidelines; no endorsement implied.
Required credit line: NASA Visualization Technology Applications and Development (VTAD)
Changes made: Base color texture extracted from glTF, central surface atlas band cropped, resized to 1024x512, and converted to JPG for the app's sphere UVs.
Accuracy note: Model-derived Mercury surface visual for application rendering; not a full-resolution scientific basemap.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

## Deferred Assets

```text
Asset path: public/textures/planets/earth/clouds.png
Body id: earth
Texture type: cloud
Status: deferred
Reason: Blue Marble: Clouds requires stable alpha generation and visual QA before use.
```

```text
Asset path: public/textures/planets/saturn/ring.png
Body id: saturn
Texture type: ring
Status: deferred
Reason: Saturn 3D Model contains a ring texture, but this phase intentionally does not apply Saturn ring assets.
```

### Example Record Format

```text
Asset path: public/textures/planets/earth/albedo.jpg
Body id: earth
Texture type: albedo
Accuracy class: official observed texture
Source title: TODO
Source URL: TODO
Provider: NASA / JPL / USGS / NASA SVS / NASA 3D Resources / Solar System Scope / TODO
License / usage terms: TODO
Required credit line: TODO
Changes made: resized, reprojected, color corrected, alpha generated, converted to JPG/PNG, or none
Accuracy note: TODO
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```
