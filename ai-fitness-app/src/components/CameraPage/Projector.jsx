import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import { useSpring, animated } from '@react-spring/web';

const AnimatedBox = animated(Box);

const Projector = () => {
  const { isProjectorOn } = useAppContext();
  
  const projectorSpring = useSpring({
    opacity: isProjectorOn ? 1 : 0,
    transform: isProjectorOn ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 280, friction: 20 }
  });
  
  // Nothing to render if projector is off
  if (!isProjectorOn) {
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
        Projector Active
      </Typography>
      
      <Typography variant="caption" display="block">
        The projector is running in a separate window. Please check your browser tabs if you don't see it.
      </Typography>
    </AnimatedBox>
  );
};

export default Projector;