import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSlimById, countyKeyToSlug } from "@/data/municipalityLookup";
import type { ScoredArea } from "@/lib/quizScoring";

const GOLD = "hsl(44,100%,53%)";

interface QuizResultCardProps {
  result: ScoredArea;
  rank: number;
  isContextMunicipality?: boolean;
  theme?: "light" | "dark";
}

const rankStyles: Record<number, string> = {
  1: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  2: "bg-gray-300/20 text-gray-600 border-gray-400/30",
  3: "bg-amber-600/20 text-amber-700 border-amber-600/30",
};

const darkRankStyles: Record<number, React.CSSProperties> = {
  1: { backgroundColor: "hsl(44,100%,53%,0.18)", color: GOLD, borderColor: "hsl(44,100%,53%,0.4)" },
  2: { backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.2)" },
  3: { backgroundColor: "rgba(205,127,50,0.15)", color: "rgb(205,160,100)", borderColor: "rgba(205,127,50,0.35)" },
};

const QuizResultCard = ({
  result,
  rank,
  isContextMunicipality = false,
  theme = "light",
}: QuizResultCardProps) => {
  const slim = getSlimById(result.id);
  const countySlug = countyKeyToSlug(result.county);
  const muniSlug = result.displayName.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
  const profileUrl = `/areas/${countySlug}/${muniSlug}`;

  const countyDisplay = result.county.charAt(0).toUpperCase() + result.county.slice(1) + " County";
  const isDark = theme === "dark";

  if (isDark) {
    return (
      <div
        className={`rounded-xl border p-5 transition-colors ${
          isContextMunicipality
            ? "border-[hsl(44,100%,53%)]/50 bg-[hsl(44,100%,53%)]/8"
            : "border-white/10 bg-white/[0.04]"
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold"
              style={darkRankStyles[rank] ?? { backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.15)" }}
            >
              {rank}
            </span>
            <div>
              <h4 className="font-display text-lg font-bold text-white">{result.displayName}</h4>
              <p className="text-xs text-white/50">{countyDisplay}</p>
            </div>
          </div>
          <span className="text-2xl font-bold" style={{ color: GOLD }}>{result.normalizedScore}%</span>
        </div>

        {/* Score bar */}
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${result.normalizedScore}%`, backgroundColor: GOLD }}
          />
        </div>

        {/* Lifestyle summary */}
        {slim && (
          <p className="text-sm text-white/60 leading-relaxed mb-3 line-clamp-3">
            {slim.lifestyle_summary}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/10 text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>

        {isContextMunicipality ? (
          <p className="text-sm font-medium" style={{ color: GOLD }}>
            You're viewing this neighborhood
          </p>
        ) : (
          <Link
            to={profileUrl}
            className="inline-flex items-center gap-1.5 rounded-sm px-4 py-2 text-sm font-semibold text-[#0a1424] transition-transform duration-300 hover:-translate-y-0.5"
            style={{ backgroundColor: GOLD }}
          >
            View Full Profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <Card
      className={`transition-colors ${
        isContextMunicipality ? "border-primary/60 bg-primary/5" : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                rankStyles[rank] ?? "bg-muted text-muted-foreground border-border"
              }`}
            >
              {rank}
            </span>
            <div>
              <h4 className="font-display text-lg font-bold">{result.displayName}</h4>
              <p className="text-xs text-muted-foreground">{countyDisplay}</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary">{result.normalizedScore}%</span>
        </div>

        {/* Score bar */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden mb-3">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${result.normalizedScore}%` }}
          />
        </div>

        {/* Lifestyle summary */}
        {slim && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
            {slim.lifestyle_summary}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {result.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {isContextMunicipality ? (
          <p className="text-sm font-medium text-primary">
            You're viewing this neighborhood
          </p>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to={profileUrl} className="flex items-center gap-1.5">
              View Full Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizResultCard;
