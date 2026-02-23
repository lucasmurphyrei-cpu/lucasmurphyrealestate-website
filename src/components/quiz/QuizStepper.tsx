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
        />
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={onClose}>
            Close Quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <QuizProgressBar current={step} total={questions.length} />

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
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
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
      </div>
    </div>
  );
};

export default QuizStepper;
