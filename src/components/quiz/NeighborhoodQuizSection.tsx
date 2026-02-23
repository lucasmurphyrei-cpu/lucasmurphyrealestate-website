import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizStepper from "./QuizStepper";

interface NeighborhoodQuizSectionProps {
  mode: "county" | "municipality";
  contextCounty: string;
  contextMunicipalityId?: string;
}

const NeighborhoodQuizSection = ({
  mode,
  contextCounty,
  contextMunicipalityId,
}: NeighborhoodQuizSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const countyDisplay =
    contextCounty.charAt(0).toUpperCase() + contextCounty.slice(1) + " County";

  const heading =
    mode === "county"
      ? `Find Your Perfect ${countyDisplay} Neighborhood`
      : "Find Your Neighborhood Match";

  const subtitle =
    mode === "county"
      ? `Answer 13 quick questions and we'll match you with the best ${countyDisplay} neighborhood for your lifestyle.`
      : "Answer 13 quick questions and discover which neighborhoods in the county best fit your lifestyle.";

  return (
    <section className="my-12 rounded-xl border border-border bg-secondary/30 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Compass className="h-6 w-6 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold">{heading}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{subtitle}</p>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button onClick={() => setIsOpen(true)} size="lg">
              Take the Neighborhood Fit Quiz
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuizStepper
              filterCounty={contextCounty}
              contextMunicipalityId={contextMunicipalityId}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NeighborhoodQuizSection;
