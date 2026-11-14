# Content composition primitives

All four primitives are **CSS + semantic HTML**, with no framework, runtime dependencies, router, database or business behavior. Import `src/index.css`.

## PageLayout

Use `fu-page-layout` as a page content region, with `fu-page-layout__inner` for a responsive max-width and side padding. Optional `__header`, `__eyebrow`, `__title`, `__intro`. The app owns its global navigation; do not nest a second `main` landmark.

```html
<main class="fu-page-layout">
  <div class="fu-page-layout__inner">
    <header class="fu-page-layout__header">
      <p class="fu-page-layout__eyebrow">Family Food</p>
      <h1 class="fu-page-layout__title">Rezepte</h1>
      <p class="fu-page-layout__intro">Alle Familienrezepte.</p>
    </header>
    <!-- sections -->
  </div>
</main>
```

## Section

A frameless content section, with a heading and an optional right-side action. Add a panel/card only when the content needs it.

```html
<section class="fu-section" aria-labelledby="recent-recipes">
  <div class="fu-section__header">
    <div><h2 class="fu-section__title" id="recent-recipes">Zuletzt gekocht</h2>
      <p class="fu-section__description">Gespeicherte Rezepte</p></div>
  </div>
  <div class="fu-section__body">...</div>
</section>
```

## ActionListItem

Use one native `button` for a command or one `a href` for navigation. **The entire row is one interactive target.** Do not nest buttons/links or place a separately actionable checkbox inside it.

Slots (all optional except title):
- `fu-action-list-item__media`: **leading icon, illustration, cover image, photo, or thumbnail**; absent when no media. Default 48×48 px, optional `--wide` 64×48; `--plain` removes background. The SVG/img is decorative if the title contains its meaning: `aria-hidden="true"` or empty `alt`.
- `__body` with `__title` and optional `__meta`.
- `__status`: e.g. text badge, date, state.
- `__chevron`: decorative arrow; use `aria-hidden="true"`.

```html
<div class="fu-action-list">
  <div class="fu-action-list__item">
    <a class="fu-action-list-item" href="/recipes/123">
      <span class="fu-action-list-item__media" aria-hidden="true"><!-- SVG icon --></span>
      <span class="fu-action-list-item__body">
        <span class="fu-action-list-item__title">Champignon-Tagliatelle</span>
        <span class="fu-action-list-item__meta">30 Minuten · 3 Personen</span>
      </span>
      <span class="fu-action-list-item__status">Favorit</span>
      <span class="fu-action-list-item__chevron" aria-hidden="true">›</span>
    </a>
  </div>
</div>
```

For a photograph, replace the icon content with `<img src="..." alt="">`; provide meaningful alt text only if it conveys essential information not stated in the title. If you include a meaningful image, do not hide the wrapper from accessibility APIs.

## DetailView

An in-page detail structure, not a modal. Optional `__back`, `__header`, `__title`, `__meta`, `__summary`, `__actions`, and `__body`. Use normal headings, lists, and nested `Section` as appropriate. The host app handles selecting the item, back navigation, saving, and permissions.

```html
<article class="fu-detail-view" aria-labelledby="recipe-title">
  <a class="fu-detail-view__back" href="/recipes">← Rezepte</a>
  <header class="fu-detail-view__header">
    <h1 class="fu-detail-view__title" id="recipe-title">Champignon-Tagliatelle</h1>
    <div class="fu-detail-view__meta"><span>30 Minuten</span><span>3 Personen</span></div>
    <p class="fu-detail-view__summary">Rezeptbeschreibung.</p>
  </header>
  <div class="fu-detail-view__body">
    <section class="fu-section" aria-labelledby="ingredients-title">
      <h2 class="fu-section__title" id="ingredients-title">Zutaten</h2>
      <!-- content -->
    </section>
  </div>
</article>
```

The playground includes a clickable list with an SVG icon and an illustrative preview, plus a simulated detail view and back behavior. Both light/dark themes and different viewport sizes use the same classes.
