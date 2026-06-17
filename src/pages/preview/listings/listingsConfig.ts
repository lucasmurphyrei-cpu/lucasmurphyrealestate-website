/**
 * Listings search configuration.
 *
 * Live MLS listings are powered by Lucas's eXp IDX search at
 * lucasmurphy.exprealty.com (already included in eXp membership, no extra cost).
 * The site deep-links into that search, pre-filtered by area via the IDX's
 * `pak` location code (a geohash-based key unique to each county/city).
 *
 * HOW THE URL WORKS (reverse-engineered from real search links):
 *   .../index.php?advanced=1&display=<Name>&pak=<county|city>:<code>&...&rtype=list#rslt
 *   Everything except `display` + `pak` is constant (active statuses, common
 *   residential property types, no price/bed/bath limits).
 *
 * ADDING A COUNTY OR CITY:
 *   1. On lucasmurphy.exprealty.com, search that area.
 *   2. Copy the URL and read its `display=` and `pak=` values.
 *   3. Paste them into COUNTY_PAKS / MUNI_PAKS below. (pak is stored decoded,
 *      e.g. "county:g40_dp9sxn9z" — the code re-encodes it automatically.)
 */

const IDX_BASE = "https://lucasmurphy.exprealty.com/index.php";

// Constant search filters: active statuses, common residential types, no limits.
// rtype=map drops the visitor straight onto the MLS-style map view of results.
const STATIC_QS =
  "advanced=1&statuses[]=0&statuses[]=57&custombox=&types[]=1&types[]=3&types[]=51&types[]=2&beds=0&baths=0&min=0&max=100000000&rtype=map";

export interface Area {
  display: string;
  pak: string; // decoded, e.g. "county:g40_dp9sxn9z"
}

/** Build a pre-filtered IDX search URL for a single area. */
function buildSearchUrl(area: Area): string {
  const qs = `display=${encodeURIComponent(area.display)}&pak=${encodeURIComponent(area.pak)}&${STATIC_QS}`;
  return `${IDX_BASE}?${qs}#rslt`;
}

/**
 * Build one combined search URL across multiple areas, using the IDX's repeated
 * pak[]= array notation (backend-supported even though its own widget isn't).
 * Falls back to the single-area or all-listings URL for 1 / 0 areas.
 */
export function buildMultiSearchUrl(areas: Area[]): string {
  const valid = areas.filter(Boolean);
  if (valid.length === 0) return ALL_LISTINGS_URL;
  if (valid.length === 1) return buildSearchUrl(valid[0]);
  const display = encodeURIComponent(valid.map((a) => a.display).join(", "));
  const paks = valid.map((a) => `pak[]=${encodeURIComponent(a.pak)}`).join("&");
  return `${IDX_BASE}?display=${display}&${paks}&${STATIC_QS}#rslt`;
}

/** The general "all active listings" search (no area filter). */
export const ALL_LISTINGS_URL = IDX_BASE;

// County pak codes. null = not captured yet (falls back to the general search).
const COUNTY_PAKS: Record<string, Area | null> = {
  "milwaukee-county": { display: "Milwaukee", pak: "county:g40_dp9sxn9z" },
  "waukesha-county": { display: "Waukesha", pak: "county:g40_dp9hwx4x" },
  "ozaukee-county": null, // paste the Ozaukee County search URL to enable
  "washington-county": null, // paste the Washington County search URL to enable
};

// Per-city pak codes (keyed by municipality id). Captured from the live eXp IDX.
// Cities without a code (e.g. lac_la_belle, not indexed as a municipality) are
// omitted and fall back to their county search.
const MUNI_PAKS: Record<string, Area> = {
  // Waukesha County
  big_bend: { display: "Big Bend", pak: "city:g30_dp97bwqd" },
  brookfield: { display: "Brookfield", pak: "city:g30_dp9kfxwc" },
  butler: { display: "Butler", pak: "city:g30_dp9m5zsm" },
  chenequa: { display: "Chenequa", pak: "city:g30_dp9jkf2c" },
  delafield: { display: "Delafield", pak: "city:g30_dp9jh8gx" },
  dousman: { display: "Dousman", pak: "city:g30_dp9hdthz" },
  eagle: { display: "Eagle", pak: "city:g30_dp95fvfs" },
  elm_grove: { display: "Elm Grove", pak: "city:g30_dp9kgs9h" },
  hartland: { display: "Hartland", pak: "city:g30_dp9jjy2n" },
  lannon: { display: "Lannon", pak: "city:g30_dp9m3zee" },
  menomonee_falls: { display: "Menomonee Falls", pak: "city:g30_dp9m6wyz" },
  merton: { display: "Merton", pak: "city:g30_dp9jqmz1" },
  mukwonago: { display: "Mukwonago", pak: "city:g30_dp95y1f5" },
  muskego: { display: "Muskego", pak: "city:g30_dp97fx4k" },
  nashotah: { display: "Nashotah", pak: "city:g30_dp9jhm42" },
  new_berlin: { display: "New Berlin", pak: "city:g30_dp9k6wfm" },
  north_prairie: { display: "North Prairie", pak: "city:g30_dp9hk24w" },
  oconomowoc: { display: "Oconomowoc", pak: "city:g30_dp9j4jzw" },
  pewaukee: { display: "Pewaukee", pak: "city:g30_dp9jpg2w" },
  sussex: { display: "Sussex", pak: "city:g30_dp9m2kq4" },
  wales: { display: "Wales", pak: "city:g30_dp9hth8p" },
  waukesha: { display: "Waukesha", pak: "city:g30_dp9hrueu" },
  // lac_la_belle: not indexed as a municipality in the IDX -> falls back to Waukesha County

  // Milwaukee County
  bayside: { display: "Bayside", pak: "city:g30_dp9mxv0h" },
  brown_deer: { display: "Brown Deer", pak: "city:g30_dp9mw5ds" },
  cudahy: { display: "Cudahy", pak: "city:g30_dp9s2d5q" },
  fox_point: { display: "Fox Point", pak: "city:g30_dp9mxb8n" },
  franklin: { display: "Franklin", pak: "city:g30_dp97vr0c" },
  glendale: { display: "Glendale", pak: "city:g30_dp9mr5ku" },
  greendale: { display: "Greendale", pak: "city:g30_dp9km2rn" },
  greenfield: { display: "Greenfield", pak: "city:g30_dp9kmkux" },
  milwaukee: { display: "Milwaukee", pak: "city:g30_dp9kyr84" },
  oak_creek: { display: "Oak Creek", pak: "city:g30_dp97zy0e" },
  river_hills: { display: "River Hills", pak: "city:g30_dp9mwgpm" },
  shorewood: { display: "Shorewood", pak: "city:g30_dp9t0hdc" },
  south_milwaukee: { display: "South Milwaukee", pak: "city:g30_dp9s0euk" },
  st_francis: { display: "St. Francis", pak: "city:g30_dp9s2qsz" },
  wauwatosa: { display: "Wauwatosa", pak: "city:g30_dp9kuxp5" },
  west_allis: { display: "West Allis", pak: "city:g30_dp9ksv4u" },
  west_milwaukee: { display: "West Milwaukee", pak: "city:g30_dp9kwnjm" },
  whitefish_bay: { display: "Whitefish Bay", pak: "city:g30_dp9mrb8b" },
};

/** Resolve the search URL for a county slug (filtered if we have the code). */
export function countySearchUrl(slug: string): string {
  const area = COUNTY_PAKS[slug];
  return area ? buildSearchUrl(area) : ALL_LISTINGS_URL;
}

/** The Area for a county slug (for the "entire county" option), or null. */
export function countyArea(slug: string): Area | null {
  return COUNTY_PAKS[slug] ?? null;
}

/** The Area for a municipality id, or null if we don't have its code. */
export function muniArea(id: string): Area | null {
  return MUNI_PAKS[id] ?? null;
}

/* ---------------- On-site filter form -> filtered IDX search ---------------- */

export interface SearchFilters {
  minPrice: number; // 0 = no min
  maxPrice: number; // 0 = no max
  minBeds: number; // 0 = any
  minBaths: number; // 0 = any
  minGarage: number; // 0 = any
  types: number[]; // property-type codes; [] = default residential set
}

// Property types offered in the form. Codes captured from the live eXp IDX by
// selecting each type in isolation (code 51 is shared across categories in the
// IDX's taxonomy; unioning selected codes reproduces its behavior). Two-family
// and multi-family are combined into one option per Lucas's preference:
//   Single Family -> 1 | Condo -> 2,51 | Multi-Family (incl. two-family) -> 3,51
// Union of all = {1,2,3,51}, matching the IDX "all types" search.
export const PROPERTY_TYPES: { label: string; codes: number[] }[] = [
  { label: "Single Family", codes: [1] },
  { label: "Condo", codes: [2, 51] },
  { label: "Multi-Family", codes: [3, 51] },
];

const DEFAULT_TYPE_CODES = [...new Set(PROPERTY_TYPES.flatMap((t) => t.codes))];
const MAX_GARAGE = 4; // garage filter expands "N+" into options[]=Ngarage ... MAX

/**
 * Build a fully filtered IDX map-view URL from the on-site form.
 * `area` may be null (no location code) — then it searches all areas with the
 * other filters applied. Garage "N+" expands to options[]=Ngarage..MAX_GARAGE.
 */
export function buildFilteredSearchUrl(area: Area | null, f: SearchFilters): string {
  const p: string[] = ["advanced=1"];
  if (area) p.push(`display=${encodeURIComponent(area.display)}`);
  p.push(`min=${f.minPrice || 0}`);
  p.push(`max=${f.maxPrice || 100000000}`);
  p.push(`beds=${f.minBeds || 0}`);
  p.push(`baths=${f.minBaths || 0}`);
  const types = f.types.length ? f.types : DEFAULT_TYPE_CODES;
  for (const t of types) p.push(`types[]=${t}`);
  p.push("statuses[]=0", "statuses[]=57");
  if (f.minGarage > 0) {
    for (let g = f.minGarage; g <= MAX_GARAGE; g++) p.push(`options[]=${g}garage`);
  }
  if (area) p.push(`pak=${encodeURIComponent(area.pak)}`);
  p.push("rtype=map");
  return `${IDX_BASE}?${p.join("&")}#rslt`;
}

/**
 * Resolve the search URL for a municipality.
 * Uses the city's own pak if we have it, otherwise falls back to its county
 * search (so the chip always lands on relevant active listings).
 */
export function muniSearchUrl(id: string, countySlug: string): string {
  const area = MUNI_PAKS[id];
  return area ? buildSearchUrl(area) : countySearchUrl(countySlug);
}
