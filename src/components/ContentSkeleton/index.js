import Skeleton from "@mui/material/Skeleton";
import React from "react";

const ContentSkeleton = () => {
  return (
    <div style={{ margin: "8px" }}>
      <Skeleton variant="text" animation="pulse" width="300px" />
      <Skeleton variant="text" animation="pulse" width="200px" />
      <Skeleton variant="text" animation="pulse" width="200px" />
      <Skeleton
        variant="rectangle"
        animation="pulse"
        width="350px"
        height="300px"
      />
    </div>
  );
};

export default ContentSkeleton;
