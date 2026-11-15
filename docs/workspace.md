# Workspace and timer components (0.3.0)

Opt-in CSS primitives, available through the existing component entry point.

- `fu-workspace`: fixed viewport workspace; use header, body and optional footer children. The hidden attribute hides the entire workspace or its descendants. Consumers manage focus, navigation and modal/background interaction.
- `fu-split-layout` and `fu-split-layout--1-2`: independent scroll panes using `fu-split-layout__pane`. Below 768 CSS pixels, set the inactive pane's data-active attribute to false; at larger widths both panes are visible.
- `fu-tabs fu-tabs--split`: responsive pane buttons. Consumers manage selection, accessible state and keyboard interaction.
- `fu-progress`: native progress element with accessible label.
- `fu-timer-bar`, `fu-timer`, `fu-timer__name`, `fu-timer__value`: timer presentation; data-state="expired" marks an expired timer. Hide the workspace footer when no timers need attention.
- `fu-duration-picker`: layout for labelled minute and second inputs inside the existing dialog.

The cooking showcase is simulated. No shared timer engine, alarm, persistence, wake lock, synchronization or recipe service is included. Consumers implement and test those behaviors independently. Existing selectors remain unchanged; adoption is optional.
