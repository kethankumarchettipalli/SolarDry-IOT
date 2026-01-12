import { useState, useEffect } from "react";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { database } from "@/lib/firebase";
import { Alert } from "@/lib/shared";

interface UseAlertsReturn {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

export const useAlerts = (limit: number = 50): UseAlertsReturn => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const alertsRef = ref(database, "alerts");
    const alertsQuery = query(alertsRef, orderByChild("timestamp"), limitToLast(limit));

    const unsubscribe = onValue(
      alertsQuery,
      (snapshot) => {
        setLoading(false);
        const data = snapshot.val();

        if (data) {
          const alertList: Alert[] = Object.entries(data).map(([id, value]) => {
            const alertData = value as Record<string, unknown>;
            return {
              id,
              type: (alertData.type as "warning" | "critical" | "info") || "info",
              message: (alertData.message as string) || "",
              timestamp: alertData.timestamp ? new Date(alertData.timestamp as string | number) : new Date(),
              sensorType: (alertData.sensorType as "temperature" | "humidity" | "system") || "system",
              value: alertData.value as number | undefined,
              threshold: alertData.threshold as number | undefined,
              acknowledged: (alertData.acknowledged as boolean) || false,
            };
          });

          // Sort by timestamp descending (newest first)
          alertList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setAlerts(alertList);
        } else {
          setAlerts([]);
        }
      },
      (err) => {
        console.error("Error fetching alerts:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limit]);

  return { alerts, loading, error };
};
