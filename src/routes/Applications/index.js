import React from "react";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ProgressDialog from "../../components/ProgressDialog";
import { PORTAL_ENDPOINTS, sendMessage, deepClone } from "../../utils";
import CustomDataGrid from "../../components/DataGrid";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import moment from "moment";

const Applications = () => {
  const [tableData, setTableData] = React.useState([]);
  const [loadingDialog, setLoadingDialog] = React.useState(false);

  const [startDate, setStartDate] = React.useState(moment(new Date()));
  const [endDate, setEndDate] = React.useState(moment(new Date()));

  const handleChange = (date, id) => {
    id === "startDate" ? setStartDate(date) : setEndDate(date);
  };

  const onClick = async () => {
    setLoadingDialog(true);
    setTableData([]);
    let request1 = deepClone(PORTAL_ENDPOINTS.searchApplications);
    request1.body.startDate = startDate.format("DD/MM/YYYY");
    request1.body.endDate = endDate.format("DD/MM/YYYY");
    let searchResults = await sendMessage(request1, "search-applications");
    let folderDetail = searchResults.data.map(async (item) => {
      let request2 = deepClone(PORTAL_ENDPOINTS.folderDetails);
      request2.body.caseId = item.caseId;
      return await sendMessage(request2, "folder-details");
    });
    let folderDetails = await Promise.all(folderDetail);
    let folderItemDetail = folderDetails.map(async (item) => {
      let orderFolderDetails = item.data.filter(
        (item) => item.caseFolderTypeCd === "ORDRS"
      )[0];
      let itemId = orderFolderDetails.caseFolderId;
      let request3 = deepClone(PORTAL_ENDPOINTS.folderItemDetails);
      request3.body.caseFolderId = itemId;
      return await sendMessage(request3, "folder-item-details");
    });
    let folderItemDetails = await Promise.all(folderItemDetail);
    setTableData([
      ...folderItemDetails
        .map((item, index) => {
          return { id: index, ...item.data[0] };
        })
        .filter((item) => typeof item.refId !== "undefined"),
      ...folderItemDetails
        .map((item, index) => {
          return { id: index + 10, ...item.data[1] };
        })
        .filter((item) => typeof item.refId !== "undefined"),
      ...folderItemDetails
        .map((item, index) => {
          return { id: index + 20, ...item.data[2] };
        })
        .filter((item) => typeof item.refId !== "undefined"),
      ...folderItemDetails
        .map((item, index) => {
          return { id: index + 30, ...item.data[3] };
        })
        .filter((item) => typeof item.refId !== "undefined"),
    ]);
    setLoadingDialog(false);
  };

  const handleDownload = async (id) => {
    let request1 = deepClone(PORTAL_ENDPOINTS.encryptedDocId);
    let item = JSON.parse(
      tableData.filter((item) => item.id === id)[0].itemJson
    );
    let orderType = tableData.filter((item) => item.id === id)[0]
      .caseCfItemMapId;
    request1.body.arn = item?.crn;
    request1.body.docIdList = [item.docupdtl[0]?.id];
    let response1 = await sendMessage(request1, "encrypted-doc-id");
    let request2 = deepClone(PORTAL_ENDPOINTS.downloadDocs);
    request2.responseType = "arraybuffer";
    request2.params = {
      arn: item?.crn,
      docId: item?.docupdtl[0]?.id,
      eh: response1.data[item?.docupdtl[0]?.id],
    };
    let response2 = await sendMessage(request2, "download-document");
    let url = response2.data;
    chrome.downloads.download({
      url,
      filename: `${orderType}_${item?.gstin}_${item?.refundRsn}${item?.fromRetPrd}-${item?.toRetPrd}_${item?.refId}.pdf`,
    });
  };

  const handleDownloadAll = () => {
    tableData.map((item) => {
      handleDownload(item.id);
    });
  };

  const columns = [
    {
      field: "refId",
      headerName: "Reference ID",
      sortable: false,
      width: 150,
    },
    {
      field: "insertDate",
      headerName: "Order Date",
      sortable: false,
      width: 100,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      // eslint-disable-next-line no-unused-vars
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
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DesktopDatePicker
          label="Start date"
          inputFormat="DD/MM/yyyy"
          minDate={moment("07/01/2017")}
          maxDate={moment(new Date())}
          value={startDate}
          onChange={(e) => handleChange(e, "startDate")}
          InputAdornmentProps={{ size: "small" }}
          PaperProps={{
            style: {
              marginLeft: "16px",
              boxShadow:
                "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            },
          }}
          OpenPickerButtonProps={{
            size: "small",
            sx: {
              border: "none",
              borderRadius: "50px",
              "& .MuiSvgIcon-root": {
                fontSize: "20px",
              },
            },
          }}
          renderInput={(params) => (
            <TextField size="small" sx={{ width: "160px" }} {...params} />
          )}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DesktopDatePicker
          label="End date"
          inputFormat="DD/MM/yyyy"
          minDate={startDate}
          maxDate={moment(new Date())}
          value={endDate}
          onChange={(e) => handleChange(e, "endDate")}
          InputAdornmentProps={{ size: "small" }}
          PaperProps={{
            style: {
              marginLeft: "16px",
              boxShadow:
                "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            },
          }}
          OpenPickerButtonProps={{
            size: "small",
            sx: {
              border: "none",
              borderRadius: "50px",
              "& .MuiSvgIcon-root": {
                fontSize: "20px",
              },
            },
          }}
          renderInput={(params) => (
            <TextField size="small" sx={{ width: "160px" }} {...params} />
          )}
        />
      </LocalizationProvider>
      <Button
        variant="outlined"
        onClick={onClick}
        sx={{ width: "fit-content", height: "fit-content", marginLeft: "8px" }}
      >
        Search
      </Button>
      <CustomDataGrid
        rows={tableData}
        columns={columns}
        pageSize={10}
        height={350}
        hideFooter={false}
      />
      {tableData.length > 0 && (
        <Button
          variant="outlined"
          onClick={handleDownloadAll}
          sx={{
            width: "fit-content",
            height: "fit-content",
            marginTop: "16px",
          }}
        >
          Download all
        </Button>
      )}
    </div>
  );
};

export default Applications;
