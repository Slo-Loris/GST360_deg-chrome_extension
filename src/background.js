chrome.action.onClicked.addListener(execScript);

const endPoints = {
  ustatus: "https://return.gst.gov.in/services/api/ustatus",
  dropdown: "https://return.gst.gov.in/returns/auth/api/dropdown",
  rolestatus: "https://return.gst.gov.in/returns/auth/api/rolestatus",
};

async function execScript() {
  const tabId = await getTabId();
  const url = endPoints.dropdown;

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["inject.js"],
  });

  chrome.tabs.sendMessage(tabId, url);
}

async function getTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs.length > 0 ? tabs[0].id : null;
}
