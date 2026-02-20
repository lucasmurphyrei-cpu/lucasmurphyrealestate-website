import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Home } from "lucide-react";

const FirstTimeHomeBuyers = () => (
  <article className="container max-w-3xl py-16">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
      <ArrowLeft className="h-4 w-4" /> Back to Home
    </Link>

    <Card className="mt-8 border-primary/20">
      <CardContent className="flex flex-col items-center gap-6 p-10 text-center">
        <Home className="h-12 w-12 text-primary" />
        <h1 className="font-display text-3xl font-bold md:text-4xl">First-Time Home Buyer Guide</h1>
        <p className="max-w-md text-muted-foreground">
          Everything you need to know about buying your first home in Metro Milwaukee — read the full guide on our website.
        </p>
        <Button asChild size="lg" className="gap-2">
          <a href="https://lucasmurphyrealestate.com/guide/first-time-homebuyer-metro-milwaukee" target="_blank" rel="noopener noreferrer">
            Read the Full Guide <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  </article>
);

export default FirstTimeHomeBuyers;
