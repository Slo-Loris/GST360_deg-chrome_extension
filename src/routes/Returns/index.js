import React from "react";
import PropTypes from "prop-types";
import ReturnFilingStatus from "./ReturnFilingStatus";

const Returns = ({ data }) => {
  return (
    <>
      <ReturnFilingStatus data={data} rtnType="3B" />
    </>
  );
};

Returns.propTypes = {
  data: PropTypes.object,
};

export default Returns;
