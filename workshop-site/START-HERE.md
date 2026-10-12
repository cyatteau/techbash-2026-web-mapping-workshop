# Start Here

Welcome to **Build Your Own City Explorer** at **TechBash 2026**.

Our shared dataset contains 21 historic places around Mount Pocono and Monroe County, Pennsylvania.

This page is here to get your machine ready. The workshop explanations happen live, and each numbered page gives you the exact code steps when we get there.

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

You'll also build a separate MapLibre map with the same GeoJSON and compare the libraries.

The big idea:

> The map is one view of your application state, not the whole application.

---

# What You Need

You need:

- a laptop and charger
- a modern browser, such as Chrome, Edge, or Firefox
- a code editor, such as [Visual Studio Code](https://code.visualstudio.com/)
- the workshop files (download instructions below)
- a local static web server, such as VS Code Live Server or Python's built-in HTTP server
- internet access for hosted mapping libraries and basemaps

You do **not** need:

- npm
- a bundler
- React, Vue, or Angular
- your own ArcGIS account for the instructor-led session

The instructor will provide a **temporary ArcGIS API key** during the workshop. You don't need to create one before arriving.

---

# 1. Download and Open the Workshop Files

All workshop materials are available in the public GitHub repository:

**[TechBash 2026 Web Mapping Workshop on GitHub](https://github.com/cyatteau/techbash-2026-web-mapping-workshop)**

## Option A: Download ZIP (recommended)

1. Open the [workshop repository](https://github.com/cyatteau/techbash-2026-web-mapping-workshop).
2. Click the green **Code** button.
3. Select **Download ZIP**.
4. Find the downloaded ZIP file and **extract it** to a folder on your computer. Don't try to edit or run the files from inside the ZIP.
5. Open **the extracted project folder** in your code editor. In VS Code, select **File → Open Folder**.

## Option B: Clone with Git (optional)

If you're comfortable with Git, clone the repository instead:

```bash
git clone https://github.com/cyatteau/techbash-2026-web-mapping-workshop.git
```

Open the cloned folder in your editor.

## Check your project folder

You should see folders and files like:

```text
techbash-2026-web-mapping-workshop/
  checkpoints/
  data/
  extensions/
  labs/
  workshop-site/
  config.example.js
  index.html
  README.md
```

Your extracted folder name may be slightly different, especially if you used **Download ZIP**. That's fine. Keep the project's folders together and don't move individual files out of their original locations.

**Workshop instructions:** You're reading the online instructions at [the workshop website](https://cyatteau.github.io/techbash-2026-web-mapping-workshop/workshop-site/). Keep this page open in a browser tab as you work.

---

# 2. Create Your Working Folder

Find the starter checkpoint:

```text
checkpoints/00-start
```

Make a **copy** of the entire `00-start` folder. Paste that copy into the **project root**, next to `checkpoints/` and `workshop-site/`, and rename it:

```text
workshop-work
```

You'll write your code inside:

```text
workshop-work/
```

Your folder structure should now look like:

```text
techbash-2026-web-mapping-workshop/
  checkpoints/
    00-start/
    01-map/
    ...
  data/
  workshop-site/
  workshop-work/
  ...
```

**Don't edit the original checkpoint folders.** Keep them clean so you can compare your work or recover if you fall behind.

<button class="discovery-token" type="button" data-discovery-id="first-steps" aria-label="Hidden discovery" title="Hmm...">🗺️</button>

---

## Check the Mount Pocono Data

Your copied starter folder should include:

```text
workshop-work/data/cities/mount-pocono.geojson
```

If it doesn't, copy `mount-pocono.geojson` from the project's `data/cities/` folder into `workshop-work/data/cities/`. Create those folders inside `workshop-work/` if needed.

The required Leaflet lessons use this local path:

```js
dataUrl: "./data/cities/mount-pocono.geojson",
```

You'll set this up as part of the lessons. For now, just confirm the file is present.

The MapLibre Lab will also use a local copy at `maplibre-work/data/cities/mount-pocono.geojson`. Both apps use the same dataset and local data path.

---

# 3. Add the API Key

Inside `workshop-work/`, find:

```text
config.example.js
```

If it isn't in the starter folder, copy `config.example.js` from the **project root** into `workshop-work/`.

Make a **copy** of `config.example.js`, and rename the copy:

```text
config.js
```

When the instructor shares the temporary workshop API key, open `workshop-work/config.js` and replace the placeholder:

```js
window.APP_CONFIG = {
  arcgisApiKey: "PASTE_WORKSHOP_KEY_HERE",
};
```

**Important:**

- Keep the surrounding quotes and paste the key in place of `PASTE_WORKSHOP_KEY_HERE`.
- Do **not** paste the key directly into `main.js` or later `js/map.js`.
- Do **not** commit `config.js` or share your key in a public GitHub repository, screenshot, or chat.
- If you jump to a checkpoint later, **preserve your existing `config.js`** while copying the checkpoint files around it.

The workshop key is temporary. After workshop access ends, you'll need your own appropriate ArcGIS credentials to continue using secured services.

---

# 4. Start a Local Server

**Don't open the app by double-clicking `index.html` or using a `file://` URL.**

Use a local server because the app loads GeoJSON with `fetch()` and later uses JavaScript modules in the MapLibre Lab and optional refactoring lesson.

Start the server from the **project root** (the folder that contains `checkpoints/`, `workshop-site/`, and `workshop-work/`).

## Option A: VS Code Live Server

1. Open the **full project folder** in VS Code.
2. If needed, install the **Live Server** extension.
3. Right-click the **project-root `index.html`** and choose **Open with Live Server** (or use **Go Live**).
4. Take note of the local address and port that open in your browser.
5. Open the workshop instructions and working app using that same address and port.

For example, if Live Server uses `http://127.0.0.1:5500`, open:

```text
http://127.0.0.1:5500/workshop-site/
http://127.0.0.1:5500/workshop-work/
```

Your port might be different. Use the one Live Server gives you.

## Option B: Python

Open a terminal **in the project root** and run:

```bash
python -m http.server 8000
```

Or, if your computer uses `python3`:

```bash
python3 -m http.server 8000
```

Then open the workshop instructions:

```text
http://localhost:8000/workshop-site/
```

And your working app:

```text
http://localhost:8000/workshop-work/
```

Keep both pages open in separate browser tabs. The first contains the lesson instructions. The second is the app you're building.

**What should the starter app show?** It may display a simple page, but it should **not show a working map yet**. That's correct! We'll build the map in Step 01.

---

# 5. Check That You're Ready

Before Step 01, confirm:

- [ ] You've downloaded and **extracted** the workshop files (or cloned the repository).
- [ ] You've opened the **entire project folder** in your code editor.
- [ ] `workshop-work/` is at the project root, beside `checkpoints/`.
- [ ] `workshop-work/data/cities/mount-pocono.geojson` exists.
- [ ] `workshop-work/config.js` exists and contains the temporary workshop key supplied by the instructor.
- [ ] You're running a **local HTTP server from the project root**.
- [ ] Your workshop instructions open in the browser.
- [ ] `workshop-work/` opens in the browser.
- [ ] The starting app does **not** show a map yet.

**No map yet is correct.** We'll build it together in Step 01.

If your key hasn't been distributed yet, complete the other checks and return to the key step when the instructor provides it.

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

`07-complete` and `08-favorites` support the **optional refactoring and favorites** lessons. Keep these folder names. **Step 07 in the core workshop is the separate MapLibre Lab**, not `checkpoints/07-complete`.

The completed MapLibre example is in `labs/maplibre/`. Build your own version in a separate `maplibre-work/` folder. It does **not** replace your Leaflet app.

If you get stuck, compare your files with the checkpoint.

If you're falling behind:

1. Save a copy of any changes you want to keep.
2. Copy the finished checkpoint files into `workshop-work/`.
3. **Keep your existing `workshop-work/config.js`** and verify the local Mount Pocono GeoJSON is still there.
4. Reload your working app and continue with the group.

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

Open the **[Troubleshooting guide](#troubleshooting)** in the workshop sidebar, or look at `workshop-site/troubleshooting.md` in your project.

Start with:

```text
Browser Console
Network tab
file paths
map container height
config.js and API key permissions
checkpoint comparison
```

A few common fixes:

- **Page not found:** Check that the local server started from the project root and you're using the correct port.
- **Data not loading:** Check that `workshop-work/data/cities/mount-pocono.geojson` exists and that your URL capitalization matches.
- **ArcGIS basemap error:** Check `config.js`, the key's allowed services, expiration, and any referrer restrictions.
- **Blank map:** Check that the map container has a height and open the browser Console for errors.

The fastest recovery is often to switch to the checkpoint and keep moving.

---

# Start the Workshop

You're ready to build your City Explorer!

Continue to **Mapping Foundations and Library Choice** using the **Next** button below.

We'll introduce the mapping concepts and compare libraries before building the Leaflet map.
