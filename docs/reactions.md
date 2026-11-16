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
