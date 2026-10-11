# Optional - Draw and Export GeoJSON

This extension adds Leaflet.draw creation, editing, deletion, and GeoJSON
export to the modular City Explorer, including favorites.

## At this checkpoint

- The local historic-place app retains Step 06 category styling, yellow
  selection, Canvas paths, reduced selection motion, loading controls, status
  messages, visible focus, and the responsive layout.
- Favorites remain available and survive category filtering.
- The drawing toolbar manages drawings in a separate editable feature group.
- Local category filtering leaves drawings intact.
- Download Drawn GeoJSON exports the current drawings as
  `city-explorer-drawing.geojson`.
- Drawings live in memory and are cleared on reload.
- The local dataset loads once per page load.

## Setup and checks

Serve the app over HTTP. Keep your `config.js`, local dataset, and the
Leaflet.draw CSS and JavaScript.

- [ ] Confirm 21 local historic places and the expected category counts.
- [ ] Check selection, category-color restoration, favorites, and keyboard focus.
- [ ] Draw a marker, line, or polygon.
- [ ] Filter local places and confirm the drawing remains.
- [ ] Edit a drawing, save the edit, and export. Confirm the new geometry appears.
- [ ] Delete a drawing, save the deletion, and export. Confirm it is absent.
- [ ] Export with no drawings and confirm an empty FeatureCollection.
- [ ] Test reduced-motion selection, narrow layout, and failed local data loading.

Drawings remain separate from historic-place state, sidebar counts, and
favorite IDs.
