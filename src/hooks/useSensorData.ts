import { useState, useEffect, useCallback } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { SensorData, SensorStatus, CropConfig } from "@/lib/shared";

interface UseSensorDataReturn {
  currentData: SensorData | null;
  historicalData: SensorData[];
  temperatureStatus: SensorStatus;
  humidityStatus: SensorStatus;
  isConnected: boolean;
  lastUpdate: Date | null;
}

const getStatus = (value: number, min: number, max: number): SensorStatus => {
  const warningBuffer = (max - min) * 0.15;

  if (value < min - warningBuffer || value > max + warningBuffer) {
    return "critical";
  }
  if (value < min || value > max) {
    return "warning";
  }
  return "normal";
};

export const useSensorData = (selectedCrop: CropConfig | null): UseSensorDataReturn => {
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const getTemperatureStatus = useCallback((): SensorStatus => {
    if (!currentData || !selectedCrop) return "normal";
    return getStatus(currentData.temperature, selectedCrop.targetTempMin, selectedCrop.targetTempMax);
  }, [currentData, selectedCrop]);

  const getHumidityStatus = useCallback((): SensorStatus => {
    if (!currentData || !selectedCrop) return "normal";
    return getStatus(currentData.humidity, selectedCrop.targetHumidityMin, selectedCrop.targetHumidityMax);
  }, [currentData, selectedCrop]);

  useEffect(() => {
    // Firebase Realtime Database listener for live sensor data
    const liveDataRef = ref(database, "liveData");

    const unsubscribe = onValue(
      liveDataRef,
      (snapshot) => {
        setIsConnected(true);
        const data = snapshot.val();

        if (data) {
          const sensorReading: SensorData = {
            temperature: data.temperature ?? 0,
            humidity: data.humidity ?? 0,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
          };

          setCurrentData(sensorReading);
          setLastUpdate(new Date());

          // Add to historical data
          setHistoricalData((prev) => {
            const updated = [...prev, sensorReading];
            return updated.slice(-60); // Keep last 60 readings
          });
        }
      },
      (error) => {
        console.error("Firebase connection error:", error);
        setIsConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    currentData,
    historicalData,
    temperatureStatus: getTemperatureStatus(),
    humidityStatus: getHumidityStatus(),
    isConnected,
    lastUpdate,
  };
};
