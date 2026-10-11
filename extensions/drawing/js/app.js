import {
  state,
  setPlaces,
  setCategory,
  setSelectedId,
  visibleFeatures,
  toggleFavorite,
  isFavorite,
} from "./state.js";

import { fetchPlaces } from "./data.js";

import {
  initMap,
  renderMap,
  fitMapToPlaces,
  highlightMapPlace,
  addDrawing,
  getDrawnGeoJSON,
} from "./map.js";

import {
  setAppTitle,
  setStatus,
  setLoading,
  renderList,
  highlightSelectedCard,
  bindPlaceListClick,
  bindCategoryChange,
  setFavoriteButton,
  updateFavoriteCard,
  bindFavoriteClick,
  bindDrawingExport,
} from "./ui.js";

const cities = {
  "mount-pocono": {
    name: "Mount Pocono",
    center: [41.122, -75.3646],
    zoom: 12,
    dataUrl: "./data/cities/mount-pocono.geojson",
  },

  chicago: {
    name: "Chicago",
    center: [41.8781, -87.6298],
    zoom: 12,
    dataUrl: "./data/cities/chicago.geojson",
  },

  seattle: {
    name: "Seattle",
    center: [47.6062, -122.3321],
    zoom: 12,
    dataUrl: "./data/cities/seattle.geojson",
  },

  "washington-dc": {
    name: "Washington, DC",
    center: [38.9072, -77.0369],
    zoom: 12,
    dataUrl: "./data/cities/washington-dc.geojson",
  },
};

const CITY = "mount-pocono";

const appConfig = cities[CITY];

function selectPlace(id, { moveMap = true } = {}) {
  const key = String(id);

  const previousId = state.selectedId;

  const found = highlightMapPlace(key, previousId, {
    moveMap,
  });

  if (!found) {
    return;
  }

  setSelectedId(key);

  highlightSelectedCard(key);

  setFavoriteButton(key, isFavorite(key));
}

function render() {
  const features = visibleFeatures();

  renderMap(features);

  renderList(features, state.favoriteIds);

  setFavoriteButton(
    state.selectedId,
    state.selectedId ? isFavorite(state.selectedId) : false,
  );

  if (features.length === 0) {
    setStatus("No places match this filter.");
  } else {
    setStatus(`${features.length} historic places`);
  }
}

async function loadPlaces() {
  setLoading(true);
  setStatus(`Loading ${appConfig.name} places...`);

  try {
    const features = await fetchPlaces(appConfig.dataUrl);

    setPlaces(features);

    render();

    fitMapToPlaces();
    setLoading(false);
  } catch (error) {
    console.error(error);

    setStatus(`We couldn't load the ${appConfig.name} data.`);
    setLoading(false, { keepFilterDisabled: true });
  }
}

setAppTitle(appConfig.name);

initMap(appConfig, (id) => {
  selectPlace(id, {
    moveMap: false,
  });
});

addDrawing();

bindPlaceListClick((id) => {
  selectPlace(id);
});

bindCategoryChange((category) => {
  setCategory(category);

  setSelectedId(null);

  render();
});

bindFavoriteClick(() => {
  const id = state.selectedId;

  if (!id) {
    return;
  }

  const favorite = toggleFavorite(id);

  updateFavoriteCard(id, favorite);

  setFavoriteButton(id, favorite);
});

bindDrawingExport(() => {
  const geojson = getDrawnGeoJSON();

  const text = JSON.stringify(
    geojson,
    null,
    2,
  );

  const blob = new Blob(
    [text],
    {
      type: "application/geo+json",
    },
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download =
    "city-explorer-drawing.geojson";

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
});

loadPlaces();
