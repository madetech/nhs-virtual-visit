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
      contactEmail: "bob.smith@madetech.com",
      contactName: "John Smith",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: 12345,
      provider: "jitsi",
      wardId: 1,
      callPassword: "securePassword",
    };

    const resultingId = await createVisit(container)(request);

    expect(resultingId).toEqual(10);

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.patientName,
      request.contactEmail,
      request.contactNumber,
      request.contactName,
      request.callTime,
      request.callId,
      request.provider,
      request.wardId,
      request.callPassword,
    ]);
  });
});
