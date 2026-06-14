interface QuizProgressBarProps {
  current: number;
  total: number;
  theme?: "light" | "dark";
}

const QuizProgressBar = ({ current, total, theme = "light" }: QuizProgressBarProps) => {
  const pct = Math.round(((current + 1) / total) * 100);
  const isDark = theme === "dark";

  return (
    <div className="mb-6">
      <div className={`flex items-center justify-between text-sm mb-2 ${isDark ? "text-white/60" : "text-muted-foreground"}`}>
        <span>Question {current + 1} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-muted"}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${isDark ? "" : "bg-primary"}`}
          style={{
            width: `${pct}%`,
            ...(isDark ? { backgroundColor: "hsl(44,100%,53%)" } : {}),
          }}
        />
      </div>
    </div>
  );
};

export default QuizProgressBar;
