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

No production texture assets have been recorded in this root file yet.

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
