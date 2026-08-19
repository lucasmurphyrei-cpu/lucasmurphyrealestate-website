# Task: Publish the 69-municipality profile set to the live website

## Goal
The neighborhood profile data went from **59 → 69 municipalities**. The new data
is built and verified in the County Neighborhood Profiles workspace. This task
moves it into the website repo and makes the ten new municipality pages reachable.

**Copying the JSON files is NOT sufficient.** Three code files also carry
hardcoded municipality lists. Skip any of steps 2-4 and the new pages either
don't appear or 404. Details below.

## The 10 new municipalities

| id | display_name | county | Median home value | Redfin data? |
|---|---|---|---|---|
| `addison` | Addison (Town) | washington | $419,036 | no |
| `barton` | Barton (Town) | washington | $446,093 | no |
| `farmington` | Farmington (Town) | washington | $468,544 | no |
| `polk` | Polk (Town) | washington | $553,860 | no |
| `trenton` | Trenton (Town) | washington | $449,641 | no |
| `wayne` | Wayne (Town) | washington | $478,966 | no |
| `genesee` | Genesee (Town) | waukesha | $581,252 | no |
| `lisbon` | Lisbon | waukesha | $555,245 | yes |
| `summit` | Summit | waukesha | $730,354 | yes |
| `vernon` | Vernon | waukesha | $516,156 | yes |

Seven are civil **Towns**, which is why the display names carry a `(Town)`
qualifier — Washington County has both a Village and a Town of Jackson,
Kewaskum, Hartford, and West Bend, and the qualifier prevents confusion. That
qualifier is exactly what creates the routing problem in Step 3.

County counts after this change: ozaukee 8, milwaukee 20, washington 14,
waukesha 27.

---

## Step 1 — Copy the three data files

Source (already merged and verified at 69):
```
~/Desktop/County Neighborhood Profiles/output/json/
```

Destination:
```
<website-repo>/src/data/neighborhoods/
```

```bash
SRC=~/Desktop/"County Neighborhood Profiles"/output/json
DST=~/Desktop/"Claude Code - Real Estate Website Building"/lucasmurphyrealestatehub-main/src/data/neighborhoods

cp "$SRC/profiles-slim.json"    "$DST/profiles-slim.json"
cp "$SRC/profiles.json"         "$DST/profiles.json"
cp "$SRC/quiz-attributes.json"  "$DST/quiz-attributes.json"
```

Leave `quiz-questions.json` alone — unchanged.

**These files were built by merging onto the live 59, not by regenerating.** All
59 existing entries are byte-identical to what is on the site today, including
`api_data` for the 17 municipalities whose fetch results are no longer cached in
the profiles workspace. Do not replace them with a fresh `export_json.py` run —
that produces a set with 18 municipalities missing `api_data`.

---

## Step 2 — Add the 10 to the county page lists

County pages use **hardcoded name arrays**, not the JSON. Without this edit the
new municipalities simply never appear in the county listing.

`src/pages/areas/WashingtonCounty.tsx` — replace the array with:

```ts
const municipalities = [
  "Addison", "Barton", "Farmington", "Germantown", "Hartford",
  "Jackson", "Kewaskum", "Newburg", "Polk", "Richfield",
  "Slinger", "Trenton", "Wayne", "West Bend",
];
```

`src/pages/areas/WaukeshaCounty.tsx` — replace the array with:

```ts
const municipalities = [
  "Big Bend", "Brookfield", "Butler", "Chenequa", "Delafield",
  "Dousman", "Eagle", "Elm Grove", "Genesee", "Hartland",
  "Lac La Belle", "Lannon", "Lisbon", "Menomonee Falls", "Merton",
  "Mukwonago", "Muskego", "Nashotah", "New Berlin", "North Prairie",
  "Oconomowoc", "Pewaukee", "Summit", "Sussex", "Vernon",
  "Wales", "Waukesha",
];
```

Use the plain names (no `(Town)`) — `CountyPageTemplate` slugifies whatever
string it is given, and the plain form is the URL you want.

---

## Step 3 — Add slug aliases (REQUIRED — 7 pages break without it)

`src/data/municipalityLookup.ts` builds its route table by slugifying
`display_name`:

```ts
const slugify = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
```

It strips periods but **not parentheses**. So `"Addison (Town)"` becomes
`addison-(town)`, while the county page in Step 2 links to `/addison`. Those
don't match, and the page falls through to the "Profile data is not yet
available" placeholder.

This is the same problem `"Brookfield (City)"` and `"Pewaukee (City/Village)"`
already have, and it is solved the same way. Add these seven lines to the
existing `SLUG_ALIASES` map:

```ts
  "washington-county/addison": "addison",        // display_name: "Addison (Town)"
  "washington-county/barton": "barton",          // display_name: "Barton (Town)"
  "washington-county/farmington": "farmington",  // display_name: "Farmington (Town)"
  "washington-county/polk": "polk",              // display_name: "Polk (Town)"
  "washington-county/trenton": "trenton",        // display_name: "Trenton (Town)"
  "washington-county/wayne": "wayne",            // display_name: "Wayne (Town)"
  "waukesha-county/genesee": "genesee",          // display_name: "Genesee (Town)"
```

`lisbon`, `summit`, and `vernon` have clean display names and need no alias.

This also fixes SEO. `getAllMunicipalityRoutes()` scores candidate slugs and
prefers the one without parentheses — with no alias, the only candidate is
`addison-(town)`, and that literal-paren URL is what lands in `sitemap.xml` and
`llms.txt` on build.

---

## Step 4 — Add RapidStats rows for the 10 (you have this data)

`src/data/municipalityRapidStats.ts` currently has exactly 59 keys — the old
set. `getRapidStats()` returns `null` for anything else, so all ten new pages
render the "Coming Soon" placeholder instead of a market table.

RapidStats also supplies the **Median Home Price** tile in the Quick Snapshot
grid, overriding the profile value whenever it reports a non-zero median.
Without a row, that tile falls back to the Zillow-derived string from the
profile — correct, but visibly different from the other 59 pages.

Add one entry per new id, matching the existing shape:

```ts
  addison: {
    data_month: "August 2026",
    data_as_of: "2026-08-01",
    prior_year_label: "2025",
    current_year_label: "2026",
    median_sale_price: 0,          // integer, no separators; 0 = MLS suppressed
    metrics: [
      { label: "New Listings", prior_year: "0", current_year: "0", change_pct: 0.0 },
      { label: "Closed Sales", prior_year: "0", current_year: "0", change_pct: 0.0 },
      { label: "Median Sales Price", prior_year: "$0", current_year: "$0", change_pct: 0.0 },
      { label: "Pct of Orig. List Price Received", prior_year: "0.0%", current_year: "0.0%", change_pct: 0.0 },
      { label: "Days on Market Until Sale", prior_year: "0", current_year: "0", change_pct: 0.0 },
      { label: "Inventory (SFR)", prior_year: "0", current_year: "0", change_pct: 0.0 },
    ],
  },
```

Notes on the shape, taken from the existing entries:
- `median_sale_price` is a bare integer. `prior_year` / `current_year` inside
  `metrics` are **preformatted display strings** (`"$757,700"`, `"100.9%"`).
- `change_pct` is a number, signed, one decimal place.
- If MLS suppresses the median for a small municipality, set
  `median_sale_price: 0`. `QuickSnapshotGrid` tests truthiness specifically so a
  suppressed median falls back to the profile value rather than rendering "$0".
- If you have no RapidStats coverage for a given town, set the whole entry to
  `null` — that is what `bay_view`, `hales_corners`, and `newburg` do today, and
  it renders the "Coming Soon" card cleanly.

Several of these are small Towns; expect suppressed or thin MLS figures for
Wayne, Barton, and Addison in particular.

---

## Step 5 — Optional: hero images

`src/data/municipalityImages.ts` has 61 entries and none of the new 10.
`MunicipalityHero` guards with `{image && ...}`, so pages render fine without
one — the photo column is simply absent. Not a blocker, but the new pages will
look thinner than the other 59.

There is a `generate_municipality_images.py` in the website project's parent
folder if you want to keep the treatment consistent.

---

## Verification

Run from the website repo root **after** steps 1-4.

```bash
# 1. Data counts and route resolution
npx tsx -e '
import slim from "./src/data/neighborhoods/profiles-slim.json";
import { getSlimBySlug, getAllMunicipalityRoutes } from "./src/data/municipalityLookup";
import { getRapidStats } from "./src/data/municipalityRapidStats";

const NEW = ["addison","barton","farmington","polk","trenton","wayne","genesee","lisbon","summit","vernon"];
console.log("municipalities:", slim.municipalities.length, "(expect 69)");

const byCounty: Record<string,number> = {};
for (const m of slim.municipalities) byCounty[m.county] = (byCounty[m.county] ?? 0) + 1;
console.log("by county:", byCounty, "(expect ozaukee 8, milwaukee 20, washington 14, waukesha 27)");

for (const id of NEW) {
  const county = slim.municipalities.find(m => m.id === id)!.county;
  const countySlug = county + "-county";
  const resolved = getSlimBySlug(countySlug, id);
  const rs = getRapidStats(id);
  console.log(
    `${id.padEnd(11)} route=${resolved ? "OK " : "404"}  rapidstats=${rs ? "yes" : "MISSING"}`
  );
}

const parens = getAllMunicipalityRoutes().filter(r => /[()]/.test(r.muniSlug));
console.log("routes with literal parens:", parens.length ? parens.map(r=>r.muniSlug) : "none (good)");
'

# 2. Type check + build (prebuild regenerates sitemap.xml and llms.txt)
npm run build

# 3. Tests
npm test
```

Expected: 69 municipalities, correct county counts, `route=OK` and
`rapidstats=yes` for all ten, zero paren routes, clean build.

Then spot-check in `npm run dev`:
- `/areas/washington-county/addison` — loads, shows Quick Snapshot + RapidStats table
- `/areas/waukesha-county/lisbon` — same
- `/areas/washington-county` — lists all 14
- `/areas/waukesha-county` — lists all 27
- Run the Neighborhood Fit Quiz and confirm new municipalities can surface as results

---

## Known issues — read before "fixing" anything

**`bay_view` has no `api_data` key at all.** This is pre-existing and shipping on
the live site today. The `MunicipalitySlim` interface declares `api_data` as
required, so this is technically a violation, but the only consumer
(`PropertySearchSection`) uses optional chaining and handles it. I left it
untouched rather than modify a live entry. Worth investigating separately, not
as part of this publish.

**`real_estate_trends` is rendered nowhere.** It appears only in the type
definitions (`neighborhoodTypes.ts:96` and `:128`); no component reads it.
RapidStats replaced it. The field must stay populated or the type breaks, but
don't spend time improving that copy — nobody sees it. All 69 entries have it
filled.

**The "Coming Soon" placeholder is stale.** `RapidStatsTable.tsx` hardcodes
*"Check back in April 2026."* It is August 2026. That string shows on any
municipality with a `null` RapidStats entry — three today, more if you leave any
of the new ten unpopulated. One-line fix, worth doing while you're in the file.

**Seven of the ten have no Redfin data.** Redfin only publishes
`REGION_TYPE == "place"`, and civil Towns aren't places. Their `api_data.redfin`
is `{}` and their Real Estate Trends text cites the nearest tracked market by
name. The House Hack tool's price lookup falls through to `api_data.zillow.zhvi`,
which is populated for all ten, so that tool works correctly.

**Census year differs for the new 10.** They use ACS 2024 5-year; the existing 59
use ACS 2023. ACS 2023 does not contain Lisbon at all — it incorporated as a
village in 2024 and changed GEOID. Each entry carries its own `source_year`.

---

## Do not

- Do not regenerate `output/json/` from the profiles workspace and copy that —
  it drops `api_data` for 18 municipalities. The files in Step 1 are the
  correct, merged artifacts.
- Do not rename the `(Town)` display names to make routing simpler. The
  qualifier is real disambiguation, and Step 3 is the established fix.
- Do not touch `quiz-questions.json`.

## Rollback

The website repo was on `main` and clean (one untracked `BACKLOG.md`) when this
was prepared. Branch before you start, and `git checkout -- src/data/` restores
the previous data set if anything looks wrong.
