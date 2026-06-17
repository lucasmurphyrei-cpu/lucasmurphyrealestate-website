# Market Hub — Design Spec

**Date:** 2026-06-13
**Status:** Approved (pending spec review)
**Scope:** Build a 3-tier market data experience (Hub → County → Municipality) in the
PreviewV1 redesign language, fully additive to the preview world. Tie the existing
neighborhood-fit quiz into each county-level page.

---

## 1. Goals & Constraints

- **Goal:** A "Market" destination, linked from the top of the redesigned site, that hosts
  all county market data and drills down to municipality-level data, with both current
  snapshot stats and historical trend charts.
- **Design language:** PreviewV1 — navy base `#0a1424`, gold `accent`, `font-display`
  headings, video/photo `ParallaxBand` sections, image-driven cards.
- **Additive / non-destructive:** Build entirely in the preview world. The live shadcn-card
  site (`/`, `/areas/*`, `/guides/*`, …) and `PreviewV1` itself render exactly as today.
- **Reuse existing data + logic** wherever practical; restyle, don't re-derive.

### Decisions locked during brainstorming
- Build target: **inside the preview world** (additive).
- Structure: **3 tiers** — Hub → County → Municipality.
- Data depth: **snapshot stats + historical trend charts** (recharts, already installed).
- This session: **the full 3-tier market experience**.
- Municipality tier: **re-skinned into the new navy/gold design**.
- County tier: **include the neighborhood-fit quiz**.

---

## 2. Routes (additive)

| Tier | Path | Component |
|------|------|-----------|
| Hub | `/preview/v1/market` | `MarketHub` |
| County | `/preview/v1/market/:county` | `MarketCounty` |
| Municipality | `/preview/v1/market/:county/:municipality` | `MarketMunicipality` |

`:county` uses existing county slugs (`milwaukee-county`, `waukesha-county`,
`ozaukee-county`, `washington-county`). `:municipality` uses the slug produced by
`municipalityLookup.slugify`. Registered in `src/App.tsx` as standalone routes (no main-site
`LayoutRoute`), matching how `/preview/v1` is registered.

---

## 3. Shared extraction → `src/pages/preview/_shared/`

`PreviewV1.tsx` currently defines the design system inline. To avoid copy-paste drift across
four pages, lift the reusable pieces into a shared folder and have `PreviewV1` import them.
This is a behavior-preserving refactor of `PreviewV1` (same render output).

| File | Contents |
|------|----------|
| `ParallaxBand.tsx` | The scroll-driven parallax band, lifted verbatim (props: `src, video, overlay, split, fixedBg, align, objectPosition, minH, cornerLabel, children`). |
| `tokens.ts` | `IMG`, `VID`, `SOCIAL`, county hero image map. |
| `PreviewHeader.tsx` | Fixed navy/gold header (Provision logo, scroll-to-solid behavior), **plus a new "Market" nav link**. Section anchors point to `/preview/v1#guides` etc. so they work from sub-pages. |
| `PreviewFooter.tsx` | Shared footer extracted from PreviewV1. |
| `StatCard.tsx` | Snapshot stat tile: label, value, YoY pill with up/down/flat color (emerald/red/muted), matching PreviewV1 stat styling. |
| `MarketTrendChart.tsx` | recharts area/line chart over a `[{month, value, yoy_pct}]` series. **Filters out null-value points**; if < 2 real points remain, renders a "limited history" note instead of an empty chart. Formats axis values per metric (currency, days, %, count). |

If extraction of `PreviewHeader`/`PreviewFooter` proves too entangled with PreviewV1's
hero/scroll state during implementation, fall back to extracting `ParallaxBand`, `tokens`,
`StatCard`, and `MarketTrendChart` only, and give the market pages their own lightweight
header that reuses `tokens` + the same markup. The shared chrome is the nice-to-have; the
primitives are the requirement.

---

## 4. Data sources (all existing)

| Source | Shape | Used for |
|--------|-------|----------|
| `countyMarketData.ts` | `Record<countyName, {dataMonth, videoUrl?, stats: MarketStat[]}>` | County snapshot grid + monthly video link |
| `countyMarketHistory.json` | `{month, counties: {countyName: {median_price, days_on_market, sale_to_list, months_supply, inventory, new_listings}}}`, each metric `[{month, value, yoy_pct}]` (early months may be null) | County trend charts; hub sparklines + comparison chart |
| `municipalityMarketHistory.json` | `{month, municipalities: {muniId: {county, metrics: {median_price, days_on_market, sale_to_list, inventory, closed_sales, …}}}}` (series may be sparse, as few as 2 points) | Municipality trend charts |
| `municipalityRapidStats.ts` (`getRapidStats(id)`) | `RapidStatsMunicipality \| null` (median_sale_price, metrics[]) | Municipality snapshot + rapid-stats table |
| `municipalityLookup.ts` | `countySlugToKey`, `getSlimBySlug`, `getFullProfile`, county→municipalities maps | Slug resolution, municipality directory |
| `municipalityImages.ts` | muni id → image | Municipality cards + hero |
| `neighborhoods/profiles-slim.json` + `getFullProfile` | quick_snapshot, buyer_lifestyle_fit, amenities_character | Municipality profile sections |

County name keys in the data are display names ("Waukesha County"); slugs map via existing
`COUNTY_SLUG_TO_KEY` / `countySlugToKey`. A small `countySlugToDisplay` helper bridges
slug ↔ `countyMarketData`/`countyMarketHistory` keys.

---

## 5. Tier 1 — Hub (`/preview/v1/market`)

1. **Hero `ParallaxBand`** — headline ("Metro Milwaukee Market" or similar) + the latest
   data-month label (from `countyMarketData` / history `month`).
2. **County cards** (image-driven, PreviewV1 guide-card style) — one per county: county
   name, median price + YoY, days-on-market, and a median-price **sparkline**. Click → county page.
3. **Cross-county comparison chart** — `MarketTrendChart` overlaying the 4 counties'
   median-price series.
4. **CTA band** — reuse the "Get started now" parallax CTA pattern.

## 6. Tier 2 — County (`/preview/v1/market/:county`)

1. **Hero `ParallaxBand`** — county photo; if `countyMarketData[county].videoUrl` exists,
   surface the monthly market-update video (link/button).
2. **Snapshot stat grid** — all 6 metrics from `countyMarketData` via `StatCard`.
3. **Trend charts** — `MarketTrendChart` for median price, days-on-market, inventory from
   `countyMarketHistory`.
4. **Neighborhood-fit quiz** — `NeighborhoodQuizSection mode="county" contextCounty={countyKey}`
   (short key, e.g. `"waukesha"`), reused as-is, placed inside a **light band** so its
   light shadcn styling reads as an intentional section break (PreviewV1 already alternates
   light/dark bands).
5. **Municipality directory** — grid of that county's municipalities (`municipalityLookup` +
   `municipalityImages`), each card showing median price; click → municipality page.
6. **CTA band.**

## 7. Tier 3 — Municipality (`/preview/v1/market/:county/:municipality`)

1. **PreviewHeader** + **hero `ParallaxBand`** (municipality image from `municipalityImages`).
2. **Snapshot grid** — from `getRapidStats(id)` / `municipalityMarketHistory`, via `StatCard`.
3. **Trend charts** — `MarketTrendChart` per available metric from
   `municipalityMarketHistory`; graceful "limited history" fallback for sparse series.
4. **Profile sections** — reuse the *data/logic* behind the existing municipality components
   (rapid-stats lookup, `buyer_lifestyle_fit`, `amenities_character` from `getFullProfile`),
   restyled to the navy/gold design.
5. **"Schedule a Consultation" CTA.**

---

## 8. Error / edge handling

- Unknown county or municipality slug → a **styled in-page "not found"** state (navy/gold)
  with a link back to the hub, not the global `NotFound`.
- Stat grids and charts guard against missing/null metrics (filter nulls; hide a card or show
  an em-dash-free placeholder when a metric is absent).
- Municipality with no history → snapshot only + "limited history" note on charts.

## 9. SEO (per CLAUDE.md checklist)

Each of the three pages adds `react-helmet-async` `<title>`, `<meta name="description">`,
and a `<link rel="canonical">`. Canonical paths use the production domain pattern. Sitemap
entries are deferred until the redesign is promoted out of the preview world (these are
preview routes, intentionally not yet public); noted here so it is not forgotten at cutover.

## 10. Verification

Dev server already running (`npm run dev`, Vite). For each tier: screenshot via the project's
`screenshot.mjs` against `http://localhost:3000/preview/v1/market...`, compare to the
PreviewV1 look, iterate ≥2 passes per the project rules. Confirm: charts render with real
data, null/sparse series degrade gracefully, quiz opens and filters to the county, all three
routes deep-link correctly, and `PreviewV1` is visually unchanged after the shared extraction.

## 11. Out of scope (this session)

- Redesigning guides/resources/tools pages (later session).
- Promoting the redesign to the live site / sitemap updates.
- Changing the live `/areas/*` pages or the existing `MunicipalityReport`.
