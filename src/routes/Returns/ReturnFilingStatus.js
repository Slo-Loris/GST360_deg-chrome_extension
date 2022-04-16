import React from "react";
import PropTypes from "prop-types";
import { GridActionsCellItem } from "@mui/x-data-grid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import GenerateIcon from "@mui/icons-material/AutoMode";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import ProgressDialog from "../../components/ProgressDialog";
import { deepClone, PORTAL_ENDPOINTS, sendMessage } from "../../utils";
import CustomDataGrid from "../../components/DataGrid";

const ReturnFilingStatus = ({ data, rtnType }) => {
  let isGenerateRequired = rtnType === "3B" ? false : true;
  const [year, setYear] = React.useState("");
  const [tableData, setTableData] = React.useState([]);
  const [loadingDialog, setLoadingDialog] = React.useState(false);

  const generateDropDownMenu = () => {
    if (data.data) {
      return data.data.Years.map((item, index) => {
        return (
          <MenuItem dense={true} value={item.year} key={index}>
            {`${item.year}`}
          </MenuItem>
        );
      });
    } else return <MenuItem dense={true} value="" key={0} />;
  };

  const getRoleStatus = async () => {
    if (year != "") {
      setLoadingDialog(true);
      setTableData([]);
      let months = data.data.Years.filter((item) => item.year === year)[0]
        .months;
      let returnFilingStatus = await Promise.all(
        months.map((item) => {
          let request = deepClone(PORTAL_ENDPOINTS.roleStatus);
          request.params.rtn_prd = item.value;
          return sendMessage(request, "role-status");
        })
      );
      setTableData(
        returnFilingStatus.map((item, index) => {
          returnFilingStatus = item.data.data.user[0].returns.filter(
            (item) => item.return_ty === "GSTR1"
          );
          return {
            id: index,
            //period: `${item.month} ${item.value.slice(0, 2)}`,
            period: "dummy",
            status:
              returnFilingStatus[0].status === "FIL" ? `Filed ` : "Not Filed",
          };
        })
      );
      setLoadingDialog(false);
    }
  };

  const columns = [
    {
      field: "period",
      headerName: "Period",
      sortable: false,
      width: 110,
      cellClassName: "dg-cell-text",
    },
    {
      field: "status",
      headerName: "Generation status",
      sortable: false,
      width: 200,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      // eslint-disable-next-line no-unused-vars
      getActions: ({ id }) => [
        { isGenerateRequired } && (
          <GridActionsCellItem
            icon={<GenerateIcon />}
            label="Generate"
            key={1}
            /* onClick={(e) => {
            e.preventDefault();
            handleDataEdit(id);
          }} */
          />
        ),
        <GridActionsCellItem
          icon={<FileDownloadIcon />}
          label="Download"
          key={2}
          /* onClick={(e) => {
            e.preventDefault();
            handleDataEdit(id);
          }} */
        />,
      ],
    },
  ];

  return (
    <>
      <ProgressDialog open={loadingDialog} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "50%",
        }}
      >
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth size={"small"}>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
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
              {generateDropDownMenu()}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="outlined"
          onClick={getRoleStatus}
          sx={{ width: "fit-content", height: "fit-content" }}
        >
          Select
        </Button>
      </div>
      <CustomDataGrid
        rows={tableData}
        columns={columns}
        pageSize={12}
        height={350}
      />
    </>
  );
};

ReturnFilingStatus.propTypes = {
  data: PropTypes.array,
  rtnType: PropTypes.string,
};

export default ReturnFilingStatus;
