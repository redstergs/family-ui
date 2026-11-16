# Voting and comments

Use `.fu-reactions` for the row, `.fu-vote` for the grouped voting buttons and `.fu-reaction` for every button. All targets are at least 44 × 44 px and use the current theme/mode tokens. Icons are decorative SVGs; icon-only buttons require accessible labels.

```html
<div class="fu-reactions">
  <div class="fu-vote" role="group" aria-label="Abstimmung">
    <button type="button" class="fu-reaction" aria-label="Zustimmen" aria-pressed="true">
      <!-- decorative thumbs-up SVG -->
      <span class="fu-reaction__selected" aria-hidden="true">✓</span>
    </button>
    <button type="button" class="fu-reaction" aria-label="Ablehnen" aria-pressed="false">
      <!-- decorative thumbs-down SVG -->
      <span class="fu-reaction__selected" aria-hidden="true">✓</span>
    </button>
  </div>
  <button type="button" class="fu-reaction" aria-label="3 Kommentare öffnen">
    <!-- decorative message-circle SVG -->
    <span class="fu-reaction__count" aria-hidden="true">3</span>
  </button>
</div>
```

Selection uses `aria-pressed`, a thicker border and a visible check mark; keep the accessible button name stable. Only one vote can be selected. The preview permits withdrawing the current vote; consumers decide whether withdrawal is allowed. Use native `disabled` for unavailable actions. While saving, disable both voting buttons, set `aria-busy="true"` on the group and provide a visible status such as “Stimme wird gespeichert …”. On failure restore the previous selection and announce an actionable error.

Hide the count when there are no comments; keep the comment button available if permitted. A dialog needs an accessible heading, keyboard dismissal and focus restoration to its trigger. Preview comments are fixed demonstration content, not a shared comment service.

Show participation as “1 von 3 abgestimmt”, not the number of approvals. Permissions, counts, network requests, error recovery and persistence belong to the consuming app. The catalog has interactive voting, a comments dialog, selected, disabled and saving examples at all preview widths and in all themes/modes. See `playground/reactions.ts` for demo markup and handlers.

## Meal ratings and `utensils-off`

`familyIcon('utensils-off')` renders upright fork and knife side by side with a top-left to bottom-right slash, using the existing 24px viewBox, 2px round strokes and `currentColor`. Like all icons it is decorative (`aria-hidden`); label its button “Hab ich nicht gegessen”.

Use the existing `.fu-vote` group (accessible name “Mahlzeitenbewertung”) for three mutually exclusive toggle buttons: “Hat geschmeckt”, “Nicht mein Fall”, “Hab ich nicht gegessen”. Add `.fu-reaction--neutral` to the last button and retain `.fu-reaction__selected` for the visible check mark. Its selected state uses neutral surface/text/border tokens, never danger or accent colors. Existing focus, disabled and busy behavior remains available.

Keep the comment button outside the selection group in `.fu-reactions`, with no `aria-pressed`. It remains available regardless of the selected rating; comments are always optional. The preview allows changing or clearing the selection and opening/dismissing comments without changing it. “Not eaten” is a participation state, not a negative taste rating. Storage, aggregation and backend semantics belong to Family Food, not Family UI.
