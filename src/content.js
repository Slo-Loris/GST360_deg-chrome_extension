import { sendXHR } from "./utils";

(() => {
  console.log("Content script is running...");
})();

//To be changed to port in future if required
chrome.runtime.onMessage.addListener((request, sender, response) => {
  let reqHostName = new URL(request.url).hostname;
  if (reqHostName === window.location.hostname) {
    sendXHR(request).then((data) => {
      if (request.responseType === "arraybuffer") {
        let url = window.URL.createObjectURL(
          new Blob([data], { type: "application/pdf" })
        );
        response(url);
      } else {
        response(JSON.parse(data));
      }
      //chrome.runtime.sendMessage({ ...data, id: requestId }, (response) => {});
    });
    return true;
  } else {
    response("request sent from different origin");
    return true;
  }
});
