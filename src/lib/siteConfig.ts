export const siteConfig = {
  url: "https://www.lucasmurphyrealestate.com",
  name: "Lucas Murphy Real Estate",
  agent: {
    name: "Lucas Murphy",
    jobTitle: "Realtor",
    description:
      "Lucas Murphy is a licensed Realtor with the Provision Properties Core Team at eXp Realty, helping home buyers, sellers, and investors across Milwaukee, Waukesha, Ozaukee, and Washington counties in metro Milwaukee, Wisconsin.",
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
  brokerage: "Provision Properties Core Team — eXp Realty",
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
