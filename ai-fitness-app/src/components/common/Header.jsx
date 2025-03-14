import { useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { AppBar, Toolbar, Typography, IconButton, Box, Container } from '@mui/material';
import { ArrowBack, Home } from '@mui/icons-material';

const Header = () => {
  const location = useLocation();
  const { currentPose } = useAppContext();
  
  // Determine the header title based on the current route
  const getHeaderTitle = () => {
    if (location.pathname === '/') {
      return 'AI Fitness Pose Detection';
    } else if (location.pathname.startsWith('/pose/') && currentPose) {
      return currentPose.name;
    } else if (location.pathname.startsWith('/camera') && currentPose) {
      return `Camera: ${currentPose.name}`;
    } else {
      return 'AI Fitness';
    }
  };
  
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box display="flex" alignItems="center" flexGrow={1}>
            {location.pathname !== '/' && (
              <IconButton
                component={Link}
                to={location.pathname.startsWith('/camera') ? `/pose/${currentPose?.id}` : '/'}
                color="inherit"
                edge="start"
                sx={{ mr: 2 }}
              >
                <ArrowBack />
              </IconButton>
            )}
            
            <Typography variant="h6" component="h1" fontWeight="bold">
              {getHeaderTitle()}
            </Typography>
          </Box>
          
          {location.pathname !== '/' && (
            <IconButton
              component={Link}
              to="/"
              color="inherit"
              edge="end"
            >
              <Home />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;