import captureEvent from "../../src/usecases/captureEvent";

describe("captureEvent", () => {
  it("rejects a bad event", async () => {
    const gwSpy = jest.fn().mockResolvedValue({
      event: null,
      error: null,
    });

    const container = {
      getCaptureEventGateway: () => gwSpy,
    };

    const joinRequest = {
      action: null,
      visitId: null,
      callSessionId: null,
    };

    const { event, error } = await captureEvent(container)(joinRequest);

    expect(event).toBeNull();
    expect(error).toBeDefined();
    expect(gwSpy).toHaveBeenCalledWith(joinRequest);
  });

  it("accepts a valid join-visit event", async () => {
    const gwSpy = jest.fn().mockResolvedValue({
      event: {
        id: 1,
      },
      error: null,
    });

    const container = {
      getCaptureEventGateway: () => gwSpy,
    };

    const joinRequest = {
      action: "join-visit",
      visitId: 1,
      callSessionId: "c30c27f0-abb1-432e-8b87-44c41af1d76c",
    };

    const { event, error } = await captureEvent(container)(joinRequest);

    expect(error).toBeNull();
    expect(event.id).toEqual(1);
    expect(gwSpy).toHaveBeenCalledWith(joinRequest);
  });
});
