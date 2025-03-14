import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import apiService from '../../services/api';
import { useSpring, animated } from '@react-spring/web';

const AnimatedBox = animated(Box);

const Projector = () => {
  const { isProjectorOn, currentPose } = useAppContext();
  const [standardPose, setStandardPose] = useState(null);
  const [error, setError] = useState(null);
  
  const projectorSpring = useSpring({
    opacity: isProjectorOn && standardPose ? 1 : 0,
    transform: isProjectorOn && standardPose ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 280, friction: 20 }
  });
  
  // Fetch standard pose data when projector is turned on
  useEffect(() => {
    const fetchStandardPose = async () => {
      if (isProjectorOn && currentPose) {
        try {
          // In a real app, this would fetch from the API
          // const data = await apiService.getStandardPose(currentPose.id);
          
          // For now, use mock data
          setStandardPose({
            keypoints: [
              { id: 'nose', x: 0.5, y: 0.1 },
              { id: 'left_shoulder', x: 0.4, y: 0.2 },
              { id: 'right_shoulder', x: 0.6, y: 0.2 },
              { id: 'left_elbow', x: 0.3, y: 0.3 },
              { id: 'right_elbow', x: 0.7, y: 0.3 },
              { id: 'left_wrist', x: 0.25, y: 0.4 },
              { id: 'right_wrist', x: 0.75, y: 0.4 },
              { id: 'left_hip', x: 0.45, y: 0.5 },
              { id: 'right_hip', x: 0.55, y: 0.5 },
              { id: 'left_knee', x: 0.4, y: 0.7 },
              { id: 'right_knee', x: 0.6, y: 0.7 },
              { id: 'left_ankle', x: 0.4, y: 0.9 },
              { id: 'right_ankle', x: 0.6, y: 0.9 },
            ],
            angles: currentPose.evaluation.standardAngles
          });
          setError(null);
        } catch (err) {
          console.error('Error fetching standard pose:', err);
          setError('Failed to load standard pose reference');
          setStandardPose(null);
        }
      } else {
        setStandardPose(null);
      }
    };
    
    fetchStandardPose();
  }, [isProjectorOn, currentPose]);
  
  // Nothing to render if projector is off or no standard pose data
  if (!isProjectorOn || !standardPose) {
    return null;
  }
  
  return (
    <AnimatedBox
      style={projectorSpring}
      sx={{
        position: 'absolute',
        top: 2,
        right: 2,
        maxWidth: 250,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        p: 2,
        borderRadius: 1,
        zIndex: 10
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
        Reference Pose
      </Typography>
      
      {error ? (
        <Typography variant="caption" color="error.light">
          {error}
        </Typography>
      ) : (
        <>
          <Typography variant="caption" display="block" mb={1}>
            Follow the standard pose reference:
          </Typography>
          
          <Grid container spacing={1}>
            {Object.entries(standardPose.angles).map(([joint, angle]) => (
              <Grid item xs={6} key={joint}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">{joint}:</Typography>
                  <Typography variant="caption" sx={{ color: 'success.light' }}>
                    {angle}° (target)
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </AnimatedBox>
  );
};

export default Projector;