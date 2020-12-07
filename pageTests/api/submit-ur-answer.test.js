import submitUrAnswer from "../../pages/api/submit-ur-answer";

describe("api/submit-ur-answer", () => {
  it("submitting an answer triggers a request to the azure function endpoint", async () => {
    let logEventStub = jest.fn(async (/*event*/) => {});
    let container = {
      getLogEventGateway: jest.fn(() => logEventStub),
    };
    let request = {
      headers: {},
      body: {
        "would miss nhs vv": "yes",
        trustId: "trust id",
      },
    };

    await submitUrAnswer(request, {}, { container });
    expect(container.getLogEventGateway).toHaveBeenCalled();
    expect(logEventStub).toHaveBeenCalledWith({
      sessionId: expect.anything(),
      correlationId: undefined,
      createdOn: expect.anything(),
      event: {
        answer: "yes",
      },
      eventType: "ur-question-answered",
      streamName: "ward-undefined",
      trustId: "trust id",
    });
  });
});
