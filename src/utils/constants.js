export const PORTAL_URL = {
  servicesLogin: "https://services.gst.gov.in/services/login",
  servicesDashBoard: "https://services.gst.gov.in/services/auth/dashboard",
  returnDashBoard: "https://return.gst.gov.in/returns/auth/dashboard",
  serviceLogout: "https://services.gst.gov.in/services/logout",
};

export const PORTAL_ENDPOINTS = {
  userStatus1: {
    url: "https://services.gst.gov.in/services/api/ustatus",
    method: "GET",
  },
  userStatus2: {
    url: "https://return.gst.gov.in/services/api/ustatus",
    method: "GET",
  },
  dropDown: {
    url: "https://return.gst.gov.in/returns/auth/api/dropdown",
    method: "GET",
  },
  roleStatus: {
    url: "https://return.gst.gov.in/returns/auth/api/rolestatus",
    method: "GET",
    params: { rtn_prd: new String() },
  },
  generateReturn: {
    url: "https://return.gst.gov.in/returns/auth/api/offline/download/generate",
    method: "GET",
  },
  summaryGstr1: {
    url: "https://return.gst.gov.in/returns/auth/api/gstr1/summary",
    method: "GET",
  },
  summaryGstr3B: {
    url: "https://return.gst.gov.in/returns/auth/api/gstr3b/summary",
    method: "GET",
  },
  summaryGstr9: {
    url: "https://return.gst.gov.in/returns2/auth/api/gstr9/gstr9pdf",
    method: "GET",
  },
  systemGenerate3B: {
    url: "https://return.gst.gov.in/returns/auth/api/gstr3b/getr1r3bliab",
    method: "GET",
  },
  systemGenerate9: {
    url: "https://return.gst.gov.in/returns2/auth/api/gstr9/details/calc",
    method: "GET",
  },
  itcBalance: {
    url: "https://return.gst.gov.in/returns/auth/api/itcbalancex",
    method: "GET",
  },
  cashBalance: {
    url: "https://payment.gst.gov.in/payment/auth/api/cashbalance",
    method: "GET",
  },
  searchApplications: {
    url: "https://services.gst.gov.in/litserv/auth/api/case/search",
    method: "POST",
    body: {
      caseTypeCd: "RFUND",
      startDate: "31/12/2021",
      endDate: "15/01/2022",
    },
  },
  folderDetails: {
    url: "https://services.gst.gov.in/litserv/auth/api/case/folder",
    method: "POST",
    body: {
      caseTypeCd: "RFUND",
    },
  },
  folderItemDetails: {
    url: "https://services.gst.gov.in/litserv/auth/api/case/folder/items",
    method: "POST",
    body: {
      caseFolderId: new Number(),
    },
  },
};
