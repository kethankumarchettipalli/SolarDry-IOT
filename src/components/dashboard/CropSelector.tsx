import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CROP_CONFIGS, CropConfig } from "@/lib/shared";
import { Clock, Thermometer, Droplets } from "lucide-react";

interface CropSelectorProps {
  selectedCrop: CropConfig | null;
  onCropChange: (crop: CropConfig) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  selectedCrop,
  onCropChange,
}) => {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <label className="data-label mb-2 block">Select Crop / Product</label>
          <Select
            value={selectedCrop?.id || ""}
            onValueChange={(value) => {
              const crop = CROP_CONFIGS.find((c) => c.id === value);
              if (crop) onCropChange(crop);
            }}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Choose a crop..." />
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
      </div>

      {selectedCrop && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border animate-fade-in">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-chart-temperature/15 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-chart-temperature" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Target Temperature</p>
              <p className="font-semibold">
                {selectedCrop.targetTempMin}°C - {selectedCrop.targetTempMax}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-chart-humidity/15 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-chart-humidity" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Target Humidity</p>
              <p className="font-semibold">
                {selectedCrop.targetHumidityMin}% - {selectedCrop.targetHumidityMax}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expected Duration</p>
              <p className="font-semibold">{selectedCrop.expectedDryingTime} hours</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
