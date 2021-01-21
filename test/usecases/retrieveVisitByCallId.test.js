import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";

describe("retrieveVisitByCallId", () => {
  it("returns a json object containing the call", async () => {
    const container = {
      getRetrieveVisitByCallIdGateway: () => async () => ({
        scheduledCall: {
          id: 1,
          patientName: "Bob",
          callTime: "2020-04-15T23:00:00.000Z",
          recipientNumber: "07700900900",
          recipientEmail: "john@smith.com",
          recipientName: "John",
          callId: "cb238rfv23cuv3",
          provider: "whereby",
          callPassword: "securePassword",
        },
        error: null,
      }),
    };

    const { scheduledCall, error } = await retrieveVisitByCallId(container)(
      "cb238rfv23cuv3"
    );

    expect(error).toBeNull();
    expect(scheduledCall).toEqual({
      id: 1,
      patientName: "Bob",
      callTime: "2020-04-15T23:00:00.000Z",
      recipientNumber: "07700900900",
      recipientEmail: "john@smith.com",
      recipientName: "John",
      callId: "cb238rfv23cuv3",
      provider: "whereby",
      callPassword: "securePassword",
    });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      getRetrieveVisitByCallIdGateway: () => async () => ({
        error: "Foo",
      }),
    };

    const { error } = await retrieveVisitByCallId(container)("cb238rfv23cuv3");
    expect(error).toBeDefined();
  });
});
