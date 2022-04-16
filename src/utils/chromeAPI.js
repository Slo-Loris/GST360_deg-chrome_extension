export const getActiveTabId = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs.length > 0 ? tabs[0].id : null;
};

export const getActiveTabUrl = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs.length > 0 ? tabs[0].url : null;
};

export const getActiveTabDetails = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs.length > 0 ? tabs[0] : null;
};

export const sendMessage = async (request, key) => {
  let tabId = await getActiveTabId();
  return new Promise((resolve) =>
    chrome.tabs.sendMessage(tabId, request, (response) => {
      console.log(response);
      resolve({ data: response, key: key });
    })
  );
};
