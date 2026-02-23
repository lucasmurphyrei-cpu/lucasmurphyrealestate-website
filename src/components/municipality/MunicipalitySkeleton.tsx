import { Card, CardContent } from "@/components/ui/card";

const MunicipalitySkeleton = () => (
  <div className="space-y-10 mb-10">
    {/* Buyer Lifestyle Fit skeleton */}
    <section>
      <div className="h-8 w-56 rounded bg-muted animate-pulse mb-4" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
                <div className="h-5 w-32 rounded bg-muted animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
                <div className="h-3 w-3/5 rounded bg-muted animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    {/* Amenities skeleton */}
    <section>
      <div className="h-8 w-72 rounded bg-muted animate-pulse mb-4" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
                <div className="h-5 w-36 rounded bg-muted animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
                <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  </div>
);

export default MunicipalitySkeleton;
