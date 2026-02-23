interface QuizProgressBarProps {
  current: number;
  total: number;
}

const QuizProgressBar = ({ current, total }: QuizProgressBarProps) => {
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Question {current + 1} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgressBar;
