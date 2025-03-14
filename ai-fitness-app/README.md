# AI Fitness Coach - Frontend

Real-time AI fitness coach that detects your pose and provides instant feedback for exercise form correction.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will run at `http://localhost:5173`

## Testing the App

1. Open the app in Chrome (recommended)
2. Click through exercises in the action list
3. Try the camera feature:
   - Allow camera access when prompted
   - You'll see a skeleton overlay on your body
   - Real-time feedback will appear on screen
   - Click "Complete Exercise" when done

## Current Features
- Exercise list and details
- Camera-based pose detection (using mock data for now)
- Real-time skeleton visualization
- Exercise completion tracking

## For Developers

### Project Structure
```
src/
├── components/         # UI components
├── pages/             # Main pages
├── services/          # API calls (mock data for now)
└── hooks/             # Custom React hooks
```

### Important Files
- `src/services/api.js` - Mock API data (will connect to backend later)
- `src/components/CameraPage/` - Camera and pose detection
- `src/components/CameraPage/PoseDetection.jsx` - Skeleton visualization

### Notes
- Currently using mock data for pose detection
- Camera might show red indicator even when "off" (browser feature)
- External projector support is prepared but needs backend

## Need Help?
Contact: [Team Member Name/Contact]
