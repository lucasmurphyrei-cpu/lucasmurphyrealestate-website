import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("./src/data/neighborhoods/profiles-slim.json");

const slugify = (name) => name.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");

const COUNTY_KEY_TO_SLUG = {
  ozaukee: "ozaukee-county",
  milwaukee: "milwaukee-county",
  waukesha: "waukesha-county",
  washington: "washington-county",
};

const SLUG_ALIASES = {
  "milwaukee-county/milwaukee": "milwaukee",
  "waukesha-county/brookfield": "brookfield",
  "waukesha-county/pewaukee": "pewaukee",
  "waukesha-county/waukesha": "waukesha",
};

const slimBySlug = new Map();
const slimById = new Map();

for (const muni of data.municipalities) {
  const countySlug = COUNTY_KEY_TO_SLUG[muni.county] || muni.county;
  const muniSlug = slugify(muni.display_name);
  slimBySlug.set(`${countySlug}/${muniSlug}`, muni);
  slimById.set(muni.id, muni);
}

for (const [aliasKey, muniId] of Object.entries(SLUG_ALIASES)) {
  const muni = slimById.get(muniId);
  if (muni) slimBySlug.set(aliasKey, muni);
}

const counties = {
  "Milwaukee County": ["Bayside","Brown Deer","Cudahy","Fox Point","Franklin","Glendale","Greendale","Greenfield","Hales Corners","Milwaukee","Oak Creek","River Hills","Shorewood","South Milwaukee","St. Francis","Wauwatosa","West Allis","West Milwaukee","Whitefish Bay"],
  "Ozaukee County": ["Belgium","Cedarburg","Fredonia","Grafton","Mequon","Port Washington","Saukville","Thiensville"],
  "Waukesha County": ["Big Bend","Brookfield","Butler","Chenequa","Delafield","Dousman","Eagle","Elm Grove","Hartland","Lac La Belle","Lannon","Menomonee Falls","Merton","Mukwonago","Muskego","Nashotah","New Berlin","North Prairie","Oconomowoc","Pewaukee","Sussex","Wales","Waukesha"],
  "Washington County": ["Germantown","Hartford","Jackson","Kewaskum","Newburg","Richfield","Slinger","West Bend"],
};

const broken = [];
const working = [];

for (const [countyName, munis] of Object.entries(counties)) {
  const countySlug = countyName.toLowerCase().replace(/\s+/g, "-");
  for (const muni of munis) {
    const muniSlug = muni.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
    const key = `${countySlug}/${muniSlug}`;
    const found = slimBySlug.get(key);
    if (found) {
      working.push({ key, id: found.id });
    } else {
      broken.push(key);
    }
  }
}

console.log("=== BROKEN (no data found for these county page links) ===");
if (broken.length === 0) console.log("None!");
else broken.forEach((b) => console.log("  " + b));

console.log(`\nWorking: ${working.length} total`);

// Check: data entries NOT reachable from any county page
console.log("\n=== IN DATA BUT NOT ON ANY COUNTY PAGE ===");
const allReachableIds = new Set(working.map((w) => w.id));
for (const muni of data.municipalities) {
  if (!allReachableIds.has(muni.id)) {
    const countySlug = COUNTY_KEY_TO_SLUG[muni.county] || muni.county;
    console.log(`  ${countySlug}/${slugify(muni.display_name)} (display: ${muni.display_name}, id: ${muni.id})`);
  }
}

// Now check full profiles
console.log("\n=== CHECKING FULL PROFILES (profiles.json) ===");
const fullData = require("./src/data/neighborhoods/profiles.json");
for (const w of working) {
  // Find county key from the slug
  const countySlug = w.key.split("/")[0];
  const COUNTY_SLUG_TO_KEY = {
    "ozaukee-county": "ozaukee",
    "milwaukee-county": "milwaukee",
    "waukesha-county": "waukesha",
    "washington-county": "washington",
  };
  const countyKey = COUNTY_SLUG_TO_KEY[countySlug];
  const county = fullData.counties[countyKey];
  if (!county) {
    console.log(`  MISSING COUNTY in profiles.json: ${countyKey}`);
    continue;
  }
  const fullProfile = county.municipalities.find((m) => m.id === w.id);
  if (!fullProfile) {
    console.log(`  MISSING FULL PROFILE: ${w.key} (id: ${w.id})`);
  }
}
console.log("Full profile check complete.");
