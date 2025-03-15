import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import io from 'socket.io-client';

const PoseDetection = () => {
  const [alert, setAlert] = useState('');
  const [showVideo, setShowVideo] = useState(true);
  const [exerciseMetrics, setExerciseMetrics] = useState({
    kneeAngle: 0,
    hipAngle: 0,
    squatCount: 0,
    currentFeedback: ''
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket instance
    const socket = io('http://localhost:8000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      path: '/socket.io'
    });

    // Connection handlers
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Data handlers
    socket.on('exercise_metrics', (data) => {
      console.log('Received metrics:', data);
      setExerciseMetrics(prev => ({
        ...prev,
        kneeAngle: data.kneeAngle,
        hipAngle: data.hipAngle,
        squatCount: data.squatCount
      }));
    });

    socket.on('posture_alert', (data) => {
      console.log('Received alert:', data);
      setAlert(data.message);
      setExerciseMetrics(prev => ({
        ...prev,
        currentFeedback: data.message
      }));
      setTimeout(() => setAlert(''), 3000);
    });

    // Connect to the server
    socket.connect();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('exercise_metrics');
        socket.off('posture_alert');
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Video Feed */}
      {showVideo && (
        <div className="relative w-full max-w-4xl mx-auto">
          <img
            src="http://localhost:8000/video_feed"
            alt="Video Feed"
            className="w-full object-contain"
            style={{ backgroundColor: 'black' }}
          />
        </div>
      )}

      {/* Connection Status */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: isConnected ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)',
          color: 'white',
          p: 1,
          borderRadius: 1,
          zIndex: 10,
          fontSize: '0.8rem'
        }}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </Box>

      {/* Real-time Feedback Display */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          p: 2,
          borderRadius: 2,
          zIndex: 10,
          minWidth: '250px'
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, color: '#4CAF50' }}>
          Real-Time Feedback
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Knee Angle: {exerciseMetrics.kneeAngle}°
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 0.5 }}>
          Hip Angle: {exerciseMetrics.hipAngle}°
        </Typography>
        
        <Typography variant="h6" sx={{ mt: 1, color: '#4CAF50' }}>
          Count: {exerciseMetrics.squatCount}
        </Typography>
        
        {exerciseMetrics.currentFeedback && (
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 1, 
              color: exerciseMetrics.currentFeedback.includes('Good') ? '#4CAF50' : '#ff9800',
              fontWeight: 'bold'
            }}
          >
            {exerciseMetrics.currentFeedback}
          </Typography>
        )}
      </Paper>

      {/* Alert */}
      {alert && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(248, 215, 218, 0.9)',
            color: '#721c24',
            p: 2,
            borderRadius: 2,
            maxWidth: '80%',
            border: '1px solid #f5c6cb',
            zIndex: 10
          }}
        >
          <Typography>
            {alert}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default PoseDetection;