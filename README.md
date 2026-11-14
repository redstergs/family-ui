# Family UI

Shared, framework-independent design foundations for four independent family applications:

- **Family Food** — meal planning and recipes
- **Family Door** — access and door control
- **Family MCP** — personal integrations and administration
- **Family Workout** — training

**Julia's English Quest is intentionally excluded.** This repository contains *presentation only*: no accounts, database, shared application state, access policy, door-control commands or domain business logic.

## Status

Initial development foundation **0.1.0**. No existing application imports this package yet. Themes and examples are proposals to validate before rollout. This is not a stable 1.0 release.

## Get started

```sh
npm install
npm run dev
npm run build
npm test
```

The Vite playground is a standalone demo. All interactions are simulated locally; no backend calls or physical door actions exist.

## Architecture

- `src/tokens/`: semantic CSS custom properties for foundation, colors, sizes, and themes.
- `src/components/`: framework-independent CSS building blocks.
- `src/index.css`: stable CSS entry point.
- `playground/`: TypeScript and HTML sample UI (not a production app).
- `docs/`: design rules, accessibility, integration and release guidelines.
- `tests/`: dependency-light token and contrast checks.

Four applications remain independent at runtime and adopt **pinned releases** when integrations are approved. No runtime CDN or central service.

## Principles

1. Mobile first: bottom navigation on phone, side navigation on tablet / desktop; actual breakpoints require testing in each app.
2. Clear typography, restrained surfaces, minimal nesting and visible status.
3. Large 148px circular `PrimaryAction` for a single prominent action, modeled after Family Door; **visual only** here. Safety checks and the real ten-second door-latch confirmation stay inside Family Door.
4. Visible form labels and errors, keyboard focus, touch targets and reduced-motion support.
5. Contrast targets: 4.5:1 normal text, 3:1 large text and essential graphical controls.

## Integration

See [docs/integration.md](docs/integration.md). Do not make direct changes to Food, Door, MCP or Workout as part of this foundation commit.
