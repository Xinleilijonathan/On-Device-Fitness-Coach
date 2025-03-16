import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import ActionCard from "./ActionCard";
import poses from "../../data/poses";
import { useSpring, animated } from "@react-spring/web";

const AnimatedTypography = animated(Typography);

const ActionList = () => {
  const headerProps = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  return (
    <Box py={3}>
      <AnimatedTypography
        variant="h5"
        component="h5"
        gutterBottom
        align="center"
        style={headerProps}
        sx={{ mb: 4, color: "rgba(255,255,255,0.7)" }}
      >
        Get Ready! Choose a Pose to Begin Your AI Coaching.
      </AnimatedTypography>

      <Grid container spacing={3}>
        {poses.map((pose, index) => (
          <Grid item xs={12} sm={6} lg={4} key={pose.id}>
            <ActionCard pose={pose} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActionList;
