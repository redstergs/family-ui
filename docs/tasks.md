# Unified tasks — Family UI (feature branch)

This opt-in feature extends the existing `.fu-task-list` from guided workflows. The existing informational `.fu-action-list-item` markup is unchanged. Import the complete stylesheet and `@redstergs/family-ui/tasks` (or the source module while developing).

## Contracts

| Part | Markup / API | Owner |
| --- | --- | --- |
| TaskList | `section.fu-task-list.fu-task-list--unified`; `fu-task-list__heading`, `fu-task-list__count`, `ul.fu-task-list__items` | Consumer supplies heading, count, loading/error/empty states, retry callback and optional toggle |
| TaskItem | `createTaskItem(task, handlers)` builds `li.fu-task-item` with a full-width button, metadata, icon, status, indicator | Consumer supplies text and trusted icon |
| ExpandableTaskItem | `interaction:"inline"`, `content:HTMLElement` | Consumer supplies live forms, validation, save behavior and error feedback |
| TaskGroup | `.fu-task-group`, `.fu-task-group__heading`, `.fu-task-group__body` with nested lists | Consumer determines grouping and counts |
| Refresh | `reconcileTaskItems(ul, tasks, handlers)` | Consumer owns stable IDs and ordering |
| Collapsible wrappers | `bindTaskDisclosures(root)` for `.fu-task-list__toggle` / `.fu-task-group__toggle` | Consumer chooses initial `hidden` and `aria-expanded` |

`TaskDefinition`: `id`, `title`, optional `meta`, `status`, `icon` (trusted SVG), `person`, `count`, `state` (`default|urgent|blocked|loading|error`), `disabled`, `interaction` (`navigation|inline|dialog|action|information`), `content` (live element for inline forms). Handlers: `onNavigate(id)`, `onDialog(id)`, `onAction(id)`. A click **never** completes a task. A consumer removes a task after its own successful persistence.

### Family Food integration example (illustrative only)

```ts
import "@redstergs/family-ui";
import {reconcileTaskItems, type TaskDefinition} from "@redstergs/family-ui/tasks";
const items = document.querySelector<HTMLElement>("#food-open-tasks")!;
const waistForm = document.querySelector<HTMLElement>("#waist-form")!; // live form with fields and save handler
const taskList: TaskDefinition[] = [
  {id:"barbara:2026-11-26:closing", title:"Tagesabschluss", meta:"26.11.2026", person:"Barbara",
   interaction:"navigation", icon:calendarSvg},
  {id:"philipp:2026-W48:waist", title:"Bauchumfang erfassen", meta:"Wöchentliche Messung",
   interaction:"inline", content:waistForm}
];
const handlers = {onNavigate:(id:string)=>router.openTask(id)};
reconcileTaskItems(items,taskList,handlers);
// Later, after a successful save from Family Food:
reconcileTaskItems(items,taskList.filter(t=>t.id!=="philipp:2026-W48:waist"),handlers);
```

The surrounding app renders `<section class="fu-task-list fu-task-list--unified"><div class="fu-task-list__heading"><h2>Offene Aufgaben</h2><span class="fu-task-list__count">2</span></div><ul id="food-open-tasks" class="fu-task-list__items"></ul></section>`. The example uses a consumer-provided `calendarSvg` and router, not library APIs.

## Guarantees and constraints

- Reconciliation reuses the same `li` for an unchanged ID and interaction; it updates text, optional icon and states in-place and preserves the inline form element, expansion, focus and unsaved values. Do not regenerate the form for every poll. Keep each item in the same group while editing; moving it across lists can require consumer-specific focus handling.
- Changing interaction type replaces that row. Keep IDs unique within each list, do not use array indexes as IDs, and never supply untrusted HTML as `icon`.
- The library does not fetch, filter, sort, group or persist. Counts and empty/loading/error UI, retry callbacks, completion detection, permissions, due dates and application dialogs are owned by the consumer.
- The app must provide accessible titles for optional live status messages and native labels for forms. Controls inside the inline body are siblings of the row button, never nested inside it.
- UI uses the existing `--fu-space-*`, `--fu-font-*`, `--fu-border`, `--fu-divider`, `--fu-surface-hover`, `--fu-surface-selected`, `--fu-focus`, `--fu-warning`, `--fu-danger` tokens. Light/dark follow existing themes. No new design tokens.
- `bindTaskDisclosures` returns a cleanup callback for consumer teardown. Native inline task buttons manage their own open state. Optional list/group toggle buttons need matching `aria-controls`, `aria-expanded` and `hidden` content, with unique IDs.

## Release / verification

The implementation is proposed for the next release after 0.5.0 and is **not yet a released version**. Consumers must not pin an unissued release. Run `npm run check && npm test && npm run build && npm run test:browser` on Node 22. Check 320/390/768/1280px and all four themes, light/dark modes, keyboard tab/enter/space, focus preservation, duplicate IDs and long labels. Family Food requires its own integration PR after Family UI is released.
