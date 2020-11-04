import fetch from "isomorphic-unfetch";

export default async function fetchEndpointWithCorrelationId(
  method,
  endpoint,
  body,
  correlationId
) {
  return await fetch(endpoint, {
    method: method,
    body: body,
    headers: {
      "X-Correlation-ID": correlationId,
      "content-type": "application/json",
    },
  });
}
