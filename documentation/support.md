# Support

## Common questions
**Nothing shows in the header/footer.** They are injected by `assets/js/components.js`. Check that the script tag is present and that JavaScript is enabled.

**Forms "succeed" but I receive nothing.** Forms run in demo mode until you add `data-endpoint`. See README → Form integration.

**Detail page shows the default item.** The `?service=`, `?case=`, `?job=` or `?post=` value must match a key in the page's JSON block.

**Fonts look different offline.** They load from Google Fonts; offline the system fallbacks are used. Self-host fonts for consistent rendering.

**Dark mode flashes on load.** Keep the small inline theme-init `<script>` in each page's `<head>` above the stylesheets.

**RTL text looks odd.** The demo toggle mirrors the layout but does not translate English. Provide Arabic/Hebrew content and set `lang` accordingly.

**Modal does not open in an old browser.** Native `<dialog>` requires Safari 15.4+, Chrome 37+, Firefox 98+.

## Testing checklist before launch
- Replace placeholder domain, contact data, structured data, prices and demo content.
- Connect and test every form (including file upload) and the newsletter field.
- Re-run contrast checks if you change colours; test dark mode and RTL.
- Validate JSON-LD (Google Rich Results Test) and check `sitemap.xml`.
- Test at 320, 375, 768, 1024, 1280 and 1920 px, with keyboard only and with a screen reader.

## Getting help
Open an issue in the repository where you obtained the template, or contact the seller/maintainer listed in your purchase or download page.
