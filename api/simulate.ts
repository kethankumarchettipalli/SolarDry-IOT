const DB_URL = process.env.VITE_FIREBASE_DATABASE_URL || "https://solardry-iot-default-rtdb.firebaseio.com";
const DB_SECRET = process.env.FIREBASE_DB_SECRET; // Must be set in Vercel for write access

const CROP_STATES = [
  { id: "moringa", name: "Moringa Leaves", k: 0.05, n: 1.2, baseTemp: 52, baseHum: 25 },
  { id: "tulasi", name: "Tulasi Leaves", k: 0.04, n: 1.1, baseTemp: 42, baseHum: 30 },
  { id: "curry", name: "Curry Leaves", k: 0.06, n: 1.3, baseTemp: 47, baseHum: 25 },
];

export default async function handler(req: any, res: any) {
  try {
    const authQuery = DB_SECRET ? `?auth=${DB_SECRET}` : "";
    
    // 1. Check if simulation is running
    const configRes = await fetch(`${DB_URL}/system_config.json${authQuery}`);
    if (!configRes.ok) throw new Error("Failed to fetch system config");
    
    const config = await configRes.json();
    if (!config || !config.simulation_running) {
      return res.status(200).json({ status: "skipped", reason: "simulation_running is false" });
    }

    // 2. Determine current crop and time state
    // We'll use the current hour to cycle through crops (1 crop per hour for demo)
    const now = new Date();
    const cycleIndex = now.getHours() % CROP_STATES.length;
    const currentCrop = CROP_STATES[cycleIndex];
    
    // t is the minutes passed in the current hour (0-59)
    // We simulate a drying cycle that progresses over an hour
    const t = now.getMinutes(); 

    // Page Model: MR = exp(-k * t^n)
    // As MR goes from 1.0 down to ~0, humidity drops.
    const mr = Math.exp(-currentCrop.k * Math.pow(t, currentCrop.n));
    
    // Humidity starts high (e.g., baseHum + 50) and drops to baseHum as MR approaches 0
    const simulatedHumidity = currentCrop.baseHum + (50 * mr);
    
    // Temperature stays around baseTemp with some minor fluctuation
    const fluctuation = (Math.random() * 2) - 1;
    const simulatedTemp = currentCrop.baseTemp + fluctuation;

    const payload = {
      temperature: Number(simulatedTemp.toFixed(1)),
      humidity: Number(simulatedHumidity.toFixed(1)),
      timestamp: now.toISOString(),
      active_crop: currentCrop.id,
      moisture_ratio: Number(mr.toFixed(3))
    };

    // 3. Write to /liveData
    const writeRes = await fetch(`${DB_URL}/liveData.json${authQuery}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!writeRes.ok) {
      throw new Error(`Failed to write liveData: ${await writeRes.text()}`);
    }

    return res.status(200).json({ status: "success", data: payload });

  } catch (error: any) {
    console.error("Simulation error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
}
