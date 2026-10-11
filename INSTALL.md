# Apply the optional-app updates

This package updates only:

- `checkpoints/08-favorites/`
- `extensions/geocoding/`
- `extensions/drawing/`
- `extensions/feature-layer/`

Each folder includes complete replacements for `index.html`, `styles.css`,
`js/app.js`, `js/map.js`, `js/ui.js`, and `CHECKPOINT.md`.

## Apply the files

1. Back up your current workshop project folder.
2. Extract this ZIP.
3. Open the extracted folder containing `checkpoints` and `extensions`.
4. Open your existing `techbash2026-map-workshop` project folder. This is the
   folder containing your root `README.md`, `config.js`, and `workshop-site`.
5. Copy the extracted `checkpoints` and `extensions` folders into that project
   root. Merge matching folders and replace matching files. Do not delete the
   original folders first.
6. Keep each app's existing `config.js`, `config.example.js`, `data/`,
   `js/state.js`, and `js/data.js`. They are not included in this package.
7. Verify every app has its local `data/cities/mount-pocono.geojson`.
8. Use your intended working workshop key in each local configuration. This
   package contains no key or configuration file. Geocoding needs geocoding
   permission as well as basemap access.
9. Continue serving the full project over HTTP. Hard-refresh each updated app.

The root finished app, required checkpoints, optional `07-complete`, workshop
site, slides, and Word handouts are not replaced by this package.

## What changed

All four apps retain category colors, yellow selected markers, restoration of
the previous marker's category style, Canvas rendering, reduced-motion map
selection and card scrolling, disabled filtering during loading and after
failed loads, accessible status messages, selected-card styling, keyboard focus,
and the existing responsive layout.

Favorites and feature-specific controls remain. Alternate city entries now
include their matching data paths. Drawing has one local-data startup call.
Geocoding has one app script tag. Feature Layer startup waits for local loading
to finish, then queries the hosted layer's full extent instead of calling
`getBounds()` on that Esri Leaflet layer.

## Shared checks for every app

1. Open the app and confirm 21 historic places with different category colors.
2. Select a card. Its marker should become larger and yellow with a dark outline.
3. Select a place in another category. The first marker should recover its category color.
4. Click a map marker. Its matching card should become selected.
5. Save a favorite, filter it out, then return to All categories. The star should remain.
6. Remove the favorite and confirm the star and button label update.
7. Check Education & Religion shows four places and Residential shows five.
8. Use Tab and Enter or Space. Check visible focus on cards and tool buttons.
9. Test a roughly 390px-wide screen. The sidebar should stack above the map.
10. In Chrome DevTools, use Rendering to emulate `prefers-reduced-motion: reduce`.
    Local card selection should change the map immediately and avoid smooth
    card scrolling. Restore No emulation when finished.

For the loading check, use Slow 3G in DevTools Network, disable cache, and reload.
The category filter should stay disabled until the local data loads successfully.
Restore normal network and cache settings afterward.

For the failure check, temporarily change the Mount Pocono `dataUrl` in that
app's `js/app.js` to `./data/cities/missing-test.geojson`. Save and reload.
Confirm the local data error remains visible and the filter stays disabled.
Restore `./data/cities/mount-pocono.geojson`, save, and reload afterward.

To inspect Canvas paths, run this in Console:

```js
document.querySelector("#map .leaflet-overlay-pane canvas")
```

It should return a canvas element for the local circle markers.

## Feature-specific checks

| App path | Check |
| --- | --- |
| `/checkpoints/08-favorites/` | Save/remove favorites and confirm they survive filtering. Reloading clears in-memory favorites. |
| `/extensions/geocoding/` | Search for a place, select a result, search again, and confirm results are replaced. Filter local places and confirm results remain. |
| `/extensions/drawing/` | Draw, edit/save, delete/save, and export. Check exported geometry, including an empty export. Filtering should keep drawings. |
| `/extensions/feature-layer/` | Confirm the initial view reaches the Southern California trailheads and their popups work. Filtering should keep the hosted layer. Local card selection returns to Mount Pocono. |

Use these paths under your existing local server address and port.

## Validation

All 12 changed JavaScript files passed syntax checks. Nineteen mocked
DOM/Leaflet execution scenarios checked successful, failed, HTTP-error, and
empty local data; selection and color restoration; reduced-motion branches;
category counts; single local fetches; favorites; search-result replacement;
drawing export after geometry changes or deletion; and hosted-layer query
success, failure, and invalid extents.

Markup, module exports/imports, plugin references, focus styles, and responsive
rules were also checked. These checks do not verify live service credentials,
actual plugin UI, browser layout, or assistive-technology behavior. Run the
local browser checks before rehearsal.
