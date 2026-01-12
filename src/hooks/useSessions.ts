import { useState, useEffect } from "react";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { database } from "@/lib/firebase";
import { DryingSession } from "@/lib/shared";

interface UseSessionsReturn {
  sessions: DryingSession[];
  loading: boolean;
  error: string | null;
}

export const useSessions = (limit: number = 50): UseSessionsReturn => {
  const [sessions, setSessions] = useState<DryingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionsRef = ref(database, "sessions");
    const sessionsQuery = query(sessionsRef, orderByChild("startTime"), limitToLast(limit));

    const unsubscribe = onValue(
      sessionsQuery,
      (snapshot) => {
        setLoading(false);
        const data = snapshot.val();

        if (data) {
          const sessionList: DryingSession[] = Object.entries(data).map(([id, value]) => {
            const sessionData = value as Record<string, unknown>;
            return {
              id,
              cropId: (sessionData.cropId as string) || "",
              cropName: (sessionData.cropName as string) || "",
              startTime: sessionData.startTime ? new Date(sessionData.startTime as string | number) : new Date(),
              endTime: sessionData.endTime ? new Date(sessionData.endTime as string | number) : undefined,
              status: (sessionData.status as "active" | "completed" | "paused") || "active",
              finalMoistureContent: sessionData.finalMoistureContent as number | undefined,
            };
          });

          // Sort by startTime descending (newest first)
          sessionList.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
          setSessions(sessionList);
        } else {
          setSessions([]);
        }
      },
      (err) => {
        console.error("Error fetching sessions:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limit]);

  return { sessions, loading, error };
};
