import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Paper, Divider } from '@mui/material';
import { Camera } from '@mui/icons-material';
import Button from '../common/Button';
import { useAppContext } from '../../context/AppContext';
import PoseVideo from './PoseVideo';
import { useSpring, animated } from '@react-spring/web';

const AnimatedCard = animated(Card);
const AnimatedTypography = animated(Typography);

const PoseInfo = ({ pose }) => {
  const navigate = useNavigate();
  const { selectPose } = useAppContext();
  
  const cardSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });
  
  if (!pose) {
    return <Typography variant="h6">Pose not found</Typography>;
  }
  
  const { name, instruction, evaluation, video } = pose;
  
  const handleOpenCamera = () => {
    selectPose(pose);
    navigate(`/camera/${pose.id}`);
  };
  
  return (
    <Box py={3}>
      <AnimatedCard style={cardSpring}>
        <PoseVideo videoSrc={video} poseName={name} />
        
        <CardContent sx={{ p: 3 }}>
          <Box mb={3}>
            <AnimatedTypography 
              variant="h5" 
              component="h3" 
              gutterBottom 
              fontWeight="medium"
              sx={{ mb: 2 }}
            >
              Instructions
            </AnimatedTypography>
            <List>
              {instruction.map((step, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText primary={`${index + 1}. ${step}`} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box mb={3}>
            <Typography variant="h5" component="h3" gutterBottom fontWeight="medium" sx={{ mb: 2 }}>
              Evaluation Criteria
            </Typography>
            <List>
              {evaluation.keyPoints.map((point, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText primary={`• ${point}`} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box mb={3}>
            <Typography variant="h5" component="h3" gutterBottom fontWeight="medium" sx={{ mb: 2 }}>
              Standard Angles
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
              <List dense>
                {Object.entries(evaluation.standardAngles).map(([joint, angle]) => (
                  <ListItem key={joint} sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography>
                          <Box component="span" fontWeight="medium">{joint}</Box>: {angle}°
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
          
          <Button 
            onClick={handleOpenCamera}
            fullWidth
            icon={<Camera />}
            sx={{ mt: 2 }}
          >
            Open Camera
          </Button>
        </CardContent>
      </AnimatedCard>
    </Box>
  );
};

export default PoseInfo;