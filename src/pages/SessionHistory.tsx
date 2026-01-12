import React, { useState } from "react";
import { useSessions } from "@/hooks/useSessions";
import { getCropById, CROP_CONFIGS } from "@/lib/shared";
import { History, Calendar, Clock, CheckCircle2, Pause, Play, Filter, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const statusConfig = {
  active: {
    icon: Play,
    label: "Active",
    className: "bg-success/15 text-success border-success/30",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  paused: {
    icon: Pause,
    label: "Paused",
    className: "bg-warning/15 text-warning border-warning/30",
  },
};

const SessionHistory: React.FC = () => {
  const { sessions, loading, error } = useSessions();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const filteredSessions = sessions.filter((session) => {
    if (statusFilter !== "all" && session.status !== statusFilter) return false;
    if (cropFilter !== "all" && session.cropId !== cropFilter) return false;
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const sessionDate = new Date(session.startTime);
      if (
        filterDate.getFullYear() !== sessionDate.getFullYear() ||
        filterDate.getMonth() !== sessionDate.getMonth() ||
        filterDate.getDate() !== sessionDate.getDate()
      ) {
        return false;
      }
    }
    return true;
  });

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (start: Date, end?: Date): string => {
    const endTime = end || new Date();
    const diff = endTime.getTime() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
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
        <h3 className="font-semibold text-foreground mb-2">Error Loading Sessions</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
          <History className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Session History</h1>
          <p className="text-sm text-muted-foreground">View past and current drying sessions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Crop</label>
            <Select value={cropFilter} onValueChange={setCropFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {CROP_CONFIGS.map((crop) => (
                  <SelectItem key={crop.id} value={crop.id}>
                    {crop.icon} {crop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date</label>
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full" />
          </div>
        </div>
        {(statusFilter !== "all" || cropFilter !== "all" || dateFilter) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => {
              setStatusFilter("all");
              setCropFilter("all");
              setDateFilter("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Sessions Found</h3>
            <p className="text-sm text-muted-foreground">No drying sessions match your current filters</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const config = statusConfig[session.status];
            const StatusIcon = config.icon;
            const crop = getCropById(session.cropId);

            return (
              <div
                key={session.id}
                className="bg-card rounded-xl border border-border p-4 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Crop info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                      {crop?.icon || "🌱"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{session.cropName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateTime(session.startTime)}
                      </div>
                    </div>
                  </div>

                  {/* Session details */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {calculateDuration(session.startTime, session.endTime)}
                      </p>
                    </div>

                    {session.finalMoistureContent !== undefined && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Final Moisture</p>
                        <p className="font-medium text-foreground">{session.finalMoistureContent}%</p>
                      </div>
                    )}

                    <div className={cn("px-3 py-1.5 rounded-lg border flex items-center gap-2", config.className)}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                  </div>
                </div>

                {session.endTime && (
                  <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                    Completed: {formatDateTime(session.endTime)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
