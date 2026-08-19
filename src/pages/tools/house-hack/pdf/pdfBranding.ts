import { siteConfig } from "@/lib/siteConfig";

// RGB color arrays for jsPDF.
//
// This is a DOWNLOADABLE, so it carries the rebrand (~/brand/BRAND.md) rather than the
// site's navy/gold. The split is deliberate: the site keeps its own look, everything a
// client downloads or is handed matches the guides, the consultation decks and the seller
// collateral.
//
// NAVY is kept as the exported name so no call site has to change; the value is now Ink.
// Gold is only ever set as text on an Ink fill here (8.38:1). It measures 1.97:1 on a
// light ground — if you ever need gold text on ivory, use GOLD_DEEP.
export const NAVY: [number, number, number] = [18, 17, 16];        // Ink   #121110
export const GOLD: [number, number, number] = [200, 169, 106];     // Gold  #C8A96A
export const GOLD_DEEP: [number, number, number] = [128, 106, 67]; // #806A43, for light grounds
export const WHITE: [number, number, number] = [255, 255, 255];
export const LIGHT_GRAY: [number, number, number] = [247, 239, 224];  // Ivory #F7EFE0
export const TEXT_DARK: [number, number, number] = [18, 17, 16];      // Ink
export const TEXT_MUTED: [number, number, number] = [107, 102, 97];   // Muted #6B6661
export const GREEN: [number, number, number] = [52, 211, 153];
export const RED: [number, number, number] = [248, 113, 113];

// Layout constants (mm)
export const PAGE_WIDTH = 215.9; // US Letter
export const PAGE_HEIGHT = 279.4;
export const MARGIN = 15;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Font sizes
export const FONT_TITLE = 22;
export const FONT_SUBTITLE = 11;
export const FONT_SECTION_HEADING = 13;
export const FONT_BODY = 9;
export const FONT_SMALL = 7.5;
export const FONT_TINY = 6.5;

// Contact info — derived, not retyped.
//
// This block used to be a second, independent identity for the whole site. It carried
// title: "Real Estate Advisor", which is not a licensed title and appears in no other
// file, and website: "LucasMurphy.exprealty.com", the legacy eXp IDX address. A PDF a
// lead downloads is the last place a stale identity should survive.
export const CONTACT = {
  name: siteConfig.agent.name,
  title: siteConfig.agent.jobTitle,
  phone: siteConfig.phone,
  email: siteConfig.email,
  calendly: siteConfig.calendly.replace(/^https?:\/\//, ""),
  website: siteConfig.url.replace(/^https?:\/\/(www\.)?/, ""),
};
