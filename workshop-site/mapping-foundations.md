# Mapping Foundations and Library Choice

## Goal

Understand the pieces of a web map before we build one.

By the end of this section, you'll be able to:

- distinguish a mapping library from a basemap or location service
- recognize points, lines, polygons, and GeoJSON features
- read coordinates in the correct order
- explain the difference between raster and vector tiles
- describe when you might choose Leaflet, MapLibre GL JS, or OpenLayers

Allow about **15 to 20 minutes** for this lesson.

You do not need a GIS background. Keep your project open, but there are no application code changes in this lesson.

---

# 👀 Watch First - What Makes Up a Web Map?

Our City Explorer combines several pieces:

| Piece                    | Its job                                                | Our workshop example                        |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------- |
| Mapping library          | Displays the map and handles interactions              | Leaflet, then MapLibre GL JS                |
| Basemap                  | Provides geographic context such as streets and labels | OpenStreetMap tiles, then an ArcGIS basemap |
| Application data         | Describes the places we want to explore                | Mount Pocono and Monroe County places in GeoJSON      |
| Application UI and state | Coordinates cards, selection, and filtering            | Our HTML, CSS, and JavaScript               |
| Location service         | Answers geographic requests                            | Geocoding in an optional extension          |

For example, selecting a sidebar card is application behavior. Moving the map to that place uses the mapping library. The streets behind the place come from the basemap.

**Choosing a library and choosing a data provider are separate decisions.**

Leaflet does not automatically supply OpenStreetMap tiles. We choose a tile layer and add it to the map.

OpenStreetMap is a geographic data project. The public tile endpoint used in our first exercise is one way to display a basemap made from that data.

ArcGIS provides services that can be used with different mapping libraries. **Esri Leaflet** provides plugins that connect Leaflet to ArcGIS services. Leaflet remains the map library when we add those plugins.

An open source library does not mean every connected service is free or requires no credentials. Follow the chosen provider's access, attribution, and usage requirements.

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "Same App, Different Basemap",
  "prompt": "If we replace the basemap, do we also need to replace our historic-place data and sidebar? Why?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "No. The basemap provides background context. Our historic places come from a separate GeoJSON dataset, and our sidebar comes from our application code. We can change the basemap while keeping that data and UI."
}
```

---

# Geographic Data: Shapes Plus Information

A geographic feature combines **geometry** with **properties**.

The geometry describes its location or shape. The properties describe what it represents.

| Geometry   | What it represents                | Example             |
| ---------- | --------------------------------- | ------------------- |
| Point      | One position                      | A historic building |
| LineString | A connected sequence of positions | A walking route     |
| Polygon    | An area enclosed by a boundary    | A park boundary     |

In this workshop, each historic place is represented by a **Point**. A building has an area in the real world, but a point is enough for the interactions we are building.

GeoJSON stores geographic features as JSON. A **FeatureCollection** contains a `features` array; each **Feature** has a `geometry` and can have descriptive `properties`.

Our dataset contains 21 National Register historic places in Mount Pocono and surrounding Monroe County. It uses National Park Service records and the workshop's five category labels. Districts and large properties use representative points.

Here is a shortened version of its first feature:

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

We will use the geometry to position a marker. We will use the properties to populate its popup and sidebar card.

The `properties.id` value is our application's identifier for connecting a place across the map, list, and selection state. GeoJSON does not require that particular property.

---

# Coordinates: Check the Order

**Latitude** describes position north or south of the equator. **Longitude** describes position east or west of the prime meridian.

Mount Pocono is north of the equator and west of the prime meridian, so its latitude is positive and its longitude is negative.

The same location can appear in different coordinate orders:

| Where you use the coordinates              | Order                   | Approximate Mount Pocono center |
| ------------------------------------------ | ----------------------- | ------------------------------ |
| GeoJSON `geometry.coordinates`             | `[longitude, latitude]` | `[-75.3646, 41.1220]`          |
| Leaflet `setView()` or `L.marker()` array  | `[latitude, longitude]` | `[41.1220, -75.3646]`          |
| MapLibre `center` or marker position array | `[longitude, latitude]` | `[-75.3646, 41.1220]`          |

**Keep GeoJSON in longitude, latitude order, even when displaying it with Leaflet.** Leaflet's GeoJSON layer handles the conversion for us.

If you manually take coordinates from a GeoJSON feature and pass them to `L.marker()`, you must account for the different order yourself.

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
  "success": "Correct! GeoJSON positions start with longitude, then latitude. Keep this order when passing the feature to Leaflet's GeoJSON layer.",
  "hint": "GeoJSON uses longitude first. Leaflet's direct marker and setView arrays use a different order."
}
```

## Coordinate Systems and Projections

A **coordinate reference system** tells us how to interpret coordinate values. Standard GeoJSON uses WGS 84 longitude and latitude in decimal degrees.

A **map projection** determines how locations on the curved Earth are represented on a flat map. Many web basemaps use Web Mercator. It is convenient for tiled maps, but distorts area, especially near the poles.

We will provide geographic coordinates and let the mapping library handle their display. You do not need to calculate a projection for this workshop.

If a dataset contains large coordinate values measured in meters, do not assume they can be pasted into a GeoJSON position. Check its coordinate system first.

---

# Raster, Vector, and Tiles

**Raster data** represents information as pixels. A raster basemap tile is an image that already contains its visible colors and labels.

**Vector data** represents shapes and their attributes. Vector tiles supply geographic data that a renderer draws using a style.

Tiles divide a map into smaller pieces so the browser can request the pieces needed for the current view and zoom.

| Data format or delivery method | What it contains                       | What to check                                                        |
| ------------------------------ | -------------------------------------- | -------------------------------------------------------------------- |
| GeoJSON                        | Features, geometry, and properties     | Coordinate order, geometry type, and file size                       |
| CSV with coordinate columns    | Rows with separate location fields     | Which columns hold longitude and latitude; convert values to numbers |
| Raster tiles                   | Images for portions of the map         | Tile URL, attribution, and available zoom levels                     |
| Vector tiles                   | Geographic features divided into tiles | Tile source and the style used to draw them                          |

GeoJSON and vector tiles both carry vector data, but they are different formats and delivery approaches. A local GeoJSON file gives us an easy way to inspect and load our small workshop dataset.

A raster basemap can still support an interactive application. Our own markers, popups, and selection behavior are separate from its background images.

Likewise, a vector basemap does not automatically contain our application data. We still add our historic places as another layer.

---

# Choose a Library for the Work You Need

These are starting points for evaluation, not rules that only one library can satisfy.

| Library        | Consider it when...                                                    | What to evaluate                                                |
| -------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| Leaflet        | You want a straightforward 2D map with markers, popups, and GeoJSON    | Whether its core features and plugins cover your needs          |
| MapLibre GL JS | You want WebGL rendering and detailed control over vector map styling  | Its source/layer model, style specification, and target devices |
| OpenLayers     | You need broad support for map sources, formats, or custom projections | Its APIs and configuration for your particular data             |

All three are open source. Your choice still depends on the data, interactions, devices, and services your application needs.

For a production project, ask:

1. What data formats and coordinate systems must I support?
2. What should users do: browse places, edit shapes, compare layers, or explore a heavily styled map?
3. How much data will be visible, and how frequently will it change?
4. Which devices and browsers must work well?
5. Which services, credentials, attribution, and usage terms apply?

Test performance with representative data and devices. A library name alone does not tell you how fast your application will be.

## Why This Workshop Uses Two Libraries

We start with **Leaflet** to build the City Explorer's map, popups, sidebar, selection, and filtering.

Later, the **MapLibre Lab** displays the same places using MapLibre GL JS. Reusing the data helps us compare how each library creates a map and renders features.

The lab is a separate exercise. Keep your working Leaflet application available as you explore MapLibre.

OpenLayers is included in this comparison as another option to evaluate; it does not have a coding lab in this workshop.

---

# 🛠️ Your Turn - Read a Real Feature

In the workshop project, open:

```text
data/cities/mount-pocono.geojson
```

Find the first feature and answer these questions:

1. Which property gives the place's name?
2. What is its geometry type?
3. Which coordinate is its longitude?
4. Which property could connect this place's marker to its sidebar card?

Do not edit the dataset. This is a reading exercise.

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

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Discuss It",
  "title": "Which Library Would You Evaluate?",
  "prompt": "One app needs a small set of places with popups and a sidebar. Another needs extensive styling of vector tiles. Which library would you evaluate first for each, and what else would you check?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "Leaflet is a reasonable first choice to evaluate for the places app. MapLibre GL JS is a reasonable first choice to evaluate for extensive vector tile styling. For either, check the actual data, interactions, devices, service requirements, and performance. More than one library may meet the requirements."
}
```

---

# Ready to Build?

- [ ] I can distinguish the mapping library, basemap, and application data.
- [ ] I can find a feature's properties and geometry.
- [ ] I know GeoJSON uses longitude, latitude order.
- [ ] I know raster tiles contain images and vector tiles contain data to render.
- [ ] I can explain why we are starting with Leaflet and later trying MapLibre.

This lesson does not change the application, so it has no code checkpoint. Continue using your prepared `workshop-work` folder.

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

Continue to **01 - Build the Map** using the Next button below.
