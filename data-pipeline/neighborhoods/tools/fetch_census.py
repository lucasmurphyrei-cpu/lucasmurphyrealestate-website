"""
Fetch demographic data from the U.S. Census Bureau ACS 5-Year API.

Two paths, because two kinds of municipality live in this project:

1. Cities and villages are Census "places" and come from api.census.gov.
   IMPORTANT (verified 2026-08-09): api.census.gov now rejects keyless
   requests with an HTML "Missing Key" page — it no longer allows anonymous
   low-volume use. Put CENSUS_API_KEY in .env to re-enable this path.
   Get a free key at https://api.census.gov/data/key_signup.html.

2. Civil Towns (and villages incorporated too recently to appear in the place
   universe, e.g. Lisbon) are Census "county subdivisions". Those entries carry
   a `census_geoid` in config.py and are fetched from Census Reporter, which is
   keyless. Census Reporter blocks generic user agents — send a project-specific
   User-Agent or it returns {"error": "blocked"}.

Returns population, median age, and median household income.
"""

import os
import requests
from config import MUNICIPALITIES

# Census ACS 5-Year API — Wisconsin places
# Variables:
#   B01003_001E = Total Population
#   B01002_001E = Median Age
#   B19013_001E = Median Household Income
ACS_YEARS = ["2023", "2022"]  # Try latest first, fall back
ACS_BASE = "https://api.census.gov/data/{year}/acs/acs5"
ACS_VARS = "NAME,B01003_001E,B01002_001E,B19013_001E"
CENSUS_API_KEY = os.environ.get("CENSUS_API_KEY", "")

# Census Reporter — keyless fallback used for county subdivisions (Towns)
CR_BASE = "https://api.censusreporter.org/1.0/data/show/{release}"
CR_RELEASES = ["acs2024_5yr", "acs2023_5yr"]  # newest first
CR_USER_AGENT = "CountyNeighborhoodProfiles/1.0 (southeastern-WI municipal profiles)"


def fetch_census_subdivisions():
    """
    Fetch demographics for municipalities carrying a `census_geoid` (civil
    Towns and newly incorporated Villages) via Census Reporter.

    Returns:
        dict: {municipality_key: {population, median_age,
                                  median_household_income, source_year}}
    """
    targets = {
        key: cfg["census_geoid"]
        for key, cfg in MUNICIPALITIES.items()
        if cfg.get("census_geoid")
    }
    if not targets:
        return {}

    geo_ids = [f"06000US{geoid}" for geoid in targets.values()]
    headers = {"User-Agent": CR_USER_AGENT}

    for release in CR_RELEASES:
        url = CR_BASE.format(release=release)
        params = {
            "table_ids": "B01003,B01002,B19013",
            "geo_ids": ",".join(geo_ids),
        }
        try:
            print(f"  Fetching Census Reporter {release} for {len(geo_ids)} subdivisions...")
            resp = requests.get(url, params=params, headers=headers, timeout=60)
            if resp.status_code != 200:
                print(f"  {release} failed: {resp.status_code} {resp.text[:160]}")
                continue
            payload = resp.json()
        except Exception as e:
            print(f"  {release} failed: {e}")
            continue

        source_year = release.replace("acs", "").split("_")[0]
        results = {}
        for key, geoid in targets.items():
            entry = payload.get("data", {}).get(f"06000US{geoid}")
            if not entry:
                print(f"  WARNING: no Census Reporter row for {MUNICIPALITIES[key]['display_name']}")
                continue
            results[key] = {
                "population": _safe_int(entry["B01003"]["estimate"]["B01003001"]),
                "median_age": _safe_float(entry["B01002"]["estimate"]["B01002001"]),
                "median_household_income": _safe_int(entry["B19013"]["estimate"]["B19013001"]),
                "source_year": source_year,
            }
        print(f"  Matched {len(results)}/{len(targets)} county subdivisions ({release})")
        return results

    print("  ERROR: Census Reporter unavailable for every release")
    return {}


def fetch_census_data():
    """
    Fetch demographics for all Wisconsin places from Census ACS API.

    Returns:
        dict: {municipality_key: {population, median_age, median_household_income, source_year}}
        Returns None values for fields that couldn't be fetched.
    """
    raw_data = None
    source_year = None

    for year in ACS_YEARS:
        url = f"{ACS_BASE.format(year=year)}?get={ACS_VARS}&for=place:*&in=state:55"
        if CENSUS_API_KEY:
            url += f"&key={CENSUS_API_KEY}"
        try:
            print(f"  Fetching Census ACS {year} data for Wisconsin...")
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            if "json" not in resp.headers.get("content-type", ""):
                # api.census.gov answers keyless requests with an HTML error page
                raise ValueError(
                    "non-JSON response (api.census.gov now requires CENSUS_API_KEY in .env)"
                )
            raw_data = resp.json()
            source_year = year
            print(f"  Got {len(raw_data) - 1} places from ACS {year}")
            break
        except Exception as e:
            print(f"  ACS {year} failed: {e}")
            continue

    if not raw_data:
        print("  ERROR: Could not fetch Census place data for any year")
        # Towns are still reachable through the keyless Census Reporter path.
        return fetch_census_subdivisions()

    # Parse response — first row is headers, rest is data
    # Format: [["NAME","B01003_001E","B01002_001E","B19013_001E","state","place"], ...]
    headers = raw_data[0]
    rows = raw_data[1:]

    # Build lookup by lowercase place name
    census_lookup = {}
    for row in rows:
        name = row[0].lower()  # e.g., "mequon city, wisconsin"
        # Strip state suffix
        name = name.replace(", wisconsin", "").strip()
        census_lookup[name] = {
            "population": _safe_int(row[1]),
            "median_age": _safe_float(row[2]),
            "median_household_income": _safe_int(row[3]),
        }

    # Match to our municipalities
    results = {}
    matched = 0
    for key, cfg in MUNICIPALITIES.items():
        census_name = cfg.get("census_name")
        if not census_name:
            continue

        if census_name in census_lookup:
            data = census_lookup[census_name]
            data["source_year"] = source_year
            results[key] = data
            matched += 1
        else:
            # Try fuzzy match — strip "city"/"village"/"town" and try
            base_name = census_name.split()[0] if " " in census_name else census_name
            found = False
            for census_key, census_val in census_lookup.items():
                if census_key.startswith(base_name):
                    data = census_val.copy()
                    data["source_year"] = source_year
                    results[key] = data
                    matched += 1
                    found = True
                    break
            if not found:
                print(f"  WARNING: No Census match for '{census_name}' ({cfg['display_name']})")

    print(f"  Matched {matched}/{sum(1 for v in MUNICIPALITIES.values() if v.get('census_name'))} municipalities")

    # County subdivisions (civil Towns) never appear in the place universe.
    results.update(fetch_census_subdivisions())
    return results


def _safe_int(val):
    """Convert Census value to int, handling nulls and negatives."""
    try:
        v = int(val)
        return v if v >= 0 else None
    except (ValueError, TypeError):
        return None


def _safe_float(val):
    """Convert Census value to float, handling nulls and negatives."""
    try:
        v = float(val)
        return v if v >= 0 else None
    except (ValueError, TypeError):
        return None


if __name__ == "__main__":
    print("=== Census ACS Demographics Fetcher ===\n")
    data = fetch_census_data()
    print(f"\nResults for {len(data)} municipalities:\n")
    for key, vals in sorted(data.items()):
        print(f"  {MUNICIPALITIES[key]['display_name']}:")
        print(f"    Population: {vals['population']:,}" if vals['population'] else "    Population: N/A")
        print(f"    Median Age: {vals['median_age']}" if vals['median_age'] else "    Median Age: N/A")
        if vals['median_household_income']:
            print(f"    Median HH Income: ${vals['median_household_income']:,}")
        else:
            print(f"    Median HH Income: N/A")
        print()
