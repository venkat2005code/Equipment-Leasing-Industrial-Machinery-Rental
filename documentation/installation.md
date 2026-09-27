# Installation

## Requirements
A modern browser. Nothing else — there is no build step, package manager or backend.

## Run it
- **Quick look:** open `pages/index.html` (works from `file://`).
- **Local server (recommended):**
  ```bash
  cd bpo-company
  python3 -m http.server 8000
  ```
  Then open <http://localhost:8000/pages/index.html>. Any static server works (`npx serve`, VS Code Live Server, Nginx, Apache).

## Deploy
Upload the whole folder to a static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CDN). Keep the `assets/` and `pages/` folders side by side — pages reference `../assets/…`.
If you want the site at the domain root, add a redirect or copy `pages/index.html` to the root and adjust the relative `../assets/` paths to `assets/`.

## After installing
1. Replace `https://www.alturis-bpo.example` everywhere (canonical, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`).
2. Edit brand, phone, email, address, navigation and social links in `assets/js/components.js` (`SITE`).
3. Connect forms (see README → Form integration).
4. Replace demo content, prices, case studies, testimonials, team, jobs and blog posts.
5. Delete pages you do not need (and their entries in `sitemap.xml`, the footer and `components.js`). The admin dashboard is optional.
6. Self-host fonts (see `assets/fonts/README.md`).
