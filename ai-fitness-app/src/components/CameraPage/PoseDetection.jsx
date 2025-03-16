// import React, { useEffect, useState } from "react";

// const PoseDetection = () => {
//   const [alert, setAlert] = useState("");

//   return (
//     <div className="relative">
//       {/* Video Feed */}
//       <div>
//         <img src="http://127.0.0.1:5000/video_feed" alt="Video Feed" />
//       </div>
//     </div>
//   );
// };

// export default PoseDetection;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Box, Card, CardContent, Stack, Typography, CircularProgress } from '@mui/material';
import { Cast, CastConnected, CheckCircle } from '@mui/icons-material';
import Button from '../common/Button';
import { useSpring, animated } from '@react-spring/web';
import apiService from '../../services/api';

const AnimatedCard = animated(Card);

const PoseDetection = () => {
  const [showVideo, setShowVideo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const projectorWindowRef = useRef(null);

  const [alert, setAlert] = useState("");
  
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
  
  // // Clean up projector on component unmount
  // useEffect(() => {
  //   return () => {
  //     if (isProjectorOn && projectorWindowRef.current) {
  //       // Try to close the projector window if it's still open
  //       try {
  //         projectorWindowRef.current.close();
  //       } catch (err) {
  //         console.error('Error closing projector window:', err);
  //       }
  //       projectorWindowRef.current = null;
  //     }
  //   };
  // }, [isProjectorOn]);
  
  // Handle projector toggle
  const handleProjectorToggle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isProjectorOn) {
        // Start the projector by opening a new window
        const result = await apiService.startProjector();
        if (result.success) {
          // Store the reference to the opened window
          projectorWindowRef.current = window.open('http://127.0.0.1:5000', '_blank');
          
          // Check if the window was blocked by a popup blocker
          if (!projectorWindowRef.current || projectorWindowRef.current.closed || typeof projectorWindowRef.current.closed === 'undefined') {
            setError('Popup blocked! Please allow popups for this site to use the projector.');
            return;
          }
        }
      } else {
        // Stop the projector
        if (projectorWindowRef.current) {
          try {
            projectorWindowRef.current.close();
          } catch (err) {
            console.error('Error closing projector window:', err);
          }
          projectorWindowRef.current = null;
        }
        await apiService.stopProjector();
      }
      
      // Update the UI state
      toggleProjector();
    } catch (error) {
      console.error('Error toggling projector:', error);
      setError('Failed to toggle projector. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteExercise = () => {
    // If projector is on, close the window before navigating
    if (isProjectorOn && projectorWindowRef.current) {
      try {
        projectorWindowRef.current.close();
      } catch (err) {
        console.error('Error closing projector window:', err);
      }
      projectorWindowRef.current = null;
      apiService.shutdownProjector().catch(err => {
        console.error('Error shutting down projector:', err);
      });
    }
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
              disabled={isLoading}
            >
              Complete Exercise
            </Button>
            
            <Button
              onClick={handleProjectorToggle}
              variant={isProjectorOn ? 'secondary' : 'outline'}
              icon={isLoading ? <CircularProgress size={24} color="inherit" /> : (isProjectorOn ? <CastConnected /> : <Cast />)}
              disabled={isLoading}
            >
              {isLoading 
                ? 'Processing...' 
                : (isProjectorOn ? 'Turn Off Projector' : 'Turn On Projector')}
            </Button>
          </Stack>
          
          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ mt: 1, textAlign: 'center' }}
            >
              {error}
            </Typography>
          )}
          
          {isProjectorOn && (
            <Typography 
              variant="body2" 
              sx={{ mt: 1, textAlign: 'center', color: 'success.main' }}
            >
              Projector is active in a separate window. If you don't see it, check your popup blocker.
            </Typography>
          )}
        </CardContent>
        
        {/* Video Feed */}
        <div>
          <img src="http://127.0.0.1:5000/video_feed" alt="Video Feed" />
        </div>
      </AnimatedCard>
    </Box>
  );
};

export default PoseDetection;
