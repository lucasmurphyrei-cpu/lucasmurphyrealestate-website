import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface GuidePageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  metaDescription?: string;
}

const GuidePageTemplate = ({ title, subtitle, children }: GuidePageProps) => (
  <article className="container max-w-3xl py-16">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
      <ArrowLeft className="h-4 w-4" /> Back to Home
    </Link>
    <header className="mb-10">
      <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
    </header>
    <div className="prose-invert prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
      {children}
    </div>
    <div className="mt-16 rounded-lg border border-border bg-secondary/50 p-8 text-center">
      <h3 className="font-display text-2xl font-bold">Ready to Take the Next Step?</h3>
      <p className="mt-2 text-muted-foreground">Our team is here to guide you through every step of the process.</p>
      <Button asChild size="lg" className="mt-6">
        <Link to="/contact">Schedule a Consultation</Link>
      </Button>
    </div>
  </article>
);

export default GuidePageTemplate;
