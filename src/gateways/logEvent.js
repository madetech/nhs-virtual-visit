import fetch from "isomorphic-unfetch";

const logEvent = (key, url) => async (event) => {
  let response;
  const body = JSON.stringify(event);
  try {
    response = await fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "x-functions-key": key,
      },
    });
    return response;
  } catch {
    (error) => {
      console.error("Error (log event):", error);
      response.error = error;
      return response;
    };
  }
};

export default logEvent;
