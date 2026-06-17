# SEO & AI-Ranking Optimization — Design Spec

**Date:** 2026-06-13
**Status:** Draft (pending spec review + one domain confirmation)
**Scope:** Make the site rank in traditional search AND get cited by AI engines
(ChatGPT/GPTBot, Perplexity, Google AI Overviews, Claude). Build reusable SEO
infrastructure and bake it into the new market hub / redesign pages so they launch fully
optimized; apply lighter-touch to current live pages (which the redesign will replace).

---

## 1. Goals & Constraints

- **Goal:** Per-page discoverability for both crawlers and AI answer engines, with the
  local, factual market data positioned as citable content.
- **Decisions locked during brainstorming:**
  - Rendering: **add prerendering** (static HTML per route at build time).
  - Domain: **this app = primary site at `www.lucasmurphyrealestate.com`** (Option A) —
    *confirmed 2026-06-13 by live check: the apex domain is served by this Vite/React app on
    Vercel (title + `#root` + `/assets/*.js` fingerprint, no WordPress markers). The raw
    served HTML is a ~2.5 KB empty shell with homepage-only meta on every route, confirming
    the SPA prerender gap is live.*
  - Focus: **reusable infra + build SEO into the new pages first**, lighter pass on current
    live pages.
- **Non-destructive:** No change to page designs; SEO is additive markup, head tags, build
  steps, and static files. Preview routes stay `noindex` until the redesign is promoted.

### Current baseline (assessment)
- Good: `index.html` has full meta/OG/Twitter/canonical; Helmet on ~23 pages;
  `RealEstateAgent`+`WebSite` JSON-LD (Index) and `Article`+`FAQPage` (First-Time guide);
  `robots.txt` already allows GPTBot/ChatGPT-User/Claude-Web/PerplexityBot/Applebot-Extended;
  84-URL `sitemap.xml`.
- Gaps: **client-rendered SPA** (Helmet tags/JSON-LD only exist post-JS → non-JS crawlers see
  homepage tags on every route); **no `llms.txt`**; structured data on only 2 pages;
  homepage-only canonical on many routes; `ResourcePageTemplate` lacks Helmet; resource pages
  are thin "coming soon" stubs.

---

## 2. Architecture: prerendering (highest-impact)

**Approach:** Custom **Puppeteer postbuild prerender** (Puppeteer is already a project
dependency and in active use via `screenshot.mjs` — no fragile/unmaintained plugin).

Pipeline (`scripts/prerender.mjs`, wired as `"postbuild"` in `package.json`):
1. `vite build` produces `dist/`.
2. Start `vite preview` (or a static server) on `dist/`.
3. Load a **route manifest** (see §5) — static routes + dynamic routes enumerated from data
   (4 counties + ~56 municipalities from `municipalityLookup`, plus new market routes).
4. For each route: Puppeteer navigates, waits for network-idle + Helmet to settle, captures
   `document.documentElement.outerHTML`, writes `dist/<route>/index.html`.
5. Tear down.

**Hydration:** keep `createRoot` (no `hydrateRoot`). On load, React mounts into `#root` and
re-renders — crawlers/bots get complete static HTML (content + meta + JSON-LD); users get the
static paint then the live app. This avoids hydration-mismatch fragility entirely.

**Serving:** Vercel serves an existing static file before applying rewrites, so writing
`dist/areas/waukesha-county/index.html` makes that URL serve real HTML automatically; the
catch-all `index.html` rewrite only fires for routes without a prerendered file. Confirm/adjust
the `vercel.json` rewrite so it never shadows a prerendered path.

**Preview routes:** prerendered for QA but emit `<meta name="robots" content="noindex">` and
are excluded from the sitemap until promotion.

---

## 3. Reusable SEO components → `src/components/seo/`

| File | Purpose |
|------|---------|
| `siteConfig.ts` | Single source of truth: `SITE_URL`, brand name, agent, brokerage, phone, email, social URLs, service-area counties, default OG image. |
| `Seo.tsx` | Wraps Helmet. Props: `title, description, canonicalPath, ogImage?, type?, noindex?`. Emits title, description, canonical (`${SITE_URL}${canonicalPath}`), OG, Twitter, robots. Used by every page; replaces ad-hoc Helmet blocks. |
| `JsonLd.tsx` | `<JsonLd data={…}/>` renders a `<script type="application/ld+json">` via Helmet. |
| `schema.ts` | Builder fns returning schema.org objects: `realEstateAgent()`, `organization()`, `webSite()` (with `SearchAction`), `breadcrumbList(items)`, `place(county)` / `localBusiness()`, `dataset(marketSeries)`, `faqPage(qas)`, `article(meta)`, `aggregateRating(reviews)` + `review(r)`. |

---

## 4. Structured-data rollout (the AI-citation lever)

- **BreadcrumbList** on every nested page (Market Hub → County → Municipality; Guides; etc.).
- **Dataset + Place** on county & municipality market pages — model the market stats as a
  citable dataset (median price, DOM, sale-to-list, inventory) with `temporalCoverage`,
  `spatialCoverage` (the county/municipality), `dateModified` (data month), and source
  attribution ("RapidStats / MLS"). This is the content most likely to be cited by AI engines.
- **AggregateRating / Review** from the real Google reviews → homepage + agent entity.
- **FAQPage** on guide pages and, where natural, on county pages ("What's the median home
  price in Waukesha County?" answered inline + in schema).
- **RealEstateAgent / Organization / WebSite** centralized via `schema.ts` (replacing the
  hand-written blocks in `Index.tsx`).

## 5. Routes & sitemap automation

- `scripts/routes.mjs` exports the canonical route manifest: static routes + dynamic routes
  generated from `municipalityLookup` (counties, municipalities) and the new market routes.
  Shared by the prerender script and the sitemap generator (one source of truth).
- `scripts/generate-sitemap.mjs` (prebuild) regenerates `public/sitemap.xml` from the manifest
  with `lastmod` derived from the market data month and sensible `changefreq`/`priority`.
  Replaces the hand-maintained 84-URL file. Excludes `noindex` preview routes.

## 6. AI-specific (GEO) tactics

- **`public/llms.txt`** — markdown index per the llms.txt convention: who Lucas is, brokerage,
  exact service area, the high-value pages (guides, county/municipality market pages, tools)
  each with a one-line description, and market-data freshness. Generated from `siteConfig` +
  route manifest so it stays current.
- **Answer-first content** on market/county pages: lead with explicit, extractable facts
  ("As of June 2026, the median sale price in Waukesha County is $539,950, down 0.9% YoY.")
  and clear entity naming. AI engines extract and cite these statements directly.
- **robots.txt**: keep AI-crawler allowances; confirm new sections aren't disallowed.

## 7. Per-page meta coverage

- Add `<Seo>` to `ResourcePageTemplate` and any route lacking per-page meta.
- Templated dynamic titles/descriptions, e.g.
  `"{County} Real Estate Market — Median Price & Trends ({Month}) | Lucas Murphy"`,
  `"{Municipality}, WI Home Prices & Market Data ({Month})"`.

## 8. Performance (secondary, ranking factor)

- Guard LCP against the hero videos (poster image, lazy/deferred video load).
- Lazy-load below-the-fold imagery; ensure images have width/height + `alt`.
- Scoped as a follow-up pass, not a blocker for the structured-data/prerender work.

---

## 9. Relationship to the Market Hub spec

The market hub pages (`2026-06-13-market-hub-design.md`) are built **SEO-first** using this
spec's `<Seo>` + `schema.ts` (BreadcrumbList, Dataset/Place, FAQ) and are included in the
route manifest (as `noindex` preview routes until promotion). Recommended build order:
1. SEO infrastructure: `siteConfig`, `Seo`, `JsonLd`, `schema`, route manifest, prerender
   script, sitemap generator.
2. Market hub pages, consuming that infrastructure.
3. Site-wide rollout: migrate existing live pages to `<Seo>` + expanded schema (light touch),
   add `llms.txt`.

## 10. Verification

- **Prerender:** after build, inspect `dist/**/index.html` for real content + correct
  per-route `<title>`, canonical, and JSON-LD (not the homepage's). `curl` a built route with
  JS disabled equivalent (read the static file) to confirm.
- **Structured data:** validate JSON-LD with schema.org/Google Rich Results expectations
  (well-formed, required fields); no console errors.
- **Canonical/sitemap:** every route self-canonicals; sitemap matches the manifest; preview
  routes are `noindex` and absent from the sitemap.
- **AI-readiness:** `llms.txt` reachable at root; robots allows AI crawlers; key facts appear
  in the prerendered HTML text (not just charts).

## 11. Out of scope

- Off-page SEO (backlinks, GMB/Google Business Profile, citations).
- Migrating or rewriting the secondary `/guide/*` deployment.
- Promoting the redesign to production (separate cutover, where preview `noindex` is lifted
  and preview routes get real canonicals + sitemap entries).
