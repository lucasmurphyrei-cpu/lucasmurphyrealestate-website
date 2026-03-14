import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WhyFixedCostsSection = () => (
  <Card className="border-primary/20 bg-primary/[0.02]">
    <CardHeader>
      <CardTitle className="text-lg font-display">Why This Matters for Real Estate</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
      <p>
        Knowing your monthly fixed costs is the foundation of smart homebuying. Lenders look at your
        <strong className="text-foreground"> debt-to-income ratio (DTI)</strong> — the percentage of your gross income
        that goes toward monthly debt payments. Most conventional loans require a DTI under 43%, and
        FHA loans allow up to 50% in some cases.
      </p>
      <p>
        When you know exactly what you spend each month, you can confidently answer the most important question:
        <strong className="text-foreground"> "How much house can I actually afford?"</strong> — not just what a lender
        will approve you for, but what fits your real lifestyle.
      </p>
      <p>
        This also helps you build a stronger offer. Sellers and their agents take buyers more seriously when they've
        done their homework. And if you're considering house hacking — buying a multi-unit property and renting out the
        other units — understanding your fixed costs helps you calculate the true monthly benefit of rental income
        offsetting your mortgage.
      </p>
      <p className="text-xs border-t border-border pt-3">
        Want help figuring out how much home you can afford? Reach out at{" "}
        <a href="tel:4142694909" className="text-primary hover:underline font-medium">(414)-269-4909</a> or{" "}
        <a href="mailto:lucas.murphy@exprealty.com" className="text-primary hover:underline font-medium">
          lucas.murphy@exprealty.com
        </a>
      </p>
    </CardContent>
  </Card>
);

export default WhyFixedCostsSection;
