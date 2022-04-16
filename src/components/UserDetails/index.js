import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

const UserDetails = ({ data }) => {
  const { bname, gstin } = data;

  return (
    <div>
      <Typography
        variant="h5"
        textAlign="center"
        sx={{ fontWeight: "Medium", mb: "2px" }}
      >
        {bname}
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        sx={{ fontWeight: "Medium", mb: "16px" }}
      >
        {gstin}
      </Typography>
    </div>
  );
};

UserDetails.propTypes = {
  data: PropTypes.object,
};

UserDetails.defaultProps = {
  data: {},
};

export default UserDetails;
