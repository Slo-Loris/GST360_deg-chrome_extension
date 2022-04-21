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

  const [date, setDate] = React.useState(new Date());

  const handleChange = (newValue) => {
    setDate(newValue);
    console.log(date);
  };

  const onClick = async () => {
    setLoadingDialog(true);
    setTableData([]);
    let request1 = deepClone(PORTAL_ENDPOINTS.searchApplications);
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
    console.log(
      folderItemDetails.map((item, index) => {
        return { id: index, ...item.data[0] };
      })
    );
    setTableData(
      folderItemDetails
        .map((item, index) => {
          return { id: index, ...item.data[0] };
        })
        .filter((item) => typeof item.refId !== "undefined")
    );
    setLoadingDialog(false);
  };

  const handleDownload = async (id) => {
    let request1 = deepClone(PORTAL_ENDPOINTS.encryptedDocId);
    let item = JSON.parse(
      tableData.filter((item) => item.id === id)[0].itemJson
    );
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
      filename: `${item?.docupdtl[0]?.ty}_${item?.gstin}_${item?.refundRsn}${item?.fromRetPrd}-${item?.toRetPrd}_${item?.refId}.pdf`,
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
          value={date}
          onChange={handleChange}
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
