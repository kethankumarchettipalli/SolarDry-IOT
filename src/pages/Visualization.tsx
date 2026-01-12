import React, { useState } from "react";
import { SensorChart } from "@/components/charts/SensorChart";
import { useSensorData } from "@/hooks/useSensorData";
import { CropConfig, CROP_CONFIGS } from "@/lib/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, TrendingUp, Activity } from "lucide-react";

const Visualization: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<CropConfig | null>(CROP_CONFIGS[0]);
  const { historicalData, currentData } = useSensorData(selectedCrop);

  // Calculate statistics
  const tempData = historicalData.map((d) => d.temperature);
  const humidityData = historicalData.map((d) => d.humidity);

  const avgTemp = tempData.length > 0 ? tempData.reduce((a, b) => a + b, 0) / tempData.length : 0;
  const maxTemp = tempData.length > 0 ? Math.max(...tempData) : 0;
  const minTemp = tempData.length > 0 ? Math.min(...tempData) : 0;

  const avgHumidity = humidityData.length > 0 ? humidityData.reduce((a, b) => a + b, 0) / humidityData.length : 0;
  const maxHumidity = humidityData.length > 0 ? Math.max(...humidityData) : 0;
  const minHumidity = humidityData.length > 0 ? Math.min(...humidityData) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center">
            <LineChart className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Data Visualization</h1>
            <p className="text-sm text-muted-foreground">Real-time sensor data charts and analytics</p>
          </div>
        </div>

        <Select
          value={selectedCrop?.id || ""}
          onValueChange={(value) => {
            const crop = CROP_CONFIGS.find((c) => c.id === value);
            if (crop) setSelectedCrop(crop);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select crop..." />
          </SelectTrigger>
          <SelectContent>
            {CROP_CONFIGS.map((crop) => (
              <SelectItem key={crop.id} value={crop.id}>
                <span className="flex items-center gap-2">
                  <span>{crop.icon}</span>
                  <span>{crop.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Current Temp</p>
          <p className="text-xl font-bold text-chart-temperature">
            {currentData?.temperature.toFixed(1) ?? "--"}°C
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Avg Temp</p>
          <p className="text-xl font-bold text-foreground">{avgTemp.toFixed(1)}°C</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Min / Max</p>
          <p className="text-lg font-bold text-foreground">
            {minTemp.toFixed(1)} / {maxTemp.toFixed(1)}°C
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Current Humidity</p>
          <p className="text-xl font-bold text-chart-humidity">
            {currentData?.humidity.toFixed(1) ?? "--"}%
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Avg Humidity</p>
          <p className="text-xl font-bold text-foreground">{avgHumidity.toFixed(1)}%</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Min / Max</p>
          <p className="text-lg font-bold text-foreground">
            {minHumidity.toFixed(1)} / {maxHumidity.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Main chart area */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Sensor Trends</h2>
        </div>

        <Tabs defaultValue="combined" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="combined">Combined View</TabsTrigger>
            <TabsTrigger value="temperature">Temperature Only</TabsTrigger>
            <TabsTrigger value="humidity">Humidity Only</TabsTrigger>
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

      {/* Chart legend / info */}
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded-full bg-chart-temperature" />
            <span className="text-muted-foreground">Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded-full bg-chart-humidity" />
            <span className="text-muted-foreground">Humidity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 rounded-full bg-chart-threshold border-dashed" />
            <span className="text-muted-foreground">Threshold Lines</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;
