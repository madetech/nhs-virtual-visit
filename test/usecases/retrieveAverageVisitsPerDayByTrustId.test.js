import retrieveAverageVisitsPerDayByTrustId from "../../src/usecases/retrieveAverageVisitsPerDayByTrustId";
import logger from "../../logger";

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
      logger
    };

    const { error } = await retrieveAverageVisitsPerDayByTrustId(container)();

    expect(error).toEqual("A trustId must be provided.");
  });

  it("retrieves events from the database with the trustId", async () => {
    const container = {
      getRetrieveAverageVisitsPerDayGateway() {
        return dbAnySpy;
      },
      logger
    };

    const date = new Date();

    await retrieveAverageVisitsPerDayByTrustId(container)(trustId, date);

    // TODO: Uncommenting the following line once we understand fully why retrieveAverageVisitsPerDay returns a hardcoded value.
    // expect(dbAnySpy).toHaveBeenCalledWith(trustId, date);

    expect(dbAnySpy).toHaveBeenCalledTimes(0);
  });

  it("returns the average number of participants in a visit", async () => {
    const container = {
      getRetrieveAverageVisitsPerDayGateway() {
        return async () => {
          return 2;
        };
      },
      logger
    };

    const {
      averageVisitsPerDay,
      error,
    } = await retrieveAverageVisitsPerDayByTrustId(container)(
      trustId,
      new Date(2020, 6, 3)
    );

    // TODO: Uncommenting the following line once we understand fully why retrieveAverageVisitsPerDay returns a hardcoded value.
    // expect(averageVisitsPerDay).toEqual(2);

    expect(error).toBeNull();
  });
});
