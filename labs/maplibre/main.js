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
