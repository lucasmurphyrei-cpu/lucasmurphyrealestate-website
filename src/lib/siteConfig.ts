export const siteConfig = {
  url: "https://www.lucasmurphyrealestate.com",
  name: "Lucas Murphy Real Estate",
  agent: { name: "Lucas Murphy", jobTitle: "Realtor" },
  brokerage: "Provision Properties Core Team — eXp Realty",
  phone: "(414) 458-1952",
  phoneE164: "+14144581952",
  email: "lucas.murphy@exprealty.com",
  calendly: "https://calendly.com/lucasmurphyrei",
  social: {
    facebook: "https://www.facebook.com/LucasMurphyRealtor",
    youtube: "https://www.youtube.com/@LucasMurphy-LivingInMilwaukee/featured",
    google: "https://maps.app.goo.gl/fRXnkYuqMmkL4GH87",
  },
  counties: ["Milwaukee", "Waukesha", "Ozaukee", "Washington"] as const,
  defaultOgImage: "/og-image.png",
} as const;

/** Join a root-relative path onto the site URL without doubling the slash. */
export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${siteConfig.url}${path}`;
}
