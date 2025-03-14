# Frontend Technical Guide

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Testing Guide

1. Use Chrome browser (recommended for camera access)
2. Test flow:
   - Browse exercise list
   - Select any exercise
   - Allow camera access
   - Check skeleton overlay
   - Verify feedback display
   - Test completion flow

## Key Components

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

### Technical Notes
- Using mock data for pose detection (see `api.js`)
- Camera indicator is browser-controlled
- Projector API endpoints ready for backend integration

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

