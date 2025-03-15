import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Box, Card, CardContent, Stack } from '@mui/material';
import { Cast, CastConnected, CheckCircle } from '@mui/icons-material';
import Button from '../common/Button';
import { useSpring, animated } from '@react-spring/web';
import apiService from '../../services/api';

const AnimatedCard = animated(Card);

const PoseDetection = () => {
  const [showVideo, setShowVideo] = useState(true); 
  
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    isProjectorOn, 
    toggleProjector
  } = useAppContext();
  
  const cardSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });
  
  // Handle projector toggle
  const handleProjectorToggle = async () => {
    try {
      // Call the API to control the external projector
      await apiService.toggleProjector(!isProjectorOn);
      // Update the UI state
      toggleProjector();
    } catch (error) {
      console.error('Error toggling projector:', error);
    }
  };

  const handleCompleteExercise = () => {
    navigate(`/completion/${id}`);
  };
  
  return (
    <Box py={3} sx={{ width: '100%' }}>
      <AnimatedCard style={cardSpring} sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
        <CardContent sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
            <Button
              onClick={handleCompleteExercise}
              variant="primary"
              icon={<CheckCircle />}
              sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
            >
              Complete Exercise
            </Button>
            
            <Button
              onClick={handleProjectorToggle}
              variant={isProjectorOn ? 'secondary' : 'outline'}
              icon={isProjectorOn ? <CastConnected /> : <Cast />}
            >
              {isProjectorOn ? 'Turn Off Projector' : 'Turn On Projector'}
            </Button>
          </Stack>
        </CardContent>
        
        {/* Video Feed */}
        {showVideo && (
          <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'black' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src="http://localhost:5000/video_feed"
                alt="Video Feed"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
          </Box>
        )}
      </AnimatedCard>
    </Box>
  );
};

export default PoseDetection;
// import React, { useEffect, useState } from 'react';
// import { Paper, Typography, Box } from '@mui/material';
// import io from 'socket.io-client';

// const PoseDetection = () => {
//   const [alert, setAlert] = useState('');
//   const [showVideo, setShowVideo] = useState(true);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     // Create socket instance
//     const socket = io('http://localhost:5000', {
//       transports: ['websocket', 'polling'],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       path: '/socket.io'
//     });

//     // Connection handlers
//     socket.on('connect', () => {
//       console.log('Connected to WebSocket server');
//       setIsConnected(true);
//     });

//     socket.on('disconnect', () => {
//       console.log('Disconnected from WebSocket server');
//       setIsConnected(false);
//     });

//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       setIsConnected(false);
//     });


//     socket.on('posture_alert', (data) => {
//       console.log('Received alert:', data);
//       setAlert(data.message);
//       setTimeout(() => setAlert(''), 3000);
//     });

//     // Connect to the server
//     socket.connect();

//     // Cleanup on unmount
//     return () => {
//       if (socket) {
//         socket.off('connect');
//         socket.off('disconnect');
//         socket.off('connect_error');
//         socket.off('exercise_metrics');
//         socket.off('posture_alert');
//         socket.disconnect();
//       }
//     };
//   }, []);

//   return (
//     <div className="relative">
//       {/* Show the alert if it exists */}
//       {alert && (
//         <div style={{
//           backgroundColor: '#f8d7da',
//           color: '#721c24',
//           padding: '10px',
//           marginBottom: '15px',
//           border: '1px solid #f5c6cb',
//           borderRadius: '5px'
//         }}>
//           {alert}
//         </div>
//       )}

//       {/* Video Feed */}
//       {showVideo && (
//         <div className="relative w-full mx-auto">
//           <img
//             src="http://localhost:5000/video_feed"
//             alt="Video Feed"
//             className="w-full object-contain"
//             style={{ backgroundColor: 'black' }}
//           />
//         </div>
//       )}

//       {/* Connection Status */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: 16,
//           right: 16,
//           bgcolor: isConnected ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)',
//           color: 'white',
//           p: 1,
//           borderRadius: 1,
//           zIndex: 10,
//           fontSize: '0.8rem'
//         }}
//       >
//         {isConnected ? 'Connected' : 'Disconnected'}
//       </Box>
//     </div>
//   );
// };

// export default PoseDetection;