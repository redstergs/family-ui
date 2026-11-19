# Family UI

Shared, framework-independent design foundations for four independent family applications:

- **Family Food** — meal planning and recipes
- **Family Door** — access and door control
- **Family MCP** — personal integrations and administration
- **Family Workout** — training

Other applications are outside the current scope. Family UI contains presentation only: no accounts, databases, shared application state, access policy, door-control commands or domain business logic.

## Status

**Version 0.3.0 — workspace components.** The workspace design has been accepted and the pre-release automated tests have passed. This is a pre-1.0 library, not a promise of permanent API stability. Existing consumers upgrade independently; the revision does not automatically migrate any application.

- [Live component showcase](https://redstergs.github.io/family-ui/)
- [GitHub releases](https://github.com/redstergs/family-ui/releases)
- [Changelog](CHANGELOG.md)
- [Integration contract](docs/integration.md)
- [Migration to 0.2.0](docs/migration-0.2.md)
- [Workspace components](docs/workspace.md)
- [Layout and component contracts](docs/layout-revision.md)

## Get started

Use Node.js 22.

```sh
npm install
npm run dev
npm run check
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:browser
```

On Linux, the CI environment uses Ubuntu 24.04 LTS. On other supported systems, use the appropriate Playwright browser installation instructions. Browser tests run against the built site. The Vite playground is a standalone demo; all interactions are simulated locally and no backend calls or physical door actions exist.

Open the component catalog to switch among four themes, Light and Dark modes, and responsive preview widths. The existing example pages remain available.

## Components

| Area | Building blocks |
| --- | --- |
| Foundation | Semantic color, typography, spacing, sizing, focus and surface tokens |
| Layout | AppShell, PageLayout (default/narrow/wide), PageHeader, Section, Toolbar, DetailView |
| Lists | ActionList navigation and native checkbox selection, revised/compact/aligned variants, optional media and separate actions |
| Cards | Panel/Card, interactive and compact variants, CardGrid, optional HeroCard |
| Planning | PeriodNavigator, native Table, interactive cells and contained scrolling |
| Workspace | Full-screen workspace, responsive split layout, pane controls, progress, timer presentation |
| Feedback | StatusBadge, EmptyState, Banner, Dialog, Toast |
| Controls | Existing buttons, fields, navigation and PrimaryAction |

New composition and list styling is opt-in where documented; existing CSS entry points and selectors remain available.

## Architecture

- `src/tokens/`: semantic CSS custom properties, foundations and four application themes.
- `src/components/`: framework-independent CSS building blocks.
- `src/index.css`: shared CSS entry point; token-only and component-only exports are also available.
- `playground/`: simulated TypeScript and HTML showcase.
- `docs/`: design, accessibility, integration and migration guidance.
- `tests/`: static contracts, token/contrast checks and Chromium browser tests.

Applications adopt pinned versions at build time. No runtime CDN, shared service or central application backend is required.

## Principles

1. Mobile first: bottom navigation on phones, side navigation on larger screens; check breakpoints in each consumer.
2. Clear typography, restrained surfaces, minimal nesting, consistent alignment and visible interaction targets in their resting state.
3. Prefer native semantic elements; never nest interactive controls. Provide visible labels, keyboard focus, touch targets and reduced-motion support.
4. Images are optional. Reflow content instead of shrinking it; contain wide table scrolling.
5. Contrast targets: 4.5:1 normal text and 3:1 large text and essential graphical controls. Automated checks complement, but do not replace, manual accessibility review.
6. The 148px circular PrimaryAction is visual only. Safety checks and the ten-second door-latch confirmation remain inside Family Door.

## Development and releases

Small teams may commit directly to `main`. GitHub Actions installs dependencies, runs TypeScript and static tests, builds the site, and runs Chromium tests on Ubuntu 24.04. GitHub Pages is deployed only after a successful build job. The current workflow creates the GitHub release `v0.3.0` once after successful deployment; subsequent releases require explicit version/release workflow updates. Existing releases must not be moved or overwritten.

A showcase deployment does not update any consumer. See [integration.md](docs/integration.md) for the adoption process.

## Voting and comments

Reusable voting and comment buttons with SVG icons, selected/disabled/saving states and an interactive catalog section “Abstimmung & Kommentare”. See [docs/reactions.md](docs/reactions.md). Consumer integration and persistence remain separate.

## Guided workflows

ProcessStepper, WorkflowHeader, TaskList, ProgressChecklist, WorkflowSummary and ChatGPT handoff. See [workflow contracts](docs/workflows.md) and the local interactive catalog. No consumer workflow logic is included.


## Contextual editing dialogs

See [dialog components](docs/dialogs.md) for generic contextual actions, native dialogs, participant, weekday and slot selection, and conflict decisions.

## Numeric inputs and disclosures

NumberInput, QuantityInput, DurationInput, DisclosureButton and DisclosureSection, plus the vertical action-menu convention. See [input contracts](docs/inputs.md) and the interactive catalog “Eingaben & aufklappbare Inhalte”.

## 0.4.0

Shared action and account menus, text disclosures, responsive section actions and ProcessStepper preview integration. See [integration](docs/integration.md) for bindings and migration.

## Adaptive input and navigation (unreleased)

Opt-in adaptive steps, repeat policies, duration carry and corrections, period jumps and bulk selection. Existing fixed-step and duration picker contracts remain available. See [adaptive input integration](docs/adaptive-inputs.md).

### Responsive navigation overflow

Opt-in: import `bindNavigationOverflow` from `./src/navigation`. Pass the navigation element containing `button[data-page]` and options `{icon: familyIcon("ellipsis"), label: "Mehr", compactQuery, itemWidth}`. The application owns navigation and sets `aria-current="page"`, then dispatches `nav-active-change` on the navigation element. Call the returned cleanup when unmounting. Existing navigation remains unchanged unless bound.

## MetricGroup (EP5G2)

Generic metric groups, primary and secondary values, units and visible states. See [metric contracts](docs/metrics.md).
