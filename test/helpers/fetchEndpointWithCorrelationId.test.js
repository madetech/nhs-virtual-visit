import fetchEndpointWithCorrelationId from "../../src/helpers/fetchEndpointWithCorrelationId";
import { v4 as uuidv4 } from "uuid";
import nock from "nock";

describe("fetchEndpointWithCorrelationId", () => {
  let body = JSON.stringify({ code: "code" });
  let correlationId = `${uuidv4()}-login`;
  let endpoint = "/api/session";
  let method = "POST";
  let scope;

  beforeEach(() => {
    scope = nock("http://localhost:3001", {
      reqheaders: {
        "X-Correlation-ID": correlationId,
        "content-type": "application/json",
      },
      //allowUnmocked: true,
    })
      .post(endpoint, body)
      .reply(201);
  });
  it("can make a request using fetchEndpointWithCorrelationId", async () => {
    const response = await fetchEndpointWithCorrelationId(
      method,
      "http://localhost:3001/api/session",
      body,
      correlationId
    );
    expect(response.status).toBe(201);
    expect(scope.isDone()).toBeTruthy();
  });
});
