# 🧩 ArcGIS Feature Layer

## Goal

Load geographic data directly from a hosted ArcGIS Feature Service.

By the end of this extension, you'll have:

- a public ArcGIS Feature Layer on the map
- hosted geographic data alongside the City Explorer
- custom styling for hosted point features
- popups built from Feature Layer attributes
- a clearer picture of local data versus hosted GIS services

This extension uses **Esri Leaflet** to connect Leaflet to an ArcGIS Feature Service.

---

# Starting Point

Start from:

```text
checkpoints/07-complete
```

Copy that completed app into:

```text
extensions/feature-layer/
```

This extension is optional and uses the modular **Leaflet** app, rather than the separate MapLibre lab.

You can complete **Optional: Refactor Into Modules** first, or copy `checkpoints/07-complete` directly. Favorites are not required. If you already completed favorites, you may use `checkpoints/08-favorites` instead and keep your favorite helpers.

Preserve your own `config.js` when copying files. If the extension folder already contains a completed example, back it up before creating your practice copy there.

Before starting, check the copied app's `js/app.js`:

```js
const CITY = "mount-pocono";
```

Its city entry should include:

```js
"mount-pocono": {
  name: "Mount Pocono",
  center: [41.1220, -75.3646],
  zoom: 12,
  dataUrl: "./data/cities/mount-pocono.geojson",
},
```

Confirm `data/cities/mount-pocono.geojson` exists inside this extension app. If it is missing, copy the shared project dataset into that path. All categories should show 21 historic places around Mount Pocono and Monroe County before you add the extension.

Continue serving the entire project from the project root. This extension does not change the required workshop checkpoints.

---

# 👀 Watch First - Local Data vs Hosted Data

So far, our City Explorer loads geographic data from a local GeoJSON file:

```text
local GeoJSON
      ↓
fetch()
      ↓
state.places
      ↓
Leaflet
```

That is a great workshop architecture because the data is predictable and available with the project.

But geographic data can also live on a server.

ArcGIS Feature Services expose geographic features over the web.

For this extension, the flow looks different:

```text
ArcGIS Feature Service
        ↓
L.esri.featureLayer()
        ↓
Leaflet
```

We do not need to download the service into a GeoJSON file first.

Esri Leaflet can communicate with the Feature Service directly.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Where Does This Data Live?",
  "prompt": "What is the biggest difference between our core GeoJSON dataset and the Feature Layer in this extension?",
  "options": [
    {
      "value": "A",
      "label": "The Feature Layer is hosted remotely instead of stored as a local project file."
    },
    {
      "value": "B",
      "label": "Feature Layers cannot contain geographic data."
    },
    {
      "value": "C",
      "label": "Leaflet cannot display Feature Layers."
    },
    {
      "value": "D",
      "label": "The Feature Layer replaces the Leaflet map."
    }
  ],
  "correct": "A",
  "success": "Correct! The core workshop uses a local snapshot, while this extension connects directly to a hosted geographic service.",
  "hint": "Think about where the GeoJSON file lives compared with the ArcGIS service."
}
```

---

# 🛠️ Your Turn 1 - Confirm Esri Leaflet Is Loaded

Open:

```text
index.html
```

Your completed City Explorer should already load Esri Leaflet:

```html
<script src="https://unpkg.com/esri-leaflet@3.0.19/dist/esri-leaflet.js"></script>
```

You do not need another plugin for this extension.

The Feature Layer functionality is already part of Esri Leaflet.

Your scripts should include:

```html
<!-- Leaflet -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Esri Leaflet -->
<script src="https://unpkg.com/esri-leaflet@3.0.19/dist/esri-leaflet.js"></script>

<!-- Esri Leaflet Vector -->
<script src="https://unpkg.com/esri-leaflet-vector@4.3.2/dist/esri-leaflet-vector.js"></script>
```

No HTML changes are required if those scripts are already present.

---

# 👀 Watch - A Feature Service Has Layers

An ArcGIS Feature Service URL may look like:

```text
.../FeatureServer
```

That identifies the service.

A specific layer inside the service has a number:

```text
.../FeatureServer/0
```

For this extension, we'll use a public trailheads layer:

```text
https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0
```

The important part at the end is:

```text
/0
```

That tells Esri Leaflet which layer in the service we want to display.

---

# 🛠️ Your Turn 2 - Add a Feature Layer Variable

Open:

```text
js/map.js
```

Near the other module-level variables, add:

```js
let hostedFeatureLayer;
```

Your map module now manages another geographic layer:

```text
placesLayer
↓
local City Explorer GeoJSON

hostedFeatureLayer
↓
remote ArcGIS Feature Layer
```

---

# 🛠️ Your Turn 3 - Create the Hosted Feature Layer

Still in:

```text
js/map.js
```

Add this exported function:

```js
export function addHostedFeatureLayer() {
  hostedFeatureLayer = L.esri
    .featureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",

      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 7,
          weight: 2,
          fillOpacity: 0.8,
        });
      },

      onEachFeature(feature, layer) {
        const { TRL_NAME, PARK_NAME } = feature.properties;

        const popup = document.createElement("div");

        const title = document.createElement("strong");

        title.textContent = TRL_NAME || "Trailhead";

        popup.append(title);

        if (PARK_NAME) {
          const park = document.createElement("p");

          park.textContent = PARK_NAME;

          popup.append(park);
        }

        layer.bindPopup(popup);
      },
    })
    .addTo(map);
}
```

There are three important pieces here.

First:

```js
L.esri.featureLayer();
```

creates a Leaflet layer connected to an ArcGIS Feature Service.

Second:

```js
pointToLayer();
```

controls how point features are displayed.

We're using:

```js
L.circleMarker();
```

just like we did for the local GeoJSON data.

Third:

```js
onEachFeature();
```

lets us attach behavior to every feature.

Here we're using it to create popups.

---

```activity
{
  "type": "reveal",
  "eyebrow": "🕵️ Trace It",
  "title": "Where Did fetch() Go?",
  "prompt": "Our core City Explorer uses fetch() to load GeoJSON. Why don't we call fetch() here?",
  "buttonLabel": "Reveal the answer",
  "answer": "L.esri.featureLayer() handles communication with the ArcGIS Feature Service for us. We give Esri Leaflet the service URL, and it requests and renders the geographic features."
}
```

---

# 🛠️ Your Turn 4 - Add the Layer to the Application

Open:

```text
js/app.js
```

Find the import from:

```text
./map.js
```

Add:

```js
addHostedFeatureLayer,
```

For example:

```js
import {
  initMap,
  renderMap,
  fitMapToPlaces,
  highlightMapPlace,
  addHostedFeatureLayer,
} from "./map.js";
```

At the bottom of `js/app.js`, find the existing startup call:

```js
loadPlaces();
```

Replace it with:

```js
await loadPlaces();
addHostedFeatureLayer();
```

Keep the existing `initMap()` call and event bindings. Call `addHostedFeatureLayer()` only once.

Top-level `await` works because `app.js` is loaded as a JavaScript module. Waiting for the local-data startup to finish prevents its initial `fitMapToPlaces()` from moving the map back after we navigate to the hosted layer.

Save and refresh. The hosted layer is now attached to the same Leaflet map. Esri Leaflet requests features for the current view; in Mount Pocono, this sample's distant trailheads may not appear yet.

---

# ⚠️ Where Did the New Features Go?

Your City Explorer starts in Mount Pocono.

This public sample contains trailheads in the Santa Monica Mountains area of Southern California. It is a separate hosted-data example, not a Mount Pocono trail dataset.

Esri Leaflet loads nearby features as the map moves. A Mount Pocono view can return no trailheads even though the service is working. Query the service for the full feature extent before moving to the trailheads.

We need a way to move the map to the hosted features.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🔮 Predict It",
  "title": "Loaded but Invisible?",
  "prompt": "If the Feature Layer loads correctly but its features are hundreds of miles away from the current map view, what should we expect?",
  "options": [
    {
      "value": "A",
      "label": "The Leaflet map crashes."
    },
    {
      "value": "B",
      "label": "The service has features outside the current view; the map may not have requested those features yet."
    },
    {
      "value": "C",
      "label": "The local GeoJSON is deleted."
    },
    {
      "value": "D",
      "label": "The browser automatically moves to them."
    }
  ],
  "correct": "B",
  "success": "Correct! The service can be available even when the current map view has no matching features. Query its extent to navigate to the data.",
  "hint": "Remember that the map has a current center and zoom."
}
```

---

# 🛠️ Your Turn 5 - Fit the Map to the Feature Layer

Return to:

```text
js/map.js
```

Replace your current:

```js
export function addHostedFeatureLayer() {
```

function with this complete version:

```js
export function addHostedFeatureLayer() {
  hostedFeatureLayer = L.esri
    .featureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",

      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 7,
          weight: 2,
          fillOpacity: 0.8,
        });
      },

      onEachFeature(feature, layer) {
        const { TRL_NAME, PARK_NAME } = feature.properties;

        const popup = document.createElement("div");

        const title = document.createElement("strong");

        title.textContent = TRL_NAME || "Trailhead";

        popup.append(title);

        if (PARK_NAME) {
          const park = document.createElement("p");

          park.textContent = PARK_NAME;

          popup.append(park);
        }

        layer.bindPopup(popup);
      },
    })
    .addTo(map);

  hostedFeatureLayer.query().where("1=1").bounds((error, bounds) => {
    if (error) {
      console.error("Could not query the hosted layer extent:", error);
      return;
    }

    if (bounds?.isValid()) {
      map.fitBounds(bounds, {
        padding: [30, 30],
        animate: false,
      });
    } else {
      console.warn("The hosted layer query returned no valid extent.");
    }
  });
}
```

Now the flow is:

```text
query the service for all matching feature bounds
        ↓
check for errors and a valid extent
        ↓
fit the map to that extent
        ↓
Esri Leaflet requests features in the new view
```

Save and refresh.

The map should move to Southern California after the extent query succeeds. The hosted features then load for that view.

`query().bounds()` gets the matching extent from the service. The layer's `load` event only describes features loaded in the current map view, so it is not a reliable way to discover distant features.

The sidebar still lists your 21 local historic places. Hosted trailheads are not added to `state.places`, the category filter, selection lookup, or favorites. Clicking a historic-place card can take you back to Pennsylvania.

---

# ✅ Checkpoint 1 - Hosted Data Works

Verify:

- [ ] The City Explorer loads normally.
- [ ] The ArcGIS basemap still appears.
- [ ] The hosted Feature Layer loads.
- [ ] The map moves to the hosted features.
- [ ] Hosted features appear as circle markers.
- [ ] Clicking a hosted feature opens a popup.
- [ ] The popup shows a trailhead name when available.
- [ ] Your original City Explorer code still works.
- [ ] There are no unexpected errors from your application code.

---

# 👀 Watch - Two Different Data Sources

Your application now knows how to work with two very different sources of geographic data.

The core workshop uses:

```text
data/cities/mount-pocono.geojson
        ↓
fetchPlaces()
        ↓
state.places
        ↓
renderMap()
```

The extension uses:

```text
ArcGIS Feature Service
        ↓
L.esri.featureLayer()
        ↓
Leaflet
```

Both eventually become geographic features on the same map.

But their architectures are different.

---

# Local GeoJSON

Advantages:

```text
predictable
local data remains available without a live data service
easy to inspect
easy to version
excellent for workshops
```

Our core workshop uses a frozen copy of the data, so everyone gets the same records. CDN libraries and hosted basemaps still need a connection unless you provide a separate offline setup.

---

# Hosted Feature Layer

Advantages:

```text
centrally hosted
can stay current
queryable
can contain large datasets
does not need to ship with the app
```

But hosted data also introduces:

```text
network dependency
service availability
permissions
changing data
```

Neither approach is automatically better.

The right choice depends on the application.

---

```activity
{
  "type": "multiple-choice",
  "eyebrow": "🧠 Quick Check",
  "title": "Why Keep Local GeoJSON for the Core Workshop?",
  "prompt": "Why might local GeoJSON still be a better choice for the required workshop path?",
  "options": [
    {
      "value": "A",
      "label": "It gives every attendee the same predictable dataset."
    },
    {
      "value": "B",
      "label": "Feature Services cannot be displayed in Leaflet."
    },
    {
      "value": "C",
      "label": "GeoJSON never contains coordinates."
    },
    {
      "value": "D",
      "label": "Leaflet requires all data to be local."
    }
  ],
  "correct": "A",
  "success": "Correct! A frozen local dataset makes the required workshop path much more predictable and resilient.",
  "hint": "Think about what happens if a remote service changes or the conference Wi-Fi has problems."
}
```

---

# 🕵️ Look at the Feature Properties

Inside:

```js
onEachFeature(feature, layer);
```

we use:

```js
feature.properties;
```

That should look familiar.

Our local GeoJSON also has:

```js
feature.properties;
```

This means the application code can work with familiar feature-shaped objects even though the data came from a completely different source.

For this layer, we're reading:

```js
const { TRL_NAME, PARK_NAME } = feature.properties;
```

Different datasets use different property names.

That is why inspecting a dataset's fields is an important part of working with real geographic data.

---

# ✨ Make It Yours - Change the Marker Style

Find:

```js
return L.circleMarker(latlng, {
  radius: 7,
  weight: 2,
  fillOpacity: 0.8,
});
```

Try changing:

```text
radius
weight
opacity
fillOpacity
```

For example:

```js
return L.circleMarker(latlng, {
  radius: 10,
  weight: 3,
  fillOpacity: 1,
});
```

Save and refresh.

The Feature Service data stays the same.

Only its Leaflet representation changes.

---

# ✨ Make It Yours - Change the Popup

Our popup currently uses:

```text
TRL_NAME
PARK_NAME
```

You can change:

- which fields are displayed
- their order
- the HTML structure
- fallback text

The Feature Layer controls the available data.

Your application controls how that data is presented.

---

<!-- OPTIONAL-START: 🚀 Challenge - Add a Layer Toggle -->

# 🚀 Challenge - Add a Layer Toggle

Right now the hosted Feature Layer is always visible.

Can you let the user turn it on and off?

One Leaflet option is:

```js
L.control.layers();
```

Conceptually:

```text
Basemap
+
City Explorer places
+
Hosted Feature Layer
```

could become user-controlled layers.

A possible UI:

```text
☑ Historic Places
☑ Trailheads
```

This is especially useful as applications begin combining multiple geographic datasets.

<!-- OPTIONAL-END -->

---

<!-- OPTIONAL-START: 🚀 Challenge - Find Another Feature Service -->

# 🚀 Challenge - Find Another Feature Service

Try replacing the trailheads service with another public ArcGIS Feature Layer.

You will need a URL shaped like:

```text
https://.../FeatureServer/0
```

Then inspect its fields.

Your existing popup code may no longer work because the new dataset may not have:

```text
TRL_NAME
PARK_NAME
```

Update:

```js
feature.properties;
```

to use fields from your new dataset.

This is a good example of the difference between:

```text
application architecture
```

and:

```text
data contract
```

The Feature Layer architecture can stay the same even when the dataset changes.

<!-- OPTIONAL-END -->

---

# ✅ Final Checkpoint - Feature Layer Complete

Before finishing, verify:

- [ ] The core City Explorer still works.
- [ ] The hosted Feature Layer loads.
- [ ] The map can display remote ArcGIS data.
- [ ] Hosted features use custom Leaflet styling.
- [ ] Feature Layer attributes appear in popups.
- [ ] You understand the `/FeatureServer/0` layer URL.
- [ ] You can explain the difference between local GeoJSON and a hosted Feature Layer.
- [ ] There are no unexpected errors from your application code.

---

```activity
{
  "type": "reveal",
  "eyebrow": "💬 Explain It",
  "title": "What Did Esri Leaflet Add?",
  "prompt": "What did Esri Leaflet let us do that our core fetch() approach did not?",
  "buttonLabel": "Reveal one possible answer",
  "answer": "Esri Leaflet let our Leaflet application communicate directly with an ArcGIS Feature Service. Instead of downloading a local GeoJSON file ourselves, we connected a Leaflet layer to hosted geographic data."
}
```

---

# 🎉 Extension Complete

You now have two different approaches to geographic data in the same workshop.

```text
LOCAL DATA

GeoJSON file
     ↓
fetch()
     ↓
application state
     ↓
Leaflet
```

and:

```text
HOSTED DATA

ArcGIS Feature Service
     ↓
Esri Leaflet
     ↓
Leaflet
```

The biggest takeaway is not that one replaces the other.

It is that a Leaflet application can work with geographic data from many different sources.

Your map is still:

```text
Leaflet
```

Your basemap can come from:

```text
ArcGIS
```

Your application data can come from:

```text
local GeoJSON
```

or:

```text
ArcGIS Feature Services
```

Those pieces can be combined depending on what your application needs.

---

## Reference Links

- [Esri Leaflet Feature Layer API](https://developers.arcgis.com/esri-leaflet/api-reference/esri-leaflet/feature-layer/)
- [Esri Leaflet query and bounds API](https://developers.arcgis.com/esri-leaflet/api-reference/esri-leaflet/query/)
- [Sample trailhead layer metadata](https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0)

# Explore More

Choose another page under **Extensions** in the workshop sidebar, or return to **Wrap-Up** under Core Workshop.
