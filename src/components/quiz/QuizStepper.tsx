import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizProgressBar from "./QuizProgressBar";
import QuizQuestionCard from "./QuizQuestionCard";
import QuizLeadCapture from "./QuizLeadCapture";
import QuizResults from "./QuizResults";
import {
  getQuestions,
  scoreQuiz,
  generateCrmTags,
  type QuizAnswer,
  type ScoredArea,
} from "@/lib/quizScoring";

type QuizPhase = "questions" | "lead-capture" | "results";

interface QuizStepperProps {
  filterCounty?: string;
  contextMunicipalityId?: string;
  onClose: () => void;
  theme?: "light" | "dark";
}

const questions = getQuestions();

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const QuizStepper = ({
  filterCounty,
  contextMunicipalityId,
  onClose,
  theme = "light",
}: QuizStepperProps) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<QuizPhase>("questions");
  const [results, setResults] = useState<ScoredArea[]>([]);
  const [crmTag, setCrmTag] = useState("");

  const handleSelect = useCallback(
    (label: string) => {
      const q = questions[step];
      setAnswers((prev) => ({ ...prev, [q.id]: label }));

      // Auto-advance after a brief delay
      setTimeout(() => {
        if (step < questions.length - 1) {
          setDirection(1);
          setStep((s) => s + 1);
        } else {
          // Compute results
          const quizAnswers: QuizAnswer[] = Object.entries({
            ...answers,
            [q.id]: label,
          }).map(([questionId, choiceLabel]) => ({ questionId, choiceLabel }));

          const scored = scoreQuiz(quizAnswers, filterCounty);
          setResults(scored);

          if (scored.length > 0) {
            setCrmTag(generateCrmTags(quizAnswers, scored[0]));
          }

          setPhase("lead-capture");
        }
      }, 300);
    },
    [step, answers, filterCounty]
  );

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const revealResults = () => setPhase("results");

  const isDark = theme === "dark";

  if (phase === "lead-capture") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <QuizLeadCapture
          crmTags={crmTag}
          topMatch={results[0]?.displayName ?? ""}
          onSubmitted={revealResults}
          onSkip={revealResults}
          theme={theme}
        />
      </motion.div>
    );
  }

  if (phase === "results") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <QuizResults
          results={results}
          contextMunicipalityId={contextMunicipalityId}
          theme={theme}
        />
        <div className="mt-6 flex justify-center">
          {isDark ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-white/20 px-5 py-2 text-sm font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white"
            >
              Close Quiz
            </button>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close Quiz
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <QuizProgressBar current={step} total={questions.length} theme={theme} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <QuizQuestionCard
            question={questions[step]}
            selectedLabel={answers[questions[step].id] ?? null}
            onSelect={handleSelect}
            theme={theme}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        {isDark ? (
          <>
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-white/40 transition-colors hover:text-white/70"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizStepper;
