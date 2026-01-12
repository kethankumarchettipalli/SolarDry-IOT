import React from "react";
import { Thermometer, Droplets, TrendingUp, TrendingDown } from "lucide-react";
import { SensorStatus } from "@/lib/shared";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  type: "temperature" | "humidity";
  value: number | null;
  status: SensorStatus;
  targetMin: number;
  targetMax: number;
  unit: string;
}

const statusConfig = {
  normal: {
    containerClass: "status-normal",
    label: "Normal",
    bgClass: "bg-success/10",
  },
  warning: {
    containerClass: "status-warning",
    label: "Warning",
    bgClass: "bg-warning/10",
  },
  critical: {
    containerClass: "status-critical",
    label: "Critical",
    bgClass: "bg-destructive/10",
  },
};

export const SensorCard: React.FC<SensorCardProps> = ({
  type,
  value,
  status,
  targetMin,
  targetMax,
  unit,
}) => {
  const config = statusConfig[status];
  const isTemperature = type === "temperature";
  const Icon = isTemperature ? Thermometer : Droplets;
  
  const targetMid = (targetMin + targetMax) / 2;
  const deviation = value !== null ? value - targetMid : 0;
  const DeviationIcon = deviation > 0 ? TrendingUp : TrendingDown;

  return (
    <div className={cn("sensor-card", config.bgClass)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isTemperature ? "bg-chart-temperature/15" : "bg-chart-humidity/15"
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6",
                isTemperature ? "text-chart-temperature" : "text-chart-humidity"
              )}
            />
          </div>
          <div>
            <p className="data-label">{isTemperature ? "Temperature" : "Humidity"}</p>
            <div className="flex items-baseline gap-1">
              <span className="data-value">
                {value !== null ? value.toFixed(1) : "--"}
              </span>
              <span className="text-lg text-muted-foreground">{unit}</span>
            </div>
          </div>
        </div>
        
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium border",
            config.containerClass
          )}
        >
          {config.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Target Range</p>
          <p className="text-sm font-medium">
            {targetMin} - {targetMax} {unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Deviation</p>
          <div className="flex items-center gap-1">
            {value !== null && Math.abs(deviation) > 0.1 && (
              <DeviationIcon
                className={cn(
                  "w-4 h-4",
                  deviation > 0 ? "text-destructive" : "text-secondary"
                )}
              />
            )}
            <p
              className={cn(
                "text-sm font-medium",
                Math.abs(deviation) <= (targetMax - targetMin) * 0.1
                  ? "text-success"
                  : deviation > 0
                  ? "text-destructive"
                  : "text-secondary"
              )}
            >
              {deviation > 0 ? "+" : ""}
              {deviation.toFixed(1)} {unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
