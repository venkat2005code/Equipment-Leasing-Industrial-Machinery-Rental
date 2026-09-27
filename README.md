# Alturis — BPO Company Website Template

A complete, static, production-quality corporate website template for a **Business Process Outsourcing (BPO)** company.
Built with **HTML5, CSS3 (custom-property design system) and vanilla JavaScript (ES6+)** — no framework, no build step, no backend.

> **Everything is demo content.** "Alturis Global Services", its clients, people, case studies, testimonials, prices,
> metrics and job listings are fictional. Domains use the reserved `.example` TLD. Replace all of it before publishing.

Open `pages/index.html` in a browser — that is the whole installation.

---

## Contents

- [Features](#features)
- [Folder structure](#folder-structure)
- [Installation and running locally](#installation-and-running-locally)
- [Pages](#pages)
- [Customization](#customization)
- [Theme customization (light / dark)](#theme-customization-light--dark)
- [RTL usage](#rtl-usage)
- [Form integration](#form-integration)
- [SEO customization](#seo-customization)
- [Image replacement](#image-replacement)
- [JavaScript functionality](#javascript-functionality)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Browser support](#browser-support)
- [Design decisions and known limitations](#design-decisions-and-known-limitations)
- [Credits](#credits) · [License](#license)

---

## Features

**Two distinct homepages** — `index.html` (capability-led: hero with operations-floor illustration, metrics, services, industry tabs, why-us, process, case studies, careers, CTA) and `home-2.html` (global-operations-led: split hero with dot-map and live follow-the-sun clocks, scorecard, capability matrix, transformation timeline, case story, engagement models, security accordion, quick enquiry).

**22 pages** — About, Services, Service Details, Industries, Case Studies, Case Study Details, Careers, Job Details, Partnership, Pricing, Blog, Blog Details, Contact, Login, Register, optional Admin Dashboard, Privacy, Terms, 404 and Coming Soon.

**BPO-specific content and commercial models** — per agent / per hour / per transaction / per process / custom pricing (never Basic-Standard-Premium), SLAs, transition stages, quality assurance, security, workforce management, business continuity.

**Design system** — CSS custom properties for colour, type, spacing (4 px scale), radius, shadow and layout. Two font families (Source Serif 4 + IBM Plex Sans). Complete light and dark themes.

**Interactive components (all vanilla JS)** — mobile drawer, theme switch (system-aware, persisted), LTR/RTL switch, accordions, tabs (keyboard accessible), native `<dialog>` modals, toasts, reusable filter + search + sort + pagination + deep-link engine, animated counters, scroll reveal, share buttons, scroll-spy tables of contents, live delivery-centre clocks, launch countdown, pricing estimator, SVG dashboard charts.

**Forms** — one validation engine for every form: labels, required fields, inline errors, error summary, loading / success / error states, disabled-submit gating, file-upload validation, honeypot, `?query` prefill, and ready-to-use hooks for Formspree, Netlify Forms or a custom REST API.

**Original illustrations** — 55 SVG illustrations plus a PNG social image (operations floor, service scenes, team scenes, industry and article covers, portraits, dot-matrix world map). No stock photos; every image has explicit dimensions.

---

## Folder structure

```
bpo-company/
├── assets/
│   ├── css/
│   │   ├── style.css        Design tokens, base, layout, components, site chrome, page styles
│   │   ├── dark-mode.css    Dark theme tokens + refinements
│   │   └── rtl.css          Right-to-left refinements (layout mirrors via logical properties)
│   ├── js/
│   │   ├── components.js    Header, footer, mobile drawer, icon sprite, toast host  (edit nav/contact here)
│   │   ├── main.js          Theme, direction, drawer, accordions, tabs, modals, filters, counters, share…
│   │   ├── forms.js         Validation + submission for every <form data-form>
│   │   ├── services.js      Service-details renderer (?service=) and pricing estimator
│   │   ├── industries.js    "Example workflows" modal
│   │   ├── case-studies.js  Case-study details renderer (?case=)
│   │   ├── careers.js       Job-details renderer (?job=)
│   │   ├── blog.js          Blog-details renderer (?post=), TOC, reading progress, JSON-LD sync
│   │   └── dashboard.js     Demo dashboard charts (SVG)
│   ├── images/              SVG illustrations, logo, favicon, og-cover.png
│   └── fonts/               (empty — see README inside for self-hosting)
├── pages/                   22 HTML pages
├── documentation/           installation · customization · page-structure · credits · changelog · support
├── robots.txt
├── sitemap.xml
├── README.md
└── LICENSE
```

---

## Installation and running locally

**Simplest:** double-click `pages/index.html`. Everything works from `file://` — scripts are classic scripts (not ES modules), so
browsers do not block them.

**Recommended (for testing forms, fetch, canonical URLs):** serve the folder with any static server:

```bash
cd bpo-company
python3 -m http.server 8000      # then open http://localhost:8000/pages/index.html
# or:  npx serve .
```

Deploy by uploading the folder to any static host (Netlify, Vercel, GitHub Pages, S3, Nginx). No build required.

---

## Pages

| Page | File | Notes |
|---|---|---|
| Home 1 | `pages/index.html` | Capability-led corporate homepage |
| Home 2 | `pages/home-2.html` | Global operations / transformation homepage |
| About | `pages/about.html` | Mission, values, timeline, leadership, quality, security, testimonials |
| Services | `pages/services.html` | 3 core services + 12 filterable supporting capabilities, callback modal |
| Service details | `pages/service-details.html` | `?service=customer-support \| back-office \| data-management` |
| Industries | `pages/industries.html` | 10 industries, group filter, workflow modal; `?group=consumer`, `?workflows=travel` |
| Case studies | `pages/case-studies.html` | 6 demo case studies, industry filter + search |
| Case study details | `pages/case-study-details.html` | `?case=<slug>` |
| Careers | `pages/careers.html` | Filter by department / location / type, search, sort, pagination |
| Job details | `pages/job-details.html` | `?job=<slug>`, validated application form with resume upload |
| Partnership | `pages/partnership.html` | Enquiry workflow + multi-section form; `?model=per-hour&service=data-management` |
| Pricing | `pages/pricing.html` | 5 commercial models, comparison table, factors, estimator, quote modal |
| Blog | `pages/blog.html` | Search, topic chips, sort, pagination; `?category=customer-support&page=2` |
| Blog details | `pages/blog-details.html` | `?post=<slug>`, TOC, share, related, Article JSON-LD |
| Contact | `pages/contact.html` | Partnership enquiry form, LocalBusiness JSON-LD |
| Login / Register | `pages/login.html`, `register.html` | Demonstration only, no authentication backend |
| Admin dashboard | `pages/admin-dashboard.html` | **Optional demo**, `noindex`, not linked from primary navigation |
| Privacy / Terms | `pages/privacy.html`, `terms.html` | Placeholder legal text with scroll-spy TOC |
| 404 | `pages/404.html` | Themed "dead end" page |
| Coming soon | `pages/coming-soon.html` | Countdown + notify form (`data-launch` sets the date) |

The dashboard is intentionally **not** in the header, footer or sitemap. It is linked only from the login/register pages so
the public site never depends on it. Delete `admin-dashboard.html` and `dashboard.js` if you do not want it.

---

## Customization

1. **Brand name, contact details, navigation, social links** — edit the `SITE` object at the top of `assets/js/components.js`. The header and footer on every page update.
2. **Logo** — replace `assets/images/logo.svg`, `logo-mark.svg`, `favicon.svg`; also update the inline mark in `components.js` (`MARK`) and the pages that inline `logo-mark.svg` (login, register, coming soon, dashboard).
3. **Content** — pages are plain HTML; edit text directly. Data-driven pages keep their content in JSON blocks at the bottom of the page:
   - `service-details.html` → `#service-data`
   - `case-study-details.html` → `#case-data`
   - `job-details.html` → `#job-data`
   - `blog-details.html` → `#post-data`
   - `industries.html` → `#industry-data`
   Listing cards on the list pages are static HTML (good for SEO); keep a card and its JSON entry in sync by slug.
4. **Placeholder domain** — search-and-replace `https://www.alturis-bpo.example` (canonical, Open Graph, JSON-LD, sitemap, robots) and `partnerships@alturis-bpo.example` / `+1 (555) 014-2200`.
5. **Demo pricing and figures** — replace or remove every value labelled *demo* or *sample*. Do not publish fictional case studies, testimonials or metrics as real results.

## Theme customization (light / dark)

All colour lives in CSS custom properties.

- Light tokens: `:root { … }` at the top of `assets/css/style.css`.
- Dark tokens: `assets/css/dark-mode.css` — applied by `<html data-theme="dark">`. It is written twice: once for the attribute (set from `localStorage` or `prefers-color-scheme` by a tiny inline script in each page's `<head>`, so there is no flash) and once as a no-JS fallback media query.
- Key tokens: `--primary`, `--secondary`, `--accent`, `--bg`, `--surface`, `--card`, `--text`, `--muted`, `--border`, `--success/--warning/--error`, plus `--hero-from/--hero-to` (dark bands) and `--footer-bg`.
- Fonts: change `--font-display` and `--font-body`, and the `<link>` in each page head (or self-host — see `assets/fonts/README.md`).
- Spacing follows a 4 px scale (`--space-1` … `--space-24`); radii `--radius-*`; shadows `--shadow-*`.
- Test URLs: `?theme=dark`, `?theme=light`, `?dir=rtl` override the saved preference for that visit.

## RTL usage

Click the direction toggle in the header, or open any page with `?dir=rtl`. The choice is saved in `localStorage` (`bpo-dir`).
`style.css` uses CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`, `border-start-end-radius`…)
so nearly everything mirrors automatically; `rtl.css` handles the rest (directional icons via `.icon-dir`, the drawer, Arabic/Hebrew font stacks, number direction).

For a real Arabic or Hebrew site: translate the content, set `<html lang="ar" dir="rtl">` server-side or in the page template, and keep
`.ltr` on phone numbers and emails. The demo toggle only flips direction — it does not translate English text.

## Form integration

Every form is `<form data-form="…">` and handled by `assets/js/forms.js`. **With no endpoint, forms run in demo mode** (validate → loading state → simulated success; add `?simulate=error` to preview the error state). To go live, add one attribute:

```html
<!-- Formspree -->
<form data-form="contact" data-endpoint="https://formspree.io/f/YOUR_FORM_ID">

<!-- Netlify Forms -->
<form data-form="contact" name="contact" data-endpoint="/">
  <input type="hidden" name="form-name" value="contact">

<!-- Custom REST API (receives multipart/form-data via POST) -->
<form data-form="contact" data-endpoint="https://api.your-domain.com/v1/enquiries">
```

Other attributes: `data-loading-label`, `data-success-text`, `data-summary` (show an error summary), `data-disable-until-valid`, `data-prefill` (fill fields from `?name=value`), `data-method`.
Field rules are attributes on the inputs: `required`, `type=email|tel|url|date`, `minlength`, `data-business` (rejects free-mail domains), `data-strong` (password rule), `data-match="#other"`, `data-min-today`, and on files `data-accept="pdf,doc,docx"` + `data-max-mb="5"`.
Each form includes a `_gotcha` honeypot. File uploads need server support (Formspree paid plans, Netlify, or your API).

## SEO customization

- Every page has a unique `<title>` (≤ 60 chars) and meta description (≈ 150–165 chars), canonical URL, Open Graph, Twitter Card and robots meta. Edit them in each page's `<head>`.
- Structured data: `Organization` + `WebSite` (home), `BreadcrumbList` (all inner pages), `ItemList` (services), `Service` (service details), `Article` (blog details), `LocalBusiness` (contact), `Blog` (blog). The `Service`, `Article` and `BreadcrumbList` blocks update automatically when a detail page loads a different `?param`. **Replace the fictional company details in `LocalBusiness` and `Organization` with your real data, or remove the blocks.**
- `robots.txt` and `sitemap.xml` are in the root — update the domain. `404`, `login`, `register`, `coming-soon` and `admin-dashboard` are `noindex`.
- Social image: `assets/images/og-cover.png` (1200×630). Replace with your own.
- Detail pages (`?service=`, `?case=`, `?job=`, `?post=`) are rendered by JavaScript from JSON. Search engines that execute JavaScript index them; for maximum SEO on a production site, publish one static page per item (copy the page, hard-code the content) and add each to the sitemap.

## Image replacement

Illustrations are SVG (tiny, resolution-independent, theme-friendly), so WebP conversion is unnecessary. To swap in photography, keep the same filename or update the `src`; keep `width`/`height` attributes to prevent layout shift; use `loading="lazy"` below the fold and `fetchpriority="high"` on the hero image. Service illustrations carry `.media-light` so they dim slightly in dark mode.

## JavaScript functionality

| File | Provides |
|---|---|
| `components.js` | Header / footer / drawer / icon sprite (90 icons) / toast host. Runs synchronously so chrome exists before first paint. |
| `main.js` | `window.BPO` API: `toast()`, `openModal()`, `filterable()`, `enhance()`, `setHead()`; theme, direction, drawer focus-trap, accordions, tabs, share, counters, reveal, clocks, countdown |
| `forms.js` | Validation and submission (see above) |
| `services.js` `industries.js` `case-studies.js` `careers.js` `blog.js` | Page-specific renderers and behaviour |
| `dashboard.js` | SVG charts with hover/focus tooltips, table-view twins, period filter |

**Filter engine markup** (`data-filterable` container): `[data-filter-search]`, `[data-filter-group="key"]` chips, `[data-filter-select="key"]`, `[data-filter-sort]`, items `[data-item data-key="value"]`, `[data-filter-status]`, `[data-filter-empty]`, `[data-pagination]`, `data-page-size`. State syncs to the URL for deep linking.

No `console.log` calls, no third-party libraries. Scripts are classic (non-module) so the template also runs from `file://`.

## Accessibility

Targeting **WCAG 2.1 AA**: semantic landmarks, one `<h1>` per page and no skipped heading levels, skip link, visible focus rings, keyboard-operable tabs/accordions/modals/drawer (focus trap, Esc), labelled form controls with `aria-invalid`/`aria-describedby` errors and live status regions, `prefers-reduced-motion` support, 44 × 44 px minimum touch targets, `<caption>`s and stacked responsive tables, chart table-view alternatives, colour never the sole carrier of meaning. Contrast was audited programmatically in both themes.

## Performance

Vanilla CSS/JS (no frameworks), lazy-loaded below-the-fold images with explicit dimensions, SVG art, non-blocking font loading (`media=print` swap) with metric-friendly fallbacks, reserved header/footer space to avoid layout shift, `IntersectionObserver` for reveal/counters, a typical page ships ≈ 37 KB of gzipped CSS + JS (`style.css` 17 KB, `dark-mode.css` 1 KB, `rtl.css` 1 KB, `components.js` 6 KB, `main.js` 8 KB, `forms.js` 4 KB) plus 1–7 KB for page-specific scripts; HTML pages are 20–40 KB before compression. Self-host the fonts for best results.

## Browser support

Current versions of Chrome, Edge, Safari (15.4+ for `<dialog>`), and Firefox. Uses `color-mix()`, `:has()` (scroll lock only), logical properties, `inert`, and `<dialog>`. Older browsers degrade to static content.

## Design decisions and known limitations

- **No Tailwind/Bootstrap.** The brief allowed either; a hand-written token-based design system was chosen so the site runs with no build step or CDN runtime, and so dark mode and RTL are first-class. Utility-class frameworks can be added on top if you prefer them.
- **Shared header/footer are injected by JavaScript** (single source of truth without a build step). Without JavaScript, pages show content and a `<noscript>` fallback but no header/footer.
- **Google Fonts are loaded from Google's CDN** (with system fallbacks). Self-host to avoid the third-party request.
- **Detail pages are query-driven** (see SEO note). Listing pages are fully static.
- **RTL demo does not translate text**; English content is mirrored only.
- **Forms are demo-mode until you add an endpoint.** Nothing is transmitted.
- **Fictional data** everywhere — including the `LocalBusiness`/`Organization` structured data.
- Social links point to platform home pages as placeholders.

## Credits

See `documentation/credits.md`. Fonts: Source Serif 4 and IBM Plex Sans (SIL Open Font License) via Google Fonts. Icons and illustrations are original to this template.

## License

MIT — see `LICENSE`.
