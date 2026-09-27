# Fonts

The template uses two families:

| Role | Family | Licence |
|---|---|---|
| Headings, large numerals | **Source Serif 4** (500, 600, 700) | SIL Open Font License 1.1 |
| Body, UI | **IBM Plex Sans** (400, 500, 600) | SIL Open Font License 1.1 |

By default they are loaded from Google Fonts with `font-display: swap` and system fallbacks, so the site still renders offline.

## Self-hosting (recommended for privacy and speed)

1. Download the families from Google Fonts (or `@fontsource/source-serif-4` and `@fontsource/ibm-plex-sans`) as `.woff2`, Latin subset.
2. Put the files in this folder, e.g. `source-serif-4-600.woff2`.
3. Add to the top of `assets/css/style.css`:

```css
@font-face {
  font-family: "Source Serif 4"; font-weight: 600; font-style: normal; font-display: swap;
  src: url("../fonts/source-serif-4-600.woff2") format("woff2");
}
/* repeat per weight: Source Serif 4 500/700, IBM Plex Sans 400/500/600 */
```

4. Remove the three Google Fonts lines (`preconnect` ×2 and the stylesheet `<link>` + `<noscript>`) from each page's `<head>`.
5. Optionally preload the two most-used files: `<link rel="preload" href="../assets/fonts/source-serif-4-700.woff2" as="font" type="font/woff2" crossorigin>`.

For Arabic / Hebrew, add a suitable family (e.g. IBM Plex Sans Arabic, Noto Naskh Arabic) and reference it in `assets/css/rtl.css`.
