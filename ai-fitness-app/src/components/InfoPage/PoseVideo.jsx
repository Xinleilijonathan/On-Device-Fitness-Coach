import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  Fullscreen,
} from "@mui/icons-material";
import { useSpring, animated } from "@react-spring/web";

const AnimatedBox = animated(Box);

const PoseVideo = ({ videoSrc, poseName }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const overlaySpring = useSpring({
    opacity: isPlaying ? 0 : 1,
    config: { tension: 280, friction: 20 },
  });

  // play & pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // enter full screen play mode
  const enterFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen(); // Firefox
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen(); // Chrome, Safari
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen(); // IE/Edge
      }
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        paddingTop: "56.25%" /* 16:9 aspect ratio */,
      }}
    >
      {/* video player */}
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: "pointer",
        }}
        src={videoSrc}
        poster={`/assets/poses/${poseName.toLowerCase()}.jpg`}
        onClick={togglePlay}
        onEnded={() => setIsPlaying(false)}
        controls //user can drag and drop the progress bar
      />

      {/* Customized play/pause button (transparent mask)  */}
      <AnimatedBox
        style={overlaySpring}
        onClick={togglePlay}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          pointerEvents: isPlaying ? "none" : "auto", // Play without blocking controls
        }}
      >
        <IconButton
          size="large"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
            p: 1,
          }}
        >
          {isPlaying ? (
            <PauseCircleFilled fontSize="large" />
          ) : (
            <PlayCircleFilled fontSize="large" />
          )}
        </IconButton>
      </AnimatedBox>

      {/* Full screen button in the lower right corner */}
      <IconButton
        size="small"
        aria-label="Full Screen"
        onClick={enterFullScreen}
        sx={{
          position: "absolute",
          bottom: 10,
          right: 10,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        }}
      >
        <Fullscreen fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default PoseVideo;
