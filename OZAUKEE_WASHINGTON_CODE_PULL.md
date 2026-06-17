# Ozaukee & Washington — finish wiring into Listings

**Status (2026-06-17):** Milwaukee + Waukesha counties are fully wired (county + all
communities). Ozaukee + Washington are NOT done yet — blocked on those counties going
live in the eXp/BoldTrail IDX search.

**Blocker:** In BoldTrail → "Coverage Only" area list, all 4 counties (Milwaukee,
Ozaukee, Washington, Waukesha) are added and saved. But Ozaukee/Washington still return
nothing in search (confirmed not a cache issue — tested in incognito). Likely a re-index
delay or a company/parent-feed limitation. **Tomorrow: test "Mequon" and "West Bend" in
the search box.** If suggestions appear, the counties are live — run the two briefs below.
If still empty, it's an eXp/brokerage support ticket (parent feed coverage).

**To wire once live:** run each brief in the Claude Chrome extension, paste the JSON back
to Claude. Codes go into `MUNI_PAKS` in
`src/pages/preview/listings/listingsConfig.ts` (and `COUNTY_PAKS` if county codes appear).
Same process used for Milwaukee/Waukesha.

---

## Brief 1 — Ozaukee County (8 municipalities)

Go to **https://lucasmurphy.exprealty.com/index.php**.

**Coverage check first:** type "Ozaukee County" (note any county-level suggestion), then
"Mequon" and "Cedarburg". If no municipality suggestions appear for these in Ozaukee
County, WI, STOP and report that Ozaukee cities aren't searchable yet. If they appear,
continue.

**Method (per municipality):** type the name → click the suggestion for that city/village
in **Ozaukee County, WI** (the municipality itself, not a street/ZIP/school) → read the
address-bar URL → capture the **decoded** `pak` (keep the colon, e.g. `city:g30_abc123`)
and the `display` value.

**Municipalities (all Ozaukee County, WI):**
Belgium, Cedarburg, Fredonia, Grafton, Mequon, Port Washington, Saukville, Thiensville

**Output:** JSON like `{ "Mequon": { "pak": "city:g30_...", "display": "Mequon" } }` for
all 8. Note any with no code. Confirm count at the end.

**Guardrail:** public property search only; do not touch the CRM, leads, contacts, or settings.

---

## Brief 2 — Washington County (7 municipalities)

Go to **https://lucasmurphy.exprealty.com/index.php**.

**Coverage check first:** type "Washington County" (note any county-level suggestion),
then "West Bend" and "Germantown". If no municipality suggestions appear in Washington
County, WI, STOP and report that. If they appear, continue.

**Method (per municipality):** type the name → click the suggestion for that city/village
in **Washington County, WI** → read the address-bar URL → capture the **decoded** `pak`
(with the colon) and `display`.

**Municipalities (all Washington County, WI):**
Germantown, Hartford, Jackson, Kewaskum, Richfield, Slinger, West Bend

**Output:** JSON like `{ "West Bend": { "pak": "city:g30_...", "display": "West Bend" } }`
for all 7. Note any with no code. Confirm count at the end.

**Guardrail:** public property search only; do not touch the CRM, leads, contacts, or settings.
