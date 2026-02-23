import quizAttributesData from "@/data/neighborhoods/quiz-attributes.json";
import quizQuestionsData from "@/data/neighborhoods/quiz-questions.json";
import type { QuizAttributesData, QuizQuestionsData } from "@/data/neighborhoodTypes";

const attributeData = quizAttributesData as unknown as QuizAttributesData;
const questionData = quizQuestionsData as unknown as QuizQuestionsData;

export interface QuizAnswer {
  questionId: string;
  choiceLabel: string;
}

export interface ScoredArea {
  id: string;
  displayName: string;
  county: string;
  rawScore: number;
  normalizedScore: number;
  medianSalePrice: number;
  tags: string[];
}

export function getQuestions() {
  return questionData.questions;
}

export function scoreQuiz(
  answers: QuizAnswer[],
  filterCounty?: string
): ScoredArea[] {
  const areas = attributeData.areas;
  const questions = questionData.questions;

  // Build answer lookup
  const answerMap = new Map<
    string,
    { boosts: Record<string, number>; label: string }
  >();
  for (const ans of answers) {
    const q = questions.find((q) => q.id === ans.questionId);
    if (!q) continue;
    const choice = q.choices.find((c) => c.label === ans.choiceLabel);
    if (!choice) continue;
    answerMap.set(ans.questionId, {
      boosts: choice.attribute_boosts,
      label: ans.choiceLabel,
    });
  }

  // Score each area
  const scored: ScoredArea[] = [];

  for (const [areaId, area] of Object.entries(areas)) {
    if (filterCounty && area.county !== filterCounty) continue;

    let score = 0;

    for (const q of questions) {
      const answer = answerMap.get(q.id);
      if (!answer) continue;

      for (const [attr, boost] of Object.entries(answer.boosts)) {
        const areaScore = area.attributes[attr] ?? 0;
        score += areaScore * boost * q.weight;
      }
    }

    // Guardrail 1: budget_downrank
    const budgetAnswer = answerMap.get("q1_budget");
    if (budgetAnswer) {
      const budgetCeilings: Record<string, number> = {
        A: 275000,
        B: 400000,
        C: 600000,
        D: Infinity,
      };
      const buyerMax = budgetCeilings[budgetAnswer.label] ?? Infinity;
      if (buyerMax < Infinity && area.median_sale_price > buyerMax * 1.2) {
        score -= 8;
      }
    }

    // Guardrail 2: condo_uprank
    const homeTypeAnswer = answerMap.get("q2_home_type");
    if (homeTypeAnswer?.label === "B") {
      score += 6;
    }

    scored.push({
      id: areaId,
      displayName: area.display_name,
      county: area.county,
      rawScore: score,
      normalizedScore: 0,
      medianSalePrice: area.median_sale_price,
      tags: area.tags,
    });
  }

  // Guardrail 3: lake_must_have exclusion
  const lakeAnswer = answerMap.get("q8_lake");
  let filtered = scored;
  if (lakeAnswer?.label === "A") {
    const lakeFiltered = scored.filter(
      (s) => (areas[s.id]?.attributes.lake_access ?? 0) >= 2
    );
    if (lakeFiltered.length >= 3) filtered = lakeFiltered;
  }

  // Normalize top score to 100
  const maxScore = Math.max(...filtered.map((s) => s.rawScore), 1);
  for (const s of filtered) {
    s.normalizedScore = Math.round((s.rawScore / maxScore) * 100);
  }

  // Sort descending with tiebreak
  const tiebreakAttrs = questionData.scoring.tie_break_priority;
  filtered.sort((a, b) => {
    if (b.normalizedScore !== a.normalizedScore)
      return b.normalizedScore - a.normalizedScore;
    for (const attr of tiebreakAttrs) {
      const aVal = areas[a.id]?.attributes[attr] ?? 0;
      const bVal = areas[b.id]?.attributes[attr] ?? 0;
      if (bVal !== aVal) return bVal - aVal;
    }
    return 0;
  });

  return filtered;
}

export function generateCrmTags(
  answers: QuizAnswer[],
  topMatch: ScoredArea
): string {
  const budgetAnswer = answers.find((a) => a.questionId === "q1_budget");
  const budgetMap: Record<string, string> = {
    A: "Under275K",
    B: "275-400K",
    C: "400-600K",
    D: "600KPlus",
  };
  const budgetTag = budgetMap[budgetAnswer?.choiceLabel ?? ""] ?? "Unknown";

  const countyMap: Record<string, string> = {
    milwaukee: "MilwaukeeCounty",
    waukesha: "WaukeshaCounty",
    ozaukee: "OzaukeeCounty",
    washington: "WashingtonCounty",
  };
  const countyTag = countyMap[topMatch.county] ?? topMatch.county;
  const neighborhoodTag = topMatch.displayName.replace(/\s+/g, "");
  const lifestyleTag = topMatch.tags[0]?.replace("#", "") ?? "General";

  return `Relocation|${countyTag}|TopMatch_${neighborhoodTag}|Budget_${budgetTag}|${lifestyleTag}`;
}
