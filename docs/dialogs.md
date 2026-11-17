# Contextual editing dialogs

Additive CSS and optional framework-independent TypeScript markup helpers, exported via `@redstergs/family-ui/dialogs`. Import the existing root stylesheet. The helpers return markup; framework consumers may instead use the same CSS classes and native HTML semantics.

- `actionMenu(id,label,items)`: disclosure button with aria-expanded/controls, action buttons with data-fu-action. Consumer toggles hidden, handles Escape/outside click and returns focus.
- `personSelector(label,people)`: native checkboxes, whole row clickable, supports empty selections and disabled people.
- `weekDaySelector(props)`: seven supplied day descriptors, data-fu-day, data-fu-week navigation (-1 or 1), aria-pressed, aria-current=date, original marker. Caller calculates weeks, locale, bounds and selection.
- `slotSelector(label,slots,freeLabel)`: data-fu-slot, selected/occupied/disabled independent; occupied data is not a validation rule.
- `contextItem(item)`, `conflictActions(items)`: compact context and configurable decisions.
- `structuredDialog(props)`: existing native dialog with scrollable body, stationary footer and mobile safe area. Call showModal(), handle close/returnValue and restore focus. Confirm is optional; cancel is native. For destructive confirmation set danger only when appropriate.

All types are exported from src/dialogs.ts. Labels and IDs are escaped; body is trusted markup and must not contain unsanitized HTML. Supply trusted image URLs. No persistence, API, workflow or domain logic. The consumer owns draft state, date calculations, validity and effects. Use a single modal at a time and preserve focus when updating selectors. All themes inherit existing tokens.

The catalog section “Mahlzeiten bearbeiten” uses fictional data, supports navigation, empty participant selection, moving to free or occupied slots, swap, replace, skip and cancellation. Changing catalog viewport/theme reloads the example as with existing catalog sections.
