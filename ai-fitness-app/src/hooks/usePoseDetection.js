import { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';
import { useAppContext } from '../context/AppContext';

const usePoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [processingFrame, setProcessingFrame] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    isCameraOn, 
    currentPose, 
    updatePoseData, 
    resetPoseData 
  } = useAppContext();
  
  // Initialize camera
  const initCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsInitialized(true);
        setError(null);
      }
    } catch (err) {
      setError(`Camera initialization error: ${err.message}`);
      console.error('Camera initialization error:', err);
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsInitialized(false);
      resetPoseData();
    }
  };
  
  // Process video frame for pose detection
  const processFrame = async () => {
    if (!isInitialized || !videoRef.current || !canvasRef.current || !currentPose || processingFrame) {
      return;
    }
    
    try {
      setProcessingFrame(true);
      
      // Draw the current frame to the canvas
      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(
        videoRef.current,
        0, 0, 
        canvasRef.current.width, 
        canvasRef.current.height
      );
      
      // Get the image data from the canvas
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
      
      // Call the API to detect pose
      // For testing, use mockDetectPose instead of actual API call
      // const poseData = await apiService.detectPose(imageData, currentPose.name);
      const poseData = apiService.mockDetectPose(currentPose.name);
      
      // Update the app state with the detected pose data
      updatePoseData(poseData);
      
    } catch (err) {
      console.error('Error processing frame:', err);
    } finally {
      setProcessingFrame(false);
    }
  };
  
  // Effect to initialize or stop camera based on isCameraOn state
  useEffect(() => {
    if (isCameraOn && !isInitialized) {
      initCamera();
    } else if (!isCameraOn && isInitialized) {
      stopCamera();
    }
    
    return () => {
      if (isInitialized) {
        stopCamera();
      }
    };
  }, [isCameraOn]);
  
  // Effect to process frames at regular intervals when camera is on
  useEffect(() => {
    let frameId;
    
    const runPoseDetection = () => {
      if (isInitialized && isCameraOn && currentPose) {
        processFrame();
      }
      frameId = requestAnimationFrame(runPoseDetection);
    };
    
    if (isInitialized && isCameraOn && currentPose) {
      frameId = requestAnimationFrame(runPoseDetection);
    }
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isInitialized, isCameraOn, currentPose]);
  
  return {
    videoRef,
    canvasRef,
    isInitialized,
    error
  };
};

export default usePoseDetection;