export const sendXHR = ({ url, method, params, body }) => {
  let requestConfig = {
    method: method,
    credentials: "include",
    redirect: "follow",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  if (method === "POST") requestConfig.body = JSON.stringify(body);
  if (params) url = `${url}?${new URLSearchParams(params)}`;

  return new Promise((resolve) => {
    fetch(url, requestConfig).then((response) => {
      response.text().then((data) => {
        resolve(data);
      });
    });
  });
};
