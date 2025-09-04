import axiosInstance from "../../lib/axiosInstance";

export interface RecommendationResult {
  success: boolean;
  recommendations: string[];
  confidenceScores?: number[];
  model: string;
  method: string;
  count: number;
  userId: string;
}

export interface AttendancePrediction {
  eventId: string;
  attendanceProbability: number;
  prediction: 'likely' | 'unlikely' | 'unknown';
}

// Core CF API Functions that match your existing patterns
export const getRecommendations = async (
  limit: number = 5,
  method: 'demographic' | 'behavioral' | 'hybrid' = 'hybrid',
  model: 'knn' | 'random_forest' | 'ensemble' = 'knn'
): Promise<RecommendationResult> => {
  const response = await axiosInstance.get('/cf/recommendations', {
    params: { limit, method, model }
  });
  
  if (response.status === 200) {
    return response.data;
  }
  
  throw new Error('Failed to get recommendations');
};

export const getRecommendedEvents = async (): Promise<any> => {
  const response = await axiosInstance.get('/events/recommendations/for-me');
  return response.data;
};

export const recordInteraction = async (eventId: string, type: 'view' | 'register' | 'attend'): Promise<void> => {
  try {
    await axiosInstance.post(`/cf/interaction/${eventId}/${type}`);
  } catch (error) {
    console.warn('Failed to track interaction:', error);
  }
};

export const predictAttendance = async (eventIds: string[]): Promise<AttendancePrediction[]> => {
  const response = await axiosInstance.post('/cf/predict/attendance', {
    eventIds,
    model: 'random_forest'
  });
  
  return response.data.predictions || [];
};

export const compareModels = async (limit: number = 5): Promise<any> => {
  const response = await axiosInstance.get('/cf/recommendations/compare', {
    params: { limit, method: 'hybrid' }
  });
  
  return response.data;
};