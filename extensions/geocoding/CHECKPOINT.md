# Optional - ArcGIS Geocoding

This extension adds Esri Leaflet Geocoder address and place search to the
modular City Explorer, including favorites.

## At this checkpoint

- The local historic-place map retains every Step 06 improvement: category
  colors, yellow selection, Canvas paths, reduced selection motion, loading
  controls, status messages, visible focus, and a responsive layout.
- Favorites and their card indicators still work through filtering.
- A configured ArcGIS key enables a search control in the top-right corner.
- Search results appear as markers in a separate layer with result popups.
- A new search replaces the previous results.
- Local category filtering leaves search results intact.

## Setup and checks

Serve the app over HTTP and keep your local `config.js` with a key authorized
for the basemap and geocoding. Keep the geocoder CSS and JavaScript loaded.

- [ ] Confirm 21 local places and counts of four for Education & Religion and five for Residential.
- [ ] Select places from different categories and check marker-style restoration.
- [ ] Save a favorite and check its star after filtering away and back.
- [ ] Search for a known address or place and select a result.
- [ ] Confirm the map moves to the result and its marker popup works.
- [ ] Search again and confirm the old result markers are replaced.
- [ ] Change the local category and confirm search results remain.
- [ ] Test keyboard focus, reduced motion, narrow layout, and failed local data loading.

Search markers stay separate from the local dataset, sidebar count, and
favorite IDs. The reduced-motion improvements apply to local place selection;
the geocoder continues to manage its own search-result navigation.
