import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSlimById, countyKeyToSlug } from "@/data/municipalityLookup";
import type { ScoredArea } from "@/lib/quizScoring";

interface QuizResultCardProps {
  result: ScoredArea;
  rank: number;
  isContextMunicipality?: boolean;
}

const rankStyles: Record<number, string> = {
  1: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  2: "bg-gray-300/20 text-gray-600 border-gray-400/30",
  3: "bg-amber-600/20 text-amber-700 border-amber-600/30",
};

const QuizResultCard = ({
  result,
  rank,
  isContextMunicipality = false,
}: QuizResultCardProps) => {
  const slim = getSlimById(result.id);
  const countySlug = countyKeyToSlug(result.county);
  const muniSlug = result.displayName.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
  const profileUrl = `/areas/${countySlug}/${muniSlug}`;

  const countyDisplay = result.county.charAt(0).toUpperCase() + result.county.slice(1) + " County";

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
