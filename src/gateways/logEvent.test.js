import logEvent from "../gateways/logEvent";
import nock from "nock";
describe("logEvent", () => {
  let key = (process.env.AZURE_FUNCTION_KEY = "key");
  let url = (process.env.AZURE_FUNCTION_URL = "http://url.com");

  const getLogEventGateway = () => {
    return logEvent(key, url);
  };
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
  let scope;

  beforeEach(() => {
    scope = nock(process.env.AZURE_FUNCTION_URL, {
      reqheaders: {
        "x-functions-key": "key",
      },
      allowUnmocked: true,
    })
      .post("/", JSON.stringify(event))
      .reply(201);
  });

  it("can send a log event request", async () => {
    let logEvent = await getLogEventGateway();
    let logEventResponse = await logEvent(event);
    expect(logEventResponse.status).toEqual(201);
    expect(event).toHaveProperty("sessionId");
    expect(event).toHaveProperty("correlationId");
    expect(event).toHaveProperty("createdOn");
    expect(event).toHaveProperty("streamName");
    expect(event).toHaveProperty("trustId");
    expect(event).toHaveProperty("eventType");
    expect(event).toHaveProperty("event");
    expect(event.event).toHaveProperty("wardId");
    scope.isDone();
  });
});
