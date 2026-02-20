import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <Button
        onClick={scrollToTop}
        className="h-12 px-6 text-sm font-bold bg-light-blue hover:bg-light-blue-hover text-white rounded-full shadow-xl font-sans flex items-center gap-2"
      >
        <ArrowUp className="h-4 w-4" />
        Get My Free Guide
      </Button>
    </div>
  );
};

export default StickyCTA;
