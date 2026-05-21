import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Play, Square, Server, Wifi, WifiOff, Clock } from "lucide-react";
import { toast } from "sonner";

const AdminPanel = () => {
  const { user } = useAuth();
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Listen to simulation status
    const simRef = ref(database, "system_config/simulation_running");
    const unsubSim = onValue(simRef, (snapshot) => {
      setIsSimulationRunning(!!snapshot.val());
    });

    // Listen to Firebase connection status
    const connectedRef = ref(database, ".info/connected");
    const unsubConnected = onValue(connectedRef, (snapshot) => {
      setIsConnected(!!snapshot.val());
    });

    // Listen to last update
    const lastUpdateRef = ref(database, "liveData/timestamp");
    const unsubUpdate = onValue(lastUpdateRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setLastUpdate(new Date(val));
      }
    });

    return () => {
      unsubSim();
      unsubConnected();
      unsubUpdate();
    };
  }, []);

  const toggleSimulation = async () => {
    try {
      const newState = !isSimulationRunning;
      await set(ref(database, "system_config/simulation_running"), newState);
      toast.success(`Simulation ${newState ? "started" : "stopped"}`);
    } catch (error: any) {
      toast.error("Failed to toggle simulation: " + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Control Panel</h2>
        <p className="text-muted-foreground mt-2">
          Manage system configuration and multi-crop simulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulation Control */}
        <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
          <div>
            <h3 className="font-semibold text-xl">Simulation Engine</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Toggle the Vercel-backed multi-crop drying simulation.
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            {isSimulationRunning ? (
              <Button onClick={toggleSimulation} variant="destructive" size="lg" className="w-48 gap-2">
                <Square className="w-5 h-5" /> Stop Simulation
              </Button>
            ) : (
              <Button onClick={toggleSimulation} size="lg" className="w-48 gap-2 bg-success hover:bg-success/90 text-success-foreground">
                <Play className="w-5 h-5" /> Start Simulation
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm font-medium">Status:</span>
            {isSimulationRunning ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Running
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-muted-foreground"></span> Stopped
              </span>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" /> System Health
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-md shadow-sm">
                  {isConnected ? <Wifi className="w-5 h-5 text-success" /> : <WifiOff className="w-5 h-5 text-destructive" />}
                </div>
                <div>
                  <p className="font-medium text-sm">Database Connection</p>
                  <p className="text-xs text-muted-foreground">Firebase RTDB state</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${isConnected ? 'text-success' : 'text-destructive'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-md shadow-sm">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Last Data Update</p>
                  <p className="text-xs text-muted-foreground">Simulation payload</p>
                </div>
              </div>
              <span className="text-sm font-semibold">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : 'No data yet'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
