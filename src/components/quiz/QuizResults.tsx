import QuizResultCard from "./QuizResultCard";
import type { ScoredArea } from "@/lib/quizScoring";

interface QuizResultsProps {
  results: ScoredArea[];
  contextMunicipalityId?: string;
}

const QuizResults = ({ results, contextMunicipalityId }: QuizResultsProps) => {
  const top3 = results.slice(0, 3);
  const contextInTop3 = contextMunicipalityId
    ? top3.some((r) => r.id === contextMunicipalityId)
    : false;
  const contextResult = contextMunicipalityId
    ? results.find((r) => r.id === contextMunicipalityId)
    : undefined;
  const contextRank = contextResult
    ? results.indexOf(contextResult) + 1
    : undefined;

  return (
    <div>
      <h3 className="font-display text-2xl font-bold mb-2">Your Top Matches</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Based on your answers, here are the neighborhoods that best fit your lifestyle.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {top3.map((result, i) => (
          <QuizResultCard
            key={result.id}
            result={result}
            rank={i + 1}
            isContextMunicipality={result.id === contextMunicipalityId}
          />
        ))}
      </div>

      {/* Show context municipality separately if not in top 3 */}
      {contextMunicipalityId && !contextInTop3 && contextResult && contextRank && (
        <div className="mt-6">
          <h4 className="font-display text-lg font-semibold mb-3 text-muted-foreground">
            How {contextResult.displayName} ranks for you: #{contextRank} of {results.length}
          </h4>
          <div className="max-w-md">
            <QuizResultCard
              result={contextResult}
              rank={contextRank}
              isContextMunicipality
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResults;
