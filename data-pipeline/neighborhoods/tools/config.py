"""
Municipality registry for southeastern Wisconsin county profiles.

Maps each municipality to its county, data source identifiers, and name variants
used for matching across Census, Zillow, and Redfin datasets.
"""

import os

# Project paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "output")
TMP_DIR = os.path.join(PROJECT_ROOT, ".tmp")

# Ensure .tmp exists
os.makedirs(TMP_DIR, exist_ok=True)

# County slug → output file path
COUNTY_FILES = {
    "ozaukee": os.path.join(OUTPUT_DIR, "ozaukee-county", "ozaukee-county-neighborhood-profiles.md"),
    "milwaukee": os.path.join(OUTPUT_DIR, "milwaukee-county", "milwaukee-county-neighborhood-profiles.md"),
    "washington": os.path.join(OUTPUT_DIR, "washington-county", "washington-county-neighborhood-profiles.md"),
    "waukesha": os.path.join(OUTPUT_DIR, "waukesha-county", "waukesha-county-neighborhood-profiles.md"),
}

# Municipality registry
# Each entry: {
#   "county": county slug,
#   "display_name": name as it appears in the markdown header,
#   "census_name": name pattern to match in Census API results (lowercase),
#   "census_geoid": Census county-subdivision GEOID, used for civil Towns and
#       newly-incorporated Villages that have no entry in the Census "place"
#       universe. Fetched via Census Reporter (see fetch_census.py).
#   "zillow_name": city name to match in Zillow CSVs,
#   "redfin_name": city name to match in Redfin TSV,
#   "is_neighborhood": True if not an independent municipality (e.g., Bay View),
# }

MUNICIPALITIES = {
    # === Ozaukee County ===
    "mequon": {
        "county": "ozaukee",
        "display_name": "Mequon",
        "census_name": "mequon city",
        "zillow_name": "Mequon",
        "redfin_name": "Mequon",
    },
    "cedarburg": {
        "county": "ozaukee",
        "display_name": "Cedarburg",
        "census_name": "cedarburg city",
        "zillow_name": "Cedarburg",
        "redfin_name": "Cedarburg",
    },
    "grafton": {
        "county": "ozaukee",
        "display_name": "Grafton",
        "census_name": "grafton village",
        "zillow_name": "Grafton",
        "redfin_name": "Grafton",
    },
    "port_washington": {
        "county": "ozaukee",
        "display_name": "Port Washington",
        "census_name": "port washington city",
        "zillow_name": "Port Washington",
        "redfin_name": "Port Washington",
    },
    "thiensville": {
        "county": "ozaukee",
        "display_name": "Thiensville",
        "census_name": "thiensville village",
        "zillow_name": "Thiensville",
        "redfin_name": "Thiensville",
    },
    "saukville": {
        "county": "ozaukee",
        "display_name": "Saukville",
        "census_name": "saukville village",
        "zillow_name": "Saukville",
        "redfin_name": "Saukville",
    },
    "belgium": {
        "county": "ozaukee",
        "display_name": "Belgium",
        "census_name": "belgium village",
        "zillow_name": "Belgium",
        "redfin_name": "Belgium",
    },
    "fredonia": {
        "county": "ozaukee",
        "display_name": "Fredonia",
        "census_name": "fredonia village",
        "zillow_name": "Fredonia",
        "redfin_name": "Fredonia",
    },

    # === Waukesha County ===
    "waukesha": {
        "county": "waukesha",
        "display_name": "City of Waukesha",
        "census_name": "waukesha city",
        "zillow_name": "Waukesha",
        "redfin_name": "Waukesha",
    },
    "brookfield": {
        "county": "waukesha",
        "display_name": "Brookfield (City)",
        "census_name": "brookfield city",
        "zillow_name": "Brookfield",
        "redfin_name": "Brookfield",
    },
    "new_berlin": {
        "county": "waukesha",
        "display_name": "New Berlin",
        "census_name": "new berlin city",
        "zillow_name": "New Berlin",
        "redfin_name": "New Berlin",
    },
    "menomonee_falls": {
        "county": "waukesha",
        "display_name": "Menomonee Falls",
        "census_name": "menomonee falls village",
        "zillow_name": "Menomonee Falls",
        "redfin_name": "Menomonee Falls",
    },
    "pewaukee": {
        "county": "waukesha",
        "display_name": "Pewaukee (City/Village)",
        "census_name": "pewaukee city",
        "zillow_name": "Pewaukee",
        "redfin_name": "Pewaukee",
    },
    "oconomowoc": {
        "county": "waukesha",
        "display_name": "Oconomowoc",
        "census_name": "oconomowoc city",
        "zillow_name": "Oconomowoc",
        "redfin_name": "Oconomowoc",
    },
    "muskego": {
        "county": "waukesha",
        "display_name": "Muskego",
        "census_name": "muskego city",
        "zillow_name": "Muskego",
        "redfin_name": "Muskego",
    },
    "delafield": {
        "county": "waukesha",
        "display_name": "Delafield",
        "census_name": "delafield city",
        "zillow_name": "Delafield",
        "redfin_name": "Delafield",
    },
    "hartland": {
        "county": "waukesha",
        "display_name": "Hartland",
        "census_name": "hartland village",
        "zillow_name": "Hartland",
        "redfin_name": "Hartland",
    },
    "mukwonago": {
        "county": "waukesha",
        "display_name": "Mukwonago",
        "census_name": "mukwonago village",
        "zillow_name": "Mukwonago",
        "redfin_name": "Mukwonago",
    },
    "sussex": {
        "county": "waukesha",
        "display_name": "Sussex",
        "census_name": "sussex village",
        "zillow_name": "Sussex",
        "redfin_name": "Sussex",
    },
    "elm_grove": {
        "county": "waukesha",
        "display_name": "Elm Grove",
        "census_name": "elm grove village",
        "zillow_name": "Elm Grove",
        "redfin_name": "Elm Grove",
    },
    "butler": {
        "county": "waukesha",
        "display_name": "Butler",
        "census_name": "butler village",
        "zillow_name": "Butler",
        "redfin_name": "Butler",
    },
    "chenequa": {
        "county": "waukesha",
        "display_name": "Chenequa",
        "census_name": "chenequa village",
        "zillow_name": "Chenequa",
        "redfin_name": "Chenequa",
    },
    "dousman": {
        "county": "waukesha",
        "display_name": "Dousman",
        "census_name": "dousman village",
        "zillow_name": "Dousman",
        "redfin_name": "Dousman",
    },
    "eagle": {
        "county": "waukesha",
        "display_name": "Eagle",
        "census_name": "eagle village",
        "zillow_name": "Eagle",
        "redfin_name": "Eagle",
    },
    "lac_la_belle": {
        "county": "waukesha",
        "display_name": "Lac La Belle",
        "census_name": "lac la belle village",
        "zillow_name": "Lac La Belle",
        "redfin_name": "Lac La Belle",
    },
    "lannon": {
        "county": "waukesha",
        "display_name": "Lannon",
        "census_name": "lannon village",
        "zillow_name": "Lannon",
        "redfin_name": "Lannon",
    },
    "north_prairie": {
        "county": "waukesha",
        "display_name": "North Prairie",
        "census_name": "north prairie village",
        "zillow_name": "North Prairie",
        "redfin_name": "North Prairie",
    },
    "big_bend": {
        "county": "waukesha",
        "display_name": "Big Bend",
        "census_name": "big bend village",
        "zillow_name": "Big Bend",
        "redfin_name": "Big Bend",
    },
    "merton": {
        "county": "waukesha",
        "display_name": "Merton",
        "census_name": "merton village",
        "zillow_name": "Merton",
        "redfin_name": "Merton",
    },
    "nashotah": {
        "county": "waukesha",
        "display_name": "Nashotah",
        "census_name": "nashotah village",
        "zillow_name": "Nashotah",
        "redfin_name": "Nashotah",
    },
    "wales": {
        "county": "waukesha",
        "display_name": "Wales",
        "census_name": "wales village",
        "zillow_name": "Wales",
        "redfin_name": "Wales",
    },
    "genesee": {
        "county": "waukesha",
        "display_name": "Genesee (Town)",
        "census_name": None,  # civil town — not in the Census "place" universe
        "census_geoid": "5513328487",
        "zillow_name": "Genesee",
        "redfin_name": "Genesee",
    },
    "lisbon": {
        "county": "waukesha",
        "display_name": "Lisbon",
        "census_name": None,  # incorporated as a village in 2024; use GEOID
        "census_geoid": "5513344847",
        "zillow_name": "Lisbon",
        "redfin_name": "Lisbon",
    },
    "summit": {
        "county": "waukesha",
        "display_name": "Summit",
        "census_name": None,
        "census_geoid": "5513378375",
        "zillow_name": "Summit",
        "redfin_name": "Summit",
    },
    "vernon": {
        "county": "waukesha",
        "display_name": "Vernon",
        "census_name": None,
        "census_geoid": "5513382575",
        "zillow_name": "Vernon",
        "redfin_name": "Vernon",
    },

    # === Milwaukee County ===
    "milwaukee": {
        "county": "milwaukee",
        "display_name": "Milwaukee (City Proper)",
        "census_name": "milwaukee city",
        "zillow_name": "Milwaukee",
        "redfin_name": "Milwaukee",
    },
    "wauwatosa": {
        "county": "milwaukee",
        "display_name": "Wauwatosa",
        "census_name": "wauwatosa city",
        "zillow_name": "Wauwatosa",
        "redfin_name": "Wauwatosa",
    },
    "west_allis": {
        "county": "milwaukee",
        "display_name": "West Allis",
        "census_name": "west allis city",
        "zillow_name": "West Allis",
        "redfin_name": "West Allis",
    },
    "shorewood": {
        "county": "milwaukee",
        "display_name": "Shorewood",
        "census_name": "shorewood village",
        "zillow_name": "Shorewood",
        "redfin_name": "Shorewood",
    },
    "whitefish_bay": {
        "county": "milwaukee",
        "display_name": "Whitefish Bay",
        "census_name": "whitefish bay village",
        "zillow_name": "Whitefish Bay",
        "redfin_name": "Whitefish Bay",
    },
    "bay_view": {
        "county": "milwaukee",
        "display_name": "Bay View (within Milwaukee)",
        "census_name": None,  # neighborhood, no Census place
        "zillow_name": None,
        "redfin_name": None,
        "is_neighborhood": True,
    },
    "glendale": {
        "county": "milwaukee",
        "display_name": "Glendale",
        "census_name": "glendale city",
        "zillow_name": "Glendale",
        "redfin_name": "Glendale",
    },
    "greenfield": {
        "county": "milwaukee",
        "display_name": "Greenfield",
        "census_name": "greenfield city",
        "zillow_name": "Greenfield",
        "redfin_name": "Greenfield",
    },
    "greendale": {
        "county": "milwaukee",
        "display_name": "Greendale",
        "census_name": "greendale village",
        "zillow_name": "Greendale",
        "redfin_name": "Greendale",
    },
    "franklin": {
        "county": "milwaukee",
        "display_name": "Franklin",
        "census_name": "franklin city",
        "zillow_name": "Franklin",
        "redfin_name": "Franklin",
    },
    "oak_creek": {
        "county": "milwaukee",
        "display_name": "Oak Creek",
        "census_name": "oak creek city",
        "zillow_name": "Oak Creek",
        "redfin_name": "Oak Creek",
    },
    "south_milwaukee": {
        "county": "milwaukee",
        "display_name": "South Milwaukee",
        "census_name": "south milwaukee city",
        "zillow_name": "South Milwaukee",
        "redfin_name": "South Milwaukee",
    },
    "st_francis": {
        "county": "milwaukee",
        "display_name": "St. Francis",
        "census_name": "st. francis city",
        "zillow_name": "Saint Francis",
        "redfin_name": "St. Francis",
    },
    "brown_deer": {
        "county": "milwaukee",
        "display_name": "Brown Deer",
        "census_name": "brown deer village",
        "zillow_name": "Brown Deer",
        "redfin_name": "Brown Deer",
    },
    "river_hills": {
        "county": "milwaukee",
        "display_name": "River Hills",
        "census_name": "river hills village",
        "zillow_name": "River Hills",
        "redfin_name": "River Hills",
    },
    "fox_point": {
        "county": "milwaukee",
        "display_name": "Fox Point",
        "census_name": "fox point village",
        "zillow_name": "Fox Point",
        "redfin_name": "Fox Point",
    },
    "bayside": {
        "county": "milwaukee",
        "display_name": "Bayside",
        "census_name": "bayside village",
        "zillow_name": "Bayside",
        "redfin_name": "Bayside",
    },
    "west_milwaukee": {
        "county": "milwaukee",
        "display_name": "West Milwaukee",
        "census_name": "west milwaukee village",
        "zillow_name": "West Milwaukee",
        "redfin_name": "West Milwaukee",
    },
    "cudahy": {
        "county": "milwaukee",
        "display_name": "Cudahy",
        "census_name": "cudahy city",
        "zillow_name": "Cudahy",
        "redfin_name": "Cudahy",
    },
    "hales_corners": {
        "county": "milwaukee",
        "display_name": "Hales Corners",
        "census_name": "hales corners village",
        "zillow_name": "Hales Corners",
        "redfin_name": "Hales Corners",
    },

    # === Washington County ===
    "germantown": {
        "county": "washington",
        "display_name": "Germantown",
        "census_name": "germantown village",
        "zillow_name": "Germantown",
        "redfin_name": "Germantown",
    },
    "west_bend": {
        "county": "washington",
        "display_name": "West Bend",
        "census_name": "west bend city",
        "zillow_name": "West Bend",
        "redfin_name": "West Bend",
    },
    "hartford": {
        "county": "washington",
        "display_name": "Hartford",
        "census_name": "hartford city",
        "zillow_name": "Hartford",
        "redfin_name": "Hartford",
    },
    "jackson": {
        "county": "washington",
        "display_name": "Jackson",
        "census_name": "jackson village",
        "zillow_name": "Jackson",
        "redfin_name": "Jackson",
    },
    "slinger": {
        "county": "washington",
        "display_name": "Slinger",
        "census_name": "slinger village",
        "zillow_name": "Slinger",
        "redfin_name": "Slinger",
    },
    "kewaskum": {
        "county": "washington",
        "display_name": "Kewaskum",
        "census_name": "kewaskum village",
        "zillow_name": "Kewaskum",
        "redfin_name": "Kewaskum",
    },
    "richfield": {
        "county": "washington",
        "display_name": "Richfield",
        "census_name": "richfield village",
        "zillow_name": "Richfield",
        "redfin_name": "Richfield",
    },
    "newburg": {
        "county": "washington",
        "display_name": "Newburg",
        "census_name": "newburg village",
        "zillow_name": "Newburg",
        "redfin_name": "Newburg",
    },
    "addison": {
        "county": "washington",
        "display_name": "Addison (Town)",
        "census_name": None,  # civil town — not in the Census "place" universe
        "census_geoid": "5513100425",
        "zillow_name": "Addison",
        "redfin_name": "Addison",
    },
    "barton": {
        "county": "washington",
        "display_name": "Barton (Town)",
        "census_name": None,
        "census_geoid": "5513105050",
        "zillow_name": "Barton",
        "redfin_name": "Barton",
    },
    "farmington": {
        "county": "washington",
        "display_name": "Farmington (Town)",
        "census_name": None,
        "census_geoid": "5513125375",
        "zillow_name": "Farmington",
        "redfin_name": "Farmington",
    },
    "polk": {
        "county": "washington",
        "display_name": "Polk (Town)",
        "census_name": None,
        "census_geoid": "5513163875",
        "zillow_name": "Polk",
        "redfin_name": "Polk",
    },
    "trenton": {
        "county": "washington",
        "display_name": "Trenton (Town)",
        "census_name": None,
        "census_geoid": "5513180575",
        "zillow_name": "Trenton",
        "redfin_name": "Trenton",
    },
    "wayne": {
        "county": "washington",
        "display_name": "Wayne (Town)",
        "census_name": None,
        "census_geoid": "5513184900",
        "zillow_name": "Wayne",
        "redfin_name": "Wayne",
    },
}


def get_municipalities_for_county(county_slug):
    """Return list of (key, config) tuples for a given county."""
    return [
        (key, cfg) for key, cfg in MUNICIPALITIES.items()
        if cfg["county"] == county_slug
    ]


def get_all_counties():
    """Return list of county slugs."""
    return list(COUNTY_FILES.keys())
