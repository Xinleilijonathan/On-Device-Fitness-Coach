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

// API service functions
const apiService = {
  // Send image frame to backend for pose detection
  detectPose: async (imageData, poseType) => {
    try {
      const response = await apiClient.post('/detect-pose', {
        image: imageData,
        poseType: poseType
      });
      return response.data;
    } catch (error) {
      console.error('Error in pose detection:', error);
      throw error;
    }
  },
  
  // Control projector
  controlProjector: async (isOn) => {
    try {
      const response = await apiClient.post('/projector', {
        isOn: isOn
      });
      return response.data;
    } catch (error) {
      console.error('Error controlling projector:', error);
      throw error;
    }
  },
  
  // Get standard pose reference data
  getStandardPose: async (poseId) => {
    try {
      const response = await apiClient.get(`/standard-pose/${poseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching standard pose:', error);
      throw error;
    }
  },
  
  // Mock function to simulate pose detection (for testing without backend)
  mockDetectPose: (poseType) => {
    // Sample keypoints for testing
    const keypoints = [
      { id: 'nose', x: 0.5, y: 0.1 },
      { id: 'left_shoulder', x: 0.4, y: 0.2 },
      { id: 'right_shoulder', x: 0.6, y: 0.2 },
      { id: 'left_elbow', x: 0.3, y: 0.3 },
      { id: 'right_elbow', x: 0.7, y: 0.3 },
      { id: 'left_wrist', x: 0.25, y: 0.4 },
      { id: 'right_wrist', x: 0.75, y: 0.4 },
      { id: 'left_hip', x: 0.45, y: 0.5 },
      { id: 'right_hip', x: 0.55, y: 0.5 },
      { id: 'left_knee', x: 0.4, y: 0.7 },
      { id: 'right_knee', x: 0.6, y: 0.7 },
      { id: 'left_ankle', x: 0.4, y: 0.9 },
      { id: 'right_ankle', x: 0.6, y: 0.9 },
    ];
    
    // Sample angles for testing
    const angles = {
      'knee-joint': 100,  // Slightly off from ideal 90° for squat
      'hip-joint': 50,
      'ankle-joint': 65,
      'elbow-joint': 85,
      'shoulder-joint': 160,
    };
    
    // Sample feedback based on pose type
    let feedback = [];
    if (poseType === 'Squat') {
      feedback = ['Knee-joint angle is too large (100°), please squat lower', 'Keep your back straight'];
    } else if (poseType === 'Plank') {
      feedback = ['Lower your hips to maintain a straight line', 'Keep your core engaged'];
    } else {
      feedback = ['Maintain proper form', 'Keep movements controlled'];
    }
    
    return {
      keypoints,
      angles,
      feedback,
      accuracy: 0.85,
    };
  }
};

export default apiService;