import React, { useState, useEffect } from "react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import {
  AlertCircle,
  RefreshCw,
  Activity,
  Database,
  Brain,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useCF } from "../../contexts/CFContext";

// Simple Badge component
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
  >
    {children}
  </span>
);

interface DataStats {
  data_counts: {
    users: number;
    events: number;
    interactions: number;
    feedback: number;
  };
  models: {
    knn_loaded: boolean;
    random_forest_loaded: boolean;
  };
  recent_activity: {
    pending_interactions: number;
    last_retrain: string;
    data_freshness: string;
  };
  timestamp: string;
}

interface SystemHealth {
  status: string;
  models: {
    knn: {
      status: string;
      info: {
        users_count: number;
        events_count: number;
        demographic_weight: number;
        behavioral_weight: number;
      };
    };
    random_forest: {
      status: string;
      info: {
        model_type: string;
        features_count: number;
        preprocessing_ready: boolean;
      };
    };
  };
  timestamp: string;
}

const MLSystemManager: React.FC = () => {
  const { triggerDataSync, getSystemHealth, getDataStats } = useCF();
  const [dataStats, setDataStats] = useState<DataStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      const [healthData, statsData] = await Promise.all([
        getSystemHealth(),
        getDataStats(),
      ]);

      setSystemHealth(healthData);
      setDataStats(statsData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch system data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    setLoading(true);
    try {
      await triggerDataSync();
      // Refresh data after sync
      await fetchSystemData();
    } catch (error) {
      console.error("Failed to trigger manual sync:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
      case "loaded":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFreshnessColor = (freshness: string) => {
    switch (freshness.toLowerCase()) {
      case "real-time":
        return "bg-green-100 text-green-800 border-green-200";
      case "recent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "static":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ML System Manager
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and control the real-time machine learning pipeline
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated}
            </span>
          )}
          <Button
            onClick={fetchSystemData}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            onClick={handleManualSync}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Database className="h-4 w-4" />
            <span>Manual Sync</span>
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  System Status
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    className={
                      systemHealth
                        ? getStatusColor(systemHealth.status)
                        : "bg-gray-100"
                    }
                  >
                    {systemHealth?.status || "Loading..."}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Models Loaded
                </p>
                <div className="flex space-x-1 mt-1">
                  <Badge
                    className={
                      dataStats?.models.knn_loaded
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    KNN
                  </Badge>
                  <Badge
                    className={
                      dataStats?.models.random_forest_loaded
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    RF
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Data Freshness
                </p>
                <Badge
                  className={
                    dataStats
                      ? getFreshnessColor(
                          dataStats.recent_activity.data_freshness
                        )
                      : "bg-gray-100"
                  }
                >
                  {dataStats?.recent_activity.data_freshness || "Unknown"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Updates
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {dataStats?.recent_activity.pending_interactions || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Statistics */}
      <Card>
        <div className="p-6">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-4">
            <Database className="h-5 w-5" />
            <span>Data Statistics</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {dataStats?.data_counts.users.toLocaleString() || "0"}
              </p>
              <p className="text-sm text-gray-600">Users</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {dataStats?.data_counts.events.toLocaleString() || "0"}
              </p>
              <p className="text-sm text-gray-600">Events</p>
            </div>
            <div className="text-center">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {dataStats?.data_counts.interactions.toLocaleString() || "0"}
              </p>
              <p className="text-sm text-gray-600">Interactions</p>
            </div>
            <div className="text-center">
              <MessageSquare className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {dataStats?.data_counts.feedback.toLocaleString() || "0"}
              </p>
              <p className="text-sm text-gray-600">Feedback</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Model Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">
                KNN Model
              </span>
              <Badge
                className={
                  systemHealth
                    ? getStatusColor(
                        systemHealth.models?.knn?.status || "unknown"
                      )
                    : "bg-gray-100"
                }
              >
                {systemHealth?.models?.knn?.status || "Unknown"}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Users Count:</span>
                <span className="font-medium">
                  {systemHealth?.models?.knn?.info?.users_count || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Events Count:</span>
                <span className="font-medium">
                  {systemHealth?.models?.knn?.info?.events_count || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Demographic Weight:
                </span>
                <span className="font-medium">
                  {systemHealth?.models?.knn?.info?.demographic_weight || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Behavioral Weight:
                </span>
                <span className="font-medium">
                  {systemHealth?.models?.knn?.info?.behavioral_weight || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">
                Random Forest Model
              </span>
              <Badge
                className={
                  systemHealth
                    ? getStatusColor(
                        systemHealth.models?.random_forest?.status || "unknown"
                      )
                    : "bg-gray-100"
                }
              >
                {systemHealth?.models?.random_forest?.status || "Unknown"}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Model Type:</span>
                <span className="font-medium">
                  {systemHealth?.models?.random_forest?.info?.model_type ||
                    "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Features Count:</span>
                <span className="font-medium">
                  {systemHealth?.models?.random_forest?.info?.features_count ||
                    "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Preprocessing:</span>
                <Badge
                  className={
                    systemHealth?.models?.random_forest?.info
                      ?.preprocessing_ready
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {systemHealth?.models?.random_forest?.info
                    ?.preprocessing_ready
                    ? "Ready"
                    : "Not Ready"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Last Model Retrain:</p>
              <p className="font-medium">
                {dataStats?.recent_activity.last_retrain || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">System Timestamp:</p>
              <p className="font-medium">
                {dataStats?.timestamp
                  ? new Date(dataStats.timestamp).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Real-time Status Indicator */}
      <Card className="border-l-4 border-l-green-500">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Real-time Learning Active
              </p>
              <p className="text-xs text-gray-600">
                System is continuously learning from user interactions and
                updating recommendations
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MLSystemManager;
