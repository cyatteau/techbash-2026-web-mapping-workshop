# City Explorer • TechBash 2026

**A Developer's Guide to Open Source Web Mapping Libraries**  
A hands-on workshop with [Courtney Yatteau](https://github.com/cyatteau), Developer Advocate at Esri.

Build an interactive City Explorer using HTML, CSS, vanilla JavaScript, Leaflet, Esri Leaflet, GeoJSON, and MapLibre GL JS. Start with a map, connect geographic data to a sidebar, and use shared application state to coordinate selection and filtering. Improve styling, performance, and usability, then reuse the same data in a separate MapLibre lab. Refactoring and favorites are optional.

**The map is one view of your application state, not the whole application.**

This repository includes the workshop website, starter code, runnable checkpoints, prepared datasets, and optional extensions.

## Start here

1. **Download the project:** Download the TechBash workshop ZIP provided by the instructor and extract it. If you already have a copy named `techbash2026-map-workshop`, use that project folder.

2. Open the **full project folder** in your editor.
3. Copy `checkpoints/00-start` to a new folder named `workshop-work` **at the project root**, alongside `checkpoints`, `data`, and `workshop-site`.
4. Inside `workshop-work`, copy `config.example.js` and name the copy `config.js`.
5. Add the workshop API key to `workshop-work/config.js`:

   ```js
   window.APP_CONFIG = {
     arcgisApiKey: "PASTE_WORKSHOP_KEY_HERE",
   };
   ```

6. Start a local server **from the project root**. Use your editor's Live Server extension, or run:

   ```bash
   python -m http.server 8000
   ```

   If your system uses `python3`, run `python3 -m http.server 8000` instead.

7. With the Python server above, open:

   - **Workshop instructions:** <http://localhost:8000/workshop-site/>
   - **Your working app:** <http://localhost:8000/workshop-work/>

   With another server, use its displayed address and port with the same paths.

**No map in the starter app is correct.** You will create it in Lesson 01. Keep the instructions and working app open in separate tabs.

You can also [read Start Here on GitHub](workshop-site/START-HERE.md), but the workshop website renders the interactive activities and navigation.

## What you need

- A laptop, charger, modern browser, and code editor.
- A local static web server, such as VS Code Live Server or Python's HTTP server.
- Basic familiarity with HTML, CSS, and JavaScript.
- Internet access for hosted libraries and ArcGIS services.
- An ArcGIS API key, provided by the instructor during the workshop.

No npm installation, bundler, or JavaScript framework is required. Attendees do not need their own ArcGIS account for the instructor-led session.

Use a local HTTP server rather than opening HTML files with `file://`. The app loads GeoJSON with `fetch()` and later uses JavaScript modules. Serve the whole repository so the instruction site and all example apps are reachable. The Leaflet and MapLibre practice apps each use a local copy of `data/cities/mount-pocono.geojson`.

## ArcGIS API key

The **ArcGIS basemap is part of the core workshop**. Lesson 01 first introduces an OpenStreetMap raster basemap, then switches to an ArcGIS vector basemap through Esri Leaflet Vector.

The separate MapLibre lab also uses an ArcGIS basemap through the MapLibre ArcGIS plugin.

The instructor shares a temporary workshop key separately. Keep it in your local `config.js`, rather than embedding it in `main.js` or `js/map.js`. Do not publish the workshop key in commits, documentation, or shared AI prompts.

When continuing after workshop access ends, use your own ArcGIS credentials with the permissions needed for your app. The optional geocoding extension requires geocoding permission in addition to basemap access.

## Required workshop path

| Lesson | What you build or learn | Finished example |
| --- | --- | --- |
| [Start Here](workshop-site/START-HERE.md) | Working folder, local configuration, and server setup | `checkpoints/00-start` |
| [Mapping Foundations and Library Choice](workshop-site/mapping-foundations.md) | Geometry, GeoJSON, coordinate order, tile formats, and library comparison | Reading and discussion; no code checkpoint |
| [01 · Build the Map](workshop-site/01-map.md) | Leaflet map, Mount Pocono configuration, OSM tiles, and an ArcGIS basemap | `checkpoints/01-map` |
| [02 · Load Geographic Data](workshop-site/02-data.md) | Load 21 regional historic places, create markers and popups, and fit the data | `checkpoints/02-data` |
| [03 · Build the UI](workshop-site/03-ui.md) | Sidebar, title, count, and cards from shared data | `checkpoints/03-ui` |
| [04 · Synchronize Selection](workshop-site/04-selection.md) | Connect markers and cards with stable IDs | `checkpoints/04-selection` |
| [05 · Filter Shared State](workshop-site/05-filtering.md) | Filter the map, list, and count from one derived array | `checkpoints/05-filtering` |
| [06 · Styling, Performance, and Usability](workshop-site/06-polish.md) | Category colors, focus, status messages, responsive layout, reduced motion, and rendering checks | `checkpoints/06-polish` |
| [07 · MapLibre Lab](workshop-site/07-maplibre.md) | Reuse GeoJSON with a source, circle layer, popups, and category filtering | `labs/maplibre` |
| [Wrap-Up](workshop-site/wrap-up.md) | Recap the app architecture and evaluate a library for another project | Discussion; no code checkpoint |

The MapLibre lab is a separate app. Keep your Leaflet work in `workshop-work` and build the lab in `maplibre-work`. Copy your working `config.js` and the dataset into the new app as the lab instructions describe.

## Optional work

| Lesson | What you add | Finished checkpoint |
| --- | --- | --- |
| [Optional · Refactor Into Modules](workshop-site/07-refactor.md) | Focused state, data, map, UI, and coordination modules | `checkpoints/07-complete` |
| [Optional · Add Favorites](workshop-site/08-favorites.md) | Favorite IDs, toggle, and card indicators | `checkpoints/08-favorites` |

Keep these existing filenames and folders. `07-complete` belongs to optional refactoring, not the required MapLibre lab.

Favorites live in JavaScript memory and survive category filtering. Saving them across reloads with `localStorage` is an optional challenge.

## How to follow along

- **Watch:** Follow the explanation and demonstration.
- **Your Turn:** Complete the numbered steps.
- **Check Your Work:** Confirm the expected behavior before continuing.
- **Make It Yours:** Try a small customization when your core work is complete.
- **Challenge or Extension:** Explore further when you have time.

You do not need to complete every optional activity. Keep the core app working and return to larger experiments afterward.

### Recover with a checkpoint

If you get stuck, compare your files with the finished checkpoint for the lesson. To catch up:

1. Save a copy of any experiments you want to keep.
2. Copy the matching checkpoint's files into `workshop-work`.
3. Preserve your existing `workshop-work/config.js`.
4. Refresh the working app and verify it works before continuing.

Keep `workshop-work` at the project root. Check that its local `data/cities/mount-pocono.geojson` survived the copy. Checkpoints are there to help you stay with the group.

## Optional extensions

The three extensions use the modular Leaflet app. Complete optional refactoring first, or copy `checkpoints/07-complete` directly. Favorites are not required; the `08-favorites` app also works as a starting point. Work in a separate copy and preserve your own `config.js` and Mount Pocono dataset.

| Extension | What you add | Example folder |
| --- | --- | --- |
| [ArcGIS Geocoding](workshop-site/extensions/geocoding.md) | Address/place search, suggestions, and temporary search-result markers | `extensions/geocoding` |
| [Draw and Export GeoJSON](workshop-site/extensions/drawing.md) | Drawing, editing, deleting, and downloading your own geographic features | `extensions/drawing` |
| [ArcGIS Feature Layer](workshop-site/extensions/feature-layer.md) | A public Southern California trailhead sample, custom styles, attribute popups, and a query for its full extent | `extensions/feature-layer` |

For more experiments, browse the [customization ideas](workshop-site/CUSTOMIZE.md). This is a broad idea bank; not every suggestion has a complete implementation or standalone lesson.

## Prepared cities and data

The shared TechBash path uses **Mount Pocono and surrounding Monroe County, Pennsylvania**, with **21 National Register historic places** from National Park Service records. The file is `data/cities/mount-pocono.geojson`.

The first feature is **Pocono Manor Historic District**, with `properties.id` **mp-97000287**. Districts and large properties are represented by points for this app. Categories are workshop classifications, and listing dates preserve month precision.

Chicago, Seattle, and Washington, DC remain available for optional city-switching exercises. Return to `const CITY = "mount-pocono";` when rejoining the shared path.

See [the data README](data/README.md) for dataset information. When bringing your own data, inspect its geometry and property names before connecting it to the app. Later lessons rely on consistent feature IDs and properties such as names and categories.

## Using AI coding tools

AI assistants and coding agents are welcome, but optional. No AI subscription is required.

Give your tool the current checkpoint and a specific task. Keep changes within the workshop's vanilla JavaScript setup, review its edits, and test the result. Be ready to explain how data, state, and events connect.

For example, after a change to filtering, check that the map, list, count, and selection remain consistent. If generated code becomes difficult to recover, return to the matching checkpoint.

## Repository contents

| Path | Purpose |
| --- | --- |
| `workshop-site/` | Instruction website, lesson Markdown, activities, and navigation |
| `checkpoints/` | Starter app, required Leaflet checkpoints, and optional module/favorites checkpoints |
| `data/` | Shared geographic datasets |
| `extensions/` | Example apps for the three optional extensions |
| `labs/maplibre/` | Completed example for the required MapLibre lab |
| `maplibre-work/` | Your separate MapLibre practice app, created during the lab |
| `workshop-work/` | Your working copy, created during setup |

To update lesson text, edit the relevant Markdown file in `workshop-site/`. Update sidebar links in `workshop-site/index.html`, plus the `pages` object and `coreSequence` array in `workshop-site/site.js`, when changing the required sequence. Preview the site locally after changes and check that lesson, data, and checkpoint links still resolve.

## Troubleshooting

Open the [Troubleshooting guide](workshop-site/troubleshooting.md) for help with setup, basemaps, GeoJSON, selection, filtering, and module errors.

Start with the browser **Console** and **Network** panels:

- **Blank map:** Check container height, loaded scripts, and basemap requests.
- **Missing data or a 404:** Check the server root, file path, and capitalization.
- **ArcGIS authorization error:** Check `config.js`, key expiration, service permissions, and allowed referrers.
- **Map and sidebar disagree:** Confirm both views use the same derived feature array.
- **Module error:** Check `type="module"`, import paths, and named exports.

When time is tight, use a checkpoint and keep moving.

## Presenter

[**Courtney Yatteau**](https://github.com/cyatteau) · Developer Advocate at Esri
