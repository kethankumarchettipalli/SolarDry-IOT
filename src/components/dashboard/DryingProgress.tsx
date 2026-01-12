import React from "react";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface DryingProgressProps {
  startTime: Date | null;
  expectedDuration: number; // in hours
}

export const DryingProgress: React.FC<DryingProgressProps> = ({
  startTime,
  expectedDuration,
}) => {
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (!startTime) return;

    const updateElapsed = () => {
      const now = new Date();
      const diff = (now.getTime() - startTime.getTime()) / 1000 / 60 / 60; // in hours
      setElapsed(Math.max(0, diff));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const progress = startTime ? Math.min((elapsed / expectedDuration) * 100, 100) : 0;
  const remaining = Math.max(expectedDuration - elapsed, 0);
  const isComplete = progress >= 100;

  const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Drying Progress</h3>
        </div>
        {startTime && (
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium",
              isComplete
                ? "bg-success/15 text-success"
                : "bg-primary/15 text-primary"
            )}
          >
            {isComplete ? "Complete" : "In Progress"}
          </span>
        )}
      </div>

      {!startTime ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No active drying session</p>
          <p className="text-xs mt-1">Select a crop to start monitoring</p>
        </div>
      ) : (
        <>
          <div className="relative mb-4">
            <Progress value={progress} className="h-4" />
            <div
              className="absolute top-0 left-0 h-full flex items-center justify-center text-xs font-medium text-primary-foreground"
              style={{ width: `${Math.max(progress, 8)}%` }}
            >
              {progress.toFixed(0)}%
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Elapsed</p>
              <p className="font-semibold text-foreground">{formatTime(elapsed)}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Remaining</p>
              <p className="font-semibold text-foreground">
                {isComplete ? (
                  <span className="flex items-center justify-center gap-1 text-success">
                    <CheckCircle2 className="w-4 h-4" /> Done
                  </span>
                ) : (
                  formatTime(remaining)
                )}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Expected</p>
              <p className="font-semibold text-foreground">{expectedDuration}h</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
