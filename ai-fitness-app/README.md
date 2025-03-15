# AI Fitness Coach Frontend

This is the frontend application for the AI Fitness Coach project. It provides real-time pose detection and exercise feedback through a web interface.

## Setup and Running

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- Webcam access

### Backend Setup
1. Create and activate a Python virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Start the backend server:
```bash
cd model
python video_processing.py
```
The backend server will run on http://localhost:8000

### Frontend Setup
1. Install frontend dependencies:
```bash
cd ai-fitness-app
npm install
```

2. Start the development server:
```bash
npm run dev
```
The frontend will be available at http://localhost:5173

## Running Both Services

To run the complete application:

1. First, start the backend server:
```bash
# In terminal 1
cd model
python video_processing.py
```

2. Then, in a new terminal, start the frontend:
```bash
# In terminal 2
cd ai-fitness-app
npm run dev
```

3. Access the application at http://localhost:5173

## Known Issues

1. Video Feed Display Issue:
   - The pose detection landmarks (green dots and yellow lines) are visible when accessing http://localhost:8000/video_feed directly
   - However, these landmarks are not visible when viewing through the frontend at http://localhost:5173/camera/1
   - This is a known issue being investigated

2. WebSocket Connection:
   - Sometimes the WebSocket connection may fail to establish immediately
   - If metrics are not updating, try refreshing the page
   - Check the connection status indicator in the top-right corner

## Troubleshooting

1. If the video feed is not working:
   - Ensure your camera is not being used by another application
   - Check browser permissions for camera access
   - Try accessing http://localhost:8000/video_feed directly to verify backend camera access

2. If real-time metrics are not updating:
   - Check the connection status indicator
   - Ensure both backend and frontend servers are running
   - Check browser console for any WebSocket-related errors

3. Port conflicts:
   - If port 8000 is in use, modify the port in `video_processing.py`
   - If port 5173 is in use, Vite will automatically try the next available port

## Development Setup

1. Install dependencies:
``