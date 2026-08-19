"""
Fetch home value and rental data from Zillow Research public CSV downloads.

No API key required — these are publicly available research datasets.
- ZHVI (Zillow Home Value Index): typical home value by city/month
- ZORI (Zillow Observed Rent Index): typical rent by city/month
"""

import os
import io
import requests
import pandas as pd
from config import MUNICIPALITIES, TMP_DIR

ZHVI_URL = "https://files.zillowstatic.com/research/public_csvs/zhvi/City_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv"
ZORI_URL = "https://files.zillowstatic.com/research/public_csvs/zori/City_zori_uc_sfrcondomfr_sm_sa_month.csv"

ZHVI_CACHE = os.path.join(TMP_DIR, "zillow_zhvi.csv")
ZORI_CACHE = os.path.join(TMP_DIR, "zillow_zori.csv")


def _download_or_cache(url, cache_path, label):
    """Download CSV if not cached, return DataFrame filtered to Wisconsin."""
    if os.path.exists(cache_path):
        mod_time = os.path.getmtime(cache_path)
        import time
        age_hours = (time.time() - mod_time) / 3600
        if age_hours < 24:
            print(f"  Using cached {label} (downloaded {age_hours:.1f}h ago)")
            df = pd.read_csv(cache_path)
            return df[df["StateName"] == "WI"] if "StateName" in df.columns else df[df["State"] == "WI"]

    print(f"  Downloading {label}...")
    try:
        resp = requests.get(url, timeout=120)
        resp.raise_for_status()
        with open(cache_path, "wb") as f:
            f.write(resp.content)
        df = pd.read_csv(io.BytesIO(resp.content))
        # Filter to Wisconsin
        if "StateName" in df.columns:
            return df[df["StateName"] == "Wisconsin"]
        elif "State" in df.columns:
            return df[df["State"] == "WI"]
        return df
    except Exception as e:
        print(f"  ERROR downloading {label}: {e}")
        return None


def _get_latest_value_and_yoy(df, row_mask):
    """
    From a Zillow time-series row, get the latest monthly value and YoY change.
    Zillow CSVs have date columns like '2024-01-31', '2024-02-29', etc.
    """
    if df is None or row_mask.sum() == 0:
        return None, None

    row = df[row_mask].iloc[0]

    # Find date columns (format: YYYY-MM-DD)
    date_cols = [c for c in df.columns if len(c) == 10 and c[4] == "-" and c[7] == "-"]
    date_cols = sorted(date_cols)

    if not date_cols:
        return None, None

    # Get latest non-null value
    latest_val = None
    latest_col = None
    for col in reversed(date_cols):
        val = row.get(col)
        if pd.notna(val):
            latest_val = float(val)
            latest_col = col
            break

    if latest_val is None or latest_col is None:
        return None, None

    # Calculate YoY — find same month one year earlier
    try:
        year = int(latest_col[:4])
        prior_col_prefix = f"{year - 1}{latest_col[4:7]}"
        prior_cols = [c for c in date_cols if c.startswith(prior_col_prefix)]
        if prior_cols:
            prior_val = row.get(prior_cols[0])
            if pd.notna(prior_val) and float(prior_val) > 0:
                yoy_pct = ((latest_val - float(prior_val)) / float(prior_val)) * 100
                return latest_val, round(yoy_pct, 1)
    except (ValueError, IndexError):
        pass

    return latest_val, None


def fetch_zillow_data():
    """
    Fetch ZHVI (home values) and ZORI (rents) for all configured municipalities.

    Returns:
        dict: {municipality_key: {zhvi, zhvi_yoy_pct, zori, zori_yoy_pct}}
    """
    zhvi_df = _download_or_cache(ZHVI_URL, ZHVI_CACHE, "Zillow ZHVI")
    zori_df = _download_or_cache(ZORI_URL, ZORI_CACHE, "Zillow ZORI")

    results = {}
    matched_zhvi = 0
    matched_zori = 0

    for key, cfg in MUNICIPALITIES.items():
        zillow_name = cfg.get("zillow_name")
        if not zillow_name:
            continue

        entry = {"zhvi": None, "zhvi_yoy_pct": None, "zori": None, "zori_yoy_pct": None}

        # Match ZHVI
        if zhvi_df is not None:
            # Match by RegionName (city name) — case-insensitive
            city_col = "RegionName" if "RegionName" in zhvi_df.columns else "City"
            mask = zhvi_df[city_col].str.lower() == zillow_name.lower()
            if mask.sum() > 0:
                val, yoy = _get_latest_value_and_yoy(zhvi_df, mask)
                entry["zhvi"] = val
                entry["zhvi_yoy_pct"] = yoy
                if val:
                    matched_zhvi += 1
            else:
                print(f"  WARNING: No Zillow ZHVI match for '{zillow_name}'")

        # Match ZORI
        if zori_df is not None:
            city_col = "RegionName" if "RegionName" in zori_df.columns else "City"
            mask = zori_df[city_col].str.lower() == zillow_name.lower()
            if mask.sum() > 0:
                val, yoy = _get_latest_value_and_yoy(zori_df, mask)
                entry["zori"] = val
                entry["zori_yoy_pct"] = yoy
                if val:
                    matched_zori += 1

        if any(v is not None for v in entry.values()):
            results[key] = entry

    total = sum(1 for v in MUNICIPALITIES.values() if v.get("zillow_name"))
    print(f"  ZHVI matched: {matched_zhvi}/{total} | ZORI matched: {matched_zori}/{total}")
    return results


if __name__ == "__main__":
    print("=== Zillow Research Data Fetcher ===\n")
    data = fetch_zillow_data()
    print(f"\nResults for {len(data)} municipalities:\n")
    for key, vals in sorted(data.items()):
        display = MUNICIPALITIES[key]["display_name"]
        zhvi = f"${vals['zhvi']:,.0f}" if vals["zhvi"] else "N/A"
        zhvi_yoy = f"{vals['zhvi_yoy_pct']:+.1f}%" if vals["zhvi_yoy_pct"] is not None else "N/A"
        zori = f"${vals['zori']:,.0f}/mo" if vals["zori"] else "N/A"
        print(f"  {display}: ZHVI={zhvi} ({zhvi_yoy} YoY), ZORI={zori}")
