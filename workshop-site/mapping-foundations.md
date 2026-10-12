# Mapping Foundations and Library Choice

## Goal

Understand the pieces of a web map before we build one.

By the end of this section, you'll be able to:

- distinguish a mapping library from a basemap or location service
- recognize points, lines, polygons, and GeoJSON features
- read coordinates in the correct order
- explain the difference between raster and vector tiles
- describe when you might evaluate Leaflet, MapLibre GL JS, or OpenLayers

> **This section is instructor-led.** Keep this page open as a reference while we walk through the concepts together. Complete the quick checks when prompted, then inspect one real GeoJSON feature before we begin Step 01.

Plan on about **10 to 12 minutes together**, including the short feature-reading activity.

There are **no application code changes** in this lesson. Keep your prepared `workshop-work/` folder open and ready for Step 01.

---

# What Makes Up a Web Map?

Our City Explorer combines several pieces:

| Piece | Its job | Our workshop example |
| --- | --- | --- |
| Mapping library | Displays the map and handles map interactions | Leaflet, then MapLibre GL JS |
| Basemap | Provides geographic context such as streets and labels | OpenStreetMap tiles, then an ArcGIS basemap |
| Application data | Describes the places we want to explore | Mount Pocono and Monroe County places in GeoJSON |
| Application UI and state | Coordinates cards, selection, filtering, and status | Our HTML, CSS, and JavaScript |
| Location service | Answers geographic requests | Geocoding in an optional extension |

Selecting a sidebar card is application behavior. Moving the map to that place uses the mapping library. The streets and labels behind the place come from the basemap.

**Choosing a mapping library and choosing a data or service provider are separate decisions.**

Leaflet does not automatically supply a basemap. We create a Leaflet map, then choose which layers and services to add.

ArcGIS services can also be used with different mapping libraries. In the Leaflet app, Esri Leaflet plugins connect our Leaflet map to ArcGIS services. In the later MapLibre lab, MapLibre is the map library and the MapLibre ArcGIS plugin connects it to the ArcGIS basemap.

Our local GeoJSON remains separate from the basemap in both apps.

An open source library does not mean every connected service is free or requires no credentials. Follow the access, attribution, and usage requirements of each provider you use.

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Quick Check",
  "title": "Same App, Different Basemap",
  "prompt": "If we replace the basemap, do we also need to replace our historic-place data and sidebar? Why?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "No. The basemap provides background context. Our historic places come from a separate GeoJSON dataset, and our sidebar comes from our application code. We can change the basemap while keeping that data and UI."
}
```

---

# Geographic Data: Shape Plus Information

A geographic feature combines **geometry** with **properties**.

The geometry describes its location or shape. The properties describe what the feature represents.

| Geometry | What it represents | Workshop example |
| --- | --- | --- |
| Point | One position | A historic-place marker |
| LineString | A connected sequence of positions | A walking route |
| Polygon | An enclosed area | A park boundary |

In this workshop, each historic place is represented by a **Point**.

Some of these real-world places cover a larger area, but a representative point is enough for the interactions we are building. The geometry you choose should match what your application needs to communicate.

GeoJSON stores geographic features as JSON. A **FeatureCollection** contains a `features` array. Each **Feature** has a `geometry` and can also have descriptive `properties`.

Our workshop dataset contains 21 historic places around Mount Pocono and Monroe County. It uses National Park Service records along with the workshop's five category labels. Districts and large properties use representative points.

Here is a shortened version of the first feature:

```json
{
  "type": "Feature",
  "properties": {
    "id": "mp-97000287",
    "name": "Pocono Manor Historic District",
    "category": "Culture & Community",
    "description": "National Register historic district. Source locality: Mt. Pocono, Monroe County, Pennsylvania. Listing recorded April 1997. Map marker represents the listed property area.",
    "address": "Roughly bounded by PA 314, Lake and Cliff Rds., and Summit Ave., Pocono and Tobyhanna Townships"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      -75.3714875,
      41.0976201
    ]
  }
}
```

We will use the geometry to position a marker.

We will use the properties to populate things such as:

- the popup
- the sidebar card
- the category filter
- selection state

The `properties.id` value is our application's stable identifier for connecting the same place across the map, sidebar, and application state. GeoJSON does not require a property named `id` inside `properties`. That is part of our application's data contract.

---

# Coordinates: Check the Order

**Latitude** describes position north or south of the equator.

**Longitude** describes position east or west of the prime meridian.

Mount Pocono is north of the equator and west of the prime meridian, so its latitude is positive and its longitude is negative.

The same location can appear in different coordinate orders depending on the API:

| Where you use the coordinates | Order | Approximate Mount Pocono center |
| --- | --- | --- |
| Leaflet `setView()` or `L.marker()` array | `[latitude, longitude]` | `[41.1220, -75.3646]` |
| GeoJSON `geometry.coordinates` | `[longitude, latitude]` | `[-75.3646, 41.1220]` |
| MapLibre `center` or marker position array | `[longitude, latitude]` | `[-75.3646, 41.1220]` |

**Keep GeoJSON in longitude, latitude order, even when displaying it with Leaflet.**

Leaflet's GeoJSON layer understands GeoJSON coordinate order for us.

If you manually take coordinates from a GeoJSON feature and pass them into a Leaflet method that expects a `LatLng`, you need to account for the different order yourself.

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Which Coordinate Comes First?",
  "prompt": "A GeoJSON Point contains [-75.3715, 41.0976]. Which interpretation is correct?",
  "options": [
    {
      "value": "A",
      "label": "Latitude is -75.3715 and longitude is 41.0976."
    },
    {
      "value": "B",
      "label": "Longitude is -75.3715 and latitude is 41.0976."
    },
    {
      "value": "C",
      "label": "Both values are pixel positions inside the map container."
    }
  ],
  "correct": "B",
  "success": "Correct! GeoJSON positions start with longitude, then latitude.",
  "hint": "GeoJSON uses longitude first. Leaflet's direct marker and setView arrays use a different order."
}
```

## Coordinate Systems and Projections

A **coordinate reference system** tells us how to interpret coordinate values.

Standard GeoJSON uses WGS 84 longitude and latitude in decimal degrees.

A **map projection** determines how locations on the curved Earth are represented on a flat map. Many web basemaps use Web Mercator. It is convenient for tiled maps, but it distorts area, especially near the poles.

For this workshop, we provide geographic coordinates and let the mapping library handle their display. You do not need to calculate a projection.

If you encounter a dataset with large coordinate values measured in meters, do not assume those values can be pasted directly into a GeoJSON longitude and latitude position. Check the dataset's coordinate system first.

---

# Raster, Vector, and Tiles

**Raster data** represents information as pixels.

A raster basemap tile is an image whose visible colors and labels have already been rendered.

**Vector data** represents shapes and their attributes.

Vector tiles provide geographic features that a renderer draws using a style.

Tiles divide a map into smaller pieces so the browser can request the pieces needed for the current view and zoom level.

| Data format or delivery method | What it contains | What to check |
| --- | --- | --- |
| GeoJSON | Features, geometry, and properties | Coordinate order, geometry type, and file size |
| CSV with coordinate columns | Rows with separate location fields | Which columns hold longitude and latitude; convert values to numbers |
| Raster tiles | Images for portions of the map | Tile URL, attribution, and available zoom levels |
| Vector tiles | Geographic features divided into tiles | Tile source and the style used to draw them |

GeoJSON and vector tiles can both carry vector data, but they are different formats and delivery approaches.

Our local GeoJSON file is useful for this workshop because it is small, easy to inspect, and easy to reuse in both Leaflet and MapLibre.

A raster basemap can still sit underneath an interactive application. Our markers, popups, sidebar, and selection behavior are separate from the background images.

Likewise, a vector basemap does not automatically contain our application data. We still add the historic places as another data layer.

---

# Choose a Library for the Work You Need

These are starting points for evaluation, not rules that only one library can satisfy.

| Library | Consider evaluating it when... | What to test in your app |
| --- | --- | --- |
| Leaflet | You want a straightforward 2D map with markers, popups, GeoJSON, and ordinary web UI | Features, plugins, interactions, and real data |
| MapLibre GL JS | WebGL rendering and detailed vector styling are important | Style APIs, devices, source/layer behavior, and real data |
| OpenLayers | You need broad support for map sources, formats, or custom projections | Required sources, projections, APIs, and configuration |

All three are open source.

For a production project, ask:

1. What data formats and coordinate systems must I support?
2. What should users do: browse places, edit shapes, compare layers, or explore a heavily styled map?
3. How much data will be visible, and how frequently will it change?
4. Which devices and browsers must work well?
5. Which services, credentials, attribution, and usage terms apply?
6. What does performance look like with representative data and devices?

A library name alone does not tell you how fast or appropriate an application will be.

## Why This Workshop Uses Two Libraries

We start with **Leaflet** because it gives us a straightforward way to build the City Explorer's map, popups, sidebar, selection, and filtering.

Later, the **MapLibre Lab** displays the same places using MapLibre GL JS. Reusing the dataset lets us compare how each library creates a map, supplies data, renders features, handles events, and filters what is visible.

The MapLibre lab is a **separate application**. Keep your working Leaflet app intact.

OpenLayers is included in the comparison as another option to evaluate. It does not have a coding lab in this workshop.

---

# 🛠️ Your Turn: Read One Real Feature

Before we start Step 01, inspect the actual data we will use throughout the workshop.

In the project, open:

```text
data/cities/mount-pocono.geojson
```

Find the **first feature**.

Identify these four things:

1. Which property contains the place's name?
2. What is the geometry type?
3. Which coordinate is its longitude?
4. Which property gives us the stable application ID that can connect a marker to a sidebar card?

Do not edit the file. This is just a quick reading exercise.

```activity
{
  "type": "reveal",
  "eyebrow": "🔎 Check Your Answers",
  "title": "Read the Mount Pocono Feature",
  "prompt": "Identify the name, geometry type, longitude, and application identifier for the first feature.",
  "buttonLabel": "Reveal the answers",
  "answer": "The name is in properties.name: Pocono Manor Historic District. The geometry type is Point. Longitude is the first coordinate, approximately -75.3715. Our application uses properties.id, mp-97000287, to connect the same place across the map, sidebar, and state."
}
```

---

# Before We Build

You should now be able to recognize these ideas when they appear in the code:

- **Leaflet or MapLibre** is the mapping library.
- The **basemap** supplies geographic context.
- Our **GeoJSON** contains the application places.
- A GeoJSON feature combines **geometry and properties**.
- GeoJSON positions use **longitude, latitude** order.
- Raster tiles are rendered images; vector tiles contain data that a renderer styles.
- The best library choice depends on your application's actual requirements.

You do not need to memorize these definitions. Keep this page available as a reference.

---

## Reference Links

- [Leaflet overview](https://leafletjs.com/)
- [Leaflet coordinate reference](https://leafletjs.com/reference.html#latlng)
- [GeoJSON specification: RFC 7946](https://www.rfc-editor.org/rfc/rfc7946.html)
- [MapLibre GL JS documentation](https://maplibre.org/maplibre-gl-js/docs/)
- [MapLibre coordinate reference](https://maplibre.org/maplibre-gl-js/docs/API/classes/LngLat/)
- [OpenLayers overview](https://openlayers.org/)
- [Esri Leaflet and ArcGIS](https://developers.arcgis.com/esri-leaflet/)

---

# Next

Continue to **01 - Build the Map** using the **Next** button below.
