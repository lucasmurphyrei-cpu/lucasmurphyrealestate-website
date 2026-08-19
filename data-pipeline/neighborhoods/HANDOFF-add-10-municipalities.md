# Task: Add 10 municipalities to the neighborhood profiles

## Goal
Add 10 missing municipalities so they match the existing 59 exactly in structure
and quality. These are the last RapidStats-covered municipalities with no profile.

**Washington County (6):** Wayne, Trenton, Polk, Farmington, Barton, Addison
**Waukesha County (4):** Vernon, Summit, Lisbon, Genesee

Note: these are mostly civil **Towns**, not cities/villages. Census data exists,
but Zillow/Redfin coverage is often thin — see "If data is missing" below.

## ⚠️ CRITICAL — this is a MERGE, not a regenerate

`output/json/profiles-slim.json` in this workspace is **stale**: 48 municipalities,
last exported 2026-02-23. The LIVE website has **59**.

Do NOT export fresh and hand back a 48- or 10-entry file. The end state must be
**69 municipalities** = the live 59 + these 10.

The live file is the source of truth. Read it first:

```
~/Desktop/Claude Code - Real Estate Website Building/lucasmurphyrealestatehub-main/src/data/neighborhoods/profiles-slim.json
```

These 11 exist live but NOT in this workspace — they must survive:
bayside, butler, chenequa, dousman, eagle, fredonia, lac_la_belle, lannon,
newburg, north_prairie, west_milwaukee

Ignore `new-profiles.json`, `new-profiles-slim.json`, `new-quiz-attributes.json`
— all empty, from an aborted run.

## Where profiles live
One markdown file per county, holding every municipality for that county:

```
output/washington-county/washington-county-neighborhood-profiles.md
output/waukesha-county/waukesha-county-neighborhood-profiles.md
```

Append new sections matching the existing formatting exactly.

## How to build each profile
Follow `workflows/neighborhood-profile-generation.md` — all 6 sections:

1. Quick Snapshot
2. Buyer & Lifestyle Fit
3. Amenities & Character
4. Real Estate Trends
5. Lifestyle Summary
6. Suggested Quiz Tags

Tools: `tools/fetch_census.py`, `fetch_zillow.py`, `fetch_redfin.py`,
`update_profiles.py`, then `tools/export_json.py`.

## Required schema — every field is mandatory
The website's `MunicipalitySlim` interface has **no optional fields**. A profile
missing any one of these breaks the site's TypeScript build:

```typescript
id, display_name, county, quick_snapshot,
real_estate_trends, quiz_tags, lifestyle_summary, api_data
```

`id` = lowercase snake_case (e.g. "west_bend"). `county` must match the existing
convention used by the other 59 — copy a neighbor's value verbatim.

## If data is missing
Towns often lack Zillow/Redfin figures. Do NOT invent numbers. Use the same
fallback the existing 59 use for thin-data municipalities, and flag which
municipalities have gaps in your final report.

## Deliverable — stop here
Produce the merged 69-municipality `profiles-slim.json` (plus `profiles.json` and
`quiz-attributes.json` if the pipeline updates them) and report:

- count before/after (must be 59 → 69)
- any municipality with incomplete data
- confirmation the 11 at-risk IDs above are still present

**Do not attempt to publish.** This workspace has no website access. Publishing
happens separately from the website repo (currently on `main` and in sync).
