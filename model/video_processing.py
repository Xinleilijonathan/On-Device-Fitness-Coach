from utils.math_utils import calculate_angle

import eventlet
eventlet.monkey_patch()

from flask import Flask, Response
from flask_socketio import SocketIO
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Initialize MediaPipe Pose with more permissive settings
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
    enable_segmentation=False,
)
mp_drawing = mp.solutions.drawing_utils

# Custom drawing specs with increased visibility
custom_landmark_drawing_spec = mp_drawing.DrawingSpec(
    color=(0, 255, 0),  # Bright green color for landmarks
    thickness=5,        # Increased thickness
    circle_radius=8     # Larger circles
)

custom_connection_drawing_spec = mp_drawing.DrawingSpec(
    color=(255, 255, 0),  # Yellow color for connections
    thickness=4           # Thicker lines
)

def draw_angle(image, point1, point2, point3, angle, color=(255, 255, 255)):
    """Draw the angle between three points"""
    # Convert normalized coordinates to pixel coordinates
    h, w = image.shape[:2]
    p1 = (int(point1[0] * w), int(point1[1] * h))
    p2 = (int(point2[0] * w), int(point2[1] * h))
    p3 = (int(point3[0] * w), int(point3[1] * h))
    
    # Draw the angle arc
    radius = 50  # Increased radius for better visibility
    vec1 = np.array([p1[0] - p2[0], p1[1] - p2[1]])
    vec2 = np.array([p3[0] - p2[0], p3[1] - p2[1]])
    
    # Normalize vectors
    vec1 = vec1 / (np.linalg.norm(vec1) + 1e-6)  # Added small epsilon to prevent division by zero
    vec2 = vec2 / (np.linalg.norm(vec2) + 1e-6)
    
    # Calculate start and end angles
    angle1 = np.arctan2(vec1[1], vec1[0])
    angle2 = np.arctan2(vec2[1], vec2[0])
    
    # Ensure proper angle direction
    if angle1 < angle2:
        angle1, angle2 = angle2, angle1
    
    # Draw the arc
    cv2.ellipse(image, p2, (radius, radius), 
                -np.degrees(angle1), 
                0, 
                np.degrees(angle1 - angle2), 
                color, 3)  # Increased thickness
    
    # Add angle text with larger font and better visibility
    text_pos = (p2[0] - 20, p2[1] - 20)
    cv2.putText(image, f'{int(angle)}°', text_pos,
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, color, 3)

def generate_frames():
    cap = cv2.VideoCapture(0)
    squat_count = 0
    squat_in_progress = False
    added_count = False
    knee_angle_threshold = 90
    knee_angle_threshold_low = 60
    hip_angle_threshold = 130

    # Set camera resolution higher
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Flip the frame horizontally for a later selfie-view display
        frame = cv2.flip(frame, 1)
        
        # Convert the BGR image to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        # Draw detection status
        status_text = "No pose detected"
        status_color = (0, 0, 255)  # Red

        if results.pose_landmarks:
            status_text = "Pose detected"
            status_color = (0, 255, 0)  # Green

            # Draw the pose landmarks and connections with custom styling
            mp_drawing.draw_landmarks(
                frame, 
                results.pose_landmarks, 
                mp_pose.POSE_CONNECTIONS,
                custom_landmark_drawing_spec,
                custom_connection_drawing_spec
            )

            landmarks = results.pose_landmarks.landmark
            
            # Get key points for squat analysis
            hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]

            # Calculate angles
            knee_angle = calculate_angle(hip, knee, ankle)
            hip_angle = calculate_angle(knee, hip, shoulder)

            # Emit exercise metrics to frontend
            socketio.emit('exercise_metrics', {
                'kneeAngle': int(knee_angle),
                'hipAngle': int(hip_angle),
                'squatCount': squat_count
            })

            # Draw angles with enhanced visibility
            draw_angle(frame, hip, knee, ankle, knee_angle, 
                      (0, 0, 255) if knee_angle < knee_angle_threshold_low else (0, 255, 0))
            draw_angle(frame, knee, hip, shoulder, hip_angle,
                      (0, 0, 255) if hip_angle < hip_angle_threshold else (0, 255, 0))

            # Add status indicators with enhanced visibility
            cv2.putText(frame, f'Squat Count: {squat_count}', (10, 60),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3, cv2.LINE_AA)
            
            if squat_in_progress:
                cv2.putText(frame, 'Squat in Progress', (10, 100),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 3, cv2.LINE_AA)

            # Squat logic
            if hip_angle < hip_angle_threshold and not squat_in_progress:
                squat_in_progress = True
            elif hip_angle >= hip_angle_threshold and squat_in_progress:
                squat_in_progress = False
                if not added_count:
                    socketio.emit('posture_alert', {'message': 'Your knees were not bending enough!'})
                added_count = False

            if squat_in_progress:
                if knee_angle < knee_angle_threshold and not added_count:
                    squat_count += 1
                    added_count = True
                    socketio.emit('posture_alert', {'message': 'Good squat!'})
                if knee_angle < knee_angle_threshold_low:
                    socketio.emit('posture_alert', {'message': 'Your hip is too low!'})

        # Draw detection status
        cv2.putText(frame, status_text, (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, status_color, 3, cv2.LINE_AA)

        # Convert frame to bytes
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cap.release()

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    socketio.emit('posture_alert', {'message': 'Connected to pose detection'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)

"""
react use e.g.

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');  // Change this URL if you deploy to a server

function App() {
  const [alert, setAlert] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Listen for posture alerts from the backend
    socket.on('posture_alert', (data) => {
      setAlert(data.message);
      
      // Hide the alert after 5 seconds
      setTimeout(() => {
        setAlert('');
      }, 5000);  // Alert will disappear after 5 seconds
    });

    return () => {
      socket.off('posture_alert');
    };
  }, []);

  const toggleVideo = () => {
    setShowVideo(!showVideo); // Toggle the video feed visibility
  };

  return (
    <div className="App">
      <h1>Fitness Coach</h1>
      
      {/* Show the alert if it exists */}
      {alert && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          marginBottom: '15px',
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          {alert}
        </div>
      )}

      {/* Video feed toggle button */}
      <button onClick={toggleVideo}>
        {showVideo ? 'Stop Video Feed' : 'Start Video Feed'}
      </button>

      {/* Conditionally render the video feed */}
      {showVideo && (
        <div>
          <h2>Live Video Feed</h2>
          <img
            src="http://localhost:5000/video_feed" // The Flask video stream route
            alt="Video Feed"
            width="640"
            height="480"
          />
        </div>
      )}
    </div>
  );
}

export default App;

"""