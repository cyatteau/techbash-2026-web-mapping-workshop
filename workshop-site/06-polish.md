# 06 - Styling, Performance, and Usability

## Goal

Make the City Explorer easier to read, use, and maintain as its data grows.

By the end of this section, you'll have:

- category-based marker colors and a distinct selected marker
- clear keyboard focus and selected-card styling
- loading, error, and empty-result messages
- a responsive layout and reduced selection motion when requested
- Canvas rendering for circle markers
- a repeatable way to inspect rendering cost and network requests

Allow about **30 to 35 minutes**. Keep the edits small and check each change.

---

# Starting Point

Start from `checkpoints/05-filtering`, or keep using your working `workshop-work` folder.

You should already have a map, loaded places, sidebar cards, synchronized selection, and category filtering.

We will edit **main.js**, **styles.css**, and **index.html**. The application stays in one main JavaScript file. Refactoring is optional later.

---

# 👀 Watch First - Three Kinds of Improvement

| Area | What we will change | How we will check it |
| --- | --- | --- |
| Styling | Category colors, selection, and focus | Select places from different categories |
| Performance | Path renderer and data reuse | Inspect render timing and GeoJSON requests |
| Usability | Status messages, keyboard use, motion, and layout | Test failures, keyboard input, and a narrow screen |

Appearance is one part of usability. Users also need to know whether data is loading, whether a request failed, and whether a filter has no results.

---

# 🛠️ Your Turn 1 - Style Markers by Category

In **main.js**, replace the existing `markerStyle()` function with this category lookup and function:

```js
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
```

The fallback color handles an unexpected category. Coordinates and selection IDs stay the same.

Inside `initializeMap()`, change the circle-marker line to pass the feature:

```js
return L.circleMarker(latlng, markerStyle(feature));
```

Inside `selectPlace()`, update the previous-marker reset line to:

```js
previousLayer.setStyle(markerStyle(previousLayer.feature));
```

That line restores the previous marker's own category color when another place is selected.

Still inside `selectPlace()`, replace the selected-marker style block with:

```js
selectedLayer.setStyle({
  radius: 10,
  color: "#111827",
  fillColor: "#facc15",
  weight: 4,
  fillOpacity: 1,
});
```

Refresh. Select two places from different categories. The previous place should recover its category color, while the new selection becomes larger with a dark outline and yellow fill.

Color is not the only selection signal: the marker also changes size and outline. Category names remain available in the cards and popups.

```activity
{
  "type": "reveal",
  "eyebrow": "🔮 Predict It",
  "title": "Restore the Right Style",
  "prompt": "Why does the previous-marker reset pass previousLayer.feature to markerStyle() now?",
  "buttonLabel": "Reveal prediction",
  "answer": "The default fill depends on the feature's category. Passing the previous feature lets the function restore that marker's category color instead of using the fallback color."
}
```

---

# 🛠️ Your Turn 2 - Make Selection and Focus Clear

In **styles.css**, add this block after your existing rules. Put it before any responsive media query you already added:

```css
/* Styling and usability */
:root {
  --accent: #0369a1;
  --ink: #111827;
  --border: #cbd5e1;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  color: var(--ink);
}

.sidebar,
.map {
  min-width: 0;
}

.place-card {
  color: var(--ink);
  border: 1px solid var(--border);
  border-left: 6px solid transparent;
  overflow-wrap: anywhere;
}

.place-card.is-selected {
  background: #e0f2fe;
  border: 1px solid var(--accent);
  border-left: 6px solid var(--accent);
  outline: none;
}

.place-card:focus-visible,
.filter__select:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}

.filter__select:disabled {
  opacity: 0.65;
  cursor: wait;
}

.status {
  min-height: 1.5em;
  line-height: 1.5;
}

```

The selected card has a background and a thick left border. Keyboard focus gets its own visible outline, including when that card is already selected.

`box-sizing: border-box` keeps padding and borders inside the declared width. `min-width: 0` allows the grid children to shrink at narrow widths.

Refresh and press **Tab** until a card has focus. Press **Enter** or **Space** to select it. Native buttons already support these activation keys.

Selection does not move keyboard focus to another control. The focused control and selected place can be different.

---

# 🛠️ Your Turn 3 - Handle Loading, Empty, and Error States

Replace your `render()` function with:

```js
function render() {
  const features = visibleFeatures();

  renderMap(features);

  renderList(features);

  if (features.length === 0) {
    setStatus("No places match this filter.");
  } else {
    setStatus(`${features.length} historic places`);
  }
}
```

Replace your `loadPlaces()` function with:

```js
async function loadPlaces() {
  categoryFilter.disabled = true;
  placeList.setAttribute("aria-busy", "true");
  setStatus(`Loading ${appConfig.name} places...`);

  try {
    const features = await fetchPlaces(appConfig.dataUrl);

    state.places = features;

    render();
    fitMapToPlaces();
    categoryFilter.disabled = false;
  } catch (error) {
    console.error(error);
    setStatus(`We couldn't load the ${appConfig.name} data.`);
  } finally {
    placeList.setAttribute("aria-busy", "false");
  }
}
```

The filter becomes available after successful loading. If loading fails, it stays disabled so changing it cannot replace the error with a misleading empty-results message.

`aria-busy` marks the list as being updated. The status message remains outside that busy list.

In **index.html**, replace the existing status paragraph with:

```html
<p
  id="status"
  class="status"
  role="status"
  aria-live="polite"
  aria-atomic="true"
></p>
```

This makes status changes available to assistive technology without moving focus. Keep technical error details in the Console and give users a useful message.

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Empty or Error?",
  "prompt": "The request succeeds, but the current category matches zero places. Which state should the app display?",
  "options": [
    { "value": "A", "label": "Loading" },
    { "value": "B", "label": "Empty results" },
    { "value": "C", "label": "A failed-request error" }
  ],
  "correct": "B",
  "success": "Correct! The request worked. There are simply no places matching the current filter.",
  "hint": "A successful request with no matches is different from a request that failed."
}
```

---

# 🧪 Break It on Purpose - Test the States

## Loading

Open DevTools, select **Network**, and choose a throttling preset if available. Refresh and look for the loading message and disabled category filter. Return throttling to its normal setting afterward.

## Error

Temporarily change the Mount Pocono `dataUrl` to:

```js
dataUrl: "./data/cities/not-real.geojson",
```

Refresh. Confirm a detailed Console error, a useful status message, and a disabled category filter. Restore the real URL and refresh before continuing.

## Empty

Temporarily change the initial `state.category` to `"not-a-real-category"`. Refresh and confirm **No places match this filter.** Restore `"all"` and refresh.

---

# 🛠️ Your Turn 4 - Support Narrow Screens

At the bottom of **styles.css**, add this media query. If you already have the 760px query from an earlier version of this lesson, replace it rather than adding a duplicate:

```css
@media (max-width: 760px) {
  .app-shell {
    height: auto;
    min-height: 100vh;
    grid-template-columns: 1fr;
    grid-template-rows: auto 60vh;
  }

  .sidebar {
    max-height: 50vh;
    border-right: 0;
    border-bottom: 1px solid #ddd;
  }

  .map {
    min-height: 60vh;
    height: 60vh;
  }
}

```

Resize the browser to about 390px wide. The sidebar should appear above the map, with its own scroll area. The map must retain an explicit height.

Check that long card names wrap and that the page does not gain horizontal scrolling.

---

# 🛠️ Your Turn 5 - Respect Reduced Selection Motion

Inside **main.js**, replace your whole `selectPlace()` function with the following version. It includes the marker styling edits from earlier, plus a check for the user's reduced-motion preference:

```js
function selectPlace(id, { moveMap = true } = {}) {
  const key = String(id);

  const selectedLayer = layerById.get(key);

  if (!selectedLayer) {
    return;
  }

  // Reset previously selected marker.
  if (state.selectedId) {
    const previousLayer = layerById.get(String(state.selectedId));

    if (previousLayer) {
      previousLayer.setStyle(markerStyle(previousLayer.feature));
    }
  }

  state.selectedId = key;

  // Highlight selected marker.
  selectedLayer.setStyle({
    radius: 10,
    color: "#111827",
    fillColor: "#facc15",
    weight: 4,
    fillOpacity: 1,
  });

  selectedLayer.bringToFront();

  selectedLayer.openPopup();

  // Highlight selected sidebar card.
  document.querySelectorAll("[data-place-id]").forEach((card) => {
    const selected = card.dataset.placeId === key;

    card.classList.toggle("is-selected", selected);

    card.setAttribute("aria-current", String(selected));
  });

  // Find the matching sidebar card.
  const card = document.querySelector(`[data-place-id="${CSS.escape(key)}"]`);

  if (card) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    card.scrollIntoView({
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  // Move the map when selection came from the sidebar.
  if (moveMap) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      map.setView(selectedLayer.getLatLng(), 15, { animate: false });
    } else {
      map.flyTo(selectedLayer.getLatLng(), 15);
    }
  }
}
```

With reduced motion enabled, sidebar selection changes the map view without a flying animation, and card scrolling uses its normal immediate behavior.

Test using your operating system's reduced-motion setting, or a browser DevTools emulation for `prefers-reduced-motion: reduce`. Select a place from the sidebar, then turn the preference off and compare.

---

# 🛠️ Your Turn 6 - Compare the Path Renderer

Leaflet renders vector paths using SVG by default. Its Canvas renderer is another option for our circle markers.

Inside `initializeMap()`, replace the map-creation line with:

```js
map = L.map("map", { preferCanvas: true }).setView(
  appConfig.center,
  appConfig.zoom,
);
```

Refresh and confirm that marker clicks, popups, selected-marker styling, and filtering still work.

This setting applies to vector paths such as our circle markers. It does not convert the sidebar, ordinary HTML markers, or the basemap into Canvas.

**Treat this as an option to measure.** Our Mount Pocono and Monroe County dataset has only 21 places; a visible speed improvement is not guaranteed. For larger datasets, compare renderers using representative data and devices.

---

# 🧪 Inspect the Work the App Does

## Check Network Requests

1. Open DevTools **Network** and filter requests by `geojson`.
2. Refresh and wait for the city data to load.
3. Note the dataset request count.
4. Change categories several times, then select several places.
5. Confirm those interactions do not make another request for the city GeoJSON.

Our app loads the dataset once and filters `state.places` in memory. Basemap tile requests during map movement are separate and expected.

## Measure a Full Render

With data loaded, run this in the browser Console:

```js
(() => {
  state.selectedId = null;
  const startedAt = performance.now();
  render();
  console.log(`Synchronous render: ${(performance.now() - startedAt).toFixed(2)} ms`);
})();
```

This exercise deliberately clears selection before a full redraw. Run it a few times under the same conditions, then compare with `preferCanvas: false` after saving and refreshing.

The number covers synchronous JavaScript work in `render()`. It does not include later browser painting, tile downloads, or the full perceived response time. Use the DevTools Performance panel if you want to inspect those separately.

Restore `preferCanvas: true` for the completed checkpoint.

## Identify Avoidable Work

`render()` rebuilds the visible map layer and list when filtering changes. For 21 places this is a straightforward approach.

Selecting a place uses `layerById` to find the existing marker and changes its style. It does not fetch the data again or call the full `render()` function.

As data grows, investigate updating only the changed features, reducing the visible dataset, clustering points, or using tiled data. Choose an approach after finding the actual bottleneck.

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "What Should Selection Rebuild?",
  "prompt": "A user selects another place. Why does our app update the existing markers and cards instead of fetching GeoJSON and rebuilding every feature?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "The data and filter did not change. We already have the features in state and marker references in layerById. Selection only needs to update the previous and new marker styles, the card selection state, and the map view or popup."
}
```

---

# ✅ Check Your Work

- [ ] Markers use category colors before selection.
- [ ] A selected marker is larger with a distinct fill and outline.
- [ ] Selecting another place restores the previous category color.
- [ ] Selected cards and keyboard focus are both easy to identify.
- [ ] Tab, Enter, and Space work with the sidebar buttons.
- [ ] Loading, empty, and error messages work.
- [ ] The category filter enables after successful loading.
- [ ] Failed loading leaves the useful error message visible.
- [ ] Narrow screens stack the sidebar above a visible map.
- [ ] Reduced motion changes selection movement and scrolling.
- [ ] Canvas marker clicks and popups work.
- [ ] Filtering and selection do not fetch the GeoJSON again.
- [ ] Temporary bad URLs and categories have been restored.
- [ ] There are no unexpected application errors in the Console.

The recovery checkpoint is **checkpoints/06-polish**. Keep your own `config.js` and data when copying recovery files into `workshop-work`.

---

<!-- OPTIONAL-START: ✨ Make It Yours -->

If you're ahead, change the category colors or messages, or compare the Canvas and SVG renderers with another provided city. Keep visible focus and multiple selection signals when changing styles.

For a performance comparison, record the dataset size, renderer, browser/device, and what you measured. A single timing result does not establish which renderer is best.

<!-- OPTIONAL-END -->

## Reference Links

- [Leaflet map options and path rendering](https://leafletjs.com/reference.html#map-prefercanvas)
- [Reduced-motion preference](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [ARIA busy state](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)
- [High-resolution timing with performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

---

# Next

Continue to **07 - MapLibre Lab** using the Next button below.

We'll use the same places in MapLibre GL JS and compare its approach with Leaflet.

Refactor Into Modules and Add Favorites are available under Optional Work in the sidebar.
