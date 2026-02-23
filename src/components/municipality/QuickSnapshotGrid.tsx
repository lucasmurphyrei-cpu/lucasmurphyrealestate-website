import { Users, Calendar, DollarSign, Home, Building2, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { QuickSnapshot } from "@/data/neighborhoodTypes";

interface QuickSnapshotGridProps {
  snapshot: QuickSnapshot;
}

const stats = [
  { key: "population" as const, label: "Population", icon: Users },
  { key: "median_age" as const, label: "Median Age", icon: Calendar },
  { key: "median_household_income" as const, label: "Median Income", icon: DollarSign },
  { key: "median_home_price" as const, label: "Median Home Price", icon: Home },
  { key: "average_rent" as const, label: "Average Rent", icon: Building2 },
  { key: "school_district" as const, label: "School District", icon: GraduationCap },
];

const QuickSnapshotGrid = ({ snapshot }: QuickSnapshotGridProps) => (
  <section className="mb-10">
    <h2 className="font-display text-2xl font-bold mb-4">Quick Snapshot</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardContent className="flex items-start gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className={`mt-1 font-semibold leading-snug ${key === "school_district" ? "text-sm" : "text-base"}`}>
                {snapshot[key]}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default QuickSnapshotGrid;
