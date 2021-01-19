import retrieveAverageVisitsPerDayByTrustId from "../../src/usecases/retrieveAverageVisitsPerDayByTrustId";

describe("retrieveAverageVisitsPerDay", () => {
  const trustId = 1;

  let dbAnySpy;

  beforeEach(() => {
    dbAnySpy = jest.fn().mockResolvedValue([
      { visits: "3", call_date: new Date(2020, 6, 1) },
      { visits: "2", call_date: new Date(2020, 6, 2) },
      { visits: "1", call_date: new Date(2020, 6, 3) },
    ]);
  });

  it("returns an error if a trustId is not provided", async () => {
    const container = {
      getRetrieveAverageVisitsPerDayGateway() {
        return dbAnySpy;
      },
    };

    const { error } = await retrieveAverageVisitsPerDayByTrustId(container)();

    expect(error).toEqual("A trustId must be provided.");
  });

  it("retrieves events from the database with the trustId", async () => {
    const container = {
      getRetrieveAverageVisitsPerDayGateway() {
        return dbAnySpy;
      },
    };

    const date = new Date();

    await retrieveAverageVisitsPerDayByTrustId(container)(trustId, date);

    expect(dbAnySpy).toHaveBeenCalledWith(trustId, date);
  });

  it("returns the average number of participants in a visit", async () => {
    const container = {
      getRetrieveAverageVisitsPerDayGateway() {
        return async () => { return 2; };
      },
    };

    const {
      averageVisitsPerDay,
      error,
    } = await retrieveAverageVisitsPerDayByTrustId(container)(
      trustId,
      new Date(2020, 6, 3)
    );

    expect(averageVisitsPerDay).toEqual(2);
    expect(error).toBeNull();
  });
});
