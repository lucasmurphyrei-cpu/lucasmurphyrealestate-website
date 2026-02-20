import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need 20% down?",
    a: "No. Most first-time buyers in Milwaukee put down 3–5%. There are also several assistance programs that can help cover your down payment entirely.",
  },
  {
    q: "What credit score do I need?",
    a: "Many loan programs accept scores as low as 620. FHA loans can work with even lower scores. Your rate improves as your score goes up, but you don't need perfect credit to buy.",
  },
  {
    q: "What are closing costs typically in Milwaukee?",
    a: "Closing costs in Milwaukee Metro typically run 2–4% of the purchase price. Some of these can be negotiated with the seller or covered through assistance programs.",
  },
  {
    q: "How long does the process take?",
    a: "From accepted offer to keys in hand, most transactions close in 25–45 days. The guide walks you through the full timeline step by step.",
  },
  {
    q: "Should I wait for rates to drop?",
    a: "Timing the market is nearly impossible. Buying when you're financially ready — and refinancing later if rates drop — is usually a stronger strategy than waiting.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-lg px-5 data-[state=open]:bg-cream"
            >
              <AccordionTrigger className="text-left font-sans font-semibold text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-sans leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
