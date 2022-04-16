import React from "react";
import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ThemeToggleIcon from "@mui/icons-material/BrightnessMediumTwoTone";
import DummyLogoIcon from "@mui/icons-material/HandymanTwoTone";

const AppBar = ({ themeToggleClick }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <DummyLogoIcon sx={{ fontSize: 32, mr: "4px" }}></DummyLogoIcon>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "Bold",
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            AppName
          </Typography>
        </div>
        <IconButton
          aria-label="toggle-theme"
          id={"toggle-theme-button"}
          size={"small"}
          onClick={themeToggleClick}
        >
          <ThemeToggleIcon />
        </IconButton>
      </div>
      <Divider
        variant="fullWidth"
        sx={{ marginY: "16px", marginInline: "-16px" }}
      />
    </>
  );
};

AppBar.propTypes = {
  themeToggleClick: PropTypes.func.isRequired,
};

export default AppBar;
