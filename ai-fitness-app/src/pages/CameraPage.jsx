import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from '../components/common/Header';
import Camera from '../components/CameraPage/Camera';
import Projector from '../components/CameraPage/Projector';
import poses from '../data/poses';
import { useAppContext } from '../context/AppContext';

const CameraPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectPose, currentPose } = useAppContext();
  
  // Find the pose data based on the ID parameter
  const pose = poses.find(p => p.id === parseInt(id));
  
  // Update the current pose in context
  useEffect(() => {
    if (pose) {
      selectPose(pose);
    } else {
      // If no pose found, redirect to home
      navigate('/');
    }
    
    // Cleanup on unmount - reset the camera state
    return () => {
      // Any cleanup here
    };
  }, [pose, selectPose, navigate]);
  
  if (!pose) {
    return null; // Will redirect in the effect
  }
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.900', width: '100%' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 3, px: { xs: 1, sm: 2, md: 3 }, maxWidth: '100%' }}>
        <Camera />
        <Projector />
      </Container>
    </Box>
  );
};

export default CameraPage;