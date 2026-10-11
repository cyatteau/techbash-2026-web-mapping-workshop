# 07 - MapLibre Lab

## Goal

Display the same Mount Pocono and Monroe County historic places with MapLibre GL JS and an ArcGIS basemap.

By the end, you will have a separate app with category-colored circles, popups, category filtering, a place count, and an initial view fitted to all 21 places.

Allow about **30 to 35 minutes**. Keep your completed Leaflet app in `workshop-work`. This lab uses a separate `maplibre-work` folder and does not require the optional module refactor.

---

# 👀 Watch First - Same Data, Different Map API

| Job | Leaflet application | MapLibre lab |
| --- | --- | --- |
| Create the map | `L.map()` | `new maplibregl.Map()` |
| Center coordinates | `[latitude, longitude]` | `[longitude, latitude]` |
| Read GeoJSON | `L.geoJSON()` | A GeoJSON source |
| Draw point features | Circle-marker layers | A circle style layer |
| Style by category | JavaScript returns marker options | A style expression reads properties |
| Filter places | Render a filtered feature array | Set a layer filter |
| Display details | Bind a popup to a Leaflet layer | Open a popup from a layer-click event |

The geometry stays in GeoJSON's longitude, latitude order. We keep the same names, IDs, descriptions, and categories. Our rendering and event APIs change.

This focused lab includes map clicks, popups, and filtering. Your Leaflet app remains the example of synchronized map and sidebar selection.

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Source or Layer?",
  "prompt": "Which part holds the GeoJSON data, and which part describes its circle appearance?",
  "options": [
    {"value": "A", "label": "The source holds data; the circle layer describes its appearance."},
    {"value": "B", "label": "The layer holds all data; the source only sets colors."},
    {"value": "C", "label": "Both are HTML elements."}
  ],
  "correct": "A",
  "success": "Correct! A source supplies geographic data. A style layer tells MapLibre how to draw data from that source.",
  "hint": "Look at the separate addSource() and addLayer() calls below."
}
```

---

# 🛠️ Your Turn 1 - Create a Separate App

1. At the project root, create `maplibre-work` beside `workshop-work`.
2. Inside it, create `index.html`, `styles.css`, and `main.js`.
3. Copy your working `config.js` from `workshop-work` into `maplibre-work`.
4. Create `maplibre-work/data/cities/`.
5. Copy the shared `data/cities/mount-pocono.geojson` into that new folder.

Your folder should contain:

```text
maplibre-work/
  index.html
  styles.css
  main.js
  config.js
  data/cities/mount-pocono.geojson
```

Continue running your server from the project root. Your new app will be at `http://localhost:8000/maplibre-work/` if you used the Python server.

The workshop key must have access to ArcGIS basemap styles. Keep it in `config.js` as in the Leaflet app.

---

# 🛠️ Your Turn 2 - Add the Page and Styles

Replace the contents of the new `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mount Pocono MapLibre Lab | TechBash 2026</title>
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@6.8.0/dist/maplibre-gl.css" />
    <link rel="stylesheet" href="./styles.css" />
    <script type="importmap">
      {
        "imports": {
          "maplibre-gl": "https://unpkg.com/maplibre-gl@6.8.0/dist/maplibre-gl.mjs",
          "@esri/maplibre-arcgis": "https://unpkg.com/@esri/maplibre-arcgis@1.3.1/dist/esm/maplibre-arcgis.min.js"
        }
      }
    </script>
  </head>
  <body>
    <header class="lab-header">
      <p class="eyebrow">TechBash 2026 · MapLibre Lab</p>
      <h1>Mount Pocono Historic Places</h1>
      <p>Explore Mount Pocono and surrounding Monroe County using the same GeoJSON as the Leaflet app.</p>
      <label for="category-filter">Category</label>
      <select id="category-filter" disabled>
        <option value="all">All categories</option>
        <option value="Culture &amp; Community">Culture &amp; Community</option>
        <option value="Education &amp; Religion">Education &amp; Religion</option>
        <option value="Civic &amp; Institutional">Civic &amp; Institutional</option>
        <option value="Commercial &amp; Industrial">Commercial &amp; Industrial</option>
        <option value="Residential">Residential</option>
      </select>
      <p id="status" role="status" aria-live="polite" aria-atomic="true">Starting the map...</p>
      <p id="map-status" role="status" aria-live="polite"></p>
    </header>
    <main id="map" aria-label="Interactive historic places map"></main>
    <script src="./config.js"></script>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

The import map maps package names to CDN module URLs. There is no package install or build step. `config.js` loads before the module that reads the key.

Replace the new `styles.css` with:

```css
* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; }
body {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  font-family: system-ui, sans-serif;
  color: #172033;
}
.lab-header { padding: 1rem 1.25rem; border-bottom: 1px solid #cbd5e1; }
.eyebrow { margin: 0; font-size: 0.8rem; font-weight: 700; color: #075985; }
h1 { margin: 0.35rem 0; font-size: 1.5rem; }
p { margin: 0.4rem 0; }
select { padding: 0.45rem; font: inherit; max-width: 100%; }
select:focus-visible { outline: 3px solid #0369a1; outline-offset: 3px; }
#map { min-height: 300px; width: 100%; }
#map-status { color: #9f1239; }
.maplibregl-popup-content { max-width: 290px; overflow-wrap: anywhere; }
.maplibregl-popup-content h2 { font-size: 1.1rem; margin: 0.25rem 0; }
@media (max-width: 600px) {
  body { height: auto; min-height: 100%; grid-template-rows: auto 65vh; }
  .lab-header { padding: 0.75rem; }
}
```

Save and open the new app. The header should appear. The map will remain empty until you add the JavaScript in the next step.

---

# 🛠️ Your Turn 3 - Create the Map and Load the Places

Replace the new `main.js` with this complete version:

```js
import * as maplibregl from "maplibre-gl";
import { BasemapStyle } from "@esri/maplibre-arcgis";

const statusElement = document.querySelector("#status");
const mapStatusElement = document.querySelector("#map-status");
const categoryFilter = document.querySelector("#category-filter");

const state = { places: [], category: "all" };
const SOURCE_ID = "historic-places";
const LAYER_ID = "historic-place-circles";
const dataUrl = "./data/cities/mount-pocono.geojson";
let map;
let activePopup;

function setStatus(message) {
  statusElement.textContent = message;
}

function visibleFeatures() {
  return state.category === "all"
    ? state.places
    : state.places.filter((feature) => feature.properties.category === state.category);
}

function applyCategory() {
  map.setFilter(LAYER_ID, state.category === "all"
    ? null
    : ["==", ["get", "category"], state.category]);
  activePopup?.remove();
  const count = visibleFeatures().length;
  setStatus(count === 0 ? "No places match this filter." : `${count} historic places`);
}

function bindPopups() {
  map.on("click", LAYER_ID, (event) => {
    const feature = event.features?.[0];
    if (!feature) return;
    const popup = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = feature.properties.name;
    const category = document.createElement("p");
    category.textContent = feature.properties.category;
    const description = document.createElement("p");
    description.textContent = feature.properties.description ?? "";
    popup.append(title, category, description);
    activePopup?.remove();
    activePopup = new maplibregl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setDOMContent(popup)
      .addTo(map);
  });
  map.on("mouseenter", LAYER_ID, () => { map.getCanvas().style.cursor = "pointer"; });
  map.on("mouseleave", LAYER_ID, () => { map.getCanvas().style.cursor = ""; });
}

async function loadPlaces() {
  setStatus("Loading Mount Pocono and Monroe County places...");
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error(`GeoJSON request failed: ${response.status}`);
    const geojson = await response.json();
    if (geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) {
      throw new Error("Expected a GeoJSON FeatureCollection.");
    }
    state.places = geojson.features;
    map.addSource(SOURCE_ID, { type: "geojson", data: geojson });
    map.addLayer({
      id: LAYER_ID,
      type: "circle",
      source: SOURCE_ID,
      paint: {
        "circle-radius": 7,
        "circle-color": ["match", ["get", "category"],
          "Culture & Community", "#0369a1",
          "Education & Religion", "#6d28d9",
          "Civic & Institutional", "#b45309",
          "Commercial & Industrial", "#047857",
          "Residential", "#be123c",
          "#475569"],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
        "circle-opacity": 0.9,
      },
    });
    bindPopups();
    applyCategory();
    if (state.places.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      for (const feature of state.places) bounds.extend(feature.geometry.coordinates);
      map.fitBounds(bounds, { padding: 40, maxZoom: 14, duration: 0 });
    }
    categoryFilter.disabled = false;
  } catch (error) {
    console.error(error);
    setStatus("We couldn't load the historic places. Check the data path and refresh.");
  }
}

function initializeMap() {
  const apiKey = window.APP_CONFIG?.arcgisApiKey;
  if (!apiKey || apiKey === "PASTE_WORKSHOP_KEY_HERE") {
    setStatus("Add the workshop API key to config.js, then refresh.");
    return;
  }
  try {
    map = new maplibregl.Map({
      container: "map",
      center: [-75.3646, 41.1220],
      zoom: 12,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.on("error", (event) => {
      console.error(event.error);
      mapStatusElement.textContent = "A map resource failed to load. Check your connection and workshop key.";
    });
    map.once("load", loadPlaces);
    const basemap = BasemapStyle.applyStyle(map, {
      style: "arcgis/light-gray",
      token: apiKey,
    });
    basemap.on("BasemapStyleError", (event) => {
      console.error(event);
      mapStatusElement.textContent = "The ArcGIS basemap couldn't load. Check the workshop key and its basemap access.";
    });
  } catch (error) {
    console.error(error);
    setStatus("The map couldn't start. Check browser WebGL support and the Console.");
  }
}

categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  applyCategory();
});

initializeMap();
```

Save and refresh. You should see the ArcGIS Light Gray basemap, 21 colored circles, and an enabled category filter.

The MapLibre ArcGIS plugin applies the ArcGIS style and handles its Esri and data attribution. The library imports use pinned versions so everyone starts with the same dependencies.

MapLibre needs a loaded style before you add this source and circle layer. That is why `loadPlaces()` runs from `map.once("load", loadPlaces)`.

`circle-color` uses a `match` expression. It reads each feature's category and chooses the same colors used in Step 06.

The dataset covers surrounding Monroe County too. Fitting its bounds should show a wider area than Mount Pocono Borough. The three converted polygon records use representative points rather than boundaries.

---

# 🛠️ Your Turn 4 - Try Popups and Filtering

1. Click Pocono Manor Historic District or another circle. Check its name, category, and description.
2. Choose **Education & Religion**. You should see **4 historic places**.
3. Choose **Residential**. You should see **5 historic places**.
4. Return to **All categories**. The count should return to **21**.
5. Open DevTools Network, filter for `mount-pocono.geojson`, then change categories again. Filtering should not request the data again.

The source keeps the full dataset. `map.setFilter()` controls which features the layer displays. `visibleFeatures()` derives the count from the same category in application state.

Popup text is built with DOM nodes and `textContent`, so place descriptions are displayed as text.

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "Did Filtering Delete the Data?",
  "prompt": "After choosing Residential, what happens to the other features in the GeoJSON source?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "They remain in the source and state.places. The layer filter controls what is drawn. Returning to All categories removes the filter without fetching the file again."
}
```

---

# Compare With Leaflet

Open your Leaflet app and MapLibre app in separate tabs. Compare how they load the same data, style categories, open popups, and filter features.

The Leaflet app also includes sidebar cards and synchronized selection. Building those in MapLibre would still be application work: preserve shared state and connect its IDs to map events and DOM controls.

Use real data and target devices when comparing performance. Twenty-one points cannot establish which library is faster for a much larger application.

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Discuss It",
  "title": "What Would You Keep?",
  "prompt": "If you moved the full City Explorer to MapLibre, which application pieces could stay, and which APIs would need to change?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "Keep the GeoJSON, stable IDs, category values, shared-state design, and much of the HTML UI. Replace map initialization, feature rendering, map events, popup handling, and marker highlighting with MapLibre APIs."
}
```

---

# ✅ Check Your Work

- [ ] My Leaflet app remains available in `workshop-work`.
- [ ] My MapLibre app is separate in `maplibre-work`.
- [ ] The ArcGIS basemap and attribution appear.
- [ ] The initial view fits the regional dataset.
- [ ] All categories shows 21 places.
- [ ] Categories use the Step 06 colors.
- [ ] Clicking a circle opens its details.
- [ ] Education & Religion shows 4 places and Residential shows 5.
- [ ] Filtering changes the map and count without refetching GeoJSON.
- [ ] There are no unexpected application errors in the Console.

The completed recovery example is **labs/maplibre/**. Copy your own `config.js` into it before opening it, or copy its files into `maplibre-work` while keeping your existing key.

If you see a blank map, check the map height, CDN requests, browser WebGL support, and ArcGIS key. A GeoJSON `404` means you should check the lab's local `data/cities/` folder.

## Reference Links

- [Esri: Display an ArcGIS basemap with MapLibre](https://developers.arcgis.com/maplibre-gl-js/maps/vector-tile-basemaps/display-a-map/)
- [MapLibre ArcGIS BasemapStyle API](https://developers.arcgis.com/maplibre-gl-js/api-reference/BasemapStyle/)
- [MapLibre Map API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/)
- [MapLibre style specification](https://maplibre.org/maplibre-style-spec/)

---

# Next

Continue to **Wrap-Up** using the Next button below.
