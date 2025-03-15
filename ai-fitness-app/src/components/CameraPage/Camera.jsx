import React from 'react';
import PoseDetection from './PoseDetection';

const Camera = () => {
  return <PoseDetection />;
};

export default Camera;
// import React, { useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';
// import usePoseDetection from '../../hooks/usePoseDetection';
// import PoseDetection from './PoseDetection';
// import FeedbackDisplay from './FeedbackDisplay';
// import { Box, Card, CardContent, Typography, Stack, Alert, AlertTitle } from '@mui/material';
// import { Videocam, VideocamOff, Cast, CastConnected, Visibility, CheckCircle } from '@mui/icons-material';
// import Button from '../common/Button';
// import { useSpring, animated } from '@react-spring/web';
// import apiService from '../../services/api';

// const AnimatedCard = animated(Card);

// const Camera = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { 
//     isCameraOn, 
//     isProjectorOn, 
//     toggleCamera, 
//     toggleProjector, 
//     currentPose 
//   } = useAppContext();
  
//   const { videoRef, canvasRef, isInitialized, error } = usePoseDetection();
  
//   const cardSpring = useSpring({
//     from: { opacity: 0, transform: 'translateY(20px)' },
//     to: { opacity: 1, transform: 'translateY(0)' },
//     config: { tension: 280, friction: 20 }
//   });
  
//   // // Auto-start camera when component mounts if it's not already on
//   // useEffect(() => {
//   //   if (!isCameraOn) {
//   //     toggleCamera();
//   //   }
    
//   //   // Cleanup on unmount
//   //   return () => {
//   //     if (isCameraOn) {
//   //       toggleCamera();
//   //     }
//   //   };
//   // }, []);

//   // Handle projector toggle
//   const handleProjectorToggle = async () => {
//     try {
//       // Call the API to control the external projector
//       await apiService.toggleProjector(!isProjectorOn);
//       // Update the UI state
//       toggleProjector();
//     } catch (error) {
//       console.error('Error toggling projector:', error);
//       // show an error message to the user here
//     }
//   };

//   const handleCompleteExercise = () => {
//     if (isCameraOn) {
//       toggleCamera();
//     }
//     navigate(`/completion/${id}`);
//   };
  
//   return (
//     <Box py={3} sx={{ width: '100%' }}>
//       <AnimatedCard style={cardSpring} sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
//         <CardContent sx={{ p: 2, bgcolor: 'grey.100' }}>
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
//             <Button
//               onClick={handleCompleteExercise}
//               variant="primary"
//               icon={<CheckCircle />}
//               sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
//             >
//               Complete Exercise
//             </Button>
            
//             <Button
//               onClick={handleProjectorToggle}
//               variant={isProjectorOn ? 'secondary' : 'outline'}
//               icon={isProjectorOn ? <CastConnected /> : <Cast />}
//             >
//               {isProjectorOn ? 'Turn Off Projector' : 'Turn On Projector'}
//             </Button>
//           </Stack>
//         </CardContent>
        
//         <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */, bgcolor: 'black' }}>
//           {error && (
//             <Box 
//               sx={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 p: 2,
//                 bgcolor: 'rgba(0, 0, 0, 0.8)'
//               }}
//             >
//               {/* <Typography variant="h6" color="error">
//                 {error}
//               </Typography> */}
//             </Box>
//           )}
          
//           {isCameraOn && (
//             <>
//               <video
//                 ref={videoRef}
//                 style={{ 
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%',
//                   objectFit: 'cover'
//                 }}
//                 autoPlay
//                 playsInline
//                 muted
//               />
//               <canvas 
//                 ref={canvasRef}
//                 style={{ 
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%',
//                   pointerEvents: 'none',
//                   display: 'none'
//                 }}
//                 width="640"
//                 height="480"
//               />
              
//               {/* Render pose detection overlay */}
//               <PoseDetection isProjectorOn={isProjectorOn} />
              
//               {/* Feedback display */}
//               {/* <FeedbackDisplay />  */}
//             </>
//           )}
          
//           {!isCameraOn && (
//             <Box 
//               sx={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flexDirection: 'column',
//                 color: 'white'
//               }}
//             >
//               <Visibility sx={{ fontSize: 64, mb: 2 }} />
//               <Typography variant="h5" mb={2}>Camera is turned off</Typography>
//               <Button
//                 onClick={toggleCamera}
//                 variant="primary"
//                 icon={<Videocam />}
//               >
//                 Turn On Camera
//               </Button>
//             </Box>
//           )}
//         </Box>
//       </AnimatedCard>
//     </Box>
//   );
// };

// export default Camera;