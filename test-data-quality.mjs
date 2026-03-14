import { createRequire } from "module";
const require = createRequire(import.meta.url);
const slimData = require("./src/data/neighborhoods/profiles-slim.json");
const fullData = require("./src/data/neighborhoods/profiles.json");

console.log("=== DATA QUALITY CHECK FOR ALL MUNICIPALITIES ===\n");

for (const muni of slimData.municipalities) {
  const issues = [];

  // Check quick_snapshot
  if (!muni.quick_snapshot) {
    issues.push("NO quick_snapshot");
  } else {
    const qs = muni.quick_snapshot;
    if (!qs.population) issues.push("missing population");
    if (!qs.median_age) issues.push("missing median_age");
    if (!qs.median_household_income) issues.push("missing median_household_income");
    if (!qs.median_home_price) issues.push("missing median_home_price");
    if (!qs.median_rent) issues.push("missing median_rent");
    if (!qs.school_district) issues.push("missing school_district");
  }

  // Check real_estate_trends
  if (!muni.real_estate_trends) {
    issues.push("NO real_estate_trends");
  }

  // Check api_data
  if (!muni.api_data) {
    issues.push("NO api_data");
  } else {
    if (!muni.api_data.census) issues.push("missing api_data.census");
    if (!muni.api_data.zillow) issues.push("missing api_data.zillow");
    if (!muni.api_data.redfin) issues.push("missing api_data.redfin");
  }

  // Check lifestyle_summary
  if (!muni.lifestyle_summary || muni.lifestyle_summary.length < 10) {
    issues.push("missing/short lifestyle_summary");
  }

  // Check quiz_tags
  if (!muni.quiz_tags || muni.quiz_tags.length === 0) {
    issues.push("missing quiz_tags");
  }

  // Check full profile
  const county = fullData.counties[muni.county];
  const fullProfile = county ? county.municipalities.find(m => m.id === muni.id) : null;
  if (!fullProfile) {
    issues.push("NO FULL PROFILE");
  } else {
    if (!fullProfile.buyer_lifestyle_fit) issues.push("missing buyer_lifestyle_fit");
    if (!fullProfile.amenities_character) issues.push("missing amenities_character");
  }

  if (issues.length > 0) {
    console.log(`${muni.county}/${muni.display_name} (id: ${muni.id}):`);
    issues.forEach(i => console.log(`  - ${i}`));
    console.log();
  }
}

console.log("=== CHECK COMPLETE ===");
