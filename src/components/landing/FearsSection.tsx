import { HelpCircle } from "lucide-react";

const fears = [
  "What if I don't have enough saved?",
  "What if prices drop after I buy?",
  "What if something breaks?",
  "What if I overpay?",
  "What if interest rates fall later?",
];

const FearsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-primary text-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Worried About Buying at the Wrong Time?
        </h2>
        <div className="space-y-4 mb-10">
          {fears.map((fear, i) => (
            <div key={i} className="flex items-center gap-3 justify-center text-white/80 font-sans text-lg">
              <HelpCircle className="h-5 w-5 text-light-blue flex-shrink-0" />
              <span>{fear}</span>
            </div>
          ))}
        </div>
        <p className="text-white/60 font-sans text-lg max-w-xl mx-auto">
          This guide was designed to answer these questions with <strong className="text-white">real numbers and real strategy</strong> — not hype.
        </p>
      </div>
    </section>
  );
};

export default FearsSection;
