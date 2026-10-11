# Optional - Add Favorites

This optional checkpoint extends the modular Leaflet City Explorer with
favorite-place state and controls. The required workshop proceeds from Step 06
to the separate MapLibre lab.

## At this checkpoint

- The Mount Pocono app loads 21 historic places from local GeoJSON.
- Category colors, yellow selection, and category-style restoration remain.
- The map and sidebar share selection and category filtering.
- Circle markers use Canvas, and selection respects reduced motion.
- The filter stays disabled during loading and after a failed data request.
- Selected cards and keyboard focus have separate visible styling.
- Selecting a place enables the Save Favorite button.
- Favorites have star indicators and survive category filtering.
- Favorite IDs live in memory. Reloading clears them.

## Check your work

- [ ] Select two places from different categories. The previous marker resets.
- [ ] Save a favorite, filter it out, then return to All categories. Its star remains.
- [ ] Remove a favorite. Its star disappears and the button label updates.
- [ ] Filtering clears selection and disables the favorite button until another place is selected.
- [ ] Verify keyboard focus, narrow-screen layout, and reduced-motion selection.
- [ ] Confirm loading and failed requests cannot be overwritten by the filter.

Continue with optional customization or extensions. Keep the existing
`08-favorites` folder name.
