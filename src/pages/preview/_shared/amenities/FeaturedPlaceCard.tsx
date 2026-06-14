// src/pages/preview/_shared/amenities/FeaturedPlaceCard.tsx
import { useState } from "react";
import type { FeaturedPlace } from "@/data/marketProfiles";
const GOLD = "hsl(44, 100%, 53%)";

export default function FeaturedPlaceCard({ place }: { place: FeaturedPlace }) {
  const [imgOk, setImgOk] = useState(Boolean(place.photo));
  const showPhoto = Boolean(place.photo) && imgOk;
  return (
    <div className="group overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10 shadow-[0_28px_60px_-32px_rgba(0,0,0,0.75)] transition-all duration-500 hover:-translate-y-1 hover:ring-white/25">
      {showPhoto && place.photo && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={place.photo.url}
            alt={place.photo.alt}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1424]/80 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-[#0a1424]" style={{ backgroundColor: GOLD }}>
            {place.category}
          </span>
        </div>
      )}
      <div className="p-6">
        {!showPhoto && (
          <span className="mb-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color: GOLD, border: `1px solid ${GOLD}55` }}>
            {place.category}
          </span>
        )}
        <h4 className="font-display text-lg font-semibold text-white">{place.name}</h4>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{place.blurb}</p>
        {showPhoto && place.photo && (
          <a href={place.photo.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 block text-[11px] text-white/35 transition-colors hover:text-white/60">
            {place.photo.credit} · {place.photo.license}
          </a>
        )}
      </div>
    </div>
  );
}
