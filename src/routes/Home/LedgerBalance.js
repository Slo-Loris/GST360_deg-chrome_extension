import React from "react";
import CustomDataGrid from "../../components/DataGrid";

const LedgerBalance = () => {
  const rows = [
    {
      id: 1,
      ledger: "Credit Ledger",
      igst: 2840915087.54,
      cgst: 0.0,
      sgst: 0.0,
      cess: 0.0,
    },
    {
      id: 2,
      ledger: "Cash Ledger",
      igst: 0.0,
      cgst: 0.0,
      sgst: 0.0,
      cess: 0.0,
    },
    {
      id: 3,
      ledger: "Liability Ledger",
      igst: 0.0,
      cgst: 0.0,
      sgst: 0.0,
      cess: 0.0,
    },
  ];
  //let columns = props.columns;

  const columns = [
    {
      field: "ledger",
      headerName: "Ledger",
      sortable: false,
      width: 125,
      cellClassName: "dg-cell-text",
    },
    {
      field: "igst",
      headerName: "IGST",
      sortable: false,
      width: 125,
    },

    {
      field: "cgst",
      headerName: "CGST",
      sortable: false,
      width: 125,
    },

    {
      field: "sgst",
      headerName: "SGST",
      sortable: false,
      width: 125,
    },

    {
      field: "cess",
      headerName: "Cess",
      sortable: false,
      width: 125,
    },
  ];

  return <CustomDataGrid rows={rows} columns={columns} />;
};

export default LedgerBalance;
