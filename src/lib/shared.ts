// ============================================
// SHARED TYPES, INTERFACES, AND CONSTANTS
// All shared code goes here to prevent circular dependencies
// ============================================

// ============ TYPES & INTERFACES ============

export interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: Date;
}

export interface CropConfig {
  id: string;
  name: string;
  targetTempMin: number;
  targetTempMax: number;
  targetHumidityMin: number;
  targetHumidityMax: number;
  expectedDryingTime: number;
  icon: string;
}

export interface DryingSession {
  id: string;
  cropId: string;
  cropName: string;
  startTime: Date;
  endTime?: Date;
  status: "active" | "completed" | "paused";
  finalMoistureContent?: number;
}

export interface Alert {
  id: string;
  type: "warning" | "critical" | "info";
  message: string;
  timestamp: Date;
  sensorType: "temperature" | "humidity" | "system";
  value?: number;
  threshold?: number;
  acknowledged: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export type SensorStatus = "normal" | "warning" | "critical";

// ============ CONSTANTS ============

export const CROP_CONFIGS: CropConfig[] = [
  {
  id: "moringa",
  name: "Moringa Leaves",
  targetTempMin: 50,
  targetTempMax: 55,
  targetHumidityMin: 20,
  targetHumidityMax: 30,
  expectedDryingTime: 6,
  icon: "🌿"
},
  {
  id: "tulasi",
  name: "Tulasi Leaves",
  targetTempMin: 40,
  targetTempMax: 45,
  targetHumidityMin: 25,
  targetHumidityMax: 35,
  expectedDryingTime: 5,
  icon: "🍃"
},
  {
  id: "curry",
  name: "Curry Leaves",
  targetTempMin: 45,
  targetTempMax: 50,
  targetHumidityMin: 20,
  targetHumidityMax: 30,
  expectedDryingTime: 6,
  icon: "🌱"
},
];

// ============ HELPER FUNCTIONS ============

export const getCropById = (id: string): CropConfig | undefined => {
  return CROP_CONFIGS.find((crop) => crop.id === id);
};
