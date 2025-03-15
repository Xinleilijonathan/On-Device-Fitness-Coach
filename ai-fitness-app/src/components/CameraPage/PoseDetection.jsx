import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import io from 'socket.io-client';
import { useAppContext } from '../../context/AppContext';

const PoseDetection = ({ isProjectorOn }) => {
  const [alert, setAlert] = useState('');
  const [showVideo, setShowVideo] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [exerciseMetrics, setExerciseMetrics] = useState({
    kneeAngle: 0,
    hipAngle: 0,
    squatCount: 0,
    currentFeedback: '',
  });
  const { currentPose } = useAppContext();

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Connection status handlers
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      setConnectionStatus('Connected');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('Connection error: ' + error.message);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setConnectionStatus('Disconnected');
    });

    socket.on('exercise_metrics', (data) => {
      console.log('Received metrics:', data);
      setExerciseMetrics(prev => ({
        ...prev,
        kneeAngle: data.kneeAngle,
        hipAngle: data.hipAngle,
        squatCount: data.squatCount
      }));
    });

    // Listen for posture alerts
    socket.on('posture_alert', (data) => {
      console.log('Received alert:', data);
      setAlert(data.message);
      setExerciseMetrics(prev => ({
        ...prev,
        currentFeedback: data.message
      }));
      
      // Hide the alert after 5 seconds
      setTimeout(() => {
        setAlert('');
      }, 5000);
    });

    // Connect to the server
    socket.connect();

    // Cleanup on unmount
    return () => {
      socket.off('exercise_metrics');
      socket.off('posture_alert');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      {/* Comprehensive Feedback Display */}
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
          {currentPose?.name || 'Squat'} Exercise
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
            Feedback: {exerciseMetrics.currentFeedback}
          </Typography>
        )}
      </Paper>

      {/* Connection Status */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: connectionStatus.includes('error') ? 'rgba(220, 53, 69, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          p: 2,
          borderRadius: 2,
          zIndex: 10
        }}
      >
        <Typography variant="body2">
          Status: {connectionStatus}
        </Typography>
      </Box>

      {/* Video Feed (includes pose landmarks drawn by backend) */}
      {showVideo && (
        <div className="relative w-full max-w-4xl mx-auto">
          <img
            src="http://localhost:5000/video_feed"
            alt="Video Feed"
            className="w-full aspect-video object-contain rounded-lg border-2 border-blue-500"
            style={{ backgroundColor: 'black' }}
            onError={(e) => {
              console.error('Video feed error:', e);
              e.target.style.backgroundColor = '#ffebee';
            }}
          />
        </div>
      )}

      {/* Alert Display */}
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