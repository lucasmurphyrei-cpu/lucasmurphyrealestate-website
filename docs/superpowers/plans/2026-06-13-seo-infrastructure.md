# SEO & AI-Ranking Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable SEO/AI-ranking foundation (centralized config, `<Seo>` + JSON-LD components, schema builders, a single route manifest, build-time prerendering, and generated `sitemap.xml` + `llms.txt`) so every existing route ships crawlable static HTML with correct per-page metadata, and the upcoming market-hub pages can plug straight into it.

**Architecture:** A pure `siteConfig` module is the single source of truth for URLs/brand. Pure `schema.ts` builders return schema.org objects rendered by a `<JsonLd>` component; a `<Seo>` component centralizes Helmet head tags. One route manifest (`scripts/routes.ts`, sharing the real `municipalityLookup` slug maps) drives both a generated `sitemap.xml` and a Puppeteer postbuild prerender that writes `dist/<route>/index.html` for every route. The app keeps `createRoot` (no hydration) — crawlers get full static HTML, users get the live SPA on mount.

**Tech Stack:** Vite 5, React 18, react-router-dom 6, react-helmet-async, Vitest + jsdom + Testing Library, Puppeteer (new devDep), tsx (new devDep for running TS build scripts), Vercel hosting.

---

## Conventions for the implementer

- Run a single test file: `npx vitest run <path> -t "<name>"` (or omit `-t` for the whole file). Vitest has `globals: true`, so `describe/it/expect` are available without imports, but existing tests import them explicitly — match that.
- The `@` alias maps to `src/` **inside the app and Vitest** (configured in `vite.config.ts` / `vitest.config.ts`). It does **not** resolve in plain Node. Therefore: app code imports via `@/...`; `scripts/*.ts` import app modules via **relative paths** (e.g. `../src/data/municipalityLookup`) and run under `tsx`.
- Brand facts (verbatim — do not invent):
  - `SITE_URL` = `https://www.lucasmurphyrealestate.com` (this app owns the apex domain — confirmed live)
  - Name: `Lucas Murphy Real Estate`; Agent: `Lucas Murphy`, Realtor
  - Brokerage: `Provision Properties Core Team — eXp Realty`
  - Phone: `(414) 458-1952` / E.164 `+14144581952`; Email: `lucas.murphy@exprealty.com`
  - Calendly: `https://calendly.com/lucasmurphyrei`
  - Facebook: `https://www.facebook.com/LucasMurphyRealtor`
  - YouTube: `https://www.youtube.com/@LucasMurphy-LivingInMilwaukee/featured`
  - Google profile: `https://maps.app.goo.gl/fRXnkYuqMmkL4GH87`
  - Counties served: Milwaukee, Waukesha, Ozaukee, Washington (Wisconsin)
  - Default OG image path: `/og-image.png`
- New-copy style: avoid em-dashes in user-facing strings (Lucas's preference). Existing brokerage string keeps its em-dash as-is (it is data, not new copy).
- Commit after every task.

---

## File structure

**Create:**
- `src/lib/siteConfig.ts` — brand/URL constants (no `@` imports; relative-import-safe).
- `src/lib/seo/schema.ts` — pure schema.org builder functions.
- `src/components/seo/JsonLd.tsx` — renders a JSON-LD `<script>`.
- `src/components/seo/Seo.tsx` — Helmet wrapper for per-page head tags.
- `scripts/routes.ts` — the canonical route manifest (static + county + municipality + preview).
- `scripts/sitemap.ts` — pure `buildSitemapXml(routes)` + a `main()` that writes `public/sitemap.xml`.
- `scripts/llms.ts` — pure `buildLlmsTxt(routes)` + a `main()` that writes `public/llms.txt`.
- `scripts/prerender.ts` — postbuild Puppeteer prerender over the manifest.
- Tests: `src/lib/seo/schema.test.ts`, `src/components/seo/JsonLd.test.tsx`, `src/components/seo/Seo.test.tsx`, `scripts/routes.test.ts`, `scripts/sitemap.test.ts`, `scripts/llms.test.ts`, `src/data/municipalityLookup.routes.test.ts`.

**Modify:**
- `src/data/municipalityLookup.ts` — add `getAllMunicipalityRoutes()`.
- `package.json` — add `tsx`, `puppeteer` devDeps; add `prebuild`/`postbuild`/script entries.
- `vercel.json` — ensure prerendered files are served before the SPA catch-all rewrite.
- `src/pages/Index.tsx` — replace the hand-written Helmet+JSON-LD block with `<Seo>` + `<JsonLd>` (proves the infra on the highest-value page).

---

## Task 1: `siteConfig.ts` — single source of truth

**Files:**
- Create: `src/lib/siteConfig.ts`
- Test: `src/lib/siteConfig.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/siteConfig.test.ts
import { describe, it, expect } from "vitest";
import { siteConfig, absoluteUrl } from "./siteConfig";

describe("siteConfig", () => {
  it("has a SITE_URL with no trailing slash", () => {
    expect(siteConfig.url).toBe("https://www.lucasmurphyrealestate.com");
    expect(siteConfig.url.endsWith("/")).toBe(false);
  });

  it("serves four Wisconsin counties", () => {
    expect(siteConfig.counties).toHaveLength(4);
    expect(siteConfig.counties).toContain("Waukesha");
  });

  it("absoluteUrl joins a path onto the site URL exactly once", () => {
    expect(absoluteUrl("/areas/waukesha-county")).toBe(
      "https://www.lucasmurphyrealestate.com/areas/waukesha-county"
    );
    expect(absoluteUrl("/")).toBe("https://www.lucasmurphyrealestate.com/");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/siteConfig.test.ts`
Expected: FAIL — cannot find module `./siteConfig`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/siteConfig.ts
export const siteConfig = {
  url: "https://www.lucasmurphyrealestate.com",
  name: "Lucas Murphy Real Estate",
  agent: { name: "Lucas Murphy", jobTitle: "Realtor" },
  brokerage: "Provision Properties Core Team — eXp Realty",
  phone: "(414) 458-1952",
  phoneE164: "+14144581952",
  email: "lucas.murphy@exprealty.com",
  calendly: "https://calendly.com/lucasmurphyrei",
  social: {
    facebook: "https://www.facebook.com/LucasMurphyRealtor",
    youtube: "https://www.youtube.com/@LucasMurphy-LivingInMilwaukee/featured",
    google: "https://maps.app.goo.gl/fRXnkYuqMmkL4GH87",
  },
  counties: ["Milwaukee", "Waukesha", "Ozaukee", "Washington"] as const,
  defaultOgImage: "/og-image.png",
} as const;

/** Join a root-relative path onto the site URL without doubling the slash. */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${siteConfig.url}${path}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/siteConfig.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/siteConfig.ts src/lib/siteConfig.test.ts
git commit -m "feat(seo): add centralized siteConfig and absoluteUrl helper"
```

---

## Task 2: `schema.ts` — pure schema.org builders

**Files:**
- Create: `src/lib/seo/schema.ts`
- Test: `src/lib/seo/schema.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/seo/schema.test.ts
import { describe, it, expect } from "vitest";
import {
  realEstateAgent,
  webSite,
  breadcrumbList,
  place,
  dataset,
  faqPage,
  aggregateRating,
} from "./schema";

describe("schema builders", () => {
  it("realEstateAgent has type, name, brokerage and 4 areas served", () => {
    const s = realEstateAgent();
    expect(s["@type"]).toBe("RealEstateAgent");
    expect(s.name).toBe("Lucas Murphy");
    expect(s.worksFor.name).toContain("eXp Realty");
    expect(s.areaServed).toHaveLength(4);
  });

  it("webSite includes a SearchAction potentialAction", () => {
    const s = webSite();
    expect(s["@type"]).toBe("WebSite");
    expect(s.potentialAction["@type"]).toBe("SearchAction");
  });

  it("breadcrumbList numbers positions from 1 and builds absolute item URLs", () => {
    const s = breadcrumbList([
      { name: "Market", path: "/preview/v1/market" },
      { name: "Waukesha County", path: "/preview/v1/market/waukesha-county" },
    ]);
    expect(s["@type"]).toBe("BreadcrumbList");
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[1].item).toBe(
      "https://www.lucasmurphyrealestate.com/preview/v1/market/waukesha-county"
    );
  });

  it("place carries spatial name and state", () => {
    const s = place("Waukesha County");
    expect(s["@type"]).toBe("Place");
    expect(s.name).toBe("Waukesha County, WI");
  });

  it("dataset records temporalCoverage, spatialCoverage and source", () => {
    const s = dataset({
      name: "Waukesha County Real Estate Market Data",
      description: "Monthly median sale price and market metrics.",
      spatial: "Waukesha County, WI",
      dateModified: "2026-06-01",
      temporalCoverage: "2025-03/2026-06",
      url: "/preview/v1/market/waukesha-county",
    });
    expect(s["@type"]).toBe("Dataset");
    expect(s.spatialCoverage).toBe("Waukesha County, WI");
    expect(s.temporalCoverage).toBe("2025-03/2026-06");
    expect(s.url).toBe(
      "https://www.lucasmurphyrealestate.com/preview/v1/market/waukesha-county"
    );
  });

  it("faqPage maps Q/A pairs into Question/Answer nodes", () => {
    const s = faqPage([{ q: "What is the median price?", a: "$539,950 as of June 2026." }]);
    expect(s["@type"]).toBe("FAQPage");
    expect(s.mainEntity[0]["@type"]).toBe("Question");
    expect(s.mainEntity[0].acceptedAnswer.text).toContain("539,950");
  });

  it("aggregateRating clamps to ratingValue and reviewCount", () => {
    const s = aggregateRating({ ratingValue: 5, reviewCount: 27 });
    expect(s["@type"]).toBe("AggregateRating");
    expect(s.reviewCount).toBe(27);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/seo/schema.test.ts`
Expected: FAIL — cannot find module `./schema`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/lib/seo/schema.ts
import { siteConfig, absoluteUrl } from "@/lib/siteConfig";

const areaServed = () => siteConfig.counties.map((c) => `${c} County, WI`);

export function organization() {
  return {
    "@type": "Organization",
    name: siteConfig.brokerage,
    url: siteConfig.url,
  };
}

export function realEstateAgent() {
  return {
    "@type": "RealEstateAgent",
    name: siteConfig.agent.name,
    jobTitle: siteConfig.agent.jobTitle,
    worksFor: organization(),
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phoneE164,
    areaServed: areaServed(),
    sameAs: [siteConfig.social.facebook, siteConfig.social.youtube, siteConfig.social.google],
    description:
      "Expert real estate services in Milwaukee, Waukesha, Washington & Ozaukee Counties, Wisconsin.",
  };
}

export function webSite() {
  return {
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function place(countyName: string) {
  return { "@type": "Place", name: `${countyName}, WI` };
}

export function dataset(opts: {
  name: string;
  description: string;
  spatial: string;
  dateModified: string;
  temporalCoverage: string;
  url: string;
}) {
  return {
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    spatialCoverage: opts.spatial,
    temporalCoverage: opts.temporalCoverage,
    dateModified: opts.dateModified,
    url: absoluteUrl(opts.url),
    creator: organization(),
    isAccessibleForFree: true,
  };
}

export function faqPage(qas: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: qas.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function article(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
}) {
  return {
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.url),
    author: realEstateAgent(),
    publisher: organization(),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
  };
}

export function aggregateRating(opts: { ratingValue: number; reviewCount: number }) {
  return {
    "@type": "AggregateRating",
    ratingValue: opts.ratingValue,
    reviewCount: opts.reviewCount,
    bestRating: 5,
  };
}

/** Wrap one or more schema nodes into a @graph document. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/seo/schema.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/schema.ts src/lib/seo/schema.test.ts
git commit -m "feat(seo): add schema.org builders (agent, dataset, breadcrumb, faq, etc.)"
```

---

## Task 3: `JsonLd` component

**Files:**
- Create: `src/components/seo/JsonLd.tsx`
- Test: `src/components/seo/JsonLd.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/seo/JsonLd.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import JsonLd from "./JsonLd";
import { graph, realEstateAgent } from "@/lib/seo/schema";

describe("JsonLd", () => {
  it("renders a schema.org script with the agent name", () => {
    const { container } = render(<JsonLd data={graph(realEstateAgent())} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    const json = JSON.parse(script!.textContent || "{}");
    expect(json["@context"]).toBe("https://schema.org");
    expect(json["@graph"][0].name).toBe("Lucas Murphy");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/seo/JsonLd.test.tsx`
Expected: FAIL — cannot find module `./JsonLd`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/seo/JsonLd.tsx
interface JsonLdProps {
  data: object;
}

/** Inline JSON-LD. Body-level JSON-LD is valid and is captured by the prerenderer. */
const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/seo/JsonLd.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/seo/JsonLd.tsx src/components/seo/JsonLd.test.tsx
git commit -m "feat(seo): add JsonLd component"
```

---

## Task 4: `Seo` component

**Files:**
- Create: `src/components/seo/Seo.tsx`
- Test: `src/components/seo/Seo.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/seo/Seo.test.tsx
import { describe, it, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Seo from "./Seo";

const renderSeo = (props: React.ComponentProps<typeof Seo>) =>
  render(
    <HelmetProvider>
      <Seo {...props} />
    </HelmetProvider>
  );

describe("Seo", () => {
  it("sets the title and self-referential canonical", async () => {
    renderSeo({ title: "Waukesha County Market", canonicalPath: "/areas/waukesha-county" });
    await waitFor(() =>
      expect(document.title).toBe("Waukesha County Market | Lucas Murphy Real Estate")
    );
    const canon = document.querySelector('link[rel="canonical"]');
    expect(canon?.getAttribute("href")).toBe(
      "https://www.lucasmurphyrealestate.com/areas/waukesha-county"
    );
  });

  it("emits robots noindex when noindex is set", async () => {
    renderSeo({ title: "Preview", canonicalPath: "/preview/v1", noindex: true });
    await waitFor(() => {
      const robots = document.querySelector('meta[name="robots"]');
      expect(robots?.getAttribute("content")).toBe("noindex, nofollow");
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/seo/Seo.test.tsx`
Expected: FAIL — cannot find module `./Seo`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/seo/Seo.tsx
import { Helmet } from "react-helmet-async";
import { siteConfig, absoluteUrl } from "@/lib/siteConfig";

interface SeoProps {
  title: string;
  description?: string;
  canonicalPath: string;
  ogImage?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const Seo = ({
  title,
  description,
  canonicalPath,
  ogImage,
  type = "website",
  noindex = false,
}: SeoProps) => {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const canonical = absoluteUrl(canonicalPath);
  const image = absoluteUrl(ogImage ?? siteConfig.defaultOgImage);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Seo;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/seo/Seo.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/seo/Seo.tsx src/components/seo/Seo.test.tsx
git commit -m "feat(seo): add Seo component for per-page head tags"
```

---

## Task 5: `getAllMunicipalityRoutes()` on municipalityLookup

**Files:**
- Modify: `src/data/municipalityLookup.ts` (add one exported function near the other `get*` exports)
- Test: `src/data/municipalityLookup.routes.test.ts`

Context: the module already builds an internal `slimBySlug` Map keyed by `"<county-slug>/<municipality-slug>"`. Exposing those keys guarantees the generated routes match exactly what `getSlimBySlug` resolves (no slug drift).

- [ ] **Step 1: Write the failing test**

```ts
// src/data/municipalityLookup.routes.test.ts
import { describe, it, expect } from "vitest";
import { getAllMunicipalityRoutes, getSlimBySlug } from "./municipalityLookup";

describe("getAllMunicipalityRoutes", () => {
  it("returns one route per municipality with resolvable slugs", () => {
    const routes = getAllMunicipalityRoutes();
    expect(routes.length).toBeGreaterThanOrEqual(50);
    for (const r of routes) {
      expect(r.countySlug).toMatch(/-county$/);
      // every generated slug pair must resolve back through the public lookup
      expect(getSlimBySlug(r.countySlug, r.muniSlug)).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/municipalityLookup.routes.test.ts`
Expected: FAIL — `getAllMunicipalityRoutes` is not exported.

- [ ] **Step 3: Add the implementation**

Add to `src/data/municipalityLookup.ts` (the internal `slimBySlug` Map is keyed `"<countySlug>/<muniSlug>"`):

```ts
export interface MunicipalityRoute {
  countySlug: string;
  muniSlug: string;
  displayName: string;
  id: string;
}

export function getAllMunicipalityRoutes(): MunicipalityRoute[] {
  const routes: MunicipalityRoute[] = [];
  for (const [key, slim] of slimBySlug.entries()) {
    const [countySlug, muniSlug] = key.split("/");
    routes.push({ countySlug, muniSlug, displayName: slim.display_name, id: slim.id });
  }
  return routes;
}
```

> If `slimBySlug` is declared after this function in the file, move the function below the map's population loop, or keep it at the bottom of the module. It must run after the map is filled.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/municipalityLookup.routes.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/municipalityLookup.ts src/data/municipalityLookup.routes.test.ts
git commit -m "feat(seo): expose getAllMunicipalityRoutes for the route manifest"
```

---

## Task 6: Route manifest (`scripts/routes.ts`)

**Files:**
- Create: `scripts/routes.ts`
- Test: `scripts/routes.test.ts`

Note: `scripts/*.ts` import app modules by **relative path** so they run under both `tsx` and Vitest. `municipalityLookup` only uses relative imports internally, so this is safe.

- [ ] **Step 1: Write the failing test**

```ts
// scripts/routes.test.ts
import { describe, it, expect } from "vitest";
import { getAllRoutes, RouteEntry } from "./routes";

describe("route manifest", () => {
  it("includes core static routes", () => {
    const paths = getAllRoutes().map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/guides");
    expect(paths).toContain("/contact");
  });

  it("includes 4 county routes and 50+ municipality routes", () => {
    const routes = getAllRoutes();
    const counties = routes.filter((r) => /^\/areas\/[a-z-]+-county$/.test(r.path));
    const munis = routes.filter((r) => /^\/areas\/[a-z-]+-county\/.+/.test(r.path));
    expect(counties).toHaveLength(4);
    expect(munis.length).toBeGreaterThanOrEqual(50);
  });

  it("marks preview routes noindex", () => {
    const preview = getAllRoutes().find((r) => r.path === "/preview/v1");
    expect(preview?.noindex).toBe(true);
  });

  it("every route has changefreq and a priority between 0 and 1", () => {
    for (const r of getAllRoutes() as RouteEntry[]) {
      expect(r.changefreq).toBeTruthy();
      expect(r.priority).toBeGreaterThan(0);
      expect(r.priority).toBeLessThanOrEqual(1);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/routes.test.ts`
Expected: FAIL — cannot find module `./routes`.

- [ ] **Step 3: Write minimal implementation**

```ts
// scripts/routes.ts
import { getAllMunicipalityRoutes } from "../src/data/municipalityLookup";

export interface RouteEntry {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
  noindex?: boolean;
}

const STATIC_ROUTES: RouteEntry[] = [
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/contact", changefreq: "monthly", priority: 0.8 },
  { path: "/guides", changefreq: "weekly", priority: 0.9 },
  { path: "/guides/first-time-home-buyers", changefreq: "monthly", priority: 0.8 },
  { path: "/guides/first-time-condo-buyers", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/relocation", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/investors", changefreq: "monthly", priority: 0.7 },
  { path: "/guides/sellers", changefreq: "monthly", priority: 0.7 },
  { path: "/first-time-homebuyers-guide", changefreq: "monthly", priority: 0.9 },
  { path: "/resources/contractors", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/lenders", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/home-inspectors", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/home-insurance", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/seasonal-guide", changefreq: "monthly", priority: 0.6 },
  { path: "/resources/movers", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/mortgage-calculator", changefreq: "monthly", priority: 0.7 },
  { path: "/tools/budget-spreadsheet", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/budget-planner", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/house-hack-calculator", changefreq: "monthly", priority: 0.7 },
  { path: "/tools/investor-spreadsheets", changefreq: "monthly", priority: 0.6 },
  { path: "/tools/cma", changefreq: "monthly", priority: 0.6 },
];

const COUNTY_SLUGS = [
  "milwaukee-county",
  "waukesha-county",
  "ozaukee-county",
  "washington-county",
];

const COUNTY_ROUTES: RouteEntry[] = COUNTY_SLUGS.map((slug) => ({
  path: `/areas/${slug}`,
  changefreq: "weekly",
  priority: 0.8,
}));

const MUNICIPALITY_ROUTES: RouteEntry[] = getAllMunicipalityRoutes().map((r) => ({
  path: `/areas/${r.countySlug}/${r.muniSlug}`,
  changefreq: "monthly",
  priority: 0.6,
}));

// Preview routes: prerendered for QA but excluded from the sitemap (noindex).
const PREVIEW_ROUTES: RouteEntry[] = [
  { path: "/preview/v1", changefreq: "monthly", priority: 0.1, noindex: true },
  { path: "/preview/v2", changefreq: "monthly", priority: 0.1, noindex: true },
];

export function getAllRoutes(): RouteEntry[] {
  return [...STATIC_ROUTES, ...COUNTY_ROUTES, ...MUNICIPALITY_ROUTES, ...PREVIEW_ROUTES];
}
```

> When the market-hub plan lands, its routes are appended here as additional `noindex` preview entries (until promotion). This file stays the single source of truth.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/routes.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/routes.ts scripts/routes.test.ts
git commit -m "feat(seo): add canonical route manifest"
```

---

## Task 7: Sitemap generator (`scripts/sitemap.ts`)

**Files:**
- Create: `scripts/sitemap.ts`
- Test: `scripts/sitemap.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// scripts/sitemap.test.ts
import { describe, it, expect } from "vitest";
import { buildSitemapXml } from "./sitemap";

const routes = [
  { path: "/", changefreq: "weekly" as const, priority: 1.0 },
  { path: "/preview/v1", changefreq: "monthly" as const, priority: 0.1, noindex: true },
];

describe("buildSitemapXml", () => {
  it("emits valid XML with the absolute homepage URL", () => {
    const xml = buildSitemapXml(routes, "2026-06-13");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain("<loc>https://www.lucasmurphyrealestate.com/</loc>");
    expect(xml).toContain("<lastmod>2026-06-13</lastmod>");
  });

  it("excludes noindex routes", () => {
    const xml = buildSitemapXml(routes, "2026-06-13");
    expect(xml).not.toContain("/preview/v1");
    expect((xml.match(/<url>/g) || []).length).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/sitemap.test.ts`
Expected: FAIL — cannot find module `./sitemap`.

- [ ] **Step 3: Write minimal implementation**

```ts
// scripts/sitemap.ts
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes, RouteEntry } from "./routes";
import { siteConfig } from "../src/lib/siteConfig";

export function buildSitemapXml(routes: RouteEntry[], lastmod: string): string {
  const urls = routes
    .filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url>\n    <loc>${siteConfig.url}${r.path}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod><changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join("\n");
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls +
    "\n</urlset>\n"
  );
}

// Run directly via tsx: writes public/sitemap.xml
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const today = new Date().toISOString().slice(0, 10);
  const xml = buildSitemapXml(getAllRoutes(), today);
  const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/sitemap.xml");
  writeFileSync(out, xml, "utf8");
  console.log(`sitemap.xml written: ${getAllRoutes().filter((r) => !r.noindex).length} urls`);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/sitemap.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Generate the file and verify it**

Run: `npx tsx scripts/sitemap.ts`
Expected stdout: `sitemap.xml written: <N> urls` (N around 80+). Open `public/sitemap.xml` and confirm county + municipality URLs are present and no `/preview/` URLs appear.

- [ ] **Step 6: Commit**

```bash
git add scripts/sitemap.ts scripts/sitemap.test.ts public/sitemap.xml
git commit -m "feat(seo): generate sitemap.xml from the route manifest"
```

---

## Task 8: `llms.txt` generator (`scripts/llms.ts`)

**Files:**
- Create: `scripts/llms.ts`
- Test: `scripts/llms.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// scripts/llms.test.ts
import { describe, it, expect } from "vitest";
import { buildLlmsTxt } from "./llms";

describe("buildLlmsTxt", () => {
  it("starts with an H1 brand heading and lists the service area", () => {
    const txt = buildLlmsTxt();
    expect(txt.startsWith("# Lucas Murphy Real Estate")).toBe(true);
    expect(txt).toContain("Waukesha");
    expect(txt).toContain("Milwaukee");
  });

  it("links key indexable pages with absolute URLs and excludes noindex routes", () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain("https://www.lucasmurphyrealestate.com/guides");
    expect(txt).not.toContain("/preview/v1");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/llms.test.ts`
Expected: FAIL — cannot find module `./llms`.

- [ ] **Step 3: Write minimal implementation**

```ts
// scripts/llms.ts
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes } from "./routes";
import { siteConfig } from "../src/lib/siteConfig";

export function buildLlmsTxt(): string {
  const indexable = getAllRoutes().filter((r) => !r.noindex);
  const link = (path: string, label: string) =>
    `- [${label}](${siteConfig.url}${path})`;

  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(
    `> ${siteConfig.agent.name}, ${siteConfig.agent.jobTitle} with ${siteConfig.brokerage}. ` +
      `Real estate services across ${siteConfig.counties.join(", ")} Counties in metro Milwaukee, Wisconsin. ` +
      `Free buyer/seller/investor guides, monthly county and municipality market data, and home-buying tools.`
  );
  lines.push("");
  lines.push("## Key pages");
  lines.push(link("/", "Home"));
  lines.push(link("/guides", "Guides overview"));
  lines.push(link("/contact", "Contact"));
  lines.push("");
  lines.push("## Market data by county");
  for (const r of indexable.filter((x) => /^\/areas\/[a-z-]+-county$/.test(x.path))) {
    const name = r.path.split("/").pop()!.replace(/-/g, " ");
    lines.push(link(r.path, name.replace(/\b\w/g, (c) => c.toUpperCase())));
  }
  lines.push("");
  lines.push(`Contact: ${siteConfig.phone} · ${siteConfig.email}`);
  lines.push("");
  return lines.join("\n");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/llms.txt");
  writeFileSync(out, buildLlmsTxt(), "utf8");
  console.log("llms.txt written");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/llms.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Generate the file**

Run: `npx tsx scripts/llms.ts`
Expected stdout: `llms.txt written`. Confirm `public/llms.txt` exists and reads cleanly.

- [ ] **Step 6: Commit**

```bash
git add scripts/llms.ts scripts/llms.test.ts public/llms.txt
git commit -m "feat(seo): generate llms.txt for AI engines"
```

---

## Task 9: Install build-script tooling (tsx + puppeteer)

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install devDependencies**

Run: `npm install -D tsx puppeteer`
Expected: both added under devDependencies; Puppeteer downloads a Chromium build (one-time).

- [ ] **Step 2: Verify tsx runs a script**

Run: `npx tsx scripts/sitemap.ts`
Expected: `sitemap.xml written: <N> urls` (confirms tsx + relative imports work end to end).

- [ ] **Step 3: Verify Puppeteer can launch**

Run: `npx tsx -e "import('puppeteer').then(async p=>{const b=await p.default.launch({headless:'new'});console.log('chromium ok');await b.close();})"`
Expected: prints `chromium ok`. If it fails to find a browser, run `npx puppeteer browsers install chrome` and retry.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "build(seo): add tsx and puppeteer for prerender + generators"
```

---

## Task 10: Prerender script (`scripts/prerender.ts`)

**Files:**
- Create: `scripts/prerender.ts`

This task is verified by running it against a real build (no unit test — it is I/O orchestration).

- [ ] **Step 1: Write the prerender script**

```ts
// scripts/prerender.ts
import { preview } from "vite";
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes } from "./routes";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function run() {
  const server = await preview({
    root,
    preview: { port: 4173, strictPort: false },
  });
  const base = server.resolvedUrls?.local?.[0]?.replace(/\/$/, "");
  if (!base) throw new Error("Could not resolve preview server URL");

  const browser = await puppeteer.launch({ headless: "new" });
  const routes = getAllRoutes();

  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.goto(`${base}${route.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      // Autoplaying hero videos prevent networkidle0; wait for app content instead.
      await page
        .waitForSelector("#root *", { timeout: 15000 })
        .catch(() => console.warn(`  (no #root content for ${route.path})`));
      await new Promise((r) => setTimeout(r, 400)); // let Helmet flush head tags
      const html = await page.content();

      const outDir = resolve(root, "dist", route.path === "/" ? "." : `.${route.path}`);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(resolve(outDir, "index.html"), html, "utf8");
      console.log(`prerendered ${route.path}`);
    } catch (err) {
      console.error(`FAILED ${route.path}:`, (err as Error).message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.httpServer.close();
  console.log(`prerender complete: ${routes.length} routes`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Build, then prerender**

Run: `npm run build && npx tsx scripts/prerender.ts`
Expected: a `prerendered <path>` line per route, then `prerender complete: <N> routes`, with no `FAILED` lines.

- [ ] **Step 3: Verify the prerendered HTML contains real content + correct per-route head**

Run: `grep -o "<title>[^<]*</title>" dist/areas/waukesha-county/index.html`
Expected: a Waukesha-specific title (NOT the homepage title). Then:

Run: `grep -c "application/ld+json" dist/index.html`
Expected: at least `1` (homepage JSON-LD present in static HTML).

Run: `grep -o '<link rel="canonical" href="[^"]*"' dist/areas/waukesha-county/index.html`
Expected: `...href="https://www.lucasmurphyrealestate.com/areas/waukesha-county"` (self-canonical, not the homepage).

- [ ] **Step 4: Commit**

```bash
git add scripts/prerender.ts
git commit -m "feat(seo): add Puppeteer postbuild prerender over the route manifest"
```

---

## Task 11: Wire generators + prerender into the build

**Files:**
- Modify: `package.json` (scripts)

- [ ] **Step 1: Add build hooks**

In `package.json` `scripts`, add/replace:

```json
"seo:sitemap": "tsx scripts/sitemap.ts",
"seo:llms": "tsx scripts/llms.ts",
"prebuild": "tsx scripts/sitemap.ts && tsx scripts/llms.ts",
"postbuild": "tsx scripts/prerender.ts"
```

(Keep existing `dev`, `build`, `build:dev`, `lint`, `preview`, `test`, `test:watch`.)

- [ ] **Step 2: Run a full build and confirm the chain fires**

Run: `npm run build`
Expected order in output: sitemap written → llms written → Vite build → `prerendered ...` lines → `prerender complete`.

- [ ] **Step 3: Confirm test suite still green**

Run: `npm test`
Expected: all tests pass (existing + new SEO tests).

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "build(seo): run sitemap/llms in prebuild and prerender in postbuild"
```

---

## Task 12: Ensure Vercel serves prerendered files before the SPA fallback

**Files:**
- Modify: `vercel.json`

The current rewrite `"/((?!assets|favicon|robots|sitemap|Your_First).*)" -> "/index.html"` must not shadow a prerendered file. Vercel checks the filesystem before applying rewrites, and `cleanUrls` maps `/areas/x` to the prerendered `/areas/x/index.html`. Make that explicit.

- [ ] **Step 1: Update vercel.json**

Add `"cleanUrls": true` and `"trailingSlash": false` at the top level (keep existing `redirects` and `rewrites`):

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    { "source": "/guide/first-time-homebuyer-metro-milwaukee", "destination": "https://lucasmurphyrealestate-main.vercel.app/guide/first-time-homebuyer-metro-milwaukee", "permanent": false },
    { "source": "/guide/condominium-ownership-guide", "destination": "https://lucasmurphyrealestate-main.vercel.app/guide/condominium-ownership-guide", "permanent": false },
    { "source": "/guide/relocation-guide-metro-milwaukee", "destination": "https://lucasmurphyrealestate-main.vercel.app/guide/relocation-guide-metro-milwaukee", "permanent": false },
    { "source": "/guide/house-hacking-guide", "destination": "https://lucasmurphyrealestate-main.vercel.app/guide/house-hacking-guide", "permanent": false }
  ],
  "rewrites": [
    { "source": "/((?!assets|favicon|robots|sitemap|llms|Your_First).*)", "destination": "/index.html" }
  ]
}
```

(Note: `llms` added to the rewrite negative-lookahead so `/llms.txt` is served directly.)

- [ ] **Step 2: Verify locally with `vite preview` against the prerendered dist**

Run: `npm run build && npm run preview` then in another shell:
`curl -s http://localhost:4173/areas/waukesha-county | grep -o "<title>[^<]*</title>"`
Expected: the Waukesha-specific title served as static HTML.

> Final confirmation of Vercel's file-before-rewrite behavior happens on a Vercel preview deployment (out of scope for local execution); note this in the PR description so it is checked at deploy time.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "build(seo): serve prerendered files + llms.txt before SPA fallback"
```

---

## Task 13: Prove the infra on the homepage (migrate Index.tsx)

**Files:**
- Modify: `src/pages/Index.tsx` (replace the inline Helmet + hand-written JSON-LD block, around lines 75–135, with the new components)

- [ ] **Step 1: Replace the head/JSON-LD block**

Remove the existing `<Helmet>...</Helmet>` and the `<script type="application/ld+json" dangerouslySetInnerHTML=... />` block in `Index.tsx`. Add the imports at the top:

```tsx
import Seo from "@/components/seo/Seo";
import JsonLd from "@/components/seo/JsonLd";
import { graph, realEstateAgent, webSite } from "@/lib/seo/schema";
```

Insert near the top of the returned JSX (replacing what you removed):

```tsx
<Seo
  title="Milwaukee Metro Guides, Market Insights & Strategy"
  description="Expert real estate services in Milwaukee, Waukesha, Washington & Ozaukee Counties. Free guides, market reports, mortgage tools, and trusted professional recommendations."
  canonicalPath="/"
/>
<JsonLd data={graph(realEstateAgent(), webSite())} />
```

- [ ] **Step 2: Confirm the homepage still renders and tests pass**

Run: `npm test`
Expected: green.

Run (with dev server on :8081): open `http://localhost:8081/` and confirm the page renders unchanged and the document `<title>` reads `Milwaukee Metro Guides, Market Insights & Strategy | Lucas Murphy Real Estate`.

- [ ] **Step 3: Verify prerendered homepage carries the schema**

Run: `npm run build && grep -o '"@type":"RealEstateAgent"' dist/index.html`
Expected: one match (schema is in the static HTML, not just post-JS).

- [ ] **Step 4: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "refactor(seo): migrate homepage to Seo + JsonLd + schema builders"
```

---

## Self-review (completed against the SEO/AI spec)

- **Prerendering** (spec §2): Tasks 9–12 — Puppeteer postbuild, `createRoot` retained, Vercel file-before-rewrite + `cleanUrls`. ✓
- **Reusable components** (spec §3): `siteConfig` (T1), `schema.ts` (T2), `JsonLd` (T3), `Seo` (T4). ✓
- **Structured data builders** (spec §4): agent/website/breadcrumb/place/dataset/faq/article/aggregateRating in T2; consumed on homepage in T13; per-page rollout to county/municipality/guide pages happens in the market-hub plan and the live-page rollout (see "Deferred"). ✓ (builders ready)
- **Route manifest + sitemap automation** (spec §5): T5–T7. ✓
- **llms.txt** (spec §6): T8. ✓
- **robots.txt**: already allows AI crawlers; T12 ensures `/llms.txt` is reachable. ✓
- **Per-page meta coverage** (spec §7): `Seo` component ready (T4); homepage migrated (T13). Full migration of remaining live pages is the deferred rollout below.
- **Performance** (spec §8): explicitly secondary; not in this plan.

**Deferred to follow-on work (not this plan):**
- Migrating every existing live page (guides, resources, tools, county, municipality) to `<Seo>` + page-appropriate schema (BreadcrumbList, Dataset/Place, FAQ). This plan ships the infra + proves it on the homepage; the market-hub plan builds its pages SEO-first on this foundation, and a light-touch live-page rollout follows.
- Appending market-hub routes to `scripts/routes.ts` — done in the market-hub plan.

---

## Execution handoff

See the chat message for the two execution options (subagent-driven vs inline).
