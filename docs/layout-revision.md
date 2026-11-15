# Layout revision — phase 1

Family UI remains presentation-only and framework-independent. Flow is inspiration, not a dependency. Existing CSS selectors and tokens remain available.

## Inventory
Existing: app shell, page layout, section, toolbar, panel, list, navigation and selection ActionListItem, detail view, controls, status, banner, dialog, toast. Improved in phase 1: semantic tokens, dark focus, opt-in page composition and content toolbar. Phase 2: ActionList refinements, panel variants, card grid, empty state, table, period navigator, optional hero. Consumer-specific data and routing stay outside this package.

## Revised layout
Use `fu-page-layout fu-page-layout--revised` with `fu-page-layout__inner`. Add `fu-page-layout--narrow` (720px) or `fu-page-layout--wide` (1600px); default remains 1100px. The inner grid owns spacing between direct children. Use the existing header with `fu-page-layout__heading` and `fu-page-layout__actions`; section headers remain `fu-section__header`. Use `fu-toolbar fu-toolbar--content` for page tools; optionally add `fu-toolbar--compact`; `fu-toolbar__field--grow` enables flexible search. Legacy header toolbar and page markup remain supported.

## Showcase
Open the catalog from the example-page playground. Choose theme, mode, viewport and category. Preview uses an iframe so CSS media queries respond to its actual width; widths larger than the host are constrained. Existing example pages remain available. Phase 2 expands individual component states. Keyboard focus and hover can be exercised directly in the preview.

## Validation
Run `npm test`, `npm run check`, `npm run build`. Inspect 320/390/768/1280px and short landscape in both modes and all themes; verify no clipped content, focus visibility and text/control contrast. Static tests do not establish browser or WCAG conformance. No consumer migration or release in phase 1.
