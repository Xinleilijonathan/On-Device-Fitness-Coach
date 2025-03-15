import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Orb from "../components/Orb"; 
import "../App.css"; 

const WelcomePage = () => {
  const navigate = useNavigate();

  // Handles the click event and jumps to the ActionListPage.
  const handleClick = () => {
    navigate("/actionlist");
  };

  return (
    <Box
      onClick={handleClick}
      className="welcome-container"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {/* Orb Animation */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={200}
          forceHoverState={false}
        />
      </Box>

      {/* text */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Welcome to FitMirror
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.8, mt: 2 }}>
          Your personal AI-powered fitness coach
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.6, mt: 4 }}>
          Click any place to enter
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomePage;
