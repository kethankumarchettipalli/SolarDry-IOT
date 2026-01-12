import React from "react";
import { CropConfig } from "@/lib/shared";
import { CheckCircle2, AlertTriangle, XCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThresholdComparisonProps {
  currentTemp: number | null;
  currentHumidity: number | null;
  selectedCrop: CropConfig | null;
}

type ComparisonStatus = "optimal" | "acceptable" | "warning" | "critical";

interface ComparisonResult {
  status: ComparisonStatus;
  deviation: number;
  deviationPercent: number;
  message: string;
}

const getComparisonResult = (
  value: number | null,
  min: number,
  max: number
): ComparisonResult => {
  if (value === null) {
    return { status: "acceptable", deviation: 0, deviationPercent: 0, message: "No data" };
  }

  const mid = (min + max) / 2;
  const range = max - min;
  const deviation = value - mid;
  const deviationPercent = (Math.abs(deviation) / range) * 100;

  if (value >= min && value <= max) {
    if (Math.abs(deviation) <= range * 0.2) {
      return { status: "optimal", deviation, deviationPercent, message: "Optimal range" };
    }
    return { status: "acceptable", deviation, deviationPercent, message: "Within range" };
  }

  const outOfRange = value < min ? min - value : value - max;
  const outOfRangePercent = (outOfRange / range) * 100;

  if (outOfRangePercent <= 20) {
    return { status: "warning", deviation, deviationPercent, message: "Slightly out of range" };
  }

  return { status: "critical", deviation, deviationPercent, message: "Critical deviation" };
};

const StatusIcon = ({ status }: { status: ComparisonStatus }) => {
  switch (status) {
    case "optimal":
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    case "acceptable":
      return <CheckCircle2 className="w-5 h-5 text-primary" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case "critical":
      return <XCircle className="w-5 h-5 text-destructive" />;
  }
};

const DeviationIndicator = ({ deviation }: { deviation: number }) => {
  if (Math.abs(deviation) < 0.5) {
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
  return deviation > 0 ? (
    <ArrowUp className="w-4 h-4 text-destructive" />
  ) : (
    <ArrowDown className="w-4 h-4 text-secondary" />
  );
};

export const ThresholdComparison: React.FC<ThresholdComparisonProps> = ({
  currentTemp,
  currentHumidity,
  selectedCrop,
}) => {
  if (!selectedCrop) {
    return (
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Threshold Validation</h3>
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">Select a crop to view threshold comparison</p>
        </div>
      </div>
    );
  }

  const tempResult = getComparisonResult(
    currentTemp,
    selectedCrop.targetTempMin,
    selectedCrop.targetTempMax
  );

  const humidityResult = getComparisonResult(
    currentHumidity,
    selectedCrop.targetHumidityMin,
    selectedCrop.targetHumidityMax
  );

  const statusColors: Record<ComparisonStatus, string> = {
    optimal: "bg-success/10 border-success/30",
    acceptable: "bg-primary/10 border-primary/30",
    warning: "bg-warning/10 border-warning/30",
    critical: "bg-destructive/10 border-destructive/30",
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="font-semibold text-foreground mb-4">Threshold Validation</h3>

      <div className="space-y-4">
        {/* Temperature comparison */}
        <div
          className={cn(
            "p-4 rounded-lg border",
            statusColors[tempResult.status]
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StatusIcon status={tempResult.status} />
              <span className="font-medium">Temperature</span>
            </div>
            <span className="text-sm text-muted-foreground">{tempResult.message}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Actual</p>
              <p className="font-semibold">{currentTemp?.toFixed(1) ?? "--"}°C</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Target</p>
              <p className="font-semibold">
                {selectedCrop.targetTempMin}-{selectedCrop.targetTempMax}°C
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Deviation</p>
              <p className="font-semibold flex items-center gap-1">
                <DeviationIndicator deviation={tempResult.deviation} />
                {tempResult.deviation > 0 ? "+" : ""}
                {tempResult.deviation.toFixed(1)}°C
              </p>
            </div>
          </div>
        </div>

        {/* Humidity comparison */}
        <div
          className={cn(
            "p-4 rounded-lg border",
            statusColors[humidityResult.status]
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StatusIcon status={humidityResult.status} />
              <span className="font-medium">Humidity</span>
            </div>
            <span className="text-sm text-muted-foreground">{humidityResult.message}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Actual</p>
              <p className="font-semibold">{currentHumidity?.toFixed(1) ?? "--"}%</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Target</p>
              <p className="font-semibold">
                {selectedCrop.targetHumidityMin}-{selectedCrop.targetHumidityMax}%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Deviation</p>
              <p className="font-semibold flex items-center gap-1">
                <DeviationIndicator deviation={humidityResult.deviation} />
                {humidityResult.deviation > 0 ? "+" : ""}
                {humidityResult.deviation.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
