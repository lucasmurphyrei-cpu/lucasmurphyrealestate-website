import puppeteer from "puppeteer";

const BASE = "http://localhost:5173";

// All municipalities from county pages
const allMunis = [
  // Milwaukee County
  "milwaukee-county/bayside", "milwaukee-county/brown-deer", "milwaukee-county/cudahy",
  "milwaukee-county/fox-point", "milwaukee-county/franklin", "milwaukee-county/glendale",
  "milwaukee-county/greendale", "milwaukee-county/greenfield", "milwaukee-county/hales-corners",
  "milwaukee-county/milwaukee", "milwaukee-county/oak-creek", "milwaukee-county/river-hills",
  "milwaukee-county/shorewood", "milwaukee-county/south-milwaukee", "milwaukee-county/st-francis",
  "milwaukee-county/wauwatosa", "milwaukee-county/west-allis", "milwaukee-county/west-milwaukee",
  "milwaukee-county/whitefish-bay",
  // Ozaukee County
  "ozaukee-county/belgium", "ozaukee-county/cedarburg", "ozaukee-county/fredonia",
  "ozaukee-county/grafton", "ozaukee-county/mequon", "ozaukee-county/port-washington",
  "ozaukee-county/saukville", "ozaukee-county/thiensville",
  // Waukesha County
  "waukesha-county/big-bend", "waukesha-county/brookfield", "waukesha-county/butler",
  "waukesha-county/chenequa", "waukesha-county/delafield", "waukesha-county/dousman",
  "waukesha-county/eagle", "waukesha-county/elm-grove", "waukesha-county/hartland",
  "waukesha-county/lac-la-belle", "waukesha-county/lannon", "waukesha-county/menomonee-falls",
  "waukesha-county/merton", "waukesha-county/mukwonago", "waukesha-county/muskego",
  "waukesha-county/nashotah", "waukesha-county/new-berlin", "waukesha-county/north-prairie",
  "waukesha-county/oconomowoc", "waukesha-county/pewaukee", "waukesha-county/sussex",
  "waukesha-county/wales", "waukesha-county/waukesha",
  // Washington County
  "washington-county/germantown", "washington-county/hartford", "washington-county/jackson",
  "washington-county/kewaskum", "washington-county/newburg", "washington-county/richfield",
  "washington-county/slinger", "washington-county/west-bend",
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const broken = [];
  const working = [];

  for (const muni of allMunis) {
    const url = `${BASE}/areas/${muni}`;
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });

      // Check if the "not yet available" fallback message is showing
      const fallbackText = await page.evaluate(() => {
        const p = document.querySelector("main p");
        return p ? p.textContent : "";
      });

      const hasFallback = fallbackText.includes("not yet available");

      // Check if there's a hero section (which means data loaded)
      const hasHero = await page.evaluate(() => {
        return document.querySelector("[class*='municipality']") !== null ||
               document.querySelectorAll("main h1").length > 0;
      });

      // Check for actual data content - look for the QuickSnapshotGrid
      const hasDataCards = await page.evaluate(() => {
        // The QuickSnapshotGrid renders stat cards
        const cards = document.querySelectorAll("main .grid");
        return cards.length;
      });

      // Get the h1 text
      const h1Text = await page.evaluate(() => {
        const h1 = document.querySelector("main h1");
        return h1 ? h1.textContent : "NO H1";
      });

      if (hasFallback) {
        broken.push({ muni, reason: "Shows fallback 'not yet available' message", h1: h1Text });
      } else {
        working.push({ muni, grids: hasDataCards, h1: h1Text });
      }
    } catch (err) {
      broken.push({ muni, reason: `Error: ${err.message}` });
    }
  }

  console.log("=== BROKEN MUNICIPALITIES ===");
  if (broken.length === 0) {
    console.log("None! All pages render data.");
  } else {
    for (const b of broken) {
      console.log(`  ${b.muni}: ${b.reason} (h1: ${b.h1})`);
    }
  }

  console.log(`\n=== WORKING: ${working.length} municipalities render correctly ===`);
  // Show any that have suspiciously few grid sections
  const suspicious = working.filter(w => w.grids < 2);
  if (suspicious.length > 0) {
    console.log("\nSuspicious (fewer than 2 grid sections):");
    for (const s of suspicious) {
      console.log(`  ${s.muni}: ${s.grids} grids (h1: ${s.h1})`);
    }
  }

  await browser.close();
}

main().catch(console.error);
