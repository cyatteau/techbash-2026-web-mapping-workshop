# 06 - Styling, Performance, and Usability

At this checkpoint:

- Historic places load from local GeoJSON over the existing basemap.
- The map and sidebar share selection and category filtering.
- Marker fill colors correspond to categories.
- Selection changes marker size, outline, and fill, and marks the matching card.
- Selecting another place restores the previous marker's category style.
- Circle markers use Leaflet's Canvas renderer.
- Filtering uses the data already in state; it does not fetch the dataset again.
- Loading, error, and empty-result messages are handled.
- The category filter stays disabled until data loads successfully.
- Sidebar buttons and the filter have visible keyboard focus.
- Selection movement respects the user's reduced-motion preference.
- The layout stacks on screens 760px wide or narrower.
- Application logic is still in main.js.

These replacement files belong inside the existing checkpoints/06-polish folder.
Keep its data folder and configuration files. To recover into workshop-work,
copy index.html, styles.css, and main.js while keeping your own config.js and data.

Continue to the required **07 - MapLibre Lab**. Refactoring and Favorites are optional.
