let map;
let placesLayer;
let searchResultsLayer;

const layerById = new Map();

let handleFeatureSelect = () => {};

const categoryColors = {
  "Culture & Community": "#0369a1",
  "Education & Religion": "#6d28d9",
  "Civic & Institutional": "#b45309",
  "Commercial & Industrial": "#047857",
  Residential: "#be123c",
};

function markerStyle(feature) {
  const category = feature?.properties?.category;

  return {
    radius: 7,
    color: "#ffffff",
    fillColor: categoryColors[category] ?? "#475569",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9,
  };
}

function addBasemap() {
  const apiKey = window.APP_CONFIG?.arcgisApiKey;

  if (apiKey) {
    L.esri.Vector.vectorBasemapLayer("arcgis/light-gray", {
      apikey: apiKey,
    }).addTo(map);

    return;
  }

  console.warn("No ArcGIS API key found. Falling back to OpenStreetMap.");

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);
}

export function initMap(appConfig, onFeatureSelect) {
  handleFeatureSelect = onFeatureSelect;

  map = L.map("map", { preferCanvas: true }).setView(appConfig.center, appConfig.zoom);

  addBasemap();

  placesLayer = L.geoJSON(null, {
    pointToLayer(feature, latlng) {
      return L.circleMarker(latlng, markerStyle(feature));
    },

    onEachFeature(feature, layer) {
      const id = String(feature.properties.id);

      layerById.set(id, layer);

      layer.on("click", () => {
        handleFeatureSelect(id);
      });

      const { name, category, description } = feature.properties;

      const popup = document.createElement("div");

      const title = document.createElement("strong");
      title.textContent = name;

      const meta = document.createElement("div");
      meta.textContent = category;

      popup.append(title, meta);

      if (description) {
        const detail = document.createElement("p");
        detail.textContent = description;
        popup.append(detail);
      }

      layer.bindPopup(popup);
    },
  }).addTo(map);
}

export function renderMap(features) {
  layerById.clear();

  placesLayer.clearLayers();

  placesLayer.addData({
    type: "FeatureCollection",
    features,
  });
}

export function fitMapToPlaces() {
  if (placesLayer.getBounds().isValid()) {
    map.fitBounds(placesLayer.getBounds(), {
      padding: [30, 30],
    });
  }
}

export function highlightMapPlace(id, previousId, { moveMap = true } = {}) {
  const key = String(id);

  const selectedLayer = layerById.get(key);

  if (!selectedLayer) {
    return false;
  }

  if (previousId) {
    const previousLayer = layerById.get(String(previousId));

    if (previousLayer) {
      previousLayer.setStyle(markerStyle(previousLayer.feature));
    }
  }

  selectedLayer.setStyle({
    radius: 10,
    color: "#111827",
    fillColor: "#facc15",
    weight: 4,
    fillOpacity: 1,
  });

  selectedLayer.bringToFront();

  selectedLayer.openPopup();

  if (moveMap) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      map.setView(selectedLayer.getLatLng(), 15, { animate: false });
    } else {
      map.flyTo(selectedLayer.getLatLng(), 15);
    }
  }

  return true;
}

export function addGeocoding(apiKey) {
  const searchControl = L.esri.Geocoding.geosearch({
    position: "topright",
    placeholder: "Search addresses or places",
    useMapBounds: false,

    providers: [
      L.esri.Geocoding.arcgisOnlineProvider({
        apikey: apiKey,
      }),
    ],
  }).addTo(map);

  searchResultsLayer = L.layerGroup().addTo(map);

  searchControl.on("results", (data) => {
    searchResultsLayer.clearLayers();

    for (const result of data.results) {
      const marker = L.marker(result.latlng);

      marker.bindPopup(result.text);

      marker.addTo(searchResultsLayer);
    }
  });
}
