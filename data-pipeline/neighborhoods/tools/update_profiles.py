#!/usr/bin/env python3
"""
Master script to fetch fresh data and update neighborhood profile markdown files.

Usage:
    python tools/update_profiles.py                    # Update all counties
    python tools/update_profiles.py --county ozaukee   # Update one county
    python tools/update_profiles.py --dry-run          # Show changes without writing
    python tools/update_profiles.py --county ozaukee --dry-run
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime

# Add tools/ to path so imports work when run from project root
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import (
    COUNTY_FILES,
    MUNICIPALITIES,
    TMP_DIR,
    get_all_counties,
    get_municipalities_for_county,
)
from fetch_census import fetch_census_data
from fetch_redfin import fetch_redfin_data
from fetch_zillow import fetch_zillow_data


# ---------------------------------------------------------------------------
# Data fetching
# ---------------------------------------------------------------------------

def fetch_all_data():
    """Run all fetchers and merge into a single dict keyed by municipality."""
    print("=" * 60)
    print("STEP 1: Fetching data from all sources")
    print("=" * 60)

    print("\n[Census ACS - Demographics]")
    census = fetch_census_data()

    print("\n[Zillow Research - Home Values & Rents]")
    zillow = fetch_zillow_data()

    print("\n[Redfin Data Center - Sales Trends]")
    redfin = fetch_redfin_data()

    # Merge into unified structure
    combined = {}
    all_keys = set(list(census.keys()) + list(zillow.keys()) + list(redfin.keys()))

    for key in all_keys:
        combined[key] = {
            "census": census.get(key, {}),
            "zillow": zillow.get(key, {}),
            "redfin": redfin.get(key, {}),
        }

    return combined


# ---------------------------------------------------------------------------
# Markdown parsing and updating
# ---------------------------------------------------------------------------

def _fmt_population(val, year):
    """Format population: 25,329 (2023 est.)"""
    if val is None:
        return None
    return f"{val:,} ({year} est.)"


def _fmt_median_age(val):
    """Format median age: 46.7 years"""
    if val is None:
        return None
    return f"{val} years"


def _fmt_income(val):
    """Format income: $147,391"""
    if val is None:
        return None
    return f"${val:,}"


def _fmt_home_price(zhvi, zhvi_yoy):
    """Format home price: $567,203 (Zillow Home Value Index)"""
    if zhvi is None:
        return None
    base = f"${zhvi:,.0f} (Zillow Home Value Index"
    if zhvi_yoy is not None:
        base += f", {zhvi_yoy:+.1f}% YoY"
    base += ")"
    return base


def _fmt_rent(zori):
    """Format rent: $1,725/month (Zillow Observed Rent Index)"""
    if zori is None:
        return None
    return f"${zori:,.0f}/month (Zillow Observed Rent Index)"


def _fmt_sale_yoy(redfin):
    """Format sale price YoY: +2.3% (Redfin, period ending YYYY-MM-DD)"""
    yoy = redfin.get("median_sale_price_yoy")
    period = redfin.get("latest_period", "")
    price = redfin.get("median_sale_price")
    if yoy is None and price is None:
        return None
    parts = []
    if price is not None:
        parts.append(f"${price:,.0f} median")
    if yoy is not None:
        parts.append(f"{yoy:+.1f}% YoY")
    if period:
        parts.append(f"(Redfin, period ending {period})")
    return "; ".join(parts) if parts else None


def _fmt_dom(redfin):
    """Format days on market: 44 days (Redfin)"""
    dom = redfin.get("median_dom")
    if dom is None:
        return None
    dom_yoy = redfin.get("median_dom_yoy")
    base = f"{dom:.0f} days"
    if dom_yoy is not None and dom_yoy != 0:
        direction = "up" if dom_yoy > 0 else "down"
        base += f" ({direction} {abs(dom_yoy):.0f} days YoY)"
    base += " (Redfin)"
    return base


def _fmt_ppsf(redfin):
    """Format price per sqft: $232 (+1.5% YoY) (Redfin)"""
    ppsf = redfin.get("median_ppsf")
    if ppsf is None:
        return None
    base = f"${ppsf:,.0f}"
    ppsf_yoy = redfin.get("median_ppsf_yoy")
    if ppsf_yoy is not None:
        base += f" ({ppsf_yoy:+.1f}% YoY)"
    base += " (Redfin)"
    return base


def _fmt_competitiveness(redfin):
    """Format market competitiveness from sale-to-list ratio."""
    stl = redfin.get("sale_to_list")
    if stl is None:
        return None
    if stl >= 1.02:
        level = "Very competitive"
    elif stl >= 1.0:
        level = "Competitive"
    elif stl >= 0.98:
        level = "Somewhat competitive"
    else:
        level = "Not very competitive"

    homes = redfin.get("homes_sold")
    parts = [f"{level} (Redfin). Average sale-to-list ratio: {stl:.3f}"]
    if homes is not None:
        parts.append(f"{homes:.0f} homes sold in latest period")
    return ". ".join(parts)


def update_table_row(lines, field_pattern, new_value):
    """
    Find a markdown table row matching field_pattern and replace the value cell.

    Looks for lines like: | **Population** | old value [refs] |
    Replaces with:        | **Population** | new_value |

    Returns (lines, changed_bool, old_value_str).
    """
    if new_value is None:
        return lines, False, None

    pattern = re.compile(
        r"^(\|\s*\*\*" + re.escape(field_pattern) + r"[^*]*\*\*\s*\|)\s*(.*?)\s*\|$",
        re.IGNORECASE,
    )

    for i, line in enumerate(lines):
        m = pattern.match(line.strip())
        if m:
            old_value = m.group(2).strip()
            new_line = f"{m.group(1)} {new_value} |"
            lines[i] = new_line + "\n"
            return lines, True, old_value

    # Try a looser match — just look for the bold field name in a table row
    loose_pattern = re.compile(
        r"^(\|[^|]*\*\*" + re.escape(field_pattern) + r"[^|]*\|)\s*(.*?)\s*\|",
        re.IGNORECASE,
    )
    for i, line in enumerate(lines):
        m = loose_pattern.match(line.strip())
        if m:
            old_value = m.group(2).strip()
            new_line = f"{m.group(1)} {new_value} |"
            lines[i] = new_line + "\n"
            return lines, True, old_value

    return lines, False, None


def find_municipality_section(lines, display_name):
    """
    Find the start and end line indices for a municipality's section.
    Sections start with '## N. Name' and end at the next '## ' or '---' before next ##.
    """
    start = None
    end = None
    # Match headers like "## 1. Mequon" or "## 2. Brookfield (City)"
    header_pattern = re.compile(r"^##\s+\d+\.\s+" + re.escape(display_name), re.IGNORECASE)
    next_section = re.compile(r"^##\s+(\d+\.|Comparative|References)")

    for i, line in enumerate(lines):
        if start is None:
            if header_pattern.match(line.strip()):
                start = i
        elif next_section.match(line.strip()):
            end = i
            break

    if start is not None and end is None:
        end = len(lines)

    return start, end


def update_comparative_table(lines, county_slug, data):
    """Update the Comparative Summary Table with fresh price and income data."""
    # Find the comparative table section
    table_start = None
    for i, line in enumerate(lines):
        if "Comparative Summary Table" in line and line.strip().startswith("##"):
            table_start = i
            break

    if table_start is None:
        return lines, []

    changes = []

    municipalities = get_municipalities_for_county(county_slug)
    for key, cfg in municipalities:
        muni_data = data.get(key, {})
        census = muni_data.get("census", {})
        redfin = muni_data.get("redfin", {})
        zillow = muni_data.get("zillow", {})

        display = cfg["display_name"]
        # Find the row in the comparative table for this municipality
        for i in range(table_start, min(table_start + 50, len(lines))):
            line = lines[i]
            # Match row containing the municipality name in bold
            if f"**{display}**" in line:
                cells = line.split("|")
                if len(cells) >= 5:
                    # cells[0] = empty, cells[1] = name, cells[2] = price, cells[3] = income, ...
                    old_price = cells[2].strip()
                    old_income = cells[3].strip()

                    # Update price from Redfin or Zillow
                    new_price = None
                    if redfin.get("median_sale_price"):
                        new_price = f"${redfin['median_sale_price']:,.0f}"
                    elif zillow.get("zhvi"):
                        new_price = f"${zillow['zhvi']:,.0f}"

                    # Update income from Census
                    new_income = None
                    if census.get("median_household_income"):
                        new_income = f"${census['median_household_income']:,}"

                    if new_price:
                        cells[2] = f" {new_price} "
                        changes.append(f"  Comparative table {display} price: {old_price} → {new_price}")
                    if new_income:
                        cells[3] = f" {new_income} "
                        changes.append(f"  Comparative table {display} income: {old_income} → {new_income}")

                    if new_price or new_income:
                        lines[i] = "|".join(cells)
                break

    return lines, changes


def update_last_updated(lines):
    """Update the 'Last Updated' line at the top of the file."""
    now = datetime.now()
    month_year = now.strftime("%B %Y")
    for i, line in enumerate(lines):
        if line.strip().startswith("*Last Updated:"):
            old = line.strip()
            lines[i] = f"*Last Updated: {month_year}*\n"
            return lines, f"  Last Updated: {old} → *Last Updated: {month_year}*"
    return lines, None


# ---------------------------------------------------------------------------
# Main update logic
# ---------------------------------------------------------------------------

def update_county_profile(county_slug, data, dry_run=False):
    """Update a single county's markdown profile with fresh data."""
    filepath = COUNTY_FILES.get(county_slug)
    if not filepath or not os.path.exists(filepath):
        print(f"\n  ERROR: Profile not found: {filepath}")
        return

    print(f"\n{'=' * 60}")
    print(f"UPDATING: {county_slug.replace('-', ' ').title()} County")
    print(f"{'=' * 60}")
    print(f"  File: {filepath}")

    with open(filepath, "r") as f:
        lines = f.readlines()

    all_changes = []
    municipalities = get_municipalities_for_county(county_slug)

    for key, cfg in municipalities:
        display = cfg["display_name"]
        muni_data = data.get(key, {})
        census = muni_data.get("census", {})
        zillow = muni_data.get("zillow", {})
        redfin = muni_data.get("redfin", {})

        if not census and not zillow and not redfin:
            print(f"\n  [{display}] No data available — skipping")
            continue

        print(f"\n  [{display}]")

        # Find this municipality's section
        start, end = find_municipality_section(lines, display)
        if start is None:
            print(f"    WARNING: Could not find section for '{display}'")
            continue

        section = lines[start:end]
        section_changes = []

        # --- Quick Snapshot updates ---

        # Population
        if census.get("population"):
            section, changed, old = update_table_row(
                section, "Population",
                _fmt_population(census["population"], census.get("source_year", "est."))
            )
            if changed:
                section_changes.append(f"    Population: {old} → {_fmt_population(census['population'], census.get('source_year', ''))}")

        # Median Age
        if census.get("median_age"):
            section, changed, old = update_table_row(
                section, "Median Age",
                _fmt_median_age(census["median_age"])
            )
            if changed:
                section_changes.append(f"    Median Age: {old} → {_fmt_median_age(census['median_age'])}")

        # Median Household Income
        if census.get("median_household_income"):
            section, changed, old = update_table_row(
                section, "Median Household Income",
                _fmt_income(census["median_household_income"])
            )
            if changed:
                section_changes.append(f"    Median HH Income: {old} → {_fmt_income(census['median_household_income'])}")

        # Median Home Price
        if zillow.get("zhvi"):
            section, changed, old = update_table_row(
                section, "Median Home Price",
                _fmt_home_price(zillow["zhvi"], zillow.get("zhvi_yoy_pct"))
            )
            if changed:
                section_changes.append(f"    Median Home Price: {old} → ${zillow['zhvi']:,.0f}")

        # Average Rent
        if zillow.get("zori"):
            section, changed, old = update_table_row(
                section, "Average Rent",
                _fmt_rent(zillow["zori"])
            )
            if changed:
                section_changes.append(f"    Average Rent: {old} → ${zillow['zori']:,.0f}/mo")

        # --- Real Estate Trends updates ---

        if redfin:
            # Median Sale Price YoY
            fmt = _fmt_sale_yoy(redfin)
            if fmt:
                section, changed, old = update_table_row(section, "Median Sale Price YoY Trend", fmt)
                if changed:
                    section_changes.append(f"    Sale Price YoY: {old} → {fmt}")

            # Days on Market
            fmt = _fmt_dom(redfin)
            if fmt:
                section, changed, old = update_table_row(section, "Average Days on Market", fmt)
                if changed:
                    section_changes.append(f"    Days on Market: {old} → {fmt}")

            # Price Per Square Foot
            fmt = _fmt_ppsf(redfin)
            if fmt:
                section, changed, old = update_table_row(section, "Price Per Square Foot", fmt)
                if changed:
                    section_changes.append(f"    Price/SqFt: {old} → {fmt}")

            # Market Competitiveness
            fmt = _fmt_competitiveness(redfin)
            if fmt:
                section, changed, old = update_table_row(section, "Market Competitiveness", fmt)
                if changed:
                    section_changes.append(f"    Competitiveness: updated")

        # Apply section changes back to main lines
        lines[start:end] = section

        if section_changes:
            for c in section_changes:
                print(c)
            all_changes.extend(section_changes)
        else:
            print("    No changes needed")

    # Update comparative table
    lines, comp_changes = update_comparative_table(lines, county_slug, data)
    all_changes.extend(comp_changes)
    for c in comp_changes:
        print(c)

    # Update Last Updated date
    lines, date_change = update_last_updated(lines)
    if date_change:
        print(f"\n{date_change}")
        all_changes.append(date_change)

    # Save results
    if all_changes:
        # Save intermediate JSON
        json_path = os.path.join(TMP_DIR, f"fetch_results_{county_slug}.json")
        county_data = {
            k: v for k, v in data.items()
            if MUNICIPALITIES.get(k, {}).get("county") == county_slug
        }
        with open(json_path, "w") as f:
            json.dump(county_data, f, indent=2, default=str)

        if dry_run:
            print(f"\n  DRY RUN: {len(all_changes)} changes would be made (not writing)")
            print(f"  Data saved to: {json_path}")
        else:
            with open(filepath, "w") as f:
                f.writelines(lines)
            print(f"\n  UPDATED: {filepath}")
            print(f"  {len(all_changes)} changes applied")
            print(f"  Data saved to: {json_path}")
    else:
        print(f"\n  No changes needed for {county_slug}")

    return len(all_changes)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Update neighborhood profile markdown files with fresh data."
    )
    parser.add_argument(
        "--county",
        choices=get_all_counties(),
        help="Update a specific county (default: all)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change without writing files",
    )
    args = parser.parse_args()

    counties = [args.county] if args.county else get_all_counties()

    print(f"\nCounty Neighborhood Profiles — Data Update")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"Counties: {', '.join(c.title() for c in counties)}")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE UPDATE'}")

    # Fetch all data once (shared across counties)
    data = fetch_all_data()

    total_changes = 0
    for county in counties:
        changes = update_county_profile(county, data, dry_run=args.dry_run)
        total_changes += (changes or 0)

    print(f"\n{'=' * 60}")
    print(f"COMPLETE: {total_changes} total changes across {len(counties)} county profile(s)")
    if args.dry_run:
        print("(Dry run — no files were modified)")
    print(f"{'=' * 60}\n")


if __name__ == "__main__":
    main()
