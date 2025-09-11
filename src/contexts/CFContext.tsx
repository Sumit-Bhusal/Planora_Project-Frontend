import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import * as cfApi from "../services/api/cf";
import { useNotification } from "./NotificationContext";

interface CFContextType {
  recommendations: any[];
  isLoading: boolean;
  currentModel: "knn" | "random_forest" | "ensemble";
  setCurrentModel: (model: "knn" | "random_forest" | "ensemble") => void;
  loadRecommendations: () => Promise<void>;
  trackView: (eventId: string) => Promise<void>;
  trackRegistration: (eventId: string) => Promise<void>;
  predictEventAttendance: (
    eventIds: string[]
  ) => Promise<cfApi.AttendancePrediction[]>;
  compareModels: () => Promise<any>;
  triggerDataSync: () => Promise<any>;
  getSystemHealth: () => Promise<any>;
  getDataStats: () => Promise<any>;
}

const CFContext = createContext<CFContextType | undefined>(undefined);

export const useCF = () => {
  const context = useContext(CFContext);
  if (!context) {
    throw new Error("useCF must be used within CFProvider");
  }
  return context;
};

export const CFProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<
    "knn" | "random_forest" | "ensemble"
  >("knn");

  const loadRecommendations = async () => {
    if (!user) {
      console.log("CF: No user, skipping recommendations");
      return;
    }

    console.log("CF: Loading recommendations for user:", user.id);
    setIsLoading(true);
    try {
      const eventData = await cfApi.getRecommendedEvents();
      console.log("CF: Received recommendation data:", eventData);
      if (eventData.success) {
        setRecommendations(eventData.recommendations);
        console.log("CF: Set recommendations:", eventData.recommendations);
      } else {
        console.log("CF: No successful recommendation data");
      }
    } catch (error) {
      console.error("CF: Failed to load recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackView = async (eventId: string) => {
    if (!user) return;
    await cfApi.recordInteraction(eventId, "view");
  };

  const trackRegistration = async (eventId: string) => {
    if (!user) return;
    try {
      await cfApi.recordInteraction(eventId, "register");
      addNotification({
        type: "success",
        title: "Registration Tracked",
        message:
          "Your preferences have been updated for better recommendations!",
      });
    } catch (error) {
      console.warn("Failed to track registration:", error);
    }
  };

  const predictEventAttendance = async (eventIds: string[]) => {
    if (!user) return [];
    return cfApi.predictAttendance(eventIds);
  };

  const compareModels = async () => {
    if (!user) return null;
    return cfApi.compareModels(5);
  };

  const triggerDataSync = async () => {
    try {
      const result = await cfApi.triggerDataSync();
      if (result.success) {
        addNotification({
          type: "success",
          title: "Data Sync Initiated",
          message: "ML models are being updated with latest data",
        });
        // Reload recommendations after sync
        setTimeout(loadRecommendations, 5000);
      }
      return result;
    } catch (error) {
      addNotification({
        type: "error",
        title: "Sync Failed",
        message: "Failed to sync data with ML models",
      });
      return null;
    }
  };

  const getSystemHealth = async () => {
    return cfApi.getSystemHealth();
  };

  const getDataStats = async () => {
    return cfApi.getDataStats();
  };

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, currentModel]);

  return (
    <CFContext.Provider
      value={{
        recommendations,
        isLoading,
        currentModel,
        setCurrentModel,
        loadRecommendations,
        trackView,
        trackRegistration,
        predictEventAttendance,
        compareModels,
        triggerDataSync,
        getSystemHealth,
        getDataStats,
      }}
    >
      {children}
    </CFContext.Provider>
  );
};
