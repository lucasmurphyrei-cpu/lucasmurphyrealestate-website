# Municipality Profile Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.
> **Project rules:** visual tasks should verify with the scrolling screenshot helper `node scroll-shot.mjs <url> <label>` (run from the project parent root `/Users/macbook/Desktop/Claude Code - Real Estate Website Building`), because the market pages use `whileInView` reveals that a no-scroll capture leaves invisible.

**Goal:** Enrich the municipality market page with a "vital signs" Buyer & Lifestyle Fit dashboard and a featured-places + list Amenities treatment, backed by a new structured data overlay, piloted on Wauwatosa and Waukesha.

**Architecture:** A new additive `src/data/marketProfiles.ts` overlay (keyed by municipality id) holds structured lifestyle vitals + featured/other amenities. New presentational components render it. `MarketMunicipality.tsx` branches: enriched data → rich UI; otherwise the existing `ProfileCard` blocks (unchanged for the other 57 municipalities). Nothing touches `profiles.json`, the live `MunicipalityReport`, or the shared `BuyerLifestyleFitSection`/`AmenitiesSection`.

**Tech Stack:** React 18 + TS, framer-motion, Tailwind, Vitest + jsdom + Testing Library. Brand gold `hsl(44, 100%, 53%)`, navy `#0a1424`, `font-display` (Playfair).

---

## Conventions
- Base branch: stack on `feat/market-hub` (this builds on the market pages). Create `feat/market-profile-enrichment`.
- NEVER `git add -A` (uncommitted redesign in tree). Stage only the files each task names.
- `@` alias = `src/`. Run a test: `npx vitest run <path>`. Suite: `npm test`.
- Dev server on `http://localhost:8081`. Avoid em-dashes in user-facing copy.
- Reuse the `GOLD = "hsl(44, 100%, 53%)"` convention used in `MarketMunicipality.tsx`.

## File structure

**Create:**
- `src/data/marketProfiles.ts` — typed overlay + `getMarketProfile(id)` (Task 1; data filled in Tasks 8-9).
- `src/pages/preview/_shared/lifestyle/WalkScoreGauge.tsx` (+ test) — Task 2.
- `src/pages/preview/_shared/lifestyle/SafetyBadge.tsx` (+ test) — Task 3.
- `src/pages/preview/_shared/lifestyle/CommuteStat.tsx`, `IdealBuyerChips.tsx` — Task 4.
- `src/pages/preview/_shared/lifestyle/LifestyleVitals.tsx` — Task 5 (composes the 4 above from `LifestyleVitals` data).
- `src/pages/preview/_shared/amenities/FeaturedPlaceCard.tsx`, `MoreToExplore.tsx`, `AmenitiesFeatured.tsx` — Task 6.

**Modify:**
- `src/pages/preview/market/MarketMunicipality.tsx` — branch on `getMarketProfile` — Task 7.

---

## Task 1: `marketProfiles.ts` overlay + accessor

**Files:** Create `src/data/marketProfiles.ts`, `src/data/marketProfiles.test.ts`.

- [ ] **Step 1: Write the failing test**
```ts
// src/data/marketProfiles.test.ts
import { describe, it, expect } from "vitest";
import { getMarketProfile } from "./marketProfiles";

describe("getMarketProfile", () => {
  it("returns null for a municipality with no overlay entry", () => {
    expect(getMarketProfile("nonexistent-id")).toBeNull();
  });
});
```

- [ ] **Step 2: Run → FAIL** (`npx vitest run src/data/marketProfiles.test.ts`).

- [ ] **Step 3: Implement** (types + empty registry; data added in Tasks 8-9)
```ts
// src/data/marketProfiles.ts
export interface MarketPhoto {
  url: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl: string;
}
export interface FeaturedPlace {
  name: string;
  category: string;
  blurb: string;
  photo?: MarketPhoto;
}
export interface LifestyleVitalsData {
  walkScore: { value: number; label: string };
  commute: { carMinutes: string; routes: string[]; transitNote?: string };
  safety: { grade: string; percentile?: number; note: string };
  idealBuyer: { tags: string[]; summary: string };
}
export interface MarketProfile {
  lifestyle: LifestyleVitalsData;
  amenities: { featured: FeaturedPlace[]; more: { name: string; category: string }[] };
}

const marketProfiles: Record<string, MarketProfile> = {};

export function getMarketProfile(id: string): MarketProfile | null {
  return marketProfiles[id] ?? null;
}
export default marketProfiles;
```

- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5: Commit**
```bash
git add src/data/marketProfiles.ts src/data/marketProfiles.test.ts
git commit -m "feat(market): add marketProfiles overlay types + accessor"
```

---

## Task 2: `WalkScoreGauge`

**Files:** Create `src/pages/preview/_shared/lifestyle/WalkScoreGauge.tsx`, `.test.tsx`.

- [ ] **Step 1: Failing test** (pure arc fraction + render)
```tsx
// src/pages/preview/_shared/lifestyle/WalkScoreGauge.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WalkScoreGauge, { gaugeFraction } from "./WalkScoreGauge";

describe("WalkScoreGauge", () => {
  it("clamps the fraction to 0..1", () => {
    expect(gaugeFraction(60)).toBeCloseTo(0.6);
    expect(gaugeFraction(-5)).toBe(0);
    expect(gaugeFraction(140)).toBe(1);
  });
  it("renders the value and label", () => {
    render(<WalkScoreGauge value={60} label="Somewhat Walkable" />);
    expect(screen.getByText("60")).toBeTruthy();
    expect(screen.getByText("Somewhat Walkable")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement** (SVG semicircle arc; gold progress proportional to value)
```tsx
// src/pages/preview/_shared/lifestyle/WalkScoreGauge.tsx
const GOLD = "hsl(44, 100%, 53%)";

export function gaugeFraction(value: number): number {
  return Math.max(0, Math.min(100, value)) / 100;
}

interface Props { value: number; label: string; }

export default function WalkScoreGauge({ value, label }: Props) {
  // Semicircle: radius 52, circumference of the half-arc = PI * r
  const r = 52;
  const half = Math.PI * r;
  const dash = gaugeFraction(value) * half;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-40" role="img" aria-label={`Walk Score ${value} out of 100`}>
        <path d="M8 64 A52 52 0 0 1 112 64" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round" />
        <path
          d="M8 64 A52 52 0 0 1 112 64"
          fill="none"
          stroke={GOLD}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${half}`}
        />
        <text x="60" y="56" textAnchor="middle" className="font-display" fontSize="26" fill="#fff" fontWeight="600">
          {value}
        </text>
      </svg>
      <p className="mt-1 text-sm font-medium text-white/75">{label}</p>
      <p className="text-xs uppercase tracking-wide text-white/40">Walk Score</p>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS** (2 tests).
- [ ] **Step 5: Commit**
```bash
git add src/pages/preview/_shared/lifestyle/WalkScoreGauge.tsx src/pages/preview/_shared/lifestyle/WalkScoreGauge.test.tsx
git commit -m "feat(market): WalkScoreGauge arc gauge"
```

---

## Task 3: `SafetyBadge`

**Files:** Create `src/pages/preview/_shared/lifestyle/SafetyBadge.tsx`, `.test.tsx`.

- [ ] **Step 1: Failing test** (grade → color mapping)
```tsx
// src/pages/preview/_shared/lifestyle/SafetyBadge.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SafetyBadge, { gradeColor } from "./SafetyBadge";

describe("SafetyBadge", () => {
  it("maps grade letter to a color", () => {
    expect(gradeColor("A")).toBe("#10b981");
    expect(gradeColor("B-")).toBe("#84cc16");
    expect(gradeColor("C-")).toBe("#f59e0b");
    expect(gradeColor("D")).toBe("#ef4444");
    expect(gradeColor("F")).toBe("#ef4444");
  });
  it("renders grade, percentile and note", () => {
    render(<SafetyBadge grade="C-" percentile={37} note="NE side is safest" />);
    expect(screen.getByText("C-")).toBeTruthy();
    expect(screen.getByText(/37th percentile/i)).toBeTruthy();
    expect(screen.getByText(/NE side is safest/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL.**

- [ ] **Step 3: Implement**
```tsx
// src/pages/preview/_shared/lifestyle/SafetyBadge.tsx
export function gradeColor(grade: string): string {
  const letter = grade.trim().charAt(0).toUpperCase();
  if (letter === "A") return "#10b981";
  if (letter === "B") return "#84cc16";
  if (letter === "C") return "#f59e0b";
  return "#ef4444"; // D / F / anything worse
}

interface Props { grade: string; percentile?: number; note: string; }

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function SafetyBadge({ grade, percentile, note }: Props) {
  const color = gradeColor(grade);
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl font-display text-xl font-bold text-[#0a1424]"
          style={{ backgroundColor: color }}
        >
          {grade}
        </span>
        {percentile != null && (
          <span className="text-sm font-medium text-white/70">{ordinal(percentile)} percentile</span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{note}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-white/40">Safety (CrimeGrade)</p>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS** (2 tests).
- [ ] **Step 5: Commit**
```bash
git add src/pages/preview/_shared/lifestyle/SafetyBadge.tsx src/pages/preview/_shared/lifestyle/SafetyBadge.test.tsx
git commit -m "feat(market): SafetyBadge grade chip"
```

---

## Task 4: `CommuteStat` + `IdealBuyerChips`

**Files:** Create `src/pages/preview/_shared/lifestyle/CommuteStat.tsx`, `IdealBuyerChips.tsx`. (Visual; covered by page screenshots — no unit tests required.)

- [ ] **Step 1: CommuteStat**
```tsx
// src/pages/preview/_shared/lifestyle/CommuteStat.tsx
import { Car, Bus } from "lucide-react";
const GOLD = "hsl(44, 100%, 53%)";

interface Props { carMinutes: string; routes: string[]; transitNote?: string; }

export default function CommuteStat({ carMinutes, routes, transitNote }: Props) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <Car className="h-5 w-5" style={{ color: GOLD }} />
        <span className="font-display text-2xl font-semibold text-white">{carMinutes}</span>
        <span className="text-sm text-white/60">to downtown</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {routes.map((r) => (
          <span key={r} className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-white/70">
            {r}
          </span>
        ))}
      </div>
      {transitNote && (
        <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-white/60">
          <Bus className="mt-0.5 h-4 w-4 shrink-0 text-white/40" /> {transitNote}
        </p>
      )}
      <p className="mt-2 text-xs uppercase tracking-wide text-white/40">Commute</p>
    </div>
  );
}
```

- [ ] **Step 2: IdealBuyerChips**
```tsx
// src/pages/preview/_shared/lifestyle/IdealBuyerChips.tsx
const GOLD = "hsl(44, 100%, 53%)";

interface Props { tags: string[]; summary: string; }

export default function IdealBuyerChips({ tags, summary }: Props) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ color: GOLD, border: `1px solid ${GOLD}55`, backgroundColor: "hsl(44 100% 53% / 0.08)" }}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{summary}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-white/40">Ideal Buyer</p>
    </div>
  );
}
```

- [ ] **Step 3:** `npx tsc --noEmit` clean. Commit:
```bash
git add src/pages/preview/_shared/lifestyle/CommuteStat.tsx src/pages/preview/_shared/lifestyle/IdealBuyerChips.tsx
git commit -m "feat(market): CommuteStat + IdealBuyerChips"
```

---

## Task 5: `LifestyleVitals` composer

**Files:** Create `src/pages/preview/_shared/lifestyle/LifestyleVitals.tsx`.

- [ ] **Step 1: Implement** (2×2 grid of elevated tiles wrapping the 4 components; takes `LifestyleVitalsData`)
```tsx
// src/pages/preview/_shared/lifestyle/LifestyleVitals.tsx
import type { LifestyleVitalsData } from "@/data/marketProfiles";
import WalkScoreGauge from "./WalkScoreGauge";
import SafetyBadge from "./SafetyBadge";
import CommuteStat from "./CommuteStat";
import IdealBuyerChips from "./IdealBuyerChips";

const tile = "rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10 shadow-[0_28px_60px_-32px_rgba(0,0,0,0.75)]";

export default function LifestyleVitals({ data }: { data: LifestyleVitalsData }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className={`${tile} flex items-center justify-center`}>
        <WalkScoreGauge value={data.walkScore.value} label={data.walkScore.label} />
      </div>
      <div className={tile}>
        <CommuteStat carMinutes={data.commute.carMinutes} routes={data.commute.routes} transitNote={data.commute.transitNote} />
      </div>
      <div className={tile}>
        <SafetyBadge grade={data.safety.grade} percentile={data.safety.percentile} note={data.safety.note} />
      </div>
      <div className={tile}>
        <IdealBuyerChips tags={data.idealBuyer.tags} summary={data.idealBuyer.summary} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** `npx tsc --noEmit` clean. Commit:
```bash
git add src/pages/preview/_shared/lifestyle/LifestyleVitals.tsx
git commit -m "feat(market): LifestyleVitals 2x2 composer"
```

---

## Task 6: Amenities `FeaturedPlaceCard` + `MoreToExplore` + `AmenitiesFeatured`

**Files:** Create `src/pages/preview/_shared/amenities/FeaturedPlaceCard.tsx`, `MoreToExplore.tsx`, `AmenitiesFeatured.tsx`.

- [ ] **Step 1: FeaturedPlaceCard** (photo with scrim + category tag + credit line; photo-less fallback; `onError` hides image)
```tsx
// src/pages/preview/_shared/amenities/FeaturedPlaceCard.tsx
import { useState } from "react";
import type { FeaturedPlace } from "@/data/marketProfiles";
const GOLD = "hsl(44, 100%, 53%)";

export default function FeaturedPlaceCard({ place }: { place: FeaturedPlace }) {
  const [imgOk, setImgOk] = useState(Boolean(place.photo));
  const showPhoto = Boolean(place.photo) && imgOk;
  return (
    <div className="group overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10 shadow-[0_28px_60px_-32px_rgba(0,0,0,0.75)] transition-all duration-500 hover:-translate-y-1 hover:ring-white/25">
      {showPhoto && place.photo && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={place.photo.url}
            alt={place.photo.alt}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/80 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-[#0a1424]" style={{ backgroundColor: GOLD }}>
            {place.category}
          </span>
        </div>
      )}
      <div className="p-6">
        {!showPhoto && (
          <span className="mb-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color: GOLD, border: `1px solid ${GOLD}55` }}>
            {place.category}
          </span>
        )}
        <h4 className="font-display text-lg font-semibold text-white">{place.name}</h4>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{place.blurb}</p>
        {showPhoto && place.photo && (
          <a href={place.photo.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 block text-[11px] text-white/35 transition-colors hover:text-white/60">
            {place.photo.credit} · {place.photo.license}
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: MoreToExplore**
```tsx
// src/pages/preview/_shared/amenities/MoreToExplore.tsx
export default function MoreToExplore({ items }: { items: { name: string; category: string }[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">More to explore</h4>
      <div className="flex flex-wrap gap-2.5">
        {items.map((it) => (
          <span key={it.name} className="rounded-xl bg-white/[0.04] px-3.5 py-2 text-sm text-white/80 ring-1 ring-white/10">
            {it.name} <span className="text-white/40">· {it.category}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: AmenitiesFeatured** (composes: up to 3 featured in a grid + the list)
```tsx
// src/pages/preview/_shared/amenities/AmenitiesFeatured.tsx
import type { MarketProfile } from "@/data/marketProfiles";
import FeaturedPlaceCard from "./FeaturedPlaceCard";
import MoreToExplore from "./MoreToExplore";

export default function AmenitiesFeatured({ data }: { data: MarketProfile["amenities"] }) {
  const featured = data.featured.slice(0, 3);
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <FeaturedPlaceCard key={p.name} place={p} />
        ))}
      </div>
      <MoreToExplore items={data.more} />
    </div>
  );
}
```

- [ ] **Step 4:** `npx tsc --noEmit` clean. Commit:
```bash
git add src/pages/preview/_shared/amenities/FeaturedPlaceCard.tsx src/pages/preview/_shared/amenities/MoreToExplore.tsx src/pages/preview/_shared/amenities/AmenitiesFeatured.tsx
git commit -m "feat(market): amenities featured cards + more-to-explore list"
```

---

## Task 7: Integrate into `MarketMunicipality` (branch on overlay)

**Files:** Modify `src/pages/preview/market/MarketMunicipality.tsx`.

- [ ] **Step 1:** Add imports:
```tsx
import { getMarketProfile } from "@/data/marketProfiles";
import LifestyleVitals from "@/pages/preview/_shared/lifestyle/LifestyleVitals";
import AmenitiesFeatured from "@/pages/preview/_shared/amenities/AmenitiesFeatured";
```
Near where `slim` is resolved, add: `const marketProfile = getMarketProfile(slim.id);`

- [ ] **Step 2:** In the "Buyer & Lifestyle Fit" sub-block, branch: if `marketProfile?.lifestyle` render `<LifestyleVitals data={marketProfile.lifestyle} />`; else keep the existing `ProfileCard` grid for `full.buyer_lifestyle_fit`. Likewise the "Amenities & Community Character" sub-block: if `marketProfile?.amenities` render `<AmenitiesFeatured data={marketProfile.amenities} />`; else the existing `ProfileCard` grid for `full.amenities_character`. Keep the section headings and `whileInView` wrappers in both branches.

> Note: the lifestyle dashboard does not need `full` (it reads `marketProfile`), so it can render even before the async `getFullProfile` resolves. Keep the amenities-featured branch inside the existing `full`/loading guard only if it depends on `full`; since it reads `marketProfile`, it can also render immediately. Render the enriched blocks independent of `loading` when `marketProfile` exists.

- [ ] **Step 3:** Verify a NON-pilot municipality still shows the old cards and a pilot id (once data lands in Tasks 8-9) shows the rich UI. `npm test` green. `npx tsc --noEmit` clean.
- [ ] **Step 4: Commit**
```bash
git add src/pages/preview/market/MarketMunicipality.tsx
git commit -m "feat(market): render enriched lifestyle + amenities when overlay data exists"
```

---

## Task 8: Research + author **Wauwatosa** data

**Files:** Modify `src/data/marketProfiles.ts` (add the `wauwatosa` entry).

This is a research task. Definition of done: a verified, accurate `MarketProfile` for `wauwatosa`. **Accuracy rule: include only facts you verify; omit anything you cannot confirm. Do not invent venues, stats, or photo licenses.**

- [ ] **Step 1: Lifestyle vitals** — confirm/refine from authoritative sources (the existing `profiles.json` Wauwatosa prose is the starting point; verify):
  - `walkScore`: `{ value: 60, label: "Somewhat Walkable" }` (confirm via walkscore.com if possible).
  - `commute`: `{ carMinutes: "10-20 min", routes: ["I-94", "US-45", "Hwy 100"], transitNote: "MCTS Route 30 and others serve the city." }`
  - `safety`: `{ grade: "C-", percentile: 37, note: "Northeast Wauwatosa is the safest area; violent crime rates run slightly below the national average." }`
  - `idealBuyer`: `{ tags: ["Move-up families", "Dual-income professionals", "Young couples"], summary: "Buyers wanting top-tier schools, historic charm, and walkable village life without living in the city proper." }`

- [ ] **Step 2: Featured places (up to 3)** — research and select the 3 strongest, with a real free-license photo where one exists. Strong candidates (verify each): **Milwaukee County Zoo**, **Mayfair Mall / The Mayfair Collection**, **Hart Park** (Menomonee River, pool, summer concerts), **Wauwatosa Village** (walkable historic shops/dining). For each chosen place author `{ name, category, blurb }` and, if a free-license image exists, a `photo`.

- [ ] **Step 3: Source + verify photos (Wikimedia Commons).** For each featured place, search Wikimedia Commons. If a suitable free-license file exists:
  - Use a hotlinkable thumbnail URL of the form `https://upload.wikimedia.org/wikipedia/commons/thumb/<path>/<width>px-<file>` (mirror the working pattern already used in `PreviewV1` `IMG`).
  - **Verify the URL actually returns an image**, e.g. `curl -sI "<url>" | head -1` expects `HTTP/2 200` and an image content-type.
  - Record `credit` (author from the file page), `license` (e.g. "CC BY-SA 4.0"), `sourceUrl` (the Commons file page).
  - If no acceptable free-license photo exists, omit `photo` (the card renders photo-less).

- [ ] **Step 4: "More" list** — the other noteworthy spots as `{ name, category }`, e.g. Eldr+Rime (Dining), Explorium Brewpub (Dining), Le Reve Patisserie & Cafe (Dining), Wauwatosa Farmers Market (Event), Tosa Fest (Event), Hank Aaron / Oak Leaf Trail (Recreation). Verify names.

- [ ] **Step 5:** Add the `wauwatosa: { lifestyle, amenities: { featured, more } }` object to `marketProfiles`. Run `npx tsc --noEmit` (types must satisfy `MarketProfile`). Run `npm test`.

- [ ] **Step 6: Visual check** — `node scroll-shot.mjs http://localhost:8081/preview/v1/market/milwaukee-county/wauwatosa wauwatosa-enriched` and read the PNG: gauge, badges, chips, featured photos + credits, and the list all render. Fix issues.

- [ ] **Step 7: Commit**
```bash
git add src/data/marketProfiles.ts
git commit -m "content(market): researched Wauwatosa profile (lifestyle + amenities)"
```

---

## Task 9: Research + author **Waukesha** data

**Files:** Modify `src/data/marketProfiles.ts` (add the `waukesha` entry).

Same methodology and accuracy rule as Task 8.

- [ ] **Step 1: Lifestyle vitals** (verify; starting point from `profiles.json`):
  - `walkScore`: `{ value: 38, label: "Car-Dependent" }` (the prose says "approximately 35-40"; pick the midpoint and confirm; label per Walk Score bands: 25-49 = "Car-Dependent").
  - `commute`: `{ carMinutes: "20-25 min", routes: ["I-94", "Hwy 18"], transitNote: "Waukesha County Transit runs buses to Milwaukee (~60-90 min)." }`
  - `safety`: `{ grade: "B", note: "Rates well above national averages; northern neighborhoods score highest. Slightly below the county average due to urban density." }` (no percentile unless verified).
  - `idealBuyer`: `{ tags: ["First-time buyers", "Young professionals", "Growing families"], summary: "The county's most accessible price points and most diverse housing stock, with a walkable, revitalized downtown on the Fox River." }`

- [ ] **Step 2: Featured places (up to 3)** — strongest candidates (verify): **Fox River Riverwalk / Downtown Waukesha**, **Retzer Nature Center** (450+ acres), **Frame Park** (Fox River, bandshell, Oktoberfest). Author `{ name, category, blurb }` + photo if free-license exists.

- [ ] **Step 3: Source + verify photos** — same Wikimedia process + `curl -sI` URL check + credit/license/sourceUrl, omit if none.

- [ ] **Step 4: "More" list** — e.g. Waukesha County Fair (Event), Waukesha Oktoberfest (Event), Wisconsin Highland Games (Event), Friday Night Live (Event), Fox River Sanctuary (Recreation), WhirlyBall (Recreation). Verify.

- [ ] **Step 5:** Add the `waukesha` object. `npx tsc --noEmit`. `npm test`.
- [ ] **Step 6: Visual check** — `node scroll-shot.mjs http://localhost:8081/preview/v1/market/waukesha-county/waukesha waukesha-enriched`, read PNG, verify, fix.
- [ ] **Step 7: Commit**
```bash
git add src/data/marketProfiles.ts
git commit -m "content(market): researched Waukesha profile (lifestyle + amenities)"
```

---

## Task 10: Final verification + accuracy handoff

- [ ] **Step 1:** Full build `npm run build` succeeds; both pilot pages prerender (still `noindex`); featured-place text + photo `alt` appear in the static HTML.
- [ ] **Step 2:** `npm test` all green.
- [ ] **Step 3:** Scroll-capture both pilot pages once more for a clean review pair.
- [ ] **Step 4:** Hand the two pages to Lucas for an accuracy spot-check (he knows both cities). Note any items flagged for correction as follow-ups.

---

## Self-review (against the spec)
- Data overlay + accessor + fallback (spec §2, §7): Task 1 + Task 7 branch. ✓
- Vital-signs dashboard: gauge (T2), safety badge (T3), commute + ideal-buyer (T4), composer (T5). ✓
- Amenities featured (up to 3, photo + credit + photo-less fallback) + more list (spec §4): Task 6. ✓
- Research + free-license photos + verify-or-omit (spec §5): Tasks 8-9 with explicit accuracy rule + `curl` URL check. ✓
- Pilot Wauwatosa + Waukesha (spec scope): Tasks 8-9. ✓
- Error/edge: onError photo hide (T6), clamp gauge (T2), optional fields hidden (T3/T4), non-pilot fallback (T7). ✓
- SEO: featured text prerendered + alt text (T6, T10). ✓
- Testing: gauge/badge unit tests (T2/T3), scroll-shot visual (T8/T9/T10). ✓

**Deferred:** rolling the overlay to the other 57 municipalities; `TouristAttraction` schema; maps.

---

## Execution handoff
Subagent-driven (recommended): code Tasks 1-7 with review; Tasks 8-9 are research tasks — the subagent must verify facts + photo URLs and omit the unverifiable. Or inline execution.
