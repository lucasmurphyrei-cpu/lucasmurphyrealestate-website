import slimData from "./neighborhoods/profiles-slim.json";
import type {
  MunicipalitySlim,
  MunicipalityProfile,
  ProfilesData,
  SlimData,
} from "./neighborhoodTypes";

const data = slimData as SlimData;

const slugify = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");

const COUNTY_KEY_TO_SLUG: Record<string, string> = {
  ozaukee: "ozaukee-county",
  milwaukee: "milwaukee-county",
  waukesha: "waukesha-county",
  washington: "washington-county",
};

const COUNTY_SLUG_TO_KEY: Record<string, string> = {
  "ozaukee-county": "ozaukee",
  "milwaukee-county": "milwaukee",
  "waukesha-county": "waukesha",
  "washington-county": "washington",
};

// Alias map: county pages use simpler names than JSON display_names
// Key = "county-slug/simple-slug", Value = profile id to look up
const SLUG_ALIASES: Record<string, string> = {
  "milwaukee-county/milwaukee": "milwaukee",           // display_name: "Milwaukee (City Proper)"
  "waukesha-county/brookfield": "brookfield_city",     // display_name: "Brookfield (City)"
  "waukesha-county/pewaukee": "pewaukee",               // display_name: "Pewaukee (City/Village)"
  "waukesha-county/waukesha": "city_of_waukesha",      // display_name: "City of Waukesha"
};

// Pre-build lookup maps at module load
const slimBySlug = new Map<string, MunicipalitySlim>();
const slimByCounty = new Map<string, MunicipalitySlim[]>();
const slimById = new Map<string, MunicipalitySlim>();

for (const muni of data.municipalities) {
  const countySlug = COUNTY_KEY_TO_SLUG[muni.county] ?? muni.county;
  const muniSlug = slugify(muni.display_name);
  slimBySlug.set(`${countySlug}/${muniSlug}`, muni);
  slimById.set(muni.id, muni);

  if (!slimByCounty.has(muni.county)) slimByCounty.set(muni.county, []);
  slimByCounty.get(muni.county)!.push(muni);
}

// Register aliases so county page links resolve correctly
for (const [aliasKey, muniId] of Object.entries(SLUG_ALIASES)) {
  const muni = slimById.get(muniId);
  if (muni) slimBySlug.set(aliasKey, muni);
}

export function getSlimBySlug(
  countySlug: string,
  muniSlug: string
): MunicipalitySlim | undefined {
  return slimBySlug.get(`${countySlug}/${muniSlug}`);
}

export function getSlimByCounty(countyKey: string): MunicipalitySlim[] {
  return slimByCounty.get(countyKey) ?? [];
}

export function getAllSlim(): MunicipalitySlim[] {
  return data.municipalities;
}

export function getSlimById(id: string): MunicipalitySlim | undefined {
  return slimById.get(id);
}

export function countySlugToKey(slug: string): string {
  return COUNTY_SLUG_TO_KEY[slug] ?? slug;
}

export function countyKeyToSlug(key: string): string {
  return COUNTY_KEY_TO_SLUG[key] ?? key;
}

// Lazy-load full profiles (444KB code-split by Vite)
let fullProfilesCache: ProfilesData | null = null;

export async function getFullProfile(
  countyKey: string,
  muniId: string
): Promise<MunicipalityProfile | undefined> {
  if (!fullProfilesCache) {
    const mod = await import("./neighborhoods/profiles.json");
    fullProfilesCache = mod.default as unknown as ProfilesData;
  }
  const county = fullProfilesCache.counties[countyKey];
  return county?.municipalities.find((m) => m.id === muniId);
}
