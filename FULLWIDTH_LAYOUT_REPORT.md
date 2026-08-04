# Full-Width Layout Correction Report — v5.1

## Problem found in v5.0

The previous package used `--max: 1220px` for header, content, and footer. On wide monitors—especially when the browser zoom was set to 80%—the website occupied only the center portion of the screen and left large blank margins.

## Correction

- Replaced fixed centered containers with fluid containers and responsive gutters.
- Homepage hero now uses the entire viewport width.
- Inner page heroes use a full-width split composition.
- Page sections keep safe left/right gutters but no restrictive maximum width.
- Large screens receive additional grid columns.
- Mobile uses a separate layout rule set.

## Responsive behavior

### Desktop

- Split hero: text left, product visual right.
- Product visual reaches the right edge of the viewport.
- Eight category icons fit across the bottom homepage rail.
- Four-column category index on wide screens.

### Mobile

- Compact fixed header with hamburger menu.
- Two-column hero composition.
- Product image cropped intentionally for visual impact.
- Category icons arranged in two ordered rows.
- Inner page heroes stack text and image vertically.

## Files changed

- `src/assets/css/styles.css`
- `package.json`
- Documentation and QA references
