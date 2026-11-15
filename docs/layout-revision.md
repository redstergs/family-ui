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

## Phase 2 — component contracts

- ActionList: add `fu-action-list--revised` to the existing list. Optional `--compact` and `--aligned` modifiers use the full prefixes shown in the showcase. Use an explicit aria-hidden media placeholder only when alignment is desired. Navigation uses a native button or link; selection uses a label with native checkbox. Separate secondary buttons are siblings, never nested. For disabled navigation prefer native disabled buttons; aria-disabled links require application-side activation prevention.
- Cards: extend `fu-panel` with `fu-panel--interactive` or `fu-panel--compact`. Use native buttons or links for interactive cards, not nested controls. Optional media, title, meta and footer. CardGrid uses `--fu-card-min` and media can override `--fu-card-aspect`.
- HeroCard: optional context, title, description, actions and media; no mandatory image.
- Status: extend existing `fu-status` with badge, neutral, info or pending modifiers; textual labels always identify meaning. EmptyState has regular, compact and error treatments.
- PeriodNavigator: presentational markup only. Applications own locale, date calculations and navigation. Showcase demonstrates Monday-based weeks, previous/next, today and date input.
- Tables: native table semantics with a labelled, keyboard-focusable scroll region when necessary; identifier width configurable via `--fu-table-identifier-width`. Interactive cells contain native buttons or links. Mobile domain-specific layouts remain the application's responsibility.

## Design principles

Use typography and spacing for hierarchy. Prioritize content over empty administrative blocks. Separate titles and metadata. Avoid redundant navigation buttons and excessive framing. Make interaction targets visible in their resting state. Images are optional. Reflow rather than shrink layouts; use contained scrolling for genuinely wide tables. Test both modes and all themes. No live data or application logic in the showcase.

Phase 2 adds static contract tests; browser interaction and accessibility validation remain required. Existing selectors are retained and consumers are not automatically migrated.
