import captureEvent from "./captureEvent";

describe("captureEvent", () => {
  it("rejects a bad event", async () => {
    const oneSpy = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const joinRequest = {
      action: null,
      visitId: null,
      callSessionId: null,
    };

    const { event, error } = await captureEvent(container)(joinRequest);

    expect(event).toBeNull();
    expect(error).toBeDefined();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      expect.anything(),
      null,
      null,
      null,
    ]);
  });

  it("accepts a valid join-visit event", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 1 });

    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const joinRequest = {
      action: "join-visit",
      visitId: 1,
      callSessionId: "c30c27f0-abb1-432e-8b87-44c41af1d76c",
    };

    const { event, error } = await captureEvent(container)(joinRequest);

    expect(error).toBeNull();
    expect(event.id).toEqual(1);
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      expect.anything(),
      "join-visit",
      1,
      "c30c27f0-abb1-432e-8b87-44c41af1d76c",
    ]);
  });
});
