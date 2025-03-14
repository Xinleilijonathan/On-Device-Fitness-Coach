import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import Button from '../components/common/Button';
import { useSpring, animated } from '@react-spring/web';

const AnimatedPaper = animated(Paper);

const CompletionPage = () => {
  const navigate = useNavigate();
  
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <AnimatedPaper
          style={springProps}
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: 'background.paper'
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 80,
              color: 'success.main',
              mb: 3
            }}
          />
          
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Congratulations!
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph>
            You've successfully completed this exercise!
          </Typography>
          
          <Button
            onClick={() => navigate('/actionlist')}
            variant="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Try More Exercises
          </Button>
        </AnimatedPaper>
      </Box>
    </Container>
  );
};

export default CompletionPage; 