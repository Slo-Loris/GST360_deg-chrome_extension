import React from "react";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ProgressDialog from "../../components/ProgressDialog";
import {
  PORTAL_ENDPOINTS,
  sendMessage,
  deepClone,
  dropDown,
  generateExcel,
} from "../../utils";
import CustomDataGrid from "../../components/DataGrid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import _ from "lodash";

const Gstr2B = () => {
  const [tableData, setTableData] = React.useState([]);
  const [loadingDialog, setLoadingDialog] = React.useState(false);
  const [year, setYear] = React.useState("2017-18");
  const [format, setFormat] = React.useState("Excel");

  const createYearsArray = () => {
    return dropDown.Years.map((item, index) => {
      return (
        <MenuItem key={index} value={item.year}>
          {item.year}
        </MenuItem>
      );
    });
  };

  const onClick = () => {
    setTableData(
      dropDown.Years.filter((item) => item.year === year)[0].months.map(
        (item, index) => {
          return {
            id: index,
            month: `${item.month} ${item.value.slice(2)}`,
            value: item.value,
          };
        }
      )
    );
  };

  const handleDownload = async (id) => {
    setLoadingDialog(true);
    let request1 = deepClone(PORTAL_ENDPOINTS.gstr2bUserDetails);
    let item = tableData.filter((item) => item.id === id)[0];
    request1.params = { rtnprd: item?.value, fy: year };
    console.log(request1.param);
    let response1 = await sendMessage(request1, "gstr2b-user-details");
    let request2 = deepClone(PORTAL_ENDPOINTS.gstr2bJson);
    request2.params = {
      rtnprd: item?.value,
    };
    let response2 = await sendMessage(request2, "gstr2b-json");
    if (response2.data.data) {
      if (response2.data.data.fc) {
        let data1 = response2.data.data;
        let promises = [
          ...[...Array(response2.data.data.fc).keys()].map((i) => i + 1),
        ].map(async (i) => {
          let request3 = deepClone(PORTAL_ENDPOINTS.gstr2bJson);
          request3.params = {
            rtnprd: item?.value,
            fn: i,
          };
          return await sendMessage(request3, "gstr2b-json");
        });
        let data2 = await Promise.all(promises);
        let data3 = _.merge(
          data1,
          ...data2.map((item) => {
            return item.data.data;
          })
        );
        generateExcel(response1.data?.data, data3);
      } else generateExcel(response1.data?.data, response2.data?.data);
    } else console.log(response2.data.error.message);
    setLoadingDialog(false);
  };

  const handleDownloadAll = () => {
    tableData.map((item) => {
      handleDownload(item.id);
    });
  };

  const handleConsolidatedDownload = async () => {};

  const columns = [
    {
      field: "month",
      headerName: "Period",
      sortable: false,
      width: 150,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<FileDownloadIcon />}
          label="Download"
          key={2}
          onClick={(e) => {
            e.preventDefault();
            handleDownload(id);
          }}
        />,
      ],
    },
  ];

  return (
    <div>
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
              value={year}
              label="Year"
              inputProps={{
                MenuProps: {
                  style: { position: "absolute" },
                  disableScrollLock: true,
                },
              }}
              onChange={(e) => setYear(e.target.value)}
            >
              {createYearsArray()}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120, marginLeft: "8px", width: "120" }}>
          <FormControl fullWidth size={"small"}>
            <InputLabel id="format-select-label">Periodicity</InputLabel>
            <Select
              labelId="format-select-label"
              id="format-select"
              value={format}
              label="Format"
              inputProps={{
                MenuProps: {
                  style: { position: "absolute" },
                  disableScrollLock: true,
                },
              }}
              onChange={(e) => setFormat(e.target.value)}
            >
              {["Excel", "Json"].map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="outlined"
          onClick={onClick}
          sx={{
            width: "fit-content",
            height: "fit-content",
            marginLeft: "8px",
          }}
        >
          Search
        </Button>
      </div>
      <CustomDataGrid
        rows={tableData}
        columns={columns}
        pageSize={10}
        height={350}
        hideFooter={false}
      />
      {tableData.length > 0 && (
        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "16px" }}
        >
          <Button
            variant="outlined"
            onClick={handleDownloadAll}
            sx={{
              width: "fit-content",
              height: "fit-content",
            }}
          >
            Download all
          </Button>
          <Button
            variant="outlined"
            onClick={handleConsolidatedDownload}
            sx={{
              width: "fit-content",
              height: "fit-content",
              marginLeft: "16px",
            }}
          >
            Consolidated 2B
          </Button>
        </div>
      )}
    </div>
  );
};

export default Gstr2B;
