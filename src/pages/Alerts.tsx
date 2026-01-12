import React, { useState } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, Thermometer, Droplets, Settings, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const alertConfig = {
  critical: {
    icon: AlertCircle,
    containerClass: "bg-destructive/10 border-destructive/30",
    iconClass: "text-destructive",
    label: "Critical",
    labelClass: "bg-destructive/15 text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    containerClass: "bg-warning/10 border-warning/30",
    iconClass: "text-warning",
    label: "Warning",
    labelClass: "bg-warning/15 text-warning",
  },
  info: {
    icon: Info,
    containerClass: "bg-secondary/10 border-secondary/30",
    iconClass: "text-secondary",
    label: "Info",
    labelClass: "bg-secondary/15 text-secondary",
  },
};

const sensorIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  system: Settings,
};

const Alerts: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const { alerts, loading, error } = useAlerts();

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <h3 className="font-semibold text-foreground mb-2">Error Loading Alerts</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Alerts & Warnings</h1>
            <p className="text-sm text-muted-foreground">
              {unacknowledgedCount} unacknowledged alert{unacknowledgedCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("critical")}
            className={filter === "critical" ? "" : "text-destructive border-destructive/30 hover:bg-destructive/10"}
          >
            Critical
          </Button>
          <Button
            variant={filter === "warning" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("warning")}
            className={filter === "warning" ? "" : "text-warning border-warning/30 hover:bg-warning/10"}
          >
            Warning
          </Button>
          <Button
            variant={filter === "info" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("info")}
            className={filter === "info" ? "" : "text-secondary border-secondary/30 hover:bg-secondary/10"}
          >
            Info
          </Button>
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Alerts</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "all" ? "All systems are operating normally" : `No ${filter} alerts at this time`}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const config = alertConfig[alert.type];
            const AlertIcon = config.icon;
            const SensorIcon = sensorIcons[alert.sensorType];

            return (
              <div
                key={alert.id}
                className={cn(
                  "bg-card rounded-xl border p-4 transition-all duration-200",
                  config.containerClass,
                  !alert.acknowledged && "ring-2 ring-offset-2 ring-offset-background",
                  !alert.acknowledged && alert.type === "critical" && "ring-destructive/50",
                  !alert.acknowledged && alert.type === "warning" && "ring-warning/50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.containerClass)}>
                    <AlertIcon className={cn("w-5 h-5", config.iconClass)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", config.labelClass)}>
                        {config.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <SensorIcon className="w-3 h-3" />
                        {alert.sensorType.charAt(0).toUpperCase() + alert.sensorType.slice(1)}
                      </span>
                      {!alert.acknowledged && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-foreground/10 text-foreground">
                          New
                        </span>
                      )}
                    </div>

                    <p className="font-medium text-foreground mb-2">{alert.message}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimestamp(alert.timestamp)}
                      </span>
                      {alert.value !== undefined && (
                        <span>
                          Value: <strong className="text-foreground">{alert.value}</strong>
                          {alert.threshold && <> (Threshold: {alert.threshold})</>}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Alerts;
