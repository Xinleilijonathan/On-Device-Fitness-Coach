import React from "react";
import { Container, Box } from "@mui/material";
import Header from "../components/common/Header";
import ActionList from "../components/ActionList/ActionList";
import Particles from "../components/Particles";

// 添加内联样式
const particlesContainerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  pointerEvents: "none", 
};

const ActionListPage = () => {
  return (
    <>
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
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          //overflow: "hidden",
          position: "relative",
          zIndex: 1,
          bgcolor: "transparent",
        }}
      >
        {/* Make sure the Header is rendered here */}
        <Header />

        <Container
          component="main"
          sx={{
            flex: 1,
            py: 3,
            px: { xs: 1, sm: 2, md: 3 },
            maxWidth: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <ActionList />
        </Container>
      </Box>
    </>
  );
};

export default ActionListPage;
