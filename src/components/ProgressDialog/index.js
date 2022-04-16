import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const ProgressDialog = ({ open }) => {
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          overflowY: "hidden",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          width: "200px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        },
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: "Medium", mb: "2px" }}>
        Loading
      </Typography>
      <CircularProgress />
    </Dialog>
  );
};

ProgressDialog.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default ProgressDialog;
