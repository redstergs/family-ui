# MetricGroup / MetricItem

Presentation-only CSS components, imported through the existing Family UI stylesheet.
Use a native description list with one div per term/value pair. An optional primary item comes first; other items reflow according to available container width. No card wrapper is required.

```html
<dl class="fu-metric-group">
  <div class="fu-metric-item fu-metric-item--primary">
    <dt class="fu-metric-item__label">Energy</dt>
    <dd class="fu-metric-item__value">584 <span class="fu-metric-item__unit">kcal</span></dd>
  </div>
  <div class="fu-metric-item">
    <dt class="fu-metric-item__label">Protein</dt>
    <dd class="fu-metric-item__value">24 <span class="fu-metric-item__unit">g</span></dd>
  </div>
  <div class="fu-metric-item" data-state="unknown">
    <dt class="fu-metric-item__label">Fat</dt>
    <dd class="fu-metric-item__value">— <span class="fu-metric-item__status">Not available</span></dd>
  </div>
</dl>
```

The consumer supplies localized values, units, labels and optional visible status text. Supported states are unknown, success, warning and error; omit state for neutral presentation. Unknown is not zero; an actual zero must remain visible. Do not rely on color alone. Escape any untrusted text using the consumer framework's normal text rendering. No calculation, rounding, persistence or API calls are performed by Family UI. The component is additive and needs no migration for existing consumers.
