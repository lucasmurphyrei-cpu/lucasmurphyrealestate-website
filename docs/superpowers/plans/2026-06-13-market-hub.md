# Market Hub Implementation Plan (Phase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.
> **Per project CLAUDE.md:** invoke the `frontend-design` skill before writing any page/visual code, and verify visual work with the screenshot workflow (`node screenshot.mjs http://localhost:8081/...` against the running Vite dev server, ≥2 comparison passes).

**Goal:** Build a 3-tier market-data experience — Hub → County → Municipality — in the approved PreviewV1 navy/gold design, fully additive under `/preview/v1/market`, with current-month snapshot stats + historical trend charts, the neighborhood-fit quiz on county pages, and built SEO-first on the Phase-1 infra.

**Architecture:** Extract the reusable design primitives (`ParallaxBand`, design tokens, header/footer) out of `PreviewV1.tsx` into `src/pages/preview/_shared/` so both PreviewV1 and the new market pages share them without drift. A pure market-data layer (`src/lib/market/`) adapts the existing history JSON into clean, null-filtered chart series. Three new route components compose those primitives + a recharts `MarketTrendChart` + the existing `NeighborhoodQuizSection`. Pages use the Phase-1 `<Seo>` + `<JsonLd>` (Dataset/Place/BreadcrumbList) and are registered as `noindex` preview routes (added to `scripts/routes.ts`) until promotion.

**Tech Stack:** React 18, react-router-dom 6, framer-motion, recharts (installed), react-helmet-async, Vitest. Branch off the current work.

---

## Conventions for the implementer

- **Branch:** create `feat/market-hub` off `main` (or stack on `feat/seo-infrastructure` if the SEO infra is not yet merged — confirm with the controller which base; the market pages import the SEO components from Phase 1, so those files must be present). There is unrelated pre-existing uncommitted work in the tree (the broader redesign) — NEVER `git add -A`; stage only the files each task names.
- Tests: `npx vitest run <path>`; suite: `npm test`. `@` alias = `src/`.
- Dev server is already running on `http://localhost:8081` (Vite). Screenshot with `node screenshot.mjs http://localhost:8081/preview/v1/market` from the project root; read the PNG from `temporary screenshots/`.
- Design tokens (from `PreviewV1.tsx`): navy base `#0a1424`, gold `accent`, `font-display` (Playfair) headings, `font-body`. Avoid em-dashes in new copy.
- Data month is "June 2026" across county data; treat it as current.

---

## File structure

**Create — shared primitives (`src/pages/preview/_shared/`):**
- `ParallaxBand.tsx` — moved verbatim from PreviewV1 (the `function ParallaxBand` + its `ParallaxBandProps` type).
- `tokens.ts` — moved `IMG`, `VID`, `SOCIAL` consts + the `heroCounties` array.
- `PreviewHeader.tsx` — the fixed navy/gold header extracted from PreviewV1, with a new "Market" nav link; section anchors become absolute (`/preview/v1#guides`).
- `PreviewFooter.tsx` — the footer extracted from PreviewV1.

**Create — market data layer (`src/lib/market/`):**
- `counties.ts` — slug↔display helpers + county snapshot accessor.
- `history.ts` — null-filtered metric-series adapters over the history JSON.
- `*.test.ts` for both.

**Create — market UI:**
- `src/pages/preview/_shared/StatCard.tsx` — snapshot stat tile (value + YoY pill).
- `src/pages/preview/_shared/MarketTrendChart.tsx` — recharts trend chart (null-safe).
- `src/pages/preview/_shared/MarketTrendChart.test.tsx`, `StatCard` covered via chart/page screenshots.
- `src/pages/preview/market/MarketHub.tsx` — Tier 1.
- `src/pages/preview/market/MarketCounty.tsx` — Tier 2.
- `src/pages/preview/market/MarketMunicipality.tsx` — Tier 3.

**Modify:**
- `src/pages/preview/PreviewV1.tsx` — import the extracted primitives instead of its inline copies (behavior-preserving).
- `scripts/routes.ts` — append market routes (noindex).
- `src/App.tsx` — register the 3 market routes (standalone, outside `LayoutRoute`).
- `src/lib/seo/schema.ts` — already has `dataset`, `place`, `breadcrumbList`, `faqPage` (Phase 1). Reused, not modified, unless a market helper is added.

---

## Task 1: Extract `ParallaxBand` + tokens into `_shared/` (behavior-preserving)

**Files:** Create `src/pages/preview/_shared/ParallaxBand.tsx`, `src/pages/preview/_shared/tokens.ts`. Modify `src/pages/preview/PreviewV1.tsx`.

- [ ] **Step 1: Move the tokens.** Read `PreviewV1.tsx`. Cut the `IMG`, `VID`, `SOCIAL` object consts and the `heroCounties` array into `src/pages/preview/_shared/tokens.ts` and `export` each. Keep values byte-identical.

- [ ] **Step 2: Move ParallaxBand.** Cut the `type ParallaxBandProps = {...}` and `function ParallaxBand(...) {...}` definitions into `src/pages/preview/_shared/ParallaxBand.tsx`. Add at top: `import { useRef, type ReactNode } from "react";` and `import { motion, useScroll, useTransform } from "framer-motion";`. `export default function ParallaxBand`.

- [ ] **Step 3: Update PreviewV1 imports.** In `PreviewV1.tsx` add:
```tsx
import ParallaxBand from "@/pages/preview/_shared/ParallaxBand";
import { IMG, VID, SOCIAL, heroCounties } from "@/pages/preview/_shared/tokens";
```
Remove the now-moved inline definitions. Leave everything else untouched.

- [ ] **Step 4: Verify PreviewV1 is visually unchanged.** With the dev server running: `node screenshot.mjs http://localhost:8081/preview/v1 v1-after-extract`. Read the PNG and confirm the homepage renders identically (header, hero, parallax bands, guides, reviews). Run `npm test` (must stay green). If the build/TS is unhappy, fix imports until `npx tsc --noEmit` (or the dev server) is clean.

- [ ] **Step 5: Commit**
```bash
git add src/pages/preview/_shared/ParallaxBand.tsx src/pages/preview/_shared/tokens.ts src/pages/preview/PreviewV1.tsx
git commit -m "refactor(preview): extract ParallaxBand + tokens to _shared for reuse"
```

---

## Task 2: Extract `PreviewHeader` + `PreviewFooter`, add a Market link

**Files:** Create `src/pages/preview/_shared/PreviewHeader.tsx`, `src/pages/preview/_shared/PreviewFooter.tsx`. Modify `PreviewV1.tsx`.

> If the header/footer are too entangled with PreviewV1's hero/scroll state to extract cleanly (e.g. they reference `scrolled` derived from the hero), it is acceptable to (a) extract a self-contained `PreviewHeader` that manages its own `scrolled` state via a scroll listener, and (b) keep PreviewV1 using its own inline header if a clean extraction would change its behavior. Report DONE_WITH_CONCERNS if you keep PreviewV1's header inline; the market pages still get a shared `PreviewHeader`. The REQUIREMENT is a reusable `PreviewHeader` for the market pages with a "Market" nav item; reusing it in PreviewV1 is the nice-to-have.

- [ ] **Step 1:** Create `PreviewHeader.tsx`: a fixed top bar (navy-on-scroll) with the Provision logo (`import provisionLogo from "@/assets/provision-logo.png"`), nav links, and the Schedule button. Manage its own `scrolled` state:
```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const NAV = [
  { label: "About", href: "/preview/v1#about" },
  { label: "Market", href: "/preview/v1/market" },
  { label: "Guides", href: "/preview/v1#guides" },
  { label: "Reviews", href: "/preview/v1#reviews" },
  { label: "Contact", href: "/preview/v1#contact" },
];
```
Use the same classes/markup as PreviewV1's current header (read it and mirror: transparent→`bg-[#0a1424]/95` on `scrollY>32`, logo `brightness-0 invert`, gold hover). Internal section links use `<a href>` (cross-page anchors), the Market link uses `<Link to>`.

- [ ] **Step 2:** Create `PreviewFooter.tsx` from PreviewV1's footer markup (logo, contact `SOCIAL`, nav, copyright). Import tokens from `_shared/tokens`.

- [ ] **Step 3:** (If clean) replace PreviewV1's inline header/footer with `<PreviewHeader />` / `<PreviewFooter />`; screenshot `/preview/v1` to confirm unchanged. Otherwise leave PreviewV1 as-is and note it.

- [ ] **Step 4:** `npm test` green. Commit:
```bash
git add src/pages/preview/_shared/PreviewHeader.tsx src/pages/preview/_shared/PreviewFooter.tsx src/pages/preview/PreviewV1.tsx
git commit -m "feat(preview): shared PreviewHeader (with Market link) + PreviewFooter"
```

---

## Task 3: County slug/display + snapshot accessors (`src/lib/market/counties.ts`)

**Files:** Create `src/lib/market/counties.ts`, `src/lib/market/counties.test.ts`.

- [ ] **Step 1: Failing test**
```ts
// src/lib/market/counties.test.ts
import { describe, it, expect } from "vitest";
import { COUNTY_SLUGS, countySlugToDisplay, getCountySnapshot } from "./counties";

describe("market counties", () => {
  it("maps the 4 county slugs to display names", () => {
    expect(COUNTY_SLUGS).toHaveLength(4);
    expect(countySlugToDisplay("waukesha-county")).toBe("Waukesha County");
    expect(countySlugToDisplay("milwaukee-county")).toBe("Milwaukee County");
  });

  it("returns snapshot stats for a known county", () => {
    const snap = getCountySnapshot("waukesha-county");
    expect(snap?.dataMonth).toBe("June 2026");
    expect(snap?.stats.find((s) => s.label === "Median Price")?.value).toBe("$539,950");
  });

  it("returns null for an unknown county slug", () => {
    expect(getCountySnapshot("dane-county")).toBeNull();
  });
});
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implement**
```ts
// src/lib/market/counties.ts
import countyMarketData, { CountyMarketData } from "@/data/countyMarketData";

export const COUNTY_SLUGS = [
  "milwaukee-county",
  "waukesha-county",
  "ozaukee-county",
  "washington-county",
] as const;

export type CountySlug = (typeof COUNTY_SLUGS)[number];

/** "waukesha-county" -> "Waukesha County" (matches countyMarketData keys). */
export function countySlugToDisplay(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getCountySnapshot(slug: string): CountyMarketData | null {
  return countyMarketData[countySlugToDisplay(slug)] ?? null;
}
```

- [ ] **Step 4:** Run → PASS (3 tests).

- [ ] **Step 5: Commit**
```bash
git add src/lib/market/counties.ts src/lib/market/counties.test.ts
git commit -m "feat(market): county slug/display + snapshot accessor"
```

---

## Task 4: History → chart-series adapters (`src/lib/market/history.ts`)

**Files:** Create `src/lib/market/history.ts`, `src/lib/market/history.test.ts`.

Data shapes (confirmed):
- `countyMarketHistory.json` = `{ month, counties: { "<County Name>": { median_price: [{month,value,yoy_pct}], days_on_market: [...], sale_to_list: [...], months_supply: [...], inventory: [...], new_listings: [...] } } }` (early points may have `value: null`).
- `municipalityMarketHistory.json` = `{ month, municipalities: { "<id>": { county, metrics: { median_price: [...], days_on_market: [...], sale_to_list: [...], inventory: [...], closed_sales: [...] } } } }` (series may be short).

- [ ] **Step 1: Failing test**
```ts
// src/lib/market/history.test.ts
import { describe, it, expect } from "vitest";
import { getCountySeries, getMuniSeries, type SeriesPoint } from "./history";

describe("market history adapters", () => {
  it("returns county median_price points with nulls filtered out", () => {
    const s = getCountySeries("Waukesha County", "median_price");
    expect(Array.isArray(s)).toBe(true);
    for (const p of s as SeriesPoint[]) {
      expect(p.value).not.toBeNull();
      expect(typeof p.value).toBe("number");
      expect(p.month).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it("returns [] for an unknown county or metric", () => {
    expect(getCountySeries("Dane County", "median_price")).toEqual([]);
    expect(getCountySeries("Waukesha County", "nonexistent_metric")).toEqual([]);
  });

  it("returns muni series for a known id and [] for unknown", () => {
    const s = getMuniSeries("brookfield", "median_price");
    expect(Array.isArray(s)).toBe(true);
    expect(getMuniSeries("not-a-real-id", "median_price")).toEqual([]);
  });
});
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implement**
```ts
// src/lib/market/history.ts
import countyHistory from "@/data/countyMarketHistory.json";
import muniHistory from "@/data/municipalityMarketHistory.json";

export interface SeriesPoint {
  month: string;
  value: number;
  yoy_pct: number | null;
}

interface RawPoint {
  month: string;
  value: number | null;
  yoy_pct: number | null;
}

const clean = (raw: RawPoint[] | undefined): SeriesPoint[] =>
  (raw ?? [])
    .filter((p): p is RawPoint & { value: number } => typeof p.value === "number")
    .map((p) => ({ month: p.month, value: p.value, yoy_pct: p.yoy_pct }));

export function getCountySeries(countyName: string, metric: string): SeriesPoint[] {
  const county = (countyHistory as any).counties?.[countyName];
  return clean(county?.[metric]);
}

export function getMuniSeries(muniId: string, metric: string): SeriesPoint[] {
  const muni = (muniHistory as any).municipalities?.[muniId];
  return clean(muni?.metrics?.[metric]);
}
```
> Note on JSON imports: Vite/Vitest resolve `*.json` by default. If a TS error appears on the JSON import, ensure `resolveJsonModule` is on in `tsconfig.app.json` (it normally is for Vite). If not, add it.

- [ ] **Step 4:** Run → PASS (3 tests).

- [ ] **Step 5: Commit**
```bash
git add src/lib/market/history.ts src/lib/market/history.test.ts
git commit -m "feat(market): null-safe county/municipality chart-series adapters"
```

---

## Task 5: `MarketTrendChart` (recharts, null-safe) + `StatCard`

**Files:** Create `src/pages/preview/_shared/MarketTrendChart.tsx`, `src/pages/preview/_shared/MarketTrendChart.test.tsx`, `src/pages/preview/_shared/StatCard.tsx`.

- [ ] **Step 1: Failing test** (verifies the limited-history fallback — testable without rendering the SVG):
```tsx
// src/pages/preview/_shared/MarketTrendChart.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MarketTrendChart from "./MarketTrendChart";

describe("MarketTrendChart", () => {
  it("shows a limited-history note when fewer than 2 points", () => {
    render(<MarketTrendChart title="Median Price" series={[{ month: "2026-06", value: 500000, yoy_pct: 1 }]} format="currency" />);
    expect(screen.getByText(/limited history/i)).toBeTruthy();
  });

  it("renders the chart title when enough points", () => {
    render(
      <MarketTrendChart
        title="Median Price"
        series={[
          { month: "2026-05", value: 480000, yoy_pct: 1 },
          { month: "2026-06", value: 500000, yoy_pct: 2 },
        ]}
        format="currency"
      />
    );
    expect(screen.getByText("Median Price")).toBeTruthy();
  });
});
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implement** (recharts `ResponsiveContainer` + `AreaChart`; gold stroke `#c9a227`-style accent — read the actual accent hex from `tailwind.config.ts`/`index.css` and use the CSS var or hex). Use a `format` prop for axis/tooltip formatting (`currency` | `days` | `percent` | `count`). When `series.length < 2`, render a small "Limited history for this area." note instead of the chart.
```tsx
// src/pages/preview/_shared/MarketTrendChart.tsx
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "@/lib/market/history";

type Fmt = "currency" | "days" | "percent" | "count";
const fmt = (v: number, f: Fmt) =>
  f === "currency" ? `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
  : f === "percent" ? `${v}%`
  : f === "days" ? `${v}d`
  : `${v.toLocaleString("en-US")}`;

interface Props { title: string; series: SeriesPoint[]; format: Fmt; }

export default function MarketTrendChart({ title, series, format }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">{title}</p>
      {series.length < 2 ? (
        <p className="py-8 text-center text-sm text-white/55">Limited history for this area.</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={series} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="mtc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent, #c9a227)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--accent, #c9a227)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(v) => fmt(Number(v), format)} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} tickLine={false} axisLine={false} width={56} />
            <Tooltip formatter={(v) => fmt(Number(v), format)} contentStyle={{ background: "#0a1424", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff" }} />
            <Area type="monotone" dataKey="value" stroke="var(--accent, #c9a227)" strokeWidth={2} fill="url(#mtc)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
```
> Confirm the real accent color: read `tailwind.config.ts` for the `accent` value and replace `#c9a227` with the actual hex. If `accent` is an HSL CSS var, use `hsl(var(--accent))`.

- [ ] **Step 4: `StatCard`** — a tile: label, big value, YoY pill colored by direction (`up`=emerald, `down`=red, `flat`=muted), matching PreviewV1 stat styling on a dark surface. Props: `{ label: string; value: string; change?: string; direction?: "up"|"down"|"flat" }`. (No unit test; verified via page screenshots.)

- [ ] **Step 5:** Run chart test → PASS. `npm test` green. Commit:
```bash
git add src/pages/preview/_shared/MarketTrendChart.tsx src/pages/preview/_shared/MarketTrendChart.test.tsx src/pages/preview/_shared/StatCard.tsx
git commit -m "feat(market): MarketTrendChart (null-safe) + StatCard"
```

---

## Task 6: Market routes in the manifest + App.tsx registration

**Files:** Modify `scripts/routes.ts`, `src/App.tsx`. Test: extend `scripts/routes.test.ts`.

- [ ] **Step 1: Failing test** — add to `scripts/routes.test.ts`:
```ts
  it("includes market hub + county + municipality routes, all noindex", () => {
    const routes = getAllRoutes();
    const market = routes.filter((r) => r.path.startsWith("/preview/v1/market"));
    expect(market.find((r) => r.path === "/preview/v1/market")).toBeTruthy();
    expect(market.filter((r) => /^\/preview\/v1\/market\/[a-z-]+-county$/.test(r.path))).toHaveLength(4);
    expect(market.filter((r) => /^\/preview\/v1\/market\/[a-z-]+-county\/.+/.test(r.path)).length).toBeGreaterThanOrEqual(50);
    expect(market.every((r) => r.noindex === true)).toBe(true);
  });
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implement** — in `scripts/routes.ts`, add a `MARKET_ROUTES` block reusing `getAllMunicipalityRoutes()` and the county slugs, all `noindex: true`, and include it in `getAllRoutes()`:
```ts
const MARKET_ROUTES: RouteEntry[] = [
  { path: "/preview/v1/market", changefreq: "weekly", priority: 0.1, noindex: true },
  ...COUNTY_SLUGS.map((slug) => ({
    path: `/preview/v1/market/${slug}`,
    changefreq: "weekly" as const,
    priority: 0.1,
    noindex: true,
  })),
  ...getAllMunicipalityRoutes().map((r) => ({
    path: `/preview/v1/market/${r.countySlug}/${r.muniSlug}`,
    changefreq: "monthly" as const,
    priority: 0.1,
    noindex: true,
  })),
];
```
Add `...MARKET_ROUTES` to the `getAllRoutes()` return. (`COUNTY_SLUGS` already exists in this file.)

- [ ] **Step 4: Register routes** in `src/App.tsx` — import the three pages and add, alongside the existing `/preview/v1` standalone route (NOT inside `LayoutRoute`):
```tsx
import MarketHub from "./pages/preview/market/MarketHub";
import MarketCounty from "./pages/preview/market/MarketCounty";
import MarketMunicipality from "./pages/preview/market/MarketMunicipality";
// ...
<Route path="/preview/v1/market" element={<MarketHub />} />
<Route path="/preview/v1/market/:county" element={<MarketCounty />} />
<Route path="/preview/v1/market/:county/:municipality" element={<MarketMunicipality />} />
```
> These imports require Tasks 7–9 to exist. If doing this task before the pages exist, create minimal placeholder components first (a `return <div>…</div>`) so the app compiles, then flesh them out in Tasks 7–9. Prefer doing Task 6's App.tsx wiring AFTER Tasks 7–9, or use placeholders.

- [ ] **Step 5:** `npx vitest run scripts/routes.test.ts` → PASS. `npm test` green. Commit:
```bash
git add scripts/routes.ts scripts/routes.test.ts src/App.tsx
git commit -m "feat(market): register market routes (noindex) in manifest + router"
```

---

## Task 7: Market Hub page (Tier 1)

**Files:** Create `src/pages/preview/market/MarketHub.tsx`. **Invoke `frontend-design` skill first.**

Compose (in the navy/gold design, using `_shared` primitives):
1. `<PreviewHeader />`.
2. Hero `<ParallaxBand src={IMG.skyline} overlay="bg-[#0a1424]/65" minH="min-h-[60vh]">` with kicker "Metro Milwaukee Market", `font-display` H1, and the data month ("June 2026 data") from `getCountySnapshot("milwaukee-county")?.dataMonth`.
3. **County cards** (4) — image-driven (PreviewV1 guide-card style), one per `COUNTY_SLUGS`. Each: county hero image (reuse `heroCounties[i].img`), name, Median Price + YoY (from `getCountySnapshot(slug)`), Days on Market, and a small sparkline (`MarketTrendChart` with `getCountySeries(display,"median_price")`, compact). `<Link to={\`/preview/v1/market/${slug}\`}>`.
4. **Cross-county comparison** — a `MarketTrendChart`-style overlay of all 4 counties' `median_price` series (one `AreaChart`/`LineChart` with 4 lines). If building the multi-line variant is heavy, ship 4 small per-county sparklines in a row and note the comparison chart as a follow-up.
5. CTA band — reuse PreviewV1's "Get started now" pattern (Calendly + phone from `SOCIAL`).
6. `<PreviewFooter />`.
7. **SEO:** `<Seo title="Metro Milwaukee Real Estate Market" description="..." canonicalPath="/preview/v1/market" noindex />` + `<JsonLd data={graph(breadcrumbList([{name:"Home",path:"/preview/v1"},{name:"Market",path:"/preview/v1/market"}]))} />`.

- [ ] Build the page. Add an answer-first factual lead paragraph (e.g. "As of June 2026, median sale prices across metro Milwaukee range from $312,600 in Milwaukee County to $555,000 in Ozaukee County.") for AI extraction.
- [ ] Screenshot `http://localhost:8081/preview/v1/market`, compare to PreviewV1 look, iterate ≥2 passes (header, fonts, navy/gold, card hover, spacing).
- [ ] `npm test` green. Commit `src/pages/preview/market/MarketHub.tsx` with message `feat(market): build market hub (tier 1)`.

---

## Task 8: County page (Tier 2) + trend charts + neighborhood quiz

**Files:** Create `src/pages/preview/market/MarketCounty.tsx`. **Invoke `frontend-design` skill first.**

Read `:county` via `useParams`. Resolve display via `countySlugToDisplay`; snapshot via `getCountySnapshot`; `countyKey = countySlugToKey(slug)`; municipalities via `getSlimByCounty(countyKey)`. If `getCountySnapshot` is null → styled in-page "County not found" with a link back to `/preview/v1/market` (NOT global NotFound).

Compose:
1. `<PreviewHeader />`.
2. Hero `<ParallaxBand>` with county image; if `snapshot.videoUrl` exists, a "Watch the June 2026 market update" button linking to it.
3. **Snapshot grid** — all 6 `snapshot.stats` via `StatCard`.
4. **Trend charts** — `MarketTrendChart` for `median_price`, `days_on_market`, `inventory` from `getCountySeries(display, key)`.
5. **Neighborhood quiz** — placed in a LIGHT band (light background section) so the existing light-themed component reads intentionally:
```tsx
import NeighborhoodQuizSection from "@/components/quiz/NeighborhoodQuizSection";
// ...
<section className="bg-background py-16">
  <div className="mx-auto max-w-5xl px-6">
    <NeighborhoodQuizSection mode="county" contextCounty={countyKey} />
  </div>
</section>
```
6. **Municipality directory** — grid of `getSlimByCounty(countyKey)`; each card uses `municipalityImages[slim.id]` (default import `municipalityImages`) + `slim.display_name`; `<Link to={\`/preview/v1/market/${slug}/${muniSlug}\`}>`. Derive each muni's URL slug from `getAllMunicipalityRoutes()` filtered to this county (guarantees the slug matches the route + resolves), NOT by re-slugifying the name.
7. CTA + `<PreviewFooter />`.
8. **SEO:** `<Seo title={\`${display} Real Estate Market\`} description={\`Median home price, days on market, and trends for ${display}, Wisconsin as of ${snapshot.dataMonth}.\`} canonicalPath={\`/preview/v1/market/${slug}\`} noindex />` + `<JsonLd data={graph(breadcrumbList([...3 levels]), place(display), dataset({ name: \`${display} Real Estate Market Data\`, description: "...", spatial: \`${display}, WI\`, dateModified: "2026-06-01", temporalCoverage: "2025-03/2026-06", url: \`/preview/v1/market/${slug}\` }))} />`.

- [ ] Build; add an answer-first factual lead (median price + YoY from the snapshot, stated in a sentence).
- [ ] Screenshot `http://localhost:8081/preview/v1/market/waukesha-county`; verify charts render with real data, quiz opens and filters to the county, municipality cards link correctly; iterate ≥2 passes.
- [ ] `npm test` green. Commit `feat(market): build county page (tier 2) with charts + quiz`.

---

## Task 9: Municipality page (Tier 3) re-skinned

**Files:** Create `src/pages/preview/market/MarketMunicipality.tsx`. **Invoke `frontend-design` skill first.**

Read `:county`, `:municipality`. `slim = getSlimBySlug(county, municipality)`; if falsy → styled in-page "not found" + link back to the county page. `rapidStats = getRapidStats(slim.id)` (from `@/data/municipalityRapidStats`). `getFullProfile(slim.id)` is async (returns `MunicipalityProfile`) — load in `useEffect` with a loading state (mirror the existing `MunicipalityReport.tsx` pattern).

Compose (navy/gold):
1. `<PreviewHeader />`.
2. Hero `<ParallaxBand src={municipalityImages[slim.id]?.url ...}>` with `slim.display_name` + county.
3. **Snapshot grid** — from `rapidStats` (median_sale_price + `rapidStats.metrics`) and/or `slim.quick_snapshot`, via `StatCard`.
4. **Trend charts** — `MarketTrendChart` for each available metric from `getMuniSeries(slim.id, key)` (`median_price`, `days_on_market`, `inventory`); the null-safe "limited history" note covers sparse munis.
5. **Profile sections** — reuse the DATA from `getFullProfile`: `buyer_lifestyle_fit` and `amenities_character`. Re-skin to the dark theme (either restyle inline, or wrap the existing `BuyerLifestyleFitSection`/`AmenitiesSection` in a light band like the quiz). Prefer a light band wrapper to avoid rebuilding those components.
6. "Schedule a Consultation" CTA (`SOCIAL` + Calendly) + `<PreviewFooter />`.
7. **SEO:** `<Seo title={\`${slim.display_name}, WI Home Prices & Market Data\`} description={...} canonicalPath={...} noindex />` + `<JsonLd>` with `breadcrumbList` (Home → Market → County → Municipality), `place`, and `dataset` (spatial = `${slim.display_name}, WI`).

- [ ] Build; answer-first factual lead from rapidStats median price.
- [ ] Screenshot a data-rich muni (`/preview/v1/market/waukesha-county/brookfield`) AND a sparse one (to confirm the "limited history" fallback); iterate ≥2 passes.
- [ ] `npm test` green. Commit `feat(market): build municipality page (tier 3), re-skinned`.

---

## Task 10: Full build + prerender verification

- [ ] **Step 1:** `npm run build` — confirm the chain succeeds and the prerender now covers the market routes (count jumps by ~64: hub + 4 counties + 59 munis). 0 FAILED.
- [ ] **Step 2:** Confirm market pages are `noindex` in static HTML and excluded from the sitemap:
  - `grep -c 'market' public/sitemap.xml` → `0` (market routes are noindex).
  - `grep -o '<meta name="robots"[^>]*>' dist/preview/v1/market/index.html` → `noindex, nofollow`.
  - `grep -o '"@type":"Dataset"' dist/preview/v1/market/waukesha-county/index.html` → present (schema in static HTML).
- [ ] **Step 3:** `npm test` → all green.
- [ ] **Step 4:** Commit any regenerated `public/sitemap.xml`/`public/llms.txt` if changed: `git add public/sitemap.xml public/llms.txt && git commit -m "build(market): regenerate sitemap/llms with market routes excluded"` (only if changed).

---

## Self-review (against the market-hub spec)

- 3 tiers Hub→County→Municipality (spec §5–7): Tasks 7–9. ✓
- Snapshot + trend charts (spec data-depth): `getCountySnapshot` + `MarketTrendChart` + history adapters (Tasks 3–5, 7–9). ✓
- Shared extraction, non-destructive (spec §3): Tasks 1–2; PreviewV1 screenshot-verified unchanged. ✓
- Neighborhood quiz on county tier (spec + user add): Task 8. ✓
- Municipality re-skin (spec §7): Task 9. ✓
- SEO-first, noindex preview routes, Dataset/Place/Breadcrumb (Phase-1 infra): Tasks 6–10. ✓
- Null/sparse data handling (spec §8): `clean()` in history adapters + chart fallback. ✓
- Error states for unknown slugs (spec §8): Tasks 8–9 in-page not-found. ✓

**Deferred / follow-up:** real listing photos (still Wikimedia/Pexels placeholders), promotion out of `noindex` at cutover, multi-line comparison chart if shipped as sparklines, lifting preview routes into the sitemap when the redesign goes live.

---

## Execution handoff
After the plan is approved: subagent-driven-development (fresh subagent per task; visual tasks 7–9 each invoke frontend-design + screenshot-verify) or executing-plans. Note: Tasks 7–9 are visual and need screenshot iteration, so they are less amenable to pure TDD than Tasks 1–6.
