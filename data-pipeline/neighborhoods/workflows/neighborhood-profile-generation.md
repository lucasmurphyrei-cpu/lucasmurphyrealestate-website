# Workflow: Neighborhood Profile Generation

## Objective
Generate comprehensive neighborhood/municipality profiles for a given county in southeastern Wisconsin. Each profile should help a Realtor build a "Neighborhood Fit Quiz" for relocation buyers.

## Trigger
Manual — run per county when profiles are needed.

## Required Inputs
- County name
- List of municipalities/neighborhoods to cover
- Target year for data (use most recent available)

## Profile Structure (Per Municipality)

Each municipality profile follows this exact template:

### 1. Quick Snapshot
| Field | Source(s) |
|-------|-----------|
| Population | U.S. Census Bureau, DataUSA, World Population Review |
| Median Age | U.S. Census Bureau, DataUSA |
| Median Household Income | U.S. Census Bureau, DataUSA |
| Median Home Price (current year) | Realtor.com, Zillow, Redfin |
| Average Rent (current year) | RentCafe, Apartments.com, Zillow Rental Manager |
| Typical Home Style | Local real estate knowledge, architectural surveys |
| School District Summary | GreatSchools, Niche.com, U.S. News & World Report |

### 2. Buyer & Lifestyle Fit
- **What type of buyer or resident thrives here** — demographic profile, buyer personas
- **Typical commute times to downtown Milwaukee** — in minutes, by car
- **Walkability & Transportation Access** — Walk Score, bike infrastructure, transit, freeway access
- **Crime/Safety Reputation** — general reputation with context, CrimeGrade or similar

### 3. Amenities & Character
- **Major Parks, Restaurants, or Local Attractions** — name specific places
- **Community Vibe** — 2-3 sentence personality description
- **Notable Annual Events** — festivals, markets, celebrations
- **Proximity to Lake Michigan or Major Employers** — distance/access + key employers

### 4. Real Estate Trends (Recent 1-2 Year Window)
| Metric | Source(s) |
|--------|-----------|
| Median Sale Price YoY Trend (%) | Realtor.com, Redfin, Zillow |
| Average Days on Market | Realtor.com, Redfin |
| Price-per-Square-Foot | Realtor.com, Redfin, Zillow |
| Dominant Buyer Demographics & Market Competitiveness | Redfin market score, local MLS data |

### 5. Lifestyle Summary (For Quiz Use)
- 3-5 sentences, second-person ("If you..."), vivid and specific
- Mentions home style, schools, vibe, and market competitiveness

### 6. Suggested Quiz Tags
- 5 hashtags that capture the area's identity
- Pull from standard tag set: #UrbanVibe, #LakeLife, #Foodie, #Nightlife, #ArtsAndCulture, #FamilyFriendly, #TopSchools, #Charming, #Suburban, #WalkableVillage, #BudgetConscious, #FirstTimeBuyer, #CommuteFriendly, #InvestmentProperty, #Artsy, #Community, #Shopping, #Quiet, #RanchHome, #HistoricCharm, #SmallTownVibe, #NewerHomes, #Upscale, #Luxury, #Private, #Rural, #Exclusive, #ParksAndRec, #Diverse, #GolfCourse, #CountryLiving, #LakeCountry

## After All Profiles

### Comparative Summary Table
Markdown table with columns:
- Municipality
- Median Sale Price
- Lifestyle Summary (2-3 words)
- Primary Buyer Demographic

### Purpose & Application Section
Brief paragraph explaining how the profiles support the Neighborhood Fit Quiz and relocation guide.

### References Section
Numbered references ([1], [2], etc.) citing all data sources with full URLs. Preferred sources:
- **Demographics**: DataUSA, U.S. Census Bureau, World Population Review
- **Real Estate**: Realtor.com, Zillow, Redfin, local MLS
- **Rentals**: RentCafe, Apartments.com, Zillow Rental Manager
- **Schools**: GreatSchools, Niche.com, U.S. News & World Report
- **Safety**: CrimeGrade, NeighborhoodScout
- **Local/Tourism**: County tourism boards, municipal websites, Visit Milwaukee
- **Architecture**: Local historical societies, municipal planning documents

## Expected Output
- One markdown file per county saved to `output/{county-name}/`
- Filename format: `{county-name}-neighborhood-profiles.md`

## JSON Export (for Website Handoff)
After profiles are written or updated, run `python3 tools/export_json.py` to generate:
- `output/json/profiles.json` — Full structured profile data (all sections, narrative text, API data)
- `output/json/profiles-slim.json` — Lightweight version (snapshot, trends, tags, summary, API data only)
- `output/json/quiz-attributes.json` — 0-5 attribute scores for the Neighborhood Fit Quiz (manually curated)
- `output/json/quiz-questions.json` — Question bank with weights and attribute boosts

The JSON files are the **contract** between this project and the website. The website consumes these files; it does not read the markdown directly.

## Data Refresh Workflow
1. Run `python3 tools/update_profiles.py` to fetch fresh Census/Zillow/Redfin data and update markdown
2. Run `python3 tools/export_json.py` to regenerate JSON exports
3. Review `quiz-attributes.json` — attribute scores may need manual adjustment if market conditions shifted significantly
4. Copy `output/json/` to the website project

## Data Source Notes (verified 2026-08-09)

### Census
- **api.census.gov now requires an API key.** Keyless requests return an HTML
  "Missing Key" page, not JSON. Add `CENSUS_API_KEY` to `.env` (free key:
  https://api.census.gov/data/key_signup.html) to restore the place-based path
  in `fetch_census.py`.
- **Civil Towns are not Census "places."** Cities and villages live in the place
  universe; Towns are *county subdivisions*. Town entries in `config.py` carry a
  `census_geoid` and are fetched from Census Reporter
  (`fetch_census.fetch_census_subdivisions()`), which needs no key but **blocks
  generic user agents** — send a project-specific `User-Agent`.
- Newly incorporated villages can change GEOID. Lisbon incorporated out of the
  Town of Lisbon in 2024 and moved from cousub `5513344850` to `5513344847`.
- GEOIDs come from the Census gazetteer, e.g.
  `https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_gaz_cousubs_55.txt`

### Zillow / Redfin
- **Zillow ZHVI covers Towns**; ZORI (rent) generally does not — only ~66 WI
  cities appear in ZORI, so rural municipalities have no rent figure.
- **Redfin only publishes `REGION_TYPE == "place"`**, so most Towns have no
  Redfin row at all. When Redfin data is missing, use the ZHVI value for the
  price trend and cite the *nearest tracked market* by name for days-on-market
  and price-per-square-foot. Never leave a Real Estate Trends field blank — the
  website's `MunicipalitySlim` interface has no optional fields.
- `.tmp/redfin_wi.tsv` is a Wisconsin-only extract of the 1GB Redfin tracker.
  Regenerate with:
  `gzcat .tmp/redfin_city_market_tracker.tsv.gz | awk -F'\t' 'NR==1 || $11=="\"WI\""' > .tmp/redfin_wi.tsv`

### Thin-data fallbacks used by the existing profiles
- Average Rent: `N/A (very limited rental market; overwhelmingly owner-occupied
  single-family homes)`
- Low sale counts: label the volume explicitly, e.g. `(low volume -- 3 sales)`,
  and pair a volatile Redfin YoY with the steadier Zillow index reading.

### Merging with the live site
`output/json/` in this workspace can fall behind the live site. Before
exporting, diff against
`~/Desktop/Claude Code - Real Estate Website Building/lucasmurphyrealestatehub-main/src/data/neighborhoods/`
and treat the live files as the source of truth — they may carry `api_data` for
municipalities whose fetch results are no longer cached in `.tmp/`. Merge new
municipalities onto the live set rather than replacing it.

## Edge Cases
- If a municipality has very limited data (pop. < 1,000), note data limitations and use county-level estimates
- If real estate data conflicts between sources, note the range and cite both
- For unincorporated areas or CDPs, use the nearest school district and ZIP code data
- If a municipality spans multiple counties, focus on the portion within the target county
