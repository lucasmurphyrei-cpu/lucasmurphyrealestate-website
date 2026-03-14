import puppeteer from "puppeteer";

const BASE = "http://localhost:5173";

const allMunis = [
  "milwaukee-county/bayside", "milwaukee-county/brown-deer", "milwaukee-county/cudahy",
  "milwaukee-county/fox-point", "milwaukee-county/franklin", "milwaukee-county/glendale",
  "milwaukee-county/greendale", "milwaukee-county/greenfield", "milwaukee-county/hales-corners",
  "milwaukee-county/milwaukee", "milwaukee-county/oak-creek", "milwaukee-county/river-hills",
  "milwaukee-county/shorewood", "milwaukee-county/south-milwaukee", "milwaukee-county/st-francis",
  "milwaukee-county/wauwatosa", "milwaukee-county/west-allis", "milwaukee-county/west-milwaukee",
  "milwaukee-county/whitefish-bay",
  "ozaukee-county/belgium", "ozaukee-county/cedarburg", "ozaukee-county/fredonia",
  "ozaukee-county/grafton", "ozaukee-county/mequon", "ozaukee-county/port-washington",
  "ozaukee-county/saukville", "ozaukee-county/thiensville",
  "waukesha-county/big-bend", "waukesha-county/brookfield", "waukesha-county/butler",
  "waukesha-county/chenequa", "waukesha-county/delafield", "waukesha-county/dousman",
  "waukesha-county/eagle", "waukesha-county/elm-grove", "waukesha-county/hartland",
  "waukesha-county/lac-la-belle", "waukesha-county/lannon", "waukesha-county/menomonee-falls",
  "waukesha-county/merton", "waukesha-county/mukwonago", "waukesha-county/muskego",
  "waukesha-county/nashotah", "waukesha-county/new-berlin", "waukesha-county/north-prairie",
  "waukesha-county/oconomowoc", "waukesha-county/pewaukee", "waukesha-county/sussex",
  "waukesha-county/wales", "waukesha-county/waukesha",
  "washington-county/germantown", "washington-county/hartford", "washington-county/jackson",
  "washington-county/kewaskum", "washington-county/newburg", "washington-county/richfield",
  "washington-county/slinger", "washington-county/west-bend",
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  for (const muni of allMunis) {
    const url = `${BASE}/areas/${muni}`;
    const errors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

      // Wait a bit for lazy-loaded content
      await new Promise((r) => setTimeout(r, 1000));

      const info = await page.evaluate(() => {
        const h1 = document.querySelector("main h1");
        const fallbackP = document.querySelector("main p");
        const isFallback = fallbackP && fallbackP.textContent.includes("not yet available");

        // Count major sections
        const grids = document.querySelectorAll("main .grid");
        const sections = document.querySelectorAll("main section, main > div");

        // Check for specific data sections
        const bodyText = document.body.innerText;
        const hasPopulation = bodyText.includes("Population");
        const hasMedianPrice = bodyText.includes("Median") || bodyText.includes("median");
        const hasTrends = bodyText.includes("Trends") || bodyText.includes("Estate");
        const hasSnapshot = bodyText.includes("Snapshot") || bodyText.includes("Population");

        return {
          h1: h1 ? h1.textContent : "NO H1",
          isFallback,
          gridCount: grids.length,
          sectionCount: sections.length,
          hasPopulation,
          hasMedianPrice,
          hasTrends,
          hasSnapshot,
          bodyLength: bodyText.length,
        };
      });

      results.push({ muni, ...info, errors: errors.length > 0 ? errors : null });
    } catch (err) {
      results.push({ muni, error: err.message, errors });
    }

    // Remove listeners for next iteration
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
  }

  // Report
  console.log("=== MUNICIPALITY PAGE RENDER REPORT ===\n");

  const fallbacks = results.filter((r) => r.isFallback);
  const errored = results.filter((r) => r.error || (r.errors && r.errors.length > 0));
  const lowContent = results.filter((r) => !r.isFallback && !r.error && r.bodyLength < 500);

  if (fallbacks.length > 0) {
    console.log("FALLBACK PAGES (showing 'not yet available'):");
    fallbacks.forEach((r) => console.log(`  ${r.muni} (h1: ${r.h1})`));
    console.log();
  }

  if (errored.length > 0) {
    console.log("PAGES WITH ERRORS:");
    errored.forEach((r) => {
      console.log(`  ${r.muni}:`);
      if (r.error) console.log(`    Navigation error: ${r.error}`);
      if (r.errors) r.errors.forEach((e) => console.log(`    Console: ${e}`));
    });
    console.log();
  }

  if (lowContent.length > 0) {
    console.log("LOW CONTENT PAGES (under 500 chars body text):");
    lowContent.forEach((r) => console.log(`  ${r.muni}: ${r.bodyLength} chars, ${r.gridCount} grids`));
    console.log();
  }

  // Summary
  const ok = results.filter(
    (r) => !r.isFallback && !r.error && r.bodyLength >= 500
  );
  console.log(`\nSUMMARY: ${ok.length} OK, ${fallbacks.length} fallback, ${errored.length} errored, ${lowContent.length} low-content`);
  console.log(`Total tested: ${results.length}`);

  // Show body text sizes for all pages to spot outliers
  console.log("\n=== BODY TEXT SIZE BY MUNICIPALITY ===");
  results
    .sort((a, b) => (a.bodyLength || 0) - (b.bodyLength || 0))
    .forEach((r) => {
      const flag = r.isFallback ? " [FALLBACK]" : r.bodyLength < 1000 ? " [LOW]" : "";
      console.log(`  ${String(r.bodyLength || 0).padStart(6)} chars  ${r.muni}${flag}`);
    });

  await browser.close();
}

main().catch(console.error);
