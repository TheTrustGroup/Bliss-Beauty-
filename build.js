/**
 * Bliss Beauty Plus — static site build.
 * 1. Generate shop/ and blog/ from data/*.json (nav/footer inlined from partials).
 * 2. Inline nav/footer into index, about, gallery (replace <include> tags) → dist.
 * 3. Copy css, js to dist.
 * Run: node build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'dist');
const SITE_URL = process.env.SITE_URL || 'https://blissbeautyplus.com';

const waPath = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function write(file, content) {
  const out = path.join(DIST, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content, 'utf8');
}

function metaTags({ title, description, canonical, ogImage }) {
  const desc = description || title;
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const img = ogImage ? `${SITE_URL}${ogImage}` : `${SITE_URL}/og-default.png`;
  return [
    `<meta name="description" content="${escapeHtml(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${img}">`,
    `<meta property="og:type" content="website">`,
  ].join('\n  ');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildShop(nav, footer) {
  const products = JSON.parse(read('data/products.json'));
  const productDetailStyles = read('shop/premium-moisturiser.html').match(/<style>[\s\S]*?<\/style>/)[0];

  products.forEach((p, i) => {
    const tagsHtml = p.tags.map(t => {
      const cls = t === 'New' || t === 'Bestseller' ? 'new' : t === 'Vegan' ? 'vegan' : '';
      return `<span class="product-tag ${cls}">${escapeHtml(t)}</span>`;
    }).join('\n            ');
    const badgeHtml = p.tags.map(t =>
      `<span class="badge"><span class="badge-dot"></span>${escapeHtml(t)}</span>`
    ).join('\n          ');

    const waHref = 'https://wa.me/233552394434?text=' + encodeURIComponent(p.waMessage);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(p.name)} — Bliss Beauty Plus</title>
  ${metaTags({
    title: `${p.name} — Bliss Beauty Plus`,
    description: p.shortDesc,
    canonical: `/shop/${p.slug}/`,
  })}
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/css/main.css"/>
  ${productDetailStyles}
</head>
<body data-page="shop">
  <a href="#main" class="skip-link">Skip to main content</a>
  <a class="wa-float" href="https://wa.me/233552394434" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="white"><path d="${waPath}"/></svg></a>
  ${nav}
  <main id="main" class="section product-detail">
    <div class="product-detail-grid">
      <div class="product-detail-image">
        <nav class="breadcrumb reveal"><a href="/">Home</a> / <a href="/shop/">Shop</a> / ${escapeHtml(p.name)}</nav>
        <div class="img-wrap reveal" style="background:linear-gradient(135deg,#F2E5D8,#E8C8B8,#C4826A);"></div>
      </div>
      <div>
        <div class="product-detail-meta reveal">
          <div class="product-category">${escapeHtml(p.category)}</div>
          <h1 class="product-detail-title">${escapeHtml(p.name)}</h1>
          <div class="product-detail-price">GH₵ ${escapeHtml(p.price)}</div>
        </div>
        <p class="product-detail-desc reveal reveal-delay-1">${escapeHtml(p.longDesc)}</p>
        <div class="product-detail-tags reveal reveal-delay-2">${badgeHtml}</div>
        <div class="reveal reveal-delay-3">
          <a href="${waHref}" class="wa-order-btn" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="${waPath}"/></svg>
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  </main>
  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;
    write(`shop/${p.slug}.html`, html);
  });

  // Shop index (grid)
  const shopIndexStyles = read('shop/index.html').match(/<style>[\s\S]*?<\/style>/)[0];
  const cardHtml = products.map((p, i) => {
    const tagsInner = p.tags.map(t => {
      const cls = t === 'Vegan' ? 'vegan' : (t === 'New' || t === 'Bestseller') ? 'new' : '';
      return `<span class="product-tag ${cls}">${escapeHtml(t)}</span>`;
    }).join('');
    const tagsWrap = tagsInner ? `<div class="product-tags">${tagsInner}</div>` : '<div class="product-tags"></div>';
    return `<article class="product-card reveal ${i > 0 ? 'reveal-delay-' + Math.min(i, 3) : ''}" data-category="${escapeHtml(p.categorySlug)}">
        <a href="/shop/${p.slug}/">
          <div class="product-img">
            <div class="product-img-bg ${p.imgClass}"></div>
            ${tagsWrap}
          </div>
          <div class="product-info">
            <div class="product-category">${escapeHtml(p.category)}</div>
            <h2 class="product-name">${escapeHtml(p.name)}</h2>
            <p class="product-desc">${escapeHtml(p.shortDesc)}</p>
            <div class="product-price">GH₵ ${escapeHtml(p.price)}</div>
          </div>
        </a>
      </article>`;
  }).join('\n      ');

  const shopIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Shop — Bliss Beauty Plus</title>
  ${metaTags({ title: 'Shop — Bliss Beauty Plus', description: 'Curated vegan and cruelty-free beauty. Filter by category or explore everything.', canonical: '/shop/' })}
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/css/main.css"/>
  ${shopIndexStyles}
</head>
<body data-page="shop">
  <a href="#main" class="skip-link">Skip to main content</a>
  <a class="wa-float" href="https://wa.me/233552394434" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="white"><path d="${waPath}"/></svg></a>
  ${nav}
  <header class="page-hero">
    <div class="section-label reveal">Our Collections</div>
    <h1 class="section-title reveal reveal-delay-1">Shop <em>All Products</em></h1>
    <p class="reveal reveal-delay-2" style="font-size:1rem;line-height:1.8;color:#4a3030;max-width:520px;">Curated vegan and cruelty-free beauty. Filter by category or explore everything.</p>
  </header>
  <main id="main" class="section products-wrap">
    <div class="shop-toolbar">
      <div class="filter-group">
        <label for="filter-category">Category</label>
        <button type="button" class="filter-btn active" data-filter="all">All</button>
        <button type="button" class="filter-btn" data-filter="skincare">Skincare</button>
        <button type="button" class="filter-btn" data-filter="makeup">Makeup</button>
        <button type="button" class="filter-btn" data-filter="body">Body</button>
        <button type="button" class="filter-btn" data-filter="hair">Hair</button>
      </div>
    </div>
    <div class="shop-grid" id="shopGrid">
      ${cardHtml}
    </div>
  </main>
  ${footer}
  <script src="/js/main.js"></script>
  <script>
    (function () {
      var btns = document.querySelectorAll('.filter-btn');
      var cards = document.querySelectorAll('#shopGrid .product-card');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var filter = btn.getAttribute('data-filter');
          btns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          cards.forEach(function (card) {
            var cat = card.getAttribute('data-category');
            card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
          });
        });
      });
    })();
  </script>
</body>
</html>`;
  write('shop/index.html', shopIndexHtml);
}

function buildBlog(nav, footer) {
  const posts = JSON.parse(read('data/posts.json'));
  const postsBySlug = Object.fromEntries(posts.map(p => [p.slug, p]));
  const blogIndexStyles = read('blog/index.html').match(/<style>[\s\S]*?<\/style>/)[0];
  const postStyles = read('blog/summer-skincare-tips.html').match(/<style>[\s\S]*?<\/style>/)[0];
  const bgClasses = ['bg1', 'bg2', 'bg3', 'bg4'];

  posts.forEach((post, idx) => {
    const related = (post.related || []).slice(0, 3).map(slug => postsBySlug[slug]).filter(Boolean);
    const relatedHtml = related.map((r, i) => `
        <article class="related-card reveal reveal-delay-${i + 1}">
          <a href="/blog/${r.slug}/">
            <div class="related-card-img" style="background:linear-gradient(135deg,#C4826A,#E8C8B8);"></div>
            <div class="related-card-body">
              <div class="related-card-cat">${escapeHtml(r.category)}</div>
              <h3 class="related-card-title">${escapeHtml(r.title)}</h3>
            </div>
          </a>
        </article>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${escapeHtml(post.title)} — Bliss Beauty Plus</title>
  ${metaTags({
    title: `${post.title} — Bliss Beauty Plus`,
    description: post.excerpt,
    canonical: `/blog/${post.slug}/`,
  })}
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/css/main.css"/>
  ${postStyles}
</head>
<body data-page="blog">
  <a href="#main" class="skip-link">Skip to main content</a>
  <a class="wa-float" href="https://wa.me/233552394434" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="white"><path d="${waPath}"/></svg></a>
  ${nav}
  <main id="main" class="section" style="background:var(--cream);">
    <header class="post-header">
      <div class="post-meta reveal">${escapeHtml(post.category)}</div>
      <h1 class="post-title reveal reveal-delay-1">${escapeHtml(post.title)}</h1>
      <p class="post-date reveal reveal-delay-2">${escapeHtml(post.date)}</p>
    </header>
    <div class="post-hero-img reveal"></div>
    <div class="post-body">${post.body}</div>
    <section class="related">
      <div class="section-label reveal">Related Posts</div>
      <h2 class="section-title reveal reveal-delay-1">Keep <em>Reading</em></h2>
      <div class="related-grid">${relatedHtml}
      </div>
    </section>
  </main>
  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;
    write(`blog/${post.slug}.html`, html);
  });

  const featured = posts[0];
  const gridCards = posts.map((p, i) => `
      <article class="blog-card reveal reveal-delay-${Math.min(i, 3)}">
        <a href="/blog/${p.slug}/">
          <div class="blog-card-img ${bgClasses[i % 4]}"></div>
          <div class="blog-card-body">
            <div class="blog-card-cat">${escapeHtml(p.category)}</div>
            <h3 class="blog-card-title">${escapeHtml(p.title)}</h3>
            <span class="blog-card-date">${escapeHtml(p.dateShort)}</span>
          </div>
        </a>
      </article>`).join('');

  const blogIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Blog — Bliss Beauty Plus</title>
  ${metaTags({ title: 'Blog — Bliss Beauty Plus', description: 'Tips, stories and inspiration for your skincare and makeup journey.', canonical: '/blog/' })}
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/css/main.css"/>
  ${blogIndexStyles}
</head>
<body data-page="blog">
  <a href="#main" class="skip-link">Skip to main content</a>
  <a class="wa-float" href="https://wa.me/233552394434" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="white"><path d="${waPath}"/></svg></a>
  ${nav}
  <header class="page-hero">
    <div class="section-label reveal">Blog</div>
    <h1 class="section-title reveal reveal-delay-1">Beauty & <em>Wellness</em></h1>
    <p class="reveal reveal-delay-2" style="font-size:1rem;line-height:1.8;color:#4a3030;max-width:520px;">Tips, stories and inspiration for your skincare and makeup journey.</p>
  </header>
  <main id="main" class="section" style="background:var(--cream);">
    <article class="blog-featured reveal">
      <a href="/blog/${featured.slug}/">
        <div class="blog-featured-img"></div>
      </a>
      <div class="blog-featured-content">
        <div class="blog-featured-label">Featured</div>
        <h2 class="blog-featured-title">${escapeHtml(featured.title)}</h2>
        <p class="blog-featured-excerpt">${escapeHtml(featured.excerpt)}</p>
        <span class="blog-featured-date">${escapeHtml(featured.date)}</span>
      </div>
    </article>
    <div class="blog-grid">${gridCards}
    </div>
    <div class="newsletter-cta reveal">
      <div class="section-label">Stay Updated</div>
      <h2 class="section-title">Join Our <em>Newsletter</em></h2>
      <p>Get beauty tips, new arrivals and exclusive offers in your inbox. No spam — just inspiration.</p>
      <form class="newsletter-form" action="#" method="post" aria-label="Newsletter signup">
        <label for="newsletter-email" class="visually-hidden">Your email</label>
        <input id="newsletter-email" type="email" name="email" placeholder="Your email" required aria-required="true"/>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </main>
  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;
  write('blog/index.html', blogIndexHtml);
}

function runIncludes() {
  const navHtml = read('partials/nav.html');
  const footerHtml = read('partials/footer.html');
  const files = [
    { in: 'index.html', out: 'index.html' },
    { in: 'about/index.html', out: 'about/index.html' },
    { in: 'gallery/index.html', out: 'gallery/index.html' },
  ];
  for (const { in: inp, out: outPath } of files) {
    let html = read(inp);
    html = html.replace(/<include\s+src="[^"]*partials\/nav\.html"[^>]*><\/include>/gi, navHtml);
    html = html.replace(/<include\s+src="[^"]*partials\/footer\.html"[^>]*><\/include>/gi, footerHtml);
    write(outPath, html);
  }
}

function copyAssets() {
  ['css/main.css', 'js/main.js'].forEach(rel => {
    const src = path.join(ROOT, rel);
    const dest = path.join(DIST, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  });
}

async function main() {
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  fs.mkdirSync(DIST, { recursive: true });

  const nav = read('partials/nav.html');
  const footer = read('partials/footer.html');

  buildShop(nav, footer);
  buildBlog(nav, footer);
  runIncludes();
  copyAssets();

  console.log('Build complete. Output: dist/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
