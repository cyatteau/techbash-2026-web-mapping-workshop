# Start Here

Welcome to **Build Your Own City Explorer** at **TechBash 2026**.

Our shared dataset contains 21 historic places around Mount Pocono and Monroe County, Pennsylvania.

This page is only here to get your machine ready. The workshop explanations happen live, and each numbered page gives you the exact code steps when we get there.

---

# What We're Building

You'll build an interactive web mapping app with:

```text
HTML
CSS
vanilla JavaScript
Leaflet
Esri Leaflet
GeoJSON
MapLibre GL JS (separate lab)
```

By the end, your app will have:

```text
map + ArcGIS basemap + GeoJSON places + sidebar + selection + filtering
```

You will also build a separate MapLibre map with the same GeoJSON and compare the libraries.

The big idea:

> The map is one view of your application state, not the whole application.

---

# What You Need

You need:

- a modern browser
- a code editor
- the workshop files
- a local static web server

You do **not** need:

- npm
- a bundler
- React, Vue, or Angular
- your own ArcGIS account

The instructor will provide a temporary ArcGIS API key for the workshop.

---

# 1. Open the Workshop Files

Open the full project folder in your editor.

You should see folders like:

```text
checkpoints/
data/
workshop-site/
```

---

# 2. Create Your Working Folder

Copy:

```text
checkpoints/00-start
```

Rename the copy:

```text
workshop-work
```

You'll build inside:

```text
workshop-work
```

The checkpoint folders stay clean so you can use them to recover later.

<button class="discovery-token" type="button" data-discovery-id="first-steps" aria-label="Hidden discovery" title="Hmm...">🗺️</button>

---

## Check the Mount Pocono Data

Your copied starter folder should include `data/cities/mount-pocono.geojson`. If it does not, copy the provided file from the project's `data/cities/` folder into `workshop-work/data/cities/`.

The required Leaflet lessons use this local path:

```js
dataUrl: "./data/cities/mount-pocono.geojson",
```

The MapLibre Lab also gets a local copy at `maplibre-work/data/cities/mount-pocono.geojson`. Both apps use the same dataset and local data path.

---

# 3. Add the API Key

Inside `workshop-work`, copy:

```text
config.example.js
```

Rename the copy:

```text
config.js
```

Then paste the workshop key into:

```js
window.APP_CONFIG = {
  arcgisApiKey: "PASTE_WORKSHOP_KEY_HERE",
};
```

Do not paste the key directly into `main.js` or later `js/map.js`.

If you later jump to a checkpoint, keep your existing `config.js` and copy the checkpoint files around it.

---

# 4. Start a Local Server

Do not open the app with a `file://` URL.

Use a local server because the app will load GeoJSON with `fetch()` and use JavaScript modules in the MapLibre Lab and optional refactoring lesson.

## Option A: VS Code Live Server

Start Live Server from the project root.

## Option B: Python

From the project root, run:

```bash
python -m http.server 8000
```

or:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/workshop-site/
```

Your working app should be at:

```text
http://localhost:8000/workshop-work/
```

---

# 5. Check That You're Ready

Before Step 01, confirm:

- [ ] the workshop site opens through `http://`
- [ ] `workshop-work` exists
- [ ] `workshop-work/config.js` exists
- [ ] `config.js` contains the workshop API key
- [ ] `workshop-work/` opens in the browser
- [ ] the starting app does **not** show a map yet

No map yet is correct. We'll build it in Step 01.

---

# How Checkpoints Work

These lessons have finished checkpoints:

```text
checkpoints/01-map
checkpoints/02-data
checkpoints/03-ui
checkpoints/04-selection
checkpoints/05-filtering
checkpoints/06-polish
checkpoints/07-complete
checkpoints/08-favorites
```

Checkpoints 01–06 support the required Leaflet project.

`07-complete` and `08-favorites` support the optional refactoring and favorites lessons. Keep these folder names.

The completed MapLibre example is in `labs/maplibre/`. Build your own version in a separate `maplibre-work/` folder. It does not replace your Leaflet app.

If you get stuck, compare your files with the checkpoint.

If you're falling behind, copy the checkpoint files into `workshop-work`, keep your `config.js`, and continue with the group.

Checkpoints are part of the workshop. They are not cheating.

---

# Core vs Optional Work

On each page:

```text
Core Workshop pages = required path
Optional Work pages = optional lessons
✨ Make It Yours = optional customization
🚀 Challenge = extra practice
🧩 Extension = larger add-on
```

Do the required path first. Optional work can always wait.

---

# If Something Breaks

Open:

```text
troubleshooting.md
```

Start with:

```text
Console
Network tab
file paths
map height
config.js
checkpoint comparison
```

The fastest recovery is often to switch to the checkpoint and keep moving.

---

# Start the Workshop

Continue to **Mapping Foundations and Library Choice** using the Next button below.

We'll introduce the mapping concepts and compare libraries before building the Leaflet map.
