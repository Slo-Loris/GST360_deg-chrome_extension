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
      startDate: "01/07/2017",
      endDate: "01/07/2017",
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
  encryptedDocId: {
    url: "https://services.gst.gov.in/litserv/auth/api/usr/getEncrypDocIds",
    method: "POST",
    body: {
      arn: new String(),
      docIdList: new Array(),
    },
  },
  downloadDocs: {
    url: "https://services.gst.gov.in/downloadhb/download/new",
    method: "GET",
    params: {
      docId: new String(),
      arn: new String(),
      eh: new String(),
    },
  },
  efilingStatus: {
    url: "https://return.gst.gov.in/returns/auth/api/efiledReturns",
    method: "POST",
    body: {
      fy: new String(),
      rfp: new String(),
      rtntp: new String(),
    },
  },
  gstr2bUserDetails: {
    url: "https://gstr2b.gst.gov.in/gstr2b/auth/api/gstr2b/getuserdtls",
    params: {
      rtnprd: new String(),
      fy: new String(),
    },
  },
  gstr2bJson: {
    url: "https://gstr2b.gst.gov.in/gstr2b/auth/api/gstr2b/getjson",
    method: "GET",
    params: {
      rtnprd: new String(),
      fn: new Number(),
    },
  },
};

export const dropDown = {
  Years: [
    {
      year: "2019-20",
      months: [
        {
          month: "April",
          value: "042019",
        },
        {
          month: "May",
          value: "052019",
        },
        {
          month: "June",
          value: "062019",
        },
        {
          month: "July",
          value: "072019",
        },
        {
          month: "August",
          value: "082019",
        },
        {
          month: "September",
          value: "092019",
        },
        {
          month: "October",
          value: "102019",
        },
        {
          month: "November",
          value: "112019",
        },
        {
          month: "December",
          value: "122019",
        },
        {
          month: "January",
          value: "012020",
        },
        {
          month: "February",
          value: "022020",
        },
        {
          month: "March",
          value: "032020",
        },
      ],
    },
    {
      year: "2018-19",
      months: [
        {
          month: "April",
          value: "042018",
        },
        {
          month: "May",
          value: "052018",
        },
        {
          month: "June",
          value: "062018",
        },
        {
          month: "July",
          value: "072018",
        },
        {
          month: "August",
          value: "082018",
        },
        {
          month: "September",
          value: "092018",
        },
        {
          month: "October",
          value: "102018",
        },
        {
          month: "November",
          value: "112018",
        },
        {
          month: "December",
          value: "122018",
        },
        {
          month: "January",
          value: "012019",
        },
        {
          month: "February",
          value: "022019",
        },
        {
          month: "March",
          value: "032019",
        },
      ],
    },
    {
      year: "2017-18",
      months: [
        {
          month: "July",
          value: "072017",
        },
        {
          month: "August",
          value: "082017",
        },
        {
          month: "September",
          value: "092017",
        },
        {
          month: "October",
          value: "102017",
        },
        {
          month: "November",
          value: "112017",
        },
        {
          month: "December",
          value: "122017",
        },
        {
          month: "January",
          value: "012018",
        },
        {
          month: "February",
          value: "022018",
        },
        {
          month: "March",
          value: "032018",
        },
      ],
    },
    {
      year: "2022-23",
      months: [
        {
          month: "April",
          value: "042022",
        },
      ],
    },
    {
      year: "2021-22",
      months: [
        {
          month: "April",
          value: "042021",
        },
        {
          month: "May",
          value: "052021",
        },
        {
          month: "June",
          value: "062021",
        },
        {
          month: "July",
          value: "072021",
        },
        {
          month: "August",
          value: "082021",
        },
        {
          month: "September",
          value: "092021",
        },
        {
          month: "October",
          value: "102021",
        },
        {
          month: "November",
          value: "112021",
        },
        {
          month: "December",
          value: "122021",
        },
        {
          month: "January",
          value: "012022",
        },
        {
          month: "February",
          value: "022022",
        },
        {
          month: "March",
          value: "032022",
        },
      ],
    },
    {
      year: "2020-21",
      months: [
        {
          month: "April",
          value: "042020",
        },
        {
          month: "May",
          value: "052020",
        },
        {
          month: "June",
          value: "062020",
        },
        {
          month: "July",
          value: "072020",
        },
        {
          month: "August",
          value: "082020",
        },
        {
          month: "September",
          value: "092020",
        },
        {
          month: "October",
          value: "102020",
        },
        {
          month: "November",
          value: "112020",
        },
        {
          month: "December",
          value: "122020",
        },
        {
          month: "January",
          value: "012021",
        },
        {
          month: "February",
          value: "022021",
        },
        {
          month: "March",
          value: "032021",
        },
      ],
    },
  ],
};
