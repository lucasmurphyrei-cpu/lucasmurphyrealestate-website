import { createRequire } from "module";
const require = createRequire(import.meta.url);
const slimData = require("./src/data/neighborhoods/profiles-slim.json");

console.log("=== API DATA DETAIL CHECK ===\n");

for (const muni of slimData.municipalities) {
  const issues = [];

  if (!muni.api_data) {
    issues.push("COMPLETELY MISSING api_data");
  } else {
    const ad = muni.api_data;
    if (!ad.census || Object.keys(ad.census).length === 0) issues.push("empty/missing census");
    if (!ad.zillow || Object.keys(ad.zillow).length === 0) issues.push("empty/missing zillow");
    if (!ad.redfin || Object.keys(ad.redfin).length === 0) issues.push("empty/missing redfin");

    if (ad.redfin) {
      if (!ad.redfin.median_sale_price && ad.redfin.median_sale_price !== 0) issues.push("redfin: no median_sale_price");
      if (!ad.redfin.median_dom && ad.redfin.median_dom !== 0) issues.push("redfin: no median_dom");
      if (!ad.redfin.price_per_sqft && ad.redfin.price_per_sqft !== 0) issues.push("redfin: no price_per_sqft");
      if (!ad.redfin.sale_to_list && ad.redfin.sale_to_list !== 0) issues.push("redfin: no sale_to_list");
    }
    if (ad.zillow) {
      if (!ad.zillow.zhvi && ad.zillow.zhvi !== 0) issues.push("zillow: no zhvi");
    }
    if (ad.census) {
      if (!ad.census.population && ad.census.population !== 0) issues.push("census: no population");
    }
  }

  // Check quick_snapshot values more thoroughly
  const qs = muni.quick_snapshot;
  if (qs) {
    for (const [key, val] of Object.entries(qs)) {
      if (val === null || val === undefined || val === "" || val === "N/A" || val === "—") {
        issues.push(`quick_snapshot.${key} = "${val}"`);
      }
    }
  }

  // Check real_estate_trends
  const ret = muni.real_estate_trends;
  if (ret) {
    for (const [key, val] of Object.entries(ret)) {
      if (val === null || val === undefined || val === "" || val === "N/A" || val === "—") {
        issues.push(`real_estate_trends.${key} = "${val}"`);
      }
    }
  }

  if (issues.length > 0) {
    console.log(`${muni.county}/${muni.display_name} (id: ${muni.id}):`);
    issues.forEach(i => console.log(`  - ${i}`));
    console.log();
  }
}

// Also list all municipality IDs and whether they have actual content
console.log("\n=== MUNICIPALITY ID LIST WITH DATA SIZES ===");
for (const muni of slimData.municipalities) {
  const size = JSON.stringify(muni).length;
  console.log(`  ${muni.county.padEnd(12)} ${muni.id.padEnd(20)} ${size} bytes`);
}
