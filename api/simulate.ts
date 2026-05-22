const DB_URL = process.env.VITE_FIREBASE_DATABASE_URL || "https://solardry-iot-default-rtdb.firebaseio.com";
const DB_SECRET = process.env.FIREBASE_DB_SECRET;

const CROP_STATES = [
  { id: "moringa", name: "Moringa Leaves", k: 0.05, n: 1.2, baseTemp: 52, baseHum: 25 },
  { id: "tulasi", name: "Tulasi Leaves", k: 0.04, n: 1.1, baseTemp: 42, baseHum: 30 },
  { id: "curry", name: "Curry Leaves", k: 0.06, n: 1.3, baseTemp: 47, baseHum: 25 },
];

export default async function handler(req: any, res: any) {
  try {
    const authQuery = DB_SECRET ? `?auth=${DB_SECRET}` : "";
    
    // 1. Fetch system config
    const configRes = await fetch(`${DB_URL}/system_config.json${authQuery}`);
    if (!configRes.ok) throw new Error("Failed to fetch system config");
    const config = await configRes.json() || {};
    
    if (!config.simulation_running) {
      return res.status(200).json({ status: "skipped", reason: "simulation_running is false" });
    }

    // Determine active crop
    const activeCropId = config.active_crop || CROP_STATES[0].id;
    let cropIndex = CROP_STATES.findIndex(c => c.id === activeCropId);
    if (cropIndex === -1) cropIndex = 0;
    const currentCrop = CROP_STATES[cropIndex];

    // 2. Fetch sensor history to determine 't' (time elapsed)
    const historyRes = await fetch(`${DB_URL}/sensor_history.json${authQuery}`);
    const historyData = await historyRes.json();
    const records = historyData ? Object.values(historyData) : [];
    
    // Time elapsed is proportional to the number of records (e.g., 1 record = 1 minute)
    const t = records.length; 

    // 3. Mathematical Model: MR = exp(-k * t^n)
    const mr = Math.exp(-currentCrop.k * Math.pow(t, currentCrop.n));
    let simulatedHumidity = currentCrop.baseHum + (50 * mr);
    simulatedHumidity = Number(simulatedHumidity.toFixed(1));

    // Base temperature with minor natural fluctuation
    let simulatedTemp = currentCrop.baseTemp + ((Math.random() * 2) - 1);

    // 4. Anomaly & Auto-Correction Engine (10% chance)
    const isAnomaly = Math.random() < 0.10;
    if (isAnomaly) {
      // Create a temperature spike (e.g., 20% higher than base)
      simulatedTemp = currentCrop.baseTemp * 1.2 + (Math.random() * 5);
      
      const alertPayload = {
        timestamp: new Date().toISOString(),
        type: "critical",
        message: `Temperature spike detected (${simulatedTemp.toFixed(1)}°C) above normal operating threshold.`,
        sensorType: "temperature",
        value: Number(simulatedTemp.toFixed(1)),
        threshold: currentCrop.baseTemp,
        acknowledged: false
      };
      
      await fetch(`${DB_URL}/alerts.json${authQuery}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertPayload)
      });
    }

    simulatedTemp = Number(simulatedTemp.toFixed(1));

    const payload = {
      temperature: simulatedTemp,
      humidity: simulatedHumidity,
      timestamp: new Date().toISOString(),
      active_crop: currentCrop.id,
      moisture_ratio: Number(mr.toFixed(3))
    };

    // 5. Write to /liveData (PUT) and /sensor_history (POST)
    await fetch(`${DB_URL}/liveData.json${authQuery}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    await fetch(`${DB_URL}/sensor_history.json${authQuery}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    records.push(payload); // Add current reading for potential session completion

    // 6. Autonomous Session Completion
    // Check if crop is fully dried (humidity dropped to or below baseHum)
    // We add a tiny buffer (0.1) for floating point precision handling.
    if (simulatedHumidity <= currentCrop.baseHum + 0.1) {
      // Calculate averages
      const totalTemp = records.reduce((sum: number, r: any) => sum + r.temperature, 0);
      const totalHum = records.reduce((sum: number, r: any) => sum + r.humidity, 0);
      const avgTemp = records.length > 0 ? (totalTemp / records.length) : simulatedTemp;
      const avgHum = records.length > 0 ? (totalHum / records.length) : simulatedHumidity;

      const startTime = records.length > 0 ? records[0].timestamp : payload.timestamp;

      const sessionPayload = {
        cropId: currentCrop.id,
        cropName: currentCrop.name,
        startTime: startTime,
        endTime: new Date().toISOString(),
        status: "completed",
        finalMoistureContent: Number((mr * 100).toFixed(1)), // percentage
        averageTemperature: Number(avgTemp.toFixed(1)),
        averageHumidity: Number(avgHum.toFixed(1))
      };

      // POST to /sessions
      await fetch(`${DB_URL}/sessions.json${authQuery}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionPayload)
      });

      // Clear /sensor_history
      await fetch(`${DB_URL}/sensor_history.json${authQuery}`, {
        method: "DELETE"
      });

      // Update /system_config active_crop to the next one
      const nextCropIndex = (cropIndex + 1) % CROP_STATES.length;
      await fetch(`${DB_URL}/system_config/active_crop.json${authQuery}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CROP_STATES[nextCropIndex].id)
      });
      
      // Optionally stop simulation, or let it continue autonomously
      // We will let it continue, so the next cron tick starts the new crop.
    }

    return res.status(200).json({ status: "success", anomaly: isAnomaly, data: payload });

  } catch (error: any) {
    console.error("Simulation error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}
