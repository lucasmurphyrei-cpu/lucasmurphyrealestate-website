export const siteConfig = {
  url: "https://www.lucasmurphyrealestate.com",
  // The advertising name. Per the eXp WI broker ruling of 2026-08-07 this may not
  // contain "Real Estate" or "Realty" without a DSPS-registered DBA, and a consumer
  // must be able to identify eXp Realty as the brokerage. It feeds og:site_name,
  // every page <title>, the JSON-LD Organization node and llms.txt — so this one
  // string is the business name search engines and answer engines cite.
  name: "Lucas Murphy | eXp Realty",
  agent: {
    name: "Lucas Murphy",
    jobTitle: "Realtor",
    description:
      "Lucas Murphy is a licensed Realtor with eXp Realty, helping home buyers, sellers, and investors across Milwaukee, Waukesha, Ozaukee, and Washington counties in metro Milwaukee, Wisconsin.",
    knowsAbout: [
      "Residential real estate",
      "First-time home buying",
      "House hacking",
      "Real estate investing",
      "Relocation to Milwaukee",
      "Home selling",
      "Metro Milwaukee housing market",
    ] as const,
  },
  // The brokerage of record. Feeds the JSON-LD Organization node, worksFor, publisher,
  // author and jobTitle across every prerendered route — so this one string is what
  // Google and the AI answer engines cite as the firm Lucas is licensed under.
  // Left the team name behind 2026-07-17; broker confirmed 2026-08-07 that an
  // advertising name may not contain "Real Estate" or "Realty".
  brokerage: "eXp Realty",
  locality: "Milwaukee",
  region: "WI",
  phone: "(414) 458-1952",
  phoneE164: "+14144581952",
  email: "lucas.murphy@exprealty.com",
  calendly: "https://calendly.com/lucasmurphyrei",
  social: {
    facebook: "https://www.facebook.com/LucasMurphyRealtor",
    youtube: "https://www.youtube.com/@LucasMurphy-LivingInMilwaukee/featured",
    google: "https://maps.app.goo.gl/fRXnkYuqMmkL4GH87",
    exp: "https://lucasmurphy.exprealty.com",
  },
  counties: ["Milwaukee", "Waukesha", "Ozaukee", "Washington"] as const,
  defaultOgImage: "/og-image.png",
} as const;

/** All known profile URLs, used as schema.org `sameAs` for entity disambiguation. */
export const sameAsProfiles: string[] = Object.values(siteConfig.social);

/** Join a root-relative path onto the site URL without doubling the slash. */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${siteConfig.url}${path}`;
}
