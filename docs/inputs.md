# Numeric inputs and disclosures

Import CSS as usual and helpers from `@redstergs/family-ui/inputs`. Render into a consumer-owned container, then call `bindInputs(container)` and `bindDisclosures(container)` once per rendered DOM. No backend or domain state is included. Use unique IDs.

- NumberInput (numberInput): editable text with numeric/decimal mobile keyboard, comma or dot decimal separator, selection on focus, explicit plus/minus, keyboard arrows, press-and-hold, optional presets. No wheel-based value changes. Options: id, label, value, min, max, step, integer, disabled.
- QuantityInput (quantityInput): same options, nonnegative by default, optional fixed unit or selectable units. Read selected unit from the select; step is configured by the consumer, not automatically converted when changing units.
- DurationInput (durationInput): seconds input/output, modes minutes, hm, ms, hms. Minutes or seconds paired with a larger unit are bounded 0–59. Modes without seconds display whole minutes. Optional presets are seconds. Labels can be localized.
- numberValue and durationValue return null for invalid input. Native input/change events are the integration contract; consumers validate before saving. Do not persist invalid values.
- DisclosureButton (disclosureButton): target ID and label supplied by consumer; initial target hidden state must match expanded. DisclosureSection (disclosureSection): full-row button, trusted body HTML. Wrap sections in data-fu-accordion for mutually exclusive opening. Both use aria-expanded/aria-controls, native keyboard operation and 180 ms rotation respecting reduced motion.
- Navigation remains chevron-right and decorative inside ActionListItem. Disclosure uses chevron-down when closed, rotated to chevron-up when open. Existing actionMenu from /dialogs uses ellipsis-vertical and retains its existing consumer-owned interaction contract.

Preview: select “Eingaben & aufklappbare Inhalte” in the component catalog. Themes and responsive widths can be changed independently.
