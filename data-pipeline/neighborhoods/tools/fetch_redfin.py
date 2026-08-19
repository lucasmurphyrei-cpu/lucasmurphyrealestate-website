"""
Fetch real estate sales data from the Redfin Data Center public downloads.

No API key required — this is a publicly available dataset.
Provides median sale price, days on market, price/sqft, sale-to-list ratio,
and year-over-year changes.
"""

import os
import time
import requests
import pandas as pd
from config import MUNICIPALITIES, TMP_DIR

REDFIN_URL = "https://redfin-public-data.s3.us-west-2.amazonaws.com/redfin_market_tracker/city_market_tracker.tsv000.gz"
REDFIN_CACHE = os.path.join(TMP_DIR, "redfin_city_market_tracker.tsv.gz")


def _download_redfin_data():
    """Download Redfin city market tracker, using cache if fresh."""
    if os.path.exists(REDFIN_CACHE):
        age_hours = (time.time() - os.path.getmtime(REDFIN_CACHE)) / 3600
        if age_hours < 24:
            print(f"  Using cached Redfin data (downloaded {age_hours:.1f}h ago)")
            return REDFIN_CACHE

    print("  Downloading Redfin city market tracker (~150-250MB compressed)...")
    print("  This may take a few minutes on the first run.")
    try:
        resp = requests.get(REDFIN_URL, timeout=300, stream=True)
        resp.raise_for_status()
        with open(REDFIN_CACHE, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192 * 16):
                f.write(chunk)
        size_mb = os.path.getsize(REDFIN_CACHE) / (1024 * 1024)
        print(f"  Downloaded {size_mb:.1f}MB")
        return REDFIN_CACHE
    except Exception as e:
        print(f"  ERROR downloading Redfin data: {e}")
        if os.path.exists(REDFIN_CACHE):
            os.remove(REDFIN_CACHE)
        return None


def _load_wisconsin_data(filepath):
    """Load Redfin TSV, filter to Wisconsin cities with latest period."""
    if not filepath:
        return None

    print("  Parsing Redfin data (filtering to Wisconsin)...")
    try:
        # Read in chunks to handle the large file efficiently
        chunks = []
        for chunk in pd.read_csv(
            filepath,
            sep="\t",
            compression="gzip",
            chunksize=100000,
            low_memory=False,
        ):
            # Filter to Wisconsin places, "All Residential" only
            wi_chunk = chunk[
                (chunk["STATE_CODE"] == "WI") &
                (chunk["PROPERTY_TYPE"] == "All Residential") &
                (chunk["REGION_TYPE"] == "place")
            ]
            if len(wi_chunk) > 0:
                chunks.append(wi_chunk)

        if not chunks:
            print("  WARNING: No Wisconsin city data found in Redfin file")
            return None

        df = pd.concat(chunks, ignore_index=True)
        print(f"  Found {len(df)} Wisconsin city-period rows")

        # Get the latest period for each city
        df["PERIOD_END"] = pd.to_datetime(df["PERIOD_END"])
        latest = df.sort_values("PERIOD_END").groupby("REGION").last().reset_index()
        print(f"  Latest data for {len(latest)} Wisconsin cities")
        return latest

    except Exception as e:
        print(f"  ERROR parsing Redfin data: {e}")
        return None


def fetch_redfin_data():
    """
    Fetch sales trend data for all configured municipalities from Redfin.

    Returns:
        dict: {municipality_key: {
            median_sale_price, median_sale_price_yoy,
            median_dom, median_dom_yoy,
            median_ppsf, median_ppsf_yoy,
            sale_to_list, latest_period
        }}
    """
    filepath = _download_redfin_data()
    df = _load_wisconsin_data(filepath)

    if df is None:
        return {}

    results = {}
    matched = 0

    # Build a lookup by lowercase city name (REGION includes state: "Mequon, WI")
    redfin_lookup = {}
    for _, row in df.iterrows():
        raw_name = str(row.get("REGION", "")).strip()
        # Strip state suffix: "Mequon, WI" → "mequon"
        name = raw_name.split(",")[0].strip().lower()
        redfin_lookup[name] = row

    for key, cfg in MUNICIPALITIES.items():
        redfin_name = cfg.get("redfin_name")
        if not redfin_name:
            continue

        row = redfin_lookup.get(redfin_name.lower())
        if row is None:
            continue

        entry = {
            "median_sale_price": _safe_numeric(row.get("MEDIAN_SALE_PRICE")),
            "median_sale_price_yoy": _safe_pct(row.get("MEDIAN_SALE_PRICE_YOY")),
            "median_dom": _safe_numeric(row.get("MEDIAN_DOM")),
            "median_dom_yoy": _safe_numeric(row.get("MEDIAN_DOM_YOY")),  # absolute days, not ratio
            "median_ppsf": _safe_numeric(row.get("MEDIAN_PPSF")),
            "median_ppsf_yoy": _safe_pct(row.get("MEDIAN_PPSF_YOY")),
            "sale_to_list": _safe_numeric(row.get("AVG_SALE_TO_LIST")),
            "homes_sold": _safe_numeric(row.get("HOMES_SOLD")),
            "latest_period": str(row.get("PERIOD_END", ""))[:10],
        }

        if entry["median_sale_price"] is not None:
            results[key] = entry
            matched += 1

    total = sum(1 for v in MUNICIPALITIES.values() if v.get("redfin_name"))
    print(f"  Matched {matched}/{total} municipalities with sale data")
    return results


def _safe_numeric(val):
    """Convert to float, handling NaN/None."""
    try:
        v = float(val)
        if pd.isna(v):
            return None
        return v
    except (ValueError, TypeError):
        return None


def _safe_pct(val):
    """Convert Redfin's decimal YoY to percentage (e.g., 0.05 → 5.0)."""
    v = _safe_numeric(val)
    if v is None:
        return None
    return round(v * 100, 1)


if __name__ == "__main__":
    print("=== Redfin Sales Data Fetcher ===\n")
    data = fetch_redfin_data()
    print(f"\nResults for {len(data)} municipalities:\n")
    for key, vals in sorted(data.items()):
        display = MUNICIPALITIES[key]["display_name"]
        price = f"${vals['median_sale_price']:,.0f}" if vals["median_sale_price"] else "N/A"
        yoy = f"{vals['median_sale_price_yoy']:+.1f}%" if vals["median_sale_price_yoy"] is not None else "N/A"
        dom = f"{vals['median_dom']:.0f} days" if vals["median_dom"] else "N/A"
        ppsf = f"${vals['median_ppsf']:,.0f}" if vals["median_ppsf"] else "N/A"
        stl = f"{vals['sale_to_list']:.3f}" if vals["sale_to_list"] else "N/A"
        print(f"  {display}: {price} ({yoy} YoY), DOM={dom}, PPSF={ppsf}, S/L={stl}")
        print(f"    Period: {vals.get('latest_period', 'N/A')}")
