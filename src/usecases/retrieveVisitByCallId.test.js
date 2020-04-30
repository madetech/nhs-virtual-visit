import retrieveVisitByCallId from "./retrieveVisitByCallId";

describe("retrieveVisitByCallId", () => {
  it("returns a json object containing the call", async () => {
    const container = {
      async getDb() {
        return {
          any: jest.fn().mockReturnValue([
            {
              id: 1,
              patient_name: "Bob",
              call_time: new Date("2020-04-15T23:00:00.000Z"),
              recipient_number: "07700900900",
              recipient_name: "John",
              call_id: "cb238rfv23cuv3",
              provider: "whereby",
            },
          ]),
        };
      },
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
      recipientName: "John",
      callId: "cb238rfv23cuv3",
      provider: "whereby",
    });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      async getDb() {
        return {
          any: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };

    const { error } = await retrieveVisitByCallId(container)("cb238rfv23cuv3");
    expect(error).toBeDefined();
  });
});
