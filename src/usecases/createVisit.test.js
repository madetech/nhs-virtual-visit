import createVisit from "./createVisit";

describe("createVisit", () => {
  it("creates a visit in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue(10);
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      patientName: "Bob Smith",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: 12345,
      provider: "jitsi",
    };

    const resultingId = await createVisit(container)(request);

    expect(resultingId).toEqual(10);

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.patientName,
      request.contactNumber,
      request.contactName,
      request.callTime,
      request.callId,
      request.provider,
    ]);
  });
});
