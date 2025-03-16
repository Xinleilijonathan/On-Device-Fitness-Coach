from utils.math_utils import calculate_angle

import eventlet
eventlet.monkey_patch()

from flask import Flask, Response
from flask_socketio import SocketIO
import cv2
import mediapipe as mp
import pyttsx3
import threading
import requests

engine = pyttsx3.init()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Global variable for latest alert
latest_alert = None

def announce_feedback(feedback):
    def run_speech():
      engine.say(feedback)
      engine.runAndWait()

    # Start a new thread for audio playback
    thread = threading.Thread(target=run_speech)
    thread.daemon = True  # Daemon thread exits when main program exits
    thread.start()

def generate_frames():
    global latest_alert
    cap = cv2.VideoCapture(0)
    squat_count = 0
    squat_in_progress = False
    added_count = False
    knee_angle_threshold = 90
    knee_angle_threshold_low = 70
    hip_angle_threshold = 130
    hip_angle_threshold_high = 170

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
            shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]

            knee_angle = calculate_angle(hip, knee, ankle)
            hip_angle = calculate_angle(knee, hip, shoulder)
            
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            cv2.putText(frame, f'Knee Angle: {int(knee_angle)} degrees', (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
            cv2.putText(frame, f'Hip Angle: {int(hip_angle)} degrees', (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
            cv2.putText(frame, f'Squat Count: {squat_count}', (10, 90),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
            
            feedback = None
            # Handle alerts and draw them on the video feed
            if hip_angle > hip_angle_threshold_high:
                requests.post("http://127.0.0.1:5000/api/set_image", json={"image": "base2"})   # stand
            elif knee_angle >= knee_angle_threshold:
                requests.post("http://127.0.0.1:5000/api/set_image", json={"image": "base2"})   # null

            if hip_angle < hip_angle_threshold and not squat_in_progress:
                squat_in_progress = True
            elif hip_angle >= hip_angle_threshold and squat_in_progress:
                squat_in_progress = False
                if not added_count:
                    latest_alert = "Your were not bending enough!"
                    announce_feedback(latest_alert)
                added_count = False

            if squat_in_progress:
                if knee_angle < knee_angle_threshold and not added_count:
                    squat_count += 1
                    added_count = True

                    requests.post("http://127.0.0.1:5000/api/set_image", json={"image": "base2"})   # squat img

                    latest_alert = "Perfect squat!"
                    announce_feedback(latest_alert)
                elif knee_angle < knee_angle_threshold_low and latest_alert != "Your squat is too deep!":
                    latest_alert = "Your squat is too deep!"
                    announce_feedback(latest_alert)

        # Display alert on the video
        if latest_alert:
            cv2.putText(frame, latest_alert, (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

        # Resize the frame
        height, width, _ = frame.shape
        new_width = 700  
        new_height = int(height * new_width / width)
        frame = cv2.resize(frame, (new_width, new_height))

        # Encode frame and send it
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
