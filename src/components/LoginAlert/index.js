import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import WarningIcon from "@mui/icons-material/ReportRounded";
import Typography from "@mui/material/Typography";

//TODO: Pass the scenario as props to this component and let the component decide what to show

const LoginAlert = ({ alertType, onClick }) => {
  const alertMessage = {
    1: {
      case: "Not in GST Portal",
      header: "You are not in GST Portal",
      message:
        "This extension works only in GST Portal. Kindly open GST Portal and log into your account for using all the killer features.",
    },
    2: {
      case: "Login Required",
      header: "You have not logged in to your account",
      message:
        "This extension works when you log into your account. Kindly log into your account for using all the killer features.",
    },
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "8px",
          marginTop: "32px",
        }}
      >
        <WarningIcon sx={{ color: "warning.light", fontSize: 64 }} />
        <Typography
          variant="h6"
          sx={{
            mb: "8px",
            textAlign: "center",
            color: "warning.light",
          }}
        >
          {alertMessage[alertType].header}
        </Typography>
        <Typography variant="body1" sx={{ mb: "16px", textAlign: "center" }}>
          {alertMessage[alertType].message}
        </Typography>
        (
        <Button id={"open-url-button"} variant="outlined" onClick={onClick}>
          Open GST Portal
        </Button>
        )
      </div>
    </>
  );
};

LoginAlert.propTypes = {
  alertType: PropTypes.string,
  onClick: PropTypes.func,
};

LoginAlert.defaultProps = {
  alertType: "1",
};

export default LoginAlert;
