import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ResourcePageProps {
  title: string;
  description: string;
}

const ResourcePageTemplate = ({ title, description }: ResourcePageProps) => (
  <section className="container max-w-3xl py-16">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
      <ArrowLeft className="h-4 w-4" /> Back to Home
    </Link>
    <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
    <p className="mt-4 text-lg text-muted-foreground">{description}</p>

    <div className="mt-12 rounded-lg border border-dashed border-border bg-secondary/30 p-12 text-center">
      <p className="text-lg text-muted-foreground">Our curated directory is coming soon.</p>
      <p className="mt-2 text-sm text-muted-foreground">We're building a trusted list of professionals to help you along the way.</p>
    </div>

    <div className="mt-12 text-center">
      <p className="text-muted-foreground">Know a great professional? Want to be listed?</p>
      <Button asChild variant="outline" className="mt-4">
        <Link to="/contact">Get in Touch</Link>
      </Button>
    </div>
  </section>
);

export default ResourcePageTemplate;
