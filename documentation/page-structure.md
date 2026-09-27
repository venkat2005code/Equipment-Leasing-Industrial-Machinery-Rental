# Page structure

Every page follows the same skeleton:

```html
<html lang="en" dir="ltr">
<head>  meta, canonical, Open Graph, Twitter, theme-init script, fonts, style.css, dark-mode.css, rtl.css, JSON-LD  </head>
<body data-nav="…">
  <a class="skip-link" href="#main">Skip to main content</a>
  <div data-component="header"></div>      ← injected by components.js
  <main id="main"> … sections … </main>
  <div data-component="footer"></div>      ← injected by components.js
  <script src="../assets/js/components.js"></script>           ← synchronous
  <script src="../assets/js/main.js" defer></script>
  <script src="../assets/js/forms.js" defer></script>
  <script src="../assets/js/<page>.js" defer></script>          ← only where needed
</body>
```
"Bare" layouts (`coming-soon`, `admin-dashboard`) set `data-layout="bare"` and omit the header/footer.

## Homepage decision flow (Home 1)
**Understand** hero → metrics → trusted-by → **Explore** services → industries → **Trust** why-us + live performance panel → how we work → case studies → careers → **Act** CTA band.

## Homepage decision flow (Home 2)
Split hero + follow-the-sun map → scorecard → capability matrix (table) → transformation roadmap (timeline) → case story → engagement models → security & continuity → testimonial + quick enquiry → CTA.

## Pages and their scripts
| Page | Scripts beyond `components/main/forms` |
|---|---|
| services, service-details, pricing | `services.js` |
| industries | `industries.js` |
| case-studies, case-study-details | `case-studies.js` |
| careers, job-details | `careers.js` |
| blog, blog-details | `blog.js` |
| admin-dashboard | `dashboard.js` |

## Query parameters
`?theme=dark|light`, `?dir=rtl|ltr`, `?simulate=error` (form error state), `?service=`, `?case=`, `?job=`, `?post=`, `?category=`, `?q=`, `?page=`, `?group=`, `?department=`, `?location=`, `?type=`, `?workflows=`, `?model=`, `?industry=`, `?tab=`.

## Heading rules
One `<h1>` per page. Sections use `<h2>`; cards and steps use `<h3>`. Footer titles are `<h2>`. Do not skip levels.
