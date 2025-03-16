import { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State for camera and projector
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isProjectorOn, setIsProjectorOn] = useState(false);
  
  // State for pose detection
  const [currentPose, setCurrentPose] = useState(null);
  const [keypoints, setKeypoints] = useState([]);
  const [angles, setAngles] = useState({});
  const [feedback, setFeedback] = useState([]);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Shutdown projector service if it's running when the app unmounts
      if (isProjectorOn) {
        apiService.shutdownProjector().catch(err => {
          console.error('Error shutting down projector:', err);
        });
      }
    };
  }, [isProjectorOn]);
  
  // Toggle camera on/off
  const toggleCamera = () => {
    const newState = !isCameraOn;
    setIsCameraOn(newState);
    
    // If camera is turned off, also turn off the projector
    if (!newState && isProjectorOn) {
      setIsProjectorOn(false);
    }
  };
  
  // Toggle projector on/off
  const toggleProjector = () => {
    // Projector can only be on if camera is on
    if (isCameraOn) {
      setIsProjectorOn(!isProjectorOn);
    } else {
      console.warn("Cannot turn on projector while camera is off");
    }
  };
  
  // Update pose data
  const updatePoseData = (poseData) => {
    if (poseData) {
      const { keypoints, angles, feedback } = poseData;
      setKeypoints(keypoints || []);
      setAngles(angles || {});
      setFeedback(feedback || []);
    }
  };
  
  // Set the current pose being performed
  const selectPose = (pose) => {
    setCurrentPose(pose);
  };
  
  // Reset all pose data
  const resetPoseData = () => {
    setKeypoints([]);
    setAngles({});
    setFeedback([]);
  };

  return (
    <AppContext.Provider
      value={{
        isCameraOn,
        isProjectorOn,
        currentPose,
        keypoints,
        angles,
        feedback,
        toggleCamera,
        toggleProjector,
        updatePoseData,
        selectPose,
        resetPoseData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);