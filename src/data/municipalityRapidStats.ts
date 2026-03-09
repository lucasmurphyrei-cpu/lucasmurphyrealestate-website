import type { RapidStatsMunicipality } from "./neighborhoodTypes";

const municipalityRapidStats: Record<string, RapidStatsMunicipality | null> = {
  // --- Ozaukee County ---
  mequon: null,
  cedarburg: null,
  grafton: null,
  port_washington: null,
  thiensville: null,
  saukville: null,
  belgium: null,

  // --- Milwaukee County ---
  milwaukee: null,
  wauwatosa: null,
  west_allis: null,
  shorewood: null,
  whitefish_bay: null,
  bay_view: null,
  glendale: null,
  greenfield: null,
  greendale: null,
  franklin: null,
  oak_creek: null,
  south_milwaukee: null,
  st_francis: null,
  brown_deer: null,
  river_hills: null,
  fox_point: null,
  bayside: null,
  west_milwaukee: null,
  cudahy: null,
  hales_corners: null,

  // --- Washington County ---
  germantown: null,
  west_bend: null,
  hartford: null,
  jackson: null,
  slinger: null,
  kewaskum: null,
  richfield: null,
  newburg: null,

  // --- Waukesha County ---
  waukesha: null,
  brookfield: {
    data_month: "February 2026",
    data_as_of: "2026-03-06",
    prior_year_label: "2025",
    current_year_label: "2026",
    median_sale_price: 532500,
    metrics: [
      { label: "New Listings", prior_year: "30", current_year: "32", change_pct: 6.7 },
      { label: "Closed Sales", prior_year: "14", current_year: "24", change_pct: 71.4 },
      { label: "Median Sales Price", prior_year: "$511,000", current_year: "$532,500", change_pct: 4.2 },
      { label: "Pct of Orig. List Price Received", prior_year: "103.7%", current_year: "98.7%", change_pct: -4.8 },
      { label: "Days on Market Until Sale", prior_year: "14", current_year: "27", change_pct: 92.9 },
      { label: "Inventory (SFR)", prior_year: "41", current_year: "49", change_pct: 19.5 },
    ],
  },
  new_berlin: null,
  menomonee_falls: null,
  pewaukee: null,
  oconomowoc: null,
  muskego: null,
  delafield: null,
  hartland: null,
  mukwonago: null,
  sussex: null,
  elm_grove: null,
  butler: null,
  chenequa: null,
  dousman: null,
  eagle: null,
  lac_la_belle: null,
  lannon: null,
  north_prairie: null,
  big_bend: null,
  merton: null,
  nashotah: null,
  wales: null,
  fredonia: null,
};

export function getRapidStats(muniId: string): RapidStatsMunicipality | null {
  return municipalityRapidStats[muniId] ?? null;
}

export default municipalityRapidStats;
