import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import apiService from '../../services/api';
import { useSpring, animated } from '@react-spring/web';

// Define pose connections for visualization
const POSE_CONNECTIONS = [
  // Face
  ['nose', 'left_eye'],
  ['nose', 'right_eye'],
  ['left_eye', 'left_ear'],
  ['right_eye', 'right_ear'],
  // Upper body
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_elbow', 'right_wrist'],
  // Torso
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  // Lower body
  ['left_hip', 'left_knee'],
  ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'],
  ['right_knee', 'right_ankle']
];

const PoseDetection = () => {
  const { 
    isCameraOn,
    currentPose,
    updatePoseData
  } = useAppContext();
  
  const svgRef = useRef(null);
  const frameRef = useRef(null);
  
  const svgSpring = useSpring({
    opacity: 1, // Always show the visualization
    config: { tension: 280, friction: 20 }
  });

  // Process video frame and detect pose
  const processFrame = async (videoElement, canvasElement) => {
    if (!videoElement || !canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    try {
      // For testing: Use mock data
      const poseData = apiService.mockDetectPose();
      updatePoseData(poseData);
      
      // When ready for production, uncomment this:
      // const imageData = canvasElement.toDataURL('image/jpeg', 0.8);
      // const poseData = await apiService.detectPose(imageData);
      // updatePoseData(poseData);
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  };

  // Set up continuous frame processing
  useEffect(() => {
    const runPoseDetection = () => {
      const videoElement = document.querySelector('video');
      const canvasElement = document.querySelector('canvas');
      
      if (videoElement && canvasElement) {
        processFrame(videoElement, canvasElement);
      }
      
      frameRef.current = requestAnimationFrame(runPoseDetection);
    };

    // Start with mock data immediately
    const mockData = apiService.mockDetectPose();
    updatePoseData(mockData);

    if (isCameraOn) {
      frameRef.current = requestAnimationFrame(runPoseDetection);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isCameraOn]);

  // Render pose visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const poseData = currentPose?.poseData || apiService.mockDetectPose();

    if (!poseData?.keypoints) return;

    // Clear previous drawings
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const svgWidth = svg.clientWidth;
    const svgHeight = svg.clientHeight;

    // Draw connections
    POSE_CONNECTIONS.forEach(([start, end]) => {
      const startPoint = poseData.keypoints.find(kp => kp.id === start);
      const endPoint = poseData.keypoints.find(kp => kp.id === end);

      if (startPoint && endPoint) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startPoint.x * svgWidth);
        line.setAttribute('y1', startPoint.y * svgHeight);
        line.setAttribute('x2', endPoint.x * svgWidth);
        line.setAttribute('y2', endPoint.y * svgHeight);
        line.setAttribute('stroke', '#3B82F6');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
      }
    });

    // Draw keypoints
    poseData.keypoints.forEach(point => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x * svgWidth);
      circle.setAttribute('cy', point.y * svgHeight);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#3B82F6');
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);
    });
  }, [currentPose]);

  return (
    <animated.svg
      ref={svgRef}
      style={{
        ...svgSpring,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
};

export default PoseDetection;