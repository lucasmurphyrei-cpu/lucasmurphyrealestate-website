import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";

const Relocation = () => (
  <article className="container max-w-3xl py-16">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
      <ArrowLeft className="h-4 w-4" /> Back to Home
    </Link>

    <Card className="mt-8 border-primary/20">
      <CardContent className="flex flex-col items-center gap-6 p-10 text-center">
        <MapPin className="h-12 w-12 text-primary" />
        <h1 className="font-display text-3xl font-bold md:text-4xl">Relocation Guide</h1>
        <p className="max-w-md text-muted-foreground">
          Everything you need to know about relocating to Milwaukee or Waukesha County — neighborhoods, schools, cost of living, and more.
        </p>
        <Button asChild size="lg" className="gap-2">
          <a href="https://www.lucasmurphyrealestate.com/guide/relocation-guide-metro-milwaukee" target="_blank" rel="noopener noreferrer">
            Read the Full Guide <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  </article>
);

export default Relocation;
