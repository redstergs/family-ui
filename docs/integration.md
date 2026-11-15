# Integration and release contract

Family UI is **build-time-only**. No cross-product runtime scripts, shared services, identities, access policies or data sources. Framework choices remain with each application.

## Distribution and versioning

- The current library version is **0.2.0**. Use the GitHub release tag `v0.2.0` once it exists; never consume floating `main` in a production build.
- The GitHub repository is public, but the package remains marked `private: true` to prevent accidental npm registry publication. No npm registry release is required.
- Each consumer pins a release or exact commit in its existing build-time dependency mechanism and records the resolved revision in its lockfile or equivalent manifest.
- For consumers using npm, an example is `npm install github:redstergs/family-ui#v0.2.0`. Existing vendoring/build mechanisms may be retained if they pin the same release and preserve the CSS import structure.
- Import `@redstergs/family-ui` for the complete stylesheet; `@redstergs/family-ui/tokens` and `@redstergs/family-ui/components` are available separately. When using only the components entry point, ensure foundation/theme tokens are also loaded.
- Build the CSS into the consumer's own assets. Do not load styles from the live showcase or a mutable remote URL.

## Consumer integration

1. Inventory the current UI, its pinned Family UI version (if any), local overrides and domain-specific controls.
2. Upgrade the pin and keep the previous revision available for rollback.
3. Set `data-fu-theme` to `food`, `mcp`, `workout` or `door` and `data-fu-mode` to `light` or `dark` on the same `.fu-app` root.
4. Adopt revised layout, toolbar and ActionList modifiers intentionally; reuse existing Panel/Card and other primitives. See [migration-0.2.md](migration-0.2.md) and [layout-revision.md](layout-revision.md).
   For optional workspace components, see [workspace.md](workspace.md). Timer behavior and wake locks remain consumer responsibilities.
5. Keep application data, permissions, routing, date calculations, validation, confirmation and persistence in the consuming application.
6. Test mobile and desktop layouts, Light and Dark modes, long content, keyboard operation, contrast, disabled/selected states and application-specific regressions. Shared CI does not certify every consumer or full WCAG compliance.
7. Deploy the consumer independently after its own checks. If required, roll back the dependency pin and related markup together.

## Release workflow

Development may proceed directly on `main`. GitHub Actions runs on every push and supports manual dispatch. It uses Node.js 22 on Ubuntu 24.04, performs TypeScript checks, static tests, production build and Chromium browser tests before publishing the showcase to GitHub Pages.

The current release job creates `v0.2.0` only once and only after successful build and deployment. It does not overwrite existing releases. For future versions, update the package version, changelog, migration notes and release-job version condition deliberately. Use SemVer and document breaking changes explicitly.

The [public showcase](https://redstergs.github.io/family-ui/) tracks successful deployments from `main`; it is not an immutable release artifact and is not the consumer dependency source. Library deployment never triggers a consumer migration.

## Adoption order

The next coordinated layout migration is Family Food, followed by Family MCP, Family Workout and Family Door. Individual applications may already have adopted earlier versions; verify their actual dependency pins rather than assuming their integration status.

| Application | Scope |
| --- | --- |
| Family Food | Page layout, daily overview, weekly planning, recipes, shopping list and selection flows; preserve meal-planning logic |
| Family MCP | Administrative frontend only; do not change OAuth, worker routes, sync or D1 |
| Family Workout | Training UI and reports; thin framework wrappers are permitted without imposing a shared framework |
| Family Door | Carefully validate ergonomics and existing safety-critical flow; retain authorization, confirmation and door-control behavior |

Each migration is a separate application change, with its own acceptance and deployment.

## Security and scope

The repository and showcase must contain simulated data only: no personal data, secrets, real identities, tokens or live door controls. Do not publish other Family repositories merely because Family UI is public. Family Door authorization and the ten-second latch confirmation remain application responsibilities. No consumer migration or new runtime dependency is implied by the library release.
