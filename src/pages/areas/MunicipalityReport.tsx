import { useParams, Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MunicipalityReport = () => {
  const { county, municipality } = useParams();

  const countyName = county
    ? county.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "";
  const muniName = municipality
    ? municipality.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "";

  return (
    <main className="container py-16">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to={`/areas/${county}`} className="hover:text-primary">{countyName}</Link>
        <span>/</span>
        <span>{muniName}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <MapPin className="h-8 w-8 text-primary" />
        <h1 className="font-display text-4xl font-bold md:text-5xl">{muniName}</h1>
      </div>
      <p className="text-lg text-muted-foreground">{countyName}, Wisconsin</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Market Overview</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Market report data for {muniName} is coming soon. Contact us for the latest insights on this area.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Median Home Price</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">Coming Soon</p>
            <p className="text-sm text-muted-foreground mt-1">We're gathering the latest data for {muniName}.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Days on Market</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">Coming Soon</p>
            <p className="text-sm text-muted-foreground mt-1">Average days on market data will appear here.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <Button asChild>
          <Link to="/contact">Get a Custom Market Report</Link>
        </Button>
      </div>
    </main>
  );
};

export default MunicipalityReport;