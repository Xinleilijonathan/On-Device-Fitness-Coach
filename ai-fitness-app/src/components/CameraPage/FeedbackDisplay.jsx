// import React from 'react';
// import { Box, Typography, List, ListItem, ListItemText, Divider, Grid } from '@mui/material';
// import { FiberManualRecord } from '@mui/icons-material';
// import { useAppContext } from '../../context/AppContext';
// import { useSpring, animated } from '@react-spring/web';

// const AnimatedBox = animated(Box);

// const FeedbackDisplay = () => {
//   const { feedback, angles, currentPose } = useAppContext();
  
//   const feedbackSpring = useSpring({
//     from: { opacity: 0, transform: 'translateY(20px)' },
//     to: { opacity: 1, transform: 'translateY(0)' },
//     config: { tension: 280, friction: 20 }
//   });
  
//   if (!feedback || feedback.length === 0) {
//     return null;
//   }
  
//   // Display a maximum of 3 feedback messages at a time
//   const feedbackToShow = feedback.slice(0, 3);
  
//   return (
//     <AnimatedBox 
//       style={feedbackSpring}
//       sx={{
//         position: 'absolute',
//         top: 2,
//         left: 2,
//         maxWidth: 300,
//         bgcolor: 'rgba(0, 0, 0, 0.7)',
//         color: 'white',
//         p: 2,
//         borderRadius: 1,
//         zIndex: 10
//       }}
//     >
//       <Typography variant="subtitle2" fontWeight="bold" mb={1}>
//         Real-Time Feedback:
//       </Typography>
      
//       <List dense disablePadding>
//         {feedbackToShow.map((message, index) => (
//           <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
//             <FiberManualRecord sx={{ color: 'error.light', fontSize: 8, mr: 1 }} />
//             <ListItemText primary={message} primaryTypographyProps={{ variant: 'body2' }} />
//           </ListItem>
//         ))}
//       </List>
      
//       {Object.keys(angles).length > 0 && (
//         <>
//           <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
//           <Typography variant="caption" fontWeight="bold" display="block" mb={0.5}>
//             Current Angles:
//           </Typography>
          
//           <Grid container spacing={1}>
//             {Object.entries(angles).map(([joint, angle]) => {
//               // Check if this angle has a reference in the current pose
//               const standardAngle = currentPose?.evaluation?.standardAngles?.[joint];
//               const isWithinRange = standardAngle 
//                 ? Math.abs(angle - standardAngle) <= 15 
//                 : true;
              
//               return (
//                 <Grid item xs={6} key={joint}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Typography variant="caption">{joint}:</Typography>
//                     <Typography 
//                       variant="caption" 
//                       sx={{ color: isWithinRange ? 'success.light' : 'error.light' }}
//                     >
//                       {angle}°
//                     </Typography>
//                   </Box>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         </>
//       )}
//     </AnimatedBox>
//   );
// };

// export default FeedbackDisplay;