import retreiveVisits from "./retreiveVisits";

describe("retreiveVisits", () => {
  it("returns a json object containing the calls", async () => {
    const container = {
      getDb() {
        return {
          any: jest.fn().mockReturnValue([
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
        };
      },
    };

    const { scheduledCalls, error } = await retreiveVisits(container);

    expect(error).toBeNull();
    expect(scheduledCalls).toHaveLength(2);
    expect(scheduledCalls[0]).toEqual(expect.objectContaining({ id: 1 }));
    expect(scheduledCalls[1]).toEqual(expect.objectContaining({ id: 2 }));
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

    const { error } = await retreiveVisits(container);
    expect(error).toBeDefined();
  });
});
