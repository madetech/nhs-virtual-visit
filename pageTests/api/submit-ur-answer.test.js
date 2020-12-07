import submitUrAnswer from "../../pages/api/submit-ur-answer";

describe("api/submit-ur-answer", () => {
  it("submitting an answer triggers a request to the azure function endpoint", async () => {
    let logEventStub = jest.fn(async (/*event*/) => {});
    let container = {
      getLogEventGateway: jest.fn(() => logEventStub),
    };
    let request = {
      headers: {
        "x-correlation-id": "25565",
      },
      body: {},
    };
    await submitUrAnswer(request, {}, { container });
    expect(container.getLogEventGateway).toHaveBeenCalled();
    expect(logEventStub).toHaveBeenCalledWith({
      sessionId: expect.anything(),
      correlationId: "25565",
      createdOn: expect.anything(),
      event: {
        answer: undefined,
      },
      eventType: "ur-question-answered",
      streamName: "user research",
      trustId: "not applicable",
    });
  });
});
