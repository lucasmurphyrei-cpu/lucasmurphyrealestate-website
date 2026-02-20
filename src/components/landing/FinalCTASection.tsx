import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const FinalCTASection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28 bg-primary text-white">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start Your Home Buying Plan Today
        </h2>
        <p className="text-white/70 font-sans text-lg mb-10">
          Whether you're buying in 2026 or just exploring options, getting informed early puts you ahead.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={scrollToTop}
            className="h-14 px-8 text-lg font-bold bg-light-blue hover:bg-light-blue-hover text-white rounded-lg shadow-lg font-sans"
          >
            Send Me the Guide
          </Button>
          <a href="https://calendly.com/lucasmurphyrei" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="h-14 px-8 text-lg font-semibold border-white/30 text-white hover:bg-white/10 rounded-lg font-sans"
            >
              Schedule a Free Strategy Call
            </Button>
          </a>
        </div>
        <p className="flex items-center justify-center gap-1.5 text-sm text-white/40 mt-4 font-sans">
          <Shield className="h-3.5 w-3.5" />
          No spam. No obligation. Just real guidance.
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;
