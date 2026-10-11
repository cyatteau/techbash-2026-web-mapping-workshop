# Wrap-Up

You have completed the required TechBash workshop path.

You built a Leaflet City Explorer with real historic-place data around Mount Pocono and Monroe County, then displayed the same data in a separate MapLibre app.

## What You Built

| Lesson | Result |
| --- | --- |
| Mapping Foundations and Library Choice | Read geometry, properties, coordinates, and tile formats; compare libraries |
| 01 · Build the Map | Leaflet map with an ArcGIS basemap |
| 02 · Load Geographic Data | Fetch GeoJSON, create markers and popups, fit the regional data |
| 03 · Build the UI | Sidebar cards from the same application data |
| 04 · Synchronize Selection | Connect map and sidebar through stable place IDs |
| 05 · Filter Shared State | Derive one visible feature array for both views |
| 06 · Styling, Performance, and Usability | Category styling, keyboard focus, useful messages, responsive layout, and rendering checks |
| 07 · MapLibre Lab | Reuse the GeoJSON with a source, circle layer, popups, and layer filtering |

The application owns its data and state. A map and a sidebar are views of that state.

## Choose a Library for Your Next Project

Evaluate libraries against the work your users need to do:

| Start by evaluating | Example need | Check before committing |
| --- | --- | --- |
| Leaflet | A straightforward 2D places map with popups and ordinary web UI | Core features, plugins, data volume, and required interactions |
| MapLibre GL JS | WebGL rendering and extensive control over vector styling | Source/layer APIs, style expressions, target devices, and real workloads |
| OpenLayers | A mix of sources, data formats, or custom projections | Format and projection support plus the APIs your app needs |

Choosing a library and choosing a service provider are separate decisions. Check credentials, attribution, service terms, and actual performance with representative data.

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Final Activity",
  "title": "Make a Library Choice",
  "prompt": "Pick an app you might build: a neighborhood guide, a heavily styled transport map, or a map that combines several formats and projections. Which library would you evaluate first? Name two requirements you would test before deciding.",
  "buttonLabel": "Reveal example choices",
  "answer": "For a small neighborhood guide, evaluate Leaflet and test the UI interactions and plugin needs. For extensive vector styling, evaluate MapLibre and test style control and device performance. For varied formats or projections, evaluate OpenLayers and test those particular formats and coordinate systems. More than one library may satisfy the requirements."
}
```

## Keep Exploring

- **Optional: Refactor Into Modules** organizes the polished Leaflet app into focused files. Its completed checkpoint stays named `checkpoints/07-complete`.
- **Optional: Add Favorites** builds on the modular app. Its checkpoint stays named `checkpoints/08-favorites`.
- **Make It Yours** offers ideas for data, styling, and interactions.
- **ArcGIS Geocoding**, **Draw & Export**, and **ArcGIS Feature Layer** are optional extensions.

When taking the app beyond the workshop, use your own appropriately configured service credentials and data. Keep the dataset's source metadata with it, and check any requirements for your intended use.

## Before You Finish

- [ ] Both apps open through the local server.
- [ ] I can explain which parts belong to application state and which belong to the map.
- [ ] I can read GeoJSON coordinates in the correct order.
- [ ] I can describe a source and a style layer in MapLibre.
- [ ] I have a library choice to evaluate for my next project.

Thank you for building with us at **TechBash 2026**!
