import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fullData = require("./src/data/neighborhoods/profiles.json");

console.log("=== FULL PROFILES CHECK ===\n");
console.log("Counties in profiles.json:", Object.keys(fullData.counties));

for (const [county, countyData] of Object.entries(fullData.counties)) {
  console.log(`\n${county}: ${countyData.municipalities.length} municipalities`);
  for (const m of countyData.municipalities) {
    const issues = [];
    if (!m.buyer_lifestyle_fit) {
      issues.push("NO buyer_lifestyle_fit");
    } else {
      const blf = m.buyer_lifestyle_fit;
      if (!blf.ideal_buyer_profile) issues.push("missing ideal_buyer_profile");
      if (!blf.commute_access) issues.push("missing commute_access");
      if (!blf.walkability_bikeability) issues.push("missing walkability_bikeability");
      if (!blf.crime_safety) issues.push("missing crime_safety");
    }
    if (!m.amenities_character) {
      issues.push("NO amenities_character");
    } else {
      const ac = m.amenities_character;
      if (!ac.community_vibe) issues.push("missing community_vibe");
      if (!ac.parks_outdoor) issues.push("missing parks_outdoor");
      if (!ac.dining_entertainment) issues.push("missing dining_entertainment");
    }

    if (issues.length > 0) {
      console.log(`  ${m.id}: ${issues.join(", ")}`);
    } else {
      console.log(`  ${m.id}: OK`);
    }
  }
}
