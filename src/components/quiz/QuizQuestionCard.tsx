import { Card, CardContent } from "@/components/ui/card";
import type { QuizQuestion } from "@/data/neighborhoodTypes";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  selectedLabel: string | null;
  onSelect: (label: string) => void;
}

const QuizQuestionCard = ({
  question,
  selectedLabel,
  onSelect,
}: QuizQuestionCardProps) => (
  <div>
    <h3 className="font-display text-xl font-bold mb-4 md:text-2xl">
      {question.question_text}
    </h3>
    <div className="grid gap-3">
      {question.choices.map((choice) => {
        const isSelected = selectedLabel === choice.label;
        return (
          <button
            key={choice.label}
            type="button"
            onClick={() => onSelect(choice.label)}
            className="text-left w-full"
          >
            <Card
              className={`cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/40"
              }`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {choice.label}
                </span>
                <span className={`text-sm leading-relaxed ${isSelected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {choice.text}
                </span>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  </div>
);

export default QuizQuestionCard;
