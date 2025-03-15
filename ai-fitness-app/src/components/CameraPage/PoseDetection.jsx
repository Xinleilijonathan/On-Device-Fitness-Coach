import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import io from 'socket.io-client';

const PoseDetection = () => {
  const [alert, setAlert] = useState('');
  const [showVideo, setShowVideo] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket instance
    const socket = io('http://localhost:5000', {
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


    socket.on('posture_alert', (data) => {
      console.log('Received alert:', data);
      setAlert(data.message);
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

      {/* Video Feed */}
      {showVideo && (
        <div className="relative w-full mx-auto">
          <img
            src="http://localhost:5000/video_feed"
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
    </div>
  );
};

export default PoseDetection;