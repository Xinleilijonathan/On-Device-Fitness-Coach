import React, { useEffect, useState } from "react";

const PoseDetection = () => {
  const [alert, setAlert] = useState("");

  return (
    <div className="relative">
      {/* Video Feed */}
      <div>
        <img src="http://127.0.0.1:5000/video_feed" alt="Video Feed" />
      </div>
    </div>
  );
};

export default PoseDetection;
