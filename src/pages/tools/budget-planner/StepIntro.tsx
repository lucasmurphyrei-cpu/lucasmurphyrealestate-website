import { Card, CardContent } from "@/components/ui/card";

interface StepIntroProps {
  step: 1 | 2 | 3 | 4;
  title: string;
  children: React.ReactNode;
}

const STEP_COLORS: Record<number, { badge: string; border: string; bg: string }> = {
  1: { badge: "bg-primary text-primary-foreground", border: "border-primary/20", bg: "bg-primary/[0.03]" },
  2: { badge: "bg-amber-600 text-white", border: "border-amber-500/20", bg: "bg-amber-500/[0.03]" },
  3: { badge: "bg-emerald-600 text-white", border: "border-emerald-500/20", bg: "bg-emerald-500/[0.03]" },
  4: { badge: "bg-blue-600 text-white", border: "border-blue-500/20", bg: "bg-blue-500/[0.03]" },
};

const StepIntro = ({ step, title, children }: StepIntroProps) => {
  const colors = STEP_COLORS[step];

  return (
    <Card className={`${colors.border} ${colors.bg}`}>
      <CardContent className="py-5">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${colors.badge} font-display font-bold text-lg`}>
            {step}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Step {step} of 4
            </p>
            <h2 className="font-display font-bold text-lg leading-tight mb-2">{title}</h2>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepIntro;
