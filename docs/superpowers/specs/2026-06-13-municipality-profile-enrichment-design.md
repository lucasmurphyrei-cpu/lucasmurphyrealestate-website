# Municipality Profile Enrichment — Design Spec

**Date:** 2026-06-13
**Status:** Approved (pending spec review)
**Scope:** Enrich the municipality market page's profile section — a "vital signs" dashboard for **Buyer & Lifestyle Fit** and a featured-places + list treatment for **Amenities & Community Character**, backed by a new structured data overlay. Pilot two municipalities (**Wauwatosa**, **Waukesha**), researched to a "surprise-a-local" accuracy bar, then scale later.

---

## 1. Goals & Constraints

- Turn the four prose Buyer & Lifestyle Fit fields into scannable visual indicators (gauge, stat, badge, chips) with detail beneath.
- Turn Amenities into **up to 3 featured places** (real free-license photo + detail) plus a **"more to explore" list** of other noteworthy spots.
- **Accuracy:** real venues and stats only; anything unverifiable is left out, never guessed. Lucas spot-checks (he knows Wauwatosa & Waukesha well).

### Decisions locked during brainstorming
- Rollout: **pilot Wauwatosa + Waukesha**, then scale.
- Photos: **free-license only (Wikimedia Commons)**; places without a free photo render photo-less / list-only.
- Research: **I research + verify, Lucas spot-checks.**
- Buyer/Lifestyle treatment: **vital-signs dashboard.**
- Walk Score: **arc gauge.**
- Featured places: **up to 3** (2 is fine for smaller places).
- **Additive / non-destructive:** new data overlay + market-page UI only. `profiles.json`, the live `MunicipalityReport`, and the shared `BuyerLifestyleFitSection`/`AmenitiesSection` are untouched. Municipalities without an overlay entry keep the current dressed-up prose cards.

---

## 2. Data model — `src/data/marketProfiles.ts`

A hand-authored (researched) overlay keyed by municipality `id`, plus an accessor.

```ts
export interface MarketPhoto {
  url: string;        // hotlinkable free-license image (Wikimedia Commons)
  alt: string;        // descriptive alt text
  credit: string;     // e.g. "Photo: Jane Doe / Wikimedia Commons"
  license: string;    // e.g. "CC BY-SA 4.0"
  sourceUrl: string;  // link to the file's Commons page
}

export interface FeaturedPlace {
  name: string;
  category: string;   // "Park" | "Dining" | "Shopping" | "Landmark" | "Recreation" | "Event"...
  blurb: string;      // 1-2 sentences, specific + accurate
  photo?: MarketPhoto; // omitted when no free-license photo exists
}

export interface LifestyleVitals {
  walkScore: { value: number; label: string };
  commute: { carMinutes: string; routes: string[]; transitNote?: string };
  safety: { grade: string; percentile?: number; note: string };
  idealBuyer: { tags: string[]; summary: string };
}

export interface MarketProfile {
  lifestyle: LifestyleVitals;
  amenities: { featured: FeaturedPlace[]; more: { name: string; category: string }[] };
}

const marketProfiles: Record<string, MarketProfile> = { /* wauwatosa, waukesha */ };
export function getMarketProfile(id: string): MarketProfile | null {
  return marketProfiles[id] ?? null;
}
export default marketProfiles;
```

## 3. Buyer & Lifestyle Fit — vital-signs dashboard

Rendered when `getMarketProfile(id)?.lifestyle` exists; else the current `ProfileCard` lifestyle block. New small components under `src/pages/preview/_shared/lifestyle/`:

- **`WalkScoreGauge`** — SVG arc, 0-100, gold fill proportional to `value`, big number in the center, `label` below. (Pure, unit-testable: given value → correct arc fraction / aria.)
- **`CommuteStat`** — car icon, large `carMinutes` + "to downtown", route chips (`routes.map`), optional `transitNote` line.
- **`SafetyBadge`** — color-coded letter grade chip (A→emerald, B→lime, C→amber, D/F→red; map by first letter), `percentile` ("37th percentile") when present, `note` beneath.
- **`IdealBuyerChips`** — `tags` as gold-outline chips + `summary` sentence.

Laid out as a 2×2 grid on the navy surface, matching the dressed-up card aesthetic (elevated surface, gold accents).

## 4. Amenities & Community Character — featured + list

Rendered when `getMarketProfile(id)?.amenities` exists; else current block.
- **Featured (up to 3):** large cards — photo (16:9, gradient bottom scrim, gold category tag overlay), name (`font-display`), blurb. A tiny credit/license line under each photo (`credit · license`, linking `sourceUrl`). **Photo-less fallback:** same card without the image, a gold category tag + name + blurb on the elevated surface.
- **"More to explore":** a heading + the `more` list as a wrapped row of chips (`name` with a small `category` caption), no photos.

## 5. Research & photo sourcing (pilot)

For Wauwatosa and Waukesha:
- Research real venues, events, parks, shopping, dining + the lifestyle stats (walk score, commute, CrimeGrade, schools) from authoritative sources; cross-check. The existing `profiles.json` prose is a starting point but is partly malformed (some names dropped) — verify and correct.
- Pull **Wikimedia Commons** photos for places that have a free-license image (e.g. Milwaukee County Zoo, Mayfair, Hart Park, Retzer Nature Center, Fox River Riverwalk, Frame Park). Record `credit`, `license`, `sourceUrl`; confirm the license permits use. Verify the thumbnail URL actually loads.
- Anything not verifiable (a stat, a venue, a photo's license) is omitted, not guessed.
- Lucas reviews the two pilot pages for accuracy before scale.

## 6. Integration

In `MarketMunicipality.tsx`, the profile section branches: if `getMarketProfile(slim.id)` returns data, render the vital-signs dashboard + featured/list amenities; otherwise render the existing `ProfileCard` blocks (current behavior for the other 57). Both branches keep the section headings and the `whileInView` reveals.

## 7. Error / edge handling
- No overlay entry → current prose cards (graceful, already shipped).
- `featured` place without `photo` → photo-less card.
- Missing optional fields (`percentile`, `transitNote`) → hidden, no empty UI.
- Broken/blocked image → `onError` hides the image and shows the photo-less card layout.
- Walk score out of 0-100 or missing → clamp / hide gauge.

## 8. SEO / AI-ranking
- Featured places add specific, local, factual content (great for AI citation) — render as real text (prerendered), not just images.
- All photos need descriptive `alt`. Attribution line satisfies free-license terms.
- No new routes; existing `<Seo noindex>` + `Dataset`/`Place` schema unchanged. (Could add `TouristAttraction`/`Place` sub-schema for featured spots later — out of scope for the pilot.)

## 9. Testing / verification
- Unit: `WalkScoreGauge` arc math + `SafetyBadge` grade→color mapping (pure logic).
- Visual: scroll-capture (`scroll-shot.mjs`) both pilot pages; confirm gauge, badges, chips, featured photos + credits, and the list render; confirm a non-pilot municipality still shows the fallback cards.
- Accuracy: Lucas spot-checks Wauwatosa + Waukesha content.

## 10. Out of scope
- Rolling the overlay out to the other 57 municipalities (follow-up, same structure).
- Changing the live `MunicipalityReport` / `profiles.json`.
- Paid/API photo sources; `TouristAttraction` schema; maps.
