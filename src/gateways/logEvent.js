import fetch from "isomorphic-unfetch";
import logger from "../../logger";

const logEvent = (key, url) => async (event) => {
  const body = JSON.stringify(event);
  try {
    const response = await fetch(url, {
      method: "POST",
      body: body,
      headers: {
        "x-functions-key": key,
      },
    });
    return response;
  } catch (error) {
    logger.error("Error (log event):", error);
    return { status: 500, error };
  }
};

export default logEvent;
