// scripts/prerender.ts
import { preview } from "vite";
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes } from "./routes";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function run() {
  const server = await preview({ root, preview: { port: 4173, strictPort: false } });
  const base = server.resolvedUrls?.local?.[0]?.replace(/\/$/, "");
  if (!base) throw new Error("Could not resolve preview server URL");

  const browser = await puppeteer.launch();
  const routes = getAllRoutes();

  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.goto(`${base}${route.path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page
        .waitForSelector("#root *", { timeout: 15000 })
        .catch(() => console.warn(`  (no #root content for ${route.path})`));
      await new Promise((r) => setTimeout(r, 400));
      const html = await page.content();
      const outDir = resolve(root, "dist", route.path === "/" ? "." : `.${route.path}`);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(resolve(outDir, "index.html"), html, "utf8");
      console.log(`prerendered ${route.path}`);
    } catch (err) {
      console.error(`FAILED ${route.path}:`, (err as Error).message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.httpServer.close();
  console.log(`prerender complete: ${routes.length} routes`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
