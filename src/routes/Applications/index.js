import React from "react";
import Button from "@mui/material/Button";
import ProgressDialog from "../../components/ProgressDialog";
import { PORTAL_ENDPOINTS, sendMessage, deepClone } from "../../utils";
import CustomDataGrid from "../../components/DataGrid";

const Applications = () => {
  const [tableData, setTableData] = React.useState([]);
  const [loadingDialog, setLoadingDialog] = React.useState(false);

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
      folderItemDetails.map((item, index) => {
        return { id: index, ...item.data[0] };
      })
    );
    setLoadingDialog(false);
  };

  const columns = [
    {
      field: "caseFolderId",
      headerName: "Case ID",
      sortable: false,
      width: 90,
    },
    {
      field: "itemId",
      headerName: "Item ID",
      sortable: false,
      width: 90,
    },
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
  ];

  return (
    <div>
      <ProgressDialog open={loadingDialog} />
      <Button
        variant="outlined"
        onClick={onClick}
        sx={{ width: "fit-content", height: "fit-content" }}
      >
        Select
      </Button>
      <CustomDataGrid
        rows={tableData}
        columns={columns}
        pageSize={12}
        height={350}
        hideFooter={false}
      />
    </div>
  );
};

export default Applications;
