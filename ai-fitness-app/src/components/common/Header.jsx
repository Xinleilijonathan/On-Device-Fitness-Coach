import { useLocation, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
} from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";

const Header = () => {
  const location = useLocation();
  const { currentPose } = useAppContext();

  // get header
  const getHeaderTitle = () => {
    if (location.pathname === "/") {
      return "FitMirror";
    } else if (location.pathname === "/actionlist") {
      return "FitMirror"; // add title for ActionListPage
    } else if (location.pathname.startsWith("/pose/") && currentPose) {
      return currentPose.name;
    } else if (location.pathname.startsWith("/camera") && currentPose) {
      return `Camera: ${currentPose.name}`;
    } else {
      return "AI Fitness";
    }
  };

  // check show return button or not
  const shouldShowBackButton = () => {
    // welcome page doesn't show return button
    if (location.pathname === "/") return false;

    // ActionListPage is the main page, does not show return button
    if (location.pathname === "/actionlist") return false;

    return true;
  };

  // return button's target path
  const getBackPath = () => {
    if (location.pathname.startsWith("/camera") && currentPose) {
      return `/pose/${currentPose?.id}`;
    }
    return "/actionlist"; //
  };

  // check show main page button or not
  const shouldShowHomeButton = () => {
    // if on the ActionList or welcome page, does not need to show
    return location.pathname !== "/" && location.pathname !== "/actionlist";
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#000",
        paddingY: 1,
        width: "100%",
        zIndex: 10,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* left - main title + subtitle */}
          <Box display="flex" alignItems="center">
            {shouldShowBackButton() && (
              <IconButton
                component={Link}
                to={getBackPath()}
                color="inherit"
                edge="start"
                sx={{ mr: 2, padding: "8px" }}
              >
                <ArrowBack fontSize="large" />
              </IconButton>
            )}

            {/* title + subtitle */}
            <Box display="flex" alignItems="center">
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ letterSpacing: "1px", color: "#FFF" }}
              >
                {getHeaderTitle()}
              </Typography>

              {/* subtitle  */}
              {(location.pathname === "/" ||
                location.pathname === "/actionlist") && (
                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: "normal",
                    marginLeft: "10px",
                  }}
                >
                  Your personal AI-powered fitness coach
                </Typography>
              )}
            </Box>
          </Box>

          {/* right side - homepage button */}
          {shouldShowHomeButton() && (
            <IconButton
              component={Link}
              to="/actionlist"
              color="inherit"
              edge="end"
              sx={{ padding: "8px" }}
            >
              <Home fontSize="large" />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
