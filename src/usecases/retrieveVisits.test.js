import retrieveVisits from "./retrieveVisits";

describe("retrieveVisits", () => {
  it("returns a json object containing the calls", async () => {
    const anySpy = jest.fn(() => [
      {
        id: 1,
        patient_name: "Bob",
        call_time: new Date("2020-04-15T23:00:00.000Z"),
        recipient_number: "07700900900",
        recipient_email: "billy@bob.com",
        recipient_name: "Billy",
        call_id: "cb238rfv23cuv3",
        provider: "whereby",
      },
      {
        id: 2,
        patient_name: "Harry",
        call_time: new Date("2020-04-15T23:00:00.000Z"),
        recipient_number: "07700900900",
        recipient_email: "bob@bob.com",
        recipient_name: "Bob",
        call_id: "cb238rfv23cuv3",
        provider: "jitsi",
      },
    ]);

    const container = {
      async getDb() {
        return {
          any: anySpy,
        };
      },
    };

    const { scheduledCalls, error } = await retrieveVisits(container)({
      wardId: 1,
    });

    expect(error).toBeNull();
    expect(anySpy).toHaveBeenCalledWith(expect.anything(), [
      1,
      "scheduled",
      "complete",
    ]);
    expect(scheduledCalls).toHaveLength(2);
    expect(scheduledCalls[0]).toEqual({
      id: 1,
      patientName: "Bob",
      callTime: "2020-04-15T23:00:00.000Z",
      recipientNumber: "07700900900",
      recipientEmail: "billy@bob.com",
      recipientName: "Billy",
      callId: "cb238rfv23cuv3",
      provider: "whereby",
    });
    expect(scheduledCalls[1]).toEqual({
      id: 2,
      patientName: "Harry",
      callTime: "2020-04-15T23:00:00.000Z",
      recipientNumber: "07700900900",
      recipientEmail: "bob@bob.com",
      recipientName: "Bob",
      callId: "cb238rfv23cuv3",
      provider: "jitsi",
    });
  });

  it("returns a query with a 12 hour interval", async () => {
    const anySpy = jest.fn(() => []);

    const container = {
      async getDb() {
        return {
          any: anySpy,
        };
      },
    };

    await retrieveVisits(container)({
      wardId: 1,
    });

    expect(anySpy).toHaveBeenCalledWith(
      `SELECT * FROM scheduled_calls_table
                 WHERE ward_id = $1 AND status = ANY(ARRAY[$2,$3]::text[]) AND pii_cleared_at IS NULL
                 ORDER BY call_time ASC`,
      [1, "scheduled", "complete"]
    );
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

    const { error } = await retrieveVisits(container)({ wardId: 1 });
    expect(error).toBeDefined();
  });
});
