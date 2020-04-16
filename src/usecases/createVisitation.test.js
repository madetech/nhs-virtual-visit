import createVisitation from "./createVisitation";

describe("createVisitation", () => {
  it("creates a visitation in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue(10);
    const container = {
      getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      patientName: "Bob Smith",
      contactNumber: "07123456789",
      callTime: new Date(),
      callId: 12345,
    };

    const resultingId = await createVisitation(container)(request);

    expect(resultingId).toEqual(10);

    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.patientName,
      request.contactNumber,
      request.callTime,
      request.callId,
    ]);
  });
});
