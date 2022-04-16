import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

const CustomDataGrid = ({
  rows,
  columns,
  height,
  headerHeight,
  rowHeight,
  pageSize,
  hideFooter,
  checkboxSelection,
  disableHeaderOptions,
}) => {
  return (
    <div style={{ height: `${height}px` }}>
      <DataGrid
        disableSelectionOnClick
        headerHeight={headerHeight}
        rows={rows}
        rowHeight={rowHeight}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        hideFooter={hideFooter}
        checkboxSelection={checkboxSelection}
        disableColumnFilter={disableHeaderOptions}
        disableColumnMenu={disableHeaderOptions}
      />
    </div>
  );
};

CustomDataGrid.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  height: PropTypes.number,
  headerHeight: PropTypes.number,
  rowHeight: PropTypes.number,
  pageSize: PropTypes.number,
  hideFooter: PropTypes.bool,
  checkboxSelection: PropTypes.bool,
  disableHeaderOptions: PropTypes.bool,
};

CustomDataGrid.defaultProps = {
  rows: [],
  columns: [],
  height: 200,
  headerHeight: 40,
  rowHeight: 40,
  pageSize: 5,
  hideFooter: true,
  checkboxSelection: false,
  disableHeaderOptions: true,
};

export default CustomDataGrid;
