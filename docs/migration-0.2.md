# Migration to 0.2.0

Pin the GitHub release tag `v0.2.0` only after the release exists and CI passes. Keep the existing build-time CSS imports. No shared runtime or new application dependency is needed; Playwright is a development-only dependency.

1. Upgrade the pinned Family UI source; retain the previous pin as rollback.
2. Apply `fu-page-layout--revised` to opt into revised spacing and optional `fu-page-layout--narrow`/`--wide` widths. Existing markup remains supported.
3. Use `fu-toolbar fu-toolbar--content` for page controls; keep app-header toolbar unchanged.
4. Add `fu-action-list--revised`, optionally `fu-action-list--compact` and `fu-action-list--aligned`. Use native buttons/links or label/checkbox; never nest interactive controls. Disabled links require application-side activation prevention.
5. Reuse `fu-panel` with optional interactive or compact modifiers; add `fu-card-grid`, `fu-hero-card`, `fu-status--badge`, `fu-empty-state`, `fu-period-navigator`, and native `fu-table` only where useful.
6. Keep meal planning, date calculations, routing and other domain logic in the consumer. For mobile planning, prefer an app-specific daily view; wide tables may scroll inside a labelled region.
7. Verify contrast, focus, both themes, mobile and desktop, long content, keyboard operation, and application-specific regression tests before deploying. Roll back the pin and opt-in markup together if needed.

No consumer has been migrated by this release. See [layout revision](layout-revision.md) for detailed component contracts.
