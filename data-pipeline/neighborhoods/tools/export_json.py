#!/usr/bin/env python3
"""
Export neighborhood profile markdown files to structured JSON.

Parses all county profiles in output/ and produces:
  - output/json/profiles.json        — Full profile data for all municipalities
  - output/json/profiles-slim.json   — Lightweight version (no long narratives)

Usage:
    python tools/export_json.py
    python tools/export_json.py --county ozaukee
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import COUNTY_FILES, MUNICIPALITIES, get_all_counties

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Write straight into the site's data directory. This used to write to output/json/ and
# getting it into the site was a manual copy -- which is exactly how quiz-attributes.json
# came to disagree with the published copy by up to $217,189 on a single municipality,
# with neither file declaring which was right. One destination, no copy step, no drift.
JSON_DIR = os.path.normpath(
    os.path.join(PROJECT_ROOT, "..", "..", "src", "data", "neighborhoods"))
TMP_DIR = os.path.join(PROJECT_ROOT, ".tmp")


# ---------------------------------------------------------------------------
# Markdown parsing helpers
# ---------------------------------------------------------------------------

def _strip_refs(text):
    """Remove footnote references like [1], [2][3], etc."""
    return re.sub(r"\s*\[\d+\](\[\d+\])*", "", text).strip()


def _parse_table_rows(lines):
    """Parse markdown table rows into a dict of {bold_field: value}."""
    rows = {}
    for line in lines:
        line = line.strip()
        if not line.startswith("|") or line.startswith("|--") or line.startswith("| --"):
            continue
        cells = [c.strip() for c in line.split("|")]
        # Filter empty strings from leading/trailing pipes
        cells = [c for c in cells if c]
        if len(cells) < 2:
            continue
        # Skip header rows (no bold text)
        if "**" not in cells[0]:
            continue
        # Extract field name from bold
        field_match = re.search(r"\*\*(.+?)\*\*", cells[0])
        if field_match:
            field = field_match.group(1).strip()
            value = _strip_refs(cells[1])
            rows[field] = value
    return rows


def _normalize_snapshot_key(field):
    """Map various Quick Snapshot field names to standard keys."""
    field_lower = field.lower()
    if "population" in field_lower:
        return "population"
    if "median age" in field_lower:
        return "median_age"
    if "median household income" in field_lower or "household income" in field_lower:
        return "median_household_income"
    if "median home price" in field_lower or "home price" in field_lower:
        return "median_home_price"
    if "average rent" in field_lower or "rent" in field_lower:
        return "average_rent"
    if "typical home style" in field_lower or "home style" in field_lower:
        return "typical_home_style"
    if "school" in field_lower:
        return "school_district"
    return field_lower.replace(" ", "_")


def _normalize_trends_key(field):
    """Map Real Estate Trends field names to standard keys."""
    field_lower = field.lower()
    if "sale price" in field_lower and "yoy" in field_lower:
        return "median_sale_price_yoy"
    if "days on market" in field_lower:
        return "avg_days_on_market"
    if "per square foot" in field_lower or "price per sq" in field_lower:
        return "price_per_sqft"
    if "competitiv" in field_lower or "dominant buyer" in field_lower:
        return "market_competitiveness"
    return field_lower.replace(" ", "_")


def _extract_quiz_tags(text):
    """Extract hashtag quiz tags from text like `#Tag1` `#Tag2`."""
    return re.findall(r"#\w+", text)


def _extract_bold_sections(text):
    """Extract sections delimited by **Bold Header:** from narrative text."""
    sections = {}
    # Match both paragraph style and bullet style
    # Pattern: **Label:** content (until next ** or end)
    pattern = re.compile(
        r"\*\*(.+?)[:\*]*\*\*[:\s]*(.+?)(?=\n\s*[\-\*]?\s*\*\*|\n\n###|\n---|\Z)",
        re.DOTALL,
    )
    for match in pattern.finditer(text):
        label = match.group(1).strip().rstrip(":")
        content = match.group(2).strip()
        # Clean up bullet prefixes
        content = re.sub(r"^\-\s*", "", content)
        sections[label] = _strip_refs(content)
    return sections


def _normalize_buyer_key(label):
    """Map Buyer & Lifestyle Fit labels to standard keys."""
    label_lower = label.lower()
    if "ideal" in label_lower or "what type" in label_lower or "buyer" in label_lower:
        return "ideal_buyer"
    if "commute" in label_lower:
        return "commute_to_downtown"
    if "walkab" in label_lower or "transport" in label_lower:
        return "walkability_transportation"
    if "crime" in label_lower or "safety" in label_lower:
        return "crime_safety"
    return label_lower.replace(" ", "_").replace("/", "_")


def _parse_amenities_section(text):
    """Parse amenities section into structured fields.

    Handles both list-style and paragraph-style amenities, extracting the
    known subsection headers (Community Vibe, Notable Events, Proximity)
    and collecting all attraction/restaurant list items separately.
    """
    result = {}

    # Known subsection headers to extract as named fields
    known_sections = {
        "community vibe": "community_vibe",
        "notable annual events": "notable_events",
        "notable events": "notable_events",
        "proximity to lake": "proximity_lake_employers",
        "proximity to lake michigan": "proximity_lake_employers",
        "proximity to lake michigan or major employers": "proximity_lake_employers",
        "major employers": "major_employers",
    }

    # Split by bold section headers: **Header:**
    # This regex captures the header name and everything until the next bold header
    parts = re.split(r"\n\s*[\-\*]?\s*\*\*([^*]+?)[:\*]*\*\*[:\s]*", text)

    # parts[0] = text before first header, then alternating header/content
    attractions_parts = []
    restaurants_parts = []

    i = 1  # skip preamble
    while i < len(parts) - 1:
        header = parts[i].strip().rstrip(":")
        content = parts[i + 1].strip() if i + 1 < len(parts) else ""
        content = _strip_refs(content)
        header_lower = header.lower()

        # Check if this is a known section header
        matched = False
        for key_phrase, field_name in known_sections.items():
            if key_phrase in header_lower:
                result[field_name] = content
                matched = True
                break

        if not matched:
            # Check if this is a section like "Major Parks & Attractions:" or "Restaurants & Dining:"
            if "park" in header_lower or "attraction" in header_lower:
                attractions_parts.append(content)
            elif "restaurant" in header_lower or "dining" in header_lower:
                restaurants_parts.append(content)
            else:
                # It's a list item (attraction name like "Fiserv Forum & Deer District")
                item = f"**{header}** -- {content}" if content else f"**{header}**"
                # Guess if it's a restaurant or attraction based on keywords
                if any(w in header_lower for w in ["cafe", "restaurant", "grill", "pub", "brewery", "winery", "kitchen", "bar"]):
                    restaurants_parts.append(item)
                else:
                    attractions_parts.append(item)
        i += 2

    if attractions_parts:
        result["parks_attractions"] = re.sub(r"-- --", "--", "\n".join(attractions_parts))
    if restaurants_parts:
        result["restaurants_dining"] = re.sub(r"-- --", "--", "\n".join(restaurants_parts))

    return result


# ---------------------------------------------------------------------------
# Section splitter
# ---------------------------------------------------------------------------

def split_municipality_sections(content):
    """Split a county markdown file into individual municipality sections.

    Returns list of (number, display_name, section_text) tuples.
    """
    # Match headers like: ## 1. Mequon  or  ## 16. Fox Point
    pattern = re.compile(r"^(## (\d+)\.\s+(.+))$", re.MULTILINE)
    matches = list(pattern.finditer(content))

    sections = []
    for i, match in enumerate(matches):
        num = int(match.group(2))
        name = match.group(3).strip()
        start = match.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(content)
        section_text = content[start:end]
        sections.append((num, name, section_text))

    return sections


def split_subsections(section_text):
    """Split a municipality section by ### headers.

    Returns dict of {header_name: content_text}.
    """
    pattern = re.compile(r"^### (.+)$", re.MULTILINE)
    matches = list(pattern.finditer(section_text))

    subsections = {}
    for i, match in enumerate(matches):
        header = match.group(1).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(section_text)
        subsections[header] = section_text[start:end].strip()

    return subsections


# ---------------------------------------------------------------------------
# Municipality parser
# ---------------------------------------------------------------------------

def parse_municipality(num, display_name, section_text, county_slug):
    """Parse a single municipality section into structured data."""
    subsections = split_subsections(section_text)

    # Find matching config key
    config_key = None
    for key, cfg in MUNICIPALITIES.items():
        if cfg["county"] == county_slug and cfg["display_name"] == display_name:
            config_key = key
            break

    # If exact match failed, try partial match
    if config_key is None:
        for key, cfg in MUNICIPALITIES.items():
            if cfg["county"] == county_slug and (
                display_name.startswith(cfg["display_name"])
                or cfg["display_name"].startswith(display_name)
            ):
                config_key = key
                break

    result = {
        "id": config_key or display_name.lower().replace(" ", "_").replace("(", "").replace(")", ""),
        "display_name": display_name,
        "county": county_slug,
        "section_number": num,
    }

    # --- Quick Snapshot ---
    for header, content in subsections.items():
        if "quick snapshot" in header.lower():
            raw_rows = _parse_table_rows(content.split("\n"))
            snapshot = {}
            for field, value in raw_rows.items():
                key = _normalize_snapshot_key(field)
                snapshot[key] = value
            result["quick_snapshot"] = snapshot
            break

    # --- Buyer & Lifestyle Fit ---
    for header, content in subsections.items():
        if "buyer" in header.lower() or "lifestyle fit" in header.lower():
            bold_sections = _extract_bold_sections(content)
            buyer = {}
            for label, text in bold_sections.items():
                key = _normalize_buyer_key(label)
                buyer[key] = text
            result["buyer_lifestyle_fit"] = buyer
            break

    # --- Amenities & Character ---
    for header, content in subsections.items():
        if "amenities" in header.lower() or "character" in header.lower():
            result["amenities_character"] = _parse_amenities_section(content)
            break

    # --- Real Estate Trends ---
    for header, content in subsections.items():
        if "real estate" in header.lower() or "trends" in header.lower():
            raw_rows = _parse_table_rows(content.split("\n"))
            trends = {}
            for field, value in raw_rows.items():
                key = _normalize_trends_key(field)
                trends[key] = value
            result["real_estate_trends"] = trends
            break

    # --- Lifestyle Summary ---
    for header, content in subsections.items():
        if "lifestyle summary" in header.lower():
            # Strip any trailing --- separators
            summary = content.strip().rstrip("-").strip()
            result["lifestyle_summary"] = _strip_refs(summary)
            break

    # --- Quiz Tags ---
    for header, content in subsections.items():
        if "quiz tags" in header.lower():
            result["quiz_tags"] = _extract_quiz_tags(content)
            break

    return result


# ---------------------------------------------------------------------------
# County parser
# ---------------------------------------------------------------------------

def parse_county_file(county_slug):
    """Parse a full county markdown file into structured data."""
    filepath = COUNTY_FILES.get(county_slug)
    if not filepath or not os.path.exists(filepath):
        print(f"  WARNING: File not found for {county_slug}: {filepath}")
        return None

    with open(filepath, "r") as f:
        content = f.read()

    # Extract county overview (everything before first ## N. section)
    first_muni = re.search(r"^## \d+\.", content, re.MULTILINE)
    overview = ""
    if first_muni:
        overview_text = content[: first_muni.start()].strip()
        # Remove the title line and metadata
        overview_lines = overview_text.split("\n")
        # Skip title, subtitle, metadata, and separators
        overview_parts = []
        for line in overview_lines:
            stripped = line.strip()
            if stripped.startswith("#") or stripped == "---" or stripped.startswith("**Last Updated"):
                continue
            if stripped.startswith("**Coverage:") or stripped.startswith("**Purpose:"):
                continue
            if stripped.startswith("## Table of Contents") or stripped.startswith("1. ["):
                continue
            if re.match(r"^\d+\. \[", stripped):
                continue
            if stripped:
                overview_parts.append(stripped)
        overview = "\n".join(overview_parts).strip()

    # Parse each municipality
    sections = split_municipality_sections(content)
    municipalities = []
    for num, name, text in sections:
        muni = parse_municipality(num, name, text, county_slug)
        municipalities.append(muni)

    county_names = {
        "milwaukee": "Milwaukee County",
        "waukesha": "Waukesha County",
        "ozaukee": "Ozaukee County",
        "washington": "Washington County",
    }

    return {
        "slug": county_slug,
        "name": county_names.get(county_slug, county_slug.title() + " County"),
        "overview": _strip_refs(overview) if overview else "",
        "municipality_count": len(municipalities),
        "municipalities": municipalities,
    }


# ---------------------------------------------------------------------------
# Merge with API data
# ---------------------------------------------------------------------------

def load_api_data(county_slug):
    """Load cached API fetch results from .tmp/ if available."""
    path = os.path.join(TMP_DIR, f"fetch_results_{county_slug}.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {}


def enrich_with_api_data(county_data, api_data):
    """Add clean numeric API data alongside the display text."""
    for muni in county_data["municipalities"]:
        muni_id = muni["id"]
        if muni_id in api_data:
            api = api_data[muni_id]
            muni["api_data"] = {
                "census": api.get("census", {}),
                "zillow": api.get("zillow", {}),
                "redfin": api.get("redfin", {}),
            }


# ---------------------------------------------------------------------------
# Slim version
# ---------------------------------------------------------------------------

def make_slim(municipality):
    """Create a lightweight version of a municipality profile."""
    slim = {
        "id": municipality["id"],
        "display_name": municipality["display_name"],
        "county": municipality["county"],
    }

    if "quick_snapshot" in municipality:
        slim["quick_snapshot"] = municipality["quick_snapshot"]

    if "real_estate_trends" in municipality:
        slim["real_estate_trends"] = municipality["real_estate_trends"]

    if "quiz_tags" in municipality:
        slim["quiz_tags"] = municipality["quiz_tags"]

    if "lifestyle_summary" in municipality:
        slim["lifestyle_summary"] = municipality["lifestyle_summary"]

    if "api_data" in municipality:
        slim["api_data"] = municipality["api_data"]

    return slim


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Export profiles to JSON.")
    parser.add_argument("--county", choices=get_all_counties(), help="Export one county")
    args = parser.parse_args()

    os.makedirs(JSON_DIR, exist_ok=True)

    counties_to_export = [args.county] if args.county else get_all_counties()

    print(f"County Neighborhood Profiles — JSON Export")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"Counties: {', '.join(c.title() for c in counties_to_export)}\n")

    full_output = {
        "meta": {
            "exported_at": datetime.now().isoformat(),
            "source": "County Neighborhood Profiles",
            "version": "1.0",
        },
        "counties": {},
        "all_municipalities": [],
    }

    for county_slug in counties_to_export:
        print(f"Parsing {county_slug}...")
        county_data = parse_county_file(county_slug)
        if not county_data:
            continue

        # Enrich with API data if available
        api_data = load_api_data(county_slug)
        if api_data:
            enrich_with_api_data(county_data, api_data)
            print(f"  Enriched with API data ({len(api_data)} municipalities)")

        full_output["counties"][county_slug] = county_data
        full_output["all_municipalities"].extend(county_data["municipalities"])

        print(f"  Parsed {county_data['municipality_count']} municipalities")

    # Update meta
    full_output["meta"]["counties"] = len(full_output["counties"])
    full_output["meta"]["total_municipalities"] = len(full_output["all_municipalities"])

    # Write full profiles
    full_path = os.path.join(JSON_DIR, "profiles.json")
    with open(full_path, "w") as f:
        json.dump(full_output, f, indent=2, ensure_ascii=False)
    print(f"\nWrote: {full_path}")

    # Write slim version
    slim_output = {
        "meta": full_output["meta"],
        "municipalities": [make_slim(m) for m in full_output["all_municipalities"]],
    }
    slim_path = os.path.join(JSON_DIR, "profiles-slim.json")
    with open(slim_path, "w") as f:
        json.dump(slim_output, f, indent=2, ensure_ascii=False)
    print(f"Wrote: {slim_path}")

    # Stats
    total = full_output["meta"]["total_municipalities"]
    with_tags = sum(1 for m in full_output["all_municipalities"] if m.get("quiz_tags"))
    with_summary = sum(1 for m in full_output["all_municipalities"] if m.get("lifestyle_summary"))
    with_api = sum(1 for m in full_output["all_municipalities"] if m.get("api_data"))

    print(f"\nExport summary:")
    print(f"  Total municipalities: {total}")
    print(f"  With quiz tags: {with_tags}")
    print(f"  With lifestyle summary: {with_summary}")
    print(f"  With API data: {with_api}")


if __name__ == "__main__":
    main()
