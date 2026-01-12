import React, { useState } from "react";
import { CropSelector } from "@/components/dashboard/CropSelector";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { DryingProgress } from "@/components/dashboard/DryingProgress";
import { ThresholdComparison } from "@/components/dashboard/ThresholdComparison";
import { SensorChart } from "@/components/charts/SensorChart";
import { useSensorData } from "@/hooks/useSensorData";
import { CropConfig, CROP_CONFIGS } from "@/lib/shared";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropConfig | null>(CROP_CONFIGS[0]);
  const [sessionStart] = useState<Date>(new Date(Date.now() - 2 * 60 * 60 * 1000)); // 2 hours ago for demo

  const {
    currentData,
    historicalData,
    temperatureStatus,
    humidityStatus,
    isConnected,
    lastUpdate,
  } = useSensorData(selectedCrop);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Connection status bar */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-slow" />
              <Wifi className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-foreground">Connected to Sensors</span>
            </>
          ) : (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
              <WifiOff className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-foreground">Disconnected</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Last update: {lastUpdate?.toLocaleTimeString() || "Never"}
          </span>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Crop selector */}
      <CropSelector selectedCrop={selectedCrop} onCropChange={setSelectedCrop} />

      {/* Sensor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorCard
          type="temperature"
          value={currentData?.temperature ?? null}
          status={temperatureStatus}
          targetMin={selectedCrop?.targetTempMin ?? 50}
          targetMax={selectedCrop?.targetTempMax ?? 60}
          unit="°C"
        />
        <SensorCard
          type="humidity"
          value={currentData?.humidity ?? null}
          status={humidityStatus}
          targetMin={selectedCrop?.targetHumidityMin ?? 10}
          targetMax={selectedCrop?.targetHumidityMax ?? 15}
          unit="%"
        />
      </div>

      {/* Charts section */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Real-Time Sensor Data</h3>
        <Tabs defaultValue="combined" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="combined">Combined View</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="humidity">Humidity</TabsTrigger>
          </TabsList>
          <TabsContent value="combined">
            <SensorChart
              data={historicalData}
              selectedCrop={selectedCrop}
              chartType="combined"
            />
          </TabsContent>
          <TabsContent value="temperature">
            <SensorChart
              data={historicalData}
              selectedCrop={selectedCrop}
              chartType="temperature"
            />
          </TabsContent>
          <TabsContent value="humidity">
            <SensorChart
              data={historicalData}
              selectedCrop={selectedCrop}
              chartType="humidity"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Progress and threshold comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DryingProgress
          startTime={sessionStart}
          expectedDuration={selectedCrop?.expectedDryingTime ?? 12}
        />
        <ThresholdComparison
          currentTemp={currentData?.temperature ?? null}
          currentHumidity={currentData?.humidity ?? null}
          selectedCrop={selectedCrop}
        />
      </div>
    </div>
  );
};

export default Dashboard;
