# Adaptive input and navigation (additive)
All options are opt-in. Existing markup, package exports, fixed steps, duration formats and consumer state remain supported. No changes to domain persistence or calendar calculations.

## Numeric input
Import from @redstergs/family-ui/inputs. NumberInput accepts stepPolicy: [{from:0,step:0.5},{from:10,step:1},{from:50,step:5},{from:100,step:10}]. QuantityInput also accepts unitPolicies (map keyed by the exact unit string); selecting a unit selects its profile without converting quantities. Fixed step is the fallback below the first band or when no profile exists. Crossing a band stops at its boundary; downward stepping at the boundary uses the lower band. Direct entry is never snapped to a step grid. Consumers own precision and domain validation.
repeatPolicy accepts a list of {afterMs,intervalMs} bands, false to disable, or the exported adaptiveRepeat profile (400/200, 1500/100, 3000/50 ms). Omitted policy retains the original 400/85 ms repeat. Only numeric controls repeat, never confirmation or safety-critical actions. Release, cancellation, blur, document visibility change, detachment or bounds stop repetition. Call returned cleanup on unmount; rebinding the same root cleans up prior listeners.

## Duration
DurationInput accepts carry:true to step across minute/hour boundaries; partSteps to configure the step in each field; repeatPolicy; minSeconds/maxSeconds; pasteTime:true for colon-delimited full durations; adjustments:[{seconds:300,label:"+5 min"}] for relative corrections. Formats without seconds have minute resolution. Bounds are checked by durationValue and applied to whole-duration adjustments. Use carry together with bounds for buttons to enforce total limits. The existing DurationPicker CSS remains supported; use DurationInput for new editing dialogs. Timer state, alarms, relative extension of running timers and persistence remain consumer-owned. No automatic countdown behavior is added.

## Period navigation
PeriodNavigator retains its CSS contract; add explicit multi-period buttons using the existing step class and consumer-defined period deltas, with accessible labels. WeekDaySelector accepts jumps:{periods,previousLabel,nextLabel,previousDisabled?,nextDisabled?}, todayLabel and dateJump:{label,value?,min?,max?}. Handle data-fu-week (signed delta), data-fu-week-today and data-fu-week-date (change) in the consumer. No automatic calendar acceleration.

## Bulk selection
Import selectionControls and bindSelectionControls from @redstergs/family-ui/selection. Render controls outside the explicitly identified checkbox group with targetId, allLabel, optional clearLabel and invertLabel. Only enabled checkboxes inside the group are affected, and changed items emit native input/change. All checkbox displays an indeterminate state for partial selection. Use separate groups for group-specific selection, no implicit selection of hidden pages or server-side data. Keep application permissions and selection state in the consumer.

## Integration
Opt into each feature individually; existing applications can retain fixed steps and legacy controls. Test thresholds in both directions, direct decimal input, unit changes, time carry, bounds, disabled controls, keyboard and touch, and actual persistence separately. See interactive catalog “Eingaben & aufklappbare Inhalte” and “Tabellen & Zeitraum”.

## Compact PeriodNavigator
Import `createPeriodNavigator(kind)` and `periodLabel(kind, first, last)` from `/period`. The factory returns live native controls for consumer wiring. Calendar opens a native date field and attempts the browser picker; if unavailable the field remains usable. Month selection accepts any date in the month, normalized by the consumer. Current-period button is hidden by the consumer when already current. No wheel navigation, auto-repeat or domain date arithmetic. Set bounds and disabled states in the application. Use NumberInput / QuantityInput / DurationInput for numeric values, not a page-specific wheel.
