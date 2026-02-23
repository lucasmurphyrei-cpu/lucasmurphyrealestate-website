import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarketSnapshot from "@/components/MarketSnapshot";
import NeighborhoodQuizSection from "@/components/quiz/NeighborhoodQuizSection";
import countyMarketData from "@/data/countyMarketData";

interface CountyPageProps {
  name: string;
  description: string;
  municipalities: string[];
}

const CountyPage = ({ name, description, municipalities }: CountyPageProps) => {
  const sorted = [...municipalities].sort();
  const marketData = countyMarketData[name];
  const countyKey = name.toLowerCase().replace(" county", "").replace(/\s+/g, "-");
  const countySlug = name.toLowerCase().replace(/\s+/g, "-");

  return (
    <main className="container py-16">
      <Helmet>
        <title>{name} | Municipality Profiles & Market Data | Lucas Murphy Real Estate</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.lucasmurphyrealestate.com/areas/${countySlug}`} />
      </Helmet>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span>{name}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-8 w-8 text-primary" />
        <h1 className="font-display text-4xl font-bold md:text-5xl">{name}</h1>
      </div>
      <p className="max-w-2xl text-lg text-muted-foreground">{description}</p>

      {marketData && (
        <MarketSnapshot countyName={name} data={marketData} />
      )}

      <h2 className="mt-12 font-display text-2xl font-bold">Municipalities & Neighborhoods</h2>
      <p className="mt-2 text-muted-foreground">Click on a municipality to view its market report.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sorted.map((muni) => {
          const slug = muni.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "");
          const countySlug = name.toLowerCase().replace(/\s+/g, "-");
          return (
            <Link key={muni} to={`/areas/${countySlug}/${slug}`}>
              <Card className="group transition-colors hover:border-primary/40">
                <CardContent className="flex items-center justify-between p-4">
                  <span className="font-medium">{muni}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <NeighborhoodQuizSection mode="county" contextCounty={countyKey} />

      <div className="mt-12">
        <Button asChild>
          <Link to="/contact">Schedule a Consultation</Link>
        </Button>
      </div>
    </main>
  );
};

export default CountyPage;