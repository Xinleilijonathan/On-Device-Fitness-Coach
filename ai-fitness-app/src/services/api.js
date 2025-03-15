import axios from 'axios';

// Configuration
const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend API URL

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
  // Control external projector
  toggleProjector: async (isOn) => {
    try {
      const response = await apiClient.post('/projector/control', {
        action: isOn ? 'ON' : 'OFF'
      });
      return response.data;
    } catch (error) {
      console.error('Error controlling projector:', error);
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