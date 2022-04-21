import ExcelJS from "exceljs";
import sha256 from "js-sha256";

export const generateExcel = (usrData, jsonData) => {
  window.userData = usrData;
  window.generationDate = jsonData.gendt;
  window.isIFFLive = true;
  let workbook = new ExcelJS.Workbook();
  let b2bData,
    b2baData,
    cdnrData,
    cdnraData,
    isdData,
    isdaData,
    impgData,
    impgSezData,
    itcavl,
    itcunavl,
    summExcelObj;
  const todayDate = new Date(),
    d =
      window.userData.rtnprd +
      "_" +
      window.userData.gstin +
      "_GSTR2B_" +
      todayDate.toJSON().slice(8, 10) +
      todayDate.toJSON().slice(5, 7) +
      todayDate.toJSON().slice(0, 4) +
      ".xlsx";
  jsonData.itcsumm &&
    (jsonData.itcsumm.itcavl || jsonData.itcsumm.itcunavl) &&
    ((itcavl =
      "itcsumm" in jsonData && "itcavl" in jsonData.itcsumm
        ? jsonData.itcsumm.itcavl
        : null),
    (itcunavl =
      "itcsumm" in jsonData && "itcunavl" in jsonData.itcsumm
        ? jsonData.itcsumm.itcunavl
        : null),
    (summExcelObj = setSummaryForExcel(itcavl, itcunavl))),
    jsonData &&
      jsonData.docdata &&
      (jsonData.docdata.b2b &&
        jsonData.docdata.b2b.length > 0 &&
        (b2bData = getB2BDocData(jsonData.docdata.b2b)),
      jsonData.docdata.b2ba &&
        jsonData.docdata.b2ba.length > 0 &&
        (b2baData = getB2BADocData(jsonData.docdata.b2ba)),
      jsonData.docdata.cdnr &&
        jsonData.docdata.cdnr.length > 0 &&
        (cdnrData = getCDNRDocData(jsonData.docdata.cdnr)),
      jsonData.docdata.cdnra &&
        jsonData.docdata.cdnra.length > 0 &&
        (cdnraData = getCDNRADocData(jsonData.docdata.cdnra)),
      jsonData.docdata.isd &&
        jsonData.docdata.isd.length > 0 &&
        (isdData = getISDDocData(jsonData.docdata.isd)),
      jsonData.docdata.isda &&
        jsonData.docdata.isda.length > 0 &&
        (isdaData = getISDADOCData(jsonData.docdata.isda)),
      jsonData.docdata.impg &&
        jsonData.docdata.impg.length > 0 &&
        (impgData = getIMPGDocData(jsonData.docdata.impg)),
      jsonData.docdata.impgsez &&
        jsonData.docdata.impgsez.length > 0 &&
        (impgSezData = getIMPGSEZDocData(jsonData.docdata.impgsez))),
    addReadmeworksheet(workbook, window.isIFFLive),
    addITCSummarysheet(summExcelObj, workbook, window.isIFFLive),
    addITCUnvalSummarysheet(summExcelObj, workbook, window.isIFFLive),
    addB2Bworksheet(b2bData, workbook, window.isIFFLive),
    addB2BAworksheet(b2baData, workbook, window.isIFFLive),
    addCdnrworksheet(cdnrData, workbook, window.isIFFLive),
    addCdnraworksheet(cdnraData, workbook, window.isIFFLive),
    addIsdworksheet(isdData, workbook),
    addIsdaworksheet(isdaData, workbook),
    addImpgworksheet(impgData, workbook),
    addImpgsezworksheet(impgSezData, workbook),
    workbook.xlsx.writeBuffer().then((n) => {
      const t = new Blob([n], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      let url = window.URL.createObjectURL(t);
      chrome.downloads.download({
        url,
        filename: d,
      });
    });
};

const addReadmeworksheet = (workbook, iffStatus) => {
  (window.isIFFLive = null != iffStatus && iffStatus),
    console.log("ifflive" + window.isIFFLive);
  console.log(window.userData);
  let e = window.userData,
    l = window.generationDate,
    s =
      null != e && null != l
        ? [
            e.fy,
            changeMonthIndexToString1(e.rtnprd),
            e.gstin,
            e.lgnm,
            e.trdnm,
            l,
          ]
        : null != e && null == l
        ? [
            e.fy,
            changeMonthIndexToString1(e.rtnprd),
            e.gstin,
            e.lgnm,
            e.trdnm,
            "",
          ]
        : null == e && null != l
        ? ["", "", "", "", "", l]
        : [],
    i = workbook.addWorksheet("Read me");
  (i.properties.showGridLines = !1), i.mergeCells("A1:F3");
  let o = i.getCell("A1");
  (o.value = constants.EXCEL_HEADING_LBL),
    setStyle(o, 22, "middle", "203764", "FFFFFF", !1);
  for (let r = 0; r < constants.USER_DETAILS_LBL.length; r++) {
    i.mergeCells(4 + r, 1, 4 + r, 2);
    let n = i.getCell(4 + r, 1);
    (n.value = constants.USER_DETAILS_LBL[r]),
      setStyle(n, 11, "top", r < 2 ? "FFF2CC" : "FCE4D6", "000000", !1),
      (n.font.name = "Calibri"),
      (n.alignment.horizontal = "right"),
      i.mergeCells(4 + r, 3, 4 + r, 6);
    let t = i.getCell(4 + r, 3);
    (t.value = s[r]),
      setStyle(t, 11, "top", r < 2 ? "FFF2CC" : "FCE4D6", "000000", !1),
      (t.font.name = "Calibri"),
      (t.alignment.horizontal = "left");
  }
  i.mergeCells("A11:F11");
  let a = i.getCell("A11");
  (a.value = "GSTR-2B Data Entry Instructions"),
    setStyle(a, 11, "top", "E4E4E4", "000000", !0),
    (a.font.name = "Calibri");
  for (let r = 0; r < constants.READ_ME_HEADER.length; r++) {
    3 == r && i.mergeCells(12, r + 1, 12, r + 3);
    let n = i.getCell(12, r + 1);
    (n.value = constants.READ_ME_HEADER[r]),
      setStyle(n, 11, "top", "E4E4E4", "000000", !0),
      (n.font.name = "Calibri");
  }
  for (let r = 0; r < constants.RDME_SEC_LBL.length; r++)
    "B2B" == constants.RDME_SEC_LBL[r]
      ? readMeSecInfo(i, r, 13, 34, "B2B")
      : "B2BA" == constants.RDME_SEC_LBL[r]
      ? readMeSecInfo(i, r, 35, 55, "B2BA")
      : "B2B-CDNR" == constants.RDME_SEC_LBL[r]
      ? readMeSecInfo(i, r, 56, 78, "CDNR")
      : "B2B-CDNRA" == constants.RDME_SEC_LBL[r]
      ? readMeSecInfo(i, r, 79, 101, "CDNRA")
      : "ISD" == constants.RDME_SEC_LBL[r]
      ? readMeSecInfo(i, r, 102, 115, "ISD")
      : "ISDA" == constants.RDME_SEC_LBL[r]
      ? readMeSecInfo(i, r, 116, 132, "ISDA")
      : "IMPG" == constants.RDME_SEC_LBL[r]
      ? readMeSecInfo(i, r, 133, 140, "IMPG")
      : "IMPGSEZ" == constants.RDME_SEC_LBL[r] &&
        readMeSecInfo(i, r, 141, 150, "IMPGSEZ");
  (i.getColumn(1).width = 10.57),
    (i.getColumn(2).width = 25.15),
    (i.getColumn(3).width = 26.43),
    (i.getColumn(4).width = 29),
    (i.getColumn(5).width = 22.14),
    (i.getColumn(6).width = 23.71),
    (i.state = "visible");
};

const readMeSecInfo = (n, t, e, l, s) => {
  n.mergeCells(e, 1, l, 1);
  let r = n.getCell(e, 1);
  (r.value = constants.RDME_SEC_LBL[t]),
    setStyle(r, 11, "middle", "FFFFFF", "000000", !1),
    (r.font.name = "Times New Roman"),
    n.mergeCells(e, 2, l, 2);
  let i = n.getCell(e, 2);
  switch (
    ((i.value = constants.RDME_NT_TXT_LBL[t]),
    setStyle(i, 11, "middle", "FFFFFF", "000000", !1),
    (i.alignment.horizontal = "left"),
    (i.font.name = "Times New Roman"),
    s)
  ) {
    case "B2B":
      var o = window.isIFFLive
        ? constants.RDME_FLD_B2B_LBL_IFF
        : constants.RDME_FLD_B2B_LBL;
      for (let t = 0; t < o.length; t++) {
        let l = n.getCell(e + t, 3);
        (l.value = o[t]),
          setStyle(l, 11, "top", "E4E4E4", "000000", !1),
          (l.alignment.horizontal = "left"),
          (l.font.name = "Times New Roman");
      }
      var a = window.isIFFLive
        ? constants.RDME_FLD_B2B_INFO_LBL_IFF
        : constants.RDME_FLD_B2B_INFO_LBL;
      for (let t = 0; t < a.length; t++) {
        n.mergeCells(e + t, 4, e + t, 6);
        let l = n.getCell(e + t, 4);
        (l.value = a[t]),
          setStyle(l, 11, "top", "FFFFFF", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      break;
    case "B2BA":
      var u = window.isIFFLive
        ? constants.RDME_FLD_B2BA_LBL_IFF
        : constants.RDME_FLD_B2BA_LBL;
      for (let t = 0; t < u.length; t++) {
        let l = n.getCell(e + t, 3);
        (l.value = u[t]),
          setStyle(l, 11, "top", "E4E4E4", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      var c = window.isIFFLive
        ? constants.RDME_FLD_B2BA_INFO_LBL_IFF
        : constants.RDME_FLD_B2BA_INFO_LBL;
      for (let t = 0; t < c.length; t++) {
        n.mergeCells(e + t, 4, e + t, 6);
        let l = n.getCell(e + t, 4);
        (l.value = c[t]),
          setStyle(l, 11, "top", "FFFFFF", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      break;
    case "CDNR":
      var d = window.isIFFLive
        ? constants.RDME_FLD_CDNR_LBL_IFF
        : constants.RDME_FLD_CDNR_LBL;
      for (let t = 0; t < d.length; t++) {
        let l = n.getCell(e + t, 3);
        (l.value = d[t]),
          setStyle(l, 11, "top", "E4E4E4", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      var g = window.isIFFLive
        ? constants.RDME_FLD_CDNR_INFO_LBL_IFF
        : constants.RDME_FLD_CDNR_INFO_LBL;
      for (let t = 0; t < g.length; t++) {
        n.mergeCells(e + t, 4, e + t, 6);
        let l = n.getCell(e + t, 4);
        (l.value = g[t]),
          setStyle(l, 11, "top", "FFFFFF", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      break;
    case "CDNRA":
      var f = window.isIFFLive
        ? constants.RDME_FLD_CDNRA_LBL_IFF
        : constants.RDME_FLD_CDNRA_LBL;
      for (let t = 0; t < f.length; t++) {
        let l = n.getCell(e + t, 3);
        (l.value = f[t]),
          setStyle(l, 11, "top", "E4E4E4", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      var h = window.isIFFLive
        ? constants.RDME_FLD_CDNRA_INFO_LBL_IFF
        : constants.RDME_FLD_CDNRA_INFO_LBL;
      for (let t = 0; t < h.length; t++) {
        n.mergeCells(e + t, 4, e + t, 6);
        let l = n.getCell(e + t, 4);
        (l.value = h[t]),
          setStyle(l, 11, "top", "FFFFFF", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      break;
    case "ISD":
      for (let t = 0; t < constants.RDME_FLD_ISD_LBL.length; t++) {
        let l = n.getCell(e + t, 3);
        (l.value = constants.RDME_FLD_ISD_LBL[t]),
          setStyle(l, 11, "top", "E4E4E4", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      for (let t = 0; t < constants.RDME_FLD_ISD_INFO_LBL.length; t++) {
        n.mergeCells(e + t, 4, e + t, 6);
        let l = n.getCell(e + t, 4);
        (l.value = constants.RDME_FLD_ISD_INFO_LBL[t]),
          setStyle(l, 11, "top", "FFFFFF", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      break;
    case "ISDA":
      for (let t = 0; t < constants.RDME_FLD_ISDA_LBL.length; t++) {
        let l = n.getCell(e + t, 3);
        (l.value = constants.RDME_FLD_ISDA_LBL[t]),
          setStyle(l, 11, "top", "E4E4E4", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      for (let t = 0; t < constants.RDME_FLD_ISDA_INFO_LBL.length; t++) {
        n.mergeCells(e + t, 4, e + t, 6);
        let l = n.getCell(e + t, 4);
        (l.value = constants.RDME_FLD_ISDA_INFO_LBL[t]),
          setStyle(l, 11, "top", "FFFFFF", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      break;
    case "IMPG":
      for (let t = 0; t < constants.RDME_FLD_IMPG_LBL.length; t++) {
        let l = n.getCell(e + t, 3);
        (l.value = constants.RDME_FLD_IMPG_LBL[t]),
          setStyle(l, 11, "top", "E4E4E4", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      for (let t = 0; t < constants.RDME_FLD_IMPG_INFO_LBL.length; t++) {
        n.mergeCells(e + t, 4, e + t, 6);
        let l = n.getCell(e + t, 4);
        (l.value = constants.RDME_FLD_IMPG_INFO_LBL[t]),
          setStyle(l, 11, "top", "FFFFFF", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      break;
    case "IMPGSEZ":
      for (let t = 0; t < constants.RDME_FLD_IMPGSEZ_LBL.length; t++) {
        let l = n.getCell(e + t, 3);
        (l.value = constants.RDME_FLD_IMPGSEZ_LBL[t]),
          setStyle(l, 11, "top", "E4E4E4", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
      for (let t = 0; t < constants.RDME_FLD_IMPGSEZ_INFO_LBL.length; t++) {
        n.mergeCells(e + t, 4, e + t, 6);
        let l = n.getCell(e + t, 4);
        (l.value = constants.RDME_FLD_IMPGSEZ_INFO_LBL[t]),
          setStyle(l, 11, "top", "FFFFFF", "000000", !1),
          (l.font.name = "Times New Roman"),
          (l.alignment.horizontal = "left");
      }
  }
};

const setSummaryForExcel = (n, t) => {
  let e = {};
  return (
    (e.itcval = {
      part_a: [
        {
          sno: "I",
          heading:
            "All other ITC - Supplies from registered persons other than reverse charge",
          table: "4(A)(5)",
          igst:
            n && n.nonrevsup && n.nonrevsup.igst
              ? changeNumberToAccountingString(n.nonrevsup.igst)
              : "0.00",
          cgst:
            n && n.nonrevsup && n.nonrevsup.cgst
              ? changeNumberToAccountingString(n.nonrevsup.cgst)
              : "0.00",
          sgst:
            n && n.nonrevsup && n.nonrevsup.sgst
              ? changeNumberToAccountingString(n.nonrevsup.sgst)
              : "0.00",
          cess:
            n && n.nonrevsup && n.nonrevsup.cess
              ? changeNumberToAccountingString(n.nonrevsup.cess)
              : "0.00",
          adv: "If this is positive, credit may be availed under Table 4(A)(5) of FORM GSTR-3B.\n If this is negative, credit shall be reversed under Table 4(B)(2) of FORM GSTR-3B.",
        },
        {
          sno: "",
          heading: "B2B - Invoices",
          table: "",
          igst:
            n && n.nonrevsup && n.nonrevsup.b2b && n.nonrevsup.b2b.igst
              ? changeNumberToAccountingString(n.nonrevsup.b2b.igst)
              : "0.00",
          cgst:
            n && n.nonrevsup && n.nonrevsup.b2b && n.nonrevsup.b2b.cgst
              ? changeNumberToAccountingString(n.nonrevsup.b2b.cgst)
              : "0.00",
          sgst:
            n && n.nonrevsup && n.nonrevsup.b2b && n.nonrevsup.b2b.sgst
              ? changeNumberToAccountingString(n.nonrevsup.b2b.sgst)
              : "0.00",
          cess:
            n && n.nonrevsup && n.nonrevsup.b2b && n.nonrevsup.b2b.cess
              ? changeNumberToAccountingString(n.nonrevsup.b2b.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Debit notes",
          table: "",
          igst:
            n && n.nonrevsup && n.nonrevsup.cdnr && n.nonrevsup.cdnr.igst
              ? changeNumberToAccountingString(n.nonrevsup.cdnr.igst)
              : "0.00",
          cgst:
            n && n.nonrevsup && n.nonrevsup.cdnr && n.nonrevsup.cdnr.cgst
              ? changeNumberToAccountingString(n.nonrevsup.cdnr.cgst)
              : "0.00",
          sgst:
            n && n.nonrevsup && n.nonrevsup.cdnr && n.nonrevsup.cdnr.sgst
              ? changeNumberToAccountingString(n.nonrevsup.cdnr.sgst)
              : "0.00",
          cess:
            n && n.nonrevsup && n.nonrevsup.cdnr && n.nonrevsup.cdnr.cess
              ? changeNumberToAccountingString(n.nonrevsup.cdnr.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Invoices (Amendment)",
          table: "",
          igst:
            n && n.nonrevsup && n.nonrevsup.b2ba && n.nonrevsup.b2ba.igst
              ? changeNumberToAccountingString(n.nonrevsup.b2ba.igst)
              : "0.00",
          cgst:
            n && n.nonrevsup && n.nonrevsup.b2ba && n.nonrevsup.b2ba.cgst
              ? changeNumberToAccountingString(n.nonrevsup.b2ba.cgst)
              : "0.00",
          sgst:
            n && n.nonrevsup && n.nonrevsup.b2ba && n.nonrevsup.b2ba.sgst
              ? changeNumberToAccountingString(n.nonrevsup.b2ba.sgst)
              : "0.00",
          cess:
            n && n.nonrevsup && n.nonrevsup.b2ba && n.nonrevsup.b2ba.cess
              ? changeNumberToAccountingString(n.nonrevsup.b2ba.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Debit notes (Amendment)",
          table: "",
          igst:
            n && n.nonrevsup && n.nonrevsup.cdnra && n.nonrevsup.cdnra.igst
              ? changeNumberToAccountingString(n.nonrevsup.cdnra.igst)
              : "0.00",
          cgst:
            n && n.nonrevsup && n.nonrevsup.cdnra && n.nonrevsup.cdnra.cgst
              ? changeNumberToAccountingString(n.nonrevsup.cdnra.cgst)
              : "0.00",
          sgst:
            n && n.nonrevsup && n.nonrevsup.cdnra && n.nonrevsup.cdnra.sgst
              ? changeNumberToAccountingString(n.nonrevsup.cdnra.sgst)
              : "0.00",
          cess:
            n && n.nonrevsup && n.nonrevsup.cdnra && n.nonrevsup.cdnra.cess
              ? changeNumberToAccountingString(n.nonrevsup.cdnra.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "II",
          heading: "Inward Supplies from ISD",
          table: "4(A)(4)",
          igst:
            n && n.isdsup && n.isdsup.igst
              ? changeNumberToAccountingString(n.isdsup.igst)
              : "0.00",
          cgst:
            n && n.isdsup && n.isdsup.cgst
              ? changeNumberToAccountingString(n.isdsup.cgst)
              : "0.00",
          sgst:
            n && n.isdsup && n.isdsup.sgst
              ? changeNumberToAccountingString(n.isdsup.sgst)
              : "0.00",
          cess:
            n && n.isdsup && n.isdsup.cess
              ? changeNumberToAccountingString(n.isdsup.cess)
              : "0.00",
          adv: "If this is positive, credit may be availed under Table 4(A)(4) of FORM GSTR-3B. \n If this is negative, credit shall be reversed under Table 4(B)(2) of FORM GSTR-3B.",
        },
        {
          sno: "",
          heading: "ISD - Invoices",
          table: "",
          igst:
            n && n.isdsup && n.isdsup.isd && n.isdsup.isd.igst
              ? changeNumberToAccountingString(n.isdsup.isd.igst)
              : "0.00",
          cgst:
            n && n.isdsup && n.isdsup.isd && n.isdsup.isd.cgst
              ? changeNumberToAccountingString(n.isdsup.isd.cgst)
              : "0.00",
          sgst:
            n && n.isdsup && n.isdsup.isd && n.isdsup.isd.sgst
              ? changeNumberToAccountingString(n.isdsup.isd.sgst)
              : "0.00",
          cess:
            n && n.isdsup && n.isdsup.isd && n.isdsup.isd.cess
              ? changeNumberToAccountingString(n.isdsup.isd.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "ISD - Invoices (Amendment)",
          table: "",
          igst:
            n && n.isdsup && n.isdsup.isda && n.isdsup.isda.igst
              ? changeNumberToAccountingString(n.isdsup.isda.igst)
              : "0.00",
          cgst:
            n && n.isdsup && n.isdsup.isda && n.isdsup.isda.cgst
              ? changeNumberToAccountingString(n.isdsup.isda.cgst)
              : "0.00",
          sgst:
            n && n.isdsup && n.isdsup.isda && n.isdsup.isda.sgst
              ? changeNumberToAccountingString(n.isdsup.isda.sgst)
              : "0.00",
          cess:
            n && n.isdsup && n.isdsup.isda && n.isdsup.isda.cess
              ? changeNumberToAccountingString(n.isdsup.isda.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "III",
          heading: "Inward Supplies liable for reverse charge",
          table: "3.1(d) \n 4(A)(3)",
          igst:
            n && n.revsup && n.revsup.igst
              ? changeNumberToAccountingString(n.revsup.igst)
              : "0.00",
          cgst:
            n && n.revsup && n.revsup.cgst
              ? changeNumberToAccountingString(n.revsup.cgst)
              : "0.00",
          sgst:
            n && n.revsup && n.revsup.sgst
              ? changeNumberToAccountingString(n.revsup.sgst)
              : "0.00",
          cess:
            n && n.revsup && n.revsup.cess
              ? changeNumberToAccountingString(n.revsup.cess)
              : "0.00",
          adv: "These supplies shall be declared in Table 3.1(d) of FORM GSTR-3B for payment of tax. \n Credit may be availed under Table 4A(3) of FORM GSTR-3B on payment of tax.",
        },
        {
          sno: "",
          heading: "B2B - Invoices",
          table: "",
          igst:
            n && n.revsup && n.revsup.b2b && n.revsup.b2b.igst
              ? changeNumberToAccountingString(n.revsup.b2b.igst)
              : "0.00",
          cgst:
            n && n.revsup && n.revsup.b2b && n.revsup.b2b.cgst
              ? changeNumberToAccountingString(n.revsup.b2b.cgst)
              : "0.00",
          sgst:
            n && n.revsup && n.revsup.b2b && n.revsup.b2b.sgst
              ? changeNumberToAccountingString(n.revsup.b2b.sgst)
              : "0.00",
          cess:
            n && n.revsup && n.revsup.b2b && n.revsup.b2b.cess
              ? changeNumberToAccountingString(n.revsup.b2b.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Debit notes",
          table: "",
          igst:
            n && n.revsup && n.revsup.cdnr && n.revsup.cdnr.igst
              ? changeNumberToAccountingString(n.revsup.cdnr.igst)
              : "0.00",
          cgst:
            n && n.revsup && n.revsup.cdnr && n.revsup.cdnr.cgst
              ? changeNumberToAccountingString(n.revsup.cdnr.cgst)
              : "0.00",
          sgst:
            n && n.revsup && n.revsup.cdnr && n.revsup.cdnr.sgst
              ? changeNumberToAccountingString(n.revsup.cdnr.sgst)
              : "0.00",
          cess:
            n && n.revsup && n.revsup.cdnr && n.revsup.cdnr.cess
              ? changeNumberToAccountingString(n.revsup.cdnr.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Invoices (Amendment)",
          table: "",
          igst:
            n && n.revsup && n.revsup.b2ba && n.revsup.b2ba.igst
              ? changeNumberToAccountingString(n.revsup.b2ba.igst)
              : "0.00",
          cgst:
            n && n.revsup && n.revsup.b2ba && n.revsup.b2ba.cgst
              ? changeNumberToAccountingString(n.revsup.b2ba.cgst)
              : "0.00",
          sgst:
            n && n.revsup && n.revsup.b2ba && n.revsup.b2ba.sgst
              ? changeNumberToAccountingString(n.revsup.b2ba.sgst)
              : "0.00",
          cess:
            n && n.revsup && n.revsup.b2ba && n.revsup.b2ba.cess
              ? changeNumberToAccountingString(n.revsup.b2ba.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Debit notes (Amendment)",
          table: "",
          igst:
            n && n.revsup && n.revsup.cdnra && n.revsup.cdnra.igst
              ? changeNumberToAccountingString(n.revsup.cdnra.igst)
              : "0.00",
          cgst:
            n && n.revsup && n.revsup.cdnra && n.revsup.cdnra.cgst
              ? changeNumberToAccountingString(n.revsup.cdnra.cgst)
              : "0.00",
          sgst:
            n && n.revsup && n.revsup.cdnra && n.revsup.cdnra.sgst
              ? changeNumberToAccountingString(n.revsup.cdnra.sgst)
              : "0.00",
          cess:
            n && n.revsup && n.revsup.cdnra && n.revsup.cdnra.cess
              ? changeNumberToAccountingString(n.revsup.cdnra.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "IV",
          heading: "Import of Goods",
          table: "4(A)(1)",
          igst:
            n && n.imports && n.imports.igst
              ? changeNumberToAccountingString(n.imports.igst)
              : "0.00",
          cgst:
            n && n.imports && n.imports.cgst
              ? changeNumberToAccountingString(n.imports.cgst)
              : "0.00",
          sgst:
            n && n.imports && n.imports.sgst
              ? changeNumberToAccountingString(n.imports.sgst)
              : "0.00",
          cess:
            n && n.imports && n.imports.cess
              ? changeNumberToAccountingString(n.imports.cess)
              : "0.00",
          adv: "If this is positive, credit may be availed under Table 4(A)(1) of FORM GSTR-3B. \n If this is negative, credit shall be reversed under Table 4(B)(2) of FORM GSTR-3B.",
        },
        {
          sno: "",
          heading: "IMPG - Import of goods from overseas",
          table: "",
          igst:
            n && n.imports && n.imports.impg && n.imports.impg.igst
              ? changeNumberToAccountingString(n.imports.impg.igst)
              : "0.00",
          cgst:
            n && n.imports && n.imports.impg && n.imports.impg.cgst
              ? changeNumberToAccountingString(n.imports.impg.cgst)
              : "0.00",
          sgst:
            n && n.imports && n.imports.impg && n.imports.impg.sgst
              ? changeNumberToAccountingString(n.imports.impg.sgst)
              : "0.00",
          cess:
            n && n.imports && n.imports.impg && n.imports.impg.cess
              ? changeNumberToAccountingString(n.imports.impg.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "IMPG (Amendment)",
          table: "",
          igst:
            n && n.imports && n.imports.impga && n.imports.impga.igst
              ? changeNumberToAccountingString(n.imports.impga.igst)
              : "0.00",
          cgst:
            n && n.imports && n.imports.impga && n.imports.impga.cgst
              ? changeNumberToAccountingString(n.imports.impga.cgst)
              : "0.00",
          sgst:
            n && n.imports && n.imports.impga && n.imports.impga.sgst
              ? changeNumberToAccountingString(n.imports.impga.sgst)
              : "0.00",
          cess:
            n && n.imports && n.imports.impga && n.imports.impga.cess
              ? changeNumberToAccountingString(n.imports.impga.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "IMPGSEZ - Import of goods from SEZ",
          table: "",
          igst:
            n && n.imports && n.imports.impgsez && n.imports.impgsez.igst
              ? changeNumberToAccountingString(n.imports.impgsez.igst)
              : "0.00",
          cgst:
            n && n.imports && n.imports.impgsez && n.imports.impgsez.cgst
              ? changeNumberToAccountingString(n.imports.impgsez.cgst)
              : "0.00",
          sgst:
            n && n.imports && n.imports.impgsez && n.imports.impgsez.sgst
              ? changeNumberToAccountingString(n.imports.impgsez.sgst)
              : "0.00",
          cess:
            n && n.imports && n.imports.impgsez && n.imports.impgsez.cess
              ? changeNumberToAccountingString(n.imports.impgsez.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "IMPGSEZ (Amendment)",
          table: "",
          igst:
            n && n.imports && n.imports.impgasez && n.imports.impgasez.igst
              ? changeNumberToAccountingString(n.imports.impgasez.igst)
              : "0.00",
          cgst:
            n && n.imports && n.imports.impgasez && n.imports.impgasez.cgst
              ? changeNumberToAccountingString(n.imports.impgasez.cgst)
              : "0.00",
          sgst:
            n && n.imports && n.imports.impgasez && n.imports.impgasez.sgst
              ? changeNumberToAccountingString(n.imports.impgasez.sgst)
              : "0.00",
          cess:
            n && n.imports && n.imports.impgasez && n.imports.impgasez.cess
              ? changeNumberToAccountingString(n.imports.impgasez.cess)
              : "0.00",
          adv: "",
        },
      ],
      part_b: [
        {
          sno: "I",
          heading: "Others",
          table: "4(B)(2)",
          igst:
            n && n.othersup && n.othersup.igst
              ? changeNumberToAccountingString(n.othersup.igst)
              : "0.00",
          cgst:
            n && n.othersup && n.othersup.cgst
              ? changeNumberToAccountingString(n.othersup.cgst)
              : "0.00",
          sgst:
            n && n.othersup && n.othersup.sgst
              ? changeNumberToAccountingString(n.othersup.sgst)
              : "0.00",
          cess:
            n && n.othersup && n.othersup.cess
              ? changeNumberToAccountingString(n.othersup.cess)
              : "0.00",
          adv: "If this is positive, Credit shall be reversed under Table 4(B)(2) of FORM GSTR-3B. \n If this is negative, then credit may be reclaimed subject to reversal of the same on an earlier instance.",
        },
        {
          sno: "",
          heading: "B2B - Credit notes",
          table: "",
          igst:
            n && n.othersup && n.othersup.cdnr && n.othersup.cdnr.igst
              ? changeNumberToAccountingString(n.othersup.cdnr.igst)
              : "0.00",
          cgst:
            n && n.othersup && n.othersup.cdnr && n.othersup.cdnr.cgst
              ? changeNumberToAccountingString(n.othersup.cdnr.cgst)
              : "0.00",
          sgst:
            n && n.othersup && n.othersup.cdnr && n.othersup.cdnr.sgst
              ? changeNumberToAccountingString(n.othersup.cdnr.sgst)
              : "0.00",
          cess:
            n && n.othersup && n.othersup.cdnr && n.othersup.cdnr.cess
              ? changeNumberToAccountingString(n.othersup.cdnr.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Credit notes (Amendment)",
          table: "",
          igst:
            n && n.othersup && n.othersup.cdnra && n.othersup.cdnra.igst
              ? changeNumberToAccountingString(n.othersup.cdnra.igst)
              : "0.00",
          cgst:
            n && n.othersup && n.othersup.cdnra && n.othersup.cdnra.cgst
              ? changeNumberToAccountingString(n.othersup.cdnra.cgst)
              : "0.00",
          sgst:
            n && n.othersup && n.othersup.cdnra && n.othersup.cdnra.sgst
              ? changeNumberToAccountingString(n.othersup.cdnra.sgst)
              : "0.00",
          cess:
            n && n.othersup && n.othersup.cdnra && n.othersup.cdnra.cess
              ? changeNumberToAccountingString(n.othersup.cdnra.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Credit notes (Reverse charge)",
          table: "",
          igst:
            n && n.othersup && n.othersup.cdnrrev && n.othersup.cdnrrev.igst
              ? changeNumberToAccountingString(n.othersup.cdnrrev.igst)
              : "0.00",
          cgst:
            n && n.othersup && n.othersup.cdnrrev && n.othersup.cdnrrev.cgst
              ? changeNumberToAccountingString(n.othersup.cdnrrev.cgst)
              : "0.00",
          sgst:
            n && n.othersup && n.othersup.cdnrrev && n.othersup.cdnrrev.sgst
              ? changeNumberToAccountingString(n.othersup.cdnrrev.sgst)
              : "0.00",
          cess:
            n && n.othersup && n.othersup.cdnrrev && n.othersup.cdnrrev.cess
              ? changeNumberToAccountingString(n.othersup.cdnrrev.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Credit notes (Reverse charge)(Amendment)",
          table: "",
          igst:
            n && n.othersup && n.othersup.cdnrarev && n.othersup.cdnrarev.igst
              ? changeNumberToAccountingString(n.othersup.cdnrarev.igst)
              : "0.00",
          cgst:
            n && n.othersup && n.othersup.cdnrarev && n.othersup.cdnrarev.cgst
              ? changeNumberToAccountingString(n.othersup.cdnrarev.cgst)
              : "0.00",
          sgst:
            n && n.othersup && n.othersup.cdnrarev && n.othersup.cdnrarev.sgst
              ? changeNumberToAccountingString(n.othersup.cdnrarev.sgst)
              : "0.00",
          cess:
            n && n.othersup && n.othersup.cdnrarev && n.othersup.cdnrarev.cess
              ? changeNumberToAccountingString(n.othersup.cdnrarev.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "ISD - Credit notes",
          table: "",
          igst:
            n && n.othersup && n.othersup.isd && n.othersup.isd.igst
              ? changeNumberToAccountingString(n.othersup.isd.igst)
              : "0.00",
          cgst:
            n && n.othersup && n.othersup.isd && n.othersup.isd.cgst
              ? changeNumberToAccountingString(n.othersup.isd.cgst)
              : "0.00",
          sgst:
            n && n.othersup && n.othersup.isd && n.othersup.isd.sgst
              ? changeNumberToAccountingString(n.othersup.isd.sgst)
              : "0.00",
          cess:
            n && n.othersup && n.othersup.isd && n.othersup.isd.cess
              ? changeNumberToAccountingString(n.othersup.isd.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "ISD - Credit notes (Amendment)",
          table: "",
          igst:
            n && n.othersup && n.othersup.isda && n.othersup.isda.igst
              ? changeNumberToAccountingString(n.othersup.isda.igst)
              : "0.00",
          cgst:
            n && n.othersup && n.othersup.isda && n.othersup.isda.cgst
              ? changeNumberToAccountingString(n.othersup.isda.cgst)
              : "0.00",
          sgst:
            n && n.othersup && n.othersup.isda && n.othersup.isda.sgst
              ? changeNumberToAccountingString(n.othersup.isda.sgst)
              : "0.00",
          cess:
            n && n.othersup && n.othersup.isda && n.othersup.isda.cess
              ? changeNumberToAccountingString(n.othersup.isda.cess)
              : "0.00",
          adv: "",
        },
      ],
    }),
    (e.itcunval = {
      part_a: [
        {
          sno: "I",
          heading:
            "All other ITC - Supplies from registered persons other than reverse charge",
          table: "NA",
          igst:
            t && t.nonrevsup && t.nonrevsup.igst
              ? changeNumberToAccountingString(t.nonrevsup.igst)
              : "0.00",
          cgst:
            t && t.nonrevsup && t.nonrevsup.cgst
              ? changeNumberToAccountingString(t.nonrevsup.cgst)
              : "0.00",
          sgst:
            t && t.nonrevsup && t.nonrevsup.sgst
              ? changeNumberToAccountingString(t.nonrevsup.sgst)
              : "0.00",
          cess:
            t && t.nonrevsup && t.nonrevsup.cess
              ? changeNumberToAccountingString(t.nonrevsup.cess)
              : "0.00",
          adv: " Such credit shall not be taken in FORM GSTR-3B",
        },
        {
          sno: "",
          heading: "B2B - Invoices",
          table: "",
          igst:
            t && t.nonrevsup && t.nonrevsup.b2b && t.nonrevsup.b2b.igst
              ? changeNumberToAccountingString(t.nonrevsup.b2b.igst)
              : "0.00",
          cgst:
            t && t.nonrevsup && t.nonrevsup.b2b && t.nonrevsup.b2b.cgst
              ? changeNumberToAccountingString(t.nonrevsup.b2b.cgst)
              : "0.00",
          sgst:
            t && t.nonrevsup && t.nonrevsup.b2b && t.nonrevsup.b2b.sgst
              ? changeNumberToAccountingString(t.nonrevsup.b2b.sgst)
              : "0.00",
          cess:
            t && t.nonrevsup && t.nonrevsup.b2b && t.nonrevsup.b2b.cess
              ? changeNumberToAccountingString(t.nonrevsup.b2b.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Debit notes",
          table: "",
          igst:
            t && t.nonrevsup && t.nonrevsup.cdnr && t.nonrevsup.cdnr.igst
              ? changeNumberToAccountingString(t.nonrevsup.cdnr.igst)
              : "0.00",
          cgst:
            t && t.nonrevsup && t.nonrevsup.cdnr && t.nonrevsup.cdnr.cgst
              ? changeNumberToAccountingString(t.nonrevsup.cdnr.cgst)
              : "0.00",
          sgst:
            t && t.nonrevsup && t.nonrevsup.cdnr && t.nonrevsup.cdnr.sgst
              ? changeNumberToAccountingString(t.nonrevsup.cdnr.sgst)
              : "0.00",
          cess:
            t && t.nonrevsup && t.nonrevsup.cdnr && t.nonrevsup.cdnr.cess
              ? changeNumberToAccountingString(t.nonrevsup.cdnr.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Invoices (Amendment)",
          table: "",
          igst:
            t && t.nonrevsup && t.nonrevsup.b2ba && t.nonrevsup.b2ba.igst
              ? changeNumberToAccountingString(t.nonrevsup.b2ba.igst)
              : "0.00",
          cgst:
            t && t.nonrevsup && t.nonrevsup.b2ba && t.nonrevsup.b2ba.cgst
              ? changeNumberToAccountingString(t.nonrevsup.b2ba.cgst)
              : "0.00",
          sgst:
            t && t.nonrevsup && t.nonrevsup.b2ba && t.nonrevsup.b2ba.sgst
              ? changeNumberToAccountingString(t.nonrevsup.b2ba.sgst)
              : "0.00",
          cess:
            t && t.nonrevsup && t.nonrevsup.b2ba && t.nonrevsup.b2ba.cess
              ? changeNumberToAccountingString(t.nonrevsup.b2ba.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Debit notes (Amendment)",
          table: "",
          igst:
            t && t.nonrevsup && t.nonrevsup.cdnra && t.nonrevsup.cdnra.igst
              ? changeNumberToAccountingString(t.nonrevsup.cdnra.igst)
              : "0.00",
          cgst:
            t && t.nonrevsup && t.nonrevsup.cdnra && t.nonrevsup.cdnra.cgst
              ? changeNumberToAccountingString(t.nonrevsup.cdnra.cgst)
              : "0.00",
          sgst:
            t && t.nonrevsup && t.nonrevsup.cdnra && t.nonrevsup.cdnra.sgst
              ? changeNumberToAccountingString(t.nonrevsup.cdnra.sgst)
              : "0.00",
          cess:
            t && t.nonrevsup && t.nonrevsup.cdnra && t.nonrevsup.cdnra.cess
              ? changeNumberToAccountingString(t.nonrevsup.cdnra.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "II",
          heading: "Inward Supplies from ISD",
          table: "NA",
          igst:
            t && t.isdsup && t.isdsup.igst
              ? changeNumberToAccountingString(t.isdsup.igst)
              : "0.00",
          cgst:
            t && t.isdsup && t.isdsup.cgst
              ? changeNumberToAccountingString(t.isdsup.cgst)
              : "0.00",
          sgst:
            t && t.isdsup && t.isdsup.sgst
              ? changeNumberToAccountingString(t.isdsup.sgst)
              : "0.00",
          cess:
            t && t.isdsup && t.isdsup.cess
              ? changeNumberToAccountingString(t.isdsup.cess)
              : "0.00",
          adv: " Such credit shall not be taken in FORM GSTR-3B",
        },
        {
          sno: "",
          heading: "ISD - Invoices",
          table: "",
          igst:
            t && t.isdsup && t.isdsup.isd && t.isdsup.isd.igst
              ? changeNumberToAccountingString(t.isdsup.isd.igst)
              : "0.00",
          cgst:
            t && t.isdsup && t.isdsup.isd && t.isdsup.isd.cgst
              ? changeNumberToAccountingString(t.isdsup.isd.cgst)
              : "0.00",
          sgst:
            t && t.isdsup && t.isdsup.isd && t.isdsup.isd.sgst
              ? changeNumberToAccountingString(t.isdsup.isd.sgst)
              : "0.00",
          cess:
            t && t.isdsup && t.isdsup.isd && t.isdsup.isd.cess
              ? changeNumberToAccountingString(t.isdsup.isd.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "ISD - Invoices (Amendment)",
          table: "",
          igst:
            t && t.isdsup && t.isdsup.isda && t.isdsup.isda.igst
              ? changeNumberToAccountingString(t.isdsup.isda.igst)
              : "0.00",
          cgst:
            t && t.isdsup && t.isdsup.isda && t.isdsup.isda.cgst
              ? changeNumberToAccountingString(t.isdsup.isda.cgst)
              : "0.00",
          sgst:
            t && t.isdsup && t.isdsup.isda && t.isdsup.isda.sgst
              ? changeNumberToAccountingString(t.isdsup.isda.sgst)
              : "0.00",
          cess:
            t && t.isdsup && t.isdsup.isda && t.isdsup.isda.cess
              ? changeNumberToAccountingString(t.isdsup.isda.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "III",
          heading: "Inward Supplies liable for reverse charge",
          table: "3.1(d)",
          igst:
            t && t.revsup && t.revsup.igst
              ? changeNumberToAccountingString(t.revsup.igst)
              : "0.00",
          cgst:
            t && t.revsup && t.revsup.cgst
              ? changeNumberToAccountingString(t.revsup.cgst)
              : "0.00",
          sgst:
            t && t.revsup && t.revsup.sgst
              ? changeNumberToAccountingString(t.revsup.sgst)
              : "0.00",
          cess:
            t && t.revsup && t.revsup.cess
              ? changeNumberToAccountingString(t.revsup.cess)
              : "0.00",
          adv: "These supplies shall be declared in Table 3.1(d) of FORM GSTR-3B for payment of tax. \n However, credit will not be available on the same.",
        },
        {
          sno: "",
          heading: "B2B - Invoices",
          table: "",
          igst:
            t && t.revsup && t.revsup.b2b && t.revsup.b2b.igst
              ? changeNumberToAccountingString(t.revsup.b2b.igst)
              : "0.00",
          cgst:
            t && t.revsup && t.revsup.b2b && t.revsup.b2b.cgst
              ? changeNumberToAccountingString(t.revsup.b2b.cgst)
              : "0.00",
          sgst:
            t && t.revsup && t.revsup.b2b && t.revsup.b2b.sgst
              ? changeNumberToAccountingString(t.revsup.b2b.sgst)
              : "0.00",
          cess:
            t && t.revsup && t.revsup.b2b && t.revsup.b2b.cess
              ? changeNumberToAccountingString(t.revsup.b2b.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Debit notes",
          table: "",
          igst:
            t && t.revsup && t.revsup.cdnr && t.revsup.cdnr.igst
              ? changeNumberToAccountingString(t.revsup.cdnr.igst)
              : "0.00",
          cgst:
            t && t.revsup && t.revsup.cdnr && t.revsup.cdnr.cgst
              ? changeNumberToAccountingString(t.revsup.cdnr.cgst)
              : "0.00",
          sgst:
            t && t.revsup && t.revsup.cdnr && t.revsup.cdnr.sgst
              ? changeNumberToAccountingString(t.revsup.cdnr.sgst)
              : "0.00",
          cess:
            t && t.revsup && t.revsup.cdnr && t.revsup.cdnr.cess
              ? changeNumberToAccountingString(t.revsup.cdnr.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Invoices (Amendment)",
          table: "",
          igst:
            t && t.revsup && t.revsup.b2ba && t.revsup.b2ba.igst
              ? changeNumberToAccountingString(t.revsup.b2ba.igst)
              : "0.00",
          cgst:
            t && t.revsup && t.revsup.b2ba && t.revsup.b2ba.cgst
              ? changeNumberToAccountingString(t.revsup.b2ba.cgst)
              : "0.00",
          sgst:
            t && t.revsup && t.revsup.b2ba && t.revsup.b2ba.sgst
              ? changeNumberToAccountingString(t.revsup.b2ba.sgst)
              : "0.00",
          cess:
            t && t.revsup && t.revsup.b2ba && t.revsup.b2ba.cess
              ? changeNumberToAccountingString(t.revsup.b2ba.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Debit notes (Amendment)",
          table: "",
          igst:
            t && t.revsup && t.revsup.cdnra && t.revsup.cdnra.igst
              ? changeNumberToAccountingString(t.revsup.cdnra.igst)
              : "0.00",
          cgst:
            t && t.revsup && t.revsup.cdnra && t.revsup.cdnra.cgst
              ? changeNumberToAccountingString(t.revsup.cdnra.cgst)
              : "0.00",
          sgst:
            t && t.revsup && t.revsup.cdnra && t.revsup.cdnra.sgst
              ? changeNumberToAccountingString(t.revsup.cdnra.sgst)
              : "0.00",
          cess:
            t && t.revsup && t.revsup.cdnra && t.revsup.cdnra.cess
              ? changeNumberToAccountingString(t.revsup.cdnra.cess)
              : "0.00",
          adv: "",
        },
      ],
      part_b: [
        {
          sno: "I",
          heading: "Others",
          table: "4(B)(2)",
          igst:
            t && t.othersup && t.othersup.igst
              ? changeNumberToAccountingString(t.othersup.igst)
              : "0.00",
          cgst:
            t && t.othersup && t.othersup.cgst
              ? changeNumberToAccountingString(t.othersup.cgst)
              : "0.00",
          sgst:
            t && t.othersup && t.othersup.sgst
              ? changeNumberToAccountingString(t.othersup.sgst)
              : "0.00",
          cess:
            t && t.othersup && t.othersup.cess
              ? changeNumberToAccountingString(t.othersup.cess)
              : "0.00",
          adv: "Credit shall be reversed under Table 4(B)(2) of FORM GSTR-3B.",
        },
        {
          sno: "",
          heading: "B2B - Credit notes",
          table: "",
          igst:
            t && t.othersup && t.othersup.cdnr && t.othersup.cdnr.igst
              ? changeNumberToAccountingString(t.othersup.cdnr.igst)
              : "0.00",
          cgst:
            t && t.othersup && t.othersup.cdnr && t.othersup.cdnr.cgst
              ? changeNumberToAccountingString(t.othersup.cdnr.cgst)
              : "0.00",
          sgst:
            t && t.othersup && t.othersup.cdnr && t.othersup.cdnr.sgst
              ? changeNumberToAccountingString(t.othersup.cdnr.sgst)
              : "0.00",
          cess:
            t && t.othersup && t.othersup.cdnr && t.othersup.cdnr.cess
              ? changeNumberToAccountingString(t.othersup.cdnr.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Credit notes (Amendment)",
          table: "",
          igst:
            t && t.othersup && t.othersup.cdnra && t.othersup.cdnra.igst
              ? changeNumberToAccountingString(t.othersup.cdnra.igst)
              : "0.00",
          cgst:
            t && t.othersup && t.othersup.cdnra && t.othersup.cdnra.cgst
              ? changeNumberToAccountingString(t.othersup.cdnra.cgst)
              : "0.00",
          sgst:
            t && t.othersup && t.othersup.cdnra && t.othersup.cdnra.sgst
              ? changeNumberToAccountingString(t.othersup.cdnra.sgst)
              : "0.00",
          cess:
            t && t.othersup && t.othersup.cdnra && t.othersup.cdnra.cess
              ? changeNumberToAccountingString(t.othersup.cdnra.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Credit notes (Reverse charge)",
          table: "",
          igst:
            t && t.othersup && t.othersup.cdnrrev && t.othersup.cdnrrev.igst
              ? changeNumberToAccountingString(t.othersup.cdnrrev.igst)
              : "0.00",
          cgst:
            t && t.othersup && t.othersup.cdnrrev && t.othersup.cdnrrev.cgst
              ? changeNumberToAccountingString(t.othersup.cdnrrev.cgst)
              : "0.00",
          sgst:
            t && t.othersup && t.othersup.cdnrrev && t.othersup.cdnrrev.sgst
              ? changeNumberToAccountingString(t.othersup.cdnrrev.sgst)
              : "0.00",
          cess:
            t && t.othersup && t.othersup.cdnrrev && t.othersup.cdnrrev.cess
              ? changeNumberToAccountingString(t.othersup.cdnrrev.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "B2B - Credit notes (Reverse charge)(Amendment)",
          table: "",
          igst:
            t && t.othersup && t.othersup.cdnrarev && t.othersup.cdnrarev.igst
              ? changeNumberToAccountingString(t.othersup.cdnrarev.igst)
              : "0.00",
          cgst:
            t && t.othersup && t.othersup.cdnrarev && t.othersup.cdnrarev.cgst
              ? changeNumberToAccountingString(t.othersup.cdnrarev.cgst)
              : "0.00",
          sgst:
            t && t.othersup && t.othersup.cdnrarev && t.othersup.cdnrarev.sgst
              ? changeNumberToAccountingString(t.othersup.cdnrarev.sgst)
              : "0.00",
          cess:
            t && t.othersup && t.othersup.cdnrarev && t.othersup.cdnrarev.cess
              ? changeNumberToAccountingString(t.othersup.cdnrarev.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "ISD - Credit notes",
          table: "",
          igst:
            t && t.othersup && t.othersup.isd && t.othersup.isd.igst
              ? changeNumberToAccountingString(t.othersup.isd.igst)
              : "0.00",
          cgst:
            t && t.othersup && t.othersup.isd && t.othersup.isd.cgst
              ? changeNumberToAccountingString(t.othersup.isd.cgst)
              : "0.00",
          sgst:
            t && t.othersup && t.othersup.isd && t.othersup.isd.sgst
              ? changeNumberToAccountingString(t.othersup.isd.sgst)
              : "0.00",
          cess:
            t && t.othersup && t.othersup.isd && t.othersup.isd.cess
              ? changeNumberToAccountingString(t.othersup.isd.cess)
              : "0.00",
          adv: "",
        },
        {
          sno: "",
          heading: "ISD - Credit notes (Amendment)",
          table: "",
          igst:
            t && t.othersup && t.othersup.isda && t.othersup.isda.igst
              ? changeNumberToAccountingString(t.othersup.isda.igst)
              : "0.00",
          cgst:
            t && t.othersup && t.othersup.isda && t.othersup.isda.cgst
              ? changeNumberToAccountingString(t.othersup.isda.cgst)
              : "0.00",
          sgst:
            t && t.othersup && t.othersup.isda && t.othersup.isda.sgst
              ? changeNumberToAccountingString(t.othersup.isda.sgst)
              : "0.00",
          cess:
            t && t.othersup && t.othersup.isda && t.othersup.isda.cess
              ? changeNumberToAccountingString(t.othersup.isda.cess)
              : "0.00",
          adv: "",
        },
      ],
    }),
    e
  );
};

const addITCSummarysheet = (n, t, e) => {
  window.isIFFLive = null != e && e;
  let l = window.isIFFLive
      ? "FORM GSTR-2B has been generated on the basis of the information furnished by your suppliers in their respective FORMS GSTR-1/IFF,5 and 6. It also contains information on imports of goods from the ICEGATE system. This information is for guidance purposes only."
      : "FORM GSTR-2B has been generated on the basis of the information furnished by your suppliers in their respective FORMS GSTR-1,5 and 6. It also contains information on imports of goods from the ICEGATE system. This information is for guidance purposes only.",
    s = [
      {
        part: "Part A",
        txt: "ITC Available - Credit may be claimed in relevant headings in GSTR-3B",
      },
      {
        part: "Part B",
        txt: "ITC Reversal - Credit should be reversed in relevant headings in GSTR-3B",
      },
    ],
    r = t.addWorksheet("ITC Available");
  r.mergeCells("A1:J1");
  let i = r.getCell("A1");
  (i.value = "FORM GSTR-2B"),
    setStyle(i, 12, "middle", "002060", "FFFFFF", !1),
    (i.font.name = "Calibri"),
    r.mergeCells("A2:J4");
  let o = r.getCell("A2");
  (o.value = l),
    setStyle(o, 8, "middle", "F4B084", "000000", !0),
    r.mergeCells("A5:J5");
  let a = r.getCell("A5");
  (a.value = "FORM SUMMARY - ITC Available"),
    setStyle(a, 11, "middle", "1F4E78", "FFFFFF", !1),
    (a.font.name = "Calibri"),
    (a.alignment.horizontal = "left");
  for (let h = 0; h < constants.SUMMARY_HEADER.length; h++) {
    7 == h && r.mergeCells(6, h + 1, 6, h + 3);
    let n = r.getCell(6, h + 1);
    (n.value = constants.SUMMARY_HEADER[h]),
      setStyle(n, 8, "middle", "002060", "FFFFFF", !0);
  }
  r.mergeCells("A7:J7");
  let u = r.getCell("A7");
  (u.value = "Credit which may be availed under FORM GSTR-3B"),
    setStyle(u, 8, "middle", "C65911", "FFFFFF", !0),
    (u.alignment.horizontal = "left");
  let c = r.getCell("A8");
  (c.value = s[0].part),
    setStyle(c, 8, "middle", "F4B084", "000000", !0),
    (c.alignment.horizontal = "left"),
    r.mergeCells("B8:J8");
  let d = r.getCell("B8");
  (d.value = s[0].txt),
    setStyle(d, 8, "middle", "F4B084", "000000", !0),
    (d.alignment.horizontal = "left"),
    n.itcval.part_a.forEach((n) => {
      let t = [];
      t.push(n.sno),
        t.push(n.heading),
        t.push(n.table),
        t.push(parseFloat(n.igst.replace(/,/g, ""))),
        t.push(parseFloat(n.cgst.replace(/,/g, ""))),
        t.push(parseFloat(n.sgst.replace(/,/g, ""))),
        t.push(parseFloat(n.cess.replace(/,/g, ""))),
        t.push(n.adv),
        r.addRow(t).eachCell((t, e) => {
          (t.alignment = {
            wrapText: !0,
          }),
            (t.font = {
              size: 9,
              name: "Calibri",
            }),
            (t.border = {
              top: {
                style: "thin",
              },
              left: {
                style: "thin",
              },
              bottom: {
                style: "thin",
              },
              right: {
                style: "thin",
              },
            }),
            n.sno &&
              "" != n.sno &&
              ((1 != e && 3 != e) ||
                (t.alignment = {
                  wrapText: !0,
                  vertical: "middle",
                  horizontal: "center",
                }),
              (2 != e && 3 != e) || (t.font.bold = !0)),
            (4 != e && 5 != e && 6 != e && 7 != e) ||
              ((t.style.alignment = {
                horizontal: "right",
              }),
              (t.numFmt = "0.00"));
        });
    });
  let g = r.getCell("A27");
  (g.value = s[1].part),
    setStyle(g, 8, "middle", "F4B084", "000000", !0),
    (g.alignment.horizontal = "left"),
    r.mergeCells("B27:J27");
  let f = r.getCell("B27");
  (f.value = s[1].txt),
    setStyle(f, 8, "middle", "F4B084", "000000", !0),
    (f.alignment.horizontal = "left"),
    n.itcval.part_b.forEach((n) => {
      let t = [];
      t.push(n.sno),
        t.push(n.heading),
        t.push(n.table),
        t.push(parseFloat(n.igst.replace(/,/g, ""))),
        t.push(parseFloat(n.cgst.replace(/,/g, ""))),
        t.push(parseFloat(n.sgst.replace(/,/g, ""))),
        t.push(parseFloat(n.cess.replace(/,/g, ""))),
        t.push(n.adv),
        r.addRow(t).eachCell((t, e) => {
          (t.alignment = {
            wrapText: !0,
          }),
            (t.font = {
              size: 9,
              name: "Calibri",
            }),
            (t.border = {
              top: {
                style: "thin",
              },
              left: {
                style: "thin",
              },
              bottom: {
                style: "thin",
              },
              right: {
                style: "thin",
              },
            }),
            n.sno &&
              "" != n.sno &&
              ((1 != e && 3 != e) ||
                (t.alignment = {
                  wrapText: !0,
                  vertical: "middle",
                  horizontal: "center",
                }),
              (2 != e && 3 != e) || (t.font.bold = !0)),
            (4 != e && 5 != e && 6 != e && 7 != e) ||
              ((t.style.alignment = {
                horizontal: "right",
              }),
              (t.numFmt = "0.00"));
        });
    }),
    r.mergeCells(9, 8, 9, 10),
    (r.getCell(9, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(10, 1, 13, 1),
    r.mergeCells(10, 3, 13, 3),
    r.mergeCells(10, 8, 13, 10),
    setDetlCell(r.getCell("A10")),
    setCellBackground(r.getCell("C10")),
    setCellBackground(r.getCell("H10")),
    r.mergeCells(14, 8, 14, 10),
    (r.getCell(14, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(15, 1, 16, 1),
    r.mergeCells(15, 3, 16, 3),
    r.mergeCells(15, 8, 16, 10),
    setDetlCell(r.getCell("A15")),
    setCellBackground(r.getCell("C15")),
    setCellBackground(r.getCell("H15")),
    r.mergeCells(17, 8, 17, 10),
    (r.getCell(17, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(18, 1, 21, 1),
    r.mergeCells(18, 3, 21, 3),
    r.mergeCells(18, 8, 21, 10),
    setDetlCell(r.getCell("A18")),
    setCellBackground(r.getCell("C18")),
    setCellBackground(r.getCell("H18")),
    r.mergeCells(22, 8, 22, 10),
    (r.getCell(22, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(23, 1, 26, 1),
    r.mergeCells(23, 3, 26, 3),
    r.mergeCells(23, 8, 26, 10),
    setDetlCell(r.getCell("A23")),
    setCellBackground(r.getCell("C23")),
    setCellBackground(r.getCell("H23")),
    r.mergeCells(28, 8, 28, 10),
    (r.getCell(28, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(29, 1, 34, 1),
    r.mergeCells(29, 3, 34, 3),
    r.mergeCells(29, 8, 34, 10),
    setDetlCell(r.getCell("A29")),
    setCellBackground(r.getCell("C29")),
    setCellBackground(r.getCell("H29")),
    (r.getColumn(1).width = 6.14),
    (r.getColumn(2).width = 29),
    (r.getColumn(3).width = 6.57),
    (r.getColumn(4).width = 8.43),
    (r.getColumn(5).width = 8.43),
    (r.getColumn(6).width = 8.43),
    (r.getColumn(7).width = 8.43),
    (r.getColumn(8).width = 8.43),
    (r.getColumn(9).width = 8.43),
    (r.getColumn(10).width = 15.43);
};

const addITCUnvalSummarysheet = (n, t, e) => {
  window.isIFFLive = null != e && e;
  let l = window.isIFFLive
      ? "FORM GSTR-2B has been generated on the basis of the information furnished by your suppliers in their respective FORMS GSTR-1/IFF,5 and 6. It also contains information on imports of goods from the ICEGATE system. This information is for guidance purposes only."
      : "FORM GSTR-2B has been generated on the basis of the information furnished by your suppliers in their respective FORMS GSTR-1,5 and 6. It also contains information on imports of goods from the ICEGATE system. This information is for guidance purposes only.",
    s = [
      {
        part: "Part A",
        txt: "ITC Not Available",
      },
      {
        part: "Part B",
        txt: "ITC Reversal",
      },
    ],
    r = t.addWorksheet("ITC not available");
  r.mergeCells("A1:J1");
  let i = r.getCell("A1");
  (i.value = "FORM GSTR-2B"),
    setStyle(i, 12, "middle", "002060", "FFFFFF", !1),
    (i.font.name = "Calibri"),
    r.mergeCells("A2:J4");
  let o = r.getCell("A2");
  (o.value = l),
    setStyle(o, 8, "middle", "F4B084", "000000", !0),
    r.mergeCells("A5:J5");
  let a = r.getCell("A5");
  (a.value = "FORM SUMMARY - ITC Not Available"),
    setStyle(a, 11, "middle", "1F4E78", "FFFFFF", !1),
    (a.font.name = "Calibri"),
    (a.alignment.horizontal = "left");
  for (let h = 0; h < constants.SUMMARY_HEADER.length; h++) {
    7 == h && r.mergeCells(6, h + 1, 6, h + 3);
    let n = r.getCell(6, h + 1);
    (n.value = constants.SUMMARY_HEADER[h]),
      setStyle(n, 8, "middle", "002060", "FFFFFF", !0);
  }
  r.mergeCells("A7:J7");
  let u = r.getCell("A7");
  (u.value = "Credit which may not be availed under FORM GSTR-3B"),
    setStyle(u, 8, "middle", "C65911", "FFFFFF", !0),
    (u.alignment.horizontal = "left");
  let c = r.getCell("A8");
  (c.value = s[0].part),
    setStyle(c, 8, "middle", "F4B084", "000000", !0),
    (c.alignment.horizontal = "left"),
    r.mergeCells("B8:J8");
  let d = r.getCell("B8");
  (d.value = s[0].txt),
    setStyle(d, 8, "middle", "F4B084", "000000", !0),
    (d.alignment.horizontal = "left"),
    n.itcunval.part_a.forEach((n) => {
      let t = [];
      t.push(n.sno),
        t.push(n.heading),
        t.push(n.table),
        t.push(parseFloat(n.igst.replace(/,/g, ""))),
        t.push(parseFloat(n.cgst.replace(/,/g, ""))),
        t.push(parseFloat(n.sgst.replace(/,/g, ""))),
        t.push(parseFloat(n.cess.replace(/,/g, ""))),
        t.push(n.adv),
        r.addRow(t).eachCell((t, e) => {
          (t.alignment = {
            wrapText: !0,
          }),
            (t.font = {
              size: 9,
              name: "Calibri",
            }),
            (t.border = {
              top: {
                style: "thin",
              },
              left: {
                style: "thin",
              },
              bottom: {
                style: "thin",
              },
              right: {
                style: "thin",
              },
            }),
            n.sno &&
              "" != n.sno &&
              ((1 != e && 3 != e) ||
                (t.alignment = {
                  wrapText: !0,
                  vertical: "middle",
                  horizontal: "center",
                }),
              (2 != e && 3 != e) || (t.font.bold = !0)),
            (4 != e && 5 != e && 6 != e && 7 != e) ||
              ((t.style.alignment = {
                horizontal: "right",
              }),
              (t.numFmt = "0.00"));
        });
    });
  let g = r.getCell("A22");
  (g.value = s[1].part),
    setStyle(g, 8, "middle", "F4B084", "000000", !0),
    (g.alignment.horizontal = "left"),
    r.mergeCells("B22:J22");
  let f = r.getCell("B22");
  (f.value = s[1].txt),
    setStyle(f, 8, "middle", "F4B084", "000000", !0),
    (f.alignment.horizontal = "left"),
    n.itcunval.part_b.forEach((n) => {
      let t = [];
      t.push(n.sno),
        t.push(n.heading),
        t.push(n.table),
        t.push(parseFloat(n.igst.replace(/,/g, ""))),
        t.push(parseFloat(n.cgst.replace(/,/g, ""))),
        t.push(parseFloat(n.sgst.replace(/,/g, ""))),
        t.push(parseFloat(n.cess.replace(/,/g, ""))),
        t.push(n.adv),
        r.addRow(t).eachCell((t, e) => {
          (t.alignment = {
            wrapText: !0,
          }),
            (t.font = {
              size: 9,
              name: "Calibri",
            }),
            (t.border = {
              top: {
                style: "thin",
              },
              left: {
                style: "thin",
              },
              bottom: {
                style: "thin",
              },
              right: {
                style: "thin",
              },
            }),
            n.sno &&
              "" != n.sno &&
              ((1 != e && 3 != e) ||
                (t.alignment = {
                  wrapText: !0,
                  vertical: "middle",
                  horizontal: "center",
                }),
              (2 != e && 3 != e) || (t.font.bold = !0)),
            (4 != e && 5 != e && 6 != e && 7 != e) ||
              ((t.style.alignment = {
                horizontal: "right",
              }),
              (t.numFmt = "0.00"));
        });
    }),
    r.mergeCells(9, 8, 9, 10),
    (r.getCell(9, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(10, 1, 13, 1),
    r.mergeCells(10, 8, 13, 10),
    setDetlCell(r.getCell("A10")),
    setCellBackground(r.getCell("H10")),
    r.mergeCells(14, 8, 14, 10),
    (r.getCell(14, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(15, 1, 16, 1),
    r.mergeCells(15, 8, 16, 10),
    setDetlCell(r.getCell("A15")),
    setCellBackground(r.getCell("H15")),
    r.mergeCells(17, 8, 17, 10),
    (r.getCell(17, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(18, 1, 21, 1),
    r.mergeCells(18, 8, 21, 10),
    setDetlCell(r.getCell("A18")),
    setCellBackground(r.getCell("H18")),
    r.mergeCells(23, 8, 23, 10),
    (r.getCell(23, 8).alignment = {
      wrapText: !0,
      vertical: "middle",
      horizontal: "center",
    }),
    r.mergeCells(24, 1, 29, 1),
    r.mergeCells(24, 8, 29, 10),
    setDetlCell(r.getCell("A24")),
    setCellBackground(r.getCell("H24")),
    (r.getColumn(1).width = 6.14),
    (r.getColumn(2).width = 29),
    (r.getColumn(3).width = 6.57),
    (r.getColumn(4).width = 8.43),
    (r.getColumn(5).width = 8.43),
    (r.getColumn(6).width = 8.43),
    (r.getColumn(7).width = 8.43),
    (r.getColumn(8).width = 8.43),
    (r.getColumn(9).width = 8.43),
    (r.getColumn(10).width = 15.43);
};

const addB2Bworksheet = (n, t, e) => {
  let l = t.addWorksheet("B2B");
  l.mergeCells("A1:V3");
  let s = l.getCell("A1");
  (s.value = constants.EXCEL_HEADING_LBL),
    setStyle(s, 22, "middle", "203764", "FFFFFF", !1),
    l.mergeCells("A4:V4");
  let r = l.getCell("A4");
  if (
    ((r.value = "Taxable inward supplies received from registered persons"),
    setStyle(r, 11, "top", "FFF2CC", "000000", !0),
    null != e)
  )
    var i = e ? constants.DOC_HEADER_B2B_IFF : constants.DOC_HEADER_B2B;
  else i = constants.DOC_HEADER_B2B;
  for (let A = 0; A < i.length; A++)
    if (A < 2) {
      l.mergeCells(5, A + 1, 6, A + 1);
      let n = l.getCell(5, A + 1);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (2 === A) {
      l.mergeCells(5, A + 1, 5, A + 4);
      let n = l.getCell(5, A + 1);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (A > 2 && A < 7) {
      l.mergeCells(5, A + 4, 6, A + 4);
      let n = l.getCell(5, A + 4);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (7 === A) {
      l.mergeCells(5, A + 4, 5, A + 7);
      let n = l.getCell(5, A + 4);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else {
      l.mergeCells(5, A + 7, 6, A + 7);
      let n = l.getCell(5, A + 7);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    }
  for (let o = 0; o < constants.INV_HEADER_LBL.length; o++) {
    let n = l.getCell(6, o + 3);
    (n.value = constants.INV_HEADER_LBL[o]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  for (let o = 0; o < constants.TAX_AMT_LBL.length; o++) {
    let n = l.getCell(6, o + 11);
    (n.value = constants.TAX_AMT_LBL[o]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  null != n &&
    null != n &&
    n.forEach((n) => {
      n.items.forEach((t) => {
        let e = [];
        e.push(n.ctin),
          e.push(n.trdnm),
          e.push(n.inum),
          e.push(n.typ),
          e.push(n.dt),
          e.push(parseFloat(n.val.replace(/,/g, ""))),
          e.push(n.pos),
          e.push(n.rev),
          e.push(t.rt),
          e.push(parseFloat(t.txval.replace(/,/g, ""))),
          e.push(parseFloat(t.igst.replace(/,/g, ""))),
          e.push(parseFloat(t.cgst.replace(/,/g, ""))),
          e.push(parseFloat(t.sgst.replace(/,/g, ""))),
          e.push(parseFloat(t.cess.replace(/,/g, ""))),
          e.push(n.supprd),
          e.push(n.supfildt),
          e.push(n.itcavl),
          e.push(n.rsn),
          e.push(n.diffprcnt + "%"),
          e.push(n.srctyp),
          e.push(n.irn),
          e.push(n.irngendate),
          l.addRow(e).eachCell((n, t) => {
            (n.alignment = {
              wrapText: !0,
            }),
              (n.font = {
                size: 11,
                name: "Calibri",
              }),
              1 == t ||
              2 == t ||
              3 == t ||
              4 == t ||
              5 == t ||
              7 == t ||
              15 == t ||
              16 == t ||
              18 == t
                ? (n.style.alignment = {
                    horizontal: "left",
                  })
                : 8 == t || 17 == t
                ? (n.style.alignment = {
                    horizontal: "center",
                  })
                : (6 != t &&
                    9 != t &&
                    10 != t &&
                    11 != t &&
                    12 != t &&
                    13 != t &&
                    14 != t &&
                    19 != t) ||
                  ((n.style.alignment = {
                    horizontal: "right",
                  }),
                  9 != t && 19 != t && (n.numFmt = "0.00"));
          });
      });
    }),
    (l.getColumn(1).width = 20),
    (l.getColumn(2).width = 20),
    (l.getColumn(3).width = 16.86),
    (l.getColumn(4).width = 15.86),
    (l.getColumn(5).width = 15.86),
    (l.getColumn(6).width = 20),
    (l.getColumn(7).width = 20),
    (l.getColumn(8).width = 20),
    (l.getColumn(9).width = 10.14),
    (l.getColumn(10).width = 20),
    (l.getColumn(11).width = 20),
    (l.getColumn(12).width = 20),
    (l.getColumn(13).width = 20),
    (l.getColumn(14).width = 20),
    (l.getColumn(15).width = 20),
    (l.getColumn(16).width = 20),
    (l.getColumn(17).width = 20),
    (l.getColumn(18).width = 35),
    (l.getColumn(19).width = 20),
    (l.getColumn(20).width = 20),
    (l.getColumn(21).width = 85),
    (l.getColumn(22).width = 20),
    (l.state = "visible");
};

const addB2BAworksheet = (n, t, e) => {
  let l = t.addWorksheet("B2BA");
  l.mergeCells("A1:U3");
  let s = l.getCell("A1");
  (s.value = constants.EXCEL_HEADING_LBL),
    setStyle(s, 22, "middle", "203764", "FFFFFF", !1),
    l.mergeCells("A4:U4");
  let r = l.getCell("A4");
  (r.value = "Amendments to previously filed invoices by supplier"),
    setStyle(r, 11, "top", "FFF2CC", "000000", !0),
    l.mergeCells("A5:B5");
  let i = l.getCell("A5");
  (i.value = "Original Details"),
    setStyle(i, 11, "middle", "FFF2CC", "000000", !0),
    l.mergeCells("C5:U5");
  let o = l.getCell("C5");
  if (
    ((o.value = "Revised Details"),
    setStyle(o, 11, "middle", "DCC8DC", "000000", !0),
    null != e)
  )
    var a = e ? constants.DOC_HEADER_B2BA_IFF : constants.DOC_HEADER_B2BA;
  else a = constants.DOC_HEADER_B2BA;
  for (let A = 0; A < a.length; A++)
    if (A < 4) {
      l.mergeCells(6, A + 1, 7, A + 1);
      let n = l.getCell(6, A + 1);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (4 === A) {
      l.mergeCells(6, A + 1, 6, A + 4);
      let n = l.getCell(6, A + 1);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (A > 4 && A < 9) {
      l.mergeCells(6, A + 4, 7, A + 4);
      let n = l.getCell(6, A + 4);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (9 === A) {
      l.mergeCells(6, A + 4, 6, A + 7);
      let n = l.getCell(6, A + 4);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else {
      l.mergeCells(6, A + 7, 7, A + 7);
      let n = l.getCell(6, A + 7);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    }
  for (let u = 0; u < constants.INV_HEADER_LBL.length; u++) {
    let n = l.getCell(7, u + 5);
    (n.value = constants.INV_HEADER_LBL[u]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  for (let u = 0; u < constants.TAX_AMT_LBL.length; u++) {
    let n = l.getCell(7, u + 13);
    (n.value = constants.TAX_AMT_LBL[u]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  null != n &&
    null != n &&
    n.forEach((n) => {
      n.items.forEach((t) => {
        let e = [];
        e.push(n.oinum),
          e.push(n.oidt),
          e.push(n.ctin),
          e.push(n.trdnm),
          e.push(n.inum),
          e.push(n.typ),
          e.push(n.dt),
          e.push(parseFloat(n.val.replace(/,/g, ""))),
          e.push(n.pos),
          e.push(n.rev),
          e.push(t.rt),
          e.push(parseFloat(t.txval.replace(/,/g, ""))),
          e.push(parseFloat(t.igst.replace(/,/g, ""))),
          e.push(parseFloat(t.cgst.replace(/,/g, ""))),
          e.push(parseFloat(t.sgst.replace(/,/g, ""))),
          e.push(parseFloat(t.cess.replace(/,/g, ""))),
          e.push(n.supprd),
          e.push(n.supfildt),
          e.push(n.itcavl),
          e.push(n.rsn),
          e.push(n.diffprcnt + "%"),
          l.addRow(e).eachCell((n, t) => {
            (n.alignment = {
              wrapText: !0,
            }),
              (n.font = {
                size: 11,
                name: "Calibri",
              }),
              1 == t ||
              2 == t ||
              3 == t ||
              4 == t ||
              5 == t ||
              6 == t ||
              7 == t ||
              9 == t ||
              17 == t ||
              18 == t ||
              20 == t
                ? (n.style.alignment = {
                    horizontal: "left",
                  })
                : 10 == t || 19 == t
                ? (n.style.alignment = {
                    horizontal: "center",
                  })
                : (8 != t &&
                    11 != t &&
                    12 != t &&
                    13 != t &&
                    14 != t &&
                    15 != t &&
                    16 != t &&
                    21 != t) ||
                  ((n.style.alignment = {
                    horizontal: "right",
                  }),
                  11 != t && 21 != t && (n.numFmt = "0.00"));
          });
      });
    }),
    (l.getColumn(1).width = 14.14),
    (l.getColumn(2).width = 14.14),
    (l.getColumn(3).width = 20),
    (l.getColumn(4).width = 20),
    (l.getColumn(5).width = 15.86),
    (l.getColumn(6).width = 15.86),
    (l.getColumn(7).width = 15.86),
    (l.getColumn(8).width = 20),
    (l.getColumn(9).width = 20),
    (l.getColumn(10).width = 16.71),
    (l.getColumn(11).width = 10.43),
    (l.getColumn(12).width = 20),
    (l.getColumn(13).width = 16),
    (l.getColumn(14).width = 16),
    (l.getColumn(15).width = 16),
    (l.getColumn(16).width = 16),
    (l.getColumn(17).width = 15.57),
    (l.getColumn(18).width = 15.57),
    (l.getColumn(19).width = 20),
    (l.getColumn(20).width = 35),
    (l.getColumn(21).width = 20),
    (l.state = "visible");
};

const addCdnrworksheet = (n, t, e) => {
  let l = t.addWorksheet("B2B-CDNR");
  l.mergeCells("A1:W3");
  let s = l.getCell("A1");
  (s.value = constants.EXCEL_HEADING_LBL),
    setStyle(s, 22, "middle", "203764", "FFFFFF", !1),
    l.mergeCells("A4:W4");
  let r = l.getCell("A4");
  if (
    ((r.value = "Debit/Credit notes (Original)"),
    setStyle(r, 11, "top", "FFF2CC", "000000", !0),
    null != e)
  )
    var i = e ? constants.DOC_HEADER_CDNR_IFF : constants.DOC_HEADER_CDNR;
  else i = constants.DOC_HEADER_CDNR;
  for (let A = 0; A < i.length; A++)
    if (A < 2) {
      l.mergeCells(5, A + 1, 6, A + 1);
      let n = l.getCell(5, A + 1);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (2 === A) {
      l.mergeCells(5, A + 1, 5, A + 5);
      let n = l.getCell(5, A + 1);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (A > 2 && A < 7) {
      l.mergeCells(5, A + 5, 6, A + 5);
      let n = l.getCell(5, A + 5);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (7 === A) {
      l.mergeCells(5, A + 5, 5, A + 8);
      let n = l.getCell(5, A + 5);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else {
      l.mergeCells(5, A + 8, 6, A + 8);
      let n = l.getCell(5, A + 8);
      (n.value = i[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    }
  for (let o = 0; o < constants.CDNR_DTL_LBL.length; o++) {
    let n = l.getCell(6, o + 3);
    (n.value = constants.CDNR_DTL_LBL[o]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  for (let o = 0; o < constants.TAX_AMT_LBL.length; o++) {
    let n = l.getCell(6, o + 12);
    (n.value = constants.TAX_AMT_LBL[o]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  null != n &&
    null != n &&
    n.forEach((n) => {
      n.items.forEach((t) => {
        let e = [];
        e.push(n.ctin),
          e.push(n.trdnm),
          e.push(n.ntnum),
          e.push(n.typ),
          e.push(n.suptyp),
          e.push(n.dt),
          e.push(parseFloat(n.val.replace(/,/g, ""))),
          e.push(n.pos),
          e.push(n.rev),
          e.push(t.rt),
          e.push(parseFloat(t.txval.replace(/,/g, ""))),
          e.push(parseFloat(t.igst.replace(/,/g, ""))),
          e.push(parseFloat(t.cgst.replace(/,/g, ""))),
          e.push(parseFloat(t.sgst.replace(/,/g, ""))),
          e.push(parseFloat(t.cess.replace(/,/g, ""))),
          e.push(n.supprd),
          e.push(n.supfildt),
          e.push(n.itcavl),
          e.push(n.rsn),
          e.push(n.diffprcnt + "%"),
          e.push(n.srctyp),
          e.push(n.irn),
          e.push(n.irngendate),
          l.addRow(e).eachCell((n, t) => {
            (n.alignment = {
              wrapText: !0,
            }),
              (n.font = {
                size: 11,
                name: "Calibri",
              }),
              1 == t ||
              2 == t ||
              3 == t ||
              4 == t ||
              5 == t ||
              6 == t ||
              8 == t ||
              16 == t ||
              17 == t ||
              19 == t
                ? (n.style.alignment = {
                    horizontal: "left",
                  })
                : 9 == t || 18 == t
                ? (n.style.alignment = {
                    horizontal: "center",
                  })
                : (7 != t &&
                    10 != t &&
                    11 != t &&
                    12 != t &&
                    13 != t &&
                    14 != t &&
                    15 != t &&
                    20 != t) ||
                  ((n.style.alignment = {
                    horizontal: "right",
                  }),
                  10 != t && 20 != t && (n.numFmt = "0.00"));
          });
      });
    }),
    (l.getColumn(1).width = 20),
    (l.getColumn(2).width = 20),
    (l.getColumn(3).width = 15.86),
    (l.getColumn(4).width = 15.86),
    (l.getColumn(5).width = 15.86),
    (l.getColumn(6).width = 15.86),
    (l.getColumn(7).width = 20),
    (l.getColumn(8).width = 20),
    (l.getColumn(9).width = 20),
    (l.getColumn(10).width = 10.14),
    (l.getColumn(11).width = 20),
    (l.getColumn(12).width = 20),
    (l.getColumn(13).width = 20),
    (l.getColumn(14).width = 20),
    (l.getColumn(15).width = 20),
    (l.getColumn(16).width = 20),
    (l.getColumn(17).width = 20),
    (l.getColumn(18).width = 20),
    (l.getColumn(19).width = 35),
    (l.getColumn(20).width = 20),
    (l.getColumn(21).width = 20),
    (l.getColumn(22).width = 85),
    (l.getColumn(23).width = 20),
    (l.state = "visible");
};

const addCdnraworksheet = (n, t, e) => {
  let l = t.addWorksheet("B2B-CDNRA");
  l.mergeCells("A1:W3");
  let s = l.getCell("A1");
  (s.value = constants.EXCEL_HEADING_LBL),
    setStyle(s, 22, "middle", "203764", "FFFFFF", !1),
    l.mergeCells("A4:W4");
  let r = l.getCell("A4");
  (r.value = "Amendments to previously filed Credit/Debit notes by supplier"),
    setStyle(r, 11, "top", "FFF2CC", "000000", !0),
    l.mergeCells("A5:C5");
  let i = l.getCell("A5");
  (i.value = "Original Details"),
    setStyle(i, 11, "middle", "FFF2CC", "000000", !0),
    l.mergeCells("D5:W5");
  let o = l.getCell("D5");
  if (
    ((o.value = "Revised Details"),
    setStyle(o, 11, "middle", "DCC8DC", "000000", !0),
    null != e)
  )
    var a = e ? constants.DOC_HEADER_CDNRA_IFF : constants.DOC_HEADER_CDNRA;
  else a = constants.DOC_HEADER_CDNRA;
  for (let A = 0; A < a.length; A++)
    if (A < 5) {
      l.mergeCells(6, A + 1, 7, A + 1);
      let n = l.getCell(6, A + 1);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (5 === A) {
      l.mergeCells(6, A + 1, 6, A + 5);
      let n = l.getCell(6, A + 1);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (A > 5 && A < 10) {
      l.mergeCells(6, A + 5, 7, A + 5);
      let n = l.getCell(6, A + 5);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (10 === A) {
      l.mergeCells(6, A + 5, 6, A + 8);
      let n = l.getCell(6, A + 5);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else {
      l.mergeCells(6, A + 8, 7, A + 8);
      let n = l.getCell(6, A + 8);
      (n.value = a[A]), setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    }
  for (let u = 0; u < constants.CDNR_DTL_LBL.length; u++) {
    let n = l.getCell(7, u + 6);
    (n.value = constants.CDNR_DTL_LBL[u]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  for (let u = 0; u < constants.TAX_AMT_LBL.length; u++) {
    let n = l.getCell(7, u + 15);
    (n.value = constants.TAX_AMT_LBL[u]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  null != n &&
    null != n &&
    n.forEach((n) => {
      n.items.forEach((t) => {
        let e = [];
        e.push(n.onttyp),
          e.push(n.ontnum),
          e.push(n.ontdt),
          e.push(n.ctin),
          e.push(n.trdnm),
          e.push(n.ntnum),
          e.push(n.typ),
          e.push(n.suptyp),
          e.push(n.dt),
          e.push(parseFloat(n.val.replace(/,/g, ""))),
          e.push(n.pos),
          e.push(n.rev),
          e.push(t.rt),
          e.push(parseFloat(t.txval.replace(/,/g, ""))),
          e.push(parseFloat(t.igst.replace(/,/g, ""))),
          e.push(parseFloat(t.cgst.replace(/,/g, ""))),
          e.push(parseFloat(t.sgst.replace(/,/g, ""))),
          e.push(parseFloat(t.cess.replace(/,/g, ""))),
          e.push(n.supprd),
          e.push(n.supfildt),
          e.push(n.itcavl),
          e.push(n.rsn),
          e.push(n.diffprcnt + "%"),
          l.addRow(e).eachCell((n, t) => {
            (n.alignment = {
              wrapText: !0,
            }),
              (n.font = {
                size: 11,
                name: "Calibri",
              }),
              1 == t ||
              2 == t ||
              3 == t ||
              4 == t ||
              5 == t ||
              6 == t ||
              7 == t ||
              8 == t ||
              9 == t ||
              11 == t ||
              19 == t ||
              20 == t ||
              22 == t
                ? (n.style.alignment = {
                    horizontal: "left",
                  })
                : 12 == t || 21 == t
                ? (n.style.alignment = {
                    horizontal: "center",
                  })
                : (10 != t &&
                    13 != t &&
                    14 != t &&
                    15 != t &&
                    16 != t &&
                    17 != t &&
                    18 != t &&
                    23 != t) ||
                  ((n.style.alignment = {
                    horizontal: "right",
                  }),
                  13 != t && 23 != t && (n.numFmt = "0.00"));
          });
      });
    }),
    (l.getColumn(1).width = 20),
    (l.getColumn(2).width = 20),
    (l.getColumn(3).width = 20),
    (l.getColumn(4).width = 20),
    (l.getColumn(5).width = 20),
    (l.getColumn(6).width = 15.86),
    (l.getColumn(7).width = 15.86),
    (l.getColumn(8).width = 15.86),
    (l.getColumn(9).width = 15.86),
    (l.getColumn(10).width = 20),
    (l.getColumn(11).width = 20),
    (l.getColumn(12).width = 20),
    (l.getColumn(13).width = 10.14),
    (l.getColumn(14).width = 20),
    (l.getColumn(15).width = 20),
    (l.getColumn(16).width = 20),
    (l.getColumn(17).width = 20),
    (l.getColumn(18).width = 20),
    (l.getColumn(19).width = 20),
    (l.getColumn(20).width = 20),
    (l.getColumn(21).width = 20),
    (l.getColumn(22).width = 35),
    (l.getColumn(23).width = 20),
    (l.state = "visible");
};

const addIsdworksheet = (n, t) => {
  let e = t.addWorksheet("ISD");
  e.mergeCells("A1:N3");
  let l = e.getCell("A1");
  (l.value = constants.EXCEL_HEADING_LBL),
    setStyle(l, 22, "middle", "203764", "FFFFFF", !1),
    e.mergeCells("A4:N4");
  let s = e.getCell("A4");
  (s.value = "ISD Credits"), setStyle(s, 11, "top", "FFF2CC", "000000", !0);
  for (let r = 0; r < constants.DOC_HEADER_ISD.length; r++)
    if (r < 7) {
      e.mergeCells(5, r + 1, 6, r + 1);
      let n = e.getCell(5, r + 1);
      (n.value = constants.DOC_HEADER_ISD[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (7 === r) {
      e.mergeCells(5, r + 1, 5, r + 4);
      let n = e.getCell(5, r + 1);
      (n.value = constants.DOC_HEADER_ISD[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else {
      e.mergeCells(5, r + 4, 6, r + 4);
      let n = e.getCell(5, r + 4);
      (n.value = constants.DOC_HEADER_ISD[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    }
  for (let r = 0; r < constants.TAX_AMT_LBL.length; r++) {
    let n = e.getCell(6, r + 8);
    (n.value = constants.TAX_AMT_LBL[r]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  null != n &&
    null != n &&
    n.forEach((n) => {
      let t = [];
      t.push(n.ctin),
        t.push(n.trdnm),
        t.push(n.typ),
        t.push(n.docnum),
        t.push(n.dt),
        t.push(n.inum),
        t.push(n.idt),
        t.push(parseFloat(n.igst.replace(/,/g, ""))),
        t.push(parseFloat(n.cgst.replace(/,/g, ""))),
        t.push(parseFloat(n.sgst.replace(/,/g, ""))),
        t.push(parseFloat(n.cess.replace(/,/g, ""))),
        t.push(n.supprd),
        t.push(n.supfildt),
        t.push(n.itcavl),
        e.addRow(t).eachCell((n, t) => {
          (n.alignment = {
            wrapText: !0,
          }),
            (n.font = {
              size: 11,
              name: "Calibri",
            }),
            1 == t ||
            2 == t ||
            3 == t ||
            4 == t ||
            5 == t ||
            6 == t ||
            7 == t ||
            12 == t ||
            13 == t
              ? (n.style.alignment = {
                  horizontal: "left",
                })
              : 14 == t
              ? (n.style.alignment = {
                  horizontal: "center",
                })
              : (8 != t && 9 != t && 10 != t && 11 != t) ||
                ((n.style.alignment = {
                  horizontal: "right",
                }),
                (n.numFmt = "0.00"));
        });
    }),
    (e.getColumn(1).width = 20),
    (e.getColumn(2).width = 20),
    (e.getColumn(3).width = 20),
    (e.getColumn(4).width = 16),
    (e.getColumn(5).width = 18),
    (e.getColumn(6).width = 16),
    (e.getColumn(7).width = 16),
    (e.getColumn(8).width = 16),
    (e.getColumn(9).width = 16),
    (e.getColumn(10).width = 16),
    (e.getColumn(11).width = 16),
    (e.getColumn(12).width = 16),
    (e.getColumn(13).width = 16),
    (e.getColumn(14).width = 17),
    (e.state = "visible");
};

const addIsdaworksheet = (n, t) => {
  let e = t.addWorksheet("ISDA");
  e.mergeCells("A1:Q3");
  let l = e.getCell("A1");
  (l.value = constants.EXCEL_HEADING_LBL),
    setStyle(l, 22, "middle", "203764", "FFFFFF", !1),
    e.mergeCells("A4:Q4");
  let s = e.getCell("A4");
  (s.value = "Amendments ISD Credits received"),
    setStyle(s, 11, "top", "FFF2CC", "000000", !0),
    e.mergeCells("A5:C5");
  let r = e.getCell("A5");
  (r.value = "Original Details"),
    setStyle(r, 11, "middle", "FFF2CC", "000000", !0),
    e.mergeCells("D5:Q5");
  let i = e.getCell("D5");
  (i.value = "Revised Details"),
    setStyle(i, 11, "middle", "DCC8DC", "000000", !0);
  for (let o = 0; o < constants.DOC_HEADER_ISDA.length; o++)
    if (o < 10) {
      e.mergeCells(6, o + 1, 7, o + 1);
      let n = e.getCell(6, o + 1);
      (n.value = constants.DOC_HEADER_ISDA[o]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (10 === o) {
      e.mergeCells(6, o + 1, 6, o + 4);
      let n = e.getCell(6, o + 1);
      (n.value = constants.DOC_HEADER_ISDA[o]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else {
      e.mergeCells(6, o + 4, 7, o + 4);
      let n = e.getCell(6, o + 4);
      (n.value = constants.DOC_HEADER_ISDA[o]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    }
  for (let o = 0; o < constants.TAX_AMT_LBL.length; o++) {
    let n = e.getCell(7, o + 11);
    (n.value = constants.TAX_AMT_LBL[o]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  null != n &&
    null != n &&
    n.forEach((n) => {
      let t = [];
      t.push(n.odoctyp),
        t.push(n.odocnum),
        t.push(n.odocdt),
        t.push(n.ctin),
        t.push(n.trdnm),
        t.push(n.typ),
        t.push(n.docnum),
        t.push(n.dt),
        t.push(n.inum),
        t.push(n.idt),
        t.push(parseFloat(n.igst.replace(/,/g, ""))),
        t.push(parseFloat(n.cgst.replace(/,/g, ""))),
        t.push(parseFloat(n.sgst.replace(/,/g, ""))),
        t.push(parseFloat(n.cess.replace(/,/g, ""))),
        t.push(n.supprd),
        t.push(n.supfildt),
        t.push(n.itcavl),
        e.addRow(t).eachCell((n, t) => {
          (n.alignment = {
            wrapText: !0,
          }),
            (n.font = {
              size: 11,
              name: "Calibri",
            }),
            1 == t ||
            2 == t ||
            3 == t ||
            4 == t ||
            5 == t ||
            6 == t ||
            7 == t ||
            8 == t ||
            9 == t ||
            10 == t ||
            15 == t ||
            16 == t
              ? (n.style.alignment = {
                  horizontal: "left",
                })
              : 17 == t
              ? (n.style.alignment = {
                  horizontal: "center",
                })
              : (11 != t && 12 != t && 13 != t && 14 != t) ||
                ((n.style.alignment = {
                  horizontal: "right",
                }),
                (n.numFmt = "0.00"));
        });
    }),
    (e.getColumn(1).width = 20),
    (e.getColumn(2).width = 20),
    (e.getColumn(3).width = 20),
    (e.getColumn(4).width = 20),
    (e.getColumn(5).width = 20),
    (e.getColumn(6).width = 20),
    (e.getColumn(7).width = 16),
    (e.getColumn(8).width = 18),
    (e.getColumn(9).width = 16),
    (e.getColumn(10).width = 16),
    (e.getColumn(11).width = 16),
    (e.getColumn(12).width = 16),
    (e.getColumn(13).width = 16),
    (e.getColumn(14).width = 16),
    (e.getColumn(15).width = 16),
    (e.getColumn(16).width = 16),
    (e.getColumn(17).width = 17),
    (e.state = "visible");
};

const addImpgworksheet = (n, t) => {
  let e = t.addWorksheet("IMPG");
  e.mergeCells("A1:H3");
  let l = e.getCell("A1");
  (l.value = constants.EXCEL_HEADING_LBL),
    setStyle(l, 22, "middle", "203764", "FFFFFF", !1),
    e.mergeCells("A4:H4");
  let s = e.getCell("A4");
  (s.value = "Import of goods from overseas on bill of entry"),
    setStyle(s, 11, "top", "FFF2CC", "000000", !0);
  for (let r = 0; r < constants.DOC_HEADER_IMPG.length; r++)
    if (r < 2) {
      e.mergeCells(5, r + 1, 6, r + 1);
      let n = e.getCell(5, r + 1);
      (n.value = constants.DOC_HEADER_IMPG[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (2 === r) {
      e.mergeCells(5, r + 1, 5, r + 3);
      let n = e.getCell(5, r + 1);
      (n.value = constants.DOC_HEADER_IMPG[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (3 == r) {
      e.mergeCells(5, r + 3, 5, r + 4);
      let n = e.getCell(5, r + 3);
      (n.value = constants.DOC_HEADER_IMPG[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else {
      e.mergeCells(5, r + 4, 6, r + 4);
      let n = e.getCell(5, r + 4);
      (n.value = constants.DOC_HEADER_IMPG[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    }
  for (let r = 0; r < constants.IMPG_DTL_LBL.length; r++) {
    let n = e.getCell(6, r + 3);
    (n.value = constants.IMPG_DTL_LBL[r]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  null != n &&
    null != n &&
    n.forEach((n) => {
      let t = [];
      t.push(n.refdt),
        t.push(n.portcode),
        t.push(n.boenum),
        t.push(n.boedt),
        t.push(parseFloat(n.txval.replace(/,/g, ""))),
        t.push(parseFloat(n.igst.replace(/,/g, ""))),
        t.push(parseFloat(n.cess.replace(/,/g, ""))),
        t.push(n.isamd),
        e.addRow(t).eachCell((n, t) => {
          (n.alignment = {
            wrapText: !0,
          }),
            (n.font = {
              size: 11,
              name: "Calibri",
            }),
            1 == t || 2 == t || 3 == t || 4 == t
              ? (n.style.alignment = {
                  horizontal: "left",
                })
              : 8 == t
              ? (n.style.alignment = {
                  horizontal: "center",
                })
              : (5 != t && 6 != t && 7 != t) ||
                ((n.style.alignment = {
                  horizontal: "right",
                }),
                (n.numFmt = "0.00"));
        });
    }),
    (e.getColumn(1).width = 21.5),
    (e.getColumn(2).width = 20),
    (e.getColumn(3).width = 20),
    (e.getColumn(4).width = 18),
    (e.getColumn(5).width = 21.26),
    (e.getColumn(6).width = 16),
    (e.getColumn(7).width = 16),
    (e.getColumn(8).width = 13),
    (e.state = "visible");
};

const addImpgsezworksheet = (n, t) => {
  let e = t.addWorksheet("IMPGSEZ");
  e.mergeCells("A1:J3");
  let l = e.getCell("A1");
  (l.value = constants.EXCEL_HEADING_LBL),
    setStyle(l, 22, "middle", "203764", "FFFFFF", !1),
    e.mergeCells("A4:J4");
  let s = e.getCell("A4");
  (s.value = "Import of goods from SEZ units/developers on bill of entry"),
    setStyle(s, 11, "top", "FFF2CC", "000000", !0);
  for (let r = 0; r < constants.DOC_HEADER_IMPGSEZ.length; r++)
    if (r < 4) {
      e.mergeCells(5, r + 1, 6, r + 1);
      let n = e.getCell(5, r + 1);
      (n.value = constants.DOC_HEADER_IMPGSEZ[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (4 === r) {
      e.mergeCells(5, r + 1, 5, r + 3);
      let n = e.getCell(5, r + 1);
      (n.value = constants.DOC_HEADER_IMPGSEZ[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else if (5 == r) {
      e.mergeCells(5, r + 3, 5, r + 4);
      let n = e.getCell(5, r + 3);
      (n.value = constants.DOC_HEADER_IMPGSEZ[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    } else {
      e.mergeCells(5, r + 4, 6, r + 4);
      let n = e.getCell(5, r + 4);
      (n.value = constants.DOC_HEADER_IMPGSEZ[r]),
        setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
    }
  for (let r = 0; r < constants.IMPG_DTL_LBL.length; r++) {
    let n = e.getCell(6, r + 5);
    (n.value = constants.IMPG_DTL_LBL[r]),
      setStyle(n, 9, "middle", "203764", "FFFFFF", !0);
  }
  null != n &&
    null != n &&
    n.forEach((n) => {
      let t = [];
      t.push(n.ctin),
        t.push(n.trdnm),
        t.push(n.refdt),
        t.push(n.portcode),
        t.push(n.boenum),
        t.push(n.boedt),
        t.push(parseFloat(n.txval.replace(/,/g, ""))),
        t.push(parseFloat(n.igst.replace(/,/g, ""))),
        t.push(parseFloat(n.cess.replace(/,/g, ""))),
        t.push(n.isamd),
        e.addRow(t).eachCell((n, t) => {
          (n.alignment = {
            wrapText: !0,
          }),
            (n.font = {
              size: 11,
              name: "Calibri",
            }),
            1 == t || 2 == t || 3 == t || 4 == t || 5 == t || 6 == t
              ? (n.style.alignment = {
                  horizontal: "left",
                })
              : 10 == t
              ? (n.style.alignment = {
                  horizontal: "center",
                })
              : (7 != t && 8 != t && 9 != t) ||
                ((n.style.alignment = {
                  horizontal: "right",
                }),
                (n.numFmt = "0.00"));
        });
    }),
    (e.getColumn(1).width = 20),
    (e.getColumn(2).width = 20),
    (e.getColumn(3).width = 21.29),
    (e.getColumn(4).width = 12.14),
    (e.getColumn(5).width = 14.57),
    (e.getColumn(6).width = 18),
    (e.getColumn(7).width = 21.26),
    (e.getColumn(8).width = 16),
    (e.getColumn(9).width = 16),
    (e.getColumn(10).width = 13),
    (e.state = "visible");
};

const setStyle = (n, t, e, l, A, s) => {
  (n.alignment = {
    wrapText: !0,
    vertical: e,
    horizontal: "center",
  }),
    (n.border = {
      top: {
        style: "thin",
      },
      left: {
        style: "thin",
      },
      bottom: {
        style: "thin",
      },
      right: {
        style: "thin",
      },
    }),
    (n.font = {
      size: t,
      bold: s,
      name: "Arial",
      color: {
        argb: A,
      },
    }),
    (n.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: l,
      },
    });
};

const setDetlCell = (n) => {
  (n.value = "Details"),
    (n.alignment = {
      vertical: "middle",
      horizontal: "center",
      textRotation: 90,
    });
};

const setCellBackground = (n) => {
  n.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "D0CECE",
    },
  };
};

const getIMPGDocData = (n) => {
  var t;
  let docData = [];
  for (let e of n)
    ((t = new Object()).refdt = changeDateFormat(e.refdt)),
      (t.recdt = changeDateFormat(e.recdt)),
      (t.portcode = checkNullForString(e.portcode)),
      (t.boenum = checkNullForValue(e.boenum)),
      (t.boedt = changeDateFormat(e.boedt)),
      (t.isamd = expandPolarValue(e.isamd)),
      (t.hash = getHash(e.boenum, t.ctin, t.boedt)),
      (t.igst = checkNullForValue(e.igst)),
      (t.txval = checkNullForValue(e.txval)),
      (t.cess = checkNullForValue(e.cess)),
      (t.igst = t.igst.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })),
      (t.cess = t.cess.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })),
      (t.txval = t.txval.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })),
      docData.push(t);
  return docData;
};

const getIMPGSEZDocData = (n) => {
  var t;
  let docData = [];
  for (let e of n)
    for (let n of e.boe)
      ((t = new Object()).ctin = checkNullForString(e.ctin)),
        (t.trdnm = checkNullForString(e.trdnm)),
        (t.refdt = changeDateFormat(n.refdt)),
        (t.recdt = changeDateFormat(n.recdt)),
        (t.portcode = checkNullForString(n.portcode)),
        (t.boenum = checkNullForValue(n.boenum)),
        (t.boedt = changeDateFormat(n.boedt)),
        (t.isamd = expandPolarValue(n.isamd)),
        (t.hash = getHash(n.boenum, t.ctin, t.boedt)),
        (t.igst = checkNullForValue(n.igst)),
        (t.txval = checkNullForValue(n.txval)),
        (t.cess = checkNullForValue(n.cess)),
        (t.igst = t.igst.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (t.cess = t.cess.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (t.txval = t.txval.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        docData.push(t);
  return docData;
};
const getISDADOCData = (n) => {
  var t;
  let docData = [];
  for (let e of n)
    for (let n of e.doclist)
      ((t = new Object()).trdnm = checkNullForString(e.trdnm)),
        (t.odoctyp = expandTransactionType(n.odoctyp)),
        (t.odocnum = checkNullForString(n.odocnum)),
        (t.odocdt = changeDateFormat(n.odocdt)),
        (t.dt = changeDateFormat(n.docdt)),
        (t.ctin = checkNullForString(e.ctin)),
        (t.docnum = checkNullForString(n.docnum)),
        (t.inum = checkNullForString(n.oinvnum)),
        (t.itcavl = expandPolarValue(n.itcelg)),
        (t.idt = changeDateFormat(n.oinvdt)),
        (t.typ = expandTransactionType(n.doctyp)),
        (t.supfildt = changeDateFormat(e.supfildt)),
        (t.supprd = "supprd" in e ? changeMonthIndexToString2(e.supprd) : ""),
        (t.hash = getHash(n.docnum, t.ctin, t.dt)),
        (t.supprdinprd = checkNullForString(e.supprd)),
        (t.igst = checkNullForValue(n.igst)),
        (t.cgst = checkNullForValue(n.cgst)),
        (t.sgst = checkNullForValue(n.sgst)),
        (t.cess = checkNullForValue(n.cess)),
        (t.igst = t.igst.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (t.cgst = t.cgst.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (t.sgst = t.sgst.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (t.cess = t.cess.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        docData.push(t);
  return docData;
};
const getISDDocData = (n) => {
  var t;
  let docData = [];
  for (let e of n)
    for (let n of e.doclist)
      ((t = new Object()).trdnm = checkNullForString(e.trdnm)),
        (t.dt = changeDateFormat(n.docdt)),
        (t.ctin = checkNullForString(e.ctin)),
        (t.docnum = checkNullForString(n.docnum)),
        (t.inum = checkNullForString(n.oinvnum)),
        (t.itcavl = expandPolarValue(n.itcelg)),
        (t.idt = changeDateFormat(n.oinvdt)),
        (t.typ = expandTransactionType(n.doctyp)),
        (t.supfildt = changeDateFormat(e.supfildt)),
        (t.supprd = "supprd" in e ? changeMonthIndexToString2(e.supprd) : ""),
        (t.hash = getHash(n.docnum, t.ctin, t.dt)),
        (t.supprdinprd = checkNullForString(e.supprd)),
        (t.igst = checkNullForValue(n.igst)),
        (t.cgst = checkNullForValue(n.cgst)),
        (t.sgst = checkNullForValue(n.sgst)),
        (t.cess = checkNullForValue(n.cess)),
        (t.igst = t.igst.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (t.cgst = t.cgst.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (t.sgst = t.sgst.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (t.cess = t.cess.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        docData.push(t);
  return docData;
};
const getCDNRADocData = (n) => {
  let docData = [];
  let t = 0,
    e = 0,
    l = 0,
    A = 0,
    s = 0;
  var r, i;
  for (let u of n)
    for (let n of u.nt) {
      var o = [];
      (t = 0),
        (e = 0),
        (l = 0),
        (A = 0),
        (s = 0),
        ((r = getCDNRData(r, n, u)).ontnum = checkNullForString(n.ontnum)),
        (r.ontdt = changeDateFormat(n.ontdt)),
        (r.onttyp = expandDocumentType(n.onttyp));
      for (let r of n.items)
        (i = getB2BItemDeatails(r)),
          (s += checkNullForValue(r.txval)),
          (t += checkNullForValue(r.igst)),
          (e += checkNullForValue(r.cgst)),
          (l += checkNullForValue(r.sgst)),
          (A += checkNullForValue(r.cess)),
          o.push(i);
      (r.igst = t.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })),
        (r.cgst = e.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.sgst = l.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.cess = A.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.txval = s.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.items = o),
        docData.push(r);
    }
  return docData;
};
const getCDNRData = (n, t, e) => {
  return (
    ((n = new Object()).trdnm = checkNullForString(e.trdnm)),
    (n.dt = changeDateFormat(t.dt)),
    (n.pos = getStateName(t.pos)),
    (n.ctin = checkNullForString(e.ctin)),
    (n.ntnum = checkNullForString(t.ntnum)),
    (n.itcavl = expandPolarValue(t.itcavl)),
    (n.val = checkNullForValue(t.val)),
    (n.val = n.val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (n.rsn = getIneligibleReason(t.rsn)),
    (n.suptyp = expandTransactionType(t.suptyp)),
    (n.typ = expandDocumentType(t.typ)),
    (n.rev = expandPolarValue(t.rev)),
    (n.supfildt = changeDateFormat(e.supfildt)),
    (n.supprd = "supprd" in e ? changeMonthIndexToString2(e.supprd) : ""),
    (n.hash = getHash(t.ntnum, n.ctin, n.dt)),
    (n.supprdinprd = checkNullForString(e.supprd)),
    (n.diffprcnt =
      "diffprcnt" in t && 0 != t.diffprcnt
        ? 100 * checkNullForValue(t.diffprcnt)
        : 100),
    (n.srctyp = t.srctyp ? t.srctyp : ""),
    (n.irn = t.irn ? t.irn : ""),
    (n.irngendate = t.irngendate ? changeDateFormat(t.irngendate) : ""),
    n
  );
};
const getCDNRDocData = (n) => {
  let docData = [];
  let t = 0,
    e = 0,
    l = 0,
    A = 0,
    s = 0;
  var r, i;
  for (let a of n)
    for (let n of a.nt) {
      var o = [];
      (t = 0), (e = 0), (l = 0), (A = 0), (s = 0), (r = getCDNRData(r, n, a));
      for (let r of n.items)
        (i = getB2BItemDeatails(r)),
          (s += checkNullForValue(r.txval)),
          (t += checkNullForValue(r.igst)),
          (e += checkNullForValue(r.cgst)),
          (l += checkNullForValue(r.sgst)),
          (A += checkNullForValue(r.cess)),
          o.push(i);
      (r.igst = t.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })),
        (r.cgst = e.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.sgst = l.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.cess = A.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.txval = s.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.items = o),
        docData.push(r);
    }
  return docData;
};
const getB2BADocData = (n) => {
  let docData = [];
  let t = 0,
    e = 0,
    l = 0,
    A = 0,
    s = 0;
  var r, i;
  for (let u of n)
    for (let n of u.inv) {
      var o = [];
      (t = 0),
        (e = 0),
        (l = 0),
        (A = 0),
        (s = 0),
        ((r = getB2BData(r, n, u)).oinum = checkNullForString(n.oinum)),
        (r.oidt = changeDateFormat(n.oidt));
      for (let r of n.items)
        (i = getB2BItemDeatails(r)),
          (s += checkNullForValue(r.txval)),
          (t += checkNullForValue(r.igst)),
          (e += checkNullForValue(r.cgst)),
          (l += checkNullForValue(r.sgst)),
          (A += checkNullForValue(r.cess)),
          o.push(i);
      (r.igst = t.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })),
        (r.cgst = e.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.sgst = l.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.cess = A.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.txval = s.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.items = o),
        docData.push(r);
    }
  return docData;
};
const getB2BData = (n, t, e) => {
  return (
    ((n = new Object()).trdnm = checkNullForString(e.trdnm)),
    (n.dt = changeDateFormat(t.dt)),
    (n.pos = getStateName(t.pos)),
    (n.ctin = checkNullForString(e.ctin)),
    (n.inum = checkNullForString(t.inum)),
    (n.itcavl = expandPolarValue(t.itcavl)),
    (n.val = checkNullForValue(t.val)),
    (n.val = n.val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (n.supfildt = changeDateFormat(e.supfildt)),
    (n.rsn = getIneligibleReason(t.rsn)),
    (n.hash = getHash(t.inum, n.ctin, n.dt)),
    (n.typ =
      "typ" in t
        ? "CBW" != t.typ
          ? expandTransactionType(t.typ)
          : "Regular"
        : ""),
    (n.rev = expandPolarValue(t.rev)),
    (n.supprd = "supprd" in e ? changeMonthIndexToString2(e.supprd) : ""),
    (n.supprdinprd = checkNullForString(e.supprd)),
    (n.diffprcnt =
      "diffprcnt" in t && 0 != t.diffprcnt
        ? 100 * checkNullForValue(t.diffprcnt)
        : 100),
    (n.srctyp = t.srctyp ? t.srctyp : ""),
    (n.irn = t.irn ? t.irn : ""),
    (n.irngendate = t.irngendate ? changeDateFormat(t.irngendate) : ""),
    n
  );
};
const getB2BDocData = (n) => {
  let docData = [];
  let t = 0,
    e = 0,
    l = 0,
    A = 0,
    s = 0;
  var r, i;
  for (let a of n)
    for (let n of a.inv) {
      var o = [];
      (t = 0), (e = 0), (l = 0), (A = 0), (s = 0), (r = getB2BData(r, n, a));
      for (let r of n.items)
        (i = getB2BItemDeatails(r)),
          (s += checkNullForValue(r.txval)),
          (t += checkNullForValue(r.igst)),
          (e += checkNullForValue(r.cgst)),
          (l += checkNullForValue(r.sgst)),
          (A += checkNullForValue(r.cess)),
          o.push(i);
      (r.igst = t.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })),
        (r.cgst = e.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.sgst = l.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.cess = A.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.txval = s.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })),
        (r.items = o),
        docData.push(r);
    }
  return docData;
};

const getB2BItemDeatails = (n) => {
  var t;
  return (
    ((t = new Object()).rt = null == n.rt ? 0 : n.rt),
    (t.igst = checkNullForValue(n.igst)),
    (t.txval = checkNullForValue(n.txval)),
    (t.cgst = checkNullForValue(n.cgst)),
    (t.sgst = checkNullForValue(n.sgst)),
    (t.cess = checkNullForValue(n.cess)),
    (t.igst = t.igst.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (t.txval = t.txval.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (t.cgst = t.cgst.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (t.sgst = t.sgst.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (t.cess = t.cess.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    t
  );
};

const checkNullForValue = (n) => {
  return null == n && (n = 0), n;
};

const checkNullForString = (n) => {
  return null == n || "" == n ? "" : n;
};

const getHash = (n, t, e) => {
  return sha256(n + t + e);
};

const constants = {
  CUTOFF_DATES_LBL: "Cut-off dates considered for GSTR-2B",
  FORM_TYP_LBL: "Supplies from/type",
  FORM_CRT_LBL: "Criteria",
  GSTR1M_FORM_TXT: "Normal taxpayer filing at monthly frequency",
  GSTR1Q_FORM_TXT: "Normal taxpayer filing at quarterly frequency",
  GSTR5_FORM_TXT: "Non Resident Taxpayer",
  GSTR6_FORM_TXT: "Input service distributor",
  IMPG_FORM_TXT: "Import from overseas",
  IMPGSEZ_FORM_TXT: "Import from SEZ",
  GSTR1_VAL_TXT: "All GSTR-1 filed between",
  IFF_VAL_TXT: "All GSTR-1/IFF filed between",
  GSTR5_VAL_TXT: "All GSTR-5 filed between",
  GSTR6_VAL_TXT: "All GSTR-6 filed between",
  IMP_VAL_TXT:
    "All import data received for the tax period by the cut-off date ",
  TO_TXT: "to",
  CUTOFF_DTLS_URL: "/gstr2b/auth/api/gstr2b/cutoff",
  LBL_GSTIN: "GSTIN",
  LBL_LEGAL_NAME: "Legal Name",
  LBL_TRD_NAME: "Trade Name",
  LBL_FINAN_YR: "Financial Year",
  LBL_RTN_PRD: "Return Period",
  LBL_GEN_DATE: "Generation date",
  LBL_VIEW_TABLE: "Select Table to View Details",
  LBL_SEL_TAB: "Select table to view details",
  LBL_GSTR2B_HEADER: " GSTR-2B- AUTO-DRAFTED ITC STATEMENT",
  LBL_VIEW_ADVISORY: "View Advisory",
  LBL_BACK: "Back",
  DOC_HEADER_B2B: [
    "GSTIN of supplier",
    "Trade/Legal name",
    "Invoice Details",
    "Place of supply",
    "Supply Attract Reverse Charge",
    "Rate(%)",
    "Taxable Value (\u20b9)",
    "Tax Amount",
    "GSTR-1/5 Period",
    "GSTR-1/5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
    "Source",
    "IRN",
    "IRN Date",
  ],
  DOC_HEADER_B2B_IFF: [
    "GSTIN of supplier",
    "Trade/Legal name",
    "Invoice Details",
    "Place of supply",
    "Supply Attract Reverse Charge",
    "Rate(%)",
    "Taxable Value (\u20b9)",
    "Tax Amount",
    "GSTR-1/IFF/GSTR-5 Period",
    "GSTR-1/IFF/GSTR-5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
    "Source",
    "IRN",
    "IRN Date",
  ],
  INV_HEADER_LBL: [
    "Invoice number",
    "Invoice type",
    "Invoice Date",
    "Invoice Value(\u20b9)",
  ],
  TAX_AMT_LBL: [
    "Integrated Tax(\u20b9)",
    "Central Tax(\u20b9)",
    "State/UT Tax(\u20b9)",
    "Cess(\u20b9)",
  ],
  DOC_HEADER_B2BA: [
    "Invoice number",
    "Invoice Date",
    "GSTIN of supplier",
    "Trade/Legal name",
    "Invoice Details",
    "Place of supply",
    "Supply Attract Reverse Charge",
    "Rate(%)",
    "Taxable Value (\u20b9)",
    "Tax Amount",
    "GSTR-1/5 Period",
    "GSTR-1/5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
  ],
  DOC_HEADER_B2BA_IFF: [
    "Invoice number",
    "Invoice Date",
    "GSTIN of supplier",
    "Trade/Legal name",
    "Invoice Details",
    "Place of supply",
    "Supply Attract Reverse Charge",
    "Rate(%)",
    "Taxable Value (\u20b9)",
    "Tax Amount",
    "GSTR-1/IFF/GSTR-5 Period",
    "GSTR-1/IFF/GSTR-5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
  ],
  DOC_HEADER_CDNR: [
    "GSTIN of supplier",
    "Trade/Legal name",
    "Credit note/Debit note details",
    "Place of supply",
    "Supply Attract Reverse Charge",
    "Rate(%)",
    "Taxable Value (\u20b9)",
    "Tax Amount",
    "GSTR-1/5 Period",
    "GSTR-1/5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
    "Source",
    "IRN",
    "IRN Date",
  ],
  DOC_HEADER_CDNR_IFF: [
    "GSTIN of supplier",
    "Trade/Legal name",
    "Credit note/Debit note details",
    "Place of supply",
    "Supply Attract Reverse Charge",
    "Rate(%)",
    "Taxable Value (\u20b9)",
    "Tax Amount",
    "GSTR-1/IFF/GSTR-5 Period",
    "GSTR-1/IFF/GSTR-5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
    "Source",
    "IRN",
    "IRN Date",
  ],
  CDNR_DTL_LBL: [
    "Note number",
    "Note type",
    "Note Supply type",
    "Note date",
    "Note Value (\u20b9)",
  ],
  DOC_HEADER_CDNRA: [
    "Note type",
    "Note number",
    "Note date",
    "GSTIN of supplier",
    "Trade/Legal name",
    "Credit note/Debit note details",
    "Place of supply",
    "Supply Attract Reverse Charge",
    "Rate(%)",
    "Taxable Value (\u20b9)",
    "Tax Amount",
    "GSTR-1/5 Period",
    "GSTR-1/5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
  ],
  DOC_HEADER_CDNRA_IFF: [
    "Note type",
    "Note number",
    "Note date",
    "GSTIN of supplier",
    "Trade/Legal name",
    "Credit note/Debit note details",
    "Place of supply",
    "Supply Attract Reverse Charge",
    "Rate(%)",
    "Taxable Value (\u20b9)",
    "Tax Amount",
    "GSTR-1/IFF/GSTR-5 Period",
    "GSTR-1/IFF/GSTR-5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
  ],
  DOC_HEADER_ISD: [
    "GSTIN of ISD",
    "Trade/Legal name",
    "ISD Document type",
    "ISD Document number",
    "ISD Document date",
    "Original Invoice Number",
    "Original invoice date",
    "Input tax distribution by ISD",
    "ISD GSTR-6 Period",
    "ISD GSTR-6 Filing Date",
    "Eligibility of ITC",
  ],
  DOC_HEADER_ISDA: [
    "ISD Document type",
    "Document Number",
    "Document date",
    "GSTIN of ISD",
    "Trade/Legal name",
    "ISD Document type",
    "ISD Document number",
    "ISD Document date",
    "Original Invoice Number",
    "Original invoice date",
    "Input tax distribution by ISD",
    "ISD GSTR-6 Period",
    "ISD GSTR-6 Filing Date",
    "Eligibility of ITC",
  ],
  DOC_HEADER_IMPG: [
    "Icegate Reference Date",
    "Port Code",
    "Bill of Entry Details",
    "Amount of tax (\u20b9)",
    "Amended (Yes)",
  ],
  DOC_HEADER_IMPGSEZ: [
    "GSTIN of supplier",
    "Trade/Legal name",
    "Icegate Reference Date",
    "Port Code",
    "Bill of Entry Details",
    "Amount of tax (\u20b9)",
    "Amended (Yes)",
  ],
  IMPG_DTL_LBL: [
    "Number",
    "Date",
    "Taxable Value",
    "Integrated Tax(\u20b9)",
    "Cess(\u20b9)",
  ],
  EXCEL_HEADING_LBL: "Goods and Services Tax  - GSTR-2B",
  NO_REC_LBL: "No record(s) found for the relevant input.",
  LBL_SUPPLIERWISE: "Supplier wise Details",
  LBL_DOCUMENTWISE: "Document Details",
  USER_DETAILS_LBL: [
    "Financial Year",
    "Tax Period",
    "GSTIN",
    "Legal Name",
    "Trade Name (if any)",
    "Date of generation",
  ],
  READ_ME_HEADER: [
    "Worksheet Name",
    "GSTR-2B Table Reference",
    "Field Name",
    "Instructions",
  ],
  RDME_SEC_LBL: [
    "B2B",
    "B2BA",
    "B2B-CDNR",
    "B2B-CDNRA",
    "ISD",
    "ISDA",
    "IMPG",
    "IMPGSEZ",
  ],
  RDME_NT_TXT_LBL: [
    "Taxable inward supplies received from registered person",
    "Amendments to previously uploaded invoices by supplier",
    "Debit/Credit notes(Original)",
    "Amendments to previously uploaded Credit/Debit notes by supplier",
    "ISD Credit",
    "Amendments to ISD Credits received",
    "Import of goods from overseas on bill of entry",
    "Import of goods from SEZ units/developers on bill of entry",
  ],
  RDME_FLD_B2B_LBL: [
    "GSTIN of Supplier",
    "Trade/Legal name",
    "Invoice number",
    "Invoice type",
    "Invoice date",
    "Invoice value",
    "Place of supply",
    "Supply attract Reverse charge",
    "Rate(%)",
    "Taxable value",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "GSTR-1/5 Period",
    "GSTR-1/5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
    "Source",
    "IRN",
    "IRN date",
  ],
  RDME_FLD_B2B_LBL_IFF: [
    "GSTIN of Supplier",
    "Trade/Legal name",
    "Invoice number",
    "Invoice type",
    "Invoice date",
    "Invoice value",
    "Place of supply",
    "Supply attract Reverse charge",
    "Rate(%)",
    "Taxable value",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "GSTR-1/IFF/GSTR-5 Period",
    "GSTR-1/IFF/GSTR-5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
    "Source",
    "IRN",
    "IRN date",
  ],
  RDME_FLD_B2B_INFO_LBL: [
    "GSTIN of supplier",
    "Trade name of the supplier will be displayed. If trade name is not available, then legal name of the supplier",
    "Invoice number",
    "Invoice type can be derived based on the following types \n R- Regular (Other than SEZ supplies and Deemed exports) \n SEZWP- SEZ supplies with payment of tax \n SEZWOP- SEZ supplies with out payment of tax \n DE- Deemed exports \n CBW - Intra-State Supplies attracting IGST",
    "Invoice date format shall be DD-MM-YYYY",
    "Invoice value (in rupees)",
    "Place of supply shall be the place where goods are supplied or services are provided (As  declared by the supplier)",
    "Supply attract reverse charge divided into two types: \n Y- Purchases attract reverse charge \n N- Purchases don\u2019t attract reverse charge",
    "Applicable Rate of tax",
    "Taxable value",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-1/5 has been filed",
    "Date on which GSTR-1/5 has been filed",
    "Is ITC available or not on the document - 'Yes' or 'No'",
    "Reason, if ITC availability is 'No'",
    "If the supply is eligible to be taxed at 65% of the existing rate of tax, it shall be 65%, else blank",
    "Source of the document shall be displayed. It shall be: \n a. 'e-invoice', if the document is auto-populated from e-invoice. \n b. Blank, if the document is uploaded by the supplier",
    "It is the unique Invoice reference number of the document auto-populated from e-invoice. For the documents uploaded by the supplier, this shall be blank.",
    "This is the date of invoice reference number, auto-populated from e-invoice. For the documents uploaded by the supplier, this shall be blank.",
  ],
  RDME_FLD_B2B_INFO_LBL_IFF: [
    "GSTIN of supplier",
    "Trade name of the supplier will be displayed. If trade name is not available, then legal name of the supplier",
    "Invoice number",
    "Invoice type can be derived based on the following types \n R- Regular (Other than SEZ supplies and Deemed exports) \n SEZWP- SEZ supplies with payment of tax \n SEZWOP- SEZ supplies with out payment of tax \n DE- Deemed exports \n CBW - Intra-State Supplies attracting IGST",
    "Invoice date format shall be DD-MM-YYYY",
    "Invoice value (in rupees)",
    "Place of supply shall be the place where goods are supplied or services are provided (As  declared by the supplier)",
    "Supply attract reverse charge divided into two types: \n Y- Purchases attract reverse charge \n N- Purchases don\u2019t attract reverse charge",
    "Applicable Rate of tax",
    "Taxable value",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-1/IFF/GSTR-5 has been filed",
    "Date on which GSTR-1/IFF/GSTR-5 has been filed",
    "Is ITC available or not on the document - 'Yes' or 'No'",
    "Reason, if ITC availability is 'No'",
    "If the supply is eligible to be taxed at 65% of the existing rate of tax, it shall be 65%, else blank",
    "Source of the document shall be displayed. It shall be: \n a. 'e-invoice', if the document is auto-populated from e-invoice. \n b. Blank, if the document is uploaded by the supplier",
    "It is the unique Invoice reference number of the document auto-populated from e-invoice. For the documents uploaded by the supplier, this shall be blank.",
    "This is the date of invoice reference number, auto-populated from e-invoice. For the documents uploaded by the supplier, this shall be blank.",
  ],
  RDME_FLD_B2BA_LBL: [
    "Invoice number (Original details)",
    "Invoice date (Original details)",
    "GSTIN of Supplier",
    "Trade/Legal name",
    "Invoice number",
    "Invoice type",
    "Invoice date",
    "Invoice value",
    "Place of supply",
    "Supply attract Reverse charge",
    "Rate(%)",
    "Taxable value",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "GSTR-1/5 Period",
    "GSTR-1/5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
  ],
  RDME_FLD_B2BA_LBL_IFF: [
    "Invoice number (Original details)",
    "Invoice date (Original details)",
    "GSTIN of Supplier",
    "Trade/Legal name",
    "Invoice number",
    "Invoice type",
    "Invoice date",
    "Invoice value",
    "Place of supply",
    "Supply attract Reverse charge",
    "Rate(%)",
    "Taxable value",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "GSTR-1/IFF/GSTR-5 Period",
    "GSTR-1/IFF/GSTR-5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
  ],
  RDME_FLD_B2BA_INFO_LBL_IFF: [
    "Original invoice number",
    "Original invoice date (Date format shall be DD-MM-YYYY)",
    "GSTIN of supplier",
    "Trade name of the supplier will be displayed. If trade name is not available then legal name of the supplier.",
    "Revised Invoice number",
    "Invoice type can be derived based on the following types \n R- Regular (Other than SEZ supplies and Deemed exports) \n SEZWP- SEZ supplies with payment of tax \n SEZWOP- SEZ supplies with out payment of tax \n DE- Deemed exports \n CBW - Intra-State Supplies attracting IGST",
    "Invoice date format shall be DD-MM-YYYY",
    "Invoice value (in rupees)",
    "Place of supply shall be the place where goods supplied or services provided (As declared by the supplier)",
    "Supply attract reverse charge divided in to two types \n Y- Purchases attract reverse charge \n N- Purchases don\u2019t attract reverse charge",
    "Applicable Rate of tax",
    "Taxable value (In rupees)",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-1/IFF/GSTR-5 has been filed",
    "Date on which GSTR-1/IFF/GSTR-5 has been filed",
    "If ITC is available, 'Yes', else 'No'",
    "Reason, if ITC availability is 'No'",
    "If the supply is eligible to be taxed at 65% of the existing rate of tax, it shall be 65%, else blank",
  ],
  RDME_FLD_B2BA_INFO_LBL: [
    "Original invoice number",
    "Original invoice date (Date format shall be DD-MM-YYYY)",
    "GSTIN of supplier",
    "Trade name of the supplier will be displayed. If trade name is not available then legal name of the supplier.",
    "Revised Invoice number",
    "Invoice type can be derived based on the following types \n R- Regular (Other than SEZ supplies and Deemed exports) \n SEZWP- SEZ supplies with payment of tax \n SEZWOP- SEZ supplies with out payment of tax \n DE- Deemed exports \n CBW - Intra-State Supplies attracting IGST",
    "Invoice date format shall be DD-MM-YYYY",
    "Invoice value (in rupees)",
    "Place of supply shall be the place where goods supplied or services provided (As declared by the supplier)",
    "Supply attract reverse charge divided in to two types \n Y- Purchases attract reverse charge \n N- Purchases don\u2019t attract reverse charge",
    "Applicable Rate of tax",
    "Taxable value (In rupees)",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-1/5 has been filed",
    "Date on which GSTR-1/5 has been filed",
    "If ITC is available, 'Yes', else 'No'",
    "Reason, if ITC availability is 'No'",
    "If the supply is eligible to be taxed at 65% of the existing rate of tax, it shall be 65%, else blank",
  ],
  RDME_FLD_CDNR_LBL: [
    "GSTIN of Supplier",
    "Trade/Legal name",
    "Note number",
    "Note type",
    "Note Supply Type",
    "Note date",
    "Note Value",
    "Place of supply",
    "Supply attract Reverse charge",
    "Rate(%)",
    "Taxable value",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "GSTR-1/5 Period",
    "GSTR-1/5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
    "Source",
    "IRN",
    "IRN date",
  ],
  RDME_FLD_CDNR_LBL_IFF: [
    "GSTIN of Supplier",
    "Trade/Legal name",
    "Note number",
    "Note type",
    "Note Supply Type",
    "Note date",
    "Note Value",
    "Place of supply",
    "Supply attract Reverse charge",
    "Rate(%)",
    "Taxable value",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "GSTR-1/IFF/GSTR-5 Period",
    "GSTR-1/IFF/GSTR-5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
    "Source",
    "IRN",
    "IRN date",
  ],
  RDME_FLD_CDNR_INFO_LBL_IFF: [
    "GSTIN of supplier",
    "Trade name of the supplier will be displayed. If trade name is not available then legal name of the supplier",
    "Debit/Credit note number",
    "Document type can be Debit note or credit note",
    "Note Supply type can be derived based on the following types \n R- Regular (Other than SEZ supplies and Deemed exports) \n SEZWP- SEZ supplies with payment of tax \n SEZWOP- SEZ supplies with out payment of tax \n DE- Deemed exports \n CBW - Intra-State Supplies attracting IGST",
    "Debit/Credit note date format shall be (DD-MM-YYYY)",
    "Debit/Credit note value (In rupees)",
    "Place of supply shall be the place where goods supplied or services provided (As declared by the supplier)",
    "Supply attract reverse charge divided in to two types \n Y- Purchases attract reverse charge \n N- Purchases don\u2019t attract reverse charge",
    "Applicable Rate of tax",
    "Taxable value (In rupees)",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-1/IFF/GSTR-5 has been filed",
    "Date on which GSTR-1/IFF/GSTR-5 has been filed",
    "If ITC is available, 'Yes', else 'No'",
    "Reason, if ITC availability is 'No'",
    "If the supply is eligible to be taxed at 65% of the existing rate of tax, it shall be 65%, else blank",
    "Source of the document shall be displayed. It shall be: \n a. 'e-invoice', if the document is auto-populated from e-invoice. \n b. Blank, if the document is uploaded by the supplier",
    "It is the unique Invoice reference number of the document auto-populated from e-invoice. For the documents uploaded by the supplier, this shall be blank.",
    "This is the date of invoice reference number, auto-populated from e-invoice. For the documents uploaded by the supplier, this shall be blank.",
  ],
  RDME_FLD_CDNR_INFO_LBL: [
    "GSTIN of supplier",
    "Trade name of the supplier will be displayed. If trade name is not available then legal name of the supplier",
    "Debit/Credit note number",
    "Document type can be Debit note or credit note",
    "Note Supply type can be derived based on the following types \n R- Regular (Other than SEZ supplies and Deemed exports) \n SEZWP- SEZ supplies with payment of tax \n SEZWOP- SEZ supplies with out payment of tax \n DE- Deemed exports \n CBW - Intra-State Supplies attracting IGST",
    "Debit/Credit note date format shall be (DD-MM-YYYY)",
    "Debit/Credit note value (In rupees)",
    "Place of supply shall be the place where goods supplied or services provided (As declared by the supplier)",
    "Supply attract reverse charge divided in to two types \n Y- Purchases attract reverse charge \n N- Purchases don\u2019t attract reverse charge",
    "Applicable Rate of tax",
    "Taxable value (In rupees)",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-1/5 has been filed",
    "Date on which GSTR-1/5 has been filed",
    "If ITC is available, 'Yes', else 'No'",
    "Reason, if ITC availability is 'No'",
    "If the supply is eligible to be taxed at 65% of the existing rate of tax, it shall be 65%, else blank",
    "Source of the document shall be displayed. It shall be: \n a. 'e-invoice', if the document is auto-populated from e-invoice. \n b. Blank, if the document is uploaded by the supplier",
    "It is the unique Invoice reference number of the document auto-populated from e-invoice. For the documents uploaded by the supplier, this shall be blank.",
    "This is the date of invoice reference number, auto-populated from e-invoice. For the documents uploaded by the supplier, this shall be blank.",
  ],
  RDME_FLD_CDNRA_LBL: [
    "Note type(Original)",
    "Note number(Original)",
    "Note date(Original)",
    "GSTIN of Supplier",
    "Trade/Legal name",
    "Note number",
    "Note type",
    "Note Supply Type",
    "Note date",
    "Note Value",
    "Place of supply",
    "Supply attract Reverse charge",
    "Rate(%)",
    "Taxable value",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "GSTR-1/5 Period",
    "GSTR-1/5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
  ],
  RDME_FLD_CDNRA_LBL_IFF: [
    "Note type(Original)",
    "Note number(Original)",
    "Note date(Original)",
    "GSTIN of Supplier",
    "Trade/Legal name",
    "Note number",
    "Note type",
    "Note Supply Type",
    "Note date",
    "Note Value",
    "Place of supply",
    "Supply attract Reverse charge",
    "Rate(%)",
    "Taxable value",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "GSTR-1/IFF/GSTR-5 Period",
    "GSTR-1/IFF/GSTR-5 Filing Date",
    "ITC Availability",
    "Reason",
    "Applicable % of Tax Rate",
  ],
  RDME_FLD_CDNRA_INFO_LBL_IFF: [
    "Note type can be Debit note or credit note",
    "Original Debit/Credit note number",
    "Original Debit/Credit note date (Note date format shall be DD-MM-YYYY)",
    "GSTIN of supplier",
    "Trade name of the supplier will be displayed. If trade name is not available then legal name of the supplier",
    "Debit/Credit note number",
    "Note type can be Debit note or credit note",
    "Note Supply type can be derived based on the following types \n R- Regular (Other than SEZ supplies and Deemed exports) \n SEZWP- SEZ supplies with payment of tax \n SEZWOP- SEZ supplies with out payment of tax \n DE- Deemed exports \n CBW - Intra-State Supplies attracting IGST",
    "Debit/Credit note date format shall be (DD-MM-YYYY)",
    "Debit/Credit note value (In rupees)",
    "Place of supply shall be the place where goods supplied or services provided (As declared by the supplier)",
    "Supply attract reverse charge divided in to two types \n Y- Purchases attract reverse charge \n N- Purchases don\u2019t attract reverse charge",
    "Applicable Rate of tax",
    "Taxable value (In rupees)",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-1/IFF/GSTR-5 has been filed",
    "Date on which GSTR-1/IFF/GSTR-5 has been filed",
    "If ITC is available, 'Yes', else 'No'",
    "Reason, if ITC availability is 'No'",
    "If the supply is eligible to be taxed at 65% of the existing rate of tax, it shall be 65%, else blank",
  ],
  RDME_FLD_CDNRA_INFO_LBL: [
    "Note type can be Debit note or credit note",
    "Original Debit/Credit note number",
    "Original Debit/Credit note date (Note date format shall be DD-MM-YYYY)",
    "GSTIN of supplier",
    "Trade name of the supplier will be displayed. If trade name is not available then legal name of the supplier",
    "Debit/Credit note number",
    "Note type can be Debit note or credit note",
    "Note Supply type can be derived based on the following types \n R- Regular (Other than SEZ supplies and Deemed exports) \n SEZWP- SEZ supplies with payment of tax \n SEZWOP- SEZ supplies with out payment of tax \n DE- Deemed exports \n CBW - Intra-State Supplies attracting IGST",
    "Debit/Credit note date format shall be (DD-MM-YYYY)",
    "Debit/Credit note value (In rupees)",
    "Place of supply shall be the place where goods supplied or services provided (As declared by the supplier)",
    "Supply attract reverse charge divided in to two types \n Y- Purchases attract reverse charge \n N- Purchases don\u2019t attract reverse charge",
    "Applicable Rate of tax",
    "Taxable value (In rupees)",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-1/5 has been filed",
    "Date on which GSTR-1/5 has been filed",
    "If ITC is available, 'Yes', else 'No'",
    "Reason, if ITC availability is 'No'",
    "If the supply is eligible to be taxed at 65% of the existing rate of tax, it shall be 65%, else blank",
  ],
  RDME_FLD_ISD_LBL: [
    "GSTIN of ISD",
    "Trade/Legal name of the ISD",
    "ISD Document type",
    "ISD Document number",
    "ISD Document date",
    "Original ISD Invoice number",
    "Original ISD Invoice date",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "ISD GSTR-6 Period",
    "ISD GSTR-6 Filing date",
    "Eligibilty of ITC",
  ],
  RDME_FLD_ISD_INFO_LBL: [
    "Input Service Distributor GSTIN",
    "Trade name of the ISD will be displayed. If trade name is not available then legal name of the ISD",
    "ISD document type can be Invoice or Credit note",
    "ISD invoice / ISD Credit note number",
    "ISD Document date format will be DD-MM-YYYY",
    "This is applicable only if ISD document type is 'Credit note' is linked to invoice",
    "This is applicable only if ISD document type is 'Credit note' is linked to invoice",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-6 is to be filed.",
    "Date on which GSTR-6 has been filed.",
    "Eligibility of ITC are two types: \n Y-Yes. Taxpayer can claim ITC on such invoice \n N- No. Taxpayer can't claim ITC on such invoice",
  ],
  RDME_FLD_ISDA_LBL: [
    "ISD Document type (Original)",
    "ISD Document Number (Original)",
    "ISD Document date (Original)",
    "GSTIN of ISD",
    "Trade/Legal name of the ISD",
    "ISD Document type",
    "ISD Document number",
    "ISD Document date",
    "Original ISD Invoice number",
    "Original ISD Invoice date",
    "Integrated Tax",
    "Central Tax",
    "State/UT tax",
    "Cess",
    "ISD GSTR-6 Period",
    "ISD GSTR-6 Filing date",
    "Eligibilty of ITC",
  ],
  RDME_FLD_ISDA_INFO_LBL: [
    "ISD document type can be Invoice or Credit note",
    "Invoice/Credit note number",
    "Invoice/Credit note date",
    "GSTIN of the Input Service Distributor",
    "Trade name of the ISD will be displayed. If trade name is not available then legal name of the ISD",
    "ISD document type can be Invoice or Credit note",
    "ISD invoice / ISD Credit note number",
    "ISD Document date format will be DD-MM-YYYY",
    "This is applicable only if ISD document type is 'Credit note' is linked to invoice",
    "This is applicable only if ISD document type is 'Credit note' is linked to invoice",
    "Integrated Tax amount (In rupees)",
    "Central Tax amount (In rupees)",
    "State/UT tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Period for which GSTR-6 is to be filed.",
    "Date on which GSTR-6 has been filed.",
    "Eligibility of ITC are two types \n Y-Yes. Taxpayer can claim ITC on such invoice \n N- No. Taxpayer can't claim ITC on such invoice",
  ],
  RDME_FLD_IMPG_LBL: [
    "ICEGATE Reference date",
    "Port Code",
    "Bill of Entry number",
    "Bill of Entry date",
    "Taxable value",
    "Integrated Tax",
    "Cess",
    "Amended (Yes)",
  ],
  RDME_FLD_IMPG_INFO_LBL: [
    "Relevant date for availing credit on the bill of entry",
    "Port code",
    "Bill of Entry number",
    "Bill of Entry date format shall be DD-MM-YYYY",
    "Taxable value (In rupees)",
    "Integrated Tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Has the bill of entry been amended. 'Yes' or 'No'",
  ],
  RDME_FLD_IMPGSEZ_LBL: [
    "GSTIN of Supplier",
    "Trade/Legal name",
    "ICEGATE Reference date",
    "Port Code",
    "Bill of Entry number",
    "Bill of Entry date",
    "Taxable value",
    "Integrated Tax",
    "Cess",
    "Amended (Yes)",
  ],
  RDME_FLD_IMPGSEZ_INFO_LBL: [
    "GSTIN of SEZ supplier",
    "Trade name of the SEZ supplier will be displayed. If trade name is not available then legal name of the SEZ supplier",
    "Relevant date for availing credit on the bill of entry",
    "Port code",
    "Bill of Entry number",
    "Bill of Entry date format shall be DD-MM-YYYY",
    "Taxable value (In rupees)",
    "Integrated Tax amount (In rupees)",
    "Cess amount (In rupees)",
    "Has the bill of entry been amended. 'Yes' or 'No'",
  ],
  SUMMARY_HEADER: [
    "S.no.",
    "Heading",
    "GSTR-3B table",
    "Integrated Tax  (\u20b9)",
    "Central Tax (\u20b9)",
    "State/UT Tax (\u20b9)",
    "Cess  (\u20b9)",
    "Advisory",
  ],
  BACK_TO_DASH: "BACK TO DASHBOARD",
  DWLD_PDF: "DOWNLOAD GSTR-2B SUMMARY (PDF)",
  DWLD_EXCEL: "DOWNLOAD GSTR-2B DETAILS (EXCEL)",
  SUM_ITC_AVL: "ITC available",
  SUM_NOT_AVL: "ITC not available",
  SUM_SNO_LBL: "S.NO.",
  SUM_HEAD_LBL: "Heading",
  SUM_3B_LBL: "GSTR-3B table",
  SUM_INT_LBL: "Integrated",
  SUM_CNT_LBL: "Central",
  SUM_STATE_LBL: "State/UT",
  SUM_CESS_LBL: "Cess (\u20b9)",
  SUM_TAX_LBL: "Tax (\u20b9)",
  SUM_PARTA_LBL: "Part A",
  SUM_PARTB_LBL: "Part B",
  SUM_ITC_AVL_LBL:
    "ITC Available - Credit may be claimed in relevant headings in GSTR-3B",
  SUM_NON_REV_LBL: "All other ITC - Supplies from registered persons",
  SUM_B2B_INV: "B2B - Invoices",
  SUM_CDNR_DB: "B2B - Debit notes",
  SUM_B2BA_INV: "B2B - Invoices (Amendment)",
  SUM_CDNRA_DB: "B2B - Debit notes (Amendment)",
  SUM_ISD_LBL: "Inward Supplies from ISD",
  SUM_ISD_INV: "ISD - Invoices",
  SUM_ISDA_INV: "ISD - Invoices (Amendment)",
  SUM_REV_LBL: "Inward Supplies liable for reverse charge",
  SUM_IMP_LBL: "Import of Goods",
  SUM_IMPG: "IMPG - Import of goods from overseas",
  SUM_IMPGA: "IMPG (Amendment)",
  SUM_IMPGSEZ: "IMPGSEZ - Import of goods from SEZ",
  SUM_IMPGASEZ: "IMPGSEZ (Amendment)",
  SUM_REVER_LBL:
    "ITC Reversal - Credit may be reversed in relevant headings in GSTR-3B",
  SUM_OTHERS_LBL: "Others",
  SUM_CDNR_CN: "B2B - Credit Notes",
  SUM_CDNRA_CN: "B2B - Credit notes (Amendment)",
  SUM_CDNR_CN_REV: "B2B - Credit notes (Reverse charge)",
  SUM_CDNRA_CN_REV: "B2B - Credit notes (Reverse charge) (Amendment)",
  SUM_ISD_CN: "ISD - Credit notes",
  SUM_ISDA_CN: "ISD - Credit notes (Amendment)",
  DWLD_ADVISORY: "DOWNLOAD ADVISORY",
  SUM_TAB_LBL: "SUMMARY",
  SUM_ALL_TABLE: "ALL TABLES",
  BOE_INFO_MSG:
    "Please enter Bill of Entry with reference date within the selected period.",
};

const changeMonthIndexToString1 = (n) => {
  switch (n.substring(0, 2)) {
    case "01":
      return "January";
    case "02":
      return "February";
    case "03":
      return "March";
    case "04":
      return "April";
    case "05":
      return "May";
    case "06":
      return "June";
    case "07":
      return "July";
    case "08":
      return "August";
    case "09":
      return "September";
    case "10":
      return "October";
    case "11":
      return "November";
    case "12":
      return "December";
    default:
      return "Invalid month index";
  }
};

//a.i.prototype.transform()
const changeMonthIndexToString2 = (n) => {
  let t = "";
  if (null != n && "" != n) {
    let e = (n = n.toString()).substring(0, 2);
    switch (parseInt(e)) {
      case 1:
        t = "Jan";
        break;
      case 2:
        t = "Feb";
        break;
      case 3:
        t = "Mar";
        break;
      case 4:
        t = "Apr";
        break;
      case 5:
        t = "May";
        break;
      case 6:
        t = "Jun";
        break;
      case 7:
        t = "Jul";
        break;
      case 8:
        t = "Aug";
        break;
      case 9:
        t = "Sep";
        break;
      case 10:
        t = "Oct";
        break;
      case 11:
        t = "Nov";
        break;
      case 12:
        t = "Dec";
    }
    return "-" != t && (t = t + "'" + n.substring(4)), t;
  }
};

const changeNumberToAccountingString = (n) => {
  if (!isNaN(n)) {
    return n.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return null;
};

//a.b.prototype.transform()
const changeDateFormat = (n) => {
  let t = "";
  return null != n
    ? ((t = n.replace(
        new RegExp("-".replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        "/"
      )),
      t)
    : t;
};

//a.k.prototype.transform()
const expandPolarValue = (n) => {
  let t = "";
  return (
    (null == n && "" == n) || ("Y" == n ? (t = "Yes") : "N" == n && (t = "No")),
    t
  );
};

//a.j.prototype.transform()
const expandTransactionType = (n) => {
  switch (n) {
    case "R":
      return "Regular";
    case "DE":
      return "Deemed Export";
    case "SEWP":
      return "SEZ supplies with payment of tax";
    case "SEWOP":
      return "SEZ supplies without payment of tax";
    case "CBW":
      return "Intra-State supplies attracting IGST";
    case "ISDI":
      return "Invoice";
    case "ISDC":
      return "Credit Note";
    default:
      return "";
  }
};

//a.d.prototype.transform()
const expandDocumentType = (n) => {
  let t = "";
  return (
    null != n &&
      "" != n &&
      ("C" == n
        ? (t = "Credit Note")
        : "D" == n
        ? (t = "Debit Note")
        : "I" == n && (t = "Invoice")),
    t
  );
};

//a.h.prototype.transform()
const getStateName = (n) => {
  let e = "";
  switch (Number(n)) {
    case 1:
      e = "Jammu and Kashmir";
      break;
    case 2:
      e = "Himachal Pradesh";
      break;
    case 3:
      e = "Punjab";
      break;
    case 4:
      e = "Chandigarh";
      break;
    case 5:
      e = "Uttarakhand";
      break;
    case 6:
      e = "Haryana";
      break;
    case 7:
      e = "Delhi";
      break;
    case 8:
      e = "Rajasthan";
      break;
    case 9:
      e = "Uttar Pradesh";
      break;
    case 10:
      e = "Bihar";
      break;
    case 11:
      e = "Sikkim";
      break;
    case 12:
      e = "Arunachal Pradesh";
      break;
    case 13:
      e = "Nagaland";
      break;
    case 14:
      e = "Manipur";
      break;
    case 15:
      e = "Mizoram";
      break;
    case 16:
      e = "Tripura";
      break;
    case 17:
      e = "Meghalaya";
      break;
    case 18:
      e = "Assam";
      break;
    case 19:
      e = "West Bengal";
      break;
    case 20:
      e = "Jharkhand";
      break;
    case 21:
      e = "Odisha";
      break;
    case 22:
      e = "Chhattisgarh";
      break;
    case 23:
      e = "Madhya Pradesh";
      break;
    case 24:
      e = "Gujarat";
      break;
    case 25:
      e = "Daman and Diu";
      break;
    case 26:
      e = "Dadra and Nagar Haveli";
      break;
    case 27:
      e = "Maharashtra";
      break;
    case 29:
      e = "Karnataka";
      break;
    case 30:
      e = "Goa";
      break;
    case 31:
      e = "Lakshadweep";
      break;
    case 32:
      e = "Kerala";
      break;
    case 33:
      e = "Tamil Nadu";
      break;
    case 34:
      e = "Puducherry";
      break;
    case 35:
      e = "Andaman and Nicobar Islands";
      break;
    case 36:
      e = "Telangana";
      break;
    case 37:
      e = "Andhra Pradesh";
      break;
    case 38:
      e = "Ladakh";
      break;
    case 96:
      e = "Foreign Country";
      break;
    case 97:
      e = "Other Territory";
      break;
    case 98:
      e = "Default State";
      break;
    case 99:
      e = "Center Jurisdication";
  }
  return e;
};

//a.e.prototype.transform()
const getIneligibleReason = (n) => {
  let t = "";
  return (
    null != n &&
      "" != n &&
      ("C" == n
        ? (t = "Return filed post annual cut-off")
        : "P" == n &&
          (t =
            "POS and supplier state are same but recipient state is different")),
    t
  );
};
