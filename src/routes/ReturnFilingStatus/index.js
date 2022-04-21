import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import ProgressDialog from "../../components/ProgressDialog";
import { deepClone, PORTAL_ENDPOINTS, sendMessage } from "../../utils";
import CustomDataGrid from "../../components/DataGrid";

const ReturnFilingStatus = () => {
  const [finyear, setFinyear] = React.useState("");
  const [periodicity, setPeriodicity] = React.useState("");
  const [retType, setRetType] = React.useState("");
  const [tableData, setTableData] = React.useState([]);
  const [loadingDialog, setLoadingDialog] = React.useState(false);

  const columns = [
    {
      field: "taxp",
      headerName: "Month",
      sortable: false,
      width: 120,
    },
    {
      field: "arn",
      headerName: "ARN",
      sortable: false,
      width: 120,
    },
    {
      field: "fy",
      headerName: "Financial Year",
      sortable: false,
      width: 120,
    },
    {
      field: "dof",
      headerName: "Date of filing",
      sortable: false,
      width: 120,
    },
    {
      field: "rtntype",
      headerName: "Return type",
      sortable: false,
      width: 120,
    },
  ];

  const getFilingStatus = async () => {
    setLoadingDialog(true);
    let request1 = deepClone(PORTAL_ENDPOINTS.efilingStatus);
    request1.body.fy = finyear;
    request1.body.rfp = periodicity;
    request1.body.rtntp = retType;
    let response1 = await sendMessage(request1, "return-filing-status");
    setTableData(
      response1.data.map((item, index) => {
        return { id: index, ...item };
      })
    );
    setLoadingDialog(false);
  };

  return (
    <>
      <ProgressDialog open={loadingDialog} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <Box sx={{ minWidth: 120, width: "120" }}>
          <FormControl fullWidth size={"small"}>
            <InputLabel id="financial-year-select-label">Year</InputLabel>
            <Select
              labelId="financial-year-select-label"
              id="financial-year-select"
              value={finyear}
              label="Year"
              inputProps={{
                MenuProps: {
                  style: { position: "absolute" },
                  disableScrollLock: true,
                },
              }}
              onChange={(e) => setFinyear(e.target.value)}
            >
              {[
                "2017-18",
                "2018-19",
                "2019-20",
                "2020-21",
                "2021-22",
                "2022-23",
              ].map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120, marginLeft: "8px", width: "120" }}>
          <FormControl fullWidth size={"small"}>
            <InputLabel id="periodicity-select-label">Periodicity</InputLabel>
            <Select
              labelId="periodicity-select-label"
              id="periodicity-select"
              value={periodicity}
              label="Periodicity"
              inputProps={{
                MenuProps: {
                  style: { position: "absolute" },
                  disableScrollLock: true,
                },
              }}
              onChange={(e) => setPeriodicity(e.target.value)}
            >
              {["Monthly", "Annual"].map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120, marginLeft: "8px", width: "120" }}>
          <FormControl fullWidth size={"small"}>
            <InputLabel id="return-type-select-label">Return Type</InputLabel>
            <Select
              labelId="return-type-select-label"
              id="return-type-select"
              value={retType}
              label="Return type"
              inputProps={{
                MenuProps: {
                  style: { position: "absolute" },
                  disableScrollLock: true,
                },
              }}
              onChange={(e) => setRetType(e.target.value)}
            >
              {(periodicity === "Monthly"
                ? ["GSTR1", "GSTR3B"]
                : ["GSTR9", "GSTR9C"]
              ).map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </div>
      <Button
        variant="outlined"
        onClick={getFilingStatus}
        sx={{ width: "fit-content", height: "fit-content" }}
      >
        Select
      </Button>
      <CustomDataGrid
        rows={tableData}
        columns={columns}
        pageSize={12}
        height={350}
      />
    </>
  );
};

export default ReturnFilingStatus;
