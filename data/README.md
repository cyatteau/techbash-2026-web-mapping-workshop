# City Explorer Workshop Data

The TechBash 2026 workshop uses curated local GeoJSON snapshots of historic places.

## Prepared cities

- Mount Pocono and surrounding Monroe County, Pennsylvania (shared workshop dataset)
- Chicago
- Seattle
- Washington, DC

## Common schema

Every workshop feature stores the app fields inside `properties`:

- `id`
- `name`
- `category`
- `description`
- Point geometry in WGS84 longitude/latitude coordinates

Some datasets also preserve useful source fields such as address, architect, construction date, designation date, status, or source ID.

## Workshop categories

The source datasets use different schemas, so the workshop files normalize features into these shared categories:

- Culture & Community
- Education & Religion
- Civic & Institutional
- Commercial & Industrial
- Residential

These categories are workshop classifications and are not necessarily official classifications from the source agencies.

## Sources

### Mount Pocono and Monroe County

Source dataset: **National Park Service Cultural Resources GIS, National Register of Historic Places**.

- [NPS GIS service](https://mapservices.nps.gov/arcgis/rest/services/cultural_resources/nrhp_locations/MapServer)
- [NPS National Register spatial data documentation](https://www.nps.gov/orgs/1094/nrhp_spatialdata.htm)
- Source layers: **0 (points)** and **1 (polygons)**.
- Retrieved: **October 5, 2026**.
- Prepared file: **cities/mount-pocono.geojson**.
- Features: **21 listed historic properties**.
- Coverage: Mount Pocono and surrounding Monroe County, not only Mount Pocono Borough.

The selection used Pennsylvania records whose county contains Monroe and whose status is Listed:

```sql
UPPER(State) IN ('PA','PENNSYLVANIA')
AND UPPER(County) LIKE '%MONROE%'
AND STATUS = 'Listed'
```

Eighteen features retain their original NPS point coordinates. Three source polygons use calculated interior points. These markers represent a property or district area rather than an entrance or its full boundary.

IDs use `mp-` plus the source National Register reference number. The same stable value is stored in top-level `id` and `properties.id`; the app uses `properties.id` for selection and favorites.

The first feature is:

```json
{
  "type": "Feature",
  "properties": {
    "id": "mp-97000287",
    "name": "Pocono Manor Historic District",
    "category": "Culture & Community",
    "description": "National Register historic district. Source locality: Mt. Pocono, Monroe County, Pennsylvania. Listing recorded April 1997. Map marker represents the listed property area."
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

The file also preserves source names, register IDs, locality, listing date, status, source object ID, source layer, record links, and geometry method. Its top-level `metadata` describes the source and preparation choices.

The source listing dates contain year and month without a day. `listedDate` preserves `YYYY-MM`, and `listedDatePrecision` is `month`. Construction years and architects were not inferred.

The source's extant status is Unknown. These historic-register records do not establish current property condition or public access. Keep this distinction when writing descriptions for the app.

Workshop category counts are:

| Category | Places |
| --- | ---: |
| Culture & Community | 2 |
| Education & Religion | 4 |
| Civic & Institutional | 2 |
| Commercial & Industrial | 8 |
| Residential | 5 |
| **Total** | **21** |

These are workshop classifications, not official NPS category fields. Farms and agricultural structures are grouped under Commercial & Industrial.

### Chicago

Source dataset: **Individual Landmarks**

The workshop file was curated from Chicago's official individual landmarks data. Original landmark geometries used in the workshop were converted to representative points when necessary.

### Seattle

Source dataset: **Landmarks**

The source data used EPSG:2926 coordinates. The workshop file reprojects those coordinates to WGS84 / EPSG:4326 so they can be used directly as standard GeoJSON in Leaflet.

### Washington, DC

Source dataset: **Historic Landmarks Points**

The workshop file was curated from the official historic landmarks point dataset.

## Data preparation

Raw source downloads should be stored in:

`data/raw/`

Normalized workshop-ready datasets should be stored in:

`data/cities/`

The workshop-ready files are:

- `mount-pocono.geojson` (default for TechBash)
- `chicago.geojson`
- `seattle.geojson`
- `washington-dc.geojson`

The required app should load these local snapshots rather than query live data services for its historic places during the session. The optional Feature Layer extension demonstrates live hosted data separately.

## File placement and paths

Keep the shared dataset in `data/cities/mount-pocono.geojson` at the project root. The starter, checkpoints, and extension apps also need their own local copy under `data/cities/`, so an app can be copied into a working folder without losing its data.

For the root app or an app with a local data copy, use:

```js
dataUrl: "./data/cities/mount-pocono.geojson",
```

Set the shared Leaflet city configuration to:

```js
"mount-pocono": {
  name: "Mount Pocono",
  center: [41.1220, -75.3646],
  zoom: 12,
  dataUrl: "./data/cities/mount-pocono.geojson",
},
```

Then use `const CITY = "mount-pocono";`.

Leaflet's `center` uses latitude, longitude. GeoJSON and MapLibre positions use longitude, latitude. Do not reverse the GeoJSON file's coordinates.

`fetch()` paths resolve relative to the HTML page, including when called by a module in `js/`. Check the app's Network panel if a data request returns `404`.

The local GeoJSON makes the historic-place data predictable. CDN libraries, basemaps, and geocoding still depend on network access unless you build a separate offline setup.
