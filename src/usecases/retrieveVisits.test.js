import retrieveVisits from "./retrieveVisits";

describe("retrieveVisits", () => {
  it("returns a json object containing the calls", async () => {
    const container = {
      async getDb() {
        return {
          any: jest.fn().mockReturnValue([
            {
              id: 1,
              patient_name: "Bob",
              call_time: new Date("2020-04-15T23:00:00.000Z"),
              recipient_number: "07907095342",
              recipient_name: "",
              call_id: "cb238rfv23cuv3",
              provider: "whereby",
            },
            {
              id: 2,
              patient_name: "Harry",
              call_time: new Date("2020-04-15T23:00:00.000Z"),
              recipient_number: "07907095342",
              recipient_name: "Bob",
              call_id: "cb238rfv23cuv3",
              provider: "jitsi",
            },
          ]),
        };
      },
    };

    const { scheduledCalls, error } = await retrieveVisits(container);

    expect(error).toBeNull();
    expect(scheduledCalls).toHaveLength(2);
    expect(scheduledCalls[0]).toEqual({
      id: 1,
      patientName: "Bob",
      callTime: "2020-04-15T23:00:00.000Z",
      recipientNumber: "07907095342",
      recipientName: "",
      callId: "cb238rfv23cuv3",
      provider: "whereby",
    });
    expect(scheduledCalls[1]).toEqual({
      id: 2,
      patientName: "Harry",
      callTime: "2020-04-15T23:00:00.000Z",
      recipientNumber: "07907095342",
      recipientName: "Bob",
      callId: "cb238rfv23cuv3",
      provider: "jitsi",
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

    const { error } = await retrieveVisits(container);
    expect(error).toBeDefined();
  });
});
