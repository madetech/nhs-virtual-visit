import retrieveAverageVisitsPerDay from "./retrieveAverageVisitsPerDay";

describe("retrieveAverageVisitsPerDay", () => {
  const trustId = 1;

  let dbAnySpy;

  beforeEach(() => {
    dbAnySpy = jest.fn().mockResolvedValue([{ average_visits_per_day: "3.5" }]);
  });

  it("returns an error if a trustId is not provided", async () => {
    const container = {
      async getDb() {
        return { any: dbAnySpy };
      },
    };

    const { error } = await retrieveAverageVisitsPerDay(container)();

    expect(error).toEqual("A trustId must be provided.");
  });

  it("retrieves events from the database with the trustId", async () => {
    const container = {
      async getDb() {
        return { any: dbAnySpy };
      },
    };

    await retrieveAverageVisitsPerDay(container)(trustId);

    expect(dbAnySpy).toHaveBeenCalledWith(expect.anything(), trustId);
  });

  it("returns the average number of participants in a visit", async () => {
    const container = {
      async getDb() {
        return { any: dbAnySpy };
      },
    };

    const { averageVisitsPerDay, error } = await retrieveAverageVisitsPerDay(
      container
    )(trustId);

    expect(averageVisitsPerDay).toEqual(3.5);
    expect(error).toBeNull();
  });
});
