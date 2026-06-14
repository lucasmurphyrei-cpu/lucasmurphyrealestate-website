// src/data/marketProfiles.ts
export interface MarketPhoto {
  url: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl: string;
}
export interface FeaturedPlace {
  name: string;
  category: string;
  blurb: string;
  photo?: MarketPhoto;
}
export interface LifestyleVitalsData {
  walkScore: { value: number; label: string };
  commute: { carMinutes: string; routes: string[]; transitNote?: string };
  safety: { grade: string; percentile?: number; note: string };
  idealBuyer: { tags: string[]; summary: string };
}
export interface MarketProfile {
  lifestyle: LifestyleVitalsData;
  amenities: { featured: FeaturedPlace[]; more: { name: string; category: string }[] };
}

const marketProfiles: Record<string, MarketProfile> = {};

export function getMarketProfile(id: string): MarketProfile | null {
  return marketProfiles[id] ?? null;
}
export default marketProfiles;
