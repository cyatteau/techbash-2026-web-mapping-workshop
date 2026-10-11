# Optional - ArcGIS Feature Layer

This extension adds a public Southern California trailhead Feature Layer to
the modular Mount Pocono City Explorer, including favorites.

## At this checkpoint

- The local historic-place app retains the Step 06 category colors, yellow
  selection, Canvas paths, reduced selection motion, loading controls, status
  messages, visible focus, and responsive layout.
- Favorites and their indicators remain available through local filtering.
- Local data loading finishes before the hosted layer is added.
- Hosted trailheads use their own circle markers and attribute popups.
- Popups display `TRL_NAME`, falling back to "Trailhead", and `PARK_NAME` when present.
- A service query requests the full trailhead extent and fits the map to it.
- Query failure or an invalid extent is reported in Console without disabling
  successfully loaded local place controls.
- Local category filtering leaves the hosted layer intact.
- The sidebar count describes the local historic places only.

## Setup and checks

Serve the extension over HTTP and keep your local `config.js` and dataset.
Esri Leaflet and the basemap plugin must be loaded. The trailhead sample is public.

- [ ] Confirm the local data loads before the map fits to the trailhead area.
- [ ] Confirm hosted trailhead requests and markers appear.
- [ ] Open a trailhead popup and check its name and available park field.
- [ ] Filter local places and confirm hosted trailheads remain.
- [ ] Check local counts: All categories 21, Education & Religion four, Residential five.
- [ ] Select a local card to return to Mount Pocono and check yellow selection.
- [ ] Save a favorite and confirm it survives filtering.
- [ ] Test keyboard focus, reduced-motion selection, narrow layout, and failed local data loading.

The two datasets are intentionally in different regions. A later local card
selection returns the map to that Mount Pocono place. Keep their layers and
application state separate.
