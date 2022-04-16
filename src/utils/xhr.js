export const sendXHR = ({ url, method, params, body, responseType }) => {
  let requestConfig = {
    method: method,
    credentials: "include",
    redirect: "follow",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=ISO-8859-1",
    },
  };

  if (method === "POST") requestConfig.body = JSON.stringify(body);
  if (params) url = `${url}?${new URLSearchParams(params)}`;

  return new Promise((resolve) => {
    fetch(url, requestConfig).then((response) => {
      if (responseType === "arraybuffer") {
        response.arrayBuffer().then((data) => {
          resolve(data);
        });
      } else {
        response.text().then((data) => {
          resolve(data);
        });
      }
    });
  });
};
