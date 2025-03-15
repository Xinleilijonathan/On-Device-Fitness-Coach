import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import Header from "../components/common/Header";
import PoseInfo from "../components/InfoPage/PoseInfo";
import poses from "../data/poses";
import { useAppContext } from "../context/AppContext";
import Particles from "../components/Particles";

const particlesContainerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0, 
};

const InfoPage = () => {
  const { id } = useParams();
  const { selectPose } = useAppContext();

  // Find the pose data based on the ID parameter
  const pose = poses.find((p) => p.id === parseInt(id));

  // Update the current pose in context
  useEffect(() => {
    if (pose) {
      selectPose(pose);
    }
  }, [pose, selectPose]);

  if (!pose) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.100",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Header />
        <Container component="main" sx={{ flex: 1, py: 3 }}>
          <Box sx={{ bgcolor: "white", borderRadius: 1, p: 3, boxShadow: 1 }}>
            <Typography variant="h5" align="center">
              Pose not found
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "transparent", 
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Particle background image */}
      <div style={particlesContainerStyle} className="particles-fullscreen">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={500}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <Header />
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <PoseInfo pose={pose} />
      </Container>
    </Box>
  );
};

export default InfoPage;
