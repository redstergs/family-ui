# Guided workflows

Presentation-only HTML/CSS. Import the existing Family UI stylesheet; no runtime dependency. All labels, states, counts, dates, permissions, navigation and actions are supplied by the consumer. The playground is not an API contract.

| Component | Markup / contract |
| --- | --- |
| ProcessStepper | nav.fu-process-stepper with accessible name, ol > li > button.fu-process-stepper__step; data-state completed/current/upcoming/blocked; aria-current="step" only on the true current step; data-viewed=true and aria-pressed=true for the reviewed step. Native disabled controls navigation. Include visible status text and optional task count within .fu-process-stepper__label. |
| WorkflowHeader | header.fu-workflow-header; headings, .fu-workflow-status, optional .fu-workflow-meta and .fu-workflow-actions. Supply next action or waiting reason. |
| TaskList | section.fu-task-list; reuse .fu-action-list__group and ul.fu-action-list; li.fu-action-list-item.fu-action-list-item--informational with body, status, optional metadata/action. No checkbox or clickable noninteractive row. Optional details/summary for completed groups. |
| ProgressChecklist | section.fu-progress-checklist with optional labelled native progress.fu-progress, ul > li.fu-progress-checklist__item, .fu-progress-checklist__line; status and optional count, progress and remediation button. Omit numeric elements if unavailable. |
| WorkflowSummary | article.fu-panel.fu-workflow-summary; title, phase, optional period, progress, counts, deadline, next action and button. |
| ChatGPT handoff | section.fu-workflow-handoff; title/icon, description, optional details with prompt, copy button and live result. Consumer supplies prompt and clipboard behavior. |

Status element: .fu-workflow-status with data-state action-required, waiting, blocked, in-progress, completed, open, fulfilled, warning or optional. Supply readable text, not color alone. Use existing semantic tokens. All optional data may be omitted. Consumer computes overall progress and completion, distinguishes optional criteria from blockers, and owns focus restoration and action handling.

Example:

```html
<nav class="fu-process-stepper" aria-label="Process">
  <p>Step 2 of 3</p>
  <ol>
    <li><button type="button" class="fu-process-stepper__step" data-state="completed" data-viewed="true" aria-pressed="true">Setup · Complete</button></li>
    <li><button type="button" class="fu-process-stepper__step" data-state="current" data-viewed="false" aria-current="step" aria-pressed="false">Review · Current</button></li>
    <li><button type="button" class="fu-process-stepper__step" data-state="blocked" disabled>Finish · Blocked</button></li>
  </ol>
</nav>
```

Mobile: step list stacks vertically; at 768px it becomes horizontal. Maintain visible status and labels, native buttons, keyboard focus and minimum 44px targets. Use native progress with accessible name and valid value/max. Use native dialog with labelled heading for confirmation. Do not nest interactive controls. No automatic routing or business transitions in CSS. See playground/workflow.ts for complete composition and simulated state.

### Compact navigation

At widths below 768px, consumers may opt into the compact navigation by supplying a button `.fu-process-stepper__toggle` with `aria-expanded` / `aria-controls` and an identified list with `data-expanded="false"` or `true`. In collapsed mode the current and viewed phase remain visible; the toggle label should identify the number of completed phases. Consumers manage expansion and focus. Without those attributes the original list remains visible. Desktop always displays all phases.

The catalog includes a separate examples section for all five components, optional metadata, non-numeric progress and status variants. The weekly simulation includes cancelable explicit release, role-specific tasks and repeat voting. A rejected or changed vote affects only the corresponding meal's simulated vote.
