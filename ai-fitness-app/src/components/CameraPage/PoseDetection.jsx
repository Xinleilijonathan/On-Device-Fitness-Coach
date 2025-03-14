import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import { useSpring, animated } from '@react-spring/web';

// Define the skeleton connections for pose visualization
const POSE_CONNECTIONS = [
  ['nose', 'left_eye'], ['nose', 'right_eye'],
  ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
  ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
];

// Joint pairs for angle calculation
const ANGLE_JOINTS = {
  'knee-joint-left': ['left_hip', 'left_knee', 'left_ankle'],
  'knee-joint-right': ['right_hip', 'right_knee', 'right_ankle'],
  'hip-joint-left': ['left_shoulder', 'left_hip', 'left_knee'],
  'hip-joint-right': ['right_shoulder', 'right_hip', 'right_knee'],
  'elbow-joint-left': ['left_shoulder', 'left_elbow', 'left_wrist'],
  'elbow-joint-right': ['right_shoulder', 'right_elbow', 'right_wrist'],
  'shoulder-joint-left': ['left_hip', 'left_shoulder', 'left_elbow'],
  'shoulder-joint-right': ['right_hip', 'right_shoulder', 'right_elbow']
};

const PoseDetection = ({ isProjectorOn }) => {
  const { keypoints, angles, currentPose } = useAppContext();
  const svgRef = useRef(null);
  
  const svgSpring = useSpring({
    opacity: isProjectorOn && keypoints.length > 0 ? 1 : 0,
    config: { tension: 280, friction: 20 }
  });
  
  // Calculate angle between three points (in degrees)
  const calculateAngle = (pointA, pointB, pointC) => {
    const AB = Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
    const BC = Math.sqrt(Math.pow(pointB.x - pointC.x, 2) + Math.pow(pointB.y - pointC.y, 2));
    const AC = Math.sqrt(Math.pow(pointC.x - pointA.x, 2) + Math.pow(pointC.y - pointA.y, 2));
    
    // Law of cosines
    const angleRadians = Math.acos((Math.pow(AB, 2) + Math.pow(BC, 2) - Math.pow(AC, 2)) / (2 * AB * BC));
    return Math.round((angleRadians * 180) / Math.PI);
  };
  
  // Find a keypoint by name
  const findKeypoint = (name) => {
    return keypoints.find(kp => kp.id === name);
  };

  // Render the pose detection visualization
  useEffect(() => {
    if (!svgRef.current || keypoints.length === 0 || !isProjectorOn) {
      return;
    }
    
    const svg = svgRef.current;
    const svgWidth = svg.clientWidth;
    const svgHeight = svg.clientHeight;
    
    // Clear previous elements
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Draw connections (skeleton)
    POSE_CONNECTIONS.forEach(([startId, endId]) => {
      const startPoint = findKeypoint(startId);
      const endPoint = findKeypoint(endId);
      
      if (startPoint && endPoint) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startPoint.x * svgWidth);
        line.setAttribute('y1', startPoint.y * svgHeight);
        line.setAttribute('x2', endPoint.x * svgWidth);
        line.setAttribute('y2', endPoint.y * svgHeight);
        line.setAttribute('stroke', 'white');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
      }
    });
    
    // Draw keypoints
    keypoints.forEach(keypoint => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', keypoint.x * svgWidth);
      circle.setAttribute('cy', keypoint.y * svgHeight);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#3B82F6'); // Primary color
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);
    });
    
    // Draw angles for key joints
    Object.entries(ANGLE_JOINTS).forEach(([jointName, [pointAId, pointBId, pointCId]]) => {
      const pointA = findKeypoint(pointAId);
      const pointB = findKeypoint(pointBId);
      const pointC = findKeypoint(pointCId);
      
      if (pointA && pointB && pointC) {
        // Calculate angle
        const angle = calculateAngle(pointA, pointB, pointC);
        
        // Draw angle text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', pointB.x * svgWidth);
        text.setAttribute('y', pointB.y * svgHeight - 10);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12px');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('stroke', 'black');
        text.setAttribute('stroke-width', '0.5px');
        text.setAttribute('paint-order', 'stroke');
        text.textContent = `${angle}°`;
        
        // Determine if angle is within acceptable range
        const isCorrect = currentPose?.evaluation?.standardAngles?.[jointName.split('-left')[0].split('-right')[0]];
        if (isCorrect) {
          const targetAngle = currentPose.evaluation.standardAngles[jointName.split('-left')[0].split('-right')[0]];
          const tolerance = 15; // Degrees of tolerance
          
          if (Math.abs(angle - targetAngle) <= tolerance) {
            text.setAttribute('fill', '#10B981'); // Green for correct
          } else {
            text.setAttribute('fill', '#EF4444'); // Red for incorrect
          }
        }
        
        svg.appendChild(text);
      }
    });
    
  }, [keypoints, currentPose, isProjectorOn]);
  
  if (!isProjectorOn || keypoints.length === 0) {
    return null;
  }

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