import retrieveVisits from "./retrieveVisits";

describe("retrieveVisits", () => {
  it("returns a json object containing the calls", async () => {
    const container = {
      getDb: () => {
        return {
          ScheduledCall: {
            findAll: jest.fn().mockReturnValue([
              {
                id: 1,
                patient_name: "Bob",
                call_time: new Date("2020-04-15T23:00:00.000Z"),
                recipient_number: "07907095342",
                call_id: "cb238rfv23cuv3",
              },
              {
                id: 2,
                patient_name: "Harry",
                call_time: new Date("2020-04-15T23:00:00.000Z"),
                recipient_number: "07907095342",
                call_id: "cb238rfv23cuv3",
              },
            ]),
          },
          Sequelize: {
            literal: () => {},
          },
        };
      },
    };

    const { scheduledCalls, error } = await retrieveVisits(container);

    expect(error).toBeNull();
    expect(scheduledCalls).toHaveLength(2);
    expect(scheduledCalls[0]).toEqual(
      expect.objectContaining({ id: 1, patientName: "Bob" })
    );
    expect(scheduledCalls[1]).toEqual(
      expect.objectContaining({ id: 2, patientName: "Harry" })
    );
  });

  it("returns an error object on db exception", async () => {
    const container = {
      getDb() {
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
