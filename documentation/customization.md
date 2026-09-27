# Customization

## Design tokens
All tokens live at the top of `assets/css/style.css` (`:root`). Change `--primary`, `--secondary`, `--accent` to re-brand. Dark-theme equivalents are in `assets/css/dark-mode.css` — re-check contrast if you change colours (text ≥ 4.5:1, large text/UI ≥ 3:1).

| Group | Tokens |
|---|---|
| Colour | `--primary`, `--primary-hover`, `--primary-soft`, `--secondary`, `--accent`, `--bg`, `--surface`, `--card`, `--text`, `--muted`, `--border`, `--success`, `--warning`, `--error` |
| Text-safe variants | `--primary-text`, `--secondary-text` (used for coloured text so it passes contrast on both themes) |
| Dark bands | `--hero-from`, `--hero-to`, `--on-dark`, `--on-dark-muted`, `--footer-bg` |
| Type | `--font-display`, `--font-body`, `--fs-xs … --fs-5xl` |
| Space | `--space-1 … --space-24` (4 px scale) |
| Shape | `--radius-sm/--radius/--radius-lg/--radius-pill`, `--shadow-sm/--shadow/--shadow-lg` |
| Layout | `--container`, `--gutter`, `--header-h` |

`.on-dark` / `.section--dark` re-map the text, border and card tokens locally, so components inside a dark band restyle themselves.

## Reusable components (class names)
Buttons `.btn--primary|accent|outline|light|outline-light|ghost` (+ `--lg|--sm|--block`), `.badge--teal|amber|success|demo`, `.chip`, `.card` (+ `--hover`, `.card__media/__body/__foot`), `.icon-tile`, `.checklist`, `.tabs`, `.accordion`/`.acc-item`, `<dialog class="modal">`, `.table` (+ `--stack` for responsive stacking; add `data-label` to cells), `.pagination`, `.breadcrumb`, `.timeline` (+ `--alt`), `.steps`, `.stepper`, `.quote`, `.stat`, `.cta-band`, `.form`/`.field`/`.input`/`.select`/`.textarea`/`.check`/`.file-drop`, `.alert--success|error|info`, `.toast`.

## Adding a page
Copy any page in `pages/`. Keep the `<head>` pattern (theme init script, fonts, three stylesheets), the skip link, `<div data-component="header">`, `<main id="main">`, `<div data-component="footer">`, and the script tags. Set `<body data-nav="services">` to highlight the matching nav item. Give it a unique title and description and add it to `sitemap.xml`.

## Adding items to data-driven pages
1. Add a card to the list page (e.g. a `<article … data-item …>` in `careers.html`) with `data-*` attributes for each filter.
2. Add the matching entry (same slug) to the JSON block on the details page.

## Navigation and footer
`assets/js/components.js` → `SITE.nav` for the primary menu; the footer link lists are in the `footer()` function.

## Animation
Motion is limited to hover states, accordion/modal/toast transitions and scroll reveal. All of it is disabled by `prefers-reduced-motion`. Remove `data-reveal` attributes to switch off scroll reveal on an element.
