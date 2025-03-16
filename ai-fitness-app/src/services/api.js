import axios from 'axios';

// Configuration
const API_BASE_URL = '/api'; // Use relative URL for proxy to handle CORS

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for testing
const mockPoseData = {
  keypoints: [
    { id: 'nose', x: 0.5, y: 0.1 },
    { id: 'left_eye', x: 0.45, y: 0.1 },
    { id: 'right_eye', x: 0.55, y: 0.1 },
    { id: 'left_ear', x: 0.4, y: 0.12 },
    { id: 'right_ear', x: 0.6, y: 0.12 },
    { id: 'left_shoulder', x: 0.4, y: 0.25 },
    { id: 'right_shoulder', x: 0.6, y: 0.25 },
    { id: 'left_elbow', x: 0.3, y: 0.4 },
    { id: 'right_elbow', x: 0.7, y: 0.4 },
    { id: 'left_wrist', x: 0.25, y: 0.55 },
    { id: 'right_wrist', x: 0.75, y: 0.55 },
    { id: 'left_hip', x: 0.45, y: 0.6 },
    { id: 'right_hip', x: 0.55, y: 0.6 },
    { id: 'left_knee', x: 0.4, y: 0.75 },
    { id: 'right_knee', x: 0.6, y: 0.75 },
    { id: 'left_ankle', x: 0.4, y: 0.9 },
    { id: 'right_ankle', x: 0.6, y: 0.9 }
  ],
  angles: {
    'left-shoulder': 90,
    'right-shoulder': 88,
    'left-elbow': 170,
    'right-elbow': 168,
    'left-hip': 175,
    'right-hip': 173,
    'left-knee': 178,
    'right-knee': 176
  },
  feedback: [
    
  ]
};

// API service functions
const apiService = {
  // Check projector status
  getProjectorStatus: async () => {
    try {
      const response = await apiClient.get('/status');
      return response.data;
    } catch (error) {
      console.error('Error getting projector status:', error);
      throw error;
    }
  },

  // Start the projector calibration service
  startProjector: async () => {
    try {
      // Open the projector in a new window
      window.open('http://127.0.0.1:5000', '_blank');
      return { success: true };
    } catch (error) {
      console.error('Error starting projector:', error);
      throw error;
    }
  },
  
  // Stop the projector calibration service
  stopProjector: async () => {
    try {
      // For stopping, we'll try to use the shutdown endpoint
      const response = await axios.get('/shutdown');
      return { success: true };
    } catch (error) {
      console.error('Error stopping projector:', error);
      // Even if there's an error, we'll return success since the window might have been closed manually
      return { success: true };
    }
  },
  
  // Shutdown the projector service completely
  shutdownProjector: async () => {
    try {
      // The shutdown endpoint is at the root level
      const response = await axios.get('/shutdown');
      return { success: true };
    } catch (error) {
      console.error('Error shutting down projector:', error);
      // Even if there's an error, we'll return success since the window might have been closed manually
      return { success: true };
    }
  },
  
  // Adjust projector overlay settings
  adjustProjectorOverlay: async (settings) => {
    try {
      const response = await apiClient.post('/set_overlay', {
        overlay_enabled: true,
        ...settings
      });
      return { success: true };
    } catch (error) {
      console.error('Error adjusting projector overlay:', error);
      throw error;
    }
  },
  
  // Adjust projector base image settings
  adjustProjectorBase: async (settings) => {
    try {
      const response = await apiClient.post('/api/set_base', settings);
      return { success: true };
    } catch (error) {
      console.error('Error adjusting projector base:', error);
      throw error;
    }
  },

  // Get real-time pose detection from MediaPipe backend
  detectPose: async (imageData) => {
    try {
      const response = await apiClient.post('/pose/detect', {
        image: imageData
      });
      return response.data;
    } catch (error) {
      console.error('Error detecting pose:', error);
      throw error;
    }
  },

  // Mock function for testing without backend
  mockDetectPose: () => {
    // Return stable mock data without random variations
    return mockPoseData;
  }
};

export default apiService;