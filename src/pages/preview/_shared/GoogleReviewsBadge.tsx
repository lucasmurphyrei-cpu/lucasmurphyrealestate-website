import { useState } from "react";
import { ExternalLink, Star, X } from "lucide-react";
import { SOCIAL } from "@/pages/preview/_shared/tokens";
import reviewsData from "@/pages/preview/_shared/googleReviews.json";

/* Official multi-color Google "G" mark. */
function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

/**
 * Reviews are sourced from googleReviews.json, which is regenerated from the
 * live Google Places API by scripts/fetch-google-reviews.mjs (build-time fetch).
 * The seeded values are real client testimonials; run the script to replace them
 * with the live Google feed (real reviewer names, photos, and timestamps).
 */
interface Review {
  name: string;
  initial: string;
  photo: string | null;
  rating: number;
  relativeTime: string;
  text: string;
}

const RATING: number = reviewsData.rating;
const TOTAL: number = reviewsData.total;
const REVIEWS: Review[] = reviewsData.reviews as Review[];
const RATING_LABEL = Number.isInteger(RATING) ? RATING.toFixed(1) : String(RATING);

const Stars = ({ className = "h-3.5 w-3.5", count = 5 }: { className?: string; count?: number }) => {
  const filled = Math.max(0, Math.min(5, Math.round(count)));
  return (
    <span className="flex text-[#fbbc05]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} ${i < filled ? "fill-current" : "fill-none text-gray-300"}`} />
      ))}
    </span>
  );
};

export default function GoogleReviewsBadge() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sticky badge */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Read our Google reviews"
        className="fixed bottom-5 left-5 z-40 hidden items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2.5 shadow-[0_14px_34px_-12px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-0.5 sm:flex"
      >
        <GoogleG className="h-7 w-7" />
        <span className="flex flex-col leading-none">
          <span className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#1a1a1a]">{RATING_LABEL}</span>
            <Stars className="h-3 w-3" />
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Google Reviews</span>
        </span>
      </button>

      {/* Popup styled like Google */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white text-[#202124] shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <GoogleG className="h-9 w-9" />
                <div>
                  <p className="text-sm font-semibold leading-tight">Lucas Murphy Real Estate</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#e7711b]">{RATING_LABEL}</span>
                    <Stars />
                    <span className="text-xs text-gray-500">{TOTAL} Google Reviews</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Reviews */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {REVIEWS.map((r, i) => (
                <div key={`${r.name}-${i}`} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    {r.photo ? (
                      <img
                        src={r.photo}
                        alt={r.name}
                        referrerPolicy="no-referrer"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1424] text-sm font-semibold text-white">
                        {r.initial}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold leading-tight">{r.name}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Stars className="h-3 w-3" count={r.rating} />
                        {r.relativeTime && (
                          <span className="text-xs text-gray-400">{r.relativeTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-gray-600">{r.text}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-4">
              <a
                href={SOCIAL.google}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1765cc]"
              >
                Read all reviews on Google <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
