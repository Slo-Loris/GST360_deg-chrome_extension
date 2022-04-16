import Skeleton from "@mui/material/Skeleton";
import React from "react";

const ContentSkeleton = () => {
  return (
    <>
      <Skeleton variant="text" animation="pulse" width="300px" />
      <Skeleton variant="text" animation="pulse" width="200px" />
      <Skeleton variant="text" animation="pulse" width="200px" />
      <Skeleton
        variant="rectangle"
        animation="pulse"
        width="400px"
        height="400px"
      />
    </>
  );
};

export default ContentSkeleton;
