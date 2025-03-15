from utils.math_utils import calculate_angle

import eventlet
eventlet.monkey_patch()

from flask import Flask, Response
from flask_socketio import SocketIO
import cv2
import mediapipe as mp

app = Flask(__name__)
socketio = SocketIO(app)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

def generate_frames():
    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                     landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
            knee_angle = calculate_angle(hip, knee, ankle)
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            cv2.putText(frame, f'Knee Angle: {int(knee_angle)} degrees', (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
            if knee_angle > 130:
                socketio.emit('posture_alert', {'message': 'Your hip is too high!'})
            elif knee_angle < 90:
                socketio.emit('posture_alert', {'message': 'Your hip is too low!'})
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cap.release()

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    socketio.run(app, debug=True)

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