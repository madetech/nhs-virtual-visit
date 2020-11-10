import logEvent from "../gateways/logEvent";
import nock from "nock";
describe("logEvent", () => {
  const key = (process.env.AZURE_FUNCTION_KEY = "key");
  const url = (process.env.AZURE_FUNCTION_URL = "http://url.com");

  const event = {
    sessionId: "sessionId",
    correlationId: "correlationId",
    createdOn: "createdOn",
    streamName: "streamName",
    trustId: "trustId",
    eventType: "leventType",
    event: {
      wardId: "wardId",
    },
  };

  it("sends log event request", async () => {
    const scope = nock(process.env.AZURE_FUNCTION_URL, {
      reqheaders: {
        "x-functions-key": "key",
      },
      allowUnmocked: true,
    })
      .post("/", JSON.stringify(event))
      .reply(201);

    const logEventResponse = await logEvent(key, url)(event);
    expect(logEventResponse.status).toEqual(201);
    scope.isDone();
  });

  it("catches error", async () => {
    const scope = nock(process.env.AZURE_FUNCTION_URL, {
      reqheaders: {
        "x-functions-key": "key",
      },
      allowUnmocked: true,
    })
      .post("/", JSON.stringify(event))
      .replyWithError("some error");

    const logEventResponse = await logEvent(key, url)(event);
    expect(logEventResponse.status).toEqual(500);
    scope.isDone();
  });
});
