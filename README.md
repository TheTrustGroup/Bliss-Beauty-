# Bliss Beauty Plus

Static site for Bliss Beauty Plus — vegan and cruelty-free beauty in East Legon, Accra.

## Stack

- Static HTML/CSS/JS
- Build: Node (custom script: data-driven shop/blog, manual nav/footer inlining for index/about/gallery)
- Deploy: serve the `dist/` folder from any static host

## Commands

```bash
# Install dependencies
npm install

# Build (generates dist/)
npm run build
```

After `npm run build`:

- **dist/** contains the full site: index, about, gallery (with nav/footer inlined), shop and blog (generated from `data/*.json`), plus `css/` and `js/`.
- Deploy the contents of `dist/` to your host (Netlify, Vercel, Cloudflare Pages, or any static server). Set the publish directory to `dist` and, if needed, build command to `npm run build`.

## Project layout

| Path | Purpose |
|------|--------|
| **index.html** | Homepage (Hero, Ticker, About, Products, Values, Testimonials, Contact, Map). Uses `<include>` for nav/footer. |
| **about/index.html** | About page. Uses `<include>` for nav/footer. |
| **gallery/index.html** | Gallery (masonry + Instagram). Uses `<include>`. |
| **partials/nav.html** | Global nav (root-relative links). Single source of truth. |
| **partials/footer.html** | Global footer. Single source of truth. |
| **data/products.json** | Product list. Add/edit entries; rebuild to regenerate `dist/shop/`. |
| **data/posts.json** | Blog posts. Add/edit entries; rebuild to regenerate `dist/blog/`. |
| **build.js** | Build script: generates shop + blog from data, runs PostHTML on index/about/gallery, copies css/js to dist. |
| **css/main.css** | Shared styles (tokens, nav, footer, utilities, skip-link, data-page active state). |
| **js/main.js** | Shared behaviour (cursor, nav scroll, mobile menu, reveal, form → WhatsApp, reduced-motion). |

## Adding content

- **New product:** Add an object to `data/products.json` (slug, name, category, categorySlug, price, shortDesc, longDesc, tags, imgClass, waMessage). Run `npm run build`.
- **New blog post:** Add an object to `data/posts.json` (slug, title, category, date, dateShort, excerpt, body, related). Run `npm run build`.

## Environment

- **SITE_URL** (optional): Set when building to override canonical and OG URLs (default `https://blissbeautyplus.com`). Example: `SITE_URL=https://blissbeautyplus.com npm run build`.

## Accessibility

- Skip link to main content on every page.
- Custom cursor disabled when `prefers-reduced-motion: reduce`.
- Nav/footer use semantic HTML and ARIA where needed; hamburger/close are `<button>` with `aria-label`.
- Newsletter form has a visible or visually-hidden label and `aria-label` on the form.
