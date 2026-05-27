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
Asset path: public/textures/planets/earth/normal.jpg
Body id: earth
Texture type: normal
Accuracy class: official model-derived texture
Source title: Blue Marble: Next Generation Topography and Bathymetry Maps - Topography
Source URL: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/topography-bathymetry-maps/
Provider: NASA Earth Observatory / Jesse Allen, using GEBCO data produced by the British Oceanographic Data Centre
License / usage terms: NASA media usage guidelines; no endorsement implied.
Required credit line: NASA Earth Observatory image by Jesse Allen, using data from the General Bathymetric Chart of the Oceans (GEBCO) produced by the British Oceanographic Data Centre.
Changes made: 5400x2700 topography JPEG resized to 2048x1024, converted to grayscale height, lightly blurred, percentile-normalized, converted to tangent-space normal map with central differences, and exported as JPG.
Accuracy note: Rendering normal map derived from a visualization-oriented topography product; useful for broad terrain relief, not scientific elevation analysis.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/earth/clouds.png
Body id: earth
Texture type: cloud
Accuracy class: official observed texture
Source title: Blue Marble: Clouds
Source URL: https://visibleearth.nasa.gov/images/57747/blue-marble-clouds/57750l
Provider: NASA Goddard Space Flight Center / Reto Stöckli
License / usage terms: NASA media usage guidelines; no endorsement implied.
Required credit line: NASA Goddard Space Flight Center image by Reto Stöckli.
Changes made: cloud_combined_2048.jpg converted to a 2048x1024 grayscale cloud mask PNG for the app's shared map/alphaMap CloudLayer material; black background retained as transparent mask data through the red/luminance channel.
Accuracy note: Composite cloud image assembled from several days of observations; suitable as a representative Earth cloud layer, not a live weather product.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/earth/night.jpg
Body id: earth
Texture type: night
Accuracy class: official observed texture
Source title: Earth at Night (Black Marble) 2016 Color Maps
Source URL: https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/
Provider: NASA Earth Observatory / NASA GSFC / Suomi NPP VIIRS
License / usage terms: NASA media usage guidelines; no endorsement implied.
Required credit line: NASA Earth Observatory images by Joshua Stevens, using Suomi NPP VIIRS data from Miguel Román, NASA GSFC.
Changes made: 3600x1800 0.1-degree Black Marble JPEG resized to 2048x1024 and exported as JPG.
Accuracy note: 2016 cloud-free nighttime lights composite; not live night-side illumination and not currently rendered by Solar Voyager until night texture rendering is implemented.
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
Asset path: public/textures/moons/moon/normal.jpg
Body id: moon
Texture type: normal
Accuracy class: official model-derived texture
Source title: CGI Moon Kit - LOLA Displacement Map
Source URL: https://svs.gsfc.nasa.gov/4720/
Provider: NASA SVS / LRO / LOLA
License / usage terms: NASA media usage guidelines; no endorsement implied.
Required credit line: NASA's Scientific Visualization Studio
Changes made: ldem_3_8bit.jpg downloaded from NASA SVS, lightly blurred to reduce JPEG block noise, percentile-normalized, converted from height data to tangent-space normal map with central differences, and exported as 1024x512 JPG.
Accuracy note: Rendering normal map derived from the CGI Moon Kit 8-bit displacement preview; suitable for visual crater relief, not scientific terrain analysis.
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
Asset path: public/textures/planets/mars/normal.jpg
Body id: mars
Texture type: normal
Accuracy class: official model-derived texture
Source title: Mars MGS MOLA - MEX HRSC Blended DEM Global 200m
Source URL: https://astrogeology.usgs.gov/search/map/mars_mgs_mola_mex_hrsc_blended_dem_global_200m
Provider: USGS Astrogeology Science Center / DLR / NASA Goddard Space Flight Center
License / usage terms: MOLA (CC0) and HRSC (CC BY-SA 3.0 IGO); use constraints ask users to cite authors.
Required credit line: Fergason, R. L., Hare, T. M., and Laura, J. R. (2018), HRSC and MOLA Blended Digital Elevation Model at 200m v2, Astrogeology PDS Annex, U.S. Geological Survey.
Changes made: 1024px-wide USGS sample JPEG resized to 2048x1024, lightly blurred, percentile-normalized, converted from DEM grayscale to tangent-space normal map with central differences, and exported as JPG.
Accuracy note: Rendering normal map derived from the public preview/sample of a scientific DEM; suitable for global Mars relief cues, not for measurement or landing-site analysis.
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

```text
Asset path: public/textures/planets/mercury/normal.jpg
Body id: mercury
Texture type: normal
Accuracy class: official model-derived texture
Source title: Mercury MESSENGER Global DEM 665m
Source URL: https://astrogeology.usgs.gov/search/map/mercury_messenger_global_dem_665m
Provider: USGS Astrogeology Science Center / NASA / Arizona State University / Johns Hopkins Applied Physics Laboratory / Carnegie Institution for Science
License / usage terms: Access constraints none; use constraints ask users to cite authors.
Required credit line: USGS Astrogeology Science Center; Kris Becker, NASA, Arizona State University, Johns Hopkins Applied Physics Laboratory, Carnegie Institution for Science.
Changes made: 1024px-wide USGS DEM sample JPEG resized to 2048x1024, lightly blurred, percentile-normalized, converted from DEM grayscale to tangent-space normal map with central differences, and exported as JPG.
Accuracy note: Rendering normal map derived from the public preview/sample of the Mercury global DEM; suitable for crater and terrain relief cues, not scientific elevation analysis.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/venus/albedo.jpg
Body id: venus
Texture type: albedo
Accuracy class: official model-derived texture
Source title: Venus
Source URL: https://science.nasa.gov/3d-resources/venus/
Provider: NASA 3D Resources / JPL-Caltech generated planetary maps
License / usage terms: NASA media usage guidelines; no endorsement implied.
Required credit line: NASA/JPL-Caltech generated planetary maps.
Changes made: Venus.jpg resized from 1440x720 to 2048x1024 and exported as JPG.
Accuracy note: Radar-derived and gap-filled model texture stitched from Magellan RADAR imagery; represents Venus' radar-mapped surface, not visible-light cloud appearance.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/uranus/albedo.jpg
Body id: uranus
Texture type: albedo
Accuracy class: representative approximate texture
Source title: Solar System Simulator Texture Maps - Uranus
Source URL: https://space.jpl.nasa.gov/tmaps/uranus.html
Provider: NASA/JPL-Caltech / David Seal
License / usage terms: NASA/JPL image use terms and NASA media usage guidelines; no endorsement implied.
Required credit line: NASA/JPL-Caltech; David Seal.
Changes made: Generated a 2048x1024 solid-color JPG from the documented JPL Solar System Simulator Uranus texture color, hex #0087d5.
Accuracy note: JPL source documents this Uranus texture as fictional and plain solid blue; it fills the missing manifest texture without inventing atmospheric normal detail.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

```text
Asset path: public/textures/planets/neptune/albedo.jpg
Body id: neptune
Texture type: albedo
Accuracy class: representative approximate texture
Source title: Neptune
Source URL: https://science.nasa.gov/3d-resources/neptune/
Provider: NASA 3D Resources / Don Davis / JPL-Caltech
License / usage terms: NASA media usage guidelines; no endorsement implied.
Required credit line: Don Davis & JPL/Caltech.
Changes made: Neptune.jpg resized from 720x360 to 2048x1024 and exported as JPG.
Accuracy note: Source page identifies the texture as fictional with cloud features; suitable as a representative visual cloud-deck texture, not observed global mapping.
Endorsement note: Source material used for Solar Voyager; no affiliation, sponsorship, or endorsement is implied.
```

## Deferred Assets

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
